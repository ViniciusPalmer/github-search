import { ReactNode, useContext } from "react";
import { render, screen } from "@testing-library/react";
import {
  RepoConsultingContext,
  RepoConsultingProvider,
} from "./RepoConsultingContext";

function TestConsumer() {
  const context = useContext(RepoConsultingContext);

  return (
    <dl>
      <dt>isLogged</dt>
      <dd>{String(context.isLogged)}</dd>
      <dt>repoIsOpen</dt>
      <dd>{String(context.repoIsOpen)}</dd>
      <dt>starredIsOpen</dt>
      <dd>{String(context.starredIsOpen)}</dd>
      <dt>repoStorage</dt>
      <dd>{context.repoStorage.length}</dd>
      <dt>starredStorage</dt>
      <dd>{context.starredStorage.length}</dd>
    </dl>
  );
}

function renderProvider(children: ReactNode) {
  return render(<RepoConsultingProvider>{children}</RepoConsultingProvider>);
}

describe("RepoConsultingProvider", () => {
  it("renders children", () => {
    // Arrange
    renderProvider(<span>provider child</span>);

    // Act
    const actualChild = screen.getByText("provider child");

    // Assert
    expect(actualChild).toBeInTheDocument();
  });

  it("provides the default context values", () => {
    // Arrange
    renderProvider(<TestConsumer />);

    // Act
    const actualIsLogged = screen.getByText("isLogged").nextSibling;
    const actualRepoIsOpen = screen.getByText("repoIsOpen").nextSibling;
    const actualStarredIsOpen = screen.getByText("starredIsOpen").nextSibling;
    const actualRepoStorage = screen.getByText("repoStorage").nextSibling;
    const actualStarredStorage = screen.getByText("starredStorage").nextSibling;

    // Assert
    expect(actualIsLogged).toHaveTextContent("false");
    expect(actualRepoIsOpen).toHaveTextContent("false");
    expect(actualStarredIsOpen).toHaveTextContent("false");
    expect(actualRepoStorage).toHaveTextContent("0");
    expect(actualStarredStorage).toHaveTextContent("0");
  });
});
