"use server";

import { creerContact } from "@/lib/data";

export type ContactState = {
  ok?: boolean;
  error?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Traite l'envoi du formulaire de contact.
 * Validation et nettoyage CÔTÉ SERVEUR (ne jamais se fier au seul front).
 */
export async function envoyerContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const titre = String(formData.get("titre") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!titre || !email || !description) {
    return { error: "Tous les champs sont obligatoires." };
  }
  if (titre.length > 200) {
    return { error: "Le titre ne doit pas dépasser 200 caractères." };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { error: "Veuillez saisir une adresse e-mail valide." };
  }
  if (description.length > 2000) {
    return { error: "Le message est trop long (2000 caractères maximum)." };
  }

  await creerContact(titre, description, email);
  // TODO (phase e-mails) : notifier l'entreprise par e-mail via Resend.

  return { ok: true };
}
