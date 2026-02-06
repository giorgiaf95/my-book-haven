import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home, BookOpen, Compass, Users, Trophy, QrCode, Search, Bell, User,
  Settings, LogOut, Library, Heart, ListChecks, UserCircle, ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/library", label: "Libreria", icon: BookOpen },
  { path: "/explore", label: "Esplora", icon: Compass },
  { path: "/community", label: "Community", icon: Users },
  { path: "/challenges", label: "Sfide", icon: Trophy },
];

const profileMenuItems = [
  { label: "Il mio profilo", icon: UserCircle, path: "/profile" },
  { label: "I miei preferiti", icon: Heart, path: "/library?tag=preferiti" },
  { label: "Le mie liste", icon: ListChecks, path: "/library" },
  { label: "Statistiche", icon: Library, path: "/" },
  { label: "Impostazioni", icon: Settings, path: "/settings" },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [profileOpen]);

  // Close on route change
  useEffect(() => {
    setProfileOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-primary" />
            <span className="font-display text-xl font-bold text-foreground">Biblion</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              <QrCode className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
            </button>

            {/* Profile menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className={cn(
                  "ml-1 flex items-center gap-1.5 rounded-full transition-all duration-200",
                  profileOpen ? "ring-2 ring-primary/30" : ""
                )}
              >
                <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <User className="h-4 w-4" />
                </div>
                <ChevronDown className={cn(
                  "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 hidden sm:block",
                  profileOpen && "rotate-180"
                )} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-card border border-border shadow-float overflow-hidden z-50"
                  >
                    {/* User info */}
                    <div className="p-4 border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                          L
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground">Lettore</p>
                          <p className="text-xs text-muted-foreground truncate">lettore@biblion.app</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span><strong className="text-foreground">34</strong> libri</span>
                        <span><strong className="text-foreground">7</strong> sfide</span>
                        <span><strong className="text-foreground">3</strong> gruppi</span>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="py-1.5">
                      {profileMenuItems.map(item => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.label}
                            to={item.path}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                          >
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-border py-1.5">
                      <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors">
                        <LogOut className="h-4 w-4" />
                        Esci
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pb-20 md:pb-8">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-lg">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all duration-200",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive && "fill-current")} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
