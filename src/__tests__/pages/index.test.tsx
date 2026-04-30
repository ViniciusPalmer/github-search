import { fireEvent, render, screen } from "@testing-library/react";

import { RepoConsultingProvider } from "../../contexts/RepoConsultingContext";
import Home from "../../pages/index";

jest.mock("../../components/AuthenticatedSearchScreen", () => ({
  AuthenticatedSearchScreen: () => {
    const { useRepoConsultingContext } = jest.requireActual(
      "../../contexts/RepoConsultingContext"
    );
    const { logout } = useRepoConsultingContext();

    return (
      <div>
        <p>Tela autenticada</p>
        <button type="button" onClick={logout}>
          Sair mock
        </button>
      </div>
    );
  },
}));

jest.mock("../../components/LoggedOutLandingScreen", () => ({
  LoggedOutLandingScreen: () => {
    const { useRepoConsultingContext } = jest.requireActual(
      "../../contexts/RepoConsultingContext"
    );
    const { startSession } = useRepoConsultingContext();

    return (
      <div>
        <p>Landing pública</p>
        <button type="button" onClick={startSession}>
          Entrar mock
        </button>
      </div>
    );
  },
}));

function renderHome() {
  return render(
    <RepoConsultingProvider>
      <Home />
    </RepoConsultingProvider>
  );
}

describe("Home page", () => {
  it("starts on the public landing state and opens the authenticated experience", () => {
    renderHome();

    expect(screen.getByText("Landing pública")).toBeInTheDocument();
    expect(screen.queryByText("Tela autenticada")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Entrar mock" }));

    expect(screen.getByText("Tela autenticada")).toBeInTheDocument();
    expect(screen.queryByText("Landing pública")).not.toBeInTheDocument();
  });

  it("returns to the public landing state after logout", () => {
    renderHome();
    fireEvent.click(screen.getByRole("button", { name: "Entrar mock" }));

    fireEvent.click(screen.getByRole("button", { name: "Sair mock" }));

    expect(screen.getByText("Landing pública")).toBeInTheDocument();
    expect(screen.queryByText("Tela autenticada")).not.toBeInTheDocument();
  });
});
