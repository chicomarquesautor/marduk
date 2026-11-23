import { createFileRoute, Link, notFound } from "@tanstack/react-router";
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
    <div className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-display text-4xl">Este personagem não existe</h1>
      <Link to="/personagens" className="mt-6 inline-block text-muted-foreground hover:text-foreground">
        ← Voltar aos personagens
      </Link>
    </div>
  ),
});

function CharacterPage() {
  const { character, others } = Route.useLoaderData();

  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-16">
      <Link to="/personagens" className="text-sm text-muted-foreground hover:text-foreground">
        ← Personagens
      </Link>
      <div className="mt-8 grid gap-8 sm:grid-cols-[14rem_1fr] sm:gap-10">
        {character.image && (
          <img
            src={character.image}
            alt={character.name}
            width={720}
            height={960}
            className="aspect-[3/4] w-full max-w-[14rem] rounded-sm object-cover"
          />
        )}
        <div>
          {character.role && <p className="eyebrow">{character.role}</p>}
          <h1 className="mt-2 font-display text-5xl leading-none text-foreground">{character.name}</h1>
          {character.quote && (
            <blockquote className="mt-6 border-l border-border pl-4 text-xl italic leading-snug text-muted-foreground">
              “{character.quote}”
            </blockquote>
          )}
          {character.summary && (
            <p className="mt-6 text-lg leading-relaxed text-foreground/90">{character.summary}</p>
          )}
        </div>
      </div>

      <div className="mt-12 max-w-2xl">
        <Markdown>{character.description}</Markdown>
      </div>

      {others.length > 0 && (
        <nav className="mt-16 border-t border-border pt-8">
          <p className="text-sm text-muted-foreground">Outros personagens</p>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {others.map((c) => (
              <Link
                key={c.slug}
                to="/personagens/$slug"
                params={{ slug: c.slug }}
                className="font-display text-xl text-foreground hover:underline"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </article>
  );
}
