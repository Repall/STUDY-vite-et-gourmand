import Link from "next/link";

// Avis statiques pour la maquette de référence — seront lus depuis la table
// `avis` (statut = 'valide') en Phase 4.
const avis = [
  {
    note: 5,
    texte:
      "Prestation impeccable, plats délicieux et livraison ponctuelle. Je recommande les yeux fermés !",
    auteur: "Jean D.",
  },
  {
    note: 4,
    texte:
      "Très bon menu de Noël, copieux et savoureux. Un vrai régal partagé en famille.",
    auteur: "Marie M.",
  },
];

const savoirFaire = [
  {
    titre: "Fait maison",
    texte: "Chaque plat est préparé à la main, sans artifice, comme à la maison.",
  },
  {
    titre: "Produits de saison",
    texte: "Une carte qui évolue au fil des saisons et des producteurs locaux.",
  },
  {
    titre: "25 ans d'expérience",
    texte: "Julie et José cuisinent pour vos événements bordelais depuis 1999.",
  },
];

function Etoiles({ note }: { note: number }) {
  return (
    <span aria-label={`Note de ${note} sur 5`} className="text-gold">
      {"★".repeat(note)}
      <span className="text-border">{"★".repeat(5 - note)}</span>
    </span>
  );
}

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 60% at 80% 10%, rgba(194,97,63,0.12), transparent 60%), radial-gradient(50% 50% at 0% 100%, rgba(95,107,69,0.12), transparent 55%)",
          }}
        />
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-2xl animate-fade-up">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Artisan traiteur · Bordeaux
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
              La cuisine de réception,{" "}
              <span className="italic text-primary">faite maison</span> et de
              saison.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Des menus généreux pour Noël, Pâques, vos repas et réceptions.
              Composés avec soin, livrés chez vous, partout autour de Bordeaux.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/menus"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                Découvrir les menus
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Savoir-faire */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-3">
          {savoirFaire.map((item) => (
            <div key={item.titre}>
              <h2 className="text-xl font-semibold text-foreground">{item.titre}</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {item.texte}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Avis clients */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Ils nous ont fait confiance
          </h2>
          <p className="mt-3 text-muted-foreground">
            La satisfaction de nos clients, après chaque prestation.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {avis.map((a, i) => (
            <figure
              key={i}
              className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
            >
              <Etoiles note={a.note} />
              <blockquote className="mt-4 text-lg leading-relaxed text-foreground">
                « {a.texte} »
              </blockquote>
              <figcaption className="mt-4 text-sm font-medium text-muted-foreground">
                — {a.auteur}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
