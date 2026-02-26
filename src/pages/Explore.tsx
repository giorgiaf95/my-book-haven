import { useMemo, useState } from "react";
import { Search, Sparkles, Users, Trophy, Megaphone, Clock3 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookCard } from "@/components/BookCard";
import { allGenres, mockBooks } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const bannerItems = [
  { id: "b1", title: "Concorso attivo", text: "Partecipa al contest 'Recensione Perfetta'", icon: Megaphone, action: "Scopri" },
  { id: "b2", title: "Nuova sfida", text: "Sfida 52 Libri: sei al 65%", icon: Trophy, action: "Apri sfida" },
  { id: "b3", title: "Countdown sfida", text: "Mancano 14 giorni alla chiusura", icon: Clock3, action: "Dettagli" },
  { id: "b4", title: "Attualmente in lettura", text: "Norwegian Wood · L'ombra del vento", icon: Users, action: "Vai in libreria" },
];

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Tutti");

  const query = searchQuery.trim().toLowerCase();

  const bixblionRecommended = useMemo(() => {
    return mockBooks
      .filter((book) => book.rating >= 4.4)
      .slice(0, 4);
  }, []);

  const friendsReading = useMemo(() => {
    return mockBooks
      .filter((book) => book.status === "reading")
      .slice(0, 6);
  }, []);

  const genreResults = useMemo(() => {
    return mockBooks.filter((book) => {
      const matchesText = query.length === 0
        || book.title.toLowerCase().includes(query)
        || book.author.toLowerCase().includes(query);
      const matchesGenre = selectedGenre === "Tutti" || book.genre.includes(selectedGenre);
      return matchesText && matchesGenre;
    }).slice(0, 8);
  }, [query, selectedGenre]);

  return (
    <div className="container py-6 md:py-10 space-y-6 max-w-6xl">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Esplora</h1>
        <p className="text-sm text-muted-foreground mt-1">Scopri nuovi mondi da leggere</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cerca libri o autori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-card text-sm"
          />
        </div>

        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="px-3 py-3 rounded-2xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="Tutti">Tutti i generi</option>
          {allGenres.map((genre) => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
      </div>

      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 p-6 md:p-8">
          <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" /> Cosa consiglia Bixblion
          </h2>
          <p className="text-sm text-muted-foreground mt-1 mb-5">I titoli più consigliati dalla piattaforma</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {bixblionRecommended.map((book, i) => (
              <BookCard key={book.id} book={book} index={i} />
            ))}
          </div>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 items-start">
        <div className="space-y-4">
          <section className="rounded-xl bg-card border border-border p-4 shadow-card">
            <h3 className="font-display text-lg font-semibold text-foreground mb-3">Cosa leggono i tuoi amici</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {friendsReading.map((book) => (
                <Link key={book.id} to={`/book/${book.id}`} className="rounded-lg bg-background border border-border p-2.5 hover:bg-secondary/50 transition-colors">
                  <div className="flex gap-2.5">
                    <img src={book.cover} alt={book.title} className="w-10 h-14 rounded object-cover" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{book.title}</p>
                      <p className="text-xs text-muted-foreground">{book.author}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-xl bg-card border border-border p-4 shadow-card">
            <h3 className="font-display text-lg font-semibold text-foreground mb-3">Risultati per genere</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {genreResults.map((book) => (
                <Link key={book.id} to={`/book/${book.id}`} className="rounded-lg bg-background border border-border p-2.5 hover:bg-secondary/50 transition-colors">
                  <div className="flex gap-2.5">
                    <img src={book.cover} alt={book.title} className="w-10 h-14 rounded object-cover" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{book.title}</p>
                      <p className="text-xs text-muted-foreground">{book.author}</p>
                      <p className="text-[10px] text-primary mt-0.5 truncate">{book.genre.join(" · ")}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {genreResults.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">Nessun libro trovato con i filtri attuali.</p>
            )}
          </section>
        </div>

        <aside className="space-y-3">
          {bannerItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="rounded-xl bg-card border border-border p-3 shadow-card">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{item.text}</p>
                <button className={cn("mt-2 text-xs font-medium text-primary hover:underline")}>{item.action}</button>
              </div>
            );
          })}
        </aside>
      </div>
    </div>
  );
};

export default Explore;
