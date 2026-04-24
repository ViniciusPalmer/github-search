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

function getSearchInput() {
  return screen.getByRole("textbox", { name: /usuário do github/i });
}

function getSearchForm() {
  const form = screen.getByRole("button", { name: "Buscar" }).closest("form");

  if (!form) {
    throw new Error("Search form was not rendered");
  }

  return form;
}

describe("SearchBar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function makeSearchItem(login: string, score = 1) {
    return {
      login,
      id: score,
      node_id: `node-${login}`,
      avatar_url: `https://example.test/${login}.png`,
      url: `https://api.github.com/users/${login}`,
      html_url: `https://github.com/${login}`,
      type: "User",
      site_admin: false,
      score,
    };
  }

  it("does not call GitHub when the input is empty or whitespace", () => {
    // Arrange
    renderSearchBar();

    // Act
    fireEvent.submit(getSearchForm());
    fireEvent.change(getSearchInput(), {
      target: { value: "   " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Buscar" }));

    // Assert
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it("calls Search Users with best-match params and headers", async () => {
    // Arrange
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        total_count: 1,
        incomplete_results: false,
        items: [makeSearchItem("octocat")],
      },
    });

    renderSearchBar();

    // Act
    fireEvent.change(getSearchInput(), {
      target: { value: "  octo  " },
    });
    fireEvent.submit(getSearchForm());

    // Assert
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://api.github.com/search/users",
        {
          params: {
            q: "octo in:login type:user",
            per_page: 5,
            page: 1,
          },
          headers: {
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );
    });
    expect(mockedAxios.get.mock.calls[0][1]?.params).not.toHaveProperty("sort");
  });

  it("calls Search Users when the accessible search button is clicked", async () => {
    // Arrange
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        total_count: 1,
        incomplete_results: false,
        items: [makeSearchItem("octocat")],
      },
    });

    renderSearchBar();

    // Act
    fireEvent.change(getSearchInput(), {
      target: { value: "octocat" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Buscar" }));

    // Assert
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://api.github.com/search/users",
        expect.objectContaining({
          params: expect.objectContaining({
            q: "octocat in:login type:user",
            per_page: 5,
            page: 1,
          }),
        })
      );
    });
  });

  it("renders at most five result cards", async () => {
    // Arrange
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        total_count: 6,
        incomplete_results: false,
        items: [1, 2, 3, 4, 5, 6].map((index) => makeSearchItem(`octo-${index}`, index)),
      },
    });

    renderSearchBar();

    // Act
    fireEvent.change(getSearchInput(), {
      target: { value: "octo" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Buscar" }));

    // Assert
    expect(await screen.findAllByRole("button", { name: /Abrir perfil/ })).toHaveLength(5);
    expect(screen.getByRole("button", { name: "Abrir perfil octo-1" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Abrir perfil octo-6" })).not.toBeInTheDocument();
  });

  it("fetches selected profile details and stores mapped user data", async () => {
    // Arrange
    const insertNewSearch = jest.fn();
    mockedAxios.get
      .mockResolvedValueOnce({
        data: {
          total_count: 1,
          incomplete_results: false,
          items: [makeSearchItem("octocat")],
        },
      })
      .mockResolvedValueOnce({
        data: {
          login: "octocat",
          name: null,
          avatar_url: "https://example.test/avatar.png",
          type: "User",
          email: null,
          followers: 42,
          company: null,
        },
      });

    renderSearchBar({ insertNewSearch });

    // Act
    fireEvent.change(getSearchInput(), {
      target: { value: "octocat" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Buscar" }));
    fireEvent.click(await screen.findByRole("button", { name: "Abrir perfil octocat" }));

    // Assert
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenLastCalledWith(
        "https://api.github.com/users/octocat"
      );
      expect(insertNewSearch).toHaveBeenCalledWith({
        login: "octocat",
        name: "octocat",
        avatar_url: "https://example.test/avatar.png",
        type: "User",
        mail: null,
        followers: 42,
        company: null,
      });
    });
  });

  it("closes open repository and starred panels when starting a new search", async () => {
    // Arrange
    const activeRepo = jest.fn();
    const activeStarred = jest.fn();
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        total_count: 0,
        incomplete_results: false,
        items: [],
      },
    });

    renderSearchBar({ repoIsOpen: true, starredIsOpen: true, activeRepo, activeStarred });

    // Act
    fireEvent.change(getSearchInput(), {
      target: { value: "octocat" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Buscar" }));

    // Assert
    await waitFor(() => {
      expect(activeRepo).toHaveBeenCalledTimes(1);
      expect(activeStarred).toHaveBeenCalledTimes(1);
    });
  });

  it("shows an error message when Search Users rejects", async () => {
    // Arrange
    mockedAxios.get.mockRejectedValueOnce(new Error("not found"));

    renderSearchBar();

    // Act
    fireEvent.change(getSearchInput(), {
      target: { value: "missing-user" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Buscar" }));

    // Assert
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Nao foi possivel buscar usuarios agora.");
    });
    expect(screen.getByRole("status")).toHaveTextContent(
      "Nao foi possivel buscar usuarios agora."
    );
    expect(screen.getByRole("button", { name: "Buscar" })).toBeEnabled();
  });

  it("shows no-results copy when Search Users returns no items", async () => {
    // Arrange
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        total_count: 0,
        incomplete_results: false,
        items: [],
      },
    });

    renderSearchBar();

    // Act
    fireEvent.change(getSearchInput(), {
      target: { value: "missing-user" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Buscar" }));

    // Assert
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Nenhum usuario encontrado para esta busca."
    );
  });

  it("shows an error message when selected profile rejects", async () => {
    // Arrange
    mockedAxios.get
      .mockResolvedValueOnce({
        data: {
          total_count: 1,
          incomplete_results: false,
          items: [makeSearchItem("octocat")],
        },
      })
      .mockRejectedValueOnce(new Error("profile error"));

    renderSearchBar();

    // Act
    fireEvent.change(getSearchInput(), {
      target: { value: "octocat" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Buscar" }));
    fireEvent.click(await screen.findByRole("button", { name: "Abrir perfil octocat" }));

    // Assert
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Nao foi possivel abrir este perfil.");
    });
    expect(screen.getByRole("status")).toHaveTextContent(
      "Nao foi possivel abrir este perfil."
    );
    expect(screen.getByRole("button", { name: "Abrir perfil octocat" })).toBeEnabled();
  });

  it("disables result cards while selected profile details load", async () => {
    // Arrange
    let resolveProfile: (value: unknown) => void = jest.fn();
    const profileRequest = new Promise((resolve) => {
      resolveProfile = resolve;
    });
    mockedAxios.get
      .mockResolvedValueOnce({
        data: {
          total_count: 2,
          incomplete_results: false,
          items: [makeSearchItem("octocat"), makeSearchItem("hubot", 2)],
        },
      })
      .mockReturnValueOnce(profileRequest as ReturnType<typeof mockedAxios.get>);

    renderSearchBar();

    // Act
    fireEvent.change(getSearchInput(), {
      target: { value: "octo" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Buscar" }));
    fireEvent.click(await screen.findByRole("button", { name: "Abrir perfil octocat" }));

    // Assert
    expect(screen.getByRole("button", { name: "Abrir perfil octocat" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Abrir perfil hubot" })).toBeDisabled();
    expect(mockedAxios.get).toHaveBeenCalledTimes(2);

    resolveProfile({
      data: {
        login: "octocat",
        name: "The Octocat",
        avatar_url: "https://example.test/avatar.png",
        type: "User",
        email: null,
        followers: 42,
        company: null,
      },
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Abrir perfil octocat" })).toBeEnabled();
    });
  });
});
