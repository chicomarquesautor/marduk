import { createFileRoute } from "@tanstack/react-router";
import { createPublicClient } from "@/lib/supabase-public";

// Serves uploaded images (covers, portraits) from the private "media" bucket.
// Public by design: storage RLS allows anyone to read this bucket; writes stay admin-only.
export const Route = createFileRoute("/api/public/media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = params._splat ?? "";
        if (!path || path.includes("..")) return new Response("Not found", { status: 404 });
        const { data, error } = await createPublicClient().storage.from("media").download(path);
        if (error || !data) return new Response("Not found", { status: 404 });
        return new Response(data, {
          headers: {
            "content-type": data.type || "application/octet-stream",
            "cache-control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
