import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { sceneState } from "@/lib/scene-state";

function createIridescentTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) return null;

  const spectrum = context.createLinearGradient(0, 0, canvas.width, 0);
  spectrum.addColorStop(0, "#aaa2c1");
  spectrum.addColorStop(0.42, "#d95c56");
  spectrum.addColorStop(0.58, "#f17d63");
  spectrum.addColorStop(0.68, "#e9b487");
  spectrum.addColorStop(0.76, "#f3dfad");
  spectrum.addColorStop(0.85, "#83c2d1");
  spectrum.addColorStop(0.94, "#72a8c4");
  spectrum.addColorStop(1, "#aaa2c1");
  context.fillStyle = spectrum;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const sheen = context.createRadialGradient(740, 150, 8, 740, 150, 370);
  sheen.addColorStop(0, "rgba(255,255,255,0.62)");
  sheen.addColorStop(0.32, "rgba(255,255,255,0.16)");
  sheen.addColorStop(1, "rgba(255,255,255,0)");
  context.globalCompositeOperation = "screen";
  context.fillStyle = sheen;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const shade = context.createLinearGradient(0, 0, 0, canvas.height);
  shade.addColorStop(0, "rgba(255,255,255,0.16)");
  shade.addColorStop(0.48, "rgba(255,255,255,0)");
  shade.addColorStop(1, "rgba(35,44,70,0.22)");
  context.globalCompositeOperation = "source-over";
  context.fillStyle = shade;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.anisotropy = 8;
  return texture;
}

function createSphereGeometry(detail: number) {
  const geometry = new THREE.IcosahedronGeometry(1.35, detail);
  const position = geometry.attributes["position"];
  if (!position) return geometry;
  const point = new THREE.Vector3();
  for (let index = 0; index < position.count; index += 1) {
    point.fromBufferAttribute(position, index);
    const direction = point.clone().normalize();
    const wave = Math.sin(direction.x * 3.8 + direction.y * 2.1)
      * Math.sin(direction.y * 3.2 + direction.z * 2.4)
      * Math.sin(direction.z * 3.6 + direction.x * 1.7);
    point.multiplyScalar(1 + wave * 0.009);
    position.setXYZ(index, point.x, point.y, point.z);
  }
  geometry.computeVertexNormals();
  return geometry;
}

/** Signature translucent sphere; travels through the story and returns for the connection finale. */
export function IridescentSphere({ lite }: { lite: boolean }) {
  const root = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshPhysicalMaterial>(null);
  const elapsed = useRef(0);
  const hover = useRef(0);
  const appear = useRef(0);
  const geometry = useMemo(() => createSphereGeometry(lite ? 24 : 40), [lite]);
  const texture = useMemo(() => createIridescentTexture(), []);

  useEffect(() => () => {
    geometry.dispose();
    texture?.dispose();
  }, [geometry, texture]);

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
    if (material.current) material.current.clearcoat = 0.82 + hover.current * 0.18;
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
    <mesh ref={shell}>
      <primitive object={geometry} attach="geometry" />
      <meshPhysicalMaterial
        ref={material}
        map={texture}
        color="#fff8f1"
        roughness={0.24}
        metalness={0.08}
        clearcoat={0.9}
        clearcoatRoughness={0.16}
        iridescence={0.9}
        iridescenceIOR={1.3}
        iridescenceThicknessRange={[120, 620]}
        transmission={0.08}
        thickness={0.6}
      />
    </mesh>
  </group>;
}
