import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Fog } from "@/components/site/fog";
import { CharacterCard } from "@/components/site/character-card";
import { charactersQuery } from "@/lib/content.queries";

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
  loader: ({ context }) => context.queryClient.ensureQueryData(charactersQuery()),
  component: CharactersPage,
});

function CharactersPage() {
  const { data: characters } = useSuspenseQuery(charactersQuery());
  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-40">
        <Fog />
        <div className="relative mx-auto max-w-6xl px-6">
          <p className="eyebrow animate-surface">Quem habita a história</p>
          <h1 className="animate-emerge mt-6 font-display text-6xl font-light text-foreground sm:text-7xl">
            Personagens
          </h1>
          <p className="animate-surface mt-6 max-w-xl text-lg text-muted-foreground [animation-delay:600ms]">
            Nenhum deles está mentindo. Pelo menos, não de propósito.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-32">
        {characters.length === 0 ? (
          <p className="text-muted-foreground">Os personagens ainda estão na névoa.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {characters.map((c, i) => (
              <div
                key={c.id}
                className="animate-surface"
                style={{ animationDelay: `${300 + i * 150}ms` }}
              >
                <CharacterCard character={c} />
                {c.summary && (
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{c.summary}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
