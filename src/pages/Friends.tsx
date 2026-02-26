import { Link } from "react-router-dom";
import { UserPlus, Users } from "lucide-react";
import { mockUsers } from "@/lib/mockData";

const Friends = () => {
  const suggestions = mockUsers;

  return (
    <div className="container py-6 md:py-10 max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Amici</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestisci e scopri nuove connessioni</p>
        </div>
      </div>

      <section className="rounded-2xl bg-card border border-border p-5 shadow-card">
        <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2 mb-3">
          <Users className="h-4 w-4 text-primary" /> Suggeriti per te
        </h2>
        <div className="space-y-2">
          {suggestions.map((user) => (
            <div key={user.id} className="rounded-xl bg-background border border-border p-3 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex items-center justify-center">
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/profile/${user.id}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                  {user.name}
                </Link>
                <p className="text-xs text-muted-foreground truncate">{user.bio}</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 flex items-center gap-1">
                <UserPlus className="h-3 w-3" /> Segui
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Friends;
