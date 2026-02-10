import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Trophy, Users, Calendar, Target, Flame, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { mockChallenges } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const mockParticipants = [
  { rank: 1, name: "Maria R.", avatar: "MR", progress: 48 },
  { rank: 2, name: "Luca P.", avatar: "LP", progress: 42 },
  { rank: 3, name: "Sofia V.", avatar: "SV", progress: 39 },
  { rank: 4, name: "Tu", avatar: "ML", progress: 34, isUser: true },
  { rank: 5, name: "Andrea M.", avatar: "AM", progress: 31 },
  { rank: 6, name: "Giulia F.", avatar: "GF", progress: 28 },
  { rank: 7, name: "Elena B.", avatar: "EB", progress: 25 },
];

const recentActivity = [
  { user: "Maria R.", action: "ha letto il 48° libro", time: "2 ore fa" },
  { user: "Luca P.", action: "ha completato 'Dune'", time: "5 ore fa" },
  { user: "Tu", action: "hai letto 'Norwegian Wood'", time: "1 giorno fa" },
  { user: "Sofia V.", action: "ha iniziato 'Il Piccolo Principe'", time: "2 giorni fa" },
];

const rules = [
  "Ogni libro completato viene conteggiato una sola volta",
  "I libri devono avere almeno 80 pagine per essere validi",
  "Audiolibri e e-book sono accettati",
  "La sfida termina alla data indicata",
  "La classifica viene aggiornata automaticamente",
];

const ChallengeDetail = () => {
  const { id } = useParams();
  const challenge = mockChallenges.find(c => c.id === id);

  if (!challenge) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Sfida non trovata</p>
        <Link to="/challenges" className="text-primary text-sm hover:underline mt-2 inline-block">Torna alle sfide</Link>
      </div>
    );
  }

  const percentage = Math.round((challenge.current / challenge.target) * 100);
  const isCompleted = challenge.current >= challenge.target;

  return (
    <div className="container py-6 md:py-10 space-y-6 max-w-4xl">
      <Link to="/challenges" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Tutte le sfide
      </Link>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-card border border-border p-6 md:p-8 shadow-card">
        <div className="flex items-start gap-4">
          <span className="text-5xl">{challenge.icon}</span>
          <div className="flex-1">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">{challenge.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{challenge.participants.toLocaleString()} partecipanti</span>
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Scade: {new Date(challenge.endDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-6 p-4 rounded-xl bg-secondary/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Target className="h-4 w-4 text-primary" /> Il tuo progresso
            </span>
            <span className={cn("text-sm font-bold", isCompleted ? "text-accent" : "text-primary")}>
              {challenge.current} / {challenge.target} {percentage >= 100 ? "✓" : `(${percentage}%)`}
            </span>
          </div>
          <div className="h-3 rounded-full bg-secondary overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(percentage, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={cn("h-full rounded-full", isCompleted ? "bg-accent" : "bg-primary")}
            />
          </div>
        </div>

        <button className={cn(
          "mt-4 px-5 py-2.5 rounded-xl text-sm font-medium transition-all",
          isCompleted ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground hover:opacity-90"
        )}>
          {isCompleted ? "Sfida completata! 🎉" : "Aggiorna progresso"}
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Leaderboard */}
        <section className="rounded-2xl bg-card border border-border shadow-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
              🏅 Classifica
            </h2>
          </div>
          {mockParticipants.map((user, i) => (
            <motion.div
              key={user.rank}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className={cn(
                "flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0",
                user.isUser && "bg-primary/5"
              )}
            >
              <span className="w-6 text-center text-xs font-bold text-muted-foreground">
                {user.rank <= 3 ? ["🥇", "🥈", "🥉"][user.rank - 1] : user.rank}
              </span>
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground">{user.avatar}</div>
              <span className={cn("flex-1 text-sm font-medium", user.isUser ? "text-primary" : "text-foreground")}>
                {user.name} {user.isUser && <span className="text-[10px] opacity-70">(tu)</span>}
              </span>
              <span className="text-xs font-semibold text-foreground">{user.progress}</span>
            </motion.div>
          ))}
        </section>

        {/* Rules + Activity */}
        <div className="space-y-6">
          {/* Rules */}
          <section className="rounded-2xl bg-card border border-border p-5 shadow-card">
            <h2 className="font-display font-semibold text-lg text-foreground mb-3 flex items-center gap-2">
              📋 Regole
            </h2>
            <ul className="space-y-2">
              {rules.map((rule, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="text-primary mt-0.5">•</span> {rule}
                </li>
              ))}
            </ul>
          </section>

          {/* Recent Activity */}
          <section className="rounded-2xl bg-card border border-border p-5 shadow-card">
            <h2 className="font-display font-semibold text-lg text-foreground mb-3 flex items-center gap-2">
              <Flame className="h-4 w-4 text-primary" /> Attività recente
            </h2>
            <div className="space-y-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-foreground">{a.user}</span>
                  <span className="text-muted-foreground">{a.action}</span>
                  <span className="text-[10px] text-muted-foreground ml-auto">{a.time}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail;
