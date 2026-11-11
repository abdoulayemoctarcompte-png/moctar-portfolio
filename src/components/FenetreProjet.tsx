import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import { miniature, type Projet } from "../modele";
import { IconeGithub } from "./communs";

/**
 * Fenêtre de détail d'un projet.
 * - En haut, la galerie : un cadre de TAILLE FIXE (toutes les images et vidéos ont la même taille),
 *   avec ✕, ← → et le compteur toujours visibles. Seul le texte en dessous défile.
 * - Navigation : flèches, miniatures, clavier (← → Échap) et glissement du doigt sur téléphone.
 */
export function FenetreProjet({ projet, onFermer }: { projet: Projet | null; onFermer: () => void }) {
  const [index, setIndex] = useState(0);

  useEffect(() => setIndex(0), [projet]);

  useEffect(() => {
    if (!projet) return;
    const total = projet.medias.length;
    const touche = (e: KeyboardEvent) => {
      if (e.key === "Escape") onFermer();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % total);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + total) % total);
    };
    const debordement = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", touche);
    return () => {
      document.body.style.overflow = debordement;
      window.removeEventListener("keydown", touche);
    };
  }, [projet, onFermer]);

  return (
    <AnimatePresence>
      {projet && (
        <motion.div
          key={projet.id}
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onFermer}
          role="dialog"
          aria-modal="true"
          aria-label={projet.titre}
        >
          <motion.div
            className="relative flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl bg-white text-zinc-900 shadow-2xl sm:max-h-[92dvh] sm:rounded-3xl dark:bg-zinc-900 dark:text-zinc-100"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onFermer}
              aria-label="Fermer"
              className="absolute top-3 right-3 z-20 grid size-11 place-items-center rounded-full bg-black/60 text-white ring-1 ring-white/20 transition hover:bg-black/80"
            >
              <X className="size-5" />
            </button>

            <Galerie projet={projet} index={index} setIndex={setIndex} />

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <Details projet={projet} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Galerie({ projet, index, setIndex }: { projet: Projet; index: number; setIndex: (f: (i: number) => number) => void }) {
  const medias = projet.medias;
  const total = medias.length;
  const m = medias[index] ?? medias[0];
  const logo = m.type === "image" && m.src.includes("/logo");
  const depart = useRef<number | null>(null);
  const bande = useRef<HTMLDivElement>(null);
  const precedent = () => setIndex((i) => (i - 1 + total) % total);
  const suivant = () => setIndex((i) => (i + 1) % total);

  // La miniature active reste visible dans la bande.
  useEffect(() => {
    const el = bande.current?.children[index] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [index]);

  return (
    <div className="shrink-0 bg-zinc-950">
      <div
        className="relative h-[34dvh] w-full select-none sm:h-[50dvh] sm:max-h-[520px]"
        style={logo ? { background: `radial-gradient(circle at 50% 45%, #ffffff 0%, #f1f5f9 55%, ${projet.couleur}33 100%)` } : undefined}
        onTouchStart={(e) => (depart.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (depart.current === null || total < 2) return;
          const ecart = e.changedTouches[0].clientX - depart.current;
          if (Math.abs(ecart) > 45) (ecart < 0 ? suivant : precedent)();
          depart.current = null;
        }}
      >
        {m.type === "video" ? (
          <video key={m.src} src={m.src} poster={m.apercu} controls autoPlay muted playsInline preload="metadata" className="absolute inset-0 size-full object-contain" />
        ) : (
          <img
            key={m.src}
            src={m.src}
            alt={`${projet.titre} — image ${index + 1} sur ${total}`}
            decoding="async"
            className={logo ? "absolute inset-0 m-auto size-36 object-contain drop-shadow-xl sm:size-52" : "absolute inset-0 size-full object-contain"}
          />
        )}

        {total > 1 && (
          <>
            <button onClick={precedent} aria-label="Image précédente" className="absolute top-1/2 left-2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white ring-1 ring-white/20 transition hover:bg-black/80 sm:left-3">
              <ChevronLeft className="size-6" />
            </button>
            <button onClick={suivant} aria-label="Image suivante" className="absolute top-1/2 right-2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white ring-1 ring-white/20 transition hover:bg-black/80 sm:right-3">
              <ChevronRight className="size-6" />
            </button>
            <span className="absolute top-3 left-3 z-10 rounded-full bg-black/60 px-3 py-1.5 font-mono text-xs text-white ring-1 ring-white/20">
              {index + 1} / {total}
              {m.type === "video" && " · vidéo"}
            </span>
          </>
        )}
      </div>

      {total > 1 && (
        <div ref={bande} className="defilement-fin flex gap-2 overflow-x-auto px-3 py-2.5">
          {medias.map((x, i) => (
            <button
              key={x.src}
              onClick={() => setIndex(() => i)}
              aria-label={`Voir l'image ${i + 1}`}
              className={`relative h-12 w-20 shrink-0 overflow-hidden rounded-lg ring-2 transition sm:h-14 sm:w-24 ${i === index ? "ring-cyan-400" : "opacity-50 ring-transparent hover:opacity-90"}`}
            >
              <img src={miniature(x)} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
              {x.type === "video" && <span className="absolute inset-0 grid place-items-center bg-black/30 text-sm font-bold text-white">▶</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Details({ projet }: { projet: Projet }) {
  const couleur = projet.couleur;
  return (
    <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[1.4fr_1fr]">
      <div>
        <p className="text-sm font-semibold tracking-wide uppercase" style={{ color: couleur }}>
          {projet.categorie} · {projet.cadre}
        </p>
        <h3 className="mt-1 text-3xl font-bold tracking-tight">{projet.titre}</h3>
        <p className="mt-4 leading-relaxed text-zinc-600 dark:text-zinc-300">{projet.description}</p>
        {(projet.liens?.code || projet.liens?.demo) && (
          <div className="mt-6 flex flex-wrap gap-3">
            {projet.liens.demo && (
              <a href={projet.liens.demo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20">
                <ExternalLink className="size-4" /> Voir en ligne
              </a>
            )}
            {projet.liens.code && (
              <a href={projet.liens.code} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-zinc-900">
                <IconeGithub className="size-4" /> Code
              </a>
            )}
          </div>
        )}
      </div>
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-zinc-500 uppercase dark:text-zinc-400">Points clés</h4>
          <ul className="mt-3 space-y-2">
            {projet.points.map((pt) => (
              <li key={pt} className="flex gap-2 text-sm leading-relaxed">
                <span className="mt-2 size-1.5 shrink-0 rounded-full" style={{ background: couleur }} />
                {pt}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-zinc-500 uppercase dark:text-zinc-400">Technologies</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {projet.techs.map((t) => (
              <span key={t} className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium dark:border-zinc-700">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
