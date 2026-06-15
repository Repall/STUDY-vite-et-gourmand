// Utilitaires de formatage (locale française).

const formatteurEuro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

/** Formate un montant (string venant du driver ou number) en euros. */
export function formatPrix(valeur: string | number): string {
  return formatteurEuro.format(Number(valeur));
}

/** Convertit un TIME PostgreSQL ('09:00:00') en '09h00'. */
export function formatHeure(time: string | null): string {
  if (!time) return "";
  const [h, m] = time.split(":");
  return `${h}h${m}`;
}
