import { useEffect, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import type { Theme } from "../hooks/useTheme";

/** Logos GitHub et LinkedIn (lucide ne fournit plus les logos de marques). */
export function IconeGithub({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export function IconeLinkedin({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/** Bouton clair / sombre. */
export function BoutonTheme({ theme, basculer, className = "" }: { theme: Theme; basculer: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={basculer}
      aria-label={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
      className={`grid size-10 place-items-center rounded-full transition ${className}`}
    >
      {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  );
}

/** Fait apparaître son contenu en douceur quand il entre à l'écran. */
export function Apparition({ children, delai = 0, className = "" }: { children: ReactNode; delai?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: delai, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Texte qui s'écrit lettre par lettre (effet machine à écrire). */
export function useMachineAEcrire(phrases: string[], vitesse = 55, pause = 1600) {
  const [texte, setTexte] = useState("");
  useEffect(() => {
    let i = 0;
    let j = 0;
    let efface = false;
    let minuteur: ReturnType<typeof setTimeout>;
    const pas = () => {
      const phrase = phrases[i];
      j += efface ? -1 : 1;
      setTexte(phrase.slice(0, j));
      if (!efface && j === phrase.length) {
        efface = true;
        minuteur = setTimeout(pas, pause);
        return;
      }
      if (efface && j === 0) {
        efface = false;
        i = (i + 1) % phrases.length;
      }
      minuteur = setTimeout(pas, efface ? vitesse / 2 : vitesse);
    };
    minuteur = setTimeout(pas, 400);
    return () => clearTimeout(minuteur);
  }, [phrases, vitesse, pause]);
  return texte;
}

/** Fait défiler la page jusqu'à une section. */
export const allerA = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
