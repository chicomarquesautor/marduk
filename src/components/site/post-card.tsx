import { Link } from "@tanstack/react-router";
import { formatShortDate } from "@/lib/format";

type PostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
};

export function PostRow({ post, entry }: { post: PostSummary; entry: number }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group grid gap-4 border-t border-border/70 py-10 transition-colors duration-700 sm:grid-cols-[9rem_1fr] sm:gap-10"
    >
      <div className="flex flex-row gap-4 sm:flex-col sm:gap-2">
        <span className="font-mono text-xs tracking-[0.25em] text-muted-foreground">
          Nº {String(entry).padStart(2, "0")}
        </span>
        <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground/70">
          {formatShortDate(post.date)}
        </span>
      </div>
      <div>
        <p className="eyebrow mb-3 text-ember">{post.category}</p>
        <h3 className="font-display text-3xl leading-tight text-foreground/90 transition-all duration-700 group-hover:text-foreground group-hover:text-glow sm:text-4xl">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground transition-colors duration-700 group-hover:text-foreground/80">
            {post.excerpt}
          </p>
        )}
        <span className="mt-5 inline-block font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground opacity-0 transition-all duration-700 group-hover:translate-x-2 group-hover:opacity-100">
          Ler →
        </span>
      </div>
    </Link>
  );
}
