import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home, BookOpen, Compass, Users, Trophy, QrCode, Search, Bell, User,
  Settings, LogOut, Heart, ListChecks, UserCircle, ChevronDown, BarChart3, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { SearchOverlay } from "@/components/SearchOverlay";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/library", label: "Libreria", icon: BookOpen },
  { path: "/explore", label: "Esplora", icon: Compass },
  { path: "/community", label: "Community", icon: Users },
  { path: "/challenges", label: "Sfide", icon: Trophy },
];

const profileMenuItems = [
  { label: "Il mio profilo", icon: UserCircle, path: "/profile" },
  { label: "Wishlist", icon: Heart, path: "/wishlist" },
  { label: "Le mie liste", icon: ListChecks, path: "/my-lists" },
  { label: "Statistiche", icon: BarChart3, path: "/statistics" },
  { label: "Impostazioni", icon: Settings, path: "/settings" },
];

const mockNotifications = [
  { id: "n1", text: "Sofia V. ha iniziato a seguirti", time: "5 min fa", read: false },
  { id: "n2", text: "Nuovo libro del mese nel gruppo Lettori Notturni", time: "1 ora fa", read: false },
  { id: "n3", text: "Hai raggiunto il 65% nella sfida '52 Libri'!", time: "3 ore fa", read: false },
  { id: "n4", text: "Andrea M. ha commentato la tua recensione", time: "1 giorno fa", read: true },
  { id: "n5", text: "Nuova sfida disponibile: Classici del 2026", time: "2 giorni fa", read: true },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    if (profileOpen || notifOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [profileOpen, notifOpen]);

  // Close on route change
  useEffect(() => {
    setProfileOpen(false);
    setNotifOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <BookOpen className="h-7 w-7 text-primary" />
            <span className="font-display text-xl font-bold text-foreground hidden sm:inline">Biblion</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
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

          {/* Centered search bar */}
          <div className="flex-1 flex justify-center px-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full max-w-md flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/60 border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Cerca libri, autori, gruppi...</span>
              <span className="sm:hidden">Cerca...</span>
              <kbd className="hidden md:inline-flex ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-background border border-border">⌘K</kbd>
            </button>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              <QrCode className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors relative"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-80 rounded-xl bg-card border border-border shadow-float overflow-hidden z-50"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                      <h3 className="text-sm font-semibold text-foreground">Notifiche</h3>
                      <button className="text-[10px] text-primary font-medium hover:underline">Segna tutte come lette</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {mockNotifications.map(n => (
                        <div key={n.id} className={cn("px-4 py-3 border-b border-border last:border-b-0 transition-colors hover:bg-secondary/50", !n.read && "bg-primary/5")}>
                          <div className="flex items-start gap-2">
                            {!n.read && <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />}
                            <div className={cn(!n.read ? "" : "ml-4")}>
                              <p className="text-sm text-foreground">{n.text}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
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

      {/* Search overlay */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

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
                  isActive ? "text-primary" : "text-muted-foreground"
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
