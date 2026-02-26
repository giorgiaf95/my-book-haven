import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Grid3X3, Settings, BarChart3, Printer, Star } from "lucide-react";
import { mockBooks, type Book } from "@/lib/mockData";
import { cn } from "@/lib/utils";

type SortBy = "title" | "author" | "rating" | "dateAdded";
type ShelfFilter = "all" | Book["status"];

const shelfLabels: Record<ShelfFilter, string> = {
  all: "Tutti",
  reading: "In lettura",
  read: "Letti",
  "to-read": "Da leggere",
  abandoned: "Abbandonati",
};

const statusClass: Record<Book["status"], string> = {
  reading: "bg-primary/15 text-primary",
  read: "bg-accent/15 text-accent",
  "to-read": "bg-secondary text-secondary-foreground",
  abandoned: "bg-destructive/15 text-destructive",
};

const Library = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("title");
  const [shelfFilter, setShelfFilter] = useState<ShelfFilter>("all");
  const [genreFilter, setGenreFilter] = useState<string | null>(null);

  const statusFromQuery = searchParams.get("status");

  useEffect(() => {
    if (statusFromQuery === "reading" || statusFromQuery === "read" || statusFromQuery === "to-read" || statusFromQuery === "abandoned") {
      setShelfFilter(statusFromQuery);
      return;
    }
    if (statusFromQuery === null) {
      setShelfFilter("all");
    }
  }, [statusFromQuery]);

  const shelfCounts = useMemo(() => {
    const counts = {
      all: mockBooks.length,
      reading: mockBooks.filter((book) => book.status === "reading").length,
      read: mockBooks.filter((book) => book.status === "read").length,
      "to-read": mockBooks.filter((book) => book.status === "to-read").length,
      abandoned: mockBooks.filter((book) => book.status === "abandoned").length,
    };
    return counts;
  }, []);

  const genreCounts = useMemo(() => {
    const counts = new Map<string, number>();
    mockBooks.forEach((book) => {
      book.genre.forEach((genre) => {
        counts.set(genre, (counts.get(genre) ?? 0) + 1);
      });
    });
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, []);

  const filteredBooks = useMemo(() => {
    let books = [...mockBooks];

    if (query.trim()) {
      const q = query.toLowerCase();
      books = books.filter(
        (book) =>
          book.title.toLowerCase().includes(q)
          || book.author.toLowerCase().includes(q)
          || (book.saga ?? "").toLowerCase().includes(q)
      );
    }

    if (shelfFilter !== "all") {
      books = books.filter((book) => book.status === shelfFilter);
    }

    if (genreFilter) {
      books = books.filter((book) => book.genre.includes(genreFilter));
    }

    books.sort((a, b) => {
      switch (sortBy) {
        case "author":
          return a.author.localeCompare(b.author);
        case "rating":
          return b.rating - a.rating;
        case "dateAdded":
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        default:
          return a.title.localeCompare(b.title);
      }
    });

    return books;
  }, [genreFilter, query, shelfFilter, sortBy]);

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={cn("h-3.5 w-3.5", i < full ? "fill-primary text-primary" : "text-border")} />
        ))}
      </div>
    );
  };

  return (
    <div className="container py-6 md:py-10 space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">La mia libreria</h1>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="relative min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cerca e aggiungi libri"
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <button className="px-2 py-1 rounded hover:bg-secondary">Batch edit</button>
            <button className="p-1 rounded hover:bg-secondary"><Settings className="h-4 w-4" /></button>
            <button className="p-1 rounded hover:bg-secondary"><BarChart3 className="h-4 w-4" /></button>
            <button className="p-1 rounded hover:bg-secondary"><Printer className="h-4 w-4" /></button>
            <button className="p-1 rounded hover:bg-secondary"><Grid3X3 className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-5">
        <aside className="space-y-4">
          <section className="rounded-xl bg-card border border-border p-4">
            <h2 className="text-sm font-semibold text-foreground">Bookshelves</h2>
            <div className="mt-2 space-y-1">
              {(Object.keys(shelfLabels) as ShelfFilter[]).map((shelf) => (
                <button
                  key={shelf}
                  onClick={() => setShelfFilter(shelf)}
                  className={cn(
                    "w-full text-left px-2 py-1 rounded text-sm transition-colors",
                    shelfFilter === shelf ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {shelfLabels[shelf]} ({shelfCounts[shelf]})
                </button>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-border space-y-1">
              {genreCounts.slice(0, 8).map(([genre, count]) => (
                <button
                  key={genre}
                  onClick={() => setGenreFilter((prev) => (prev === genre ? null : genre))}
                  className={cn(
                    "w-full text-left px-2 py-1 rounded text-sm transition-colors",
                    genreFilter === genre ? "bg-accent/15 text-accent" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {genre} ({count})
                </button>
              ))}
            </div>

            <button className="mt-3 px-2.5 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs">Aggiungi shelf</button>
          </section>

          <section className="rounded-xl bg-card border border-border p-4">
            <h3 className="text-sm font-semibold text-foreground">Attività lettura</h3>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>Bozze recensioni</li>
              <li>Challenge lettura</li>
              <li>Anno in libri</li>
              <li>Statistiche</li>
            </ul>
          </section>

          <section className="rounded-xl bg-card border border-border p-4">
            <h3 className="text-sm font-semibold text-foreground">Strumenti</h3>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>Trova duplicati</li>
              <li>Widget</li>
              <li>Importa / esporta</li>
            </ul>
          </section>
        </aside>

        <section className="rounded-xl bg-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead className="bg-background/70 border-b border-border">
                <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-2 font-semibold">Cover</th>
                  <th className="px-3 py-2 font-semibold">Titolo</th>
                  <th className="px-3 py-2 font-semibold">Autore</th>
                  <th className="px-3 py-2 font-semibold">Rating</th>
                  <th className="px-3 py-2 font-semibold">Scaffale</th>
                  <th className="px-3 py-2 font-semibold">Recensione</th>
                  <th className="px-3 py-2 font-semibold">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                  <tr key={book.id} className="border-b border-border last:border-b-0 align-top">
                    <td className="px-3 py-3">
                      <img src={book.cover} alt={book.title} className="w-12 h-[72px] rounded object-cover" />
                    </td>
                    <td className="px-3 py-3">
                      <Link to={`/book/${book.id}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                        {book.title}
                      </Link>
                      {book.saga && <p className="text-xs text-muted-foreground mt-0.5">{book.saga}</p>}
                    </td>
                    <td className="px-3 py-3 text-sm text-foreground">{book.author}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        {renderStars(book.rating)}
                        <span className="text-sm text-muted-foreground">{book.rating.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", statusClass[book.status])}>
                        {shelfLabels[book.status]}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm text-muted-foreground max-w-[260px]">
                      {book.description ? `${book.description.slice(0, 95)}${book.description.length > 95 ? "..." : ""}` : "Scrivi una recensione"}
                    </td>
                    <td className="px-3 py-3 text-xs">
                      <div className="flex flex-col gap-1">
                        <Link to={`/book/${book.id}`} className="text-primary hover:underline">modifica</Link>
                        <Link to={`/book/${book.id}`} className="text-muted-foreground hover:underline">visualizza</Link>
                        <button className="text-muted-foreground text-left hover:text-destructive">rimuovi</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBooks.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-muted-foreground text-sm">Nessun libro trovato con i filtri attuali.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Library;
