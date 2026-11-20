import { describe, expect, it } from "vitest";
import { slugify } from "./slug";

describe("slugify", () => {
  it("removes accents and joins words with hyphens", () => {
    expect(slugify("A decisão do narrador não confiável")).toBe("a-decisao-do-narrador-nao-confiavel");
  });
  it("drops punctuation at the edges", () => {
    expect(slugify("  Diário de revisão #1!  ")).toBe("diario-de-revisao-1");
  });
});
