import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Fog } from "@/components/site/fog";
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
    <div className="mx-auto max-w-2xl px-6 pb-32 pt-48 text-center">
      <p className="eyebrow">Anotação perdida</p>
      <h1 className="mt-4 font-display text-5xl italic">Este post não existe</h1>
      <Link to="/blog" className="eyebrow mt-10 inline-block hover:text-foreground">
        ← Voltar ao blog
      </Link>
    </div>
  ),
});

function PostPage() {
  const { post, newer, older } = Route.useLoaderData();

  return (
    <article>
      <header className="relative overflow-hidden pb-12 pt-40">
        <Fog />
        <div className="relative mx-auto max-w-3xl px-6">
          <Link to="/blog" className="eyebrow transition-colors hover:text-foreground">
            ← Blog
          </Link>
          <p className="eyebrow mt-10 text-ember animate-surface">{post.category}</p>
          <h1 className="animate-emerge mt-4 font-display text-5xl font-light leading-tight text-foreground sm:text-6xl">
            {post.title}
          </h1>
          <p className="mt-6 font-mono text-xs tracking-[0.25em] text-muted-foreground">
            {formatDate(post.date)}
          </p>
        </div>
      </header>

      {post.cover && (
        <div className="mx-auto max-w-5xl px-6">
          <img
            src={post.cover}
            alt=""
            className="aspect-[16/9] w-full object-cover opacity-90 grayscale-[40%]"
          />
        </div>
      )}

      <div className="mx-auto max-w-2xl px-6 py-16">
        {post.excerpt && (
          <p className="mb-12 font-display text-2xl italic leading-snug text-fog">{post.excerpt}</p>
        )}
        <Markdown>{post.content}</Markdown>
      </div>

      <nav className="mx-auto grid max-w-3xl gap-px border-t border-border/70 px-6 pb-32 pt-10 sm:grid-cols-2">
        <div>
          {older && (
            <Link to="/blog/$slug" params={{ slug: older.slug }} className="group block">
              <p className="eyebrow">← Anterior</p>
              <p className="mt-2 font-display text-2xl text-muted-foreground transition-colors duration-500 group-hover:text-foreground">
                {older.title}
              </p>
            </Link>
          )}
        </div>
        <div className="sm:text-right">
          {newer && (
            <Link to="/blog/$slug" params={{ slug: newer.slug }} className="group block">
              <p className="eyebrow">Próximo →</p>
              <p className="mt-2 font-display text-2xl text-muted-foreground transition-colors duration-500 group-hover:text-foreground">
                {newer.title}
              </p>
            </Link>
          )}
        </div>
      </nav>
    </article>
  );
}
