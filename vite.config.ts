import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Le contenu du site (textes, projets, compétences) : src/contenu/ s'il existe (le vôtre, jamais publié sur GitHub),
// sinon src/contenu-exemple/ (l'exemple fourni avec le code).
const racine = (chemin: string) => fileURLToPath(new URL(chemin, import.meta.url));
const contenu = existsSync(racine("./src/contenu/profil.ts")) ? racine("./src/contenu") : racine("./src/contenu-exemple");

export default defineConfig(async () => {
  const { profil } = await import(pathToFileURL(`${contenu}/profil.ts`).href);
  const echapper = (t: string) => t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  return {
    resolve: { alias: { "@contenu": contenu } },
    plugins: [
      react(),
      tailwindcss(),
      {
        // Titre, description et icône de la page, pris dans le contenu.
        name: "page-depuis-contenu",
        transformIndexHtml: (html: string) =>
          html
            .replaceAll("%TITRE%", echapper(profil.site.titre))
            .replaceAll("%DESCRIPTION%", echapper(profil.site.description))
            .replaceAll("%FAVICON%", profil.site.favicon),
      },
    ],
  };
});
