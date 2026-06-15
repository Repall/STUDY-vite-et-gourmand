import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Connexion",
};

// Page provisoire — l'authentification complète (connexion, inscription,
// mot de passe oublié) sera développée à la phase Authentification.
export default function ConnexionPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Connexion
      </h1>
      <p className="mt-4 text-muted-foreground">
        L&apos;espace de connexion et de création de compte arrive très bientôt.
      </p>
      <Link
        href="/menus"
        className="mt-8 inline-flex rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        Découvrir les menus
      </Link>
    </div>
  );
}
