import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, Users, MessageSquare, Newspaper, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { BookCard } from "@/components/BookCard";
import { mockBooks, mockCommunities } from "@/lib/mockData";

const platformNews = [
  { id: "n1", title: "Nuova funzionalità: Scansione QR per aggiungere libri", date: "2026-02-08", emoji: "📸", link: "/settings" },
  { id: "n2", title: "Sfida di San Valentino: Leggi un romanzo d'amore", date: "2026-02-05", emoji: "💝", link: "/challenges" },
  { id: "n3", title: "Aggiornamento temi: 3 nuovi temi disponibili", date: "2026-02-01", emoji: "🎨", link: "/settings" },
];

const friendsActivity = [
  { id: "f1", user: "Sofia V.", avatar: "SV", action: "ha finito di leggere", book: "Il nome della rosa", bookId: "1", time: "2 ore fa" },
  { id: "f2", user: "Andrea M.", avatar: "AM", action: "ha iniziato", book: "Dune", bookId: "4", time: "5 ore fa" },
  { id: "f3", user: "Giulia F.", avatar: "GF", action: "ha recensito", book: "Norwegian Wood", bookId: "3", time: "1 giorno fa" },
  { id: "f4", user: "Luca P.", avatar: "LP", action: "ha aggiunto alla wishlist", book: "1984", bookId: "8", time: "2 giorni fa" },
];

const groupUpdates = [
  { id: "gu1", group: "Lettori Notturni", groupId: "1", text: "Nuovo libro del mese: 'La metamorfosi' di Kafka", time: "3 ore fa", members: 3421 },
  { id: "gu2", group: "Book & Coffee", groupId: "3", text: "Meetup virtuale questo sabato alle 18:00!", time: "1 giorno fa", members: 5234 },
  { id: "gu3", group: "Manga & Fumetti", groupId: "6", text: "Classifica manga più letti di Gennaio pubblicata", time: "2 giorni fa", members: 6789 },
];

const Index = () => {
  const currentlyReading = mockBooks.filter(b => b.status === "reading");

  return (
    <div className="container py-6 md:py-10 space-y-8 max-w-4xl">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          Bentornato, <span className="text-primary">Marco</span> 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Ecco cosa è successo mentre non c'eri</p>
      </motion.div>

      {/* Currently Reading */}
      {currentlyReading.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Stai leggendo
            </h2>
            <Link to="/library?status=reading" className="text-xs text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
              Tutti <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {currentlyReading.map((book, i) => (
              <BookCard key={book.id} book={book} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Friends Activity */}
      <section>
        <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2 mb-3">
          <Users className="h-4 w-4 text-primary" /> Attività amici
        </h2>
        <div className="space-y-2">
          {friendsActivity.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 rounded-xl bg-card border border-border p-3 shadow-card"
            >
              <Link to="/profile" className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-bold shrink-0 hover:ring-2 hover:ring-primary/30 transition-all">
                {a.avatar}
              </Link>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <Link to="/profile" className="font-semibold hover:text-primary transition-colors">{a.user}</Link>{" "}
                  <span className="text-muted-foreground">{a.action}</span>{" "}
                  <Link to={`/book/${a.bookId}`} className="font-medium text-primary hover:underline">{a.book}</Link>
                </p>
                <p className="text-[10px] text-muted-foreground">{a.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Group Updates */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" /> Dai tuoi gruppi
          </h2>
          <Link to="/community" className="text-xs text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
            Tutti i gruppi <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {groupUpdates.map((gu, i) => (
            <motion.div
              key={gu.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="rounded-xl bg-card border border-border p-4 shadow-card"
            >
              <div className="flex items-center justify-between">
                <Link to={`/community/${gu.groupId}`} className="text-xs font-semibold text-accent hover:underline">{gu.group}</Link>
                <span className="text-[10px] text-muted-foreground">{gu.time}</span>
              </div>
              <p className="text-sm text-foreground mt-1">{gu.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Platform News */}
      <section>
        <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2 mb-3">
          <Newspaper className="h-4 w-4 text-primary" /> Novità dalla piattaforma
        </h2>
        <div className="space-y-2">
          {platformNews.map((news, i) => (
            <Link key={news.id} to={news.link}>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="flex items-center gap-3 rounded-xl bg-card border border-border p-3 shadow-card hover:shadow-card-hover transition-all"
              >
                <span className="text-xl">{news.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{news.title}</p>
                  <p className="text-[10px] text-muted-foreground">{news.date}</p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              </motion.div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
