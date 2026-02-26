import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Users, TrendingUp, Plus, Megaphone, Trophy, Clock3 } from "lucide-react";
import { CommunityCard } from "@/components/CommunityCard";
import { mockCommunities } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "all", label: "Tutte" },
  { id: "joined", label: "Iscritto" },
  { id: "popular", label: "Popolari" },
];

const sideBanners = [
  { id: "c1", title: "Nuovo concorso", text: "Partecipa e vinci 3 ebook", icon: Megaphone, action: "Partecipa" },
  { id: "c2", title: "Sfida community", text: "Classici Italiani: 12/30 giorni", icon: Trophy, action: "Apri" },
  { id: "c3", title: "Aggiornamento", text: "Nuove regole moderazione disponibili", icon: Clock3, action: "Leggi" },
];

const Community = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCommunities = mockCommunities.filter((community) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!community.name.toLowerCase().includes(q) && !community.description.toLowerCase().includes(q)) return false;
    }
    if (activeTab === "joined") return community.isJoined;
    if (activeTab === "popular") return community.members > 3000;
    return true;
  });

  return (
    <div className="container py-6 md:py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Community</h1>
          <p className="text-sm text-muted-foreground mt-1">Unisciti a gruppi di lettori appassionati</p>
        </div>
        <Link
          to="/community/create"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Crea gruppo</span>
        </Link>
      </div>

      <div className="flex items-center gap-6 py-3">
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">{mockCommunities.filter((community) => community.isJoined).length}</span>
          <span className="text-muted-foreground">gruppi iscritti</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="h-4 w-4 text-accent" />
          <span className="font-medium text-foreground">{mockCommunities.reduce((sum, community) => sum + community.members, 0).toLocaleString()}</span>
          <span className="text-muted-foreground">lettori attivi</span>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cerca community..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        />
      </div>

      <div className="flex gap-1 p-1 bg-secondary rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === tab.id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 items-start">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCommunities.map((community, i) => (
            <CommunityCard key={community.id} community={community} index={i} />
          ))}
        </div>

        <aside className="space-y-3">
          {sideBanners.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="rounded-xl bg-card border border-border p-3 shadow-card">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{item.text}</p>
                <button className="mt-2 text-xs font-medium text-primary hover:underline">{item.action}</button>
              </div>
            );
          })}
        </aside>
      </div>

      {filteredCommunities.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">Nessuna community trovata</p>
        </div>
      )}
    </div>
  );
};

export default Community;
