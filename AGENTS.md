<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project Conventions

- Node.js version is pinned to `24.19.0` (see `.nvmrc` and the `engines` field in `package.json`).
- Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/) (`<type>(<scope>): <subject>`), enforced by commitlint via a Husky `commit-msg` hook. Config: `commitlint.config.js`.
- Tests use Jest + React Testing Library (`jest.config.ts`, configured via `next/jest`). Test files live in `__tests__` directories next to the code they cover. `npm run lint` and `npm test` both run on `git push` via the Husky `pre-push` hook.
- Code under `src/` follows the domain-driven layout defined in [`PROJECT_STRUCTURE.md`](./PROJECT_STRUCTURE.md) — `src/app` holds routes only (delegating to modules), business/domain code lives in `src/modules/[domain]/{components,hooks,services,types,utils}`, generic non-domain code lives in `src/shared/`, and the MUI theme lives in `src/theme/`. Read that file before adding or reorganizing files.
