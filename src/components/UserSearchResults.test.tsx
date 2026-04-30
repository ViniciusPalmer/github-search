import { render, screen, within } from "@testing-library/react";

import { UserSearchResults } from "./UserSearchResults";

function makeUser(login: string, id: number) {
  return {
    login,
    id,
    avatar_url: `https://example.test/${login}.png`,
    html_url: `https://github.com/${login}`,
    type: "User",
    score: id,
  };
}

describe("UserSearchResults", () => {
  it("renders the results inside a dedicated scroll area and keeps pagination outside it", () => {
    // Arrange
    const results = Array.from({ length: 10 }, (_, index) =>
      makeUser(`octo-${index + 1}`, index + 1)
    );

    const { container } = render(
      <UserSearchResults
        results={results}
        currentPage={1}
        totalResults={25}
        pageSize={10}
        isLoading={false}
        selectedLogin={null}
        onSelect={jest.fn()}
        onPageChange={jest.fn()}
      />
    );

    // Assert
    const scrollArea = screen.getByRole("region", {
      name: "Lista de perfis encontrados",
    });
    const pagination = screen.getByRole("navigation", {
      name: "Paginação dos resultados",
    });
    const scrollbarRail = container.querySelector('[data-scrollbar-rail="true"]');
    const scrollbarTrack = container.querySelector('[data-scrollbar-track="true"]');
    const scrollbarThumb = container.querySelector('[data-scrollbar-thumb="true"]');

    expect(scrollArea).toHaveAttribute("tabindex", "0");
    expect(scrollArea).toHaveClass(
      "scrollbar-none",
      "max-h-[16rem]",
      "overflow-y-auto",
      "overscroll-contain"
    );
    expect(within(scrollArea).getAllByRole("button", { name: /Abrir perfil/i })).toHaveLength(10);
    expect(within(scrollArea).queryByRole("navigation", { name: /Paginação dos resultados/i })).not.toBeInTheDocument();
    expect(scrollbarRail).toBeInTheDocument();
    expect(scrollbarTrack).toBeInTheDocument();
    expect(scrollbarThumb).toBeInTheDocument();
    expect(pagination).toBeInTheDocument();
  });
});
