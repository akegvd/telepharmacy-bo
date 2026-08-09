## Project Structure (DDD)

This project organizes application code by domain first (modules) and shares code in two layers: **`src/shared`** (generic, no business logic) and **`src/modules/shared`** (cross-module business logic). The structure keeps domain logic cohesive while promoting reuse.

```
├── .vscode/
│   ├── settings.json
│   └── extensions.json
├── public/                           # Static assets (images, fonts, icons)
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── fonts/
│   └── favicon.ico
├── src/
│   ├── app/                          # Next.js App Router (UI routes)
│   │   ├── (public)/                 # Public-facing routes
│   │   ├── layout.tsx                # Root layout
│   │   ├── global-error.tsx          # Error boundary
│   │   └── page.tsx                  # Homepage
│   │
│   ├── pages/                        # Pages Router (only for API mocks)
│   │   └── api/
│   │       ├── example/
│   │       │   └── index.ts          # Mock endpoint
│   │       └── [...next].ts          # More mocks if needed
│   │
│   ├── modules/                      # Domain-driven design (bounded contexts)
│   │   ├── shared/                   # Cross-module business logic
│   │   │   └── [bizSubModule]/       # e.g. auth — reusable within modules only
│   │   ├── [subModuleName]/
│   │   │   ├── [example]/
│   │   │   │   ├── components/
│   │   │   │   │   ├── [Example].test.tsx
│   │   │   │   │   └── [Example].tsx
│   │   │   │   ├── constants/
│   │   │   │   ├── enums/
│   │   │   │   ├── hooks/
│   │   │   │   ├── store/
│   │   │   │   ├── types/
│   │   │   │   └── utils/
│   │   │   │       ├── transforms/
│   │   │   │       │   ├── example.test.ts
│   │   │   │       │   └── example.ts
│   │   │   │       ├── helpers.test.ts
│   │   │   │       └── helpers.ts
│   │   └── ...
│   │
│   ├── shared/                       # Global shared layer — no business logic
│   │   ├── components/
│   │   ├── constants/
│   │   ├── enums/
│   │   ├── hooks/
│   │   ├── locales/                  # i18n translations if has
│   │   ├── services/                 # API clients, fetchers, interceptors
│   │   ├── store/                    # Global Zustand/Redux store (if any)
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── theme/                        # MUI (Material UI) Design System
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── variables/
│   │   ├── overrides/                # MUI component overrides
│   │   ├── index.ts                  # Exports theme provider
│   │   ├── palette.ts                # Color tokens
│   │   ├── typography.ts             # Font styles
│   │   └── variables.ts              # Design tokens
│   │
│   ├── assets/                       # Helpers (icons, SVG components)
│   ├── mocks/                        # Additional mock data (non-API)
│   └── styles/                       # Global styles (if needed)
│
├── .env.*
├── .gitignore
├── .prettierignore             # Prettier ignore
├── .prettierrc                 # Prettier configuration
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── tsconfig.json
├── PROJECT_STRUCTURE.md
└── README.md
```

`src/app` is the only place Next.js routers, layouts, and route handlers live. Each route should delegate to domain modules (components, hooks, stores) rather than embedding business logic directly.

### Shared layers (`src/shared` vs `src/modules/shared`)

| Location | Purpose |
| --- | --- |
| **`src/shared`** | Cross-cutting code **without business rules**: UI primitives, generic hooks, infrastructure (HTTP clients, interceptors), i18n assets, theme-related helpers, pure utilities. Nothing here should encode product or domain-specific behaviour. |
| **`src/modules/shared`** | **Business-logic** building blocks that are **reused across more than one** `src/modules/[subModuleName]/` folder. Organize as small sub-folders (e.g. by capability or subdomain) that **wrap** or compose domain concepts—types, transforms, hooks, components—so feature modules stay thin and do not duplicate rules. |

Prefer keeping domain-specific code inside a single module until a second module genuinely needs it; then promote the shared part into `src/modules/shared`.

### Naming & Conventions
- Keep directories lowercase with camelCase filenames (`useExample.ts`).
- Tests live next to the implementation they verify (`Component.test.tsx`).
- Prefer collocating feature-specific constants/hooks/types under the same domain folder.
- Use **`src/modules/shared`** when business logic is referenced by multiple `src/modules/*` areas; use **`src/shared`** only for non-domain, reusable infrastructure and UI.

### When to Create a New Module
Create a top-level module when:
1. A new business domain or bounded context emerges.
2. Ownership differs (different squad) or release cadence is independent.
3. The feature introduces distinct API contracts or workflows.

### Cross-Cutting Concerns
- Generic UI primitives and layout helpers → `src/shared/components`
- Axios config and API clients (infrastructure) → `src/shared/services`
- App-wide slices/state → `src/shared/store`
- Localization assets → `src/shared/locales`
- Domain rules, transforms, or UI that multiple modules need → `src/modules/shared` (not `src/shared`)

Refer back to this document whenever adding or reorganizing files to preserve the DDD boundaries.
