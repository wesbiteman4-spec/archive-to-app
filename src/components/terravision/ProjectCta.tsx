import { ArrowUpRight } from "lucide-react";
import { getProjectHref, type ProjectDestination } from "@/config/projects";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ProjectCta({ project, className }: { project: ProjectDestination; className?: string }) {
  const href = getProjectHref(project);
  const tone = project.id === "imagined" ? "tv-cta-imagined" : "tv-cta-earth";

  if (!href) {
    return (
      <span
        className={cn("tv-cta", tone, "tv-cta-pending", className)}
        aria-disabled="true"
        title="The destination link has not been configured yet"
      >
        <span>{project.cta}</span>
        <span className="tv-cta-note">Link pending</span>
      </span>
    );
  }

  return (
    <Button asChild variant="exhibition" className={cn("tv-cta", tone, className)}>
      <a href={href} target="_blank" rel="noopener noreferrer">
        <span>{project.cta}</span>
        <ArrowUpRight className="tv-cta-arrow" aria-hidden />
      </a>
    </Button>
  );
}