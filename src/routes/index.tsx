import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Fog } from "@/components/site/fog";
import { PostRow } from "@/components/site/post-card";
import { CharacterCard } from "@/components/site/character-card";
import { charactersQuery, postsQuery } from "@/lib/content.queries";

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
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(postsQuery()),
      context.queryClient.ensureQueryData(charactersQuery()),
    ]),
  component: Home,
});

function Home() {
  const { data: posts } = useSuspenseQuery(postsQuery());
  const { data: characters } = useSuspenseQuery(charactersQuery());
  const latest = posts.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-screen items-end overflow-hidden bg-abyss">
        <img
          src="/images/hero-corridor.jpg"
          alt="Um corredor escuro tomado pela névoa, com uma figura sem rosto ao fundo"
          className="absolute inset-0 h-full w-full object-cover object-[72%_center] opacity-90"
        />
        <div className="bg-veil absolute inset-0" />
        <div className="bg-fade-up absolute inset-x-0 bottom-0 h-1/3" />
        <Fog />
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-24 pt-40 sm:pb-32">
          <p className="eyebrow animate-surface [animation-delay:200ms]">
            Um romance de terror psicológico
          </p>
          <h1 className="animate-emerge mt-6 font-display text-[3.6rem] font-light tracking-[0.1em] text-foreground sm:text-9xl sm:tracking-[0.18em] md:text-[10rem]">
            <span className="animate-breathe inline-block">MARDUK</span>
          </h1>
          <p className="animate-surface mt-2 font-display text-3xl font-light italic text-fog [animation-delay:900ms] sm:text-4xl">
            Diário dos sonhos
          </p>
          <p className="animate-surface mt-10 max-w-md text-lg leading-relaxed text-muted-foreground [animation-delay:1400ms]">
            Às 3h17 ela acorda com um nome na boca. Ninguém mais se lembra dele. Mas ele se lembra
            dela.
          </p>
          <div className="animate-surface mt-10 flex flex-wrap gap-4 [animation-delay:1800ms]">
            <Button asChild variant="veil" size="xl">
              <Link to="/personagens">Conhecer os personagens</Link>
            </Button>
            <Button asChild variant="whisper" size="xl">
              <Link to="/blog">Ler o diário de escrita →</Link>
            </Button>
          </div>
          <p className="eyebrow mt-16 animate-surface [animation-delay:2200ms]">
            Francisco Marcelaro
          </p>
        </div>
      </section>

      {/* Synopsis */}
      <section className="relative overflow-hidden py-32">
        <Fog />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <p className="eyebrow">Sobre o livro</p>
          <p className="mt-10 font-display text-3xl font-light leading-snug text-foreground/90 sm:text-4xl">
            Helena restaura fotografias antigas e anota os sonhos num caderno desde a morte da mãe.
            Até que um homem sem rosto começa a aparecer no fim de todos os corredores — e os
            objetos dos sonhos começam a amanhecer no apartamento.
          </p>
          <p className="text-dissolve mx-auto mt-10 max-w-xl font-display text-xl italic text-muted-foreground">
            Algumas portas só se abrem por dentro do sono.
          </p>
        </div>
      </section>

      {/* Characters */}
      {characters.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Quem habita a história</p>
              <h2 className="mt-4 font-display text-5xl font-light text-foreground">Personagens</h2>
            </div>
            <Link
              to="/personagens"
              className="eyebrow hidden transition-colors hover:text-foreground sm:block"
            >
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {characters.slice(0, 4).map((c) => (
              <CharacterCard key={c.id} character={c} />
            ))}
          </div>
        </section>
      )}

      {/* Latest posts */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Processo criativo e decisões</p>
            <h2 className="mt-4 font-display text-5xl font-light text-foreground">
              Últimas anotações
            </h2>
          </div>
          <Link to="/blog" className="eyebrow hidden transition-colors hover:text-foreground sm:block">
            Todo o blog →
          </Link>
        </div>
        {latest.length === 0 ? (
          <p className="border-t border-border/70 py-10 text-muted-foreground">
            Nenhuma anotação publicada ainda.
          </p>
        ) : (
          latest.map((post, i) => <PostRow key={post.id} post={post} entry={posts.length - i} />)
        )}
      </section>
    </>
  );
}
