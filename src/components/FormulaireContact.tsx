import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { profil } from "@contenu/profil";

type Etat = "repos" | "envoi" | "envoye" | "erreur";

/** Formulaire de contact (envoi par Formspree, gratuit) : prénom, nom, email, message. */
export function FormulaireContact({ champ, bouton }: { champ: string; bouton: string }) {
  const [etat, setEtat] = useState<Etat>("repos");

  const envoyer = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formulaire = e.currentTarget;
    setEtat("envoi");
    try {
      const r = await fetch(profil.formulaire, { method: "POST", body: new FormData(formulaire), headers: { Accept: "application/json" } });
      if (!r.ok) throw new Error();
      formulaire.reset();
      setEtat("envoye");
    } catch {
      setEtat("erreur");
    }
  };

  if (etat === "envoye")
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <CheckCircle2 className="size-12 text-emerald-500" />
        <p className="text-lg font-semibold">Message envoyé, merci !</p>
        <p className="text-sm opacity-70">Je vous réponds au plus vite.</p>
      </div>
    );

  return (
    <form onSubmit={envoyer} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Prénom
          <input name="prenom" required autoComplete="given-name" className={`mt-1.5 w-full ${champ}`} />
        </label>
        <label className="block text-sm font-medium">
          Nom
          <input name="nom" required autoComplete="family-name" className={`mt-1.5 w-full ${champ}`} />
        </label>
      </div>
      <label className="block text-sm font-medium">
        Email
        <input name="email" type="email" required autoComplete="email" className={`mt-1.5 w-full ${champ}`} />
      </label>
      <label className="block text-sm font-medium">
        Message
        <textarea name="message" rows={4} required className={`mt-1.5 w-full resize-none ${champ}`} />
      </label>
      <input type="hidden" name="_subject" value="Nouveau message depuis le portfolio" />
      {etat === "erreur" && <p className="text-sm text-red-500">L'envoi a échoué. Écrivez-moi directement à {profil.email}.</p>}
      <button type="submit" disabled={etat === "envoi"} className={`inline-flex w-full items-center justify-center gap-2 disabled:opacity-60 sm:w-auto ${bouton}`}>
        {etat === "envoi" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        Envoyer
      </button>
    </form>
  );
}
