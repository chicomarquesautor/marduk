import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

/** Uploads an image to the media bucket and returns its public site URL. */
export function ImageUpload({
  value,
  onChange,
  folder,
  aspect = "aspect-[16/9]",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  folder: "posts" | "characters";
  aspect?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Escolha um arquivo de imagem.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("A imagem precisa ter até 10 MB.");
      return;
    }
    setBusy(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("media")
      .upload(path, file, { contentType: file.type, upsert: false });
    setBusy(false);
    if (error) {
      toast.error("Não foi possível enviar a imagem.");
      return;
    }
    onChange(`/api/public/media/${path}`);
  }

  return (
    <div className="grid gap-3">
      <div className={`relative overflow-hidden border border-dashed border-border bg-card ${aspect}`}>
        {value ? (
          <>
            <img src={value} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 text-foreground hover:bg-background"
              aria-label="Remover imagem"
            >
              <X className="size-4" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ImagePlus className="size-6" />
            <span className="text-sm">{busy ? "Enviando…" : "Adicionar imagem"}</span>
          </button>
        )}
      </div>
      {value && (
        <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => inputRef.current?.click()}>
          {busy ? "Enviando…" : "Trocar imagem"}
        </Button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
