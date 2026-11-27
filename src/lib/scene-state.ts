import type { ProjectId } from "@/config/projects";

/** Per-frame scene inputs, mutated outside React so the 3D scene never re-renders on scroll. */
export const sceneState = {
  scroll: 0,
  pointerX: 0,
  pointerY: 0,
  focus: null as ProjectId | null,
  reducedMotion: false,
  activeSection: "top",
};