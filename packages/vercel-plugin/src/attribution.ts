import type { IssuerEntry, WebpackModuleLike } from './types.js'

function isUserFile(filePath: string): boolean {
  const normalized = filePath.replace(/\\/g, '/')
  if (!normalized) return false
  if (normalized.includes('node_modules/')) return false
  if (normalized.includes('/.next/')) return false
  if (normalized.startsWith('.next/')) return false
  return true
}

function toPath(entry: IssuerEntry | string): string {
  if (typeof entry === 'string') return entry
  return entry.path || entry.name || ''
}

function toName(entry: IssuerEntry | string): string {
  if (typeof entry === 'string') return entry
  return entry.name || entry.path || ''
}

/**
 * Walk issuerPath backwards until the first file outside node_modules / .next.
 */
export function findCulprit(module: WebpackModuleLike): {
  culpritFile: string
  chain: string[]
} {
  const raw = module.issuerPath ?? []
  const chain = raw.map(toName).filter(Boolean)

  for (let i = raw.length - 1; i >= 0; i--) {
    const path = toPath(raw[i]!)
    if (isUserFile(path)) {
      return { culpritFile: path, chain }
    }
  }

  // Fall back to module name if it looks like a user file
  if (isUserFile(module.name)) {
    return { culpritFile: module.name, chain }
  }

  return { culpritFile: 'unknown', chain }
}

const ALTERNATIVES: Record<string, string> = {
  moment: 'date-fns (save ~270kb) -> npm i date-fns',
  lodash: 'lodash-es + tree-shake or individual imports',
  'react-icons': 'import directly: react-icons/fa/FaIcon',
  'date-fns': 'use subpath imports: date-fns/format',
}

export function suggestAlternative(moduleName: string): string | null {
  const normalized = moduleName.replace(/\\/g, '/').toLowerCase()
  for (const [key, suggestion] of Object.entries(ALTERNATIVES)) {
    if (
      normalized === key ||
      normalized.includes(`node_modules/${key}/`) ||
      normalized.startsWith(`${key}/`) ||
      normalized.includes(`/${key}/`)
    ) {
      return suggestion
    }
  }
  return null
}
