---
name: brand-icon-design
description: "Research, design, preview, and integrate original brand icons or favicons. Use when creating or updating a business logo, app icon, website mark, or favicon and the user wants to review a concept before it replaces the current design."
---

# Brand Icon Design

## When to Use

- Create an original icon or favicon for a business, product, or website.
- Refresh an existing brand mark while preserving the surrounding visual identity.
- Show a design preview for approval before changing the live interface.

## Workflow

1. Inspect the existing logo, site colors, typography, asset paths, and responsive treatments. Preserve unrelated work in the working tree.
2. If market research is requested, define the sample honestly. A representative sample is not a ranked top list unless the ranking and sources have been verified. Extract broad design patterns, not individual logos to imitate.
3. Develop a distinctive concept around the user's brand and produce a scalable vector asset. Favor a clear silhouette, restrained palette, and details that remain recognizable at small sizes.
4. Save the concept as a standalone preview. Do not replace the existing favicon or in-product logo until the user approves the concept.
5. After approval, move or save the approved asset as a production file. Update all relevant uses consistently, including the header/footer mark and favicon when present. Keep accessible names on the containing brand link; decorative image elements should have empty alt text.
6. Verify the asset and references: run available diagnostics, check the diff, and view the result in the browser at desktop and mobile sizes. Confirm the icon asset loads and is not clipped or distorted.
7. Summarize what changed and identify anything intentionally left untouched. Do not commit or publish unless asked.

## Design and Implementation Notes

- Use the project's established color palette unless the user asks for a color refresh; explain and preview a proposed refresh before applying it.
- Keep the main symbol centered with adequate breathing room for rounded, circular, and platform-masked icon shapes.
- Use relative asset URLs for static sites so the icon works both locally and when hosted under a repository subpath.
- Avoid copying recognizable competitor marks, compositions, or distinctive brand treatments.
- Prefer a self-contained SVG for crisp scaling when the project's browsers and hosting support it.
