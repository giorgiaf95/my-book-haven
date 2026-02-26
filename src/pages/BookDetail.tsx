import { useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Star, StarHalf, Heart, Share2, MessageSquare,
  BookOpen, Calendar, Hash, Globe, Building, Barcode,
  ListPlus, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, Send, X
} from "lucide-react";
import { motion } from "framer-motion";
import { mockBooks, mockReviews, mockUserLists, type Book, type BookReview } from "@/lib/mockData";
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

function StatusBadge({ status }: { status: Book["status"] }) {
  const config = {
    reading: { label: "In lettura", className: "bg-primary/15 text-primary" },
    read: { label: "Letto", className: "bg-accent/15 text-accent" },
    "to-read": { label: "Da leggere", className: "bg-secondary text-secondary-foreground" },
    abandoned: { label: "Abbandonato", className: "bg-destructive/15 text-destructive" },
  };
  const { label, className } = config[status];
  return (
    <span className={cn("text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide", className)}>
      {label}
    </span>
  );
}

type ReviewState = BookReview & {
  dislikes: number;
  comments: NonNullable<BookReview["comments"]>;
};

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const book = mockBooks.find((b) => b.id === id);

  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [inLibrary, setInLibrary] = useState(true);
  const [showLibraryPopup, setShowLibraryPopup] = useState(false);
  const [quickStatus, setQuickStatus] = useState<Book["status"]>("to-read");
  const [quickRating, setQuickRating] = useState<number>(0);
  const [quickTagInput, setQuickTagInput] = useState("");
  const [quickTags, setQuickTags] = useState<string[]>([]);
  const [listPickerOpen, setListPickerOpen] = useState(false);
  const [listState, setListState] = useState(mockUserLists);

  const [reviews, setReviews] = useState<ReviewState[]>(() =>
    mockReviews
      .filter((r) => r.bookId === id)
      .map((r) => ({
        ...r,
        dislikes: r.dislikes ?? 0,
        comments: r.comments ?? [],
      }))
  );

  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});

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

  const relatedBooks = mockBooks
    .filter((b) => b.id !== id && b.genre.some((g) => book.genre.includes(g)))
    .slice(0, 4);

  const sameAuthorBooks = mockBooks
    .filter((b) => b.id !== id && b.author === book.author)
    .slice(0, 4);

  const synopsis = book.synopsis || book.description || "";

  const listCountForBook = useMemo(
    () => listState.filter((list) => list.bookIds.includes(book.id)).length,
    [book.id, listState]
  );

  const publishReview = () => {
    if (!userRating || reviewText.trim().length < 12) {
      toast("Scrivi almeno 12 caratteri e seleziona un voto");
      return;
    }

    const newReview: ReviewState = {
      id: `r-local-${Date.now()}`,
      bookId: book.id,
      userName: "Tu",
      userAvatar: "TU",
      rating: userRating,
      text: reviewText.trim(),
      date: new Date().toISOString().slice(0, 10),
      likes: 0,
      dislikes: 0,
      comments: [],
    };

    setReviews((prev) => [newReview, ...prev]);
    setReviewText("");
    setUserRating(null);
    toast("Recensione pubblicata");
  };

  const toggleBookInList = (listId: string) => {
    setListState((prev) =>
      prev.map((list) => {
        if (list.id !== listId) return list;
        const alreadyPresent = list.bookIds.includes(book.id);
        return {
          ...list,
          bookIds: alreadyPresent ? list.bookIds.filter((bookId) => bookId !== book.id) : [...list.bookIds, book.id],
        };
      })
    );
  };

  const updateReviewReaction = (reviewId: string, type: "like" | "dislike") => {
    setReviews((prev) =>
      prev.map((review) => {
        if (review.id !== reviewId) return review;
        if (type === "like") {
          return { ...review, likes: review.likes + 1 };
        }
        return { ...review, dislikes: review.dislikes + 1 };
      })
    );
  };

  const addCommentToReview = (reviewId: string) => {
    const draft = commentDrafts[reviewId]?.trim();
    if (!draft) return;

    setReviews((prev) =>
      prev.map((review) => {
        if (review.id !== reviewId) return review;
        return {
          ...review,
          comments: [
            ...review.comments,
            {
              id: `c-local-${Date.now()}`,
              reviewId,
              userName: "Tu",
              userAvatar: "TU",
              text: draft,
              date: new Date().toISOString().slice(0, 10),
            },
          ],
        };
      })
    );

    setCommentDrafts((prev) => ({ ...prev, [reviewId]: "" }));
  };

  const addQuickTag = () => {
    const tag = quickTagInput.trim().toLowerCase();
    if (!tag || quickTags.includes(tag)) return;
    setQuickTags((prev) => [...prev, tag]);
    setQuickTagInput("");
  };

  const removeQuickTag = (tagToRemove: string) => {
    setQuickTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const saveLibraryQuickData = () => {
    setInLibrary(true);
    setShowLibraryPopup(false);
    toast("Libro aggiunto alla libreria");
  };

  return (
    <div className="container py-6 md:py-10 space-y-8">
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Indietro
      </motion.button>

      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex-shrink-0 mx-auto md:mx-0"
        >
          <div className="relative w-48 md:w-56 overflow-hidden rounded-2xl shadow-float">
            <img src={book.cover} alt={book.title} className="w-full aspect-[2/3] object-cover" />
            {book.progress !== undefined && (
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-foreground/20">
                <div className="h-full bg-primary" style={{ width: `${book.progress}%` }} />
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 text-center md:text-left"
        >
          <StatusBadge status={book.status} />
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-3">{book.title}</h1>
          <p className="text-lg text-muted-foreground mt-1">
            di <span className="text-foreground font-medium">{book.author}</span>
          </p>

          <div className="flex items-center gap-3 mt-3 justify-center md:justify-start">
            <RatingStars rating={book.rating} size="lg" />
            <span className="text-lg font-bold text-foreground">{book.rating}</span>
            <span className="text-sm text-muted-foreground">({reviews.length} recensioni)</span>
          </div>

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

          <div className="flex flex-wrap items-center gap-2 mt-6 justify-center md:justify-start">
            <button
              onClick={() => {
                if (inLibrary) {
                  setInLibrary(false);
                  toast("Rimosso dalla libreria");
                  return;
                }
                setShowLibraryPopup(true);
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border",
                inLibrary
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-foreground hover:bg-secondary"
              )}
            >
              <BookOpen className="h-4 w-4" />
              {inLibrary ? "In libreria" : "Aggiungi alla libreria"}
            </button>

            <button
              onClick={() => {
                setIsFavorite(!isFavorite);
                toast(isFavorite ? "Rimosso dai preferiti" : "Aggiunto ai preferiti ❤️");
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isFavorite
                  ? "bg-rose-soft text-primary-foreground"
                  : "bg-card border border-border text-foreground hover:bg-secondary"
              )}
            >
              <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
              {isFavorite ? "Preferito" : "Preferiti"}
            </button>

            <div className="relative">
              <button
                onClick={() => setListPickerOpen((prev) => !prev)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border",
                  listCountForBook > 0
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-foreground hover:bg-secondary"
                )}
              >
                <ListPlus className="h-4 w-4" />
                {listCountForBook > 0 ? `In ${listCountForBook} liste` : "Aggiungi a lista"}
              </button>

              {listPickerOpen && (
                <div className="absolute z-40 mt-2 w-72 rounded-xl border border-border bg-card shadow-float p-2">
                  {listState.map((list) => {
                    const selected = list.bookIds.includes(book.id);
                    return (
                      <button
                        key={list.id}
                        onClick={() => toggleBookInList(list.id)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                          selected ? "bg-primary/15 text-primary" : "hover:bg-secondary text-foreground"
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate">
                            {list.emoji} {list.name}
                          </span>
                          {selected && <span className="text-[10px] font-semibold">AGGIUNTO</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={() => toast("Link copiato! 🔗")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-card border border-border text-foreground hover:bg-secondary transition-all"
            >
              <Share2 className="h-4 w-4" />
              Condividi
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 max-w-lg mx-auto md:mx-0">
            {[
              { icon: BookOpen, label: "Pagine", value: book.pages.toString() },
              { icon: Calendar, label: "Anno", value: book.year?.toString() || "-" },
              { icon: Globe, label: "Lingua", value: book.language || "-" },
              { icon: Building, label: "Editore", value: book.publisher || "-" },
              { icon: Barcode, label: "ISBN", value: book.isbn || "-" },
              { icon: Calendar, label: "Aggiunto", value: new Date(book.dateAdded).toLocaleDateString("it-IT") },
            ].map((item) => {
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

      {showLibraryPopup && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setShowLibraryPopup(false)} />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="fixed z-50 left-1/2 top-1/2 w-[94vw] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card shadow-float"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">Aggiungi alla libreria</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{book.title}</p>
              </div>
              <button
                onClick={() => setShowLibraryPopup(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 space-y-4 max-h-[72vh] overflow-y-auto">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Stato lettura</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { value: "to-read", label: "Da leggere" },
                    { value: "reading", label: "In lettura" },
                    { value: "read", label: "Letto" },
                    { value: "abandoned", label: "Abbandonato" },
                  ].map((status) => (
                    <button
                      key={status.value}
                      onClick={() => setQuickStatus(status.value as Book["status"])}
                      className={cn(
                        "px-2.5 py-2 rounded-lg text-xs font-medium border transition-colors",
                        quickStatus === status.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-foreground border-border hover:bg-secondary"
                      )}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Valutazione</p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button key={i} onClick={() => setQuickRating(i + 1)} className="p-1">
                      <Star className={cn("h-6 w-6", i < quickRating ? "fill-primary text-primary" : "text-border")} />
                    </button>
                  ))}
                  {quickRating > 0 && <span className="text-xs text-muted-foreground ml-2">{quickRating}/5</span>}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Tag</p>
                <div className="flex gap-2">
                  <input
                    value={quickTagInput}
                    onChange={(e) => setQuickTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addQuickTag();
                      }
                    }}
                    placeholder="Aggiungi tag"
                    className="flex-1 rounded-lg bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <button
                    onClick={addQuickTag}
                    className="px-3 py-2 rounded-lg text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  >
                    Aggiungi
                  </button>
                </div>
                {quickTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {quickTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => removeQuickTag(tag)}
                        className="px-2.5 py-1 rounded-full text-xs bg-accent/15 text-accent hover:opacity-80"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Aggiungi a lista/e</p>
                <div className="rounded-xl border border-border bg-background p-2 space-y-1.5">
                  {listState.map((list) => {
                    const selected = list.bookIds.includes(book.id);
                    return (
                      <button
                        key={list.id}
                        onClick={() => toggleBookInList(list.id)}
                        className={cn(
                          "w-full px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors",
                          selected ? "bg-primary/15 text-primary" : "hover:bg-secondary text-foreground"
                        )}
                      >
                        <span className="truncate">{list.emoji} {list.name}</span>
                        {selected && <span className="text-[10px] font-semibold">AGGIUNTO</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border flex justify-end gap-2">
              <button
                onClick={() => setShowLibraryPopup(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium border border-border bg-card text-foreground hover:bg-secondary"
              >
                Annulla
              </button>
              <button
                onClick={saveLibraryQuickData}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90"
              >
                Salva
              </button>
            </div>
          </motion.div>
        </>
      )}

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <div className="flex flex-wrap gap-2">
          {book.genre.map((g) => (
            <span key={g} className="px-3 py-1.5 rounded-full text-xs font-medium bg-accent/15 text-accent">
              {g}
            </span>
          ))}
          {book.saga && (
            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/15 text-primary">
              Saga: {book.saga}
            </span>
          )}
          {book.tags.map((t) => (
            <span key={t} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
              <Hash className="h-3 w-3" />
              {t}
            </span>
          ))}
        </div>
      </motion.section>

      {synopsis && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl bg-card p-6 shadow-card"
        >
          <h2 className="font-display text-lg font-bold text-foreground mb-3">Sinossi</h2>
          <p className={cn("text-sm text-muted-foreground leading-relaxed", !showFullSynopsis && "line-clamp-4")}>{synopsis}</p>
          {synopsis.length > 200 && (
            <button
              onClick={() => setShowFullSynopsis(!showFullSynopsis)}
              className="flex items-center gap-1 text-xs text-primary font-medium mt-2 hover:underline"
            >
              {showFullSynopsis ? "Mostra meno" : "Leggi tutto"}
              {showFullSynopsis ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          )}
        </motion.section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl bg-card p-6 shadow-card"
        >
          <h2 className="font-display text-lg font-bold text-foreground mb-3">Scrivi una recensione</h2>
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setUserRating(i + 1)}
                onMouseEnter={() => setHoverRating(i + 1)}
                onMouseLeave={() => setHoverRating(null)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    "h-7 w-7 transition-colors",
                    (hoverRating !== null ? i < hoverRating : i < (userRating || 0)) ? "fill-primary text-primary" : "text-border"
                  )}
                />
              </button>
            ))}
            {userRating && <span className="ml-3 text-sm text-muted-foreground">{userRating}/5</span>}
          </div>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Racconta la tua esperienza di lettura..."
            className="w-full min-h-24 rounded-xl bg-background border border-border p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={publishReview}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90"
            >
              Pubblica recensione
            </button>
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
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
                  transition={{ delay: 0.4 + i * 0.06 }}
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
                        <span className="text-[10px] text-muted-foreground">{new Date(review.date).toLocaleDateString("it-IT")}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{review.text}</p>

                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => updateReviewReaction(review.id, "like")}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      {review.likes}
                    </button>
                    <button
                      onClick={() => updateReviewReaction(review.id, "dislike")}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <ThumbsDown className="h-3.5 w-3.5" />
                      {review.dislikes}
                    </button>
                  </div>

                  <div className="mt-3 space-y-2">
                    {review.comments.map((comment) => (
                      <div key={comment.id} className="rounded-lg bg-background border border-border px-3 py-2">
                        <p className="text-xs font-medium text-foreground">{comment.userName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{comment.text}</p>
                      </div>
                    ))}

                    <div className="flex items-center gap-2">
                      <input
                        value={commentDrafts[review.id] ?? ""}
                        onChange={(e) => setCommentDrafts((prev) => ({ ...prev, [review.id]: e.target.value }))}
                        placeholder="Commenta questa recensione"
                        className="flex-1 rounded-lg bg-background border border-border px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                      <button
                        onClick={() => addCommentToReview(review.id)}
                        className="p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </div>
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
      </div>

      {sameAuthorBooks.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}>
          <h2 className="font-display text-lg font-bold text-foreground mb-4">Altri libri dello stesso autore</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {sameAuthorBooks.map((relBook, i) => (
              <Link key={relBook.id} to={`/book/${relBook.id}`} className="group cursor-pointer">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + i * 0.06 }}
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
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.section>
      )}

      {relatedBooks.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h2 className="font-display text-lg font-bold text-foreground mb-4">Libri simili</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedBooks.map((relBook, i) => (
              <Link key={relBook.id} to={`/book/${relBook.id}`} className="group cursor-pointer">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.54 + i * 0.06 }}
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
