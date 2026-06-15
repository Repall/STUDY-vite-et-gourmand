import type { Metadata } from "next";
import { getMenus, getThemes, getRegimes } from "@/lib/data";
import { MenusFiltrables } from "@/components/menus/menus-filtrables";

export const metadata: Metadata = {
  title: "Les menus",
  description:
    "Découvrez tous les menus de Vite & Gourmand et filtrez-les par thème, régime, prix ou nombre de personnes.",
};

export default async function MenusPage() {
  // Chargement parallèle (menus + références pour les filtres).
  const [menus, themes, regimes] = await Promise.all([
    getMenus(),
    getThemes(),
    getRegimes(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <header className="mb-10 max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Nos menus
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Des compositions de saison pour tous vos événements. Affinez votre
          recherche grâce aux filtres.
        </p>
      </header>

      <MenusFiltrables menusInitiaux={menus} themes={themes} regimes={regimes} />
    </div>
  );
}
