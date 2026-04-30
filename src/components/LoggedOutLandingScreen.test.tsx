import { fireEvent, render, screen } from "@testing-library/react";

import {
  RepoConsultingContext,
  type RepoConsultingContextValue,
} from "../contexts/RepoConsultingContext";
import { LoggedOutLandingScreen } from "./LoggedOutLandingScreen";

const baseContext: RepoConsultingContextValue = {
  isAuthenticated: false,
  lastSearch: undefined,
  startSession: jest.fn(),
  logout: jest.fn(),
  insertNewSearch: jest.fn(),
};

function renderLoggedOutLandingScreen(
  contextOverrides: Partial<RepoConsultingContextValue> = {}
) {
  const context = { ...baseContext, ...contextOverrides };

  return render(
    <RepoConsultingContext.Provider value={context}>
      <LoggedOutLandingScreen />
    </RepoConsultingContext.Provider>
  );
}

describe("LoggedOutLandingScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the login experience inspired by bi8Au", () => {
    renderLoggedOutLandingScreen();

    expect(
      screen.getByRole("heading", {
        name: "Entre para consultar repositórios GitHub",
      })
    ).toBeInTheDocument();
    expect(screen.getByText("github-search.local/auth")).toBeInTheDocument();
    expect(
      screen.getByText("OAuth GitHub pronto para iniciar")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /entrar com github/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId("github-login-icon")).toBeInTheDocument();
  });

  it("starts a new session when the GitHub entry button is clicked", () => {
    const startSession = jest.fn();

    renderLoggedOutLandingScreen({ startSession });

    fireEvent.click(screen.getByRole("button", { name: /entrar com github/i }));

    expect(startSession).toHaveBeenCalledTimes(1);
  });
});
