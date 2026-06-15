import { NextRequest, NextResponse } from "next/server";
import { getMenus } from "@/lib/data";

/**
 * GET /api/menus — renvoie les menus filtrés en JSON.
 * Utilisé par la vue globale pour mettre à jour la liste SANS rechargement.
 * Filtres : prixMax, prixMin (fourchette), theme, regime, personnes.
 */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  const nombre = (cle: string): number | undefined => {
    const valeur = sp.get(cle);
    if (!valeur) return undefined;
    const n = Number(valeur);
    return Number.isFinite(n) ? n : undefined;
  };
  const texte = (cle: string): string | undefined => sp.get(cle) || undefined;

  const menus = await getMenus({
    prixMax: nombre("prixMax"),
    prixMin: nombre("prixMin"),
    theme: texte("theme"),
    regime: texte("regime"),
    personnes: nombre("personnes"),
  });

  return NextResponse.json(menus);
}
