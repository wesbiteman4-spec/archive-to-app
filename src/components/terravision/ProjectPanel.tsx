import { PROJECTS, type ProjectId } from "@/config/projects";
import { sceneState } from "@/lib/scene-state";
import { ProjectCta } from "./ProjectCta";

export function ProjectPanel({ id }: { id: ProjectId }) {
  const project = PROJECTS[id];
  return (
    <div
      className={`tv-project-panel tv-project-${id}`}
      onPointerEnter={() => { sceneState.focus = id; }}
      onPointerLeave={() => { sceneState.focus = null; }}
      onFocus={() => { sceneState.focus = id; }}
      onBlur={() => { sceneState.focus = null; }}
      onPointerDown={() => { sceneState.focus = id; }}
    >
      <div className="tv-project-overline"><span className="tv-project-dot" />{id === "imagined" ? "01 — The world of ideas" : "02 — The world we share"}</div>
      <h2>{project.name}</h2>
      <p className="tv-project-tagline">{project.tagline}</p>
      <p className="tv-project-summary">{id === "imagined" ? "Explore what we can imagine, design and create." : "Explore what our planet needs, and how we can contribute."}</p>
      <ProjectCta project={project} />
    </div>
  );
}