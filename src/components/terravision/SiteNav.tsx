import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const LINKS = [
  { id: "imagined", label: "IMAGINED" },
  { id: "earth", label: "EARTH//OS" },
  { id: "connection", label: "The Connection" },
  { id: "vision", label: "Future Vision" },
  { id: "explore", label: "Explore" },
];

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  const go = (id: string) => { setOpen(false); scrollToSection(id); };

  return (
    <>
      <header className="tv-nav-wrap">
        <nav className="tv-nav" aria-label="Main">
          <button className="tv-mark" onClick={() => go("top")}>TerraVision<span>—OS</span></button>
          <div className="tv-nav-right">
            <button className="tv-nav-mini" onClick={() => go("the-connection")}>About</button>
            <button className="tv-nav-mini" onClick={() => go("explore")}>Projects</button>
          </div>
        </nav>
      </header>
      <button className="tv-menu-fab" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen((v) => !v)}>
        <span className="tv-menu-lines" data-open={open} aria-hidden><i /><i /></span>{open ? "Close" : "Menu"}
      </button>
      <span className="tv-scroll-meter" aria-hidden><span style={{ transform: `scaleY(${progress})` }} /></span>
      {open && (
        <div id="site-menu" className="tv-menu-panel">
          {LINKS.map((l, i) => (
            <Button key={l.id} variant="mobile" style={{ animationDelay: `${i * 45}ms` }} onClick={() => go(l.id)}>
              <span className="tv-index">0{i + 1}</span>{l.label}
            </Button>
          ))}
        </div>
      )}
    </>
  );
}
