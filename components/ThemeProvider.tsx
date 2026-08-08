"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
});

function applyTheme(t: Theme) {
  document.documentElement.setAttribute("data-theme", t);
  // Force body bg via inline style — CSS [data-theme] body rules are stripped by Turbopack
  if (t === "dark") {
    document.body.style.setProperty("background-color", "#111111", "important");
    document.body.style.setProperty("color", "#e8e8e8", "important");
  } else {
    document.body.style.removeProperty("background-color");
    document.body.style.removeProperty("color");
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initial = stored ?? preferred;
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggle = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", next);
      applyTheme(next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
