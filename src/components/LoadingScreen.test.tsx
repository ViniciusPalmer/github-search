import { render, screen } from "@testing-library/react";
import { LoadingScreen } from "./LoadingScreen";

describe("LoadingScreen", () => {
  it("renders an accessible loading status", () => {
    // Arrange
    render(<LoadingScreen />);

    // Act
    const actualLoadingStatus = screen.getByRole("status", {
      name: "Carregando",
    });

    // Assert
    expect(actualLoadingStatus).toBeInTheDocument();
  });
});
