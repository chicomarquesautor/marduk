import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Markdown } from "@/components/site/markdown";
import { formatDate } from "@/lib/format";
import { getPost, getPosts } from "@/lib/content";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    const posts = getPosts();
    const index = posts.findIndex((p) => p.slug === post.slug);
    const newer = index > 0 ? posts[index - 1] : undefined;
    const older = posts[index + 1];
    return {
      post,
      newer: newer ? { slug: newer.slug, title: newer.title } : null,
      older: older ? { slug: older.slug, title: older.title } : null,
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Post indisponível — Marduk" }, { name: "robots", content: "noindex" }] };
    }
    const { post } = loaderData;
    const title = `${post.title} — Marduk: Diário dos sonhos`;
    return {
      meta: [
        { title },
        { name: "description", content: post.excerpt },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: PostPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-display text-4xl">Este post não existe</h1>
      <Link to="/blog" className="mt-6 inline-block text-muted-foreground hover:text-foreground">
        ← Voltar ao blog
      </Link>
    </div>
  ),
});

function PostPage() {
  const { post, newer, older } = Route.useLoaderData();

  return (
    <article className="mx-auto max-w-2xl px-6 pb-24 pt-16">
      <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground">
        ← Blog
      </Link>
      <header className="mt-8">
        <p className="text-sm text-muted-foreground">
          {formatDate(post.date)}
          {post.category && <> · {post.category}</>}
        </p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-foreground sm:text-5xl">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-5 text-xl italic leading-relaxed text-muted-foreground">{post.excerpt}</p>
        )}
      </header>

      {post.cover && (
        <img src={post.cover} alt="" loading="lazy" className="mt-10 w-full rounded-sm" />
      )}

      <div className="mt-10">
        <Markdown>{post.content}</Markdown>
      </div>

      {(older || newer) && (
        <nav className="mt-16 grid gap-6 border-t border-border pt-8 sm:grid-cols-2">
          <div>
            {older && (
              <Link to="/blog/$slug" params={{ slug: older.slug }} className="group block">
                <p className="text-sm text-muted-foreground">← Anterior</p>
                <p className="mt-1 font-display text-xl text-foreground group-hover:underline">
                  {older.title}
                </p>
              </Link>
            )}
          </div>
          <div className="sm:text-right">
            {newer && (
              <Link to="/blog/$slug" params={{ slug: newer.slug }} className="group block">
                <p className="text-sm text-muted-foreground">Próximo →</p>
                <p className="mt-1 font-display text-xl text-foreground group-hover:underline">
                  {newer.title}
                </p>
              </Link>
            )}
          </div>
        </nav>
      )}
    </article>
  );
}
