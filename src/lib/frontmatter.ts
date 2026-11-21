export type FrontmatterValue = string | number | boolean;

/**
 * Minimal front matter parser for content files: a `---` block of `chave: valor` lines,
 * followed by the Markdown body. Supports quoted strings, numbers and true/false.
 */
export function parseFrontmatter(raw: string): {
  data: Record<string, FrontmatterValue>;
  body: string;
} {
  const match = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)([\s\S]*)$/.exec(raw);
  if (!match) return { data: {}, body: raw.trim() };
  const data: Record<string, FrontmatterValue> = {};
  for (const line of (match[1] ?? "").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const sep = trimmed.indexOf(":");
    if (sep <= 0) continue;
    const key = trimmed.slice(0, sep).trim();
    data[key] = parseValue(trimmed.slice(sep + 1).trim());
  }
  return { data, body: (match[2] ?? "").trim() };
}

function parseValue(value: string): FrontmatterValue {
  const quoted = /^(["'])([\s\S]*)\1$/.exec(value);
  if (quoted) return quoted[2] ?? "";
  if (value === "true" || value === "sim") return true;
  if (value === "false" || value === "não" || value === "nao") return false;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  return value;
}
