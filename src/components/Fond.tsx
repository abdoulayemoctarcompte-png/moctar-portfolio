import { useEffect, useRef } from "react";

/**
 * Fond du site : taches de couleur, quadrillage, et lueur qui suit la souris (ou le doigt sur téléphone).
 * Optimisé pour rester fluide :
 * - les taches sont des dégradés (pas de filtre de flou, très coûteux), animées seulement par « transform » ;
 * - la lueur est mise à jour au plus une fois par image, sans redessiner React.
 */
export function Fond() {
  const lueur = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = lueur.current;
    if (!el) return;
    let image = 0;
    let x = 0;
    let y = 0;
    const appliquer = () => {
      image = 0;
      el.style.setProperty("--x", `${x}px`);
      el.style.setProperty("--y", `${y}px`);
      el.style.opacity = "1";
    };
    const placer = (cx: number, cy: number) => {
      x = cx;
      y = cy;
      if (!image) image = requestAnimationFrame(appliquer);
    };
    const souris = (e: PointerEvent) => e.pointerType !== "touch" && placer(e.clientX, e.clientY);
    const doigt = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) placer(t.clientX, t.clientY);
    };
    // Pendant le défilement, les taches s'arrêtent (invisible à l'œil, elles bougent très lentement) :
    // le navigateur garde toute sa puissance pour faire défiler la page.
    const racine = document.documentElement;
    let pause: ReturnType<typeof setTimeout> | undefined;
    const defile = () => {
      racine.classList.add("defile");
      clearTimeout(pause);
      pause = setTimeout(() => racine.classList.remove("defile"), 250);
    };
    window.addEventListener("scroll", defile, { passive: true });
    window.addEventListener("pointermove", souris, { passive: true });
    window.addEventListener("touchstart", doigt, { passive: true });
    window.addEventListener("touchmove", doigt, { passive: true });
    return () => {
      cancelAnimationFrame(image);
      clearTimeout(pause);
      window.removeEventListener("scroll", defile);
      window.removeEventListener("pointermove", souris);
      window.removeEventListener("touchstart", doigt);
      window.removeEventListener("touchmove", doigt);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="tache absolute -top-72 -left-72 size-[56rem] animate-aurore [--c:rgb(34_211_238/0.30)] dark:[--c:rgb(6_182_212/0.24)]" />
      <div className="tache absolute top-[10%] -right-72 size-[52rem] animate-aurore [--c:rgb(139_92_246/0.28)] [animation-delay:-6s] dark:[--c:rgb(124_58_237/0.30)]" />
      <div className="tache absolute -bottom-72 left-[15%] size-[48rem] animate-aurore [--c:rgb(56_189_248/0.22)] [animation-delay:-12s]" />
      <div className="quadrillage absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div ref={lueur} className="absolute inset-0 opacity-0 transition-opacity duration-500">
        <div className="lueur-douce absolute inset-0" />
        <div className="lueur-grille absolute inset-0" />
      </div>
    </div>
  );
}
