import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";

interface AutoNightModeSettings {
  enabled: boolean;
  alwaysActive: boolean;
}

export function useAutoNightMode() {
  const { theme, setTheme } = useTheme();
  const themeRef = useRef(theme);
  
  // Update ref when theme changes
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);
  
  const [settings, setSettings] = useState<AutoNightModeSettings>(() => {
    const stored = localStorage.getItem("auto-night-mode-settings");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { enabled: false, alwaysActive: false };
      }
    }
    return { enabled: false, alwaysActive: false };
  });

  // Check if current time is between 20:00 and 07:00
  const checkIsNightTime = () => {
    const hour = new Date().getHours();
    return hour >= 20 || hour < 7;
  };

  // Update settings in localStorage
  const updateSettings = (newSettings: Partial<AutoNightModeSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem("auto-night-mode-settings", JSON.stringify(updated));
  };

  // Effect to apply auto night mode
  useEffect(() => {
    if (settings.alwaysActive) {
      setTheme("dark");
      return;
    }

    if (settings.enabled) {
      const applyThemeBasedOnTime = () => {
        const nightTime = checkIsNightTime();
        const currentTheme = themeRef.current || "light";
        
        if (nightTime) {
          // Save current theme before switching to dark (if not already dark)
          if (currentTheme !== "dark") {
            localStorage.setItem("theme-before-night-mode", currentTheme);
            setTheme("dark");
          }
        } else {
          // Restore previous theme when day time (only if currently on dark)
          if (currentTheme === "dark") {
            const previousTheme = localStorage.getItem("theme-before-night-mode");
            if (previousTheme) {
              setTheme(previousTheme);
              localStorage.removeItem("theme-before-night-mode");
            }
          }
        }
      };

      // Check immediately
      applyThemeBasedOnTime();

      // Check every minute
      const interval = setInterval(applyThemeBasedOnTime, 60000);

      return () => clearInterval(interval);
    }
  }, [settings, setTheme]);

  return {
    settings,
    updateSettings,
    isNightTime: checkIsNightTime(),
  };
}
