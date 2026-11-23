export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-3xl px-6 py-10 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Francisco Marcelaro
      </div>
    </footer>
  );
}
