import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import type { BundleCopConfig, BudgetResult, BundleReport } from './types.js'

const SIZE_RE = /^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)?$/i

export function parseSize(input: string): number {
  const match = input.trim().match(SIZE_RE)
  if (!match) {
    throw new Error(`Invalid size: ${input}`)
  }
  const value = Number(match[1])
  const unit = (match[2] || 'b').toLowerCase()
  switch (unit) {
    case 'b':
      return value
    case 'kb':
      return Math.round(value * 1024)
    case 'mb':
      return Math.round(value * 1024 * 1024)
    case 'gb':
      return Math.round(value * 1024 * 1024 * 1024)
    default:
      throw new Error(`Invalid size unit: ${unit}`)
  }
}

export function loadConfig(projectDir: string): BundleCopConfig {
  const path = join(projectDir, 'bundle-cop.config.json')
  if (!existsSync(path)) {
    return {
      budgets: [],
      ignore: [],
      githubComment: true,
      suggestions: true,
    }
  }
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as BundleCopConfig
  } catch (error) {
    console.warn('[bundle-cop] Failed to parse bundle-cop.config.json:', error)
    return { budgets: [], suggestions: true, githubComment: true }
  }
}

export function checkBudgets(
  report: BundleReport,
  config: BundleCopConfig,
): BudgetResult[] {
  const budgets = config.budgets ?? []
  return budgets.map((rule) => {
    const maxBytes = parseSize(rule.maxSize)
    // Route-aware sizing is best-effort: match chunks by route prefix, else use total
    const matching = report.chunks.filter((chunk) => {
      if (rule.path === '/*' || rule.path === '/') return true
      const route = chunk.route || ''
      return route === rule.path || route.startsWith(rule.path.replace(/\/$/, ''))
    })
    const actualBytes =
      matching.length > 0
        ? matching.reduce((sum, c) => sum + c.size, 0)
        : report.totalBytes

    return {
      path: rule.path,
      maxBytes,
      actualBytes,
      enforce: rule.enforce,
      exceeded: actualBytes > maxBytes,
    }
  })
}

/**
 * Throws if any error-enforced budget is exceeded (fails the build).
 */
export function enforceBudgets(results: BudgetResult[]): void {
  const errors = results.filter((r) => r.exceeded && r.enforce === 'error')
  for (const warn of results.filter((r) => r.exceeded && r.enforce === 'warn')) {
    console.warn(
      `[bundle-cop] Budget warn ${warn.path}: ${formatBytes(warn.actualBytes)} > ${formatBytes(warn.maxBytes)}`,
    )
  }
  if (errors.length === 0) return

  const details = errors
    .map(
      (e) =>
        `${e.path}: ${formatBytes(e.actualBytes)} exceeds ${formatBytes(e.maxBytes)}`,
    )
    .join('; ')
  throw new Error(`[bundle-cop] Budget exceeded — ${details}`)
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} kB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
