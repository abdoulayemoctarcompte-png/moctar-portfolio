import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const lire = (): Theme => {
  try {
    const t = localStorage.getItem("theme");
    if (t === "light" || t === "dark") return t;
  } catch {
    /* stockage indisponible : on suit le système */
  }
  return typeof matchMedia !== "undefined" && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(lire);

  useEffect(() => {
    const racine = document.documentElement;
    racine.classList.toggle("dark", theme === "dark");
    racine.style.colorScheme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* ignoré */
    }
  }, [theme]);

  const basculer = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);
  return { theme, basculer };
}
