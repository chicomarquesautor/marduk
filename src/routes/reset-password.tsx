import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Nova senha — Marduk" },
      { name: "description", content: "Defina uma nova senha para a área do autor." },
      { property: "og:title", content: "Nova senha — Marduk" },
      { property: "og:description", content: "Defina uma nova senha para a área do autor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Senha atualizada.");
    navigate({ to: "/painel" });
  }

  return (
    <section className="flex min-h-screen items-center justify-center px-6 py-32">
      <form onSubmit={onSubmit} className="grid w-full max-w-sm gap-5">
        <h1 className="text-center font-display text-5xl font-light">Nova senha</h1>
        <div className="grid gap-2">
          <Label htmlFor="password">Nova senha</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" variant="veil" size="xl" disabled={busy}>
          {busy ? "Salvando…" : "Salvar senha"}
        </Button>
      </form>
    </section>
  );
}
