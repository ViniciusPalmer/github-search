import { ContextType } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { toast } from "react-toastify";
import { RepoConsultingContext } from "../contexts/RepoConsultingContext";
import { SearchBar } from "./SearchBar";

jest.mock("axios");

jest.mock("react-toastify", () => ({
  ToastContainer: () => <div data-testid="toast-container" />,
  toast: {
    error: jest.fn(),
  },
}));

jest.mock("./SearchResult", () => ({
  SearchResult: () => <div>Search result</div>,
}));

jest.mock("./RepoCards", () => ({
  RepoCards: () => <div>Repo cards</div>,
}));

jest.mock("./StarredCards", () => ({
  StarredCards: () => <div>Starred cards</div>,
}));

jest.mock("./LoadingScreen", () => ({
  LoadingScreen: () => <div>Loading</div>,
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

type RepoConsultingContextValue = ContextType<typeof RepoConsultingContext>;

const baseContext: RepoConsultingContextValue = {
  isLogged: true,
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

function renderSearchBar(contextOverrides: Partial<RepoConsultingContextValue> = {}) {
  const context = { ...baseContext, ...contextOverrides };

  return render(
    <RepoConsultingContext.Provider value={context}>
      <SearchBar />
    </RepoConsultingContext.Provider>
  );
}

describe("SearchBar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not call GitHub when the input is empty", () => {
    // Arrange
    renderSearchBar();

    // Act
    fireEvent.keyDown(
      screen.getByPlaceholderText("Pesquise um perfil do GitHub"),
      {
        key: "Enter",
      }
    );

    // Assert
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it("calls GitHub and stores mapped user data for a successful lookup", async () => {
    // Arrange
    const insertNewSearch = jest.fn();
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        login: "octocat",
        name: "The Octocat",
        avatar_url: "https://example.test/avatar.png",
        type: "User",
        email: "octocat@example.test",
        followers: 42,
        company: "GitHub",
      },
    });

    renderSearchBar({ insertNewSearch });

    // Act
    fireEvent.change(
      screen.getByPlaceholderText("Pesquise um perfil do GitHub"),
      {
        target: { value: "octocat" },
      }
    );
    fireEvent.keyDown(
      screen.getByPlaceholderText("Pesquise um perfil do GitHub"),
      {
        key: "Enter",
      }
    );

    // Assert
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://api.github.com/users/octocat"
      );
      expect(insertNewSearch).toHaveBeenCalledWith({
        login: "octocat",
        name: "The Octocat",
        avatar_url: "https://example.test/avatar.png",
        type: "User",
        mail: "octocat@example.test",
        followers: 42,
        company: "GitHub",
      });
    });
  });

  it("calls GitHub when the accessible search button is clicked", async () => {
    // Arrange
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        login: "octocat",
        name: "The Octocat",
        avatar_url: "https://example.test/avatar.png",
        type: "User",
        email: "octocat@example.test",
        followers: 42,
        company: "GitHub",
      },
    });

    renderSearchBar();

    // Act
    fireEvent.change(
      screen.getByPlaceholderText("Pesquise um perfil do GitHub"),
      {
        target: { value: "octocat" },
      }
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Pesquisar perfil do GitHub" })
    );

    // Assert
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://api.github.com/users/octocat"
      );
    });
  });

  it("shows an error toast when GitHub rejects the lookup", async () => {
    // Arrange
    mockedAxios.get.mockRejectedValueOnce(new Error("not found"));

    renderSearchBar();

    // Act
    fireEvent.change(
      screen.getByPlaceholderText("Pesquise um perfil do GitHub"),
      {
        target: { value: "missing-user" },
      }
    );
    fireEvent.keyDown(
      screen.getByPlaceholderText("Pesquise um perfil do GitHub"),
      {
        key: "Enter",
      }
    );

    // Assert
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Ops cadastro não encontrado");
    });
  });
});
