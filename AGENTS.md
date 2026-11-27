<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Exhibition architecture
- Keep the exhibition as one scrolling index route because the brief explicitly requests section-based navigation and continuous storytelling.
- Isolate R3F imports in lazy-loaded scene modules behind ClientOnly so text remains server-rendered and WebGL failures retain a static fallback.
- Use one shared fixed 3D stage; on mobile align its rectangle to visible section media slots so scenes travel with content without spacer screens or extra canvases.
- Keep external project destinations in the central project configuration and show a truthful pending state for absent URLs, never a fabricated destination.
- Use GSAP for interface choreography, native scrolling for navigation, and refs for frame animation to avoid conflicting motion systems and per-frame React renders.
- Use the intertwined connection sculpture, with frame-delta animation and explicit mouse/touch camera inputs; expose dev-only canvas motion attributes for verification.
