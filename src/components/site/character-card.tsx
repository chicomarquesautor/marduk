import { Link } from "@tanstack/react-router";

type CharacterSummary = {
  slug: string;
  name: string;
  role: string;
  image_url: string | null;
};

export function CharacterCard({ character }: { character: CharacterSummary }) {
  return (
    <Link
      to="/personagens/$slug"
      params={{ slug: character.slug }}
      className="group relative block aspect-[3/4] overflow-hidden bg-card"
    >
      {character.image_url ? (
        <img
          src={character.image_url}
          alt={character.name}
          loading="lazy"
          className="h-full w-full object-cover opacity-60 blur-[2px] grayscale transition-all duration-[1400ms] ease-out group-hover:scale-105 group-hover:opacity-100 group-hover:blur-0"
        />
      ) : (
        <div className="flex h-full items-center justify-center font-display text-6xl text-muted-foreground/30">
          ?
        </div>
      )}
      <div className="bg-portrait-fade absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="eyebrow mb-2">{character.role}</p>
        <h3 className="font-display text-2xl text-foreground sm:text-3xl">{character.name}</h3>
      </div>
    </Link>
  );
}
