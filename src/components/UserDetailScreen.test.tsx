import { ContextType, ImgHTMLAttributes } from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import axios from "axios";

import { RepoConsultingContext } from "../contexts/RepoConsultingContext";
import { UserDetailScreen } from "./UserDetailScreen";

jest.mock("axios");

jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

type RepoConsultingContextValue = ContextType<typeof RepoConsultingContext>;

const selectedUser = {
  login: "octocat",
  name: "The Octocat",
  avatar_url: "https://example.test/avatar.png",
  type: "User",
  mail: null,
  followers: 42,
  company: null,
};

const baseContext: RepoConsultingContextValue = {
  isLogged: true,
  lastSearch: selectedUser,
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

function renderDetail(contextOverrides: Partial<RepoConsultingContextValue> = {}) {
  const context = { ...baseContext, ...contextOverrides };

  return render(
    <RepoConsultingContext.Provider value={context}>
      <UserDetailScreen onBack={jest.fn()} />
    </RepoConsultingContext.Provider>
  );
}

interface RepositoryOverrides {
  description?: string | null;
  stargazers_count?: number;
  forks_count?: number;
  language?: string | null;
  topics?: string[];
  updated_at?: string;
}

function makeRepository(
  id: number,
  name: string,
  overrides: RepositoryOverrides = {}
) {
  return {
    id,
    name,
    full_name: `octocat/${name}`,
    html_url: `https://github.com/octocat/${name}`,
    description: `${name} description`,
    stargazers_count: id * 10,
    forks_count: id,
    language: "TypeScript",
    topics: ["react", "nextjs"],
    updated_at: "2026-04-20T10:00:00Z",
    ...overrides,
  };
}

describe("UserDetailScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not fetch repositories without a selected login", () => {
    // Arrange
    const contextOverrides = { lastSearch: undefined };

    // Act
    renderDetail(contextOverrides);

    // Assert
    expect(screen.getByText("Nenhum perfil selecionado.")).toBeInTheDocument();
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it("fetches repositories, renders m7rAs header metrics, and selects the first repo by default", async () => {
    // Arrange
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        makeRepository(1, "hello-world", { stargazers_count: 10 }),
        makeRepository(2, "api-kit", { stargazers_count: 20 }),
        makeRepository(3, "docs", { stargazers_count: 30, language: "MDX" }),
      ],
    });

    // Act
    renderDetail();

    // Assert
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://api.github.com/users/octocat/repos",
        {
          params: {
            per_page: 5,
            page: 1,
            sort: "updated",
          },
        }
      );
    });
    expect(await screen.findByText("Resultado para usuário octocat")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "The Octocat" })).toBeInTheDocument();
    expect(screen.getByText("@octocat")).toBeInTheDocument();
    expect(screen.getAllByText("PUBLIC").length).toBeGreaterThan(0);
    expect(screen.getByText("PERFIL ATIVO")).toBeInTheDocument();
    expect(screen.getByLabelText("Métrica REPOS: 3")).toBeInTheDocument();
    expect(screen.getByLabelText("Métrica STARS: 60")).toBeInTheDocument();
    expect(screen.getByText("exibidas")).toBeInTheDocument();
    expect(screen.getByLabelText("Métrica MATCHES: 3")).toBeInTheDocument();
    expect(screen.getByLabelText("Métrica TOP STACK: TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Repositórios do usuário")).toBeInTheDocument();
    expect(
      screen.getByText("Primeiro item selecionado por padrão • clique para atualizar o resumo")
    ).toBeInTheDocument();

    const firstRepositoryButton = screen.getByRole("button", { name: /hello-world/i });
    const secondRepositoryButton = screen.getByRole("button", { name: /api-kit/i });
    expect(firstRepositoryButton).toHaveAttribute("aria-pressed", "true");
    expect(secondRepositoryButton).toHaveAttribute("aria-pressed", "false");

    const summary = screen.getByLabelText("Resumo do repositório selecionado");
    expect(within(summary).getByText("SELECIONADO DEFAULT")).toBeInTheDocument();
    expect(within(summary).getByRole("heading", { name: "hello-world" })).toBeInTheDocument();
    expect(within(summary).getByText("hello-world description")).toBeInTheDocument();
    expect(within(summary).getByText("nextjs")).toBeInTheDocument();
    expect(
      within(summary).getByRole("link", {
        name: "Abrir repositório hello-world no GitHub",
      })
    ).toHaveAttribute("href", "https://github.com/octocat/hello-world");
  });

  it("renders an empty state when the selected user has no displayed repositories", async () => {
    // Arrange
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    // Act
    renderDetail();

    // Assert
    expect(
      await screen.findByText("Nenhum repositório encontrado para este perfil.")
    ).toBeInTheDocument();
  });

  it("renders an error state when repository loading fails", async () => {
    // Arrange
    mockedAxios.get.mockRejectedValueOnce(new Error("repo error"));

    // Act
    renderDetail();

    // Assert
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Nao foi possivel buscar os repositórios deste perfil."
    );
  });

  it("updates the selected repository summary without fetching additional pages", async () => {
    // Arrange
    mockedAxios.get.mockResolvedValueOnce({
      data: [makeRepository(1, "hello-world"), makeRepository(2, "api-kit")],
    });

    renderDetail();
    const firstRepositoryButton = await screen.findByRole("button", {
      name: /hello-world/i,
    });
    const secondRepositoryButton = screen.getByRole("button", { name: /api-kit/i });

    // Act
    fireEvent.click(secondRepositoryButton);

    // Assert
    expect(firstRepositoryButton).toHaveAttribute("aria-pressed", "false");
    expect(secondRepositoryButton).toHaveAttribute("aria-pressed", "true");
    const summary = screen.getByLabelText("Resumo do repositório selecionado");
    expect(within(summary).getByRole("heading", { name: "api-kit" })).toBeInTheDocument();
    expect(within(summary).getByText("SELECIONADO")).toBeInTheDocument();
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get.mock.calls[0][0]).not.toContain("page=2");
    expect(
      within(summary).getByRole("link", {
        name: "Abrir repositório api-kit no GitHub",
      })
    ).toHaveAttribute("rel", "noreferrer");
  });
});
