import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/admin/image-upload";
import { MarkdownField } from "@/components/admin/markdown-field";
import { DeleteButton } from "@/components/admin/delete-button";
import {
  adminDeleteCharacter,
  adminSaveCharacter,
  type CharacterInput,
} from "@/lib/content.functions";
import { adminCharacterQuery, adminCharactersQuery } from "@/lib/content.queries";
import { slugify } from "@/lib/slug";

export const Route = createFileRoute("/_authenticated/painel/personagens/$id")({
  loader: async ({ context, params }) => {
    if (params.id === "novo") {
      await context.queryClient.ensureQueryData(adminCharactersQuery());
      return;
    }
    const character = await context.queryClient.ensureQueryData(adminCharacterQuery(params.id));
    if (!character) throw notFound();
  },
  component: CharacterEditorPage,
});

function CharacterEditorPage() {
  const { id } = Route.useParams();
  const isNew = id === "novo";
  const { data: character } = useQuery({ ...adminCharacterQuery(id), enabled: !isNew });
  const { data: all } = useQuery({ ...adminCharactersQuery(), enabled: isNew });
  if (!isNew && !character) return null;

  const nextOrder = (all ?? []).reduce((max, c) => Math.max(max, c.sort_order), 0) + 1;
  const initial: CharacterInput = character
    ? {
        id: character.id,
        slug: character.slug,
        name: character.name,
        role: character.role,
        quote: character.quote,
        summary: character.summary,
        description: character.description,
        image_url: character.image_url,
        sort_order: character.sort_order,
        published: character.published,
      }
    : {
        slug: "",
        name: "",
        role: "",
        quote: "",
        summary: "",
        description: "",
        image_url: null,
        sort_order: nextOrder,
        published: true,
      };

  return <CharacterForm key={id} initial={initial} isNew={isNew} />;
}

function CharacterForm({ initial, isNew }: { initial: CharacterInput; isNew: boolean }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const save = useServerFn(adminSaveCharacter);
  const remove = useServerFn(adminDeleteCharacter);
  const [form, setForm] = useState<CharacterInput>(initial);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof CharacterInput>(key: K, value: CharacterInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function refresh() {
    await queryClient.invalidateQueries({ queryKey: ["admin"] });
    await queryClient.invalidateQueries({ queryKey: ["characters"] });
    await queryClient.invalidateQueries({ queryKey: ["character"] });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const slug = slugify(form.slug || form.name);
    if (!slug) {
      toast.error("Dê um nome ao personagem.");
      return;
    }
    setBusy(true);
    try {
      await save({ data: { ...form, slug } });
      await refresh();
      toast.success("Personagem salvo.");
      navigate({ to: "/painel" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível salvar.");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!form.id) return;
    setBusy(true);
    try {
      await remove({ data: { id: form.id } });
      await refresh();
      toast.success("Personagem apagado.");
      navigate({ to: "/painel" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível apagar.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link to="/painel" className="eyebrow hover:text-foreground">
          ← Voltar
        </Link>
        <h2 className="font-display text-3xl">{isNew ? "Novo personagem" : "Editar personagem"}</h2>
      </div>

      <div className="grid gap-10 md:grid-cols-[16rem_1fr]">
        <div className="grid content-start gap-2">
          <Label>Retrato</Label>
          <ImageUpload
            folder="characters"
            aspect="aspect-[3/4]"
            value={form.image_url}
            onChange={(url) => set("image_url", url)}
          />
        </div>

        <div className="grid content-start gap-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => {
                set("name", e.target.value);
                if (!slugTouched) set("slug", slugify(e.target.value));
              }}
              className="h-12 font-display text-2xl"
              required
            />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono">/personagens/</span>
              <Input
                aria-label="Endereço do personagem"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", e.target.value);
                }}
                className="h-8 max-w-xs font-mono text-xs"
              />
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-[1fr_8rem]">
            <div className="grid gap-2">
              <Label htmlFor="role">Papel na história</Label>
              <Input
                id="role"
                placeholder="Protagonista, antagonista…"
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="order">Ordem</Label>
              <Input
                id="order"
                type="number"
                value={form.sort_order}
                onChange={(e) => set("sort_order", Number.parseInt(e.target.value || "0", 10))}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quote">Frase marcante (opcional)</Label>
            <Input id="quote" value={form.quote} onChange={(e) => set("quote", e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="summary">Apresentação curta</Label>
            <Textarea id="summary" rows={3} value={form.summary} onChange={(e) => set("summary", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Descrição completa</Label>
        <MarkdownField id="description" rows={14} value={form.description} onChange={(v) => set("description", v)} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6 border-t border-border/70 pt-8">
        <label className="flex items-center gap-3">
          <Switch checked={form.published} onCheckedChange={(v) => set("published", v)} />
          <span>{form.published ? "Visível no site" : "Oculto — só você vê"}</span>
        </label>
        <div className="flex items-center gap-3">
          {!isNew && <DeleteButton label="este personagem" onConfirm={onDelete} busy={busy} />}
          <Button type="submit" variant="veil" size="xl" disabled={busy}>
            {busy ? "Salvando…" : "Salvar"}
          </Button>
        </div>
      </div>
    </form>
  );
}
