import { Link } from "@tanstack/react-router";

const navLink = "text-sm text-muted-foreground transition-colors hover:text-foreground";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
        <Link to="/" className="font-display text-xl text-foreground">
          Marduk
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/personagens" className={navLink} activeProps={{ className: "text-foreground" }}>
            Personagens
          </Link>
          <Link to="/blog" className={navLink} activeProps={{ className: "text-foreground" }}>
            Blog
          </Link>
        </nav>
      </div>
    </header>
  );
}
