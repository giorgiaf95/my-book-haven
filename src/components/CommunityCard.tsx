import { Link } from "react-router-dom";
import type { CommunityGroup } from "@/lib/mockData";
import { Users } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CommunityCardProps {
  community: CommunityGroup;
  index?: number;
}

export function CommunityCard({ community, index = 0 }: CommunityCardProps) {
  return (
    <Link to={`/community/${community.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.07 }}
        className="rounded-xl overflow-hidden bg-card shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer group"
      >
        <div className="relative h-32 overflow-hidden">
          <img
            src={community.image}
            alt={community.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="font-display font-bold text-primary-foreground text-lg">{community.name}</h3>
          </div>
          <span className="absolute top-2 right-2 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-background/80 text-foreground backdrop-blur-sm">
            {community.category}
          </span>
        </div>
        <div className="p-4">
          <p className="text-xs text-muted-foreground line-clamp-2">{community.description}</p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span>{community.members.toLocaleString()} membri</span>
            </div>
            <span
              className={cn(
                "text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200",
                community.isJoined
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-primary text-primary-foreground hover:opacity-90"
              )}
            >
              {community.isJoined ? "Iscritto" : "Unisciti"}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
