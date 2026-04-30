import { fireEvent, render, screen } from "@testing-library/react";

import {
  RepoConsultingContext,
  type RepoConsultingContextValue,
} from "../contexts/RepoConsultingContext";
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

const baseContext: RepoConsultingContextValue = {
  isAuthenticated: true,
  lastSearch: {
    login: "octocat",
    name: "The Octocat",
    avatar_url: "https://example.test/avatar.png",
    type: "User",
    mail: null,
    followers: 42,
    company: null,
  },
  startSession: jest.fn(),
  logout: jest.fn(),
  insertNewSearch: jest.fn(),
};

function renderAuthenticatedSearchScreen(
  contextOverrides: Partial<RepoConsultingContextValue> = {}
) {
  const context = { ...baseContext, ...contextOverrides };

  return render(
    <RepoConsultingContext.Provider value={context}>
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

  it("keeps the search view when detail mode is requested without a selected profile", () => {
    // Arrange
    renderAuthenticatedSearchScreen({ lastSearch: undefined });

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Abrir detalhe mock" }));

    // Assert
    expect(screen.getByText("Search hero")).toBeInTheDocument();
    expect(screen.queryByText("Detail screen")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Nova busca" })).not.toBeInTheDocument();
  });

  it("shows a logout action in search mode and calls the context logout handler", () => {
    // Arrange
    const logout = jest.fn();

    renderAuthenticatedSearchScreen({ logout });

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Sair" }));

    // Assert
    expect(logout).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("button", { name: "Nova busca" })).not.toBeInTheDocument();
  });
});
