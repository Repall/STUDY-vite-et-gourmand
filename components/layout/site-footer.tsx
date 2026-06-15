import Link from "next/link";

// Horaires affichés en pied de page (provisoirement statiques — seront lus
// depuis la table `horaire` en Phase 4).
const horaires = [
  { jour: "Lundi", h: "09h00 – 18h00" },
  { jour: "Mardi", h: "09h00 – 18h00" },
  { jour: "Mercredi", h: "09h00 – 18h00" },
  { jour: "Jeudi", h: "09h00 – 18h00" },
  { jour: "Vendredi", h: "09h00 – 19h00" },
  { jour: "Samedi", h: "10h00 – 17h00" },
  { jour: "Dimanche", h: "Fermé" },
];

/** Pied de page : présentation, horaires (lun → dim) et liens légaux. */
export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-foreground text-background/90">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-semibold">
            Vite <span className="italic text-accent">&amp;</span> Gourmand
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-background/70">
            Traiteur bordelais depuis 25 ans. Des menus de saison faits maison
            pour tous vos événements.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-background">
            Horaires
          </h2>
          <dl className="mt-3 space-y-1 text-sm text-background/80">
            {horaires.map((h) => (
              <div key={h.jour} className="flex justify-between gap-6">
                <dt>{h.jour}</dt>
                <dd className="tabular-nums">{h.h}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-background">
            Informations
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/mentions-legales" className="text-background/80 transition-colors hover:text-accent">
                Mentions légales
              </Link>
            </li>
            <li>
              <Link href="/cgv" className="text-background/80 transition-colors hover:text-accent">
                Conditions générales de vente
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-background/80 transition-colors hover:text-accent">
                Nous contacter
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-background/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-background/60 sm:px-6">
          © {new Date().getFullYear()} Vite &amp; Gourmand — Bordeaux. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
