import { parseFrontmatter, type FrontmatterValue } from "@/lib/frontmatter";

/*
 * Site content lives as Markdown files in /content (edited by hand in the IDE).
 * Vite bundles them at build time, so pages need no database or login.
 */

export type Post = {
  slug: string;
  title: string;
  date: string; // AAAA-MM-DD
  category: string;
  excerpt: string;
  cover: string | null;
  content: string;
};

export type Character = {
  slug: string;
  name: string;
  role: string;
  quote: string;
  summary: string;
  image: string | null;
  order: number;
  description: string;
};

type Files = Record<string, string>;

const slugFromPath = (path: string) => path.split("/").pop()!.replace(/\.md$/, "");
const str = (v: FrontmatterValue | undefined) => (v === undefined ? "" : String(v));
const isDraft = (data: Record<string, FrontmatterValue>) => data["rascunho"] === true;

function required(data: Record<string, FrontmatterValue>, key: string, path: string) {
  const value = str(data[key]).trim();
  if (!value) throw new Error(`O arquivo ${path} precisa do campo "${key}".`);
  return value;
}

export function buildPosts(files: Files): Post[] {
  return Object.entries(files)
    .map(([path, raw]) => ({ path, ...parseFrontmatter(raw) }))
    .filter(({ data }) => !isDraft(data))
    .map(({ path, data, body }) => {
      const date = required(data, "data", path);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw new Error(`O campo "data" em ${path} deve ser AAAA-MM-DD (ex.: 2026-11-21).`);
      }
      return {
        slug: slugFromPath(path),
        title: required(data, "titulo", path),
        date,
        category: str(data["categoria"]) || "Diário",
        excerpt: str(data["resumo"]),
        cover: str(data["capa"]) || null,
        content: body,
      };
    })
    .sort((a, b) => (a.date === b.date ? a.title.localeCompare(b.title) : b.date.localeCompare(a.date)));
}

export function buildCharacters(files: Files): Character[] {
  return Object.entries(files)
    .map(([path, raw]) => ({ path, ...parseFrontmatter(raw) }))
    .filter(({ data }) => !isDraft(data))
    .map(({ path, data, body }) => {
      const order = data["ordem"];
      return {
        slug: slugFromPath(path),
        name: required(data, "nome", path),
        role: str(data["papel"]),
        quote: str(data["citacao"]),
        summary: str(data["resumo"]),
        image: str(data["imagem"]) || null,
        order: typeof order === "number" ? order : 999,
        description: body,
      };
    })
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

const postFiles = import.meta.glob("/content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Files;
const characterFiles = import.meta.glob("/content/personagens/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Files;

const posts = buildPosts(postFiles);
const characters = buildCharacters(characterFiles);

export const getPosts = () => posts;
export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
export const getCharacters = () => characters;
export const getCharacter = (slug: string) => characters.find((c) => c.slug === slug);
