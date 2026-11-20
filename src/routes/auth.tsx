import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { LovableMark } from "@lovable.dev/cloud-auth-js/react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Fog } from "@/components/site/fog";

type AuthSearch = { redirect?: string };

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): AuthSearch => {
    const r = search["redirect"];
    // Only same-origin relative paths
    return typeof r === "string" && r.startsWith("/") && !r.startsWith("//") ? { redirect: r } : {};
  },
  head: () => ({
    meta: [
      { title: "Área do autor — Marduk" },
      { name: "description", content: "Entrada do autor para escrever posts e editar personagens." },
      { property: "og:title", content: "Área do autor — Marduk" },
      { property: "og:description", content: "Entrada do autor do site Marduk: Diário dos sonhos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function GoogleLogo() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
    </svg>
  );
}

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { session, ready } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const target = search.redirect ?? "/painel";

  useEffect(() => {
    if (ready && session) navigate({ to: target, replace: true });
  }, [ready, session, target, navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setNotice(null);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + target },
        });
        if (error) throw error;
        if (!data.session) setNotice("Conta criada. Confira seu e-mail e clique no link para confirmar.");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setNotice("Se o e-mail existir, você vai receber um link para criar uma nova senha.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Algo deu errado.";
      toast.error(msg === "Invalid login credentials" ? "E-mail ou senha incorretos." : msg);
    } finally {
      setBusy(false);
    }
  }

  async function oauth(provider: "google" | "lovable") {
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin + "/auth",
    });
    if (result.error) toast.error("Não foi possível entrar. Tente novamente.");
  }

  const title = mode === "signin" ? "Entrar" : mode === "signup" ? "Criar conta" : "Recuperar senha";

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-32">
      <Fog />
      <div className="relative w-full max-w-sm animate-surface">
        <p className="eyebrow text-center">Área do autor</p>
        <h1 className="mt-4 text-center font-display text-5xl font-light">{title}</h1>

        {mode !== "forgot" && (
          <div className="mt-10 grid gap-3">
            <Button type="button" variant="google" size="lg" onClick={() => oauth("google")}>
              <GoogleLogo />
              Continuar com Google
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={() => oauth("lovable")}>
              <LovableMark />
              Continuar com Lovable
            </Button>
            <div className="my-4 flex items-center gap-4">
              <span className="h-px flex-1 bg-border" />
              <span className="eyebrow">ou</span>
              <span className="h-px flex-1 bg-border" />
            </div>
          </div>
        )}

        <form onSubmit={onSubmit} className={mode === "forgot" ? "mt-10 grid gap-5" : "grid gap-5"}>
          <div className="grid gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {mode !== "forgot" && (
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}
          <Button type="submit" variant="veil" size="xl" disabled={busy}>
            {busy ? "Aguarde…" : mode === "signin" ? "Entrar" : mode === "signup" ? "Criar conta" : "Enviar link"}
          </Button>
        </form>

        {notice && <p className="mt-6 text-center text-sm text-fog">{notice}</p>}

        <div className="mt-8 flex flex-col items-center gap-3 text-sm text-muted-foreground">
          {mode === "signin" && (
            <>
              <button type="button" className="hover:text-foreground" onClick={() => setMode("forgot")}>
                Esqueci minha senha
              </button>
              <button type="button" className="hover:text-foreground" onClick={() => setMode("signup")}>
                Primeira vez aqui? Criar conta
              </button>
            </>
          )}
          {mode !== "signin" && (
            <button type="button" className="hover:text-foreground" onClick={() => setMode("signin")}>
              ← Voltar para entrar
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
