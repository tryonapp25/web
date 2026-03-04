import { createContext, useContext, useState, useEffect, useRef } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Check localStorage, default to 'dark'
    const saved = localStorage.getItem("theme");
    return saved || "dark";
  });
  
  // Track if theme is being overridden (e.g., by business pages)
  const previousThemeRef = useRef(null);

  useEffect(() => {
    // Apply theme to document root
    document.documentElement.setAttribute("data-theme", theme);
    // Only save to localStorage if not being overridden
    if (previousThemeRef.current === null) {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };
  
  // Force a specific theme temporarily (for business pages)
  const forceTheme = (forcedTheme) => {
    previousThemeRef.current = theme;
    setTheme(forcedTheme);
  };
  
  // Restore the previous theme
  const restoreTheme = () => {
    if (previousThemeRef.current !== null) {
      setTheme(previousThemeRef.current);
      previousThemeRef.current = null;
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, forceTheme, restoreTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export default ThemeContext;
