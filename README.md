![GitHub Search](./src/assets/images/github-search.png)

# GitHub Search ![react](https://www.readmecodegen.com/api/social-icon?name=react&size=24) ![typescript](https://www.readmecodegen.com/api/social-icon?name=typescript&size=24) ![tailwindcss](https://www.readmecodegen.com/api/social-icon?name=tailwindcss&size=24)

GitHub Search is a Next.js web app for discovering GitHub profiles. The current flow is public: the user can search accounts by login immediately and open a detail view with profile information and recent repositories.

## ✨ Overview

- Built with Next.js 16 using the Pages Router.
- Uses React 19, TypeScript, and Tailwind CSS v4.
- Fetches GitHub data client-side with `axios`.
- Stores shared app state in `RepoConsultingContext`.
- Includes Jest and Testing Library coverage for the UI.

## 🔄 Main Flow

1. The user opens the app and lands directly on the search experience.
2. The main screen allows searching GitHub users by login.
3. Selecting a user opens a detail screen with profile metrics and repository data.

## 🧰 Tech Stack

- Next.js 16
- React 19
- TypeScript 6
- Tailwind CSS 4
- Axios
- Jest
- Testing Library
- ESLint

## 📦 Installation

This project uses Yarn v1.

```bash
yarn install
```

## ▶️ Running Locally

```bash
yarn dev
```

Open `http://localhost:3000` in your browser.

## 🧪 Scripts

| Command | Description |
| --- | --- |
| `yarn dev` | Start the development server at `http://localhost:3000`. |
| `yarn build` | Create a production build. |
| `yarn start` | Start the production server. |
| `yarn lint` | Run ESLint. |
| `yarn lint:fix` | Run ESLint with automatic fixes. |
| `yarn typecheck` | Run TypeScript checks without emitting files. |
| `yarn test` | Run the Jest test suite. |
| `yarn test:watch` | Run Jest in watch mode. |
| `yarn test:coverage` | Generate test coverage. |
| `yarn validate` | Run type checking, linting, tests, and a production build. |

## 📁 Project Structure

- `src/pages/_app.tsx`: loads global Tailwind styles and wraps the app with `RepoConsultingProvider`.
- `src/pages/index.tsx`: renders the public search experience.
- `src/contexts/RepoConsultingContext.tsx`: centralizes selected user data and repository-related UI state.
- `src/components/AuthenticatedSearchScreen/index.tsx`: manages the search and detail views for the main public flow.
- `src/components/SearchBar.tsx`: queries GitHub users and selects the active profile.
- `src/components/UserDetailScreen/index.tsx`: loads repositories for the selected user and displays summary metrics.
- `src/styles/tailwind.css`: Tailwind CSS v4 entry point and project design tokens.
- `public/`: static assets used by the interface.

## ⚠️ Important Notes

- GitHub data is fetched directly from the browser using the public GitHub API.
- Some UI copy in the application is still mixed between Portuguese and English.
- Older components related to repository/starred flows still exist in the codebase, but the main screen flow currently centers on `AuthenticatedSearchScreen`, `SearchBar`, and `UserDetailScreen`.

## ✅ Validation

Before sharing changes, run:

```bash
yarn validate
```
