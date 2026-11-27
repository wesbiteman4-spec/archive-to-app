import { describe, expect, it } from "vitest";
import { cameraTarget, sectionProgress } from "./scene-motion";

describe("scene motion", () => {
  it("moves the camera to opposite sides for opposite pointer positions", () => {
    expect(cameraTarget(-1, 0, 0, false).x).toBe(-1.65);
    expect(cameraTarget(1, 0, 0, false).x).toBe(1.65);
  });
  it("keeps the camera still with reduced motion", () => {
    expect(cameraTarget(1, 1, 0.15, true)).toEqual({ x: 0, y: 0, z: 8.4 });
  });
  it("advances the scene with the section scroll", () => {
    expect(sectionProgress(280, 800, 800, 0.24, 0.42)).toBe(0.24);
    expect(sectionProgress(-520, 800, 800, 0.24, 0.42)).toBe(0.42);
  });
});