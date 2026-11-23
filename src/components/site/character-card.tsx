import { Link } from "@tanstack/react-router";

type CharacterSummary = {
  slug: string;
  name: string;
  role: string;
  image: string | null;
};

export function CharacterCard({ character }: { character: CharacterSummary }) {
  return (
    <Link to="/personagens/$slug" params={{ slug: character.slug }} className="group block">
      <div className="aspect-[3/4] overflow-hidden rounded-sm bg-card">
        {character.image && (
          <img
            src={character.image}
            alt={character.name}
            loading="lazy"
            width={720}
            height={960}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <h3 className="mt-3 font-display text-xl text-foreground underline-offset-4 group-hover:underline">
        {character.name}
      </h3>
      {character.role && <p className="text-sm text-muted-foreground">{character.role}</p>}
    </Link>
  );
}
