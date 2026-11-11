# Portfolio développeur — React, TypeScript, Tailwind

Code source de mon portfolio de développeur fullstack.

Ce dépôt contient **le code** et **un contenu d'exemple**. Mes textes, photos, logos et captures de projets ne sont pas publiés ici. Vous pouvez donc réutiliser ce code pour votre propre portfolio en remplaçant le contenu d'exemple par le vôtre.

## Ce que fait le site

- Accueil avec photo, accroche, terminal qui écrit des commandes et chiffres clés
- Compétences par domaine (un onglet par domaine), avec une bande d'icônes qui défile, classées par niveau (Maîtrise, Pratique, Notions)
- Aperçu et téléchargement du CV (bouton à l'accueil et carte dans la partie contact)
- Projets filtrables (scolaires / personnels), avec une galerie d'images et de vidéos pour chaque projet (flèches, clavier, glissement du doigt)
- Formation sous forme de frise
- Méthodes de travail (agile : Scrum et Kanban ; objectifs SMART)
- Formulaire de contact (Formspree, gratuit)
- Mode clair et mode sombre, menu adapté au téléphone
- Fond animé léger : la lueur suit la souris (ou le doigt), sans ralentir le défilement

## Technologies

React 19 · TypeScript · Vite · Tailwind CSS 4 · Motion · Lucide

## Lancer le projet

```bash
npm install
npm run dev      # site en local
npm run build    # version à mettre en ligne, dans dist/
```

## Mettre votre propre contenu

1. Copiez `src/contenu-exemple/` en `src/contenu/`.
   Le site utilise automatiquement `src/contenu/` s'il existe, et ce dossier est ignoré par git : votre contenu ne part pas sur GitHub.
2. Dans `src/contenu/` :
   - `profil.ts` : nom, accroche, liens, formation, adresse du formulaire de contact ;
   - `competences.ts` : compétences et niveaux, outils, qualités, méthodes ;
   - `projets.ts` : projets, textes et images.
3. Vos images vont dans `public/media/<projet>/` (1.webp, 2.webp…, demo.mp4), vos icônes dans `public/icones/` et votre CV dans `public/cv/`. Ces dossiers sont eux aussi ignorés par git.

## Structure

```
src/
├── Portfolio.tsx         la page (en-tête, accueil, compétences, projets, formation, méthodes, contact)
├── modele.ts             types et fonctions communs au contenu et aux composants
├── components/           fenêtre de projet, formulaire, fond animé, éléments communs
├── contenu-exemple/      contenu d'exemple (publié)
└── contenu/              votre contenu (non publié, à créer)
public/exemple/           images d'exemple
```

## Mise en ligne

Le dossier `dist/` produit par `npm run build` est un site statique. Il peut être hébergé gratuitement, par exemple sur Cloudflare Pages.
