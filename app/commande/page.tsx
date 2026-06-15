import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Commander",
};

// Page provisoire — le tunnel de commande (réservé aux utilisateurs connectés)
// sera développé à la phase Commande.
export default function CommandePage() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Commande
      </h1>
      <p className="mt-4 text-muted-foreground">
        Le tunnel de commande arrive prochainement. Vous devrez être connecté
        pour passer commande.
      </p>
      <Link
        href="/connexion"
        className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
      >
        Se connecter
      </Link>
    </div>
  );
}
