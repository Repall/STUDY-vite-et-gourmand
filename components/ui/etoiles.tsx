/** Affiche une note de 0 à 5 sous forme d'étoiles, accessible aux lecteurs d'écran. */
export function Etoiles({ note }: { note: number }) {
  return (
    <span aria-label={`Note de ${note} sur 5`} className="text-gold">
      <span aria-hidden>
        {"★".repeat(note)}
        <span className="text-border">{"★".repeat(5 - note)}</span>
      </span>
    </span>
  );
}
