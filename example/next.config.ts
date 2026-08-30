import type { NextConfig } from 'next'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const nextConfig: NextConfig = {
  // Use the CJS adapter entry so Next's interopDefault sees onBuildComplete
  adapterPath: require.resolve('bundle-cop-vercel-plugin/adapter'),
}

export default nextConfig
