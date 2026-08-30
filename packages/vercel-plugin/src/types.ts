export type ReportModule = {
  name: string
  size: number
  issuerPath?: string[]
  culpritFile?: string
  chain?: string[]
  suggestion?: string | null
}

export type ReportChunk = {
  name: string
  size: number
  route?: string
}

export type BundleReport = {
  version: 1
  createdAt: string
  commitSha: string | null
  totalBytes: number
  modules: ReportModule[]
  chunks: ReportChunk[]
  budgetResults?: BudgetResult[]
}

export type BudgetRule = {
  path: string
  maxSize: string
  enforce: 'warn' | 'error'
}

export type BundleCopConfig = {
  budgets?: BudgetRule[]
  ignore?: string[]
  githubComment?: boolean
  suggestions?: boolean
}

export type BudgetResult = {
  path: string
  maxBytes: number
  actualBytes: number
  enforce: 'warn' | 'error'
  exceeded: boolean
}

export type IssuerEntry = {
  name?: string
  path?: string
}

export type WebpackModuleLike = {
  name: string
  size?: number
  gzipSize?: number
  issuerPath?: IssuerEntry[] | string[]
}
