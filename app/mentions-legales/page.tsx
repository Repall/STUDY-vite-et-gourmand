import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
};

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-4xl font-semibold tracking-tight text-foreground">
        Mentions légales
      </h1>

      <div className="mt-8 space-y-8 leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground">Éditeur du site</h2>
          <p className="mt-2">
            Vite &amp; Gourmand — [forme juridique], au capital de [montant] €.
            <br />
            Siège social : [adresse], Bordeaux.
            <br />
            SIRET : [numéro] — RCS Bordeaux [numéro].
            <br />
            Téléphone : [numéro] — E-mail : contact@vitegourmand.fr
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            Directeur de la publication
          </h2>
          <p className="mt-2">[Nom du responsable de la publication].</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Hébergement</h2>
          <p className="mt-2">
            Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut,
            CA 91789, États-Unis.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            Propriété intellectuelle
          </h2>
          <p className="mt-2">
            L&apos;ensemble des contenus (textes, visuels, logo) est la propriété
            de Vite &amp; Gourmand, sauf mention contraire. Toute reproduction
            sans autorisation est interdite.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            Données personnelles (RGPD)
          </h2>
          <p className="mt-2">
            Les données collectées (compte, commandes) sont nécessaires au
            traitement de vos demandes et ne sont jamais cédées à des tiers.
            Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de
            rectification et de suppression de vos données. Pour l&apos;exercer,
            écrivez-nous à contact@vitegourmand.fr ou depuis votre espace
            personnel.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Cookies</h2>
          <p className="mt-2">
            Le site utilise uniquement des cookies strictement nécessaires à son
            fonctionnement (session de connexion). Aucun cookie publicitaire
            n&apos;est déposé.
          </p>
        </section>
      </div>
    </div>
  );
}
