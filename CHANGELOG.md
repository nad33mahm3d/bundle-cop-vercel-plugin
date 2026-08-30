# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.3] - 2026-08-31

### Changed

- npm package `homepage` now points at https://bundle-cop.vercel.app/docs
- GitHub Actions publish workflow uses `actions/checkout@v5` and `actions/setup-node@v6` (avoids Node 20 runner deprecation warnings)

## [0.1.2] - 2026-08-30

### Changed

- Refresh npm package metadata: MIT LICENSE in published files, richer README, author / homepage / keywords aligned with GitHub

## Integration app (2026-08-30 → 2026-08-31)

Shipped on Vercel via `main` auto-deploy (not an npm semver bump).

### Added

- **Phase D:** OAuth install on `/setup`, Blob-backed per-install tokens, Checks/prod diffs via install token (falls back to `VERCEL_TOKEN`), uninstall cleanup webhook
- **Phase C:** Connectable integration Console assets (gallery images under `public/marketplace/`)
- Website docs (`/docs`), Privacy (`/privacy`), EULA (`/eula`), optimization guide
- SEO: `sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt`, Open Graph image, web manifest, JSON-LD, FAQ schema
- Vercel project linked to GitHub for production auto-deploy
- Site redesign (Geist, Vercel black/white aesthetic) + brand logo

### Removed

- Internal `Bundle-Cop-Plan.md` from the public repository

## [0.1.1] - 2026-08-30

### Added

- GitHub Release workflow that publishes `bundle-cop-vercel-plugin` to npm
- Correct repository / bugs / homepage metadata pointing at `nad33mahm3d/bundle-cop-vercel-plugin`

## [0.1.0] - 2026-08-30

### Added

- Initial Next.js adapter (`modifyConfig` + `onBuildComplete`)
- Bundle report generation, budget enforcement, attribution heuristics
- Optional private Vercel Blob upload
- Integration app (setup, dashboard, webhooks) and example app

[Unreleased]: https://github.com/nad33mahm3d/bundle-cop-vercel-plugin/compare/v0.1.3...HEAD
[0.1.3]: https://github.com/nad33mahm3d/bundle-cop-vercel-plugin/releases/tag/v0.1.3
[0.1.2]: https://github.com/nad33mahm3d/bundle-cop-vercel-plugin/releases/tag/v0.1.2
[0.1.1]: https://github.com/nad33mahm3d/bundle-cop-vercel-plugin/releases/tag/v0.1.1
[0.1.0]: https://github.com/nad33mahm3d/bundle-cop-vercel-plugin/releases/tag/v0.1.0
