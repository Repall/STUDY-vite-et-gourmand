import "server-only";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

/**
 * Couche d'accès aux données — SQL brut paramétré (anti-injection SQL).
 *
 * Deux modes, transparents pour l'appelant :
 *  - PRODUCTION : si `DATABASE_URL` est définie, on utilise postgres.js (Neon).
 *  - DÉVELOPPEMENT : sinon, on utilise PGlite (PostgreSQL en local, persistant
 *    dans .pgdata/), auto-initialisé avec db/schema.sql + db/seed.sql.
 *
 * L'unique fonction exposée est `query()`, qui prend une requête paramétrée
 * ($1, $2, …) et un tableau de valeurs — jamais de concaténation de chaînes.
 */

type DbDriver = {
  query: (text: string, params: unknown[]) => Promise<{ rows: unknown[] }>;
};

let driverPromise: Promise<DbDriver> | null = null;

async function createDriver(): Promise<DbDriver> {
  // --- Mode production : postgres.js + Neon ---
  if (process.env.DATABASE_URL) {
    const { default: postgres } = await import("postgres");
    const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });
    return {
      // Cast vers le type de paramètres attendu par postgres.js (notre `query`
      // expose volontairement une signature générique `unknown[]`).
      query: async (text, params) => ({
        rows: await sql.unsafe(text, params as Parameters<typeof sql.unsafe>[1]),
      }),
    };
  }

  // --- Mode développement : PGlite local ---
  const { PGlite } = await import("@electric-sql/pglite");
  const pg = new PGlite(join(process.cwd(), ".pgdata"));

  // Initialise le schéma + les données au premier démarrage (base vide).
  const check = await pg.query<{ t: string | null }>(
    "SELECT to_regclass('public.menu') AS t",
  );
  if (!check.rows[0]?.t) {
    const schema = await readFile(join(process.cwd(), "db", "schema.sql"), "utf8");
    const seed = await readFile(join(process.cwd(), "db", "seed.sql"), "utf8");
    await pg.exec(schema);
    await pg.exec(seed);
  }

  return { query: (text, params) => pg.query(text, params) };
}

function getDriver(): Promise<DbDriver> {
  driverPromise ??= createDriver();
  return driverPromise;
}

/** Exécute une requête SQL paramétrée et renvoie les lignes typées. */
export async function query<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const driver = await getDriver();
  const result = await driver.query(text, params);
  return result.rows as T[];
}
