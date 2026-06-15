import Link from "next/link";
import { formatPrix } from "@/lib/format";
import type { MenuListItem } from "@/lib/types";

/** Carte d'un menu dans la vue globale. */
export function MenuCard({ menu }: { menu: MenuListItem }) {
  const epuise = menu.quantite_restante <= 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-md">
      {/* Visuel (placeholder décoratif tant que les photos ne sont pas fournies) */}
      <div
        aria-hidden
        className="relative h-40 bg-gradient-to-br from-accent/20 via-primary/10 to-sage/20"
      >
        <span className="absolute bottom-3 left-3 rounded-full bg-background/85 px-3 py-1 text-xs font-medium text-foreground">
          {menu.theme}
        </span>
        <span className="absolute bottom-3 right-3 rounded-full bg-background/85 px-3 py-1 text-xs font-medium text-sage">
          {menu.regime}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-foreground">{menu.titre}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {menu.description}
        </p>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground">
              Dès {menu.nombre_personne_minimum} personnes
            </p>
            <p className="text-lg font-semibold text-primary">
              {formatPrix(menu.prix_base)}
            </p>
          </div>
          {epuise ? (
            <span className="rounded-full bg-border px-3 py-1 text-xs font-medium text-muted-foreground">
              Épuisé
            </span>
          ) : (
            <span className="text-xs text-sage">
              {menu.quantite_restante} dispo.
            </span>
          )}
        </div>

        <Link
          href={`/menus/${menu.menu_id}`}
          className="mt-4 inline-flex justify-center rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          Voir le détail
        </Link>
      </div>
    </article>
  );
}
