"use client";

import { useActionState } from "react";
import { envoyerContact, type ContactState } from "@/app/contact/actions";

const champStyle =
  "mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-foreground focus:border-primary";

const etatInitial: ContactState = {};

export function FormulaireContact() {
  const [state, action, pending] = useActionState(envoyerContact, etatInitial);

  if (state.ok) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-sage/40 bg-sage/10 p-6 text-foreground"
      >
        <p className="font-semibold">Message envoyé, merci !</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Nous vous répondrons dans les plus brefs délais.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="titre" className="text-sm font-medium text-foreground">
          Objet
        </label>
        <input
          id="titre"
          name="titre"
          type="text"
          required
          maxLength={200}
          className={champStyle}
        />
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Votre e-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={champStyle}
        />
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-medium text-foreground">
          Votre message
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={6}
          maxLength={2000}
          className={champStyle}
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm font-medium text-primary">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60"
      >
        {pending ? "Envoi en cours…" : "Envoyer le message"}
      </button>
    </form>
  );
}
