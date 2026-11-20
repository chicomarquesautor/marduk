import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { accessQuery } from "@/lib/content.queries";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/painel")({
  head: () => ({
    meta: [
      { title: "Painel do autor — Marduk" },
      { name: "description", content: "Escreva posts e edite personagens do site Marduk." },
      { property: "og:title", content: "Painel do autor — Marduk" },
      { property: "og:description", content: "Painel de edição do site Marduk." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(accessQuery()),
  component: PainelLayout,
});

function PainelLayout() {
  const { data: access } = useSuspenseQuery(accessQuery());
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="mx-auto max-w-5xl px-6 pb-32 pt-32">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4 border-b border-border/70 pb-8">
        <div>
          <p className="eyebrow">Área do autor</p>
          <Link to="/painel" className="mt-3 block font-display text-4xl font-light text-foreground">
            Painel
          </Link>
        </div>
        <Button variant="whisper" onClick={signOut}>
          Sair
        </Button>
      </div>
      {access.isAdmin ? (
        <Outlet />
      ) : (
        <div className="max-w-lg">
          <h2 className="font-display text-3xl">Sem permissão de edição</h2>
          <p className="mt-4 text-muted-foreground">
            Esta conta não é a conta do autor. Só a primeira conta criada no site pode escrever
            posts e editar personagens.
          </p>
        </div>
      )}
    </div>
  );
}
