import { Link } from "react-router-dom";
import { ArrowRight, Users, MessageSquare, Clock, Megaphone, Trophy, Wrench, Newspaper } from "lucide-react";
import { motion } from "framer-motion";
import { BookCard } from "@/components/BookCard";
import { mockBooks } from "@/lib/mockData";
import { useAuth } from "@/lib/auth";

const newsHighlights = [
  {
    id: "news-1",
    title: "Notizia importante",
    text: "È online la nuova classifica mensile dei gruppi più attivi.",
    icon: Newspaper,
    badge: "News",
  },
  {
    id: "news-2",
    title: "Concorso in corso",
    text: "Partecipa al contest 'Recensione Perfetta' entro il 15 marzo 2026.",
    icon: Megaphone,
    badge: "Concorso",
  },
  {
    id: "news-3",
    title: "Vincitore della premiazione",
    text: "La community 'Book & Coffee' vince come gruppo del mese.",
    icon: Trophy,
    badge: "Premiazione",
  },
  {
    id: "news-4",
    title: "Prossimi aggiornamenti",
    text: "In arrivo statistiche avanzate di lettura e miglioramenti alle liste.",
    icon: Wrench,
    badge: "Roadmap",
  },
];

const friendsActivity = [
  { id: "f1", user: "Sofia V.", avatar: "SV", action: "ha finito di leggere", book: "Il nome della rosa", bookId: "1", time: "2 ore fa" },
  { id: "f2", user: "Andrea M.", avatar: "AM", action: "ha iniziato", book: "Dune", bookId: "4", time: "5 ore fa" },
  { id: "f3", user: "Giulia F.", avatar: "GF", action: "ha recensito", book: "Norwegian Wood", bookId: "3", time: "1 giorno fa" },
  { id: "f4", user: "Luca P.", avatar: "LP", action: "ha aggiunto alla wishlist", book: "1984", bookId: "8", time: "2 giorni fa" },
];

const groupUpdates = [
  { id: "gu1", group: "Lettori Notturni", groupId: "1", text: "Nuovo libro del mese: 'La metamorfosi' di Kafka", time: "3 ore fa" },
  { id: "gu2", group: "Book & Coffee", groupId: "3", text: "Meetup virtuale questo sabato alle 18:00!", time: "1 giorno fa" },
  { id: "gu3", group: "Manga & Fumetti", groupId: "6", text: "Classifica manga più letti di Gennaio pubblicata", time: "2 giorni fa" },
];

const Index = () => {
  const { user } = useAuth();
  const currentlyReading = mockBooks.filter((book) => book.status === "reading");
  const displayName = user?.name?.trim().split(/\s+/)[0] || "Lettore";

  return (
    <div className="container py-6 md:py-10 space-y-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          Bentornato, <span className="text-primary">{displayName}</span> 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Ecco cosa è successo mentre non c'eri</p>
      </motion.div>

      <section className="rounded-2xl bg-gradient-to-br from-secondary/70 via-card to-accent/10 border border-border p-4 md:p-5 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-primary" /> News
          </h2>
          <span className="text-xs text-muted-foreground">Aggiornato oggi</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {newsHighlights.map((news, i) => {
            const Icon = news.icon;
            return (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.05 }}
                className="rounded-xl bg-background/85 border border-border p-3 shadow-card"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-semibold">
                    {news.badge}
                  </span>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold text-foreground mt-2">{news.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{news.text}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

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

      <section>
        <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2 mb-3">
          <Users className="h-4 w-4 text-primary" /> Attività amici
        </h2>
        <div className="space-y-2">
          {friendsActivity.map((activity, i) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 rounded-xl bg-card border border-border p-3 shadow-card"
            >
              <Link to="/profile" className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-bold shrink-0 hover:ring-2 hover:ring-primary/30 transition-all">
                {activity.avatar}
              </Link>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <Link to="/profile" className="font-semibold hover:text-primary transition-colors">{activity.user}</Link>{" "}
                  <span className="text-muted-foreground">{activity.action}</span>{" "}
                  <Link to={`/book/${activity.bookId}`} className="font-medium text-primary hover:underline">{activity.book}</Link>
                </p>
                <p className="text-[10px] text-muted-foreground">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

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
          {groupUpdates.map((update, i) => (
            <motion.div
              key={update.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="rounded-xl bg-card border border-border p-4 shadow-card"
            >
              <div className="flex items-center justify-between">
                <Link to={`/community/${update.groupId}`} className="text-xs font-semibold text-accent hover:underline">{update.group}</Link>
                <span className="text-[10px] text-muted-foreground">{update.time}</span>
              </div>
              <p className="text-sm text-foreground mt-1">{update.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
