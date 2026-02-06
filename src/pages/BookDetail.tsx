import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Star, StarHalf, Heart, BookmarkPlus, Share2, MessageSquare,
  BookOpen, Calendar, Hash, Globe, Building, Barcode, MoreHorizontal,
  ListPlus, ChevronDown, ChevronUp, ThumbsUp, Edit3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mockBooks, mockReviews, type Book } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function RatingStars({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const starSize = size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5";

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < fullStars) {
          return <Star key={i} className={cn(starSize, "fill-primary text-primary")} />;
        }
        if (i === fullStars && hasHalf) {
          return <StarHalf key={i} className={cn(starSize, "fill-primary text-primary")} />;
        }
        return <Star key={i} className={cn(starSize, "text-border")} />;
      })}
    </div>
  );
}

function StatusBadge({ status }: { status: Book['status'] }) {
  const config = {
    reading: { label: 'In lettura', className: 'bg-primary/15 text-primary' },
    read: { label: 'Letto', className: 'bg-accent/15 text-accent' },
    'to-read': { label: 'Da leggere', className: 'bg-secondary text-secondary-foreground' },
    abandoned: { label: 'Abbandonato', className: 'bg-destructive/15 text-destructive' },
  };
  const { label, className } = config[status];
  return (
    <span className={cn("text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide", className)}>
      {label}
    </span>
  );
}

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const book = mockBooks.find(b => b.id === id);
  const reviews = mockReviews.filter(r => r.bookId === id);
  const relatedBooks = mockBooks.filter(b => b.id !== id && b.genre.some(g => book?.genre.includes(g))).slice(0, 4);

  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  if (!book) {
    return (
      <div className="container py-16 text-center">
        <p className="text-muted-foreground text-lg">Libro non trovato</p>
        <Link to="/library" className="text-primary text-sm mt-2 inline-block hover:underline">
          Torna alla libreria
        </Link>
      </div>
    );
  }

  const synopsis = book.synopsis || book.description || '';

  return (
    <div className="container py-6 md:py-10 space-y-8">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Indietro
      </motion.button>

      {/* Book Header */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        {/* Cover */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex-shrink-0 mx-auto md:mx-0"
        >
          <div className="relative w-48 md:w-56 overflow-hidden rounded-2xl shadow-float">
            <img
              src={book.cover}
              alt={book.title}
              className="w-full aspect-[2/3] object-cover"
            />
            {book.progress !== undefined && (
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-foreground/20">
                <div className="h-full bg-primary" style={{ width: `${book.progress}%` }} />
              </div>
            )}
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 text-center md:text-left"
        >
          <StatusBadge status={book.status} />
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-3">
            {book.title}
          </h1>
          <p className="text-lg text-muted-foreground mt-1">di <span className="text-foreground font-medium">{book.author}</span></p>

          <div className="flex items-center gap-3 mt-3 justify-center md:justify-start">
            <RatingStars rating={book.rating} size="lg" />
            <span className="text-lg font-bold text-foreground">{book.rating}</span>
            <span className="text-sm text-muted-foreground">({reviews.length} recensioni)</span>
          </div>

          {/* Progress bar for reading books */}
          {book.progress !== undefined && (
            <div className="mt-4 max-w-xs mx-auto md:mx-0">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-foreground">Progresso</span>
                <span className="text-muted-foreground">{book.progress}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${book.progress}%` }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="h-full rounded-full bg-primary"
                />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 mt-6 justify-center md:justify-start">
            <button
              onClick={() => { setIsFavorite(!isFavorite); toast(isFavorite ? 'Rimosso dai preferiti' : 'Aggiunto ai preferiti ❤️'); }}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isFavorite
                  ? "bg-rose-soft text-primary-foreground"
                  : "bg-card border border-border text-foreground hover:bg-secondary"
              )}
            >
              <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
              {isFavorite ? 'Preferito' : 'Preferiti'}
            </button>

            <button
              onClick={() => { setIsBookmarked(!isBookmarked); toast(isBookmarked ? 'Rimosso dalla lista' : 'Aggiunto alla lista 📚'); }}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isBookmarked
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-foreground hover:bg-secondary"
              )}
            >
              <BookmarkPlus className="h-4 w-4" />
              {isBookmarked ? 'In lista' : 'Aggiungi a lista'}
            </button>

            <button
              onClick={() => toast('Link copiato! 🔗')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-card border border-border text-foreground hover:bg-secondary transition-all"
            >
              <Share2 className="h-4 w-4" />
              Condividi
            </button>

            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-card border border-border text-foreground hover:bg-secondary transition-all">
              <ListPlus className="h-4 w-4" />
              Liste
            </button>
          </div>

          {/* Meta info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 max-w-lg mx-auto md:mx-0">
            {[
              { icon: BookOpen, label: "Pagine", value: book.pages.toString() },
              { icon: Calendar, label: "Anno", value: book.year?.toString() || '-' },
              { icon: Globe, label: "Lingua", value: book.language || '-' },
              { icon: Building, label: "Editore", value: book.publisher || '-' },
              { icon: Barcode, label: "ISBN", value: book.isbn || '-' },
              { icon: Calendar, label: "Aggiunto", value: new Date(book.dateAdded).toLocaleDateString('it-IT') },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-card">
                  <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{item.label}</p>
                    <p className="text-xs font-medium text-foreground truncate">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Genres & Tags */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <div className="flex flex-wrap gap-2">
          {book.genre.map(g => (
            <span key={g} className="px-3 py-1.5 rounded-full text-xs font-medium bg-accent/15 text-accent">
              {g}
            </span>
          ))}
          {book.tags.map(t => (
            <span key={t} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
              <Hash className="h-3 w-3" />{t}
            </span>
          ))}
        </div>
      </motion.section>

      {/* Synopsis */}
      {synopsis && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl bg-card p-6 shadow-card"
        >
          <h2 className="font-display text-lg font-bold text-foreground mb-3">Sinossi</h2>
          <p className={cn("text-sm text-muted-foreground leading-relaxed", !showFullSynopsis && "line-clamp-4")}>
            {synopsis}
          </p>
          {synopsis.length > 200 && (
            <button
              onClick={() => setShowFullSynopsis(!showFullSynopsis)}
              className="flex items-center gap-1 text-xs text-primary font-medium mt-2 hover:underline"
            >
              {showFullSynopsis ? 'Mostra meno' : 'Leggi tutto'}
              {showFullSynopsis ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          )}
        </motion.section>
      )}

      {/* Your Rating */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl bg-card p-6 shadow-card"
      >
        <h2 className="font-display text-lg font-bold text-foreground mb-3">La tua valutazione</h2>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              onClick={() => { setUserRating(i + 1); toast(`Valutazione: ${i + 1} stelle ⭐`); }}
              onMouseEnter={() => setHoverRating(i + 1)}
              onMouseLeave={() => setHoverRating(null)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  "h-7 w-7 transition-colors",
                  (hoverRating !== null ? i < hoverRating : i < (userRating || 0))
                    ? "fill-primary text-primary"
                    : "text-border"
                )}
              />
            </button>
          ))}
          {userRating && (
            <span className="ml-3 text-sm text-muted-foreground">{userRating}/5</span>
          )}
        </div>
        <button className="flex items-center gap-2 mt-3 text-xs text-primary font-medium hover:underline">
          <Edit3 className="h-3 w-3" />
          Scrivi una recensione
        </button>
      </motion.section>

      {/* Reviews */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Recensioni ({reviews.length})
          </h2>
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-3">
            {reviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="rounded-xl bg-card p-5 shadow-card"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground">
                    {review.userAvatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{review.userName}</p>
                    <div className="flex items-center gap-2">
                      <RatingStars rating={review.rating} />
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(review.date).toLocaleDateString('it-IT')}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{review.text}</p>
                <div className="flex items-center gap-3 mt-3">
                  <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                    <ThumbsUp className="h-3.5 w-3.5" />
                    {review.likes}
                  </button>
                  <button className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    Rispondi
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-card p-8 shadow-card text-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Nessuna recensione ancora. Sii il primo!</p>
          </div>
        )}
      </motion.section>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <h2 className="font-display text-lg font-bold text-foreground mb-4">Libri simili</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedBooks.map((relBook, i) => (
              <Link key={relBook.id} to={`/book/${relBook.id}`} className="group cursor-pointer">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.06 }}
                >
                  <div className="relative overflow-hidden rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300">
                    <img
                      src={relBook.cover}
                      alt={relBook.title}
                      className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="mt-2 px-0.5">
                    <h3 className="font-display font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                      {relBook.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{relBook.author}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default BookDetail;
