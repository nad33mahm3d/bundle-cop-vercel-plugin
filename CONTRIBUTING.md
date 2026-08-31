# Contributing to Bundle Cop

Thanks for your interest in contributing. This repo is a **pnpm monorepo**:

| Path | Role |
|------|------|
| [`packages/vercel-plugin`](./packages/vercel-plugin) | npm package `bundle-cop-vercel-plugin` (Next.js adapter) |
| Repo root (`app/`, `lib/`, …) | Vercel integration app (setup, dashboard, webhooks) |
| [`example`](./example) | Demo Next app for attribution / budget checks |

Docs: [https://bundle-cop.vercel.app/docs](https://bundle-cop.vercel.app/docs)

## Code of conduct

By participating, you agree to follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Development setup

Requirements: **Node.js 20+**, **pnpm 10.6.5+** (see root `packageManager`).

```bash
pnpm install
pnpm build:plugin   # build the adapter
pnpm typecheck
pnpm build          # adapter + integration app
pnpm --filter @bundle-cop/example build
pnpm dev            # integration app at http://localhost:3000
```

Copy [`.env.example`](./.env.example) to `.env.local` for local webhook / Blob work.

## Pull requests

1. Open an issue first for larger changes when practical.
2. Keep PRs focused; match existing style and avoid unrelated refactors.
3. Run `pnpm typecheck` and relevant builds before requesting review.
4. For user-facing changes, update [CHANGELOG.md](./CHANGELOG.md) under `[Unreleased]`.
5. Use the PR template checklist.

## Reporting bugs and features

Use GitHub Issues (bug report / feature request templates). Include adapter version (`bundle-cop-vercel-plugin`), Next.js version, and a minimal repro when possible.

## Security

Do **not** open public issues for security vulnerabilities. See [SECURITY.md](./.github/SECURITY.md).

## License

Contributions are licensed under the [MIT License](./LICENSE).
