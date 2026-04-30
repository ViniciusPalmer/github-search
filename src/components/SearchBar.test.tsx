import { ComponentProps } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  RepoConsultingContext,
  type RepoConsultingContextValue,
} from "../contexts/RepoConsultingContext";
import { SearchBar } from "./SearchBar";

jest.mock("axios");

jest.mock("react-toastify", () => ({
  ToastContainer: () => <div data-testid="toast-container" />,
  toast: {
    error: jest.fn(),
  },
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

const baseContext: RepoConsultingContextValue = {
  isAuthenticated: true,
  lastSearch: undefined,
  startSession: jest.fn(),
  logout: jest.fn(),
  insertNewSearch: jest.fn(),
};

function renderSearchBar(
  contextOverrides: Partial<RepoConsultingContextValue> = {},
  props: Partial<ComponentProps<typeof SearchBar>> = {}
) {
  const context = { ...baseContext, ...contextOverrides };

  return render(
    <RepoConsultingContext.Provider value={context}>
      <SearchBar {...props} />
    </RepoConsultingContext.Provider>
  );
}

function getSearchInput() {
  return screen.getByRole("textbox", { name: /usuário do github/i });
}

function getSearchForm() {
  const form = getSearchInput().closest("form");

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
    expect(screen.getByRole("button", { name: "Buscar" })).toBeEnabled();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("does not search while the user is only typing", () => {
    // Arrange
    renderSearchBar();

    // Act
    fireEvent.change(getSearchInput(), {
      target: { value: "octo" },
    });

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
            per_page: 10,
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
            per_page: 10,
            page: 1,
          }),
        })
      );
    });
  });

  it("ignores repeated submit attempts while a search is already loading", async () => {
    // Arrange
    let resolveSearch: (value: unknown) => void = jest.fn();
    const searchRequest = new Promise((resolve) => {
      resolveSearch = resolve;
    });

    mockedAxios.get.mockReturnValue(searchRequest as ReturnType<typeof mockedAxios.get>);

    renderSearchBar();

    // Act
    fireEvent.change(getSearchInput(), {
      target: { value: "octo" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Buscar" }));
    fireEvent.submit(getSearchForm());

    // Assert
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);

    resolveSearch({
      data: {
        total_count: 1,
        incomplete_results: false,
        items: [makeSearchItem("octocat")],
      },
    });

    expect(await screen.findByRole("button", { name: "Abrir perfil octocat" })).toBeInTheDocument();
  });

  it("renders at most ten result cards and shows paginated summary", async () => {
    // Arrange
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        total_count: 12,
        incomplete_results: false,
        items: Array.from({ length: 12 }, (_, index) =>
          makeSearchItem(`octo-${index + 1}`, index + 1)
        ),
      },
    });

    renderSearchBar();

    // Act
    fireEvent.change(getSearchInput(), {
      target: { value: "octo" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Buscar" }));

    // Assert
    expect(await screen.findAllByRole("button", { name: /Abrir perfil/ })).toHaveLength(10);
    expect(screen.getByRole("button", { name: "Abrir perfil octo-1" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Abrir perfil octo-11" })).not.toBeInTheDocument();
    expect(screen.getByText("1-10 de 12")).toBeInTheDocument();
    expect(screen.queryByText(/de 5/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Página anterior" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Próxima página" })).toBeEnabled();
  });

  it("requests the next page with the same confirmed query and updates pagination state", async () => {
    // Arrange
    mockedAxios.get
      .mockResolvedValueOnce({
        data: {
          total_count: 25,
          incomplete_results: false,
          items: Array.from({ length: 10 }, (_, index) =>
            makeSearchItem(`octo-${index + 1}`, index + 1)
          ),
        },
      })
      .mockResolvedValueOnce({
        data: {
          total_count: 25,
          incomplete_results: false,
          items: Array.from({ length: 10 }, (_, index) =>
            makeSearchItem(`octo-${index + 11}`, index + 11)
          ),
        },
      });

    renderSearchBar();

    // Act
    fireEvent.change(getSearchInput(), {
      target: { value: "octo" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Buscar" }));
    fireEvent.click(await screen.findByRole("button", { name: "Próxima página" }));

    // Assert
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenNthCalledWith(
        2,
        "https://api.github.com/search/users",
        expect.objectContaining({
          params: expect.objectContaining({
            q: "octo in:login type:user",
            per_page: 10,
            page: 2,
          }),
        })
      );
    });
    expect(await screen.findByRole("button", { name: "Abrir perfil octo-11" })).toBeInTheDocument();
    expect(screen.getByText("11-20 de 25")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Página anterior" })).toBeEnabled();
  });

  it("disables the next-page action on the last available page", async () => {
    // Arrange
    mockedAxios.get
      .mockResolvedValueOnce({
        data: {
          total_count: 15,
          incomplete_results: false,
          items: Array.from({ length: 10 }, (_, index) =>
            makeSearchItem(`octo-${index + 1}`, index + 1)
          ),
        },
      })
      .mockResolvedValueOnce({
        data: {
          total_count: 15,
          incomplete_results: false,
          items: Array.from({ length: 5 }, (_, index) =>
            makeSearchItem(`octo-${index + 11}`, index + 11)
          ),
        },
      });

    renderSearchBar();

    // Act
    fireEvent.change(getSearchInput(), {
      target: { value: "octo" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Buscar" }));
    fireEvent.click(await screen.findByRole("button", { name: "Próxima página" }));

    // Assert
    expect(await screen.findByRole("button", { name: "Abrir perfil octo-15" })).toBeInTheDocument();
    expect(screen.getByText("11-15 de 15")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Página anterior" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Próxima página" })).toBeDisabled();
  });

  it("resets the pagination to the first page when a new search starts", async () => {
    // Arrange
    mockedAxios.get
      .mockResolvedValueOnce({
        data: {
          total_count: 25,
          incomplete_results: false,
          items: Array.from({ length: 10 }, (_, index) =>
            makeSearchItem(`octo-${index + 1}`, index + 1)
          ),
        },
      })
      .mockResolvedValueOnce({
        data: {
          total_count: 25,
          incomplete_results: false,
          items: Array.from({ length: 10 }, (_, index) =>
            makeSearchItem(`octo-${index + 11}`, index + 11)
          ),
        },
      })
      .mockResolvedValueOnce({
        data: {
          total_count: 2,
          incomplete_results: false,
          items: [makeSearchItem("hubot"), makeSearchItem("hubot-dev", 2)],
        },
      });

    renderSearchBar();

    // Act
    fireEvent.change(getSearchInput(), {
      target: { value: "octo" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Buscar" }));
    fireEvent.click(await screen.findByRole("button", { name: "Próxima página" }));

    await screen.findByRole("button", { name: "Abrir perfil octo-11" });

    fireEvent.change(getSearchInput(), {
      target: { value: "hubot" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Buscar" }));

    // Assert
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenNthCalledWith(
        3,
        "https://api.github.com/search/users",
        expect.objectContaining({
          params: expect.objectContaining({
            q: "hubot in:login type:user",
            per_page: 10,
            page: 1,
          }),
        })
      );
    });
    expect(await screen.findByRole("button", { name: "Abrir perfil hubot" })).toBeInTheDocument();
    expect(screen.getByText("1-2 de 2")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Próxima página" })).not.toBeInTheDocument();
  });

  it("caps the paginated total to the GitHub Search API limit", async () => {
    // Arrange
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        total_count: 5000,
        incomplete_results: false,
        items: Array.from({ length: 10 }, (_, index) =>
          makeSearchItem(`octo-${index + 1}`, index + 1)
        ),
      },
    });

    renderSearchBar();

    // Act
    fireEvent.change(getSearchInput(), {
      target: { value: "octo" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Buscar" }));

    // Assert
    expect(await screen.findByText("1-10 de 1000")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Página 100" })).toBeInTheDocument();
  });

  it("keeps the previous results visible when a paginated request fails", async () => {
    // Arrange
    mockedAxios.get
      .mockResolvedValueOnce({
        data: {
          total_count: 25,
          incomplete_results: false,
          items: Array.from({ length: 10 }, (_, index) =>
            makeSearchItem(`octo-${index + 1}`, index + 1)
          ),
        },
      })
      .mockRejectedValueOnce(new Error("page error"));

    renderSearchBar();

    // Act
    fireEvent.change(getSearchInput(), {
      target: { value: "octo" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Buscar" }));
    fireEvent.click(await screen.findByRole("button", { name: "Próxima página" }));

    // Assert
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Nao foi possivel buscar usuarios agora.");
    });
    expect(screen.getByRole("button", { name: "Abrir perfil octo-1" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Abrir perfil octo-11" })).not.toBeInTheDocument();
    expect(screen.getByText("1-10 de 25")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Próxima página" })).toBeEnabled();
  });

  it("prevents duplicate pagination requests while the next page is loading", async () => {
    // Arrange
    let resolveNextPage: (value: unknown) => void = jest.fn();
    const nextPageRequest = new Promise((resolve) => {
      resolveNextPage = resolve;
    });

    mockedAxios.get
      .mockResolvedValueOnce({
        data: {
          total_count: 25,
          incomplete_results: false,
          items: Array.from({ length: 10 }, (_, index) =>
            makeSearchItem(`octo-${index + 1}`, index + 1)
          ),
        },
      })
      .mockReturnValueOnce(nextPageRequest as ReturnType<typeof mockedAxios.get>);

    renderSearchBar();

    // Act
    fireEvent.change(getSearchInput(), {
      target: { value: "octo" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Buscar" }));

    const nextPageButton = await screen.findByRole("button", { name: "Próxima página" });

    fireEvent.click(nextPageButton);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Próxima página" })).toBeDisabled();
    });

    fireEvent.click(screen.getByRole("button", { name: "Próxima página" }));

    // Assert
    expect(mockedAxios.get).toHaveBeenCalledTimes(2);

    resolveNextPage({
      data: {
        total_count: 25,
        incomplete_results: false,
        items: Array.from({ length: 10 }, (_, index) =>
          makeSearchItem(`octo-${index + 11}`, index + 11)
        ),
      },
    });

    expect(await screen.findByRole("button", { name: "Abrir perfil octo-11" })).toBeInTheDocument();
  });

  it("fetches selected profile details, stores mapped user data, and opens detail", async () => {
    // Arrange
    const insertNewSearch = jest.fn();
    const onUserSelected = jest.fn();
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

    renderSearchBar({ insertNewSearch }, { onUserSelected });

    // Act
    fireEvent.change(getSearchInput(), {
      target: { value: "octocat" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Buscar" }));
    const openProfileButton = await screen.findByRole("button", {
      name: "Abrir perfil octocat",
    });

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get.mock.calls[0][0]).toBe(
      "https://api.github.com/search/users"
    );
    expect(mockedAxios.get.mock.calls[0][0]).not.toContain("/users/octocat");

    fireEvent.click(openProfileButton);

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
      expect(onUserSelected).toHaveBeenCalledTimes(1);
    });
    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
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
