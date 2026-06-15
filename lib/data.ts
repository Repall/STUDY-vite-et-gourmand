import { query } from "./db";
import type {
  AvisPublic,
  Horaire,
  MenuDetail,
  MenuFilters,
  MenuListItem,
  MenuPlat,
  Regime,
  Theme,
} from "./types";

const ORDRE_JOURS =
  "ARRAY['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche']::text[]";
const ORDRE_CATEGORIES = "ARRAY['entree','plat','dessert']::text[]";

// --- Références (pour les filtres) ---

export function getThemes(): Promise<Theme[]> {
  return query<Theme>("SELECT theme_id, libelle FROM theme ORDER BY libelle");
}

export function getRegimes(): Promise<Regime[]> {
  return query<Regime>("SELECT regime_id, libelle FROM regime ORDER BY libelle");
}

// --- Vue globale des menus, avec filtres dynamiques ---

export function getMenus(filtres: MenuFilters = {}): Promise<MenuListItem[]> {
  const conditions: string[] = ["m.actif = TRUE"];
  const params: unknown[] = [];

  // Ajoute une condition paramétrée ($1, $2, …) — jamais de valeur concaténée.
  const ajouter = (clause: string, valeur: unknown) => {
    params.push(valeur);
    conditions.push(clause.replace("?", `$${params.length}`));
  };

  if (filtres.prixMax != null) ajouter("m.prix_base <= ?", filtres.prixMax);
  if (filtres.prixMin != null) ajouter("m.prix_base >= ?", filtres.prixMin);
  if (filtres.theme) ajouter("t.libelle = ?", filtres.theme);
  if (filtres.regime) ajouter("r.libelle = ?", filtres.regime);
  if (filtres.personnes != null)
    ajouter("m.nombre_personne_minimum <= ?", filtres.personnes);

  return query<MenuListItem>(
    `SELECT m.menu_id, m.titre, m.description, m.nombre_personne_minimum,
            m.prix_base, t.libelle AS theme, r.libelle AS regime, m.quantite_restante,
            (SELECT i.url FROM image i WHERE i.menu_id = m.menu_id
             ORDER BY i.position LIMIT 1) AS image_url
       FROM menu m
       JOIN theme t  ON t.theme_id = m.theme_id
       JOIN regime r ON r.regime_id = m.regime_id
      WHERE ${conditions.join(" AND ")}
      ORDER BY m.prix_base ASC`,
    params,
  );
}

// --- Vue détaillée d'un menu ---

export async function getMenuById(id: number): Promise<MenuDetail | null> {
  const menus = await query<Omit<MenuDetail, "images" | "plats">>(
    `SELECT m.menu_id, m.titre, m.description, m.conditions,
            m.nombre_personne_minimum, m.prix_base,
            t.libelle AS theme, r.libelle AS regime, m.quantite_restante
       FROM menu m
       JOIN theme t  ON t.theme_id = m.theme_id
       JOIN regime r ON r.regime_id = m.regime_id
      WHERE m.menu_id = $1 AND m.actif = TRUE`,
    [id],
  );
  const menu = menus[0];
  if (!menu) return null;

  const images = await query<{ url: string; alt: string }>(
    "SELECT url, alt FROM image WHERE menu_id = $1 ORDER BY position",
    [id],
  );

  const plats = await query<MenuPlat>(
    `SELECT p.plat_id, p.titre_plat, p.photo_url, mp.categorie,
            COALESCE(
              array_agg(a.libelle ORDER BY a.libelle) FILTER (WHERE a.libelle IS NOT NULL),
              '{}'
            ) AS allergenes
       FROM menu_plat mp
       JOIN plat p ON p.plat_id = mp.plat_id
       LEFT JOIN plat_allergene pa ON pa.plat_id = p.plat_id
       LEFT JOIN allergene a       ON a.allergene_id = pa.allergene_id
      WHERE mp.menu_id = $1
      GROUP BY p.plat_id, p.titre_plat, p.photo_url, mp.categorie
      ORDER BY array_position(${ORDRE_CATEGORIES}, mp.categorie)`,
    [id],
  );

  return { ...menu, images, plats };
}

// --- Avis validés (page d'accueil) ---

export function getAvisValides(limite = 6): Promise<AvisPublic[]> {
  return query<AvisPublic>(
    `SELECT a.note, a.description, u.prenom, u.nom
       FROM avis a
       JOIN utilisateur u ON u.utilisateur_id = a.utilisateur_id
      WHERE a.statut = 'valide'
      ORDER BY a.cree_le DESC
      LIMIT $1`,
    [limite],
  );
}

// --- Horaires (pied de page) ---

export function getHoraires(): Promise<Horaire[]> {
  return query<Horaire>(
    `SELECT jour, heure_ouverture, heure_fermeture, ferme
       FROM horaire
      ORDER BY array_position(${ORDRE_JOURS}, jour)`,
  );
}

// --- Message de contact (formulaire public) ---

export async function creerContact(
  titre: string,
  description: string,
  email: string,
): Promise<void> {
  await query(
    "INSERT INTO contact (titre, description, email) VALUES ($1, $2, $3)",
    [titre, description, email],
  );
}
