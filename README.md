# GitHub Search ![react](https://www.readmecodegen.com/api/social-icon?name=react&size=24) ![typescript](https://www.readmecodegen.com/api/social-icon?name=typescript&size=24) ![tailwindcss](https://www.readmecodegen.com/api/social-icon?name=tailwindcss&size=24)

GitHub Search is a Next.js web app for discovering GitHub profiles. The current flow starts with a GitHub login screen, lets the user search accounts by login, and opens a detail view with profile information and recent repositories.

## ✨ Overview

- Built with Next.js 16 using the Pages Router.
- Uses React 19, TypeScript, and Tailwind CSS v4.
- Fetches GitHub data client-side with `axios`.
- Stores shared app state in `RepoConsultingContext`.
- Includes Jest and Testing Library coverage for the UI.

## 🔄 Main Flow

1. The user opens the app and sees the GitHub login screen.
2. After GitHub redirects back with a `code` query parameter, the app marks the user as logged in on the client.
3. The authenticated screen allows searching GitHub users by login.
4. Selecting a user opens a detail screen with profile metrics and repository data.

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
- `src/pages/index.tsx`: switches between the login screen and the authenticated experience.
- `src/contexts/RepoConsultingContext.tsx`: centralizes login state, selected user data, and repository-related UI state.
- `src/components/LoginWithGitHub.tsx`: renders the OAuth entry screen and detects the GitHub `code` query parameter.
- `src/components/AuthenticatedSearchScreen/index.tsx`: manages the search and detail views after login.
- `src/components/SearchBar.tsx`: queries GitHub users and selects the active profile.
- `src/components/UserDetailScreen/index.tsx`: loads repositories for the selected user and displays summary metrics.
- `src/styles/tailwind.css`: Tailwind CSS v4 entry point and project design tokens.
- `public/`: static assets used by the interface.

## ⚠️ Important Notes

- The GitHub OAuth URL is hard-coded in `src/components/LoginWithGitHub.tsx` with `redirect_uri=http://localhost:3000/`.
- The app does not exchange the OAuth `code` on the server. A redirect containing `?code=` is treated as a valid client-side login signal.
- GitHub data is fetched directly from the browser using the public GitHub API.
- Some UI copy in the application is still mixed between Portuguese and English.
- Older components related to repository/starred flows still exist in the codebase, but the main screen flow currently centers on `AuthenticatedSearchScreen`, `SearchBar`, and `UserDetailScreen`.

## ✅ Validation

Before sharing changes, run:

```bash
yarn validate
```
