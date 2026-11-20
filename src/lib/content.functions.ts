import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createPublicClient } from "@/lib/supabase-public";

const POST_LIST = "id, slug, title, excerpt, category, cover_url, published_at";

/* ---------------- Public ---------------- */

export const listPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await createPublicClient()
    .from("posts")
    .select(POST_LIST)
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (error) {
    console.error(error);
    throw new Error("Não foi possível carregar os posts.");
  }
  return data;
});

export const getPost = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => z.object({ slug: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const { data: post, error } = await createPublicClient()
      .from("posts")
      .select("*")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error) {
      console.error(error);
      throw new Error("Não foi possível carregar o post.");
    }
    return post;
  });

export const listCharacters = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await createPublicClient()
    .from("characters")
    .select("id, slug, name, role, quote, summary, image_url, sort_order")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error) {
    console.error(error);
    throw new Error("Não foi possível carregar os personagens.");
  }
  return data;
});

export const getCharacter = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => z.object({ slug: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const { data: character, error } = await createPublicClient()
      .from("characters")
      .select("*")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error) {
      console.error(error);
      throw new Error("Não foi possível carregar o personagem.");
    }
    return character;
  });

/* ---------------- Author panel (RLS restricts writes to admins) ---------------- */

export const getMyAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error) console.error(error);
    return { isAdmin: data === true };
  });

export const adminListPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("posts")
      .select(`${POST_LIST}, published, updated_at`)
      .order("published_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  });

export const adminGetPost = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: post, error } = await context.supabase
      .from("posts")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return post;
  });

const postInput = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().trim().min(1).max(100),
  title: z.string().trim().min(1, "Dê um título ao post").max(200),
  excerpt: z.string().max(500),
  content: z.string().max(100000),
  category: z.string().trim().min(1).max(60),
  cover_url: z.string().max(500).nullable(),
  published: z.boolean(),
  published_at: z.string().min(1),
});
export type PostInput = z.infer<typeof postInput>;

export const adminSavePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: PostInput) => postInput.parse(input))
  .handler(async ({ data, context }) => {
    const { id, ...fields } = data;
    const query = id
      ? context.supabase.from("posts").update(fields).eq("id", id)
      : context.supabase.from("posts").insert(fields);
    const { data: saved, error } = await query.select("id, slug").single();
    if (error) {
      if (error.code === "23505") throw new Error("Já existe um post com esse endereço (slug).");
      throw new Error(error.message);
    }
    return saved;
  });

export const adminDeletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListCharacters = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("characters")
      .select("id, slug, name, role, image_url, sort_order, published")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  });

export const adminGetCharacter = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: character, error } = await context.supabase
      .from("characters")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return character;
  });

const characterInput = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().trim().min(1).max(100),
  name: z.string().trim().min(1, "Dê um nome ao personagem").max(120),
  role: z.string().max(80),
  quote: z.string().max(300),
  summary: z.string().max(600),
  description: z.string().max(100000),
  image_url: z.string().max(500).nullable(),
  sort_order: z.number().int(),
  published: z.boolean(),
});
export type CharacterInput = z.infer<typeof characterInput>;

export const adminSaveCharacter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: CharacterInput) => characterInput.parse(input))
  .handler(async ({ data, context }) => {
    const { id, ...fields } = data;
    const query = id
      ? context.supabase.from("characters").update(fields).eq("id", id)
      : context.supabase.from("characters").insert(fields);
    const { data: saved, error } = await query.select("id, slug").single();
    if (error) {
      if (error.code === "23505") throw new Error("Já existe um personagem com esse endereço (slug).");
      throw new Error(error.message);
    }
    return saved;
  });

export const adminDeleteCharacter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("characters").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
