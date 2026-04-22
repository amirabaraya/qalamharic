"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="focus-ring grid size-11 place-items-center rounded-full border border-charcoal/10 bg-cream text-charcoal transition hover:-translate-y-0.5 dark:border-cream/10 dark:bg-charcoal dark:text-cream"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <Icon size={19} aria-hidden="true" />
    </button>
  );
}
