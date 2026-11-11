// Modèle du portfolio : les types et petites fonctions communs au contenu et aux composants.
// Le contenu lui-même est dans src/contenu/ (le vôtre, non publié) ou src/contenu-exemple/ (exemple fourni).

/* ── Compétences ── */
export type Niveau = "maitrise" | "pratique" | "notions";

export const NIVEAUX: { id: Niveau; nom: string }[] = [
  { id: "maitrise", nom: "Maîtrise" },
  { id: "pratique", nom: "Pratique" },
  { id: "notions", nom: "Notions" },
];

export interface Competence {
  nom: string;
  niveau: Niveau;
  icone: string; // chemin de l'icône
}

export interface GroupeCompetences {
  titre: string;
  icone: "code" | "database" | "cloud" | "compass";
  items: Competence[];
}

/** Chemin d'une icône : un chemin complet ("/…") est gardé tel quel, sinon public/icones/<nom>(.webp). */
const ic = (nom: string) => (nom.startsWith("/") ? nom : nom.endsWith(".svg") ? `/icones/${nom}` : `/icones/${nom}.webp`);
export const m = (nom: string, icone: string): Competence => ({ nom, niveau: "maitrise", icone: ic(icone) });
export const p = (nom: string, icone: string): Competence => ({ nom, niveau: "pratique", icone: ic(icone) });
export const n = (nom: string, icone: string): Competence => ({ nom, niveau: "notions", icone: ic(icone) });

export type CouleurFamille = "orange" | "cyan" | "violet" | "emeraude";

export interface SousMethode {
  titre: string;
  niveau: "Maîtrise" | "Pratique";
  resume: string;
  points: string[];
}

/* ── Projets ── */
export type Media = { type: "image"; src: string } | { type: "video"; src: string; apercu: string };

export interface Projet {
  id: string;
  titre: string;
  categorie: string;
  cadre: "Projet scolaire" | "Projet personnel";
  resume: string;
  description: string;
  points: string[];
  techs: string[];
  medias: Media[];
  couleur: string; // couleur d'ambiance de la carte
  logo: string; // logo affiché sur la carte
  liens?: { code?: string; demo?: string }; // demo = adresse du projet en ligne
}

/** Images numérotées d'un projet : public/media/<dossier>/1.webp, 2.webp… */
export const imgs = (dossier: string, nb: number): Media[] =>
  Array.from({ length: nb }, (_, i) => ({ type: "image", src: `/media/${dossier}/${i + 1}.webp` }));

/** Vidéo d'un projet : public/media/<dossier>/demo.mp4 et son aperçu demo-apercu.webp. */
export const video = (dossier: string): Media => ({
  type: "video",
  src: `/media/${dossier}/demo.mp4`,
  apercu: `/media/${dossier}/demo-apercu.webp`,
});

/** Vignette légère (240 px) d'un média pour la galerie (public/media/<projet>/mini/). Ailleurs, l'image elle-même. */
export const miniature = (media: Media) => {
  const src = media.type === "video" ? media.apercu : media.src;
  return src.startsWith("/media/") ? src.replace(/\/([^/]+)$/, "/mini/$1") : src;
};
