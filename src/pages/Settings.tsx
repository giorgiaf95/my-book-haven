import { useState } from "react";
import { Settings as SettingsIcon, User, Bell, Palette, Shield, Globe, LogOut, Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/ThemeProvider";

type SettingsSection = "profile" | "notifications" | "appearance" | "privacy" | "language";

const sections = [
  { id: "profile" as const, label: "Profilo", icon: User },
  { id: "notifications" as const, label: "Notifiche", icon: Bell },
  { id: "appearance" as const, label: "Aspetto", icon: Palette },
  { id: "privacy" as const, label: "Privacy", icon: Shield },
  { id: "language" as const, label: "Lingua", icon: Globe },
];

const themes = [
  { id: "light" as const, name: "Chiaro", preview: "bg-[hsl(36,33%,97%)]", border: "border-[hsl(30,15%,88%)]", dot: "bg-[hsl(28,80%,52%)]" },
  { id: "dark" as const, name: "Scuro", preview: "bg-[hsl(24,10%,10%)]", border: "border-[hsl(24,8%,20%)]", dot: "bg-[hsl(28,80%,55%)]" },
  { id: "sepia" as const, name: "Seppia", preview: "bg-[hsl(35,40%,92%)]", border: "border-[hsl(30,25%,78%)]", dot: "bg-[hsl(28,65%,48%)]" },
];

const Settings = () => {
  const [active, setActive] = useState<SettingsSection>("profile");
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifGroups, setNotifGroups] = useState(true);
  const [notifChallenges, setNotifChallenges] = useState(false);
  const [profilePublic, setProfilePublic] = useState(true);
  const [showActivity, setShowActivity] = useState(true);
  const [language, setLanguage] = useState("it");
  const { theme, setTheme } = useTheme();

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!checked)}
      className={cn("w-10 h-6 rounded-full transition-colors relative", checked ? "bg-primary" : "bg-border")}
    >
      <span className={cn("absolute top-1 h-4 w-4 rounded-full bg-card transition-transform", checked ? "left-5" : "left-1")} />
    </button>
  );

  return (
    <div className="container py-6 md:py-10 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2 mb-6">
          <SettingsIcon className="h-6 w-6 text-primary" /> Impostazioni
        </h1>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible md:w-48 shrink-0">
          {sections.map(s => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                  active === s.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <Icon className="h-4 w-4" /> {s.label}
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <div className="flex-1 rounded-2xl bg-card border border-border p-6 shadow-card">
          {active === "profile" && (
            <div className="space-y-5">
              <h2 className="font-display font-semibold text-lg text-foreground">Profilo</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nome</label>
                  <input defaultValue="Marco Lettore" className="mt-1 w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Username</label>
                  <input defaultValue="@marcolettore" className="mt-1 w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Bio</label>
                  <textarea defaultValue="Appassionato lettore e collezionista di storie." rows={3} className="mt-1 w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Posizione</label>
                  <input defaultValue="Milano, Italia" className="mt-1 w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</label>
                  <input defaultValue="lettore@biblion.app" type="email" className="mt-1 w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <button className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Salva modifiche</button>
              </div>
            </div>
          )}

          {active === "notifications" && (
            <div className="space-y-5">
              <h2 className="font-display font-semibold text-lg text-foreground">Notifiche</h2>
              <div className="space-y-4">
                {[
                  { label: "Notifiche email", desc: "Ricevi aggiornamenti via email", checked: notifEmail, onChange: setNotifEmail },
                  { label: "Notifiche push", desc: "Notifiche nel browser", checked: notifPush, onChange: setNotifPush },
                  { label: "Aggiornamenti gruppi", desc: "Nuovi post nei gruppi iscritti", checked: notifGroups, onChange: setNotifGroups },
                  { label: "Sfide", desc: "Promemoria e traguardi delle sfide", checked: notifChallenges, onChange: setNotifChallenges },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Toggle checked={item.checked} onChange={item.onChange} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {active === "appearance" && (
            <div className="space-y-5">
              <h2 className="font-display font-semibold text-lg text-foreground">Aspetto</h2>
              <p className="text-sm text-muted-foreground">Seleziona il tema dell'app</p>
              <div className="grid grid-cols-3 gap-3">
                {themes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={cn(
                      "rounded-xl border-2 p-4 text-center transition-all hover:scale-105 relative",
                      t.preview, t.border,
                      theme === t.id && "ring-2 ring-primary ring-offset-2 ring-offset-card"
                    )}
                  >
                    <div className={cn("w-4 h-4 rounded-full mx-auto mb-2", t.dot)} />
                    <span className={cn(
                      "text-sm font-medium",
                      t.id === "dark" ? "text-[hsl(36,20%,90%)]" : "text-[hsl(24,10%,15%)]"
                    )}>
                      {t.name}
                    </span>
                    {theme === t.id && (
                      <span className="absolute top-2 right-2">
                        <Check className={cn("h-4 w-4", t.id === "dark" ? "text-[hsl(28,80%,55%)]" : "text-[hsl(28,80%,52%)]")} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {active === "privacy" && (
            <div className="space-y-5">
              <h2 className="font-display font-semibold text-lg text-foreground">Privacy</h2>
              <div className="space-y-4">
                {[
                  { label: "Profilo pubblico", desc: "Permetti agli altri di vedere il tuo profilo", checked: profilePublic, onChange: setProfilePublic },
                  { label: "Mostra attività", desc: "Mostra cosa stai leggendo ai tuoi amici", checked: showActivity, onChange: setShowActivity },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Toggle checked={item.checked} onChange={item.onChange} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {active === "language" && (
            <div className="space-y-5">
              <h2 className="font-display font-semibold text-lg text-foreground">Lingua</h2>
              <select value={language} onChange={e => setLanguage(e.target.value)} className="px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="it">🇮🇹 Italiano</option>
                <option value="en">🇬🇧 English</option>
                <option value="es">🇪🇸 Español</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="de">🇩🇪 Deutsch</option>
              </select>
            </div>
          )}

          {/* Logout */}
          <div className="mt-8 pt-5 border-t border-border">
            <button className="flex items-center gap-2 text-sm text-destructive hover:underline">
              <LogOut className="h-4 w-4" /> Esci dal tuo account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
