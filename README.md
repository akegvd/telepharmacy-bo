# Telepharmacy Task Dashboard

A dashboard pharmacists use to manage telepharmacy consultation requests: review the queue, open a request, and move it through `new → in_progress → completed`.

Next.js 16 (App Router), React 19, TypeScript, MUI, TanStack Query.

**Live demo:** [telepharmacy-bo.vercel.app](https://telepharmacy-bo.vercel.app/)

## Prerequisites

Node.js `24.19.0` (see `.nvmrc` — with [nvm](https://github.com/nvm-sh/nvm), run `nvm use`).

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No other process is needed — the app serves its own mock API from `src/app/api/tasks` (seeded from `db.json`), and `NEXT_PUBLIC_API_URL` defaults to `/api`.

<details>
<summary>Optional: use json-server instead</summary>

```bash
npx json-server --watch db.json --port 4000
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_URL=http://localhost:4000`.

</details>

## How the mock API works on Vercel

Vercel only runs the Next.js app — there is no `json-server` process to talk to. Instead, the route handlers under `src/app/api/tasks` serve `db.json`'s rows (bad fields included) from an in-memory store, matching the `GET /tasks`, `GET /tasks/:id`, `PATCH /tasks/:id` shape json-server would give you. Since `NEXT_PUBLIC_API_URL` defaults to `/api`, the same code path works locally and on the deployed demo.

The store is a plain array in module scope (`_lib/tasksStore.ts`), so it is a mock, not a database: a status change persists only while that serverless instance stays warm, and resets on the next cold start or deploy.

## Dev API control panel

A sticky panel in the bottom-right corner reports the API the app is talking to (base URL, tasks currently in view, whether a fetch is in flight) and lets you drive the in-memory store:

- **Add random task** — appends a generated task stamped with the current time.
- **Reset from db.json** — throws away everything added or patched and re-seeds from `db.json`.

Both the panel and the endpoints behind it are off unless `NEXT_PUBLIC_ENABLE_DEV_API_CONTROLS` is exactly `true`, in every environment. `.env.example` sets it for local work; on Vercel, add it under Project Settings → Environment Variables and redeploy, since `NEXT_PUBLIC_*` values are baked in at build time.

The panel talks to the built-in mock API, so it needs `NEXT_PUBLIC_API_URL` on its default `/api`; json-server has no reset endpoint.

## Other commands

```bash
npm test             # jest, run once
npm run test:watch   # watch mode
npm run lint         # eslint
npm run storybook    # storybook at http://localhost:6006
npm run build        # production build
npm start            # serve the production build
```

Lint and tests also run automatically on `git push` (Husky `pre-push` hook). Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/), enforced by commitlint.

## What I'd improve with more time

- **Consistent component responsibilities.** Settle on one rule for where data fetching and state live — the page-level component owns them, everything below it stays presentational — and apply it across every module.
- **Theme config and a design system.** Replace the mostly-default MUI theme with real design tokens (spacing scale, typography, palette, component overrides) so screens stay visually consistent as the app grows.
- **Type and interface hygiene.** Tighten where types and interfaces are declared, cut the near-duplicate shapes by reusing shared ones, and make the naming convention uniform across every module.
- **Performance on large datasets.** The task list renders every row; with thousands of tasks it needs virtual scrolling (or server-side pagination) to stay responsive.
- **Sorting on the list.** User-selectable sort order is the obvious answer, but a dashboard rarely needs to be that powerful — the better version is to learn what admins actually triage on and ship a sensible fixed order for that.
- **Stricter ESLint and a shared `.vscode` config.** Committed editor settings and recommended extensions so formatting and lint-on-save behave identically for everyone on the team.
- **Agent skills committed to the repo.** Project-specific AI agent skills and rules kept in version control, so assistants follow the same conventions as the team instead of each developer configuring their own.
- **Snapshot tests.** Only `StatusChip` has one today; extending snapshots to the rest of the components would catch unintended markup changes during refactors.
- **End-to-end tests.** A Playwright suite covering the real flows — filter the queue, open a task, advance its status — on top of the existing unit and component tests.
- **User feedback and A/B testing.** Collect feedback from the pharmacists actually using the queue and A/B test the triage layout, rather than guessing at what speeds them up.
- **Generic edge-case UI.** Promote the loading, empty, error, and no-permission states into shared components other modules can reuse instead of re-implementing per screen.
- **Static export deployment.** Move the app to Next.js `output: 'export'` and serve it from S3/GCS behind nginx or Apache, cutting the cost of running a Node server. (The current structure already avoids dynamic route segments with this in mind.)
- **A Makefile.** Wrap setup, dev, test, and build behind `make` targets so anyone can start the project without knowing the Node toolchain.

## More

- [`PROJECT_STRUCTURE.md`](./PROJECT_STRUCTURE.md) — folder layout and conventions
- [`TASK.md`](./TASK.md) — the original brief
