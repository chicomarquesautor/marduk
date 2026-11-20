import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminCharactersQuery, adminPostsQuery } from "@/lib/content.queries";
import { formatShortDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/painel/")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(adminPostsQuery()),
      context.queryClient.ensureQueryData(adminCharactersQuery()),
    ]),
  component: Dashboard,
});

function Dashboard() {
  const { data: posts } = useSuspenseQuery(adminPostsQuery());
  const { data: characters } = useSuspenseQuery(adminCharactersQuery());

  return (
    <Tabs defaultValue="posts">
      <TabsList>
        <TabsTrigger value="posts">Posts ({posts.length})</TabsTrigger>
        <TabsTrigger value="characters">Personagens ({characters.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="mt-8">
        <div className="mb-6 flex justify-end">
          <Button asChild variant="veil">
            <Link to="/painel/posts/$id" params={{ id: "novo" }}>
              <Plus /> Novo post
            </Link>
          </Button>
        </div>
        <ul className="divide-y divide-border/70 border-y border-border/70">
          {posts.map((p) => (
            <li key={p.id}>
              <Link
                to="/painel/posts/$id"
                params={{ id: p.id }}
                className="flex items-center justify-between gap-4 py-5 transition-colors hover:bg-card/60 sm:px-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-display text-2xl text-foreground">{p.title}</p>
                  <p className="mt-1 font-mono text-xs tracking-wider text-muted-foreground">
                    {formatShortDate(p.published_at)} · {p.category}
                  </p>
                </div>
                <Badge variant={p.published ? "secondary" : "outline"}>
                  {p.published ? "Publicado" : "Rascunho"}
                </Badge>
              </Link>
            </li>
          ))}
          {posts.length === 0 && <li className="py-8 text-muted-foreground">Nenhum post ainda.</li>}
        </ul>
      </TabsContent>

      <TabsContent value="characters" className="mt-8">
        <div className="mb-6 flex justify-end">
          <Button asChild variant="veil">
            <Link to="/painel/personagens/$id" params={{ id: "novo" }}>
              <Plus /> Novo personagem
            </Link>
          </Button>
        </div>
        <ul className="divide-y divide-border/70 border-y border-border/70">
          {characters.map((c) => (
            <li key={c.id}>
              <Link
                to="/painel/personagens/$id"
                params={{ id: c.id }}
                className="flex items-center gap-4 py-4 transition-colors hover:bg-card/60 sm:px-3"
              >
                <div className="h-16 w-12 shrink-0 overflow-hidden bg-card">
                  {c.image_url && <img src={c.image_url} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-2xl text-foreground">{c.name}</p>
                  <p className="mt-1 font-mono text-xs tracking-wider text-muted-foreground">
                    #{c.sort_order} · {c.role}
                  </p>
                </div>
                <Badge variant={c.published ? "secondary" : "outline"}>
                  {c.published ? "Visível" : "Oculto"}
                </Badge>
              </Link>
            </li>
          ))}
          {characters.length === 0 && (
            <li className="py-8 text-muted-foreground">Nenhum personagem ainda.</li>
          )}
        </ul>
      </TabsContent>
    </Tabs>
  );
}
