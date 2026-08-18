import { act, fireEvent, render } from "@testing-library/react-native";
import { Text } from "react-native";
import { CooldownPressable } from "../CooldownPressable";

describe("CooldownPressable", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it("ignores repeated presses for four seconds", () => {
    const onPress = jest.fn();
    const screen = render(
      <CooldownPressable onPress={onPress}>
        <Text>Abrir</Text>
      </CooldownPressable>,
    );
    const button = screen.getByRole("button");

    fireEvent.press(button);
    fireEvent.press(button);
    fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(4_000);
    });
    fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(2);
  });
});
