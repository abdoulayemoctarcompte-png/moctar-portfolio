// CONTENU D'EXEMPLE : vos compétences, classées par niveau.
// m(...) = Maîtrise, p(...) = Pratique, n(...) = Notions. Second argument : l'icône
// (un nom de fichier de public/icones/, par exemple "react" pour public/icones/react.webp, ou un chemin complet).
import { m, n, p, type CouleurFamille, type GroupeCompetences, type SousMethode } from "../modele";

const icone = "/exemple/icone.svg";

export const competences: GroupeCompetences[] = [
  { titre: "Développement", icone: "code", items: [m("JavaScript", icone), m("React", icone), p("TypeScript", icone), n("Java", icone)] },
  { titre: "Données", icone: "database", items: [m("SQL", icone), p("PostgreSQL", icone), n("NoSQL", icone)] },
  { titre: "DevOps & qualité", icone: "cloud", items: [m("Git", icone), p("Docker", icone), n("Kubernetes", icone)] },
  { titre: "Projet & design", icone: "compass", items: [m("Scrum", icone), p("Figma", icone), p("UML", icone)] },
];

export const outils = [
  { nom: "Outil 1", logo: "/exemple/outil.svg" },
  { nom: "Outil 2", logo: "/exemple/outil.svg" },
  { nom: "Outil 3", logo: "/exemple/outil.svg" },
];

// Savoir-être, rangés par famille (une couleur par famille).
export const savoirEtre: { famille: string; couleur: CouleurFamille; qualites: string[] }[] = [
  { famille: "Relationnel", couleur: "orange", qualites: ["Esprit d'équipe", "Communication"] },
  { famille: "Organisation", couleur: "cyan", qualites: ["Autonomie", "Rigueur"] },
  { famille: "État d'esprit", couleur: "violet", qualites: ["Curiosité", "Adaptabilité"] },
  { famille: "Réflexion & initiative", couleur: "emeraude", qualites: ["Esprit analytique", "Force de proposition"] },
];

// Méthodes de travail : l'agile (qui contient Scrum et Kanban) et les objectifs SMART, à part.
export const agile = {
  titre: "Méthodologie agile",
  resume: "Avancer par petites étapes, avec des retours réguliers.",
  principes: ["Livrer souvent une version qui fonctionne", "S'adapter aux retours", "Tester au fur et à mesure"],
  methodes: [
    {
      titre: "Scrum",
      niveau: "Maîtrise",
      resume: "Le travail est découpé en sprints d'une à deux semaines.",
      points: ["Sprint planning : on choisit le travail du sprint", "Daily : un point rapide chaque jour", "Rétrospective : ce qu'on améliore"],
    },
    {
      titre: "Kanban",
      niveau: "Pratique",
      resume: "Un tableau qui rend le travail visible.",
      points: ["Colonnes : À faire → En cours → Terminé", "Une tâche = une carte"],
    },
  ] as SousMethode[],
};

export const smart = {
  titre: "Objectifs SMART",
  resume: "Fixer des objectifs clairs, et savoir quand ils sont atteints.",
  lettres: [
    { lettre: "S", mot: "Spécifique", sens: "un objectif précis" },
    { lettre: "M", mot: "Mesurable", sens: "un résultat qu'on peut vérifier" },
    { lettre: "A", mot: "Atteignable", sens: "à la portée de l'équipe" },
    { lettre: "R", mot: "Réaliste", sens: "adapté au temps et aux moyens" },
    { lettre: "T", mot: "Temporel", sens: "avec une date limite" },
  ],
  exemple: "« Livrer la page de connexion, testée, d'ici la fin du sprint. »",
};
