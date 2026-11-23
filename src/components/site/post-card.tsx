import { Link } from "@tanstack/react-router";
import { formatDate } from "@/lib/format";

type PostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
};

export function PostRow({ post }: { post: PostSummary }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group block border-t border-border py-8"
    >
      <p className="text-sm text-muted-foreground">
        {formatDate(post.date)}
        {post.category && <> · {post.category}</>}
      </p>
      <h3 className="mt-2 font-display text-2xl leading-snug text-foreground underline-offset-4 group-hover:underline">
        {post.title}
      </h3>
      {post.excerpt && <p className="mt-2 leading-relaxed text-muted-foreground">{post.excerpt}</p>}
    </Link>
  );
}
