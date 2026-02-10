import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, X, BookOpen, Users, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mockBooks, mockCommunities, mockChallenges } from "@/lib/mockData";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
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
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (!open) return; // parent handles open
        onClose();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const q = query.toLowerCase();
  const matchedBooks = q ? mockBooks.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)).slice(0, 5) : [];
  const matchedGroups = q ? mockCommunities.filter(c => c.name.toLowerCase().includes(q)).slice(0, 3) : [];
  const matchedChallenges = q ? mockChallenges.filter(c => c.title.toLowerCase().includes(q)).slice(0, 3) : [];
  const hasResults = matchedBooks.length + matchedGroups.length + matchedChallenges.length > 0;

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
            className="fixed top-16 left-1/2 -translate-x-1/2 z-[70] w-[90vw] max-w-lg"
          >
            <div className="rounded-2xl bg-card border border-border shadow-float overflow-hidden">
              {/* Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Cerca libri, autori, gruppi..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <button onClick={onClose} className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {!q && (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Inizia a digitare per cercare...
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
                    <p className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Libri</p>
                    {matchedBooks.map(book => (
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

                {matchedGroups.length > 0 && (
                  <div className="p-2 border-t border-border">
                    <p className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Gruppi</p>
                    {matchedGroups.map(g => (
                      <Link key={g.id} to={`/community/${g.id}`} onClick={onClose} className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-secondary transition-colors">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{g.name}</p>
                          <p className="text-xs text-muted-foreground">{g.members.toLocaleString()} membri</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {matchedChallenges.length > 0 && (
                  <div className="p-2 border-t border-border">
                    <p className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Sfide</p>
                    {matchedChallenges.map(c => (
                      <Link key={c.id} to={`/challenge/${c.id}`} onClick={onClose} className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-secondary transition-colors">
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground">{c.title}</p>
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
