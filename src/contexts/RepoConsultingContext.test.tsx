import { ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  type ILastSearchUser,
  RepoConsultingProvider,
  useRepoConsultingContext,
} from "./RepoConsultingContext";

function TestConsumer() {
  const { isAuthenticated, lastSearch, startSession, logout, insertNewSearch } =
    useRepoConsultingContext();

  const mockedSearchUser: ILastSearchUser = {
    login: "octocat",
    name: "The Octocat",
    avatar_url: "https://example.test/avatar.png",
    type: "User",
    mail: null,
    followers: 42,
    company: null,
    public_repos: 8,
  };

  return (
    <>
      <p>authenticated: {isAuthenticated ? "yes" : "no"}</p>
      <p>selected login: {lastSearch?.login ?? "none"}</p>
      <button type="button" onClick={startSession}>
        start session
      </button>
      <button type="button" onClick={() => insertNewSearch(mockedSearchUser)}>
        store last search
      </button>
      <button type="button" onClick={logout}>
        logout
      </button>
    </>
  );
}

function GuardConsumer() {
  useRepoConsultingContext();

  return <span>guard consumer</span>;
}

function renderProvider(children: ReactNode) {
  return render(<RepoConsultingProvider>{children}</RepoConsultingProvider>);
}

describe("RepoConsultingProvider", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("renders children", () => {
    // Arrange
    renderProvider(<span>provider child</span>);

    // Act
    const actualChild = screen.getByText("provider child");

    // Assert
    expect(actualChild).toBeInTheDocument();
  });

  it("starts logged out, stores the latest selected profile, and clears state on logout", () => {
    // Arrange
    renderProvider(<TestConsumer />);

    // Assert
    expect(screen.getByText("authenticated: no")).toBeInTheDocument();
    expect(screen.getByText("selected login: none")).toBeInTheDocument();

    // Act
    fireEvent.click(screen.getByRole("button", { name: "start session" }));

    // Assert
    expect(screen.getByText("authenticated: yes")).toBeInTheDocument();

    // Act
    fireEvent.click(screen.getByRole("button", { name: "store last search" }));

    // Assert
    expect(screen.getByText("selected login: octocat")).toBeInTheDocument();

    // Act
    fireEvent.click(screen.getByRole("button", { name: "logout" }));

    // Assert
    expect(screen.getByText("authenticated: no")).toBeInTheDocument();
    expect(screen.getByText("selected login: none")).toBeInTheDocument();
  });

  it("throws when the hook is used outside the provider", () => {
    expect(() => render(<GuardConsumer />)).toThrow(
      "useRepoConsultingContext must be used within RepoConsultingProvider"
    );
  });
});
