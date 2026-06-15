// Types métier partagés (reflètent le schéma relationnel).

export type Theme = { theme_id: number; libelle: string };
export type Regime = { regime_id: number; libelle: string };

/** Ligne de la liste des menus (vue globale). */
export type MenuListItem = {
  menu_id: number;
  titre: string;
  description: string;
  nombre_personne_minimum: number;
  prix_base: string; // NUMERIC renvoyé en string par le driver
  theme: string;
  regime: string;
  quantite_restante: number;
  image_url: string | null;
};

/** Plat d'un menu, avec sa catégorie et ses allergènes. */
export type MenuPlat = {
  plat_id: number;
  titre_plat: string;
  photo_url: string | null;
  categorie: "entree" | "plat" | "dessert";
  allergenes: string[];
};

/** Vue détaillée complète d'un menu. */
export type MenuDetail = {
  menu_id: number;
  titre: string;
  description: string;
  conditions: string | null;
  nombre_personne_minimum: number;
  prix_base: string;
  theme: string;
  regime: string;
  quantite_restante: number;
  images: { url: string; alt: string }[];
  plats: MenuPlat[];
};

export type AvisPublic = {
  note: number;
  description: string | null;
  prenom: string;
  nom: string;
};

export type Horaire = {
  jour: string;
  heure_ouverture: string | null;
  heure_fermeture: string | null;
  ferme: boolean;
};

/** Filtres de la vue globale des menus (tous optionnels). */
export type MenuFilters = {
  prixMax?: number;
  prixMin?: number;
  theme?: string;
  regime?: string;
  personnes?: number;
};
