import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Fog } from "@/components/site/fog";
import { Markdown } from "@/components/site/markdown";
import { getCharacter, getCharacters } from "@/lib/content";

export const Route = createFileRoute("/personagens/$slug")({
  loader: ({ params }) => {
    const character = getCharacter(params.slug);
    if (!character) throw notFound();
    const others = getCharacters()
      .filter((c) => c.slug !== character.slug)
      .map((c) => ({ slug: c.slug, name: c.name }));
    return { character, others };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Personagem indisponível — Marduk" }, { name: "robots", content: "noindex" }],
      };
    }
    const { character } = loaderData;
    const title = `${character.name}${character.role ? ` (${character.role})` : ""} — Marduk`;
    return {
      meta: [
        { title },
        { name: "description", content: character.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: character.summary },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CharacterPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 pb-32 pt-48 text-center">
      <p className="eyebrow">Ninguém aqui</p>
      <h1 className="mt-4 font-display text-5xl italic">Este personagem não existe</h1>
      <Link to="/personagens" className="eyebrow mt-10 inline-block hover:text-foreground">
        ← Voltar aos personagens
      </Link>
    </div>
  ),
});

function CharacterPage() {
  const { character, others } = Route.useLoaderData();

  return (
    <article>
      <section className="relative overflow-hidden pt-32">
        <Fog />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[5fr_7fr] md:gap-16">
          <div className="relative md:sticky md:top-28 md:self-start">
            {character.image ? (
              <div className="relative aspect-[3/4] overflow-hidden bg-card">
                <img
                  src={character.image}
                  alt={character.name}
                  className="animate-emerge h-full w-full object-cover"
                />
                <div className="bg-portrait-fade absolute inset-0 opacity-60" />
              </div>
            ) : (
              <div className="flex aspect-[3/4] items-center justify-center bg-card font-display text-8xl text-muted-foreground/30">
                ?
              </div>
            )}
          </div>
          <div className="pb-24 md:pt-12">
            <Link to="/personagens" className="eyebrow transition-colors hover:text-foreground">
              ← Personagens
            </Link>
            <p className="eyebrow mt-10 text-ember">{character.role}</p>
            <h1 className="animate-surface mt-4 font-display text-6xl font-light leading-none text-foreground sm:text-7xl">
              {character.name}
            </h1>
            {character.quote && (
              <blockquote className="animate-surface mt-10 border-l border-ember pl-6 font-display text-3xl italic leading-snug text-fog [animation-delay:500ms]">
                “{character.quote}”
              </blockquote>
            )}
            {character.summary && (
              <p className="mt-10 text-xl leading-relaxed text-foreground/85">{character.summary}</p>
            )}
            <div className="mt-10 border-t border-border/70 pt-10">
              <Markdown>{character.description}</Markdown>
            </div>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="mx-auto max-w-6xl border-t border-border/70 px-6 py-20">
          <p className="eyebrow mb-8">Outros personagens</p>
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            {others.map((c) => (
              <Link
                key={c.slug}
                to="/personagens/$slug"
                params={{ slug: c.slug }}
                className="font-display text-3xl text-muted-foreground transition-all duration-700 hover:text-foreground hover:text-glow"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
