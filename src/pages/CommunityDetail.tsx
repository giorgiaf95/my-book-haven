import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Users, Shield, MessageSquare, Hash, ArrowLeft, Crown, Settings as SettingsIcon } from "lucide-react";
import { motion } from "framer-motion";
import { mockCommunities } from "@/lib/mockData";
import { cn } from "@/lib/utils";

type CommunityTab = "chat" | "topics" | "members";

const mockChannels = [
  { id: "ch1", name: "benvenuto", icon: "👋", description: "Presentati alla community!", messages: 142, lastActivity: "2 min fa" },
  { id: "ch2", name: "consigli-di-lettura", icon: "📚", description: "Condividi e chiedi consigli sui libri", messages: 856, lastActivity: "5 min fa" },
  { id: "ch3", name: "discussioni-libere", icon: "💬", description: "Chiacchiere su qualsiasi argomento", messages: 2341, lastActivity: "1 min fa" },
  { id: "ch4", name: "regole", icon: "📋", description: "Leggi le regole del gruppo", messages: 1, lastActivity: "1 mese fa" },
  { id: "ch5", name: "eventi", icon: "🎉", description: "Meetup e eventi organizzati dal gruppo", messages: 67, lastActivity: "3 ore fa" },
];

const mockTopics = [
  { id: "t1", title: "Qual è il libro che vi ha cambiato la vita?", author: "Sofia V.", replies: 48, lastReply: "1 ora fa" },
  { id: "t2", title: "Consigli fantasy per principianti", author: "Andrea M.", replies: 23, lastReply: "3 ore fa" },
  { id: "t3", title: "Libro del mese: Febbraio 2026", author: "Admin", replies: 67, lastReply: "30 min fa", pinned: true },
  { id: "t4", title: "Autori italiani sottovalutati", author: "Giulia F.", replies: 15, lastReply: "1 giorno fa" },
  { id: "t5", title: "E-book vs Cartaceo: il dibattito eterno", author: "Luca P.", replies: 92, lastReply: "2 ore fa" },
];

const mockMembers = [
  { id: "m1", name: "Marco R.", avatar: "MR", role: "admin", joinDate: "Gen 2024" },
  { id: "m2", name: "Sofia V.", avatar: "SV", role: "admin", joinDate: "Gen 2024" },
  { id: "m3", name: "Andrea M.", avatar: "AM", role: "moderator", joinDate: "Feb 2024" },
  { id: "m4", name: "Giulia F.", avatar: "GF", role: "member", joinDate: "Mar 2024" },
  { id: "m5", name: "Luca P.", avatar: "LP", role: "member", joinDate: "Apr 2024" },
  { id: "m6", name: "Elena B.", avatar: "EB", role: "member", joinDate: "Mag 2024" },
  { id: "m7", name: "Francesco D.", avatar: "FD", role: "member", joinDate: "Giu 2024" },
  { id: "m8", name: "Chiara T.", avatar: "CT", role: "member", joinDate: "Lug 2024" },
];

const tabs: { id: CommunityTab; label: string; icon: typeof MessageSquare }[] = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "topics", label: "Topic", icon: Hash },
  { id: "members", label: "Membri", icon: Users },
];

const CommunityDetail = () => {
  const { id } = useParams();
  const community = mockCommunities.find(c => c.id === id);
  const [activeTab, setActiveTab] = useState<CommunityTab>("chat");

  if (!community) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Community non trovata</p>
        <Link to="/community" className="text-primary text-sm hover:underline mt-2 inline-block">Torna alle community</Link>
      </div>
    );
  }

  const admins = mockMembers.filter(m => m.role === "admin");
  const moderators = mockMembers.filter(m => m.role === "moderator");
  const members = mockMembers.filter(m => m.role === "member");

  return (
    <div className="container py-6 md:py-10 space-y-6 max-w-4xl">
      {/* Back */}
      <Link to="/community" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Tutte le community
      </Link>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl overflow-hidden bg-card border border-border shadow-card">
        <div className="h-40 md:h-52 overflow-hidden relative">
          <img src={community.image} alt={community.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-background/80 text-foreground backdrop-blur-sm font-medium">{community.category}</span>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-white mt-2">{community.name}</h1>
          </div>
        </div>
        <div className="p-5">
          <p className="text-sm text-foreground/80">{community.description}</p>
          <div className="flex items-center gap-6 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{community.members.toLocaleString()} membri</span>
            <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" />{admins.length} admin</span>
          </div>
          <div className="flex gap-2 mt-4">
            <button className={cn(
              "px-5 py-2 rounded-xl text-sm font-medium transition-all",
              community.isJoined ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground hover:opacity-90"
            )}>
              {community.isJoined ? "Iscritto ✓" : "Unisciti"}
            </button>
            {community.isJoined && (
              <button className="p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors">
                <SettingsIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>

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
                activeTab === tab.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Chat channels */}
      {activeTab === "chat" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          {mockChannels.map((channel, i) => (
            <motion.div
              key={channel.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 rounded-xl bg-card border border-border p-4 shadow-card hover:shadow-card-hover transition-all cursor-pointer"
            >
              <span className="text-xl">{channel.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground">{channel.name}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{channel.description}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-muted-foreground">{channel.messages} msg</p>
                <p className="text-[10px] text-muted-foreground">{channel.lastActivity}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Topics */}
      {activeTab === "topics" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          {mockTopics.map((topic, i) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "rounded-xl bg-card border p-4 shadow-card hover:shadow-card-hover transition-all cursor-pointer",
                topic.pinned ? "border-primary/30 bg-primary/5" : "border-border"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {topic.pinned && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-medium">📌 Fissato</span>}
                    <h3 className="text-sm font-semibold text-foreground">{topic.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">di {topic.author} · {topic.replies} risposte · ultimo {topic.lastReply}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Members */}
      {activeTab === "members" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Admins */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Crown className="h-3.5 w-3.5 text-warm-gold" /> Amministratori ({admins.length})
            </h3>
            <div className="space-y-2">
              {admins.map(member => (
                <div key={member.id} className="flex items-center gap-3 rounded-xl bg-card border border-border p-3 shadow-card">
                  <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">{member.avatar}</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{member.name}</p>
                    <p className="text-[10px] text-muted-foreground">Iscritto da {member.joinDate}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-warm-gold/15 text-warm-gold font-medium">Admin</span>
                </div>
              ))}
            </div>
          </div>

          {/* Moderators */}
          {moderators.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-accent" /> Moderatori ({moderators.length})
              </h3>
              <div className="space-y-2">
                {moderators.map(member => (
                  <div key={member.id} className="flex items-center gap-3 rounded-xl bg-card border border-border p-3 shadow-card">
                    <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-xs font-bold">{member.avatar}</div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{member.name}</p>
                      <p className="text-[10px] text-muted-foreground">Iscritto da {member.joinDate}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/15 text-accent font-medium">Mod</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Members */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Membri ({members.length})
            </h3>
            <div className="space-y-2">
              {members.map(member => (
                <div key={member.id} className="flex items-center gap-3 rounded-xl bg-card border border-border p-3 shadow-card">
                  <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-bold">{member.avatar}</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{member.name}</p>
                    <p className="text-[10px] text-muted-foreground">Iscritto da {member.joinDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CommunityDetail;
