import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface AutoNightModeSettings {
  enabled: boolean;
  alwaysActive: boolean;
}

export function useAutoNightMode() {
  const { setTheme } = useTheme();
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
  const isNightTime = () => {
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
      // Check immediately
      if (isNightTime()) {
        setTheme("dark");
      }

      // Check every minute
      const interval = setInterval(() => {
        if (isNightTime()) {
          setTheme("dark");
        }
      }, 60000); // 60 seconds

      return () => clearInterval(interval);
    }
  }, [settings, setTheme]);

  return {
    settings,
    updateSettings,
    isNightTime: isNightTime(),
  };
}
