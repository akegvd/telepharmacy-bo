# Telepharmacy Task Dashboard

A dashboard pharmacists use to manage incoming telepharmacy consultation requests: review the queue, open a request for details, and move it through `new → in_progress → completed`.

Built with Next.js 16 (App Router), React 19, TypeScript, MUI, and TanStack Query. See [`TASK.md`](./TASK.md) for the original brief.

**Live demo:** [telepharmacy-bo.vercel.app](https://telepharmacy-bo.vercel.app/)

## Prerequisites

- Node.js `24.19.0` (see `.nvmrc`). If you use [nvm](https://github.com/nvm-sh/nvm), run `nvm use`.

## Running it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). By default the app talks to its own built-in mock API at `/api/tasks` — see [How the mock API is reachable](#how-the-mock-api-is-reachable) below — so this is the only process you need to run.

<details>
<summary>Using json-server instead</summary>

```bash
npx json-server --watch db.json --port 4000
```

Then point the app at it via `NEXT_PUBLIC_API_URL` (see `.env.example` — copy it to `.env.local` and set `NEXT_PUBLIC_API_URL=http://localhost:4000`).

</details>

## How it's structured

Follows the domain-driven layout in [`PROJECT_STRUCTURE.md`](./PROJECT_STRUCTURE.md): routes stay thin, business logic lives in a domain module.

```
src/
  app/
    page.tsx                    dashboard route (wraps the client Dashboard in Suspense)
    api/tasks/route.ts          mock API: GET (list)
    api/tasks/[id]/route.ts     mock API: GET (detail), PATCH (status)
    api/tasks/_lib/tasksStore.ts  in-memory store backing the mock API, seeded from db.json
    providers.tsx               composition root: QueryClientProvider + AppThemeProvider
  modules/dashboard/           the "dashboard" bounded context — all task domain logic
    components/                 Dashboard, TaskList, TaskDetailContent, FilterBar, ...
    constants/                  status/service-type label, color and next-status lookup maps
    enums/dataIssue.ts          the data problems a task can be flagged with
    types/taskStatus.ts         TStatusColor — the palette colors a status can render as
    types/utils/transforms/     ITransformTaskItemResponse / ITransformTaskListResponse (transform return types)
    utils/
      transforms/transformTaskListResponse.ts  repairs/flags bad seed data at the API boundary
      filterTaskList.ts         pure search/service/status filter, unit tested
      taskDisplay.ts            lookups with fallbacks for unknown values, date formatting
  shared/                       generic, no business logic
    components/Modal.tsx        dialog wrapper, closed via an onClose prop
    constants/apiEndpoints/tasks.ts  task endpoint path constants
    hooks/useDebouncedValue.ts
    hooks/api/tasks/             generic useQuery/useMutation wrappers, generic over transformResponse
    services/axios.ts           shared axios instance, wired through the interceptor
    services/interceptor.ts     response interceptor: normalizes failures into ApiError
    services/api/tasks.ts       raw task API calls — no transform, just typed axios wrappers
  theme/                        MUI theme + AppThemeProvider
```

**Detail view as a modal over client-side state.** Clicking a row pushes `?taskId=` onto the current dashboard URL (shareable, preserves filters) and `Dashboard` renders `TaskDetailContent` inside a `Modal` on top of the list; closing removes the param. The route stays static — no dynamic route segments or intercepting routes — which keeps the app compatible with `output: 'export'`.

**Filters live in the URL** (`?q=&service=&status=`) via `useSearchParams`/`router.replace`, so a filtered view is bookmarkable/shareable. The search box is debounced (300ms) before it touches the URL.

**Live queue.** `useTasksQuery` polls every 15s so new requests show up without a manual refresh.

## Handling the bad seed data

`db.json` includes a null customer name, an unrecognized `serviceType` (`phone_call`), an unrecognized `status` (`pending_review`), a blank symptom, an unparseable `createdAt`, a task missing `createdAt` entirely, and a duplicate `id`. `modules/dashboard/utils/transforms/transformTaskListResponse.ts` is the single place raw API data gets validated — passed as `transformResponse` into the shared `shared/hooks/api/tasks/*` hooks, which apply it right after the raw fetch resolves:

- Bad/missing fields get a safe fallback (`"Unknown customer"`, `"No symptom description provided."`, `createdAt: null` → rendered as "Unknown date" instead of `Invalid Date`) and the repair is recorded in `issues: DataIssue[]`.
- An unrecognized status falls back to `new` rather than breaking the `new → in_progress → completed` progression.
- Cards with a repaired field show a small warning icon (tooltip explains what was wrong); a dismissible banner at the top of the dashboard summarizes how many records were affected.
- Duplicate ids are deduplicated (first occurrence kept) and reported in that same banner, rather than silently dropped or left to clobber each other in the UI.

Nothing is hidden — every deviation from the data model is visible somewhere in the UI, not just swallowed by a try/catch.

## How the mock API is reachable

The [live demo](https://telepharmacy-bo.vercel.app/) has no `json-server` process to talk to — Vercel only runs the Next.js app. Instead, `src/app/api/tasks/route.ts` and `src/app/api/tasks/[id]/route.ts` are Next.js route handlers that serve `db.json`'s rows verbatim (bad fields included) from an in-memory store (`app/api/tasks/_lib/tasksStore.ts` — deliberately kept inside the route folder, not the `dashboard` domain module, since it's demo-only plumbing, not business logic), supporting the same `GET /tasks`, `GET /tasks/:id`, `PATCH /tasks/:id` shape json-server does. `services/axios.ts` defaults `NEXT_PUBLIC_API_URL` to `/api`, so this is what both `npm run dev` and the deployed app use unless you opt into json-server (see [Running it](#running-it)).

This is a mock, not a database: task edits live in a plain array in the route handler's module scope, so a status change persists for as long as that serverless instance stays warm and resets on the next cold start or deploy.

## Trade-offs and what I'd improve with more time

- **No optimistic status updates.** The "Advance" button waits for the `PATCH` to resolve before the UI reflects it. Optimistic updates (via TanStack Query's `onMutate`) would feel snappier but add rollback complexity I didn't think was worth it for a 3-hour scope.
- **Polling, not real-time.** A 15s poll is a stand-in for the "live queue" stretch goal. A real implementation would use SSE/WebSockets from the API.
- **Duplicate-id handling is blunt.** Keeping "whichever came first" is a reasonable default, but a real backend bug like this deserves surfacing to an ops dashboard, not just a client-side workaround.
- **No date-range filter** (today / this week / custom) — service/status/search filters were prioritized over this since they cover the more common triage workflow.
- **No E2E test.** Unit tests cover the data-normalization logic (the trickiest, highest-value part given the seed data's intentional issues) and the filter logic; component tests cover `TaskCard`. A Playwright test driving the modal-open → advance-status flow would be the next thing I'd add.
- **MUI's default theme is barely customized.** Given more time I'd put more polish into the visual design (spacing rhythm, empty-state illustration, etc.) rather than the default palette tweak currently in `theme/theme.ts`.
- **The demo's mock API doesn't persist.** See [How the mock API is reachable](#how-the-mock-api-is-reachable) — a real deploy would put `db.json`'s rows in an actual database instead of a module-scope array.

## Ideas I'd build if this were a real product

- A per-pharmacist "claim" step before `in_progress`, so two pharmacists can't work the same request.
- Priority sorting on the queue (e.g. surface `video_call` "chest pain" style symptoms above routine refill chats) instead of just status/service filters.
- An audit trail per task (who changed status, when) — useful both operationally and for the kind of data-quality issue this take-home simulates.

## Development notes

### Commit messages

This project uses [commitlint](https://commitlint.js.org/) with [Conventional Commits](https://www.conventionalcommits.org/), enforced via a Husky `commit-msg` hook: `<type>(<scope>): <subject>` (e.g. `feat(dashboard): add status filter`).

### Testing

[Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/), configured via `next/jest`. Runs on `git push` via the Husky `pre-push` hook, alongside lint.

```bash
npm test             # run once
npm run test:watch   # watch mode
```

Test files sit directly beside the code they cover as `Component.test.tsx` (same convention as `.stories.tsx`) rather than in a `__tests__` subfolder. Some component tests also assert on a snapshot (e.g. `StatusChip.test.tsx`, snapshot stored in the adjacent `__snapshots__/`) — review those diffs carefully on intentional UI changes and re-run with `-u` to update.

Every component in `modules/dashboard/components` and `shared/components` has a test, and the two custom hooks (`useDebouncedValue`, `useTaskQueries`) are tested in isolation via `renderHook`. Components that call `next/navigation` mock it with `jest.mock`; components that use TanStack Query wrap in a fresh `QueryClientProvider` per test and mock `shared/services/api/tasks` rather than `fetch`.

### Storybook

Component stories live next to the component (`Component.stories.tsx`), using `@storybook/nextjs-vite`. Stories render through the app's real MUI theme (`.storybook/preview.tsx`), and `next/navigation` is auto-mocked by the framework (`parameters.nextjs.appDirectory: true`, set globally).

```bash
npm run storybook          # dev server at http://localhost:6006
npm run build-storybook    # static build to storybook-static/
```

Every component has a story. Components backed by TanStack Query (`TaskDetailContent`, `Dashboard`) use the `withQueryClient` decorator in `shared/mocks/storyQueryClient.tsx` to seed the query cache directly — there's no mock API server in Storybook, so an unseeded query would just fail against a nonexistent backend. That decorator also disables background refetch for the seeded key, which is why a "Loading" or network-error story isn't included: simulating those would mean stubbing `window.fetch` globally, which leaks across story navigation within the same Storybook session.
