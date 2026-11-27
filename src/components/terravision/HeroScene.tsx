import { ClientOnly } from "@tanstack/react-router";
import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { sceneState } from "@/lib/scene-state";
import { StaticConnection } from "./StaticConnection";

const SceneCanvas = lazy(() => import("./SceneCanvas"));

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  override render() { return this.state.failed ? <StaticConnection /> : this.props.children; }
}

function BrowserScene() {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [lite, setLite] = useState(true);
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    setSupported(Boolean(gl));
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    setLite(window.innerWidth < 768);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { sceneState.reducedMotion = mq.matches; };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!supported) return <StaticConnection />;
  return <SceneBoundary><Suspense fallback={<StaticConnection />}><SceneCanvas lite={lite} /></Suspense></SceneBoundary>;
}

export function HeroScene() {
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const positionFallback = () => {
      if (!stage.current || stage.current.querySelector('canvas') || window.innerWidth > 768) return;
      const slots = Array.from(document.querySelectorAll<HTMLElement>('[data-visual]'));
      const slot = slots.find(el => { const r=el.getBoundingClientRect(); return r.bottom>70 && r.top<window.innerHeight; });
      if (!slot) { stage.current.style.opacity = '0'; return; }
      const r=slot.getBoundingClientRect();
      stage.current.style.top = `${r.top}px`;
      stage.current.style.height = `${r.height}px`;
      stage.current.style.opacity = '1';
    };
    positionFallback();
    window.addEventListener('scroll',positionFallback,{passive:true});
    window.addEventListener('resize',positionFallback,{passive:true});
    return () => { window.removeEventListener('scroll',positionFallback); window.removeEventListener('resize',positionFallback); };
  }, []);
  return (
    <div ref={stage} className="tv-scene-stage">
      <ClientOnly fallback={<StaticConnection />}><BrowserScene /></ClientOnly>
    </div>
  );
}