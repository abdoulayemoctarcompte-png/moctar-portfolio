// CONTENU D'EXEMPLE : remplacez ces textes par les vôtres.
// Conseil : copiez le dossier src/contenu-exemple/ en src/contenu/ (ignoré par git) et modifiez la copie.
// Le site utilise automatiquement src/contenu/ s'il existe.

export const profil = {
  // Onglet du navigateur, aperçu des liens partagés et icône du site.
  site: {
    titre: "Prénom Nom | Développeur Fullstack",
    description: "Prénom Nom, développeur fullstack. Projets, compétences et contact.",
    favicon: "/exemple/favicon.svg",
  },
  prenom: "Prénom",
  nom: "Nom",
  initiales: "P.Nom",
  metier: "Développeur Fullstack",
  accroche: "Je conçois des applications web et mobiles, de l'interface au serveur.",
  formation: "3ᵉ année de Bachelor en informatique",
  recherche: "alternance de développeur fullstack", // « Je recherche une … »
  contrat: "Alternance",
  rythmeCourt: "3 / 1",
  rythmeLegende: "sem. entreprise / école",
  region: "Votre région",
  commune: "Votre ville",
  disponibilite: "Disponible dès maintenant",
  rythme: "3 semaines en entreprise / 1 semaine à l'école",
  ville: "Votre ville, votre région",
  presentation: "Quelques phrases pour vous présenter : ce que vous aimez construire et ce que vous recherchez.",
  photo: "/exemple/photo.svg",
  email: "vous@exemple.fr",
  linkedin: "https://www.linkedin.com/",
  github: "https://github.com/",
  // Bouton « Télécharger le CV » : mettez votre PDF dans public/cv/ et passez « afficher » à true.
  cv: { afficher: false, pdf: "/cv/mon-cv.pdf", image: "/cv/mon-cv.jpg", nomFichier: "CV_Prenom_Nom.pdf" },
  // Formulaire de contact : créez un formulaire gratuit sur formspree.io et collez son adresse ici.
  formulaire: "https://formspree.io/f/votre-identifiant",
} as const;

// Formation, de la plus récente à la plus ancienne.
export const formations = [
  {
    periode: "2026 – 2027",
    ecole: "Votre école",
    diplome: "Bachelor en informatique · 3ᵉ année",
    statut: "En cours",
    detail: "Ce que vous y apprenez.",
  },
  {
    periode: "2024 – 2026",
    ecole: "Votre école précédente",
    diplome: "Votre diplôme",
    statut: "2 ans",
    detail: "Ce que vous y avez appris.",
  },
  {
    periode: "2023",
    ecole: "Baccalauréat",
    diplome: "",
    statut: "Obtenu",
    detail: "",
  },
];

// Commandes qui s'écrivent dans le terminal de l'accueil.
export const commandes = ["npm run dev", "git commit -m \"nouveau projet\"", "docker compose up -d", "git push origin main"];

// Les trois points forts affichés en haut des compétences.
export const piliers = [
  { titre: "Conception d'API REST", detail: "Node.js, Swagger" },
  { titre: "Interfaces web", detail: "React, TypeScript, Tailwind" },
  { titre: "DevOps", detail: "Git, CI/CD, Docker" },
];
