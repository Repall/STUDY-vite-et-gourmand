import type { Metadata } from "next";
import { FormulaireContact } from "@/components/contact/formulaire-contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Une question, un devis ? Contactez Vite & Gourmand, traiteur à Bordeaux.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        Nous contacter
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Une question, une demande de devis pour votre événement ? Écrivez-nous,
        nous vous répondrons rapidement.
      </p>

      <div className="mt-10">
        <FormulaireContact />
      </div>
    </div>
  );
}
