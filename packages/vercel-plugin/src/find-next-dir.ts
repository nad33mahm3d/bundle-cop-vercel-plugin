import { existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'coverage',
  '.turbo',
  '.vercel',
])

/**
 * Find a `.next` directory, preferring `preferredDir` then walking ancestors / children.
 * Handles Turborepo layouts like `apps/web/.next`.
 */
export function findNextDir(
  startDir: string,
  preferredDir?: string,
): string | null {
  if (preferredDir && existsSync(preferredDir)) {
    return preferredDir
  }

  const direct = join(startDir, '.next')
  if (existsSync(direct)) {
    return direct
  }

  // Walk up a few levels looking for nested app .next folders
  let current = startDir
  for (let i = 0; i < 5; i++) {
    const found = walkForNext(current, 4)
    if (found) return found
    const parent = join(current, '..')
    if (parent === current) break
    current = parent
  }

  return null
}

function walkForNext(dir: string, depth: number): string | null {
  if (depth < 0) return null
  let entries: string[]
  try {
    entries = readdirSync(dir)
  } catch {
    return null
  }

  const nested = join(dir, '.next')
  if (existsSync(nested)) return nested

  for (const entry of entries) {
    if (SKIP_DIRS.has(entry) || entry.startsWith('.')) continue
    const full = join(dir, entry)
    try {
      if (!statSync(full).isDirectory()) continue
    } catch {
      continue
    }
    const found = walkForNext(full, depth - 1)
    if (found) return found
  }
  return null
}
