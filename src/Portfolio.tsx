import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Briefcase, Calendar, Cloud, Code2, Compass, Database, Download, FileText, Globe, GraduationCap, Mail, MapPin, Menu, Terminal as IconeTerminal, X } from "lucide-react";
import type { Theme } from "./hooks/useTheme";
import { commandes, formations, piliers, profil } from "@contenu/profil";
import { agile, competences, smart, outils, savoirEtre } from "@contenu/competences";
import { projets } from "@contenu/projets";
import { NIVEAUX, type CouleurFamille, type GroupeCompetences, type Niveau, type Projet } from "./modele";
import { Apparition, BoutonTheme, IconeGithub, IconeLinkedin, useMachineAEcrire } from "./components/communs";
import { FenetreProjet } from "./components/FenetreProjet";
import { FormulaireContact } from "./components/FormulaireContact";
import { Fond } from "./components/Fond";

// Design « Tech » : fond animé, cartes en verre, dégradé cyan → violet, touches de code.
// Tous les textes viennent du contenu (src/contenu/, ou src/contenu-exemple/ s'il n'existe pas).

const SECTIONS = [
  { id: "competences", nom: "compétences" },
  { id: "projets", nom: "projets" },
  { id: "formation", nom: "formation" },
  { id: "methodes", nom: "méthodes" },
  { id: "contact", nom: "contact" },
] as const;

const ICONES: Record<GroupeCompetences["icone"], typeof Code2> = { code: Code2, database: Database, cloud: Cloud, compass: Compass };

// Cartes « verre » : fond translucide sans flou d'arrière-plan (le flou rendait le défilement lent).
const verre = "rounded-3xl border border-slate-900/10 bg-white/75 shadow-sm shadow-slate-900/[0.03] dark:border-white/10 dark:bg-[#0b0d1c]/80";
const degrade = "bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-500 bg-clip-text text-transparent dark:from-cyan-300 dark:via-sky-400 dark:to-violet-400";

export function Portfolio({ theme, basculer }: { theme: Theme; basculer: () => void }) {
  const [ouvert, setOuvert] = useState<Projet | null>(null);

  return (
    <div className="relative min-h-dvh bg-slate-50 font-grotesk text-slate-900 dark:bg-[#05060f] dark:text-slate-100">
      <Fond />
      <div className="relative z-10">
        <EnTete theme={theme} basculer={basculer} />
        <Accueil />
        <Competences />
        <Projets ouvrir={setOuvert} />
        <Formation />
        <Methodes />
        <Contact />
      </div>
      <FenetreProjet projet={ouvert} onFermer={() => setOuvert(null)} />
    </div>
  );
}

/* ───────────────────────── En-tête ───────────────────────── */

function useSectionActive() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const visibles = new Map<string, number>();
    const obs = new IntersectionObserver(
      (entrees) => {
        for (const e of entrees) visibles.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        const meilleure = [...visibles.entries()].sort((a, b) => b[1] - a[1])[0];
        setActive(meilleure && meilleure[1] > 0 ? meilleure[0] : null);
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0, 0.01, 0.2, 0.5] },
    );
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, []);
  return active;
}

function EnTete({ theme, basculer }: { theme: Theme; basculer: () => void }) {
  const active = useSectionActive();
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    if (!menu) return;
    const touche = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", touche);
    return () => window.removeEventListener("keydown", touche);
  }, [menu]);

  return (
    <header className="sticky top-3 z-40 mx-auto mt-3 max-w-6xl px-4 sm:px-6">
      <div className="flex h-14 items-center justify-between rounded-full border border-slate-900/10 bg-white/80 px-3 pl-5 shadow-lg shadow-slate-900/5 backdrop-blur-md dark:border-white/10 dark:bg-[#0b0d1c]/80">
        <a href="#accueil" className="flex items-center gap-2 font-mono text-sm font-semibold" onClick={() => setMenu(false)}>
          <IconeTerminal className="size-4 text-cyan-500" />
          <span>
            <span className="text-violet-500">~/</span>{profil.prenom.toLowerCase()}
          </span>
        </a>

        <nav aria-label="Menu principal" className="hidden items-center gap-1 font-mono text-sm md:flex">
          {SECTIONS.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={active === s.id ? "true" : undefined}
              className={`rounded-full px-3.5 py-2 font-semibold transition ${
                active === s.id
                  ? "bg-gradient-to-r from-cyan-500/15 to-violet-500/15 text-cyan-700 ring-1 ring-cyan-500/30 dark:text-cyan-200"
                  : "text-slate-700 hover:bg-slate-900/5 hover:text-cyan-600 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-cyan-300"
              }`}
            >
              <span className="text-violet-500 dark:text-violet-400">0{i + 1}.</span> {s.nom}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <BoutonTheme theme={theme} basculer={basculer} className="size-10 hover:bg-slate-900/5 dark:hover:bg-white/10" />
          <button
            type="button"
            onClick={() => setMenu((m) => !m)}
            aria-label={menu ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menu}
            className="grid size-10 place-items-center rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white md:hidden"
          >
            {menu ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Menu sur téléphone */}
      {menu && (
        <>
          <button aria-label="Fermer le menu" className="fixed inset-0 -z-10 cursor-default md:hidden" onClick={() => setMenu(false)} />
          <motion.nav
            aria-label="Menu principal"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.16 }}
            className="mt-2 overflow-hidden rounded-3xl border border-slate-900/10 bg-white/95 p-2 font-mono shadow-xl backdrop-blur-md md:hidden dark:border-white/10 dark:bg-[#0b0d1c]/95"
          >
            {SECTIONS.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setMenu(false)}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-base font-semibold transition ${
                  active === s.id ? "bg-gradient-to-r from-cyan-500/15 to-violet-500/15 text-cyan-700 dark:text-cyan-200" : "hover:bg-slate-900/5 dark:hover:bg-white/10"
                }`}
              >
                <span className="text-violet-500">0{i + 1}.</span> {s.nom}
              </a>
            ))}
          </motion.nav>
        </>
      )}
    </header>
  );
}

/* ───────────────────────── Accueil ───────────────────────── */

/** Le terminal qui écrit les commandes : isolé dans son propre composant pour ne redessiner que lui. */
function Terminal() {
  const commande = useMachineAEcrire(commandes, 45, 1400);
  return (
    <div className={`mx-auto mt-8 inline-flex max-w-full items-center gap-2 overflow-hidden rounded-full px-4 py-2 font-mono text-xs whitespace-nowrap sm:text-sm ${verre}`}>
      <span className="text-emerald-500">➜</span>
      <span className="text-cyan-600 dark:text-cyan-300">~</span>
      <span className="truncate">{commande}</span>
      <span className="h-4 w-2 shrink-0 animate-pulse bg-cyan-500" />
    </div>
  );
}

function Accueil() {
  return (
    <section id="accueil" className="mx-auto max-w-6xl px-4 pt-16 pb-16 text-center sm:px-6 md:pt-24">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="relative mx-auto size-36 sm:size-44">
        <div className="absolute -inset-1.5 animate-spin rounded-full bg-[conic-gradient(from_0deg,#22d3ee,#8b5cf6,#0ea5e9,#22d3ee)] [animation-duration:6s]" />
        <img src={profil.photo} alt={`${profil.prenom} ${profil.nom}`} fetchPriority="high" className="relative size-full rounded-full border-4 border-slate-50 object-cover dark:border-[#05060f]" />
      </motion.div>

      <Terminal />

      <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7 }} className="mt-6 text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
        {profil.prenom} <span className={degrade}>{profil.nom}</span>
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mx-auto mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
        <strong className="text-slate-900 dark:text-white">{profil.metier}</strong> — {profil.accroche} {profil.formation}.
      </motion.p>

      {/* Téléphone : les deux boutons l'un sous l'autre, même largeur, puis LinkedIn et GitHub centrés. Grand écran : tout sur une ligne. */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="mx-auto mt-8 flex max-w-xs flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
        <a href="#projets" className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:shadow-violet-500/40">
          Voir mes projets <ArrowRight className="size-4 transition group-hover:translate-x-1" />
        </a>
        {profil.cv.afficher && (
          <a href={profil.cv.pdf} download={profil.cv.nomFichier} className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold transition hover:border-cyan-500 ${verre}`}>
            <Download className="size-4" /> Télécharger le CV
          </a>
        )}
        <div className="flex justify-center gap-3">
          <a href={profil.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className={`grid size-12 place-items-center rounded-full transition hover:text-cyan-500 ${verre}`}>
            <IconeLinkedin />
          </a>
          <a href={profil.github} target="_blank" rel="noreferrer" aria-label="GitHub" className={`grid size-12 place-items-center rounded-full transition hover:text-cyan-500 ${verre}`}>
            <IconeGithub />
          </a>
        </div>
      </motion.div>

      <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icone: Briefcase, valeur: profil.contrat, label: profil.disponibilite },
          { icone: Calendar, valeur: profil.rythmeCourt, label: profil.rythmeLegende },
          { icone: Code2, valeur: `${projets.length} projets`, label: "scolaires et perso" },
          { icone: MapPin, valeur: profil.region, label: profil.commune },
        ].map((s, i) => (
          <Apparition key={s.label} delai={0.1 * i} className={`p-4 text-left ${verre}`}>
            <s.icone className="size-5 text-cyan-500" />
            <p className="mt-3 text-lg font-bold">{s.valeur}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </Apparition>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── Compétences ───────────────────────── */

const STYLE_NIVEAU: Record<Niveau, { pastille: string; case: string }> = {
  maitrise: { pastille: "bg-gradient-to-r from-cyan-500 to-violet-500", case: "ring-2 ring-violet-400/60" },
  pratique: { pastille: "border border-cyan-500/70 bg-cyan-500/20", case: "ring-1 ring-cyan-400/60" },
  notions: { pastille: "border border-dashed border-slate-400", case: "ring-1 ring-slate-300 dark:ring-slate-600" },
};

const COULEURS_FAMILLE: Record<CouleurFamille, { titre: string; etiquette: string }> = {
  orange: { titre: "text-orange-600 dark:text-orange-300", etiquette: "bg-orange-500/10 text-orange-800 ring-orange-500/30 dark:text-orange-200" },
  cyan: { titre: "text-cyan-600 dark:text-cyan-300", etiquette: "bg-cyan-500/10 text-cyan-800 ring-cyan-500/30 dark:text-cyan-200" },
  violet: { titre: "text-violet-600 dark:text-violet-300", etiquette: "bg-violet-500/10 text-violet-800 ring-violet-500/30 dark:text-violet-200" },
  emeraude: { titre: "text-emerald-600 dark:text-emerald-300", etiquette: "bg-emerald-500/10 text-emerald-800 ring-emerald-500/30 dark:text-emerald-200" },
};

function Competences() {
  const [domaine, setDomaine] = useState(0);
  return (
    <section id="competences" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6">
      <Titre numero="01" titre="Stack & compétences" />
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {piliers.map((p) => (
          <div key={p.titre} className={`p-5 ${verre}`}>
            <p className="font-semibold">{p.titre}</p>
            <p className="mt-1 font-mono text-xs text-slate-500">{p.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-slate-600 dark:text-slate-400">
        {NIVEAUX.map((n) => (
          <span key={n.id} className="inline-flex items-center gap-2">
            <span className={`inline-block size-3 rounded-sm ${STYLE_NIVEAU[n.id].pastille}`} />
            {n.nom}
          </span>
        ))}
      </div>

      {/* Un onglet par domaine (Développement par défaut) et une seule bande qui défile, pause au survol ou au toucher. */}
      <Apparition className="mt-4">
        <div role="tablist" aria-label="Domaines de compétences" className={`grid grid-cols-2 gap-1 rounded-3xl p-1 sm:inline-flex sm:rounded-full ${verre}`}>
          {competences.map((g, i) => {
            const Icone = ICONES[g.icone];
            const actif = domaine === i;
            return (
              <button
                key={g.titre}
                id={`onglet-competences-${i}`}
                role="tab"
                aria-selected={actif}
                aria-controls="bande-competences"
                onClick={() => setDomaine(i)}
                className={`inline-flex items-center justify-center gap-1.5 rounded-full px-2 py-2 text-[13px] font-semibold transition sm:gap-2 sm:px-5 sm:text-sm ${
                  actif ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-md shadow-violet-500/20" : "text-slate-600 hover:bg-slate-900/5 dark:text-slate-300 dark:hover:bg-white/10"
                }`}
              >
                <Icone className="size-4 shrink-0" />
                <span className="whitespace-nowrap">{g.titre}</span>
                {/* Le nombre ne s'affiche que sur grand écran, pour que les noms tiennent sur téléphone. */}
                <span className={`hidden font-mono text-xs sm:inline ${actif ? "text-white/80" : "text-slate-400"}`}>{g.items.length}</span>
              </button>
            );
          })}
        </div>
        <div id="bande-competences" role="tabpanel" aria-labelledby={`onglet-competences-${domaine}`} className={`mt-3 overflow-hidden py-2 ${verre}`}>
          <BandeCompetences key={competences[domaine].titre} groupe={competences[domaine]} />
        </div>
      </Apparition>

      <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_2fr]">
        <div className={`p-6 ${verre}`}>
          <p className="font-mono text-xs text-violet-500">// outils d'équipe</p>
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-3">
            {outils.map((o) => (
              <span key={o.nom} title={o.nom} className="grid h-14 place-items-center overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1">
                <img src={o.logo} alt={o.nom} loading="lazy" decoding="async" className="size-full object-contain p-1.5" />
              </span>
            ))}
          </div>
        </div>
        <div className={`p-6 ${verre}`}>
          <p className="font-mono text-xs text-violet-500">// soft skills</p>
          <div className="mt-4 space-y-4">
            {savoirEtre.map((f) => (
              <div key={f.famille}>
                <p className={`text-xs font-bold tracking-wide uppercase ${COULEURS_FAMILLE[f.couleur].titre}`}>{f.famille}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {f.qualites.map((q) => (
                    <span key={q} className={`rounded-full px-3 py-1 text-sm font-medium ring-1 ${COULEURS_FAMILLE[f.couleur].etiquette}`}>
                      {q}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Le domaine choisi : ses icônes défilent en boucle, de la Maîtrise aux Notions. */
function BandeCompetences({ groupe }: { groupe: GroupeCompetences }) {
  const ordre = NIVEAUX.map((n) => n.id);
  const items = [...groupe.items].sort((a, b) => ordre.indexOf(a.niveau) - ordre.indexOf(b.niveau));
  const nomNiveau = (id: Niveau) => NIVEAUX.find((n) => n.id === id)?.nom ?? "";
  // Chaque copie doit être plus large que l'écran : on répète la liste si le domaine a peu de compétences.
  const tours = Math.max(1, Math.ceil(16 / items.length));
  const repetes = Array.from({ length: tours }, () => items).flat();
  const liste = (copie: number) => (
    <ul key={copie} className="flex shrink-0 gap-3 pr-3">
      {repetes.map((c, k) => (
        <li key={`${c.nom}-${k}`} className={`flex w-[84px] flex-col items-center gap-1.5 text-center ${k >= items.length ? "repete" : ""}`} title={`${c.nom} — ${nomNiveau(c.niveau)}`}>
          <span className={`grid size-14 place-items-center rounded-2xl bg-white shadow-sm ${STYLE_NIVEAU[c.niveau].case}`}>
            <img src={c.icone} alt="" loading="lazy" decoding="async" width={36} height={36} className="size-9 object-contain" />
          </span>
          <span className="text-[11px] leading-tight font-medium text-slate-700 dark:text-slate-300">{c.nom}</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="px-3 py-3 sm:px-4">
      {/* Pour les lecteurs d'écran : la liste simple, avec le niveau de chaque compétence. */}
      <ul className="sr-only">
        {items.map((c) => (
          <li key={c.nom}>
            {c.nom} : {nomNiveau(c.niveau)}
          </li>
        ))}
      </ul>
      <div className="bande" aria-hidden="true">
        {/* Deux copies identiques : quand la première est sortie à gauche, la seconde a pris sa place (boucle sans saut). */}
        <div className="piste flex w-max py-1" style={{ ["--duree" as string]: `${repetes.length * 2.8}s` }}>
          {liste(0)}
          {liste(1)}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Projets ───────────────────────── */

const ONGLETS = [
  { id: "tous", nom: "Tous" },
  { id: "Projet scolaire", nom: "Scolaires" },
  { id: "Projet personnel", nom: "Personnels" },
] as const;
type Onglet = (typeof ONGLETS)[number]["id"];

function Projets({ ouvrir }: { ouvrir: (p: Projet) => void }) {
  const [onglet, setOnglet] = useState<Onglet>("tous");
  const liste = onglet === "tous" ? projets : projets.filter((p) => p.cadre === onglet);

  return (
    <section id="projets" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6">
      <Titre numero="02" titre="Projets" />

      <div role="tablist" aria-label="Filtrer les projets" className={`mt-8 inline-flex max-w-full gap-1 rounded-full p-1 ${verre}`}>
        {ONGLETS.map((o) => {
          const nombre = o.id === "tous" ? projets.length : projets.filter((p) => p.cadre === o.id).length;
          const actif = onglet === o.id;
          return (
            <button
              key={o.id}
              role="tab"
              aria-selected={actif}
              onClick={() => setOnglet(o.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition sm:px-5 ${
                actif ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-md shadow-violet-500/20" : "text-slate-600 hover:bg-slate-900/5 dark:text-slate-300 dark:hover:bg-white/10"
              }`}
            >
              {o.nom} <span className={`ml-1 font-mono text-xs ${actif ? "text-white/80" : "text-slate-400"}`}>{nombre}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {liste.map((p, i) => (
          <Apparition key={`${onglet}-${p.id}`} delai={(i % 3) * 0.06}>
            <CarteProjet projet={p} ouvrir={ouvrir} />
          </Apparition>
        ))}
      </div>
    </section>
  );
}

function CarteProjet({ projet: p, ouvrir }: { projet: Projet; ouvrir: (p: Projet) => void }) {
  const nbImages = p.medias.filter((m) => !(m.type === "image" && m.src.includes("/logo"))).length;
  return (
    <button onClick={() => ouvrir(p)} className={`group relative flex h-full w-full flex-col overflow-hidden text-left transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10 ${verre}`}>
      <div className="relative m-2 overflow-hidden rounded-2xl">
        <div className="grid aspect-video place-items-center" style={{ background: `radial-gradient(circle at 50% 45%, #ffffff 0%, #f8fafc 50%, ${p.couleur}40 100%)` }}>
          <img src={p.logo} alt={`Logo ${p.titre}`} loading="lazy" decoding="async" width={112} height={112} className="size-24 object-contain transition duration-500 group-hover:scale-110 sm:size-28" />
        </div>
        <span className="absolute top-3 left-3 rounded-full bg-black/65 px-2.5 py-1 font-mono text-[10px] text-white">{p.cadre}</span>
        {p.liens?.demo && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-2.5 py-1 font-mono text-[10px] font-semibold text-white shadow">
            <Globe className="size-3" /> En ligne
          </span>
        )}
        {nbImages > 0 && (
          <span className="absolute right-3 bottom-3 rounded-full bg-black/65 px-2.5 py-1 font-mono text-[10px] text-white">
            {nbImages} média{nbImages > 1 ? "s" : ""}
          </span>
        )}
      </div>
      <div className="relative flex flex-1 flex-col p-5 pt-3">
        <p className="font-mono text-xs font-semibold" style={{ color: p.couleur }}>
          {p.categorie}
        </p>
        <h3 className="mt-1 text-2xl font-bold">{p.titre}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{p.resume}</p>
        <div className="mt-4 flex flex-wrap gap-1.5 font-mono text-[11px] text-slate-500">
          {p.techs.slice(0, 4).map((t) => (
            <span key={t} className="rounded-md bg-slate-900/5 px-2 py-0.5 dark:bg-white/5">
              {t}
            </span>
          ))}
        </div>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-600 dark:text-cyan-300">
          Voir le projet <ArrowRight className="size-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </button>
  );
}

/* ───────────────────────── Formation ───────────────────────── */

function Formation() {
  return (
    <section id="formation" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6">
      <Titre numero="03" titre="Formation" />
      <Apparition className={`mt-10 p-6 sm:p-8 ${verre}`}>
        <ol className="relative space-y-8 border-l-2 border-slate-900/10 pl-7 dark:border-white/10">
          {formations.map((f, i) => (
            <li key={f.ecole} className="relative">
              <span
                className={`absolute top-1 -left-[2.4rem] grid size-7 place-items-center rounded-full text-white ring-4 ring-slate-50 dark:ring-[#0b0d1c] ${
                  i === 0 ? "bg-gradient-to-br from-cyan-500 to-violet-500" : "bg-slate-400 dark:bg-slate-600"
                }`}
              >
                <GraduationCap className="size-3.5" />
              </span>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-mono text-sm text-violet-500 dark:text-violet-400">{f.periode}</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold ${
                    i === 0 ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white" : "border border-slate-900/15 text-slate-600 dark:border-white/15 dark:text-slate-300"
                  }`}
                >
                  {f.statut}
                </span>
              </div>
              <h3 className="mt-1.5 text-xl font-bold">{f.ecole}</h3>
              {f.diplome && <p className="font-medium text-slate-700 dark:text-slate-300">{f.diplome}</p>}
              {f.detail && <p className="mt-1.5 max-w-3xl text-sm text-slate-600 dark:text-slate-400">{f.detail}</p>}
            </li>
          ))}
        </ol>
      </Apparition>
    </section>
  );
}

/* ───────────────────────── Méthodes ───────────────────────── */

// Deux familles distinctes, côte à côte (pas des étapes) : l'agile, qui contient Scrum et Kanban, et les objectifs SMART.
const ICONES_METHODES: Record<string, string> = { Scrum: "/icones/scrum.svg", Kanban: "/icones/kanban.svg" };

function Methodes() {
  return (
    <section id="methodes" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6">
      <Titre numero="04" titre="Méthodes de travail" />
      <div className="mt-10 grid gap-5 lg:grid-cols-[1.75fr_1fr]">
        {/* Méthodologie agile : contient Scrum et Kanban */}
        <Apparition className={`relative overflow-hidden p-6 sm:p-8 ${verre}`}>
          <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 to-sky-500" />
          <p className="font-mono text-xs text-cyan-600 dark:text-cyan-300">// gestion de projet</p>
          <h3 className="mt-2 text-2xl font-bold">{agile.titre}</h3>
          <p className="mt-2 text-slate-600 dark:text-slate-400">{agile.resume}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {agile.principes.map((pr) => (
              <li key={pr} className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm text-cyan-800 ring-1 ring-cyan-500/25 dark:text-cyan-200">
                {pr}
              </li>
            ))}
          </ul>

          <p className="mt-7 text-xs font-bold tracking-wide text-slate-500 uppercase">Les méthodes agiles que j'utilise</p>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            {agile.methodes.map((m) => (
              <div key={m.titre} className="rounded-2xl border border-slate-900/10 bg-white/70 p-5 dark:border-white/10 dark:bg-white/[0.03]">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white shadow-sm ring-1 ring-slate-900/5">
                    <img src={ICONES_METHODES[m.titre]} alt="" className="size-7" />
                  </span>
                  <h4 className="text-lg font-bold">{m.titre}</h4>
                  <span
                    className={`ml-auto rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold ${
                      m.niveau === "Maîtrise" ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white" : "border border-cyan-500/50 bg-cyan-500/10 text-cyan-700 dark:text-cyan-200"
                    }`}
                  >
                    {m.niveau}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{m.resume}</p>
                <ul className="mt-3 space-y-1.5">
                  {m.points.map((pt) => {
                    const [debut, ...reste] = pt.split(" : ");
                    return (
                      <li key={pt} className="flex gap-2 text-sm leading-snug">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-500" />
                        <span>
                          {reste.length ? (
                            <>
                              <strong className="font-semibold">{debut}</strong> : {reste.join(" : ")}
                            </>
                          ) : (
                            pt
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </Apparition>

        {/* Objectifs SMART : une méthode à part */}
        <Apparition delai={0.08} className={`relative overflow-hidden p-6 sm:p-8 ${verre}`}>
          <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
          <p className="font-mono text-xs text-violet-600 dark:text-violet-300">// fixer les objectifs</p>
          <h3 className="mt-2 text-2xl font-bold">{smart.titre}</h3>
          <p className="mt-2 text-slate-600 dark:text-slate-400">{smart.resume}</p>
          <ul className="mt-5 space-y-3">
            {smart.lettres.map((l) => (
              <li key={l.lettre} className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 font-mono text-lg font-bold text-white shadow-md shadow-violet-500/20">
                  {l.lettre}
                </span>
                <span className="text-sm leading-snug">
                  <strong className="font-semibold">{l.mot}</strong>
                  <span className="text-slate-600 dark:text-slate-400"> : {l.sens}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-5 rounded-xl bg-violet-500/10 p-3 text-sm leading-relaxed text-violet-900 dark:text-violet-200">
            <span className="font-semibold">Exemple :</span> {smart.exemple}
          </p>
        </Apparition>
      </div>
    </section>
  );
}

/* ───────────────────────── Contact ───────────────────────── */

function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 pb-20 sm:px-6">
      <div className={`grid gap-10 overflow-hidden p-6 sm:p-10 md:grid-cols-2 ${verre}`}>
        <div>
          <p className="font-mono text-xs text-violet-500">// 05. contact</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Prêt à rejoindre <span className={degrade}>votre équipe.</span>
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Je recherche une {profil.recherche}, {profil.disponibilite.toLowerCase()}. Rythme : {profil.rythme}.
          </p>
          <div className="mt-6 space-y-3 font-mono text-sm">
            <a href={`mailto:${profil.email}`} className="flex items-center gap-3 break-all hover:text-cyan-500">
              <Mail className="size-4 shrink-0" /> {profil.email}
            </a>
            <p className="flex items-center gap-3 text-slate-500">
              <MapPin className="size-4" /> {profil.ville}
            </p>
          </div>
          {profil.cv.afficher && <CarteCv />}
        </div>
        <FormulaireContact
          champ="rounded-xl border border-slate-900/10 bg-white/80 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-white/10 dark:bg-white/5"
          bouton="rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-3 font-semibold text-white"
        />
      </div>
      <p className="mt-10 text-center font-mono text-xs text-slate-500">
        © {new Date().getFullYear()} {profil.prenom} {profil.nom} · construit avec React, TypeScript et Tailwind
      </p>
    </section>
  );
}

/** Aperçu du CV en bas de page : la miniature ouvre le PDF, le bouton le télécharge. */
function CarteCv() {
  return (
    <div className="mt-8 flex items-center gap-5 rounded-2xl border border-slate-900/10 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
      <a href={profil.cv.pdf} target="_blank" rel="noreferrer" aria-label="Ouvrir le CV en PDF" className="group shrink-0">
        <img
          src={profil.cv.image}
          alt={`Aperçu du CV de ${profil.prenom} ${profil.nom}`}
          loading="lazy"
          className="w-24 rounded-md border border-slate-900/10 shadow-md transition group-hover:-translate-y-1 group-hover:shadow-lg sm:w-28 dark:border-white/10"
        />
      </a>
      <div className="min-w-0">
        <p className="font-semibold">Mon CV</p>
        <p className="mt-1 text-sm text-slate-500">1 page, format PDF</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a href={profil.cv.pdf} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-slate-900/10 px-4 py-2 text-sm font-semibold transition hover:border-cyan-500 hover:text-cyan-500 dark:border-white/15">
            <FileText className="size-4" /> Voir
          </a>
          <a href={profil.cv.pdf} download={profil.cv.nomFichier} className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white">
            <Download className="size-4" /> Télécharger
          </a>
        </div>
      </div>
    </div>
  );
}

function Titre({ numero, titre }: { numero: string; titre: string }) {
  return (
    <Apparition className="flex items-center gap-4">
      <span className="font-mono text-sm text-violet-500">{numero}.</span>
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{titre}</h2>
      <span className="h-px flex-1 bg-gradient-to-r from-slate-400/40 to-transparent" />
    </Apparition>
  );
}
