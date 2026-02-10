import { BarChart3, BookOpen, Clock, Trophy, TrendingUp, Star, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { mockBooks, mockChallenges, mockReviews } from "@/lib/mockData";

const Statistics = () => {
  const booksRead = mockBooks.filter(b => b.status === "read").length;
  const booksReading = mockBooks.filter(b => b.status === "reading").length;
  const booksToRead = mockBooks.filter(b => b.status === "to-read").length;
  const totalPages = mockBooks.filter(b => b.status === "read").reduce((sum, b) => sum + b.pages, 0);
  const avgRating = (mockBooks.reduce((sum, b) => sum + b.rating, 0) / mockBooks.length).toFixed(1);
  const challengesCompleted = mockChallenges.filter(c => c.current >= c.target).length;

  const genreCount: Record<string, number> = {};
  mockBooks.forEach(b => b.genre.forEach(g => { genreCount[g] = (genreCount[g] || 0) + 1; }));
  const topGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxGenre = topGenres[0]?.[1] || 1;

  const monthlyReading = [
    { month: "Set", books: 3 }, { month: "Ott", books: 5 }, { month: "Nov", books: 4 },
    { month: "Dic", books: 2 }, { month: "Gen", books: 6 }, { month: "Feb", books: 3 },
  ];
  const maxMonthly = Math.max(...monthlyReading.map(m => m.books));

  return (
    <div className="container py-6 md:py-10 space-y-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-primary" /> Le mie statistiche
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Il tuo riepilogo di lettura</p>
      </motion.div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {[
          { label: "Libri letti", value: booksRead, icon: BookOpen, color: "text-primary" },
          { label: "In lettura", value: booksReading, icon: Clock, color: "text-accent" },
          { label: "Da leggere", value: booksToRead, icon: TrendingUp, color: "text-muted-foreground" },
          { label: "Pagine lette", value: totalPages.toLocaleString(), icon: BookOpen, color: "text-primary" },
          { label: "Valutazione media", value: avgRating, icon: Star, color: "text-warm-gold" },
          { label: "Recensioni", value: mockReviews.length, icon: Star, color: "text-accent" },
          { label: "Sfide completate", value: challengesCompleted, icon: Trophy, color: "text-primary" },
          { label: "Iscritto da", value: "Gen 2024", icon: Calendar, color: "text-muted-foreground" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl bg-card border border-border p-4 shadow-card text-center"
            >
              <Icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
              <p className="text-xl font-bold text-foreground font-display">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Reading by month */}
      <section className="rounded-2xl bg-card border border-border p-6 shadow-card">
        <h2 className="font-display font-semibold text-lg text-foreground mb-4">Libri letti per mese</h2>
        <div className="flex items-end gap-3 h-40">
          {monthlyReading.map((m, i) => (
            <motion.div
              key={m.month}
              initial={{ height: 0 }}
              animate={{ height: `${(m.books / maxMonthly) * 100}%` }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: "easeOut" }}
              className="flex-1 flex flex-col items-center justify-end"
            >
              <span className="text-xs font-bold text-foreground mb-1">{m.books}</span>
              <div className="w-full rounded-t-lg bg-primary/80 min-h-[4px]" style={{ height: "100%" }} />
              <span className="text-[10px] text-muted-foreground mt-2">{m.month}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Top genres */}
      <section className="rounded-2xl bg-card border border-border p-6 shadow-card">
        <h2 className="font-display font-semibold text-lg text-foreground mb-4">Generi preferiti</h2>
        <div className="space-y-3">
          {topGenres.map(([genre, count], i) => (
            <motion.div
              key={genre}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-foreground">{genre}</span>
                <span className="text-xs text-muted-foreground">{count} libri</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(count / maxGenre) * 100}%` }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                  className="h-full rounded-full bg-accent"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Statistics;
