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

- Content (blog posts, characters) lives in Lovable Cloud tables `posts` and `characters`; public pages read them through server functions in `src/lib/content.functions.ts` using the publishable client, so SSR works without a session.
- Only admins (role in `user_roles`, checked by `has_role`) can write content; the first account ever created is auto-assigned admin by a database trigger, so the site owner just signs up first.
- The `media` storage bucket is private (workspace blocks public buckets); images are served through `/api/public/media/*`, which streams from storage with long cache headers. Store that relative URL in `cover_url` / `image_url`.
- Author panel lives under `src/routes/_authenticated/painel*`; editors use `id = "novo"` to create a new row.
- Post/character body text is Markdown rendered with react-markdown inside the `prose-dream` utility.
- Display font must render Portuguese accents correctly; Cormorant families misplace diacritics in Chromium, so they are not used.
