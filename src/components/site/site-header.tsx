import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";

const navLink =
  "font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground transition-colors duration-500 hover:text-foreground";

export function SiteHeader() {
  const { session } = useAuth();
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-background via-background/70 to-transparent">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link
          to="/"
          className="font-display text-2xl tracking-[0.35em] text-foreground transition-opacity duration-700 hover:opacity-60"
        >
          MARDUK
        </Link>
        <nav className="flex items-center gap-6 sm:gap-10">
          <Link to="/personagens" className={navLink} activeProps={{ className: "text-foreground" }}>
            Personagens
          </Link>
          <Link to="/blog" className={navLink} activeProps={{ className: "text-foreground" }}>
            Blog
          </Link>
          {session && (
            <Link to="/painel" className={navLink} activeProps={{ className: "text-foreground" }}>
              Painel
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
