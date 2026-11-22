<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- The site is fully static: blog posts and characters are Markdown files with front matter in `/content/blog` and `/content/personagens`, edited by the author in an IDE; `src/lib/content.ts` bundles them via `import.meta.glob`, so there is no login, admin panel, or database read.
- Front matter keys are Portuguese (titulo, data, categoria, resumo, capa, rascunho / nome, papel, ordem, imagem, citacao) because the author writes them by hand; `content/README.md` documents the format and must change with it.
- Every non-draft content file is prerendered: `vite.config.ts` lists pages by reading `/content`, so new files need no code change.
- Images live in `public/images/` and are referenced by absolute path (`/images/...`).
- The old Lovable Cloud tables (`posts`, `characters`, `user_roles`) and `media` bucket are unused leftovers; do not read from them.
- Post/character body text is Markdown rendered with react-markdown inside the `prose-dream` utility.
- Display font must render Portuguese accents correctly; Cormorant families misplace diacritics in Chromium, so they are not used.
