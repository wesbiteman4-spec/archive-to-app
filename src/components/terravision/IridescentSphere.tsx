import { useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import earthAsset from "@/assets/earth.glb.asset.json";
import * as THREE from "three";
import { sceneState } from "@/lib/scene-state";

const EARTH_RADIUS = 1.35;

/** Earth model; the GLB uses legacy spec-gloss materials, so rebuild a standard material from its texture. */
function EarthModel() {
  const gltf = useGLTF(earthAsset.url);
  const [map, setMap] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let alive = true;
    gltf.parser.getDependency("texture", 0).then((t: THREE.Texture) => {
      if (!alive) return;
      t.colorSpace = THREE.SRGBColorSpace;
      setMap(t);
    }).catch(() => {});
    return () => { alive = false; };
  }, [gltf]);
  const scene = useMemo(() => {
    const clone = gltf.scene.clone(true);
    // Sketchfab export bakes a x100 scale; normalize to a unit-radius globe centered at the origin.
    const sphere = new THREE.Box3().setFromObject(clone).getBoundingSphere(new THREE.Sphere());
    const wrap = new THREE.Group();
    clone.position.sub(sphere.center);
    wrap.add(clone);
    wrap.scale.setScalar(1 / (sphere.radius / Math.sqrt(3) || 1));
    return wrap;
  }, [gltf]);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.75, metalness: 0.05 }), []);
  useEffect(() => {
    material.map = map;
    material.color.set(map ? "#ffffff" : "#6f8fa8");
    material.needsUpdate = true;
  }, [map, material]);
  useEffect(() => {
    scene.traverse((o) => { if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).material = material; });
    return () => material.dispose();
  }, [scene, material]);
  return <group scale={EARTH_RADIUS}><primitive object={scene} /></group>;
}

/** Signature translucent sphere; travels through the story and returns for the connection finale. */
export function IridescentSphere(_props: { lite: boolean }) {
  const root = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  const hover = useRef(0);
  const appear = useRef(0);

  useFrame((_, raw) => {
    const delta = Math.min(raw, 0.1);
    elapsed.current += delta;
    const t = elapsed.current, p = sceneState.scroll, reduced = sceneState.reducedMotion;
    if (!root.current || !shell.current) return;
    const mobile = window.innerWidth <= 768;
    const final = sceneState.activeSection === "explore";
    root.current.visible = mobile ? sceneState.activeSection === "top" || final : p < 0.23 || p > 0.91;
    appear.current = Math.min(1, appear.current + delta * (reduced ? 10 : 0.6));
    const a = 1 - Math.pow(1 - appear.current, 3);
    hover.current += ((sceneState.focus ? 1 : 0) - hover.current) * (1 - Math.exp(-4 * delta));
    const depth = final ? 0 : Math.min(1, p / 0.2);
    const base = mobile ? 1.15 : Math.min(1, window.innerWidth / window.innerHeight / 1.5) * 1.3;
    root.current.scale.setScalar(base * (0.82 + a * 0.18) * (1 + hover.current * 0.018) * (1 - depth * 0.35));
    root.current.position.z = -depth * 2.5;
    root.current.position.y = (final && !mobile ? -0.9 : 0) + (reduced ? 0 : Math.sin(t * 0.9) * 0.08);
    const k = 1 - Math.exp(-3 * delta);
    root.current.position.x += ((reduced ? 0 : sceneState.pointerX * 0.18) - root.current.position.x) * k;
    shell.current.rotation.y = reduced ? 0.4 : t * 0.12 + p * 3;
    shell.current.rotation.x += ((reduced ? 0 : -sceneState.pointerY * 0.25) - shell.current.rotation.x) * k;
    root.current.userData["angle"] = shell.current.rotation.y;
  });

  return <group ref={root} name="connection-sculpture">
    <group ref={shell}>
      <Suspense fallback={null}><EarthModel /></Suspense>
    </group>
  </group>;
}

useGLTF.preload(earthAsset.url);
