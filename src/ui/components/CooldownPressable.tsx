import {
  type ComponentProps,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Pressable } from "react-native";

type PressableProps = ComponentProps<typeof Pressable>;

type CooldownPressableProps = PropsWithChildren<
  Omit<PressableProps, "disabled" | "onPress"> & {
    onPress: () => void | Promise<void>;
    cooldownMs?: number;
  }
>;

export function CooldownPressable({
  children,
  cooldownMs = 4_000,
  onPress,
  style,
  ...props
}: CooldownPressableProps) {
  const lockedRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [disabled, setDisabled] = useState(false);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  const handlePress = useCallback(() => {
    if (lockedRef.current) return;

    lockedRef.current = true;
    setDisabled(true);
    timeoutRef.current = setTimeout(() => {
      lockedRef.current = false;
      setDisabled(false);
      timeoutRef.current = null;
    }, cooldownMs);

    void Promise.resolve(onPress()).catch(() => undefined);
  }, [cooldownMs, onPress]);

  return (
    <Pressable
      accessibilityRole="button"
      {...props}
      disabled={disabled}
      onPress={handlePress}
      accessibilityState={{ disabled }}
      style={(state) => [
        typeof style === "function" ? style(state) : style,
        disabled ? { opacity: 0.58 } : null,
      ]}
    >
      {children}
    </Pressable>
  );
}
