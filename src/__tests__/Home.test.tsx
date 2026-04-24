import { ContextType } from "react";
import { render, screen } from "@testing-library/react";
import { RepoConsultingContext } from "../contexts/RepoConsultingContext";
import Home from "../pages";

jest.mock("../components/LoginWithGitHub", () => ({
  LoginWithGithub: () => <div>Login UI</div>,
}));

jest.mock("../components/AuthenticatedSearchScreen", () => ({
  AuthenticatedSearchScreen: () => <div>Search UI</div>,
}));

type RepoConsultingContextValue = ContextType<typeof RepoConsultingContext>;

const baseContext: RepoConsultingContextValue = {
  isLogged: false,
  lastSearch: undefined,
  repoIsOpen: false,
  starredIsOpen: false,
  insertNewSearch: jest.fn(),
  authentificationWithGibHub: jest.fn(),
  activeRepo: jest.fn(),
  activeStarred: jest.fn(),
  repoStorage: [],
  starredStorage: [],
  insertNewRepoStorage: jest.fn(),
  insertNewStarredStorage: jest.fn(),
};

function renderHome(isLogged: boolean) {
  return render(
    <RepoConsultingContext.Provider value={{ ...baseContext, isLogged }}>
      <Home />
    </RepoConsultingContext.Provider>
  );
}

describe("Home", () => {
  it("renders the login UI when logged out", () => {
    // Arrange
    renderHome(false);

    // Act
    const actualLoginUi = screen.getByText("Login UI");
    const actualSearchUi = screen.queryByText("Search UI");

    // Assert
    expect(actualLoginUi).toBeInTheDocument();
    expect(actualSearchUi).not.toBeInTheDocument();
  });

  it("renders the search UI when logged in", () => {
    // Arrange
    renderHome(true);

    // Act
    const actualSearchUi = screen.getByText("Search UI");
    const actualLoginUi = screen.queryByText("Login UI");

    // Assert
    expect(actualSearchUi).toBeInTheDocument();
    expect(actualLoginUi).not.toBeInTheDocument();
  });
});
