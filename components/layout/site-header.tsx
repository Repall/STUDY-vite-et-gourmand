import Link from "next/link";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/menus", label: "Les menus" },
  { href: "/contact", label: "Contact" },
];

/** En-tête du site : logo, navigation principale et accès connexion. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight text-foreground"
          aria-label="Vite & Gourmand, retour à l'accueil"
        >
          Vite <span className="text-primary italic">&amp;</span> Gourmand
        </Link>

        <nav aria-label="Navigation principale" className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/connexion"
            className="ml-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Connexion
          </Link>
        </nav>
      </div>
    </header>
  );
}
