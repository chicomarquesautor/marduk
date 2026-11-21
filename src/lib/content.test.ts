import { describe, expect, it } from "vitest";
import { buildCharacters, buildPosts } from "./content";
import { parseFrontmatter } from "./frontmatter";
import { formatDate } from "./format";

const post = (fm: string, body = "Texto") => `---\n${fm}\n---\n\n${body}\n`;

describe("parseFrontmatter", () => {
  it("reads fields, quoted strings, numbers and the body", () => {
    const { data, body } = parseFrontmatter(
      post('titulo: "Diário #1: começo"\nordem: 3\nrascunho: true', "## Olá"),
    );
    expect(data).toEqual({ titulo: "Diário #1: começo", ordem: 3, rascunho: true });
    expect(body).toBe("## Olá");
  });
});

describe("buildPosts", () => {
  it("uses the file name as the address and sorts newest first", () => {
    const posts = buildPosts({
      "/content/blog/antigo.md": post("titulo: Antigo\ndata: 2026-01-05"),
      "/content/blog/novo.md": post("titulo: Novo\ndata: 2026-03-10"),
    });
    expect(posts.map((p) => p.slug)).toEqual(["novo", "antigo"]);
  });

  it("hides posts marked as rascunho", () => {
    const posts = buildPosts({
      "/content/blog/a.md": post("titulo: A\ndata: 2026-01-05\nrascunho: true"),
      "/content/blog/b.md": post("titulo: B\ndata: 2026-01-06"),
    });
    expect(posts.map((p) => p.slug)).toEqual(["b"]);
  });

  it("rejects a post without a title", () => {
    expect(() => buildPosts({ "/content/blog/x.md": post("data: 2026-01-05") })).toThrow(/titulo/);
  });

  it("rejects a date that is not AAAA-MM-DD", () => {
    expect(() =>
      buildPosts({ "/content/blog/x.md": post("titulo: X\ndata: 21/11/2026") }),
    ).toThrow(/AAAA-MM-DD/);
  });
});

describe("buildCharacters", () => {
  it("sorts by ordem", () => {
    const chars = buildCharacters({
      "/content/personagens/b.md": post("nome: B\nordem: 2"),
      "/content/personagens/a.md": post("nome: A\nordem: 1"),
    });
    expect(chars.map((c) => c.slug)).toEqual(["a", "b"]);
  });
});

describe("formatDate", () => {
  it("shows the same calendar day written in the file", () => {
    expect(formatDate("2026-11-18")).toBe("18 de novembro, 2026");
  });
});
