import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/admin/image-upload";
import { MarkdownField } from "@/components/admin/markdown-field";
import { DeleteButton } from "@/components/admin/delete-button";
import { adminDeletePost, adminSavePost, type PostInput } from "@/lib/content.functions";
import { adminPostQuery } from "@/lib/content.queries";
import { slugify } from "@/lib/slug";

const CATEGORIES = ["Processo criativo", "Decisões", "Atualização", "Personagens", "Bastidores"];

export const Route = createFileRoute("/_authenticated/painel/posts/$id")({
  loader: async ({ context, params }) => {
    if (params.id === "novo") return;
    const post = await context.queryClient.ensureQueryData(adminPostQuery(params.id));
    if (!post) throw notFound();
  },
  component: PostEditorPage,
});

function PostEditorPage() {
  const { id } = Route.useParams();
  const isNew = id === "novo";
  const { data: post } = useQuery({ ...adminPostQuery(id), enabled: !isNew });
  if (!isNew && !post) return null;

  const initial: PostInput = post
    ? {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        cover_url: post.cover_url,
        published: post.published,
        published_at: post.published_at,
      }
    : {
        slug: "",
        title: "",
        excerpt: "",
        content: "",
        category: "Processo criativo",
        cover_url: null,
        published: false,
        published_at: new Date().toISOString(),
      };

  return <PostForm key={id} initial={initial} isNew={isNew} />;
}

function PostForm({ initial, isNew }: { initial: PostInput; isNew: boolean }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const save = useServerFn(adminSavePost);
  const remove = useServerFn(adminDeletePost);
  const [form, setForm] = useState<PostInput>(initial);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof PostInput>(key: K, value: PostInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function refresh() {
    await queryClient.invalidateQueries({ queryKey: ["admin"] });
    await queryClient.invalidateQueries({ queryKey: ["posts"] });
    await queryClient.invalidateQueries({ queryKey: ["post"] });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const slug = slugify(form.slug || form.title);
    if (!slug) {
      toast.error("Dê um título ao post.");
      return;
    }
    setBusy(true);
    try {
      await save({ data: { ...form, slug } });
      await refresh();
      toast.success(form.published ? "Post publicado." : "Rascunho salvo.");
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
      toast.success("Post apagado.");
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
        <h2 className="font-display text-3xl">{isNew ? "Novo post" : "Editar post"}</h2>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) => {
            set("title", e.target.value);
            if (!slugTouched) set("slug", slugify(e.target.value));
          }}
          className="h-12 font-display text-2xl"
          required
        />
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-mono">/blog/</span>
          <Input
            aria-label="Endereço do post"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set("slug", e.target.value);
            }}
            className="h-8 max-w-sm font-mono text-xs"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="category">Categoria</Label>
          <Input
            id="category"
            list="categories"
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            required
          />
          <datalist id="categories">
            {CATEGORIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            type="date"
            value={format(new Date(form.published_at), "yyyy-MM-dd")}
            onChange={(e) => {
              if (e.target.value) set("published_at", new Date(`${e.target.value}T12:00:00`).toISOString());
            }}
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="excerpt">Resumo (aparece na lista do blog)</Label>
        <Textarea id="excerpt" rows={2} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
      </div>

      <div className="grid gap-2">
        <Label>Imagem de capa (opcional)</Label>
        <div className="max-w-xl">
          <ImageUpload folder="posts" value={form.cover_url} onChange={(url) => set("cover_url", url)} />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="content">Texto</Label>
        <MarkdownField id="content" value={form.content} onChange={(v) => set("content", v)} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6 border-t border-border/70 pt-8">
        <label className="flex items-center gap-3">
          <Switch checked={form.published} onCheckedChange={(v) => set("published", v)} />
          <span>{form.published ? "Publicado — visível no site" : "Rascunho — só você vê"}</span>
        </label>
        <div className="flex items-center gap-3">
          {!isNew && <DeleteButton label="este post" onConfirm={onDelete} busy={busy} />}
          <Button type="submit" variant="veil" size="xl" disabled={busy}>
            {busy ? "Salvando…" : "Salvar"}
          </Button>
        </div>
      </div>
    </form>
  );
}
