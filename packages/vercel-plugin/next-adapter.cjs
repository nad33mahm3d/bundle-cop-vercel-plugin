'use strict'

/**
 * Next.js loads adapters via `import(pathToFileURL(require.resolve(...)))`
 * and then `interopDefault`. Exporting the adapter object as `module.exports`
 * (not a namespace with `.default`) makes `onBuildComplete` available.
 */
const mod = require('./dist/index.cjs')
module.exports = mod.adapter || mod.default || mod
