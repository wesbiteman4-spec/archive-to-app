import { describe, expect, it } from "vitest";
import { getProjectHref, PROJECTS } from "./projects";

describe("project destinations", () => {
  it("uses the user's confirmed IMAGINED .dev destination", () => {
    expect(getProjectHref(PROJECTS.imagined)).toBe("https://tanstack-start-ts.imagined-workshop.workers.dev/");
  });
  it("uses the user's EARTH//OS destination", () => {
    expect(getProjectHref(PROJECTS.earth)).toBe("https://earth-os-jryge7.freebuff.site/");
  });
  it("does not invent a link when a project URL is not configured", () => {
    expect(getProjectHref({ ...PROJECTS.imagined, url: null })).toBeNull();
  });

  it("uses a configured real web address", () => {
    expect(getProjectHref({ ...PROJECTS.earth, url: "https://example.org/earth" })).toBe(
      "https://example.org/earth",
    );
  });

  it("rejects unsafe destinations", () => {
    expect(getProjectHref({ ...PROJECTS.earth, url: "javascript:alert(1)" })).toBeNull();
  });
});