import { join } from 'node:path'
import {
  checkBudgets,
  enforceBudgets,
  loadConfig,
} from './budgets.js'
import { findNextDir } from './find-next-dir.js'
import { parseStats } from './parser.js'
import { uploadReport, writeLocalReport } from './uploader.js'
import type { BundleReport } from './types.js'

export type {
  BundleReport,
  BundleCopConfig,
  BudgetResult,
  ReportModule,
  ReportChunk,
} from './types.js'

export { findCulprit, suggestAlternative } from './attribution.js'
export { parseSize, formatBytes, checkBudgets, loadConfig } from './budgets.js'
export { parseStats } from './parser.js'
export { findNextDir } from './find-next-dir.js'

type ModifyConfigCtx = {
  phase: string
  nextVersion: string
  projectDir?: string
}

type OnBuildCompleteCtx = {
  projectDir: string
  repoRoot: string
  distDir: string
  buildId: string
  nextVersion: string
  config?: unknown
  outputs?: unknown
  routing?: unknown
}

async function runBundleCop(ctx: {
  projectDir: string
  distDir?: string
}): Promise<BundleReport> {
  const nextDir =
    findNextDir(ctx.projectDir, ctx.distDir) ||
    join(ctx.projectDir, '.next')

  const config = loadConfig(ctx.projectDir)
  const report = await parseStats({
    nextDir,
    projectDir: ctx.projectDir,
    commitSha:
      process.env.VERCEL_GIT_COMMIT_SHA ||
      process.env.GITHUB_SHA ||
      null,
    withSuggestions: config.suggestions !== false,
  })

  const budgetResults = checkBudgets(report, config)
  report.budgetResults = budgetResults

  writeLocalReport(ctx.projectDir, report)
  await uploadReport(report)

  enforceBudgets(budgetResults)
  console.log(
    `[bundle-cop] Report total=${report.totalBytes}B modules=${report.modules.length} chunks=${report.chunks.length}`,
  )
  return report
}

/**
 * Next.js Adapter for Bundle Cop.
 * Configure via: adapterPath: require.resolve('bundle-cop-vercel-plugin/adapter')
 */
const adapter = {
  name: 'bundle-cop',

  async modifyConfig(
    config: Record<string, unknown>,
    ctx: ModifyConfigCtx,
  ): Promise<Record<string, unknown>> {
    if (ctx.phase !== 'phase-production-build') {
      return config
    }

    // Hint Next / tooling that analysis output is desired without editing next.config on disk.
    if (!process.env.BUNDLE_COP_ANALYZE) {
      process.env.BUNDLE_COP_ANALYZE = '1'
    }

    // Preserve any existing experimental flags; do not force webpack-only plugins.
    const experimental =
      typeof config.experimental === 'object' && config.experimental
        ? { ...(config.experimental as Record<string, unknown>) }
        : {}

    return {
      ...config,
      experimental,
    }
  },

  async onBuildComplete(ctx: OnBuildCompleteCtx): Promise<void> {
    const started = Date.now()
    try {
      await runBundleCop({
        projectDir: ctx.projectDir || ctx.repoRoot,
        distDir: ctx.distDir,
      })
    } catch (error) {
      // Re-throw budget failures so the build fails; soft-fail other errors.
      if (
        error instanceof Error &&
        error.message.startsWith('[bundle-cop] Budget exceeded')
      ) {
        throw error
      }
      console.warn('[bundle-cop] onBuildComplete error:', error)
    } finally {
      console.log(`[bundle-cop] finished in ${Date.now() - started}ms`)
    }
  },
}

export default adapter
export { adapter, runBundleCop }
