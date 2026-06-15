import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
};

export default function CgvPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-4xl font-semibold tracking-tight text-foreground">
        Conditions générales de vente
      </h1>

      <div className="mt-8 space-y-8 leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground">1. Objet</h2>
          <p className="mt-2">
            Les présentes conditions régissent les ventes de prestations de
            traiteur réalisées par Vite &amp; Gourmand auprès de ses clients via
            le site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">2. Commandes</h2>
          <p className="mt-2">
            Toute commande nécessite la création d&apos;un compte. Le nombre de
            convives doit être supérieur ou égal au minimum indiqué pour chaque
            menu. Certains menus imposent un délai de commande (par exemple 7
            jours avant la prestation), précisé sur la fiche du menu.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">3. Prix et livraison</h2>
          <p className="mt-2">
            Les prix sont indiqués en euros, pour le nombre minimum de personnes
            du menu. Une <strong>réduction de 10 %</strong> est appliquée pour
            toute commande comptant au moins 5 personnes de plus que ce minimum.
          </p>
          <p className="mt-2">
            La livraison est facturée <strong>5 € de base</strong>, majorés de{" "}
            <strong>0,59 € par kilomètre</strong> lorsque le lieu de livraison se
            situe en dehors de la ville de Bordeaux. Le détail du prix (menu +
            livraison) est présenté avant toute validation de la commande.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            4. Modification et annulation
          </h2>
          <p className="mt-2">
            Le client peut modifier ou annuler sa commande tant qu&apos;elle
            n&apos;a pas été acceptée par notre équipe (le choix du menu n&apos;est
            pas modifiable). Une fois acceptée, la commande suit un processus de
            préparation et de livraison consultable depuis l&apos;espace client.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            5. Prêt et restitution de matériel
          </h2>
          <p className="mt-2">
            Lorsque du matériel est prêté dans le cadre d&apos;une prestation, le
            client s&apos;engage à le restituer.{" "}
            <strong>
              À défaut de restitution sous 10 jours ouvrés à compter de la
              demande, des frais de 600 € seront facturés.
            </strong>{" "}
            Le client est invité à prendre contact avec la société pour organiser
            le retour du matériel.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">6. Droit applicable</h2>
          <p className="mt-2">
            Les présentes conditions sont soumises au droit français. Tout litige
            relève de la compétence des tribunaux de Bordeaux.
          </p>
        </section>
      </div>
    </div>
  );
}
