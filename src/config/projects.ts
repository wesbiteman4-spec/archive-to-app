export type ProjectId = "imagined" | "earth";

export interface ProjectDestination {
  id: ProjectId;
  name: string;
  tagline: string;
  description: string;
  cta: string;
  /** Replace null with the project's real public URL. Never use an invented address. */
  url: string | null;
}

export const PROJECTS: Record<ProjectId, ProjectDestination> = {
  imagined: {
    id: "imagined",
    name: "IMAGINED",
    tagline: "From an idea to understanding.",
    description:
      "An idea-exploration experience that transforms written ideas into visual journeys — exploring components, materials, mechanisms and processes through interactive 3D storytelling.",
    cta: "Explore IMAGINED",
    url: "https://tanstack-start-ts.imagined-workshop.workers.dev",
  },
  earth: {
    id: "earth",
    name: "EARTH//OS",
    tagline: "Understand the planet. Reimagine its future.",
    description:
      "A sustainability intelligence concept centred on the UN Sustainable Development Goals — exploring interconnected global challenges, possible solutions and their impact.",
    cta: "Explore EARTH//OS",
    url: "https://earth-os-jryge7.freebuff.site/",
  },
};

/** Returns a safe external destination, or null while the real URL is not configured. */
export function getProjectHref(project: ProjectDestination): string | null {
  if (!project.url) return null;
  try {
    const parsed = new URL(project.url);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.href : null;
  } catch {
    return null;
  }
}