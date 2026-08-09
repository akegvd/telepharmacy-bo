# Telepharmacy Task Dashboard

A dashboard pharmacists use to manage incoming telepharmacy consultation requests: review the queue, open a request for details, and move it through `new → in_progress → completed`.

Built with Next.js 16 (App Router), React 19, TypeScript, MUI, and TanStack Query. See [`TASK.md`](./TASK.md) for the original brief.

## Prerequisites

- Node.js `24.19.0` (see `.nvmrc`). If you use [nvm](https://github.com/nvm-sh/nvm), run `nvm use`.

## Running it

Two processes: the mock API and the app.

```bash
npm install

# 1. Mock API (json-server, reading db.json)
npx json-server --watch db.json --port 4000

# 2. App, in a separate terminal
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app expects the API at `http://localhost:4000` (see `.env.local.example` — copy it to `.env.local` to override via `NEXT_PUBLIC_API_URL`).

## How it's structured

Follows the domain-driven layout in [`PROJECT_STRUCTURE.md`](./PROJECT_STRUCTURE.md): routes stay thin, business logic lives in a domain module.

```
src/
  app/
    page.tsx                    dashboard route (wraps the client Dashboard in Suspense)
    task/[id]/page.tsx          full task detail page (direct visit / refresh)
    @modal/(.)task/[id]/page.tsx  same detail content, intercepted as a modal over the list
    providers.tsx               composition root: QueryClientProvider + AppThemeProvider
  modules/tasks/                the "tasks" bounded context — all task domain logic
    components/                 Dashboard, TaskCard, TaskDetailContent, FilterBar, ...
    hooks/useTaskQueries.ts     TanStack Query hooks (list, detail, status mutation)
    services/taskApi.ts         task-specific API calls (built on shared/services/httpClient)
    types/task.ts               Task / NormalizedTask data model
    utils/
      normalizeTask.ts          repairs/flags bad seed data at the API boundary
      filterTasks.ts            pure search/service/status filter, unit tested
      taskDisplay.ts            status/service-type labels, date formatting
  shared/                       generic, no business logic
    components/Modal.tsx        router.back()-driven dialog wrapper (used by the intercepted route)
    hooks/useDebouncedValue.ts
    services/httpClient.ts      generic fetch wrapper + ApiError
  theme/                        MUI theme + AppThemeProvider
```

**Detail view as a modal-over-route.** Clicking a card opens `/task/:id` as a dialog over the dashboard (shareable URL, back button closes it) using Next's intercepting + parallel routes (`@modal/(.)task/[id]`). Visiting the URL directly, or refreshing, renders the same content as a full page instead — no duplicated logic, `TaskDetailContent` is shared by both.

**Filters live in the URL** (`?q=&service=&status=`) via `useSearchParams`/`router.replace`, so a filtered view is bookmarkable/shareable. The search box is debounced (300ms) before it touches the URL.

**Live queue.** `useTasksQuery` polls every 15s so new requests show up without a manual refresh.

## Handling the bad seed data

`db.json` includes a null customer name, an unrecognized `serviceType` (`phone_call`), an unrecognized `status` (`pending_review`), a blank symptom, an unparseable `createdAt`, a task missing `createdAt` entirely, and a duplicate `id`. `modules/tasks/utils/normalizeTask.ts` is the single place raw API data gets validated, once, at the boundary:

- Bad/missing fields get a safe fallback (`"Unknown customer"`, `"No symptom description provided."`, `createdAt: null` → rendered as "Unknown date" instead of `Invalid Date`) and the repair is recorded in `issues: DataIssue[]`.
- An unrecognized status falls back to `new` rather than breaking the `new → in_progress → completed` progression.
- Cards with a repaired field show a small warning icon (tooltip explains what was wrong); a dismissible banner at the top of the dashboard summarizes how many records were affected.
- Duplicate ids are deduplicated (first occurrence kept) and reported in that same banner, rather than silently dropped or left to clobber each other in the UI.

Nothing is hidden — every deviation from the data model is visible somewhere in the UI, not just swallowed by a try/catch.

## Trade-offs and what I'd improve with more time

- **No optimistic status updates.** The "Advance" button waits for the `PATCH` to resolve before the UI reflects it. Optimistic updates (via TanStack Query's `onMutate`) would feel snappier but add rollback complexity I didn't think was worth it for a 3-hour scope.
- **Polling, not real-time.** A 15s poll is a stand-in for the "live queue" stretch goal. A real implementation would use SSE/WebSockets from the API.
- **Duplicate-id handling is blunt.** Keeping "whichever came first" is a reasonable default, but a real backend bug like this deserves surfacing to an ops dashboard, not just a client-side workaround.
- **No date-range filter** (today / this week / custom) — service/status/search filters were prioritized over this since they cover the more common triage workflow.
- **No E2E test.** Unit tests cover the data-normalization logic (the trickiest, highest-value part given the seed data's intentional issues) and the filter logic; component tests cover `TaskCard`. A Playwright test driving the modal-open → advance-status flow would be the next thing I'd add.
- **MUI's default theme is barely customized.** Given more time I'd put more polish into the visual design (spacing rhythm, empty-state illustration, etc.) rather than the default palette tweak currently in `theme/theme.ts`.

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

Tests live under `__tests__` directories next to the code they cover.
