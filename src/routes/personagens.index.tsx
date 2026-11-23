import { createFileRoute } from "@tanstack/react-router";
import { CharacterCard } from "@/components/site/character-card";
import { getCharacters } from "@/lib/content";

export const Route = createFileRoute("/personagens/")({
  head: () => ({
    meta: [
      { title: "Personagens — Marduk: Diário dos sonhos" },
      {
        name: "description",
        content: "Conheça Helena, Teodoro, a Dra. Inês e a presença sem rosto que dá nome ao livro.",
      },
      { property: "og:title", content: "Personagens — Marduk: Diário dos sonhos" },
      { property: "og:description", content: "Quem habita os sonhos — e os pesadelos — de Marduk." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => getCharacters(),
  component: CharactersPage,
});

function CharactersPage() {
  const characters = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-16">
      <h1 className="font-display text-5xl text-foreground">Personagens</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Nenhum deles está mentindo. Pelo menos, não de propósito.
      </p>
      {characters.length === 0 ? (
        <p className="mt-10 text-muted-foreground">Nenhum personagem publicado ainda.</p>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
          {characters.map((c) => (
            <div key={c.slug}>
              <CharacterCard character={c} />
              {c.summary && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.summary}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
