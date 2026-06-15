import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMenuById } from "@/lib/data";
import { formatPrix } from "@/lib/format";
import type { MenuPlat } from "@/lib/types";

type Props = { params: Promise<{ id: string }> };

const LIBELLE_CATEGORIE: Record<MenuPlat["categorie"], string> = {
  entree: "Entrée",
  plat: "Plat",
  dessert: "Dessert",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const menu = await getMenuById(Number(id));
  return { title: menu ? menu.titre : "Menu introuvable" };
}

export default async function MenuDetailPage({ params }: Props) {
  const { id } = await params;
  const menuId = Number(id);
  if (!Number.isInteger(menuId)) notFound();

  const menu = await getMenuById(menuId);
  if (!menu) notFound();

  const epuise = menu.quantite_restante <= 0;
  const categories: MenuPlat["categorie"][] = ["entree", "plat", "dessert"];

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Link
        href="/menus"
        className="text-sm font-medium text-primary underline-offset-2 hover:underline"
      >
        ← Retour aux menus
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">
            {menu.theme}
          </span>
          <span className="rounded-full bg-sage/15 px-3 py-1 text-xs font-medium text-sage">
            {menu.regime}
          </span>
        </div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {menu.titre}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {menu.description}
        </p>
      </header>

      {/* Galerie (placeholders tant que les photos ne sont pas fournies) */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {menu.images.length > 0 ? (
          menu.images.map((img, i) => (
            <div
              key={i}
              role="img"
              aria-label={img.alt}
              className="h-40 rounded-xl bg-gradient-to-br from-accent/20 via-primary/10 to-sage/20"
            />
          ))
        ) : (
          <div className="h-40 rounded-xl bg-gradient-to-br from-accent/20 to-sage/20" />
        )}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        {/* Composition du menu */}
        <section aria-labelledby="composition">
          <h2 id="composition" className="text-2xl font-semibold text-foreground">
            Composition
          </h2>
          <div className="mt-4 space-y-6">
            {categories.map((cat) => {
              const plats = menu.plats.filter((p) => p.categorie === cat);
              if (plats.length === 0) return null;
              return (
                <div key={cat}>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-accent">
                    {LIBELLE_CATEGORIE[cat]}
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {plats.map((p) => (
                      <li
                        key={p.plat_id}
                        className="rounded-xl border border-border bg-surface p-4"
                      >
                        <p className="font-medium text-foreground">{p.titre_plat}</p>
                        {p.allergenes.length > 0 && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            <span className="font-medium">Allergènes :</span>{" "}
                            {p.allergenes.join(", ")}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Encart prix + commande */}
        <aside className="h-fit lg:sticky lg:top-20">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <p className="text-sm text-muted-foreground">
              Pour {menu.nombre_personne_minimum} personnes minimum
            </p>
            <p className="mt-1 text-3xl font-semibold text-primary">
              {formatPrix(menu.prix_base)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {epuise
                ? "Actuellement épuisé"
                : `${menu.quantite_restante} commande(s) encore disponible(s)`}
            </p>

            <Link
              href={`/commande?menu=${menu.menu_id}`}
              aria-disabled={epuise}
              className={`mt-5 flex justify-center rounded-full px-6 py-3 text-sm font-semibold transition-colors ${
                epuise
                  ? "pointer-events-none bg-border text-muted-foreground"
                  : "bg-primary text-primary-foreground hover:bg-primary-hover"
              }`}
            >
              {epuise ? "Indisponible" : "Commander"}
            </Link>
          </div>

          {/* Conditions MISES EN ÉVIDENCE */}
          {menu.conditions && (
            <div className="mt-4 rounded-2xl border-2 border-accent/40 bg-accent/10 p-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-accent">
                ⚠ Conditions importantes
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-foreground">
                {menu.conditions}
              </p>
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}
