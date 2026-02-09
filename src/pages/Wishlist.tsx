import { useState } from "react";
import { Heart, Grid3X3, List, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BookCard } from "@/components/BookCard";
import { mockBooks, allGenres } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const Wishlist = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"dateAdded" | "title" | "author" | "rating">("dateAdded");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // For demo, wishlist = books tagged "preferiti"
  let wishlistBooks = mockBooks.filter(b => b.tags.includes("preferiti"));

  if (selectedGenres.length > 0) {
    wishlistBooks = wishlistBooks.filter(b => b.genre.some(g => selectedGenres.includes(g)));
  }

  wishlistBooks.sort((a, b) => {
    switch (sortBy) {
      case "title": return a.title.localeCompare(b.title);
      case "author": return a.author.localeCompare(b.author);
      case "rating": return b.rating - a.rating;
      default: return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    }
  });

  return (
    <div className="container py-6 md:py-10 space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" /> I miei preferiti
        </h1>
        <p className="text-sm text-muted-foreground mt-1">I libri che desideri leggere o che ami di più</p>
      </motion.div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center bg-card border border-border rounded-xl overflow-hidden">
          <button onClick={() => setView("grid")} className={cn("p-2.5 transition-colors", view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button onClick={() => setView("list")} className={cn("p-2.5 transition-colors", view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
            <List className="h-4 w-4" />
          </button>
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
          className="px-3 py-2 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
          <option value="dateAdded">Data aggiunta</option>
          <option value="title">Titolo</option>
          <option value="author">Autore</option>
          <option value="rating">Valutazione</option>
        </select>
        <button onClick={() => setShowFilters(!showFilters)}
          className={cn("flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-all",
            showFilters || selectedGenres.length > 0 ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border hover:bg-secondary")}>
          <SlidersHorizontal className="h-4 w-4" /> Filtri
          {selectedGenres.length > 0 && (
            <span className="h-5 w-5 rounded-full bg-primary-foreground text-primary text-[10px] flex items-center justify-center font-bold">{selectedGenres.length}</span>
          )}
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="rounded-xl bg-card border border-border p-4">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Generi</label>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {allGenres.map(g => (
                  <button key={g} onClick={() => setSelectedGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])}
                    className={cn("px-2.5 py-1 rounded-full text-xs font-medium transition-all", selectedGenres.includes(g) ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80")}>
                    {g}
                  </button>
                ))}
              </div>
              {selectedGenres.length > 0 && (
                <button onClick={() => setSelectedGenres([])} className="text-xs text-destructive font-medium hover:underline mt-2">Rimuovi filtri</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Books */}
      <div className={cn(view === "grid" ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" : "space-y-3")}>
        {wishlistBooks.map((book, i) => (
          <BookCard key={book.id} book={book} index={i} variant={view} />
        ))}
      </div>

      {wishlistBooks.length === 0 && (
        <div className="text-center py-16">
          <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">La tua wishlist è vuota</p>
          <p className="text-xs text-muted-foreground mt-1">Aggiungi libri ai preferiti per trovarli qui</p>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
