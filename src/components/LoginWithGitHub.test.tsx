import { ContextType } from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import { RepoConsultingContext } from "../contexts/RepoConsultingContext";
import { LoginWithGithub } from "./LoginWithGitHub";

type RepoConsultingContextValue = ContextType<typeof RepoConsultingContext>;

const defaultContext: RepoConsultingContextValue = {
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

function renderLogin(contextOverrides: Partial<RepoConsultingContextValue> = {}) {
  const context = { ...defaultContext, ...contextOverrides };

  return render(
    <RepoConsultingContext.Provider value={context}>
      <LoginWithGithub />
    </RepoConsultingContext.Provider>
  );
}

describe("LoginWithGithub", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.history.pushState({}, "", "/");
  });

  it("renders the GitHub OAuth link", () => {
    // Arrange
    renderLogin();

    // Act
    const actualLoginLink = screen.getByRole("link", {
      name: "Entrar com GitHub",
    });

    // Assert
    expect(actualLoginLink).toBeInTheDocument();
    expect(actualLoginLink).toHaveAttribute(
      "href",
      "https://github.com/login/oauth/authorize?scope=user:email&client_id=494ba751b5d36b9ac67f&redirect_uri=http://localhost:3000/"
    );
  });

  it("authenticates when an OAuth code is present in the URL", async () => {
    // Arrange
    const authentificationWithGibHub = jest.fn();
    window.history.pushState({}, "", "/?code=abc123");

    // Act
    renderLogin({ authentificationWithGibHub });

    // Assert
    await waitFor(() => {
      expect(authentificationWithGibHub).toHaveBeenCalledTimes(1);
    });
  });

  it("hides the decorative mockup from assistive technology and interaction", () => {
    // Arrange
    const { container } = renderLogin();

    // Act
    const actualMockupPanel = screen.getByTestId("auth-mockup-panel");

    // Assert
    expect(actualMockupPanel).toHaveAttribute("aria-hidden", "true");
    expect(actualMockupPanel).toHaveClass("pointer-events-none");
    expect(within(actualMockupPanel).queryByRole("button")).not.toBeInTheDocument();
    expect(within(actualMockupPanel).queryByRole("link")).not.toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="auth-mockup-panel"][aria-hidden="true"]')
    ).toBeInTheDocument();
  });
});
