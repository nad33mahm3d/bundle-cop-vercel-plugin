# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Phase D: Vercel OAuth install exchange on `/setup`, Blob-backed per-install tokens, Checks/diffs via install token, uninstall cleanup webhook
- Website documentation at `/docs`, Privacy Policy at `/privacy`, and EULA at `/eula`
- Shared site nav/footer with GitHub and npm links
- Vercel project linked to GitHub for production auto-deploy on `main`
- SEO: `sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt`, Open Graph image, web manifest, JSON-LD
- Redesigned landing with brand-first hero, report visual, and motion

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

[Unreleased]: https://github.com/nad33mahm3d/bundle-cop-vercel-plugin/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/nad33mahm3d/bundle-cop-vercel-plugin/releases/tag/v0.1.1
[0.1.0]: https://github.com/nad33mahm3d/bundle-cop-vercel-plugin/releases/tag/v0.1.0
