import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Fog } from "@/components/site/fog";
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
    <>
      <section className="relative overflow-hidden pb-16 pt-40">
        <Fog />
        <div className="relative mx-auto max-w-4xl px-6">
          <p className="eyebrow animate-surface">Diário de escrita</p>
          <h1 className="animate-emerge mt-6 font-display text-6xl font-light text-foreground sm:text-7xl">
            Blog
          </h1>
          <p className="animate-surface mt-6 max-w-xl text-lg text-muted-foreground [animation-delay:600ms]">
            Anotações sobre o processo criativo, decisões difíceis e o andamento do livro — escritas
            de madrugada, quase sempre.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-32">
        {categories.length > 1 && (
          <div className="mb-6 flex flex-wrap gap-6">
            {[null, ...categories].map((cat) => (
              <button
                key={cat ?? "all"}
                type="button"
                onClick={() => setActive(cat)}
                className={cn(
                  "eyebrow border-b pb-1 transition-colors duration-500",
                  active === cat
                    ? "border-foreground/60 text-foreground"
                    : "border-transparent hover:text-foreground",
                )}
              >
                {cat ?? "Tudo"}
              </button>
            ))}
          </div>
        )}
        {visible.length === 0 ? (
          <p className="border-t border-border/70 py-10 text-muted-foreground">
            Nenhuma anotação por aqui ainda.
          </p>
        ) : (
          visible.map((post) => (
            <PostRow key={post.slug} post={post} entry={posts.length - posts.indexOf(post)} />
          ))
        )}
      </section>
    </>
  );
}
