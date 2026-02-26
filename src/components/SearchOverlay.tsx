import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X, BookOpen, Users, UserCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mockBooks, mockCommunities, mockUsers } from "@/lib/mockData";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (!open) return;
        onClose();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const q = query.toLowerCase().trim();

  const matchedBooks = useMemo(() => {
    if (!q) return [];
    return mockBooks
      .filter(
        (book) =>
          book.title.toLowerCase().includes(q)
          || book.author.toLowerCase().includes(q)
          || (book.saga ?? "").toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [q]);

  const matchedGroups = useMemo(() => {
    if (!q) return [];
    return mockCommunities.filter((community) => community.name.toLowerCase().includes(q)).slice(0, 4);
  }, [q]);

  const matchedUsers = useMemo(() => {
    if (!q) return [];
    return mockUsers.filter((user) => user.name.toLowerCase().includes(q)).slice(0, 4);
  }, [q]);

  const hasResults = matchedBooks.length + matchedGroups.length + matchedUsers.length > 0;

  const goToAdvancedSearch = () => {
    const params = new URLSearchParams({ q: query });
    onClose();
    navigate(`/search?${params.toString()}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-[70] w-[95vw] max-w-2xl"
          >
            <div className="rounded-2xl bg-card border border-border shadow-float overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cerca..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <button onClick={onClose} className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="px-4 py-3 border-b border-border bg-background/40">
                <button
                  onClick={goToAdvancedSearch}
                  className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90"
                >
                  Avvia ricerca avanzata
                </button>
              </div>

              <div className="max-h-[50vh] overflow-y-auto">
                {!q && (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Inizia a digitare per cercare libri, autori, utenti o gruppi...
                    <p className="text-[10px] mt-1">⌘K per aprire/chiudere</p>
                  </div>
                )}

                {q && !hasResults && (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Nessun risultato per "{query}"
                  </div>
                )}

                {matchedBooks.length > 0 && (
                  <div className="p-2">
                    <p className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                      <BookOpen className="h-3 w-3" /> Libri
                    </p>
                    {matchedBooks.map((book) => (
                      <Link
                        key={book.id}
                        to={`/book/${book.id}`}
                        onClick={onClose}
                        className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-secondary transition-colors"
                      >
                        <img src={book.cover} alt={book.title} className="w-8 h-12 rounded object-cover" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{book.title}</p>
                          <p className="text-xs text-muted-foreground">{book.author}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {matchedUsers.length > 0 && (
                  <div className="p-2 border-t border-border">
                    <p className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Utenti</p>
                    {matchedUsers.map((user) => (
                      <Link key={user.id} to="/profile" onClick={onClose} className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-secondary transition-colors">
                        <UserCircle className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.bio}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {matchedGroups.length > 0 && (
                  <div className="p-2 border-t border-border">
                    <p className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Gruppi</p>
                    {matchedGroups.map((group) => (
                      <Link key={group.id} to={`/community/${group.id}`} onClick={onClose} className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-secondary transition-colors">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{group.name}</p>
                          <p className="text-xs text-muted-foreground">{group.members.toLocaleString()} membri</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
