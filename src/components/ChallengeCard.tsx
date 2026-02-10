import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { ReadingChallenge } from "@/lib/mockData";
import { motion } from "framer-motion";

interface ChallengeCardProps {
  challenge: ReadingChallenge;
  index?: number;
}

export function ChallengeCard({ challenge, index = 0 }: ChallengeCardProps) {
  const percentage = Math.round((challenge.current / challenge.target) * 100);

  return (
    <Link to={`/challenge/${challenge.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08 }}
        className="rounded-xl bg-card p-5 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer group"
      >
        <div className="flex items-start gap-3">
          <span className="text-3xl">{challenge.icon}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
              {challenge.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">{challenge.description}</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-foreground">
              {challenge.current} / {challenge.target}
            </span>
            <span className="text-muted-foreground">{percentage}%</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.8, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full transition-all",
                percentage >= 80 ? "bg-accent" : "bg-primary"
              )}
            />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">
            {challenge.participants.toLocaleString()} partecipanti
          </span>
          <span className="text-[10px] text-muted-foreground">
            Scade: {new Date(challenge.endDate).toLocaleDateString('it-IT')}
          </span>
        </div>
      </motion.div>
    </Link>
  );
}
