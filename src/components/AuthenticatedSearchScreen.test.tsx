import { ContextType } from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import { RepoConsultingContext } from "../contexts/RepoConsultingContext";
import { AuthenticatedSearchScreen } from "./AuthenticatedSearchScreen";

jest.mock("./SearchBar", () => ({
  SearchBar: ({ onUserSelected }: { onUserSelected?: () => void }) => (
    <button type="button" onClick={onUserSelected}>
      Abrir detalhe mock
    </button>
  ),
}));

jest.mock("./SearchHero/index", () => ({
  SearchHero: () => <div>Search hero</div>,
}));

jest.mock("./UserDetailScreen/index", () => ({
  UserDetailScreen: () => <div>Detail screen</div>,
}));

type RepoConsultingContextValue = ContextType<typeof RepoConsultingContext>;

const baseContext: RepoConsultingContextValue = {
  isLogged: true,
  lastSearch: {
    login: "octocat",
    name: "The Octocat",
    avatar_url: "https://example.test/avatar.png",
    type: "User",
    mail: null,
    followers: 42,
    company: null,
  },
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

function renderAuthenticatedSearchScreen() {
  return render(
    <RepoConsultingContext.Provider value={baseContext}>
      <AuthenticatedSearchScreen />
    </RepoConsultingContext.Provider>
  );
}

describe("AuthenticatedSearchScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows Nova busca in detail mode and returns to search mode", () => {
    // Arrange
    renderAuthenticatedSearchScreen();

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Abrir detalhe mock" }));

    // Assert
    expect(screen.getByText("Detail screen")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nova busca" })).toBeInTheDocument();

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Nova busca" }));

    // Assert
    expect(screen.getByText("Search hero")).toBeInTheDocument();
    expect(screen.queryByText("Detail screen")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Nova busca" })).not.toBeInTheDocument();
  });
});
