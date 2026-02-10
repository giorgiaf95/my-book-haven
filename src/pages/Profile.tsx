import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User, Calendar, Users, BookOpen, Trophy, MessageSquare, Star,
  Edit3, Grid3X3, List, SlidersHorizontal, Heart, MapPin, Link as LinkIcon,
  ChevronDown, ChevronUp, Check, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BookCard } from "@/components/BookCard";
import { ChallengeCard } from "@/components/ChallengeCard";
import { mockBooks, mockChallenges, mockCommunities, mockReviews, allGenres, allTags } from "@/lib/mockData";
import { cn } from "@/lib/utils";

type ProfileTab = "library" | "reviews" | "groups" | "challenges" | "guestbook";
type LibraryView = "grid" | "list";
type LibrarySort = "title" | "author" | "rating" | "dateAdded";
type LibraryGroup = "none" | "status" | "genre" | "author";

const profileData = {
  name: "Marco Lettore",
  username: "@marcolettore",
  avatar: "ML",
  bio: "Appassionato lettore e collezionista di storie. Sempre alla ricerca del prossimo libro da divorare. 📚",
  location: "Milano, Italia",
  website: "marcolettore.blog",
  joinDate: "Gennaio 2024",
  stats: {
    books: mockBooks.length,
    reviews: mockReviews.length,
    followers: 248,
    following: 132,
    pagesRead: 12450,
    challengesCompleted: 3,
  },
};

const guestbookComments = [
  { id: "g1", user: "Sofia V.", avatar: "SV", text: "Complimenti per la tua collezione! Hai gusti eccellenti 📖", date: "2025-02-01", likes: 5 },
  { id: "g2", user: "Andrea M.", avatar: "AM", text: "Grazie per il consiglio su Eco, l'ho adorato!", date: "2025-01-28", likes: 3 },
  { id: "g3", user: "Giulia F.", avatar: "GF", text: "Bello il tuo profilo! Seguiamo gli stessi autori 😊", date: "2025-01-20", likes: 8 },
];

const tabs: { value: ProfileTab; label: string; icon: typeof BookOpen }[] = [
  { value: "library", label: "Libreria", icon: BookOpen },
  { value: "reviews", label: "Recensioni", icon: Star },
  { value: "groups", label: "Gruppi", icon: Users },
  { value: "challenges", label: "Sfide", icon: Trophy },
  { value: "guestbook", label: "Bacheca", icon: MessageSquare },
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState<ProfileTab>("library");
  const [libraryView, setLibraryView] = useState<LibraryView>("grid");
  const [librarySort, setLibrarySort] = useState<LibrarySort>("dateAdded");
  const [libraryGroup, setLibraryGroup] = useState<LibraryGroup>("none");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [challengeFilter, setChallengeFilter] = useState<"active" | "completed">("active");

  // Library filtering & sorting
  const filteredBooks = (() => {
    let books = [...mockBooks];
    if (selectedGenres.length > 0) books = books.filter(b => b.genre.some(g => selectedGenres.includes(g)));
    if (selectedTags.length > 0) books = books.filter(b => b.tags.some(t => selectedTags.includes(t)));
    books.sort((a, b) => {
      switch (librarySort) {
        case "title": return a.title.localeCompare(b.title);
        case "author": return a.author.localeCompare(b.author);
        case "rating": return b.rating - a.rating;
        case "dateAdded": return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        default: return 0;
      }
    });
    return books;
  })();

  // Grouping
  const groupedBooks = (() => {
    if (libraryGroup === "none") return { "": filteredBooks };
    const groups: Record<string, typeof filteredBooks> = {};
    filteredBooks.forEach(book => {
      let key = "";
      switch (libraryGroup) {
        case "status":
          key = { reading: "In lettura", read: "Letti", "to-read": "Da leggere", abandoned: "Abbandonati" }[book.status];
          break;
        case "genre":
          key = book.genre[0] || "Altro";
          break;
        case "author":
          key = book.author;
          break;
      }
      if (!groups[key]) groups[key] = [];
      groups[key].push(book);
    });
    return groups;
  })();

  const activeChallenges = mockChallenges.filter(c => c.current < c.target);
  const completedChallenges = mockChallenges.filter(c => c.current >= c.target);

  return (
    <div className="container py-6 md:py-10 space-y-6 max-w-4xl">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-card border border-border shadow-card p-6 md:p-8"
      >
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold font-display shrink-0">
            {profileData.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">{profileData.name}</h1>
                <p className="text-sm text-muted-foreground">{profileData.username}</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                <Edit3 className="h-3.5 w-3.5" />
                Modifica
              </button>
            </div>
            <p className="text-sm text-foreground/80 mt-2">{profileData.bio}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{profileData.location}</span>
              <span className="flex items-center gap-1"><LinkIcon className="h-3.5 w-3.5" />{profileData.website}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Iscritto da {profileData.joinDate}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-border">
          {[
            { label: "Follower", value: profileData.stats.followers },
            { label: "Seguiti", value: profileData.stats.following },
            { label: "Recensioni", value: profileData.stats.reviews },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className="text-lg font-bold text-foreground font-display">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-1 border-b border-border pb-px scrollbar-hide">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px",
                activeTab === tab.value
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* LIBRARY TAB */}
          {activeTab === "library" && (
            <div className="space-y-4">
              {/* Library controls */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center bg-card border border-border rounded-xl overflow-hidden">
                  <button onClick={() => setLibraryView("grid")} className={cn("p-2.5 transition-colors", libraryView === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button onClick={() => setLibraryView("list")} className={cn("p-2.5 transition-colors", libraryView === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
                    <List className="h-4 w-4" />
                  </button>
                </div>

                <select
                  value={librarySort}
                  onChange={e => setLibrarySort(e.target.value as LibrarySort)}
                  className="px-3 py-2 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="dateAdded">Data aggiunta</option>
                  <option value="title">Titolo</option>
                  <option value="author">Autore</option>
                  <option value="rating">Valutazione</option>
                </select>

                <select
                  value={libraryGroup}
                  onChange={e => setLibraryGroup(e.target.value as LibraryGroup)}
                  className="px-3 py-2 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="none">Nessun raggruppamento</option>
                  <option value="status">Per stato</option>
                  <option value="genre">Per genere</option>
                  <option value="author">Per autore</option>
                </select>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-all",
                    showFilters || selectedGenres.length + selectedTags.length > 0
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border hover:bg-secondary"
                  )}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtri
                  {(selectedGenres.length + selectedTags.length > 0) && (
                    <span className="h-5 w-5 rounded-full bg-primary-foreground text-primary text-[10px] flex items-center justify-center font-bold">
                      {selectedGenres.length + selectedTags.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="rounded-xl bg-card border border-border p-4 space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Generi</label>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {allGenres.map(g => (
                            <button key={g} onClick={() => setSelectedGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])}
                              className={cn("px-2.5 py-1 rounded-full text-xs font-medium transition-all", selectedGenres.includes(g) ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80")}>
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tag</label>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {allTags.map(t => (
                            <button key={t} onClick={() => setSelectedTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])}
                              className={cn("px-2.5 py-1 rounded-full text-xs font-medium transition-all", selectedTags.includes(t) ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80")}>
                              #{t}
                            </button>
                          ))}
                        </div>
                      </div>
                      {(selectedGenres.length + selectedTags.length > 0) && (
                        <button onClick={() => { setSelectedGenres([]); setSelectedTags([]); }} className="text-xs text-destructive font-medium hover:underline">
                          Rimuovi filtri
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Grouped books */}
              {Object.entries(groupedBooks).map(([group, books]) => (
                <div key={group || "all"}>
                  {group && <h3 className="font-display font-semibold text-lg text-foreground mb-3">{group} <span className="text-sm text-muted-foreground font-body">({books.length})</span></h3>}
                  <div className={cn(
                    libraryView === "grid"
                      ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                      : "space-y-3"
                  )}>
                    {books.map((book, i) => (
                      <BookCard key={book.id} book={book} index={i} variant={libraryView} />
                    ))}
                  </div>
                </div>
              ))}
              {filteredBooks.length === 0 && (
                <p className="text-center text-muted-foreground py-12">Nessun libro corrisponde ai filtri selezionati</p>
              )}
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              {mockReviews.map(review => {
                const book = mockBooks.find(b => b.id === review.bookId);
                return (
                  <div key={review.id} className="rounded-xl bg-card border border-border p-4 shadow-card">
                    <div className="flex items-start gap-3">
                      {book && (
                        <Link to={`/book/${book.id}`}>
                          <img src={book.cover} alt={book.title} className="w-12 h-18 rounded-lg object-cover shrink-0" />
                        </Link>
                      )}
                      <div className="flex-1 min-w-0">
                        {book && (
                          <Link to={`/book/${book.id}`} className="font-display font-semibold text-sm text-foreground hover:text-primary transition-colors">
                            {book.title}
                          </Link>
                        )}
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={cn("h-3 w-3", i < review.rating ? "fill-primary text-primary" : "text-border")} />
                          ))}
                        </div>
                        <p className="text-sm text-foreground/80 mt-2">{review.text}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span>{review.date}</span>
                          <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{review.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* GROUPS TAB */}
          {activeTab === "groups" && (
            <div className="space-y-4">
              <h3 className="font-display font-semibold text-lg text-foreground">Gruppi iscritti</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mockCommunities.filter(c => c.isJoined).map(community => (
                  <Link key={community.id} to={`/community/${community.id}`} className="rounded-xl bg-card border border-border shadow-card overflow-hidden hover:shadow-card-hover transition-all group">
                    <div className="h-24 overflow-hidden">
                      <img src={community.image} alt={community.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-display font-semibold text-sm text-foreground">{community.name}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/15 text-accent font-medium flex items-center gap-1"><Check className="h-3 w-3" />Iscritto</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{community.description}</p>
                      <p className="text-xs text-muted-foreground mt-2"><Users className="h-3 w-3 inline mr-1" />{community.members.toLocaleString()} membri</p>
                    </div>
                  </Link>
                ))}
              </div>
              {mockCommunities.filter(c => c.isJoined).length === 0 && (
                <p className="text-center text-muted-foreground py-12">Non sei iscritto a nessun gruppo</p>
              )}
            </div>
          )}

          {/* CHALLENGES TAB */}
          {activeTab === "challenges" && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <button onClick={() => setChallengeFilter("active")} className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-all", challengeFilter === "active" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:bg-secondary")}>
                  In corso ({activeChallenges.length})
                </button>
                <button onClick={() => setChallengeFilter("completed")} className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-all", challengeFilter === "completed" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:bg-secondary")}>
                  Completate ({completedChallenges.length})
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(challengeFilter === "active" ? activeChallenges : completedChallenges).map((challenge, i) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} index={i} />
                ))}
              </div>
              {(challengeFilter === "active" ? activeChallenges : completedChallenges).length === 0 && (
                <p className="text-center text-muted-foreground py-12">
                  {challengeFilter === "active" ? "Nessuna sfida in corso" : "Nessuna sfida completata"}
                </p>
              )}
            </div>
          )}

          {/* GUESTBOOK TAB */}
          {activeTab === "guestbook" && (
            <div className="space-y-4">
              {/* Write comment */}
              <div className="rounded-xl bg-card border border-border p-4 shadow-card">
                <textarea
                  placeholder="Scrivi un commento in bacheca..."
                  className="w-full min-h-[80px] bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none"
                />
                <div className="flex justify-end mt-2">
                  <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                    Pubblica
                  </button>
                </div>
              </div>

              {/* Comments */}
              {guestbookComments.map(comment => (
                <div key={comment.id} className="rounded-xl bg-card border border-border p-4 shadow-card">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-bold shrink-0">
                      {comment.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{comment.user}</span>
                        <span className="text-xs text-muted-foreground">{comment.date}</span>
                      </div>
                      <p className="text-sm text-foreground/80 mt-1">{comment.text}</p>
                      <button className="flex items-center gap-1 mt-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                        <Heart className="h-3 w-3" />{comment.likes}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Profile;
