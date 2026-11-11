// CONTENU D'EXEMPLE : vos projets. L'ordre du tableau est l'ordre d'affichage.
// Vos images : public/media/<projet>/1.webp, 2.webp… et demo.mp4, puis medias: [...imgs("<projet>", 3), video("<projet>")].
import type { Media, Projet } from "../modele";

const captures: Media[] = [1, 2, 3].map((i) => ({ type: "image", src: `/exemple/capture-${i}.svg` }));

export const projets: Projet[] = [
  {
    id: "projet-perso",
    titre: "Mon projet personnel",
    categorie: "Application web",
    cadre: "Projet personnel",
    resume: "Une phrase qui donne envie d'en savoir plus.",
    description: "Le problème que le projet résout, ce que vous avez construit et comment.",
    points: ["Un point clé technique", "Un résultat concret", "Ce que vous avez appris"],
    techs: ["React", "TypeScript", "Node.js"],
    medias: captures,
    couleur: "#8B5CF6",
    logo: "/exemple/logo.svg",
    liens: { demo: "https://exemple.fr" },
  },
  {
    id: "projet-ecole",
    titre: "Mon projet d'école",
    categorie: "Logiciel",
    cadre: "Projet scolaire",
    resume: "Une phrase qui résume le projet.",
    description: "Le contexte, votre rôle dans l'équipe et les choix techniques.",
    points: ["Travail en équipe en sprints", "Architecture en couches", "Tests unitaires"],
    techs: ["C#", ".NET", "SQL"],
    medias: captures,
    couleur: "#06B6D4",
    logo: "/exemple/logo.svg",
  },
];
