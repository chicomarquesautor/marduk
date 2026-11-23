import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PostRow } from "@/components/site/post-card";
import { getPosts } from "@/lib/content";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog — Marduk: Diário dos sonhos" },
      {
        name: "description",
        content: "Processo criativo, decisões e atualizações sobre a escrita de Marduk, por Francisco Marcelaro.",
      },
      { property: "og:title", content: "Blog — Marduk: Diário dos sonhos" },
      {
        property: "og:description",
        content: "Os bastidores da escrita de um romance de terror psicológico.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => getPosts(),
  component: BlogIndex,
});

function BlogIndex() {
  const posts = Route.useLoaderData();
  const categories = Array.from(new Set(posts.map((p) => p.category)));
  const [active, setActive] = useState<string | null>(null);
  const visible = active ? posts.filter((p) => p.category === active) : posts;

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-16">
      <h1 className="font-display text-5xl text-foreground">Blog</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Anotações sobre o processo criativo, decisões e o andamento do livro.
      </p>

      {categories.length > 1 && (
        <div className="mt-10 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {[null, ...categories].map((cat) => (
            <button
              key={cat ?? "all"}
              type="button"
              onClick={() => setActive(cat)}
              className={cn(
                "underline-offset-4 transition-colors",
                active === cat
                  ? "text-foreground underline"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {cat ?? "Tudo"}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6">
        {visible.length === 0 ? (
          <p className="border-t border-border py-8 text-muted-foreground">
            Nenhuma anotação por aqui ainda.
          </p>
        ) : (
          visible.map((post) => <PostRow key={post.slug} post={post} />)
        )}
      </div>
    </div>
  );
}
