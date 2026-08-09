<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project Conventions

- Node.js version is pinned to `24.19.0` (see `.nvmrc` and the `engines` field in `package.json`).
- Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/) (`<type>(<scope>): <subject>`), enforced by commitlint via a Husky `commit-msg` hook. Config: `commitlint.config.js`.
- Tests use Jest + React Testing Library (`jest.config.ts`, configured via `next/jest`). Test files sit directly beside the file they cover as `Component.test.tsx` / `useThing.test.ts` (same placement as `.stories.tsx`) — no `__tests__` subfolder. `npm run lint` and `npm test` both run on `git push` via the Husky `pre-push` hook. Every component and hook has a test — keep that up when adding new ones. Components using `next/navigation` mock it with `jest.mock`; components using TanStack Query wrap in a fresh `QueryClientProvider` and mock `modules/tasks/services/taskApi`, not `fetch`.
- Component stories live next to the component as `Component.stories.tsx`, using `@storybook/nextjs-vite`. `.storybook/preview.tsx` wraps every story in the app's real MUI theme (`AppThemeProvider`) and sets `parameters.nextjs.appDirectory: true` globally — don't re-wrap or repeat that per story. Every component has a story; TanStack Query-backed ones (`TaskDetailContent`, `Dashboard`) seed the cache via the `withQueryClient` decorator (`modules/tasks/test-utils/storyQueryClient.tsx`) instead of hitting a real API. Shared test fixtures live in `modules/tasks/test-utils/taskFixtures.ts` (`makeTask`) — reuse it rather than redefining task fixtures per file.
- Code under `src/` follows the domain-driven layout defined in [`PROJECT_STRUCTURE.md`](./PROJECT_STRUCTURE.md) — `src/app` holds routes only (delegating to modules), business/domain code lives in `src/modules/[domain]/{components,hooks,services,types,utils}`, generic non-domain code lives in `src/shared/`, and the MUI theme lives in `src/theme/`. Read that file before adding or reorganizing files.
