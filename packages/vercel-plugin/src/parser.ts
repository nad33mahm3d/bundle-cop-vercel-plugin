import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
} from 'node:fs'
import { join, relative } from 'node:path'
import { findCulprit, suggestAlternative } from './attribution.js'
import type {
  BundleReport,
  ReportChunk,
  ReportModule,
  WebpackModuleLike,
} from './types.js'

type ParseOptions = {
  nextDir: string
  projectDir?: string
  commitSha?: string | null
  withSuggestions?: boolean
}

const KNOWN_HEAVY = [
  'moment',
  'lodash',
  'lodash-es',
  'date-fns',
  'react-icons',
  'rxjs',
  'antd',
  'chart.js',
  'recharts',
]

export async function parseStats(options: ParseOptions): Promise<BundleReport> {
  const {
    nextDir,
    projectDir,
    commitSha = null,
    withSuggestions = true,
  } = options

  const fromDiagnostics = tryParseDiagnostics(nextDir, withSuggestions)
  if (fromDiagnostics && fromDiagnostics.modules.length > 0) {
    return finalize(fromDiagnostics, commitSha)
  }

  const fromAnalyze = tryParseAnalyzeClient(nextDir, withSuggestions)
  if (fromAnalyze && fromAnalyze.modules.length > 0) {
    return finalize(fromAnalyze, commitSha)
  }

  const fromChunks = parseChunkFallback(nextDir)
  const fromRouteStats = parseRouteBundleStats(nextDir)
  const chunks =
    fromRouteStats.chunks.length > 0 ? fromRouteStats.chunks : fromChunks.chunks
  const totalBytes =
    fromRouteStats.totalBytes ||
    fromChunks.totalBytes ||
    chunks.reduce((s, c) => s + c.size, 0)

  const modules = enrichWithKnownPackages({
    nextDir,
    projectDir: projectDir || join(nextDir, '..'),
    withSuggestions,
  })

  return finalize(
    {
      totalBytes,
      modules: sortBySize(modules),
      chunks: sortBySize(chunks),
    },
    commitSha,
  )
}

function finalize(
  partial: Omit<BundleReport, 'version' | 'createdAt' | 'commitSha'>,
  commitSha: string | null,
): BundleReport {
  return {
    version: 1,
    createdAt: new Date().toISOString(),
    commitSha,
    ...partial,
  }
}

function tryParseDiagnostics(
  nextDir: string,
  withSuggestions: boolean,
): Omit<BundleReport, 'version' | 'createdAt' | 'commitSha'> | null {
  const dir = join(nextDir, 'diagnostics', 'analyze')
  if (!existsSync(dir)) return null

  const modules: ReportModule[] = []
  const chunks: ReportChunk[] = []

  for (const file of listJsonFiles(dir)) {
    try {
      const data = JSON.parse(readFileSync(file, 'utf8')) as unknown
      absorbStats(data, modules, chunks, withSuggestions)
    } catch {
      // skip
    }
  }

  if (modules.length === 0 && chunks.length === 0) return null
  const totalBytes =
    chunks.reduce((s, c) => s + c.size, 0) ||
    modules.reduce((s, m) => s + m.size, 0)

  return { totalBytes, modules: sortBySize(modules), chunks: sortBySize(chunks) }
}

function tryParseAnalyzeClient(
  nextDir: string,
  withSuggestions: boolean,
): Omit<BundleReport, 'version' | 'createdAt' | 'commitSha'> | null {
  const clientPath = join(nextDir, 'analyze', 'client.json')
  if (!existsSync(clientPath)) return null
  try {
    const data = JSON.parse(readFileSync(clientPath, 'utf8')) as unknown
    const modules: ReportModule[] = []
    const chunks: ReportChunk[] = []
    absorbStats(data, modules, chunks, withSuggestions)
    const totalBytes =
      chunks.reduce((s, c) => s + c.size, 0) ||
      modules.reduce((s, m) => s + m.size, 0)
    return {
      totalBytes,
      modules: sortBySize(modules),
      chunks: sortBySize(chunks),
    }
  } catch {
    return null
  }
}

function parseRouteBundleStats(
  nextDir: string,
): Omit<BundleReport, 'version' | 'createdAt' | 'commitSha'> {
  const path = join(nextDir, 'diagnostics', 'route-bundle-stats.json')
  if (!existsSync(path)) {
    return { totalBytes: 0, modules: [], chunks: [] }
  }
  try {
    const rows = JSON.parse(readFileSync(path, 'utf8')) as Array<{
      route?: string
      firstLoadUncompressedJsBytes?: number
    }>
    const chunks: ReportChunk[] = rows.map((row) => ({
      name: row.route || 'unknown',
      size: Number(row.firstLoadUncompressedJsBytes || 0),
      route: row.route,
    }))
    const totalBytes = Math.max(...chunks.map((c) => c.size), 0)
    return { totalBytes, modules: [], chunks: sortBySize(chunks) }
  } catch {
    return { totalBytes: 0, modules: [], chunks: [] }
  }
}

function parseChunkFallback(
  nextDir: string,
): Omit<BundleReport, 'version' | 'createdAt' | 'commitSha'> {
  const chunksDir = join(nextDir, 'static', 'chunks')
  const chunks: ReportChunk[] = []

  if (existsSync(chunksDir)) {
    for (const file of walkFiles(chunksDir)) {
      if (!file.endsWith('.js')) continue
      try {
        const size = statSync(file).size
        const name = file.slice(chunksDir.length + 1)
        chunks.push({ name, size, route: guessRoute(name) })
      } catch {
        // ignore
      }
    }
  }

  for (const manifestName of ['build-manifest.json', 'app-build-manifest.json']) {
    const manifestPath = join(nextDir, manifestName)
    if (!existsSync(manifestPath)) continue
    try {
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
        pages?: Record<string, string[]>
      }
      for (const [route, files] of Object.entries(manifest.pages ?? {})) {
        for (const file of files) {
          const abs = join(nextDir, file.replace(/^\//, ''))
          if (!existsSync(abs)) continue
          const size = statSync(abs).size
          if (!chunks.some((c) => c.name === file)) {
            chunks.push({ name: file, size, route })
          }
        }
      }
    } catch {
      // ignore
    }
  }

  const totalBytes = chunks.reduce((s, c) => s + c.size, 0)
  return { totalBytes, modules: [], chunks: sortBySize(chunks) }
}

/**
 * Turbopack builds often lack webpack module graphs. Detect known heavy
 * packages in emitted chunks and attribute them to importing source files.
 */
function enrichWithKnownPackages(opts: {
  nextDir: string
  projectDir: string
  withSuggestions: boolean
}): ReportModule[] {
  const chunksDir = join(opts.nextDir, 'static', 'chunks')
  const serverDir = join(opts.nextDir, 'server')
  const scanDirs = [chunksDir, serverDir].filter((d) => existsSync(d))
  if (scanDirs.length === 0) return []

  const present = new Set<string>()
  for (const dir of scanDirs) {
    for (const file of walkFiles(dir)) {
      if (!file.endsWith('.js')) continue
      let text = ''
      try {
        const buf = readFileSync(file)
        text = buf.subarray(0, Math.min(buf.length, 2_000_000)).toString('utf8')
      } catch {
        continue
      }
      for (const pkg of KNOWN_HEAVY) {
        if (
          text.includes(`node_modules/${pkg}`) ||
          text.includes(`/${pkg}/`) ||
          text.includes(`"${pkg}"`) ||
          text.includes(`'${pkg}'`)
        ) {
          present.add(pkg)
        }
      }
    }
  }

  const modules: ReportModule[] = []
  for (const pkg of present) {
    const size = estimatePackageChunkSize(scanDirs, pkg)
    const culpritFile = findImportCulprit(opts.projectDir, pkg) || 'unknown'
    modules.push({
      name: pkg,
      size: size || 50 * 1024,
      culpritFile,
      chain: [pkg, culpritFile],
      issuerPath: [pkg, culpritFile],
      suggestion: opts.withSuggestions ? suggestAlternative(pkg) : null,
    })
  }
  return modules
}

function estimatePackageChunkSize(dirs: string[], pkg: string): number {
  let best = 0
  for (const dir of dirs) {
    for (const file of walkFiles(dir)) {
      if (!file.endsWith('.js')) continue
      try {
        const buf = readFileSync(file)
        const text = buf
          .subarray(0, Math.min(buf.length, 500_000))
          .toString('utf8')
        if (text.includes(pkg)) {
          best = Math.max(best, statSync(file).size)
        }
      } catch {
        // ignore
      }
    }
  }
  return best
}

function findImportCulprit(projectDir: string, pkg: string): string | null {
  const roots = ['app', 'pages', 'src', 'components']
  for (const root of roots) {
    const dir = join(projectDir, root)
    if (!existsSync(dir)) continue
    const hit = searchImport(dir, pkg, projectDir, 6)
    if (hit) return hit
  }
  return null
}

function searchImport(
  dir: string,
  pkg: string,
  projectDir: string,
  depth: number,
): string | null {
  if (depth < 0) return null
  let entries: string[]
  try {
    entries = readdirSync(dir)
  } catch {
    return null
  }
  for (const entry of entries) {
    if (entry === 'node_modules' || entry.startsWith('.')) continue
    const full = join(dir, entry)
    let st
    try {
      st = statSync(full)
    } catch {
      continue
    }
    if (st.isDirectory()) {
      const found = searchImport(full, pkg, projectDir, depth - 1)
      if (found) return found
      continue
    }
    if (!/\.(tsx?|jsx?|mjs|cjs)$/.test(entry)) continue
    try {
      const text = readFileSync(full, 'utf8')
      if (
        text.includes(`from '${pkg}'`) ||
        text.includes(`from "${pkg}"`) ||
        text.includes(`require('${pkg}')`) ||
        text.includes(`require("${pkg}")`) ||
        text.includes(`from '${pkg}/`) ||
        text.includes(`from "${pkg}/`)
      ) {
        return relative(projectDir, full).replace(/\\/g, '/')
      }
    } catch {
      // ignore
    }
  }
  return null
}

function absorbStats(
  data: unknown,
  modules: ReportModule[],
  chunks: ReportChunk[],
  withSuggestions: boolean,
): void {
  if (!data || typeof data !== 'object') return
  const root = data as Record<string, unknown>

  if (Array.isArray(root.chunks)) {
    for (const chunk of root.chunks as Array<Record<string, unknown>>) {
      chunks.push({
        name: String(chunk.name ?? chunk.id ?? 'chunk'),
        size: Number(chunk.size ?? chunk.parsedSize ?? 0),
        route: typeof chunk.route === 'string' ? chunk.route : undefined,
      })
    }
  }

  const moduleList: WebpackModuleLike[] = []
  collectModules(root.modules, moduleList)
  collectModules((root as { tree?: unknown }).tree, moduleList)

  for (const mod of moduleList) {
    const size = Number(mod.size ?? mod.gzipSize ?? 0)
    if (!mod.name || size <= 0) continue
    const { culpritFile, chain } = findCulprit(mod)
    modules.push({
      name: mod.name,
      size,
      issuerPath: chain,
      culpritFile,
      chain,
      suggestion: withSuggestions ? suggestAlternative(mod.name) : null,
    })
  }
}

function collectModules(node: unknown, out: WebpackModuleLike[]): void {
  if (!node) return
  if (Array.isArray(node)) {
    for (const item of node) collectModules(item, out)
    return
  }
  if (typeof node !== 'object') return
  const obj = node as Record<string, unknown>
  if (typeof obj.name === 'string' && (obj.size != null || obj.gzipSize != null)) {
    out.push(obj as unknown as WebpackModuleLike)
  }
  if (Array.isArray(obj.children)) collectModules(obj.children, out)
  if (Array.isArray(obj.modules)) collectModules(obj.modules, out)
}

function listJsonFiles(dir: string): string[] {
  return walkFiles(dir).filter((f) => f.endsWith('.json'))
}

function walkFiles(dir: string): string[] {
  const out: string[] = []
  let entries: string[]
  try {
    entries = readdirSync(dir)
  } catch {
    return out
  }
  for (const entry of entries) {
    const full = join(dir, entry)
    try {
      const st = statSync(full)
      if (st.isDirectory()) out.push(...walkFiles(full))
      else out.push(full)
    } catch {
      // ignore
    }
  }
  return out
}

function guessRoute(chunkName: string): string | undefined {
  const match = chunkName.match(/(?:^|\/)app(\/.*)\/(?:page|layout|route)/)
  if (match?.[1]) return match[1] || '/'
  return undefined
}

function sortBySize<T extends { size: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.size - a.size)
}
