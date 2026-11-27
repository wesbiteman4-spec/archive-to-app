import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { sceneState } from "@/lib/scene-state";
import { IridescentSphere } from "./IridescentSphere";
import { cameraTarget, sectionProgress } from "@/lib/scene-motion";
import { IdeaStructure } from "./IdeaStructure";
import { Planet } from "./Planet";

function CameraRig() {
  const { camera, scene, gl } = useThree();
  useFrame((_, delta) => {
    const p = sceneState.scroll;
    const target = cameraTarget(sceneState.pointerX, sceneState.pointerY, p, sceneState.reducedMotion);
    const k = 1 - Math.exp(-6 * Math.min(delta, 0.15));
    camera.position.x += (target.x - camera.position.x) * k;
    camera.position.y += (target.y - camera.position.y) * k;
    camera.position.z += (target.z - camera.position.z) * k;
    camera.lookAt(0, 0, 0);
    if (import.meta.env.DEV) {
      gl.domElement.dataset['cameraX'] = camera.position.x.toFixed(3);
      gl.domElement.dataset['cameraZ'] = camera.position.z.toFixed(3);
      gl.domElement.dataset['sculptureAngle'] = String(scene.getObjectByName('connection-sculpture')?.userData['angle'] ?? 0);
      gl.domElement.dataset['activeSection'] = sceneState.activeSection;
    }
  });
  return null;
}

function AccentLight() {
  const light = useRef<THREE.PointLight>(null);
  const colors = useMemo(
    () => ({
      none: new THREE.Color("#8eebff"),
      imagined: new THREE.Color("#c5a8ff"),
      earth: new THREE.Color("#9bbe83"),
    }),
    [],
  );
  useFrame((_, delta) => {
    if (!light.current) return;
    const target = colors[sceneState.focus ?? "none"];
    light.current.color.lerp(target, 1 - Math.exp(-4 * Math.min(delta, 0.05)));
    const x = sceneState.focus === "imagined" ? -3 : sceneState.focus === "earth" ? 3 : sceneState.pointerX * 2;
    light.current.position.x += (x - light.current.position.x) * 0.05;
  });
  return <pointLight ref={light} position={[0, 1.5, 3.5]} intensity={18} distance={12} />;
}

export default function SceneCanvas({ lite }: { lite: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-scene-range]"));
      const y = window.innerHeight * 0.35;
      let next = 0;
      for (const node of nodes) {
        const top = node.getBoundingClientRect().top;
        if (y < top) continue;
        const range = node.dataset["sceneRange"]?.split(",").map(Number);
        const from = range?.[0] ?? 0, to = range?.[1] ?? from;
        next = sectionProgress(top,node.offsetHeight,window.innerHeight,from,to);
        sceneState.activeSection = node.id;
      }
      sceneState.scroll = next;
      const stage = wrap.current?.parentElement;
      if (stage && window.innerWidth <= 768) {
        const slots = Array.from(document.querySelectorAll<HTMLElement>('[data-visual]'));
        const slot = slots.find(el => { const r=el.getBoundingClientRect(); return r.bottom>70 && r.top<window.innerHeight; });
        if (slot) {
          const r = slot.getBoundingClientRect();
          sceneState.activeSection = slot.dataset['visual'] ?? 'top';
          stage.style.top = `${r.top}px`;
          stage.style.height = `${r.height}px`;
          stage.style.opacity = '1';
        } else stage.style.opacity = '0';
      } else if (stage) {
        stage.style.removeProperty('top'); stage.style.removeProperty('height'); stage.style.opacity = '1';
      }
    };
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    const onMove = (e: PointerEvent) => {
      sceneState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      sceneState.pointerY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onTouch = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      sceneState.pointerX = touch.clientX / window.innerWidth * 2 - 1;
      sceneState.pointerY = 1 - touch.clientY / window.innerHeight * 2;
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchmove", onTouch);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={wrap} className="tv-canvas" aria-hidden>
      <Canvas
        dpr={lite ? [1, 1.25] : [1, 1.75]}
        camera={{ position: [0, 0, 8.4], fov: 38 }}
        gl={{ antialias: !lite, alpha: true, powerPreference: "high-performance" }}
        onCreated={() => wrap.current?.setAttribute("data-scene-ready", "true")}
      >
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 5, 3]} intensity={2.6} color="#f5f6f2" />
        <directionalLight position={[-5, -2, -3]} intensity={0.8} color="#d8c49a" />
        <AccentLight />
        <Environment resolution={lite ? 64 : 256}>
          <Lightformer intensity={4} position={[0, 5, -2]} scale={[10, 2, 1]} color="#dde3e8" />
          <Lightformer intensity={1.4} position={[-5, 0, 1]} rotation-y={Math.PI / 2} scale={[12, 1, 1]} color="#8eebff" />
          <Lightformer intensity={1.1} position={[5, -1, 1]} rotation-y={-Math.PI / 2} scale={[12, 1, 1]} color="#d8c49a" />
          <Lightformer form="ring" intensity={1.5} position={[0, 0, 6]} scale={3} color="#ffffff" />
        </Environment>
        <CameraRig />
        <IridescentSphere lite={lite} />
        <IdeaStructure />
        <Planet lite={lite} />
      </Canvas>
    </div>
  );
}