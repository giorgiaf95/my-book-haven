import { Star, StarHalf } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { Book } from "@/lib/mockData";
import { motion } from "framer-motion";

interface BookCardProps {
  book: Book;
  index?: number;
  variant?: "grid" | "list";
}

function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < fullStars) {
          return <Star key={i} className="h-3 w-3 fill-primary text-primary" />;
        }
        if (i === fullStars && hasHalf) {
          return <StarHalf key={i} className="h-3 w-3 fill-primary text-primary" />;
        }
        return <Star key={i} className="h-3 w-3 text-border" />;
      })}
      <span className="ml-1 text-xs text-muted-foreground">{rating}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: Book['status'] }) {
  const config = {
    reading: { label: 'In lettura', className: 'bg-primary/15 text-primary' },
    read: { label: 'Letto', className: 'bg-accent/15 text-accent' },
    'to-read': { label: 'Da leggere', className: 'bg-secondary text-secondary-foreground' },
    abandoned: { label: 'Abbandonato', className: 'bg-destructive/15 text-destructive' },
  };
  const { label, className } = config[status];
  return (
    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide", className)}>
      {label}
    </span>
  );
}

export function BookCard({ book, index = 0, variant = "grid" }: BookCardProps) {
  if (variant === "list") {
    return (
      <Link to={`/book/${book.id}`}>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex gap-4 p-3 rounded-xl bg-card shadow-card hover:shadow-card-hover transition-all duration-300 group cursor-pointer"
        >
          <img
            src={book.cover}
            alt={book.title}
            className="w-16 h-24 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-sm text-card-foreground truncate group-hover:text-primary transition-colors">
              {book.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{book.author}</p>
            <RatingStars rating={book.rating} />
            <div className="flex items-center gap-2 mt-2">
              <StatusBadge status={book.status} />
              {book.progress !== undefined && (
                <div className="flex-1 max-w-[100px]">
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${book.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link to={`/book/${book.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06, duration: 0.4 }}
        className="group cursor-pointer"
      >
        <div className="relative overflow-hidden rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300">
          <img
            src={book.cover}
            alt={book.title}
            className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
            <p className="text-primary-foreground text-xs line-clamp-2">{book.description}</p>
          </div>
          <div className="absolute top-2 right-2">
            <StatusBadge status={book.status} />
          </div>
          {book.progress !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-foreground/20">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${book.progress}%` }}
              />
            </div>
          )}
        </div>
        <div className="mt-2.5 px-0.5">
          <h3 className="font-display font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">{book.author}</p>
          <RatingStars rating={book.rating} />
        </div>
      </motion.div>
    </Link>
  );
}
