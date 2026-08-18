import { ThemeProvider } from "@shopify/restyle";
import { fireEvent, render } from "@testing-library/react-native";
import type { PropsWithChildren } from "react";
import { theme } from "@/ui/theme/theme";
import { OfflineState } from "../OfflineState";

jest.mock("@expo/vector-icons/Feather", () => "FeatherIcon");

function wrapper({ children }: PropsWithChildren) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

describe("OfflineState", () => {
  it("explains the first offline load and retries on demand", () => {
    const onRetry = jest.fn();
    const screen = render(<OfflineState onRetry={onRetry} />, { wrapper });

    expect(screen.getByText("Sem conexão com a internet")).toBeTruthy();
    expect(
      screen.getByText(
        "Conecte-se para carregar este conteúdo pela primeira vez.",
      ),
    ).toBeTruthy();

    fireEvent.press(screen.getByText("Tentar novamente"));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("offers navigation back on detail screens", () => {
    const onBack = jest.fn();
    const screen = render(
      <OfflineState onRetry={jest.fn()} onBack={onBack} />,
      { wrapper },
    );

    fireEvent.press(screen.getByLabelText("Voltar"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
