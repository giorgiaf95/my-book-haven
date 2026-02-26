import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BookOpen, Search, Users, Trophy, UserCircle, Layers } from "lucide-react";
import { mockBooks, mockCommunities, mockChallenges, mockUsers, supportedLanguages } from "@/lib/mockData";
import { cn } from "@/lib/utils";

type SearchScope = "book" | "author" | "saga" | "user" | "community";

const scopeOptions: { value: SearchScope; label: string }[] = [
  { value: "book", label: "Libro" },
  { value: "author", label: "Autore" },
  { value: "saga", label: "Saga" },
  { value: "user", label: "Utente" },
  { value: "community", label: "Gruppo" },
];

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const scope = (searchParams.get("scope") as SearchScope) || "book";
  const language = searchParams.get("language") ?? "Tutte";

  const q = query.trim().toLowerCase();

  const bookResults = useMemo(() => {
    if (!q) return [];

    return mockBooks.filter((book) => {
      const matchesScope =
        (scope === "book" && book.title.toLowerCase().includes(q))
        || (scope === "author" && book.author.toLowerCase().includes(q))
        || (scope === "saga" && (book.saga ?? "").toLowerCase().includes(q));

      if (!matchesScope) return false;
      if (language !== "Tutte") return (book.language ?? "Italiano") === language;
      return true;
    });
  }, [language, q, scope]);

  const userResults = useMemo(() => {
    if (!q || scope !== "user") return [];
    return mockUsers.filter((user) => {
      const matchesLanguage = language === "Tutte" || user.language === language;
      return matchesLanguage && user.name.toLowerCase().includes(q);
    });
  }, [language, q, scope]);

  const communityResults = useMemo(() => {
    if (!q || scope !== "community") return [];
    return mockCommunities.filter((community) => community.name.toLowerCase().includes(q));
  }, [q, scope]);

  const challengeResults = useMemo(() => {
    if (!q || scope !== "book") return [];
    return mockChallenges.filter((challenge) => challenge.title.toLowerCase().includes(q)).slice(0, 3);
  }, [q, scope]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    next.set(key, value);
    setSearchParams(next);
  };

  const totalResults = bookResults.length + userResults.length + communityResults.length + challengeResults.length;

  return (
    <div className="container py-6 md:py-10 space-y-6 max-w-5xl">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Risultati ricerca</h1>
        <p className="text-sm text-muted-foreground mt-1">Usa i filtri avanzati per affinare i risultati</p>
      </div>

      <section className="rounded-xl bg-card border border-border p-4 md:p-5 space-y-4 shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => updateParam("q", e.target.value)}
              placeholder="Cerca..."
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <select
            value={language}
            onChange={(e) => updateParam("language", e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {supportedLanguages.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          {scopeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updateParam("scope", option.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                scope === option.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <div className="text-sm text-muted-foreground">
        {q ? `${totalResults} risultati per "${query}"` : "Inserisci una ricerca per vedere i risultati"}
      </div>

      {bookResults.length > 0 && (
        <section className="space-y-2">
          <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
            {scope === "saga" ? <Layers className="h-4 w-4 text-primary" /> : <BookOpen className="h-4 w-4 text-primary" />}
            Libri
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {bookResults.map((book) => (
              <Link key={book.id} to={`/book/${book.id}`} className="rounded-xl bg-card border border-border p-3 hover:shadow-card-hover transition-all">
                <div className="flex items-center gap-3">
                  <img src={book.cover} alt={book.title} className="w-12 h-16 rounded object-cover" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{book.title}</p>
                    <p className="text-xs text-muted-foreground">{book.author}</p>
                    {book.saga && <p className="text-[10px] text-primary mt-0.5">Saga: {book.saga}</p>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {userResults.length > 0 && (
        <section className="space-y-2">
          <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
            <UserCircle className="h-4 w-4 text-primary" /> Utenti
          </h2>
          <div className="space-y-2">
            {userResults.map((user) => (
              <Link key={user.id} to="/profile" className="block rounded-xl bg-card border border-border p-3 hover:shadow-card-hover transition-all">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex items-center justify-center">{user.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.bio}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {communityResults.length > 0 && (
        <section className="space-y-2">
          <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" /> Gruppi community
          </h2>
          <div className="space-y-2">
            {communityResults.map((community) => (
              <Link key={community.id} to={`/community/${community.id}`} className="block rounded-xl bg-card border border-border p-3 hover:shadow-card-hover transition-all">
                <p className="text-sm font-semibold text-foreground">{community.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{community.members.toLocaleString()} membri</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {challengeResults.length > 0 && (
        <section className="space-y-2">
          <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" /> Sfide correlate
          </h2>
          <div className="space-y-2">
            {challengeResults.map((challenge) => (
              <Link key={challenge.id} to={`/challenge/${challenge.id}`} className="block rounded-xl bg-card border border-border p-3 hover:shadow-card-hover transition-all">
                <p className="text-sm font-semibold text-foreground">{challenge.title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {q && totalResults === 0 && (
        <div className="rounded-xl bg-card border border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">Nessun risultato trovato. Prova con altri filtri.</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
