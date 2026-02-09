import { useState } from "react";
import { Link } from "react-router-dom";
import { ListChecks, Plus, BookOpen, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { mockBooks } from "@/lib/mockData";

interface BookList {
  id: string;
  name: string;
  description: string;
  emoji: string;
  bookIds: string[];
  isPublic: boolean;
  createdAt: string;
}

const mockLists: BookList[] = [
  { id: "l1", name: "Da leggere quest'estate", description: "Letture leggere per le vacanze", emoji: "☀️", bookIds: ["3", "5", "7"], isPublic: true, createdAt: "2025-12-01" },
  { id: "l2", name: "Classici imperdibili", description: "I classici che tutti dovrebbero leggere", emoji: "📜", bookIds: ["1", "2", "6"], isPublic: true, createdAt: "2025-10-15" },
  { id: "l3", name: "Fantascienza", description: "I migliori sci-fi della mia collezione", emoji: "🚀", bookIds: ["4", "8"], isPublic: false, createdAt: "2025-11-20" },
];

const MyLists = () => {
  const [lists] = useState<BookList[]>(mockLists);
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="container py-6 md:py-10 space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <ListChecks className="h-6 w-6 text-primary" /> Le mie liste
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Organizza i tuoi libri in liste personalizzate</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" /> Nuova lista
        </button>
      </motion.div>

      {/* Create form */}
      {showCreate && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
          <div className="rounded-xl bg-card border border-border p-5 space-y-3">
            <input placeholder="Nome della lista" className="w-full bg-transparent text-foreground text-sm border-b border-border pb-2 focus:outline-none focus:border-primary placeholder:text-muted-foreground" />
            <input placeholder="Descrizione (opzionale)" className="w-full bg-transparent text-foreground text-sm border-b border-border pb-2 focus:outline-none focus:border-primary placeholder:text-muted-foreground" />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" className="rounded border-border" /> Lista pubblica
              </label>
              <div className="flex gap-2">
                <button onClick={() => setShowCreate(false)} className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors">Annulla</button>
                <button className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Crea</button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Lists */}
      <div className="space-y-4">
        {lists.map((list, i) => {
          const books = mockBooks.filter(b => list.bookIds.includes(b.id));
          return (
            <motion.div
              key={list.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl bg-card border border-border shadow-card overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{list.emoji}</span>
                    <div>
                      <h3 className="font-display font-semibold text-foreground">{list.name}</h3>
                      <p className="text-xs text-muted-foreground">{list.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{list.isPublic ? "Pubblica" : "Privata"}</span>
                    <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>{books.length} libri</span>
                  <span>·</span>
                  <span>Creata il {list.createdAt}</span>
                </div>

                {/* Book covers preview */}
                <div className="flex gap-2 mt-3">
                  {books.slice(0, 5).map(book => (
                    <Link key={book.id} to={`/book/${book.id}`}>
                      <img src={book.cover} alt={book.title} className="w-12 h-[72px] rounded-lg object-cover hover:scale-105 transition-transform" />
                    </Link>
                  ))}
                  {books.length > 5 && (
                    <div className="w-12 h-[72px] rounded-lg bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground">+{books.length - 5}</div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {lists.length === 0 && (
        <div className="text-center py-16">
          <ListChecks className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">Non hai ancora creato nessuna lista</p>
        </div>
      )}
    </div>
  );
};

export default MyLists;
