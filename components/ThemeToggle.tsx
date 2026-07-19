"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by mounting client-side first
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-btn bg-background-deep/50 border border-border-hairline-soft shrink-0" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-10 h-10 rounded-btn bg-background-deep border border-border-hairline-soft flex items-center justify-center text-ink hover:bg-brand/20 transition-all cursor-pointer shrink-0"
      aria-label="Toggle theme mode"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-accent animate-in spin-in-90 duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-text-muted animate-in spin-in-90 duration-300" />
      )}
    </button>
  );
}
