import { useMemo, useState } from "react";
import { Trophy, Flame, Target, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { ChallengeCard } from "@/components/ChallengeCard";
import { mockChallenges } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "active", label: "Attive", icon: Flame },
  { id: "completed", label: "Completate", icon: Trophy },
  { id: "available", label: "Disponibili", icon: Target },
];

const leaderboard = [
  { rank: 1, name: "Maria R.", books: 48, avatar: "MR" },
  { rank: 2, name: "Luca P.", books: 42, avatar: "LP" },
  { rank: 3, name: "Sofia V.", books: 39, avatar: "SV" },
  { rank: 4, name: "Tu", books: 34, avatar: "TU", isUser: true },
  { rank: 5, name: "Andrea M.", books: 31, avatar: "AM" },
];

const Challenges = () => {
  const [activeTab, setActiveTab] = useState("active");
  const filteredChallenges = useMemo(() => {
    if (activeTab === "completed") {
      return mockChallenges.filter(challenge => challenge.current >= challenge.target);
    }
    if (activeTab === "available") {
      return mockChallenges;
    }
    return mockChallenges.filter(challenge => challenge.current < challenge.target);
  }, [activeTab]);

  return (
    <div className="container py-6 md:py-10 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
          <Trophy className="h-7 w-7 text-primary" /> Sfide di lettura
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Competi con altri lettori e raggiungi i tuoi obiettivi</p>
      </motion.div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Sfide attive", value: "4", icon: Flame, color: "text-primary" },
          { label: "Completate", value: "7", icon: Trophy, color: "text-accent" },
          { label: "Giorni streak", value: "23", icon: Clock, color: "text-rose-soft" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="rounded-xl bg-card p-4 shadow-card text-center"
            >
              <Icon className={cn("h-5 w-5 mx-auto mb-1", stat.color)} />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-secondary rounded-xl w-fit">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredChallenges.map((challenge, i) => (
          <ChallengeCard key={challenge.id} challenge={challenge} index={i} />
        ))}
      </div>

      {/* Leaderboard */}
      <section>
        <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          🏅 Classifica lettori
        </h2>
        <div className="rounded-xl bg-card shadow-card overflow-hidden">
          {leaderboard.map((user, i) => (
            <motion.div
              key={user.rank}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className={cn(
                "flex items-center gap-4 px-5 py-3.5 border-b border-border last:border-b-0 transition-colors",
                user.isUser && "bg-primary/5"
              )}
            >
              <span className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                user.rank === 1 && "bg-warm-gold/20 text-warm-gold",
                user.rank === 2 && "bg-muted text-muted-foreground",
                user.rank === 3 && "bg-primary/15 text-primary",
                user.rank > 3 && "text-muted-foreground"
              )}>
                {user.rank <= 3 ? ["🥇", "🥈", "🥉"][user.rank - 1] : user.rank}
              </span>
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground">
                {user.avatar}
              </div>
              <span className={cn("flex-1 text-sm font-medium", user.isUser ? "text-primary" : "text-foreground")}>
                {user.name}
                {user.isUser && <span className="ml-2 text-[10px] text-primary opacity-70">(tu)</span>}
              </span>
              <span className="text-sm font-semibold text-foreground">{user.books} libri</span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Challenges;
