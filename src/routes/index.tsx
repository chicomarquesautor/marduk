import { createFileRoute, Link } from "@tanstack/react-router";
import { PostRow } from "@/components/site/post-card";
import { CharacterCard } from "@/components/site/character-card";
import { getCharacters, getPosts } from "@/lib/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Marduk — Diário dos sonhos | Francisco Marcelaro" },
      {
        name: "description",
        content:
          "Um romance de terror psicológico em forma de diário de sonhos. Personagens, processo criativo e bastidores da escrita.",
      },
      { property: "og:title", content: "Marduk — Diário dos sonhos" },
      {
        property: "og:description",
        content: "Um romance de terror psicológico de Francisco Marcelaro. Bastidores, personagens e diário de escrita.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => ({ posts: getPosts(), characters: getCharacters() }),
  component: Home,
});

function Home() {
  const { posts, characters } = Route.useLoaderData();
  const latest = posts.slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-6">
      <section className="py-20 sm:py-28">
        <p className="eyebrow">Um romance de terror psicológico</p>
        <h1 className="mt-4 font-display text-6xl text-foreground sm:text-7xl">Marduk</h1>
        <p className="mt-2 font-display text-2xl italic text-muted-foreground">Diário dos sonhos</p>
        <p className="mt-10 text-lg leading-relaxed text-foreground/90">
          Helena restaura fotografias antigas e anota os sonhos num caderno desde a morte da mãe.
          Até que um homem sem rosto começa a aparecer no fim de todos os corredores — e os
          objetos dos sonhos começam a amanhecer no apartamento.
        </p>
        <p className="mt-6 text-muted-foreground">Por Francisco Marcelaro</p>
      </section>

      <section className="pb-16">
        <div className="mb-2 flex items-baseline justify-between gap-6">
          <h2 className="font-display text-3xl text-foreground">Blog</h2>
          <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground">
            Ver todos →
          </Link>
        </div>
        {latest.length === 0 ? (
          <p className="border-t border-border py-8 text-muted-foreground">
            Nenhuma anotação publicada ainda.
          </p>
        ) : (
          latest.map((post) => <PostRow key={post.slug} post={post} />)
        )}
      </section>

      {characters.length > 0 && (
        <section className="pb-24">
          <div className="mb-6 flex items-baseline justify-between gap-6 border-b border-border pb-2">
            <h2 className="font-display text-3xl text-foreground">Personagens</h2>
            <Link to="/personagens" className="text-sm text-muted-foreground hover:text-foreground">
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {characters.slice(0, 4).map((c) => (
              <CharacterCard key={c.slug} character={c} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
