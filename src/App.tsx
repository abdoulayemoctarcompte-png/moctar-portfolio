import { MotionConfig } from "motion/react";
import { useTheme } from "./hooks/useTheme";
import { Portfolio } from "./Portfolio";

export default function App() {
  const { theme, basculer } = useTheme();
  return (
    <MotionConfig reducedMotion="user">
      <Portfolio theme={theme} basculer={basculer} />
    </MotionConfig>
  );
}
