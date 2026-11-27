import { createFileRoute } from "@tanstack/react-router";
import { Exhibition } from "@/components/terravision/Exhibition";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TERRAVISION-OS — Two Worlds. One Shared Vision." },
      { name: "description", content: "A cinematic exhibition connecting IMAGINED, the world of ideas, and EARTH//OS, the world of planetary understanding. Two independent projects. One future vision." },
      { property: "og:title", content: "TERRAVISION-OS — Two Worlds. One Shared Vision." },
      { property: "og:description", content: "Explore imagination and planetary understanding through a connected digital exhibition. TerraVisionOS is a proposed future vision, not a completed platform." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Exhibition,
});
