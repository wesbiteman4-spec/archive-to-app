import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { sceneState } from "@/lib/scene-state";

const ease = (x: number) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
};

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function noise(x: number, y: number) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy), b = hash(ix + 1, iy), c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x: number, y: number) {
  let v = 0, a = 0.5;
  for (let i = 0; i < 5; i++) {
    v += noise(x, y) * a;
    x *= 2.03; y *= 2.03; a *= 0.5;
  }
  return v;
}

function makeTextures(size: number) {
  const w = size, h = size / 2;
  const land = document.createElement("canvas");
  const cloud = document.createElement("canvas");
  land.width = cloud.width = w;
  land.height = cloud.height = h;
  const lg = land.getContext("2d"), cg = cloud.getContext("2d");
  if (!lg || !cg) return { landTex: new THREE.Texture(), cloudTex: new THREE.Texture() };
  const li = lg.createImageData(w, h), ci = cg.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const nx = (x / w) * 8, ny = (y / h) * 4;
      const e = fbm(nx, ny) + (1 - Math.abs(y / h - 0.5) * 2) * 0.08;
      const i = (y * w + x) * 4;
      const lat = Math.abs(y / h - 0.5) * 2;
      if (lat > 0.88) li.data.set([205, 215, 210, 255], i);
      else if (e > 0.53) {
        const m = fbm(nx * 2 + 9, ny * 2);
        li.data.set([60 + m * 70, 88 + m * 55, 62 + m * 25, 255], i);
      } else li.data.set([8 + e * 12, 20 + e * 25, 31 + e * 40, 255], i);
      const c = fbm(nx * 3.2 + 30 + Math.sin(ny*3)*0.45, ny * 5.4);
      ci.data.set([245, 246, 242, Math.max(0, c - 0.53) * 520], i);
    }
  }
  lg.putImageData(li, 0, 0);
  cg.putImageData(ci, 0, 0);
  const landTex = new THREE.CanvasTexture(land);
  const cloudTex = new THREE.CanvasTexture(cloud);
  landTex.colorSpace = cloudTex.colorSpace = THREE.SRGBColorSpace;
  return { landTex, cloudTex };
}

const atmosphereShader = {
  vertexShader: `varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
  fragmentShader: `varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1. - abs(dot(vN, vV)), 3.); gl_FragColor = vec4(vec3(0.56,0.92,1.0) * f * 1.3, f); }`,
};

export function Planet({ lite }: { lite: boolean }) {
  const root = useRef<THREE.Group>(null);
  const globe = useRef<THREE.Mesh>(null);
  const clouds = useRef<THREE.Mesh>(null);
  const network = useRef<THREE.Group>(null);
  const textures = useMemo(() => makeTextures(lite ? 512 : 1024), [lite]);
  useEffect(() => () => { textures.landTex.dispose(); textures.cloudTex.dispose(); }, [textures]);
  const arcs = useMemo(() => {
    return Array.from({ length: 9 }, (_, i) => {
      const a1 = i * 0.7, a2 = a1 + 1.1 + (i % 3) * 0.35;
      const lat1 = Math.sin(i * 1.7) * 0.8, lat2 = Math.cos(i * 1.3) * 0.7;
      const p = (a: number, lat: number) => new THREE.Vector3(Math.cos(a) * Math.cos(lat), Math.sin(lat), Math.sin(a) * Math.cos(lat)).multiplyScalar(1.62);
      const s = p(a1, lat1), e = p(a2, lat2);
      const mid = s.clone().add(e).normalize().multiplyScalar(2.15);
      return new THREE.QuadraticBezierCurve3(s, mid, e).getPoints(40);
    });
  }, []);

  useFrame((_, rawDelta) => {
    const delta = rawDelta;
    const p = sceneState.scroll;
    const mobile = window.innerWidth <= 768;
    const vis = mobile ? (sceneState.activeSection === 'earth' ? 1 : 0) : ease((p - 0.4) / 0.08) * (1 - ease((p - 0.64) / 0.08));
    const connect = 0.45 + ease((p - 0.5) / 0.09)*0.55;
    if (!root.current) return;
    root.current.visible = vis > 0.01;
    root.current.scale.setScalar(Math.max(0.001, (0.75 + vis * 0.25) * (mobile ? 1.05 : 0.85)));
    root.current.position.y = mobile ? 0 : (1 - vis) * -3;
    root.current.position.x = window.innerWidth > 768 ? -1.75 : 0;
    const m = sceneState.reducedMotion ? 0 : 1;
    if (globe.current) globe.current.rotation.y += delta * 0.12 * m;
    if (clouds.current) clouds.current.rotation.y += delta * 0.16 * m;
    if (network.current) {
      network.current.rotation.y = globe.current?.rotation.y ?? 0;
      network.current.scale.setScalar(Math.max(0.001, connect));
    }
  });

  return (
    <group ref={root} rotation={[0.25, 0, -0.18]}>
      <mesh ref={globe}>
        <sphereGeometry args={[1.6, lite ? 48 : 96, lite ? 32 : 64]} />
        <meshStandardMaterial map={textures.landTex} bumpMap={textures.landTex} bumpScale={0.025} roughness={0.72} metalness={0.08} />
      </mesh>
      <mesh ref={clouds} scale={1.018}>
        <sphereGeometry args={[1.6, 64, 48]} />
        <meshStandardMaterial map={textures.cloudTex} transparent depthWrite={false} opacity={0.7} />
      </mesh>
      <mesh scale={1.14}>
        <sphereGeometry args={[1.6, 64, 48]} />
        <shaderMaterial args={[atmosphereShader]} transparent blending={THREE.AdditiveBlending} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      <group ref={network}>
        {arcs.map((points, i) => (
          <lineSegments key={i}>
            <bufferGeometry attach="geometry" onUpdate={(g) => g.setFromPoints(points)} />
            <lineBasicMaterial attach="material" color={i % 2 ? "#9bbe83" : "#8eebff"} transparent opacity={0.65} />
          </lineSegments>
        ))}
      </group>
      {[2.25, 2.7].map((r, i) => (
        <mesh key={r} rotation={[Math.PI / 2 + i * 0.32, i * 0.25, 0]}>
          <torusGeometry args={[r, 0.004, 6, 220]} />
          <meshBasicMaterial color={i ? "#d8c49a" : "#9bbe83"} transparent opacity={0.35} />
        </mesh>
      ))}
    </group>
  );
}