import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  Calendar, Users, BookOpen, Trophy, MessageSquare, Star,
  Edit3, Grid3X3, List, SlidersHorizontal, Heart, MapPin, Link as LinkIcon,
  Check, User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BookCard } from "@/components/BookCard";
import { ChallengeCard } from "@/components/ChallengeCard";
import { mockBooks, mockChallenges, mockCommunities, mockReviews, mockUsers, allGenres, allTags } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ProfileTab = "library" | "reviews" | "groups" | "challenges" | "guestbook";
type LibraryView = "grid" | "list";
type LibrarySort = "title" | "author" | "rating" | "dateAdded";
type FollowersModal = "followers" | "following" | null;
type EditableProfile = {
  name: string;
  username: string;
  bio: string;
  location: string;
  website: string;
};

const PROFILE_STORAGE_KEY = "bixblion-profile";

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

const socialGraph: Record<string, { followers: string[]; following: string[] }> = {
  me: { followers: ["u1", "u2", "u3"], following: ["u1", "u3"] },
  u1: { followers: ["me", "u2"], following: ["me"] },
  u2: { followers: ["me"], following: ["u1", "u3"] },
  u3: { followers: ["me", "u1"], following: ["me", "u2"] },
};

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialTab = (searchParams.get("tab") as ProfileTab) || "library";

  const [activeTab, setActiveTab] = useState<ProfileTab>(tabs.some((tab) => tab.value === initialTab) ? initialTab : "library");
  const [followersModal, setFollowersModal] = useState<FollowersModal>(null);
  const [libraryView, setLibraryView] = useState<LibraryView>("grid");
  const [librarySort, setLibrarySort] = useState<LibrarySort>("dateAdded");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileOverrides, setProfileOverrides] = useState<EditableProfile | null>(null);
  const [editDraft, setEditDraft] = useState<EditableProfile>({
    name: "",
    username: "",
    bio: "",
    location: "",
    website: "",
  });
  const [challengeFilter, setChallengeFilter] = useState<"active" | "completed">("active");
  const [libraryPage, setLibraryPage] = useState(1);
  const isOwnProfile = !id;

  const baseUser = useMemo(() => {
    const me = {
      id: "me",
      name: "Marco Lettore",
      username: "@marcolettore",
      avatar: "",
      bio: "Appassionato lettore e collezionista di storie. Sempre alla ricerca del prossimo libro da divorare. 📚",
      location: "Milano, Italia",
      website: "marcolettore.blog",
      joinDate: "Gennaio 2024",
      books: mockBooks.length,
      pagesRead: 12450,
    };

    if (!id) return me;

    const found = mockUsers.find((user) => user.id === id);
    if (!found) return me;

    return {
      id: found.id,
      name: found.name,
      username: `@${found.name.toLowerCase().replace(/\s+/g, "")}`,
      avatar: found.avatar,
      bio: found.bio,
      location: "Italia",
      website: "profilo.bixblion.app",
      joinDate: "Marzo 2024",
      books: Math.max(12, mockBooks.length - 3),
      pagesRead: 7800,
    };
  }, [id]);

  useEffect(() => {
    if (!isOwnProfile) {
      setProfileOverrides(null);
      return;
    }
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) {
      setProfileOverrides(null);
      return;
    }
    try {
      setProfileOverrides(JSON.parse(raw) as EditableProfile);
    } catch {
      setProfileOverrides(null);
    }
  }, [isOwnProfile]);

  const currentUser = useMemo(() => {
    if (!isOwnProfile || !profileOverrides) return baseUser;
    return {
      ...baseUser,
      ...profileOverrides,
      username: profileOverrides.username.startsWith("@")
        ? profileOverrides.username
        : `@${profileOverrides.username}`,
    };
  }, [baseUser, isOwnProfile, profileOverrides]);

  useEffect(() => {
    setEditDraft({
      name: currentUser.name,
      username: currentUser.username,
      bio: currentUser.bio,
      location: currentUser.location,
      website: currentUser.website,
    });
  }, [currentUser]);

  const startEditing = () => {
    if (!isOwnProfile) return;
    setEditDraft({
      name: currentUser.name,
      username: currentUser.username,
      bio: currentUser.bio,
      location: currentUser.location,
      website: currentUser.website,
    });
    setIsEditing(true);
  };

  const saveProfileChanges = () => {
    const cleanName = editDraft.name.trim();
    const cleanUsername = editDraft.username.trim().replace(/\s+/g, "");
    const normalizedUsername = cleanUsername.startsWith("@") ? cleanUsername : `@${cleanUsername}`;
    if (cleanName.length < 2) {
      toast("Inserisci un nome valido");
      return;
    }
    if (normalizedUsername.length < 4) {
      toast("Nome utente troppo corto");
      return;
    }
    const nextProfile: EditableProfile = {
      name: cleanName,
      username: normalizedUsername,
      bio: editDraft.bio.trim(),
      location: editDraft.location.trim(),
      website: editDraft.website.trim(),
    };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
    setProfileOverrides(nextProfile);
    setIsEditing(false);
    toast("Nome utente aggiornato con successo");
  };

  const connections = socialGraph[currentUser.id] ?? socialGraph.me;
  const followers = mockUsers.filter((user) => connections.followers.includes(user.id));
  const following = mockUsers.filter((user) => connections.following.includes(user.id));

  const reviewsByProfile = mockReviews.filter((review) =>
    currentUser.id === "me"
      ? true
      : review.userName.toLowerCase().startsWith(currentUser.name.split(" ")[0].toLowerCase())
  );

  const profileStats = {
    books: currentUser.books,
    reviews: reviewsByProfile.length,
    followers: followers.length,
    following: following.length,
    pagesRead: currentUser.pagesRead,
    challengesCompleted: mockChallenges.filter((challenge) => challenge.current >= challenge.target).length,
  };

  useEffect(() => {
    const next = new URLSearchParams();
    next.set("tab", activeTab);
    setSearchParams(next, { replace: true });
  }, [activeTab, setSearchParams]);

  const filteredBooks = useMemo(() => {
    let books = [...mockBooks];
    if (selectedGenres.length > 0) books = books.filter((book) => book.genre.some((genre) => selectedGenres.includes(genre)));
    if (selectedTags.length > 0) books = books.filter((book) => book.tags.some((tag) => selectedTags.includes(tag)));

    books.sort((a, b) => {
      switch (librarySort) {
        case "title":
          return a.title.localeCompare(b.title);
        case "author":
          return a.author.localeCompare(b.author);
        case "rating":
          return b.rating - a.rating;
        case "dateAdded":
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        default:
          return 0;
      }
    });

    return books;
  }, [librarySort, selectedGenres, selectedTags]);

  const booksPerPage = 15;
  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / booksPerPage));

  useEffect(() => {
    setLibraryPage(1);
  }, [librarySort, selectedGenres, selectedTags]);

  const pagedBooks = filteredBooks.slice((libraryPage - 1) * booksPerPage, libraryPage * booksPerPage);

  const activeChallenges = mockChallenges.filter((challenge) => challenge.current < challenge.target);
  const completedChallenges = mockChallenges.filter((challenge) => challenge.current >= challenge.target);

  return (
    <div className="container py-6 md:py-10 space-y-6 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-card border border-border shadow-card p-6 md:p-8"
      >
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold font-display shrink-0">
            {currentUser.avatar ? currentUser.avatar : <User className="h-8 w-8" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                {isEditing ? (
                  <div className="space-y-2 min-w-[220px]">
                    <input
                      value={editDraft.name}
                      onChange={(e) => setEditDraft((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full rounded-lg bg-background border border-border px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="Nome"
                    />
                    <input
                      value={editDraft.username}
                      onChange={(e) => setEditDraft((prev) => ({ ...prev, username: e.target.value }))}
                      className="w-full rounded-lg bg-background border border-border px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="@nomeutente"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="font-display text-2xl font-bold text-foreground">{currentUser.name}</h1>
                    <p className="text-sm text-muted-foreground">{currentUser.username}</p>
                  </>
                )}
              </div>
              {isOwnProfile && (
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                      >
                        Annulla
                      </button>
                      <button
                        onClick={saveProfileChanges}
                        className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                      >
                        Salva
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={startEditing}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      Modifica
                    </button>
                  )}
                </div>
              )}
            </div>
            {isEditing ? (
              <textarea
                value={editDraft.bio}
                onChange={(e) => setEditDraft((prev) => ({ ...prev, bio: e.target.value }))}
                className="w-full mt-2 rounded-lg bg-background border border-border px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                rows={3}
                placeholder="Bio"
              />
            ) : (
              <p className="text-sm text-foreground/80 mt-2">{currentUser.bio}</p>
            )}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-muted-foreground">
              {isEditing ? (
                <>
                  <input
                    value={editDraft.location}
                    onChange={(e) => setEditDraft((prev) => ({ ...prev, location: e.target.value }))}
                    className="rounded-lg bg-background border border-border px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Località"
                  />
                  <input
                    value={editDraft.website}
                    onChange={(e) => setEditDraft((prev) => ({ ...prev, website: e.target.value }))}
                    className="rounded-lg bg-background border border-border px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Sito web"
                  />
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{currentUser.location}</span>
                  <span className="flex items-center gap-1"><LinkIcon className="h-3.5 w-3.5" />{currentUser.website}</span>
                </>
              )}
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Iscritto da {currentUser.joinDate}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-border">
          <button onClick={() => setFollowersModal("followers")} className="text-center rounded-lg hover:bg-secondary/50 py-1 transition-colors">
            <p className="text-lg font-bold text-foreground font-display">{profileStats.followers}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Follower</p>
          </button>
          <button onClick={() => setFollowersModal("following")} className="text-center rounded-lg hover:bg-secondary/50 py-1 transition-colors">
            <p className="text-lg font-bold text-foreground font-display">{profileStats.following}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Seguiti</p>
          </button>
          <button onClick={() => setActiveTab("reviews")} className="text-center rounded-lg hover:bg-secondary/50 py-1 transition-colors">
            <p className="text-lg font-bold text-foreground font-display">{profileStats.reviews}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Recensioni</p>
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {followersModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/35"
              onClick={() => setFollowersModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-md rounded-2xl bg-card border border-border shadow-float"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {followersModal === "followers" ? "Follower" : "Seguiti"}
                </h3>
                <button onClick={() => setFollowersModal(null)} className="text-xs text-muted-foreground hover:text-foreground">Chiudi</button>
              </div>
              <div className="p-3 max-h-[55vh] overflow-y-auto space-y-2">
                {(followersModal === "followers" ? followers : following).map((friend) => (
                  <Link key={friend.id} to={`/profile/${friend.id}`} onClick={() => setFollowersModal(null)} className="block rounded-xl bg-background border border-border p-3 hover:bg-secondary/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground">{friend.avatar}</div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{friend.name}</p>
                        <p className="text-xs text-muted-foreground">{friend.bio}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex overflow-x-auto gap-1 border-b border-border pb-px scrollbar-hide">
        {tabs.map((tab) => {
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

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "library" && (
            <div className="space-y-4">
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
                  onChange={(e) => setLibrarySort(e.target.value as LibrarySort)}
                  className="px-3 py-2 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="dateAdded">Data aggiunta</option>
                  <option value="title">Titolo</option>
                  <option value="author">Autore</option>
                  <option value="rating">Valutazione</option>
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
                  {selectedGenres.length + selectedTags.length > 0 && (
                    <span className="h-5 w-5 rounded-full bg-primary-foreground text-primary text-[10px] flex items-center justify-center font-bold">
                      {selectedGenres.length + selectedTags.length}
                    </span>
                  )}
                </button>
              </div>

              <AnimatePresence>
                {showFilters && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="rounded-xl bg-card border border-border p-4 space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Generi</label>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {allGenres.map((genre) => (
                            <button key={genre} onClick={() => setSelectedGenres((prev) => prev.includes(genre) ? prev.filter((item) => item !== genre) : [...prev, genre])}
                              className={cn("px-2.5 py-1 rounded-full text-xs font-medium transition-all", selectedGenres.includes(genre) ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80")}>
                              {genre}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tag</label>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {allTags.map((tag) => (
                            <button key={tag} onClick={() => setSelectedTags((prev) => prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag])}
                              className={cn("px-2.5 py-1 rounded-full text-xs font-medium transition-all", selectedTags.includes(tag) ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80")}>
                              #{tag}
                            </button>
                          ))}
                        </div>
                      </div>

                      {selectedGenres.length + selectedTags.length > 0 && (
                        <button onClick={() => { setSelectedGenres([]); setSelectedTags([]); }} className="text-xs text-destructive font-medium hover:underline">
                          Rimuovi filtri
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className={cn(libraryView === "grid" ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" : "space-y-3")}>
                {pagedBooks.map((book, i) => (
                  <BookCard key={book.id} book={book} index={i} variant={libraryView} />
                ))}
              </div>

              {filteredBooks.length > booksPerPage && (
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const page = idx + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setLibraryPage(page)}
                        className={cn(
                          "h-8 min-w-8 px-2 rounded-lg text-xs font-medium border transition-colors",
                          libraryPage === page
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card text-muted-foreground border-border hover:text-foreground hover:bg-secondary"
                        )}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
              )}

              {filteredBooks.length === 0 && (
                <p className="text-center text-muted-foreground py-12">Nessun libro corrisponde ai filtri selezionati</p>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div id="profile-reviews" className="space-y-4">
              {reviewsByProfile.map((review) => {
                const book = mockBooks.find((item) => item.id === review.bookId);
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

          {activeTab === "groups" && (
            <div className="space-y-4">
              <h3 className="font-display font-semibold text-lg text-foreground">Gruppi iscritti</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mockCommunities.filter((community) => community.isJoined).map((community) => (
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
            </div>
          )}

          {activeTab === "challenges" && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <button onClick={() => setChallengeFilter("active")} className={cn("px-4 py-2 rounded-xl text-sm font-medium", challengeFilter === "active" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:bg-secondary")}>
                  In corso ({activeChallenges.length})
                </button>
                <button onClick={() => setChallengeFilter("completed")} className={cn("px-4 py-2 rounded-xl text-sm font-medium", challengeFilter === "completed" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:bg-secondary")}>
                  Completate ({completedChallenges.length})
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(challengeFilter === "active" ? activeChallenges : completedChallenges).map((challenge, i) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} index={i} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "guestbook" && (
            <div className="space-y-4">
              <div className="rounded-xl bg-card border border-border p-4 shadow-card">
                <textarea
                  placeholder="Scrivi un commento in bacheca..."
                  className="w-full min-h-[80px] bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none"
                />
                <div className="flex justify-end mt-2">
                  <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Pubblica</button>
                </div>
              </div>

              {guestbookComments.map((comment) => (
                <div key={comment.id} className="rounded-xl bg-card border border-border p-4 shadow-card">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-bold shrink-0">{comment.avatar}</div>
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
