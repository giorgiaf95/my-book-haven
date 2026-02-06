import { Settings as SettingsIcon, Moon, Clock } from "lucide-react";
import { ThemeSelector } from "@/components/ThemeSelector";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAutoNightMode } from "@/hooks/useAutoNightMode";
import { motion } from "framer-motion";

export default function Settings() {
  const { settings, updateSettings, isNightTime } = useAutoNightMode();

  return (
    <div className="container max-w-6xl py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <SettingsIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-display">Impostazioni</h1>
            <p className="text-muted-foreground">Personalizza la tua esperienza</p>
          </div>
        </div>
      </motion.div>

      {/* Appearance Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Aspetto</CardTitle>
            <CardDescription>
              Scegli il tema che preferisci per l'applicazione
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ThemeSelector />
          </CardContent>
        </Card>
      </motion.div>

      {/* Night Mode Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5" />
              Modalità Notte
            </CardTitle>
            <CardDescription>
              Gestisci l'attivazione automatica del tema scuro
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sync with time */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Sincronizza con orario
                  </label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Attiva automaticamente il tema scuro dalle 20:00 alle 07:00
                  {isNightTime && settings.enabled && (
                    <span className="ml-2 text-primary font-medium">
                      (Attualmente attivo)
                    </span>
                  )}
                </p>
              </div>
              <Switch
                checked={settings.enabled}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateSettings({ enabled: true, alwaysActive: false });
                  } else {
                    updateSettings({ enabled: false });
                  }
                }}
                disabled={settings.alwaysActive}
              />
            </div>

            {/* Always active */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-muted-foreground" />
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Sempre attiva
                  </label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Forza sempre il tema scuro indipendentemente dall'orario
                </p>
              </div>
              <Switch
                checked={settings.alwaysActive}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateSettings({ alwaysActive: true, enabled: false });
                  } else {
                    updateSettings({ alwaysActive: false });
                  }
                }}
                disabled={settings.enabled}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
