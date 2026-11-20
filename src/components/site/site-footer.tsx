import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border/60 bg-abyss">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-16 text-center">
        <p className="font-display text-3xl tracking-[0.4em] text-foreground/80">MARDUK</p>
        <p className="font-display text-lg italic text-muted-foreground">Diário dos sonhos</p>
        <p className="eyebrow">Um romance de Francisco Marcelaro</p>
        <div className="mt-6 flex items-center gap-8">
          <Link to="/personagens" className="eyebrow transition-colors hover:text-foreground">
            Personagens
          </Link>
          <Link to="/blog" className="eyebrow transition-colors hover:text-foreground">
            Blog
          </Link>
          <Link to="/painel" className="eyebrow opacity-50 transition-opacity hover:opacity-100">
            Área do autor
          </Link>
        </div>
        <p className="mt-4 font-mono text-[0.65rem] tracking-[0.3em] text-muted-foreground/50">
          03:17 — © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
