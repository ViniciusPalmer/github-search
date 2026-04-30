import { fireEvent, render, screen } from "@testing-library/react";

import { UserRepositoryCard, type UserRepositoryItem } from "./UserRepositoryCard/index";

function makeRepository(
  overrides: Partial<UserRepositoryItem> = {}
): UserRepositoryItem {
  return {
    id: 1,
    name: "github-search",
    full_name: "octocat/github-search",
    html_url: "https://github.com/octocat/github-search",
    description: "Busca GitHub com login OAuth e lista de usuários",
    stargazers_count: 42,
    forks_count: 3,
    language: "TypeScript",
    topics: ["react", "nextjs"],
    updated_at: "2026-04-20T10:00:00Z",
    ...overrides,
  };
}

describe("UserRepositoryCard", () => {
  it("renders N/A and keeps 0 Stars when language is missing and star count is zero", () => {
    // Arrange
    const onSelect = jest.fn();
    const repository = makeRepository({ language: null, stargazers_count: 0 });

    // Act
    render(
      <UserRepositoryCard
        repository={repository}
        isSelected={false}
        onSelect={onSelect}
      />
    );

    // Assert
    expect(screen.getByText("N/A • 0 Stars")).toBeInTheDocument();
  });

  it("exposes the full stats text while truncating visually for long content", () => {
    // Arrange
    const onSelect = jest.fn();
    const repository = makeRepository({
      language: "A-very-long-stack-name-that-should-overflow-the-badge",
    });

    // Act
    render(
      <UserRepositoryCard
        repository={repository}
        isSelected={true}
        onSelect={onSelect}
      />
    );

    // Assert
    const statsBadge = screen.getByTitle(
      "A-very-long-stack-name-that-should-overflow-the-badge • 42 Stars"
    );
    expect(statsBadge).toHaveClass(
      "overflow-hidden",
      "text-ellipsis",
      "whitespace-nowrap"
    );
  });

  it("calls onSelect when the card is clicked", () => {
    // Arrange
    const onSelect = jest.fn();
    const repository = makeRepository();

    render(
      <UserRepositoryCard
        repository={repository}
        isSelected={false}
        onSelect={onSelect}
      />
    );

    // Act
    fireEvent.click(screen.getByRole("button", { name: /github-search/i }));

    // Assert
    expect(onSelect).toHaveBeenCalledWith(repository);
  });
});
