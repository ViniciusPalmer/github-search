# AGENTS.md

## Repo Snapshot
- Single-package Next.js 16 app using the Pages Router in `src/pages`; there is no `src/app` directory and no `src/pages/api` routes.
- `src/pages/_app.tsx` imports `src/styles/tailwind.css` and wraps every page in `RepoConsultingProvider`; `src/pages/index.tsx` switches between `LoginWithGithub` and `AuthenticatedSearchScreen` from context state.
- Current authenticated flow is `AuthenticatedSearchScreen` -> `SearchBar` -> `UserDetailScreen`; `SearchResult`, `RepoCards`, and `StarredCards` still exist but are not wired into the main page flow.
- Shared client state lives in `src/contexts/RepoConsultingContext.tsx`; components consume it directly instead of server loaders or a separate store.
- GitHub data is fetched client-side with axios in components, and Jest tests usually mock axios.

## Commands
- Use Yarn v1 (`yarn.lock` is lockfile v1): `yarn install`.
- Dev server: `yarn dev` on `http://localhost:3000`; production build: `yarn build`; serve the built app: `yarn start`.
- Full verification: `yarn validate` runs `yarn typecheck && yarn lint && yarn test && yarn build`.
- Focused checks: `yarn typecheck`, `yarn lint`, `yarn test`, `yarn test src/components/SearchBar.test.tsx`, `yarn test:watch`, `yarn test:coverage`.
- ESLint uses flat config in `eslint.config.mjs`; existing rules emit warnings for some current code, but `yarn validate` passes if there are no errors.
- Jest uses `next/jest` with jsdom and `jest.setup.ts`; tests live beside components plus `src/__tests__/` and currently have no snapshots.

## Working Notes
- Tailwind CSS v4 is the app-owned styling system via `src/styles/tailwind.css` and `@tailwindcss/postcss`; keep `@import "tailwindcss";` and add design tokens in `@theme`.
- `components.json` is shadcn-style config with `rsc: false`, CSS at `src/styles/tailwind.css`, and aliases like `@/components`, `@/components/ui`, and `@/lib/utils`.
- `@/*` maps to `src/*`; shared class merging is `cn()` in `src/lib/utils.ts`.
- Public assets live in `public/` and are referenced from components with browser paths such as `/LogoCompasso.png` and `icons/GitHub-Light.png`.
- GitHub OAuth is hard-coded in `src/components/LoginWithGitHub.tsx` with `redirect_uri=http://localhost:3000/`; changing the dev port requires changing code and test expectations.
- The OAuth flow does not exchange the `code` server-side; `LoginWithGitHub` treats `?code=` as logged in and context stores `token@myToken` in `localStorage`.
- User-facing copy is currently mixed Portuguese and English; preserve existing screen language unless the task explicitly changes copy.
