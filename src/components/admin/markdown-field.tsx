import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Markdown } from "@/components/site/markdown";

export function MarkdownField({
  id,
  value,
  onChange,
  rows = 18,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <Tabs defaultValue="write">
      <TabsList>
        <TabsTrigger value="write">Escrever</TabsTrigger>
        <TabsTrigger value="preview">Pré-visualizar</TabsTrigger>
      </TabsList>
      <TabsContent value="write">
        <Textarea
          id={id}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-mono text-sm leading-relaxed"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Dicas: ## Subtítulo · **negrito** · *itálico* · &gt; citação · - lista · linha em branco
          separa parágrafos.
        </p>
      </TabsContent>
      <TabsContent value="preview">
        <div className="min-h-64 border border-border bg-card/50 p-6">
          {value.trim() ? <Markdown>{value}</Markdown> : <p className="text-muted-foreground">Nada escrito ainda.</p>}
        </div>
      </TabsContent>
    </Tabs>
  );
}
