import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const themes: Theme[] = [
  {
    id: "light",
    name: "Classic Light",
    colors: {
      primary: "hsl(28, 80%, 52%)",
      secondary: "hsl(36, 20%, 92%)",
      accent: "hsl(168, 45%, 40%)",
    },
  },
  {
    id: "dark",
    name: "Classic Dark",
    colors: {
      primary: "hsl(28, 80%, 55%)",
      secondary: "hsl(24, 10%, 18%)",
      accent: "hsl(168, 45%, 45%)",
    },
  },
  {
    id: "theme-rose",
    name: "Rose Theme",
    colors: {
      primary: "hsl(330, 80%, 55%)",
      secondary: "hsl(330, 20%, 92%)",
      accent: "hsl(280, 40%, 55%)",
    },
  },
  {
    id: "theme-blue",
    name: "Blue Theme",
    colors: {
      primary: "hsl(200, 80%, 50%)",
      secondary: "hsl(200, 20%, 92%)",
      accent: "hsl(180, 45%, 45%)",
    },
  },
  {
    id: "theme-green",
    name: "Green Theme",
    colors: {
      primary: "hsl(140, 60%, 45%)",
      secondary: "hsl(140, 15%, 92%)",
      accent: "hsl(80, 50%, 50%)",
    },
  },
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {themes.map((themeOption) => (
        <motion.div
          key={themeOption.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Card
            className={cn(
              "relative cursor-pointer transition-all duration-300 overflow-hidden",
              theme === themeOption.id
                ? "ring-2 ring-primary shadow-lg"
                : "hover:shadow-md"
            )}
            onClick={() => setTheme(themeOption.id)}
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-sm">{themeOption.name}</h3>
                {theme === themeOption.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-5 w-5 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </motion.div>
                )}
              </div>
              <div className="flex gap-2">
                <div
                  className="h-8 flex-1 rounded border"
                  style={{ backgroundColor: themeOption.colors.primary }}
                />
                <div
                  className="h-8 flex-1 rounded border"
                  style={{ backgroundColor: themeOption.colors.secondary }}
                />
                <div
                  className="h-8 flex-1 rounded border"
                  style={{ backgroundColor: themeOption.colors.accent }}
                />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
