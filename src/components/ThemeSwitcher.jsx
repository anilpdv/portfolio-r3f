import { memo } from "react";
import { useTheme } from "../context/ThemeContext";

const icons = {
  moon: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  sun: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  zap: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
};

const ThemeSwitcher = memo(function ThemeSwitcher() {
  const { theme, themeName, cycleTheme, isTransitioning } = useTheme();

  return (
    <button
      onClick={cycleTheme}
      disabled={isTransitioning}
      className="theme-switcher"
      aria-label={`Switch theme (current: ${theme.name})`}
      title={`Current: ${theme.name} - Click to switch`}
      style={{
        "--glow-color": theme.glow.color,
        "--button-bg": theme.ui?.buttonBg || "rgba(20, 20, 30, 0.8)",
        "--button-text": theme.ui?.buttonText || "#ffffff",
      }}
    >
      <span className={`theme-icon ${isTransitioning ? "transitioning" : ""}`}>
        {icons[theme.icon]}
      </span>
      <span className="theme-label">{theme.name}</span>
    </button>
  );
});

export default ThemeSwitcher;
