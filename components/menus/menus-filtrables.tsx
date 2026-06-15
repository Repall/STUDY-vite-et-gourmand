"use client";

import { useEffect, useRef, useState } from "react";
import { MenuCard } from "./menu-card";
import type { MenuListItem, Regime, Theme } from "@/lib/types";

type Props = {
  menusInitiaux: MenuListItem[];
  themes: Theme[];
  regimes: Regime[];
};

const champStyle =
  "mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary";

/**
 * Vue globale des menus avec filtres DYNAMIQUES (mise à jour sans rechargement).
 * À chaque changement de filtre, on interroge /api/menus (debounce 250 ms,
 * requête précédente annulée). Filtres : thème, régime, nb de personnes,
 * prix min / prix max (la fourchette couvre aussi le « prix maximum »).
 */
export function MenusFiltrables({ menusInitiaux, themes, regimes }: Props) {
  const [theme, setTheme] = useState("");
  const [regime, setRegime] = useState("");
  const [personnes, setPersonnes] = useState("");
  const [prixMin, setPrixMin] = useState("");
  const [prixMax, setPrixMax] = useState("");
  const [menus, setMenus] = useState<MenuListItem[]>(menusInitiaux);
  const [chargement, setChargement] = useState(false);
  const premierRendu = useRef(true);

  useEffect(() => {
    // On a déjà les menus en SSR : pas d'appel API au premier rendu.
    if (premierRendu.current) {
      premierRendu.current = false;
      return;
    }

    const params = new URLSearchParams();
    if (theme) params.set("theme", theme);
    if (regime) params.set("regime", regime);
    if (personnes) params.set("personnes", personnes);
    if (prixMin) params.set("prixMin", prixMin);
    if (prixMax) params.set("prixMax", prixMax);

    const controleur = new AbortController();
    const minuteur = setTimeout(async () => {
      setChargement(true);
      try {
        const res = await fetch(`/api/menus?${params.toString()}`, {
          signal: controleur.signal,
        });
        if (res.ok) setMenus(await res.json());
      } catch {
        // requête annulée (filtre modifié entre-temps) : on ignore
      } finally {
        setChargement(false);
      }
    }, 250);

    return () => {
      clearTimeout(minuteur);
      controleur.abort();
    };
  }, [theme, regime, personnes, prixMin, prixMax]);

  const aDesFiltres = theme || regime || personnes || prixMin || prixMax;
  const reinitialiser = () => {
    setTheme("");
    setRegime("");
    setPersonnes("");
    setPrixMin("");
    setPrixMax("");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      {/* Filtres */}
      <form
        aria-label="Filtrer les menus"
        onSubmit={(e) => e.preventDefault()}
        className="h-fit rounded-2xl border border-border bg-surface p-5 lg:sticky lg:top-20"
      >
        <p className="font-semibold text-foreground">Filtres</p>

        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="f-theme" className="text-sm font-medium text-foreground">
              Thème
            </label>
            <select
              id="f-theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className={champStyle}
            >
              <option value="">Tous les thèmes</option>
              {themes.map((t) => (
                <option key={t.theme_id} value={t.libelle}>
                  {t.libelle}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="f-regime" className="text-sm font-medium text-foreground">
              Régime
            </label>
            <select
              id="f-regime"
              value={regime}
              onChange={(e) => setRegime(e.target.value)}
              className={champStyle}
            >
              <option value="">Tous les régimes</option>
              {regimes.map((r) => (
                <option key={r.regime_id} value={r.libelle}>
                  {r.libelle}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="f-personnes" className="text-sm font-medium text-foreground">
              Nombre de personnes
            </label>
            <input
              id="f-personnes"
              type="number"
              min={1}
              inputMode="numeric"
              placeholder="ex. 6"
              value={personnes}
              onChange={(e) => setPersonnes(e.target.value)}
              className={champStyle}
            />
          </div>

          <fieldset>
            <legend className="text-sm font-medium text-foreground">
              Fourchette de prix (€)
            </legend>
            <div className="mt-1 flex items-center gap-2">
              <input
                aria-label="Prix minimum"
                type="number"
                min={0}
                placeholder="Min"
                value={prixMin}
                onChange={(e) => setPrixMin(e.target.value)}
                className={champStyle}
              />
              <span aria-hidden className="text-muted-foreground">
                –
              </span>
              <input
                aria-label="Prix maximum"
                type="number"
                min={0}
                placeholder="Max"
                value={prixMax}
                onChange={(e) => setPrixMax(e.target.value)}
                className={champStyle}
              />
            </div>
          </fieldset>

          {aDesFiltres && (
            <button
              type="button"
              onClick={reinitialiser}
              className="text-sm font-medium text-primary underline-offset-2 hover:underline"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      </form>

      {/* Résultats */}
      <div>
        <p aria-live="polite" className="mb-4 text-sm text-muted-foreground">
          {menus.length} menu{menus.length > 1 ? "s" : ""}
          {chargement && " · mise à jour…"}
        </p>

        {menus.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {menus.map((menu) => (
              <MenuCard key={menu.menu_id} menu={menu} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center text-muted-foreground">
            Aucun menu ne correspond à vos critères.
          </p>
        )}
      </div>
    </div>
  );
}
