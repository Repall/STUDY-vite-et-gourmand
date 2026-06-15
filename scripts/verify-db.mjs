// Vérifie que db/schema.sql puis db/seed.sql s'exécutent sans erreur,
// sur un vrai PostgreSQL (PGlite, en mémoire). Lance quelques requêtes de
// contrôle pour valider la cohérence des données.
//
// Usage : node scripts/verify-db.mjs
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const schema = readFileSync(join(root, "db", "schema.sql"), "utf8");
const seed = readFileSync(join(root, "db", "seed.sql"), "utf8");

const db = new PGlite();

console.log("→ Exécution de schema.sql…");
await db.exec(schema);
console.log("  ✓ schéma créé sans erreur");

console.log("→ Exécution de seed.sql…");
await db.exec(seed);
console.log("  ✓ données insérées sans erreur");

// --- Requêtes de contrôle ---
const compte = async (table) =>
  (await db.query(`SELECT count(*)::int AS n FROM ${table}`)).rows[0].n;

const tables = [
  "role", "theme", "regime", "allergene", "horaire", "utilisateur",
  "plat", "menu", "menu_plat", "plat_allergene", "image",
  "commande", "suivi_commande", "avis", "contact",
];
console.log("\n→ Nombre de lignes par table :");
for (const t of tables) console.log(`   ${t.padEnd(16)} ${await compte(t)}`);

// Jointure menu -> plats -> allergènes (vue détaillée d'un menu).
console.log("\n→ Détail du menu 'Festin de Noël' (jointure menu/plat/allergène) :");
const detail = await db.query(`
  SELECT mp.categorie, p.titre_plat,
         COALESCE(string_agg(a.libelle, ', ' ORDER BY a.libelle), '—') AS allergenes
  FROM menu m
  JOIN menu_plat mp      ON mp.menu_id = m.menu_id
  JOIN plat p            ON p.plat_id = mp.plat_id
  LEFT JOIN plat_allergene pa ON pa.plat_id = p.plat_id
  LEFT JOIN allergene a  ON a.allergene_id = pa.allergene_id
  WHERE m.titre = 'Festin de Noël'
  GROUP BY mp.categorie, p.titre_plat
  ORDER BY array_position(ARRAY['entree','plat','dessert']::text[], mp.categorie)
`);
for (const r of detail.rows)
  console.log(`   [${r.categorie}] ${r.titre_plat} — allergènes : ${r.allergenes}`);

// Avis validés affichables en page d'accueil.
const avisValides = await db.query(
  `SELECT count(*)::int AS n FROM avis WHERE statut = 'valide'`
);
console.log(`\n→ Avis validés (affichés en accueil) : ${avisValides.rows[0].n}`);

// Vérifie le calcul du prix total (colonne générée) sur la commande avec réduction.
const cmd = await db.query(`
  SELECT numero_commande, nombre_personne, prix_menu, prix_livraison,
         prix_total, reduction_appliquee
  FROM commande WHERE numero_commande = 2
`);
const c = cmd.rows[0];
console.log(
  `\n→ Commande #2 : ${c.nombre_personne} pers, menu ${c.prix_menu} € + livraison ${c.prix_livraison} € ` +
  `= total ${c.prix_total} € (réduction -10% : ${c.reduction_appliquee})`
);

// Historique de statuts d'une commande terminée.
const suivi = await db.query(`
  SELECT statut FROM suivi_commande WHERE numero_commande = 1 ORDER BY date_heure
`);
console.log(
  `\n→ Suivi commande #1 : ${suivi.rows.map((r) => r.statut).join(" → ")}`
);

console.log("\n✅ Validation terminée : schema.sql + seed.sql sont cohérents.");
await db.close();
