export function cameraTarget(x: number, y: number, progress: number, reduced: boolean) {
  const close = Math.sin(Math.min(1, Math.max(0, (progress - 0.06) / 0.18)) * Math.PI);
  return { x: reduced ? 0 : x * 1.65, y: reduced ? 0 : y * 0.9, z: 8.4 - (reduced ? 0 : close * 1.5) };
}

export function sectionProgress(top: number, height: number, viewport: number, from: number, to: number) {
  const fraction = Math.min(1, Math.max(0, (viewport * 0.35 - top) / Math.max(1, height)));
  return from + (to - from) * fraction;
}