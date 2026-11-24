---
title: "Geometry Website UI Overhaul: IDE Implementation Brief"
version: "1.0"
companion_file: "geometry-website-content-pack.md"
scope: "Shared application layout, responsive navigation, content rendering, and all 15 module designs"
evidence: "Five supplied screenshots; mobile-navigation behavior additionally described by the user"
---

# Geometry Website UI Overhaul

## Paste this task into the IDE assistant

> Implement the redesign described in this file across the existing geometry website. Read `geometry-website-content-pack.md` for the mathematical content and stable module/lesson IDs. First inspect the existing app, the imported Hallmark integration, styles, content parser, math renderer, navigation, and diagram components. Fix the shared layout and content-rendering defects, then redesign each of the 15 modules using the module-specific requirements below. Preserve mathematical correctness, routes, lesson IDs, existing useful functionality, and progress data. On mobile and tablet, replace the permanent module menu with labeled module and lesson dropdown selections. Complete the implementation and responsive verification across all modules; do not stop after a sample module or a CSS-only proposal. Use the existing project tooling and dependencies where practical. Report the changes and the checks actually performed.

This file specifies the implementation work. It does not claim access to the app source code, a running site, or Hallmark's actual API. Root-cause explanations below are hypotheses to verify in the IDE, while the visible defects are directly grounded in the screenshots.

## 1. Intended result

Create a clear, restrained learning interface with readable explanations, correct mathematical layout, useful diagrams, and consistent navigation. Retain the recognizable Fieldnotes identity and make the existing Hallmark integration work within the new layout. The warm dark palette and editorial character can remain; their current execution needs a substantial revision.

Use a shared foundation for typography, spacing, navigation, worked examples, and controls. Within that foundation, give each module a teaching layout suited to its mathematics. A classification lesson needs illustrated comparisons; a coordinate lesson needs a graph; a solid-mensuration lesson needs a section or net. Repeating the same large title, one slider, and one generic figure in every lesson does not satisfy this brief.

Preserve the full educational content through a combination of concise visible explanations, examples, reference sections, and appropriate disclosure. Do not resolve crowded layouts by deleting definitions, shortening away conditions, removing formulas, hiding answers permanently, or dropping lessons.

## 2. Screenshot audit

The five supplied images are references for defects, not visual designs to reproduce. Use the descriptions if the screenshot files are not in the repository.

| Reference | Visible evidence | Required response |
|---|---|---|
| `image(20261124-174350).png` — polygon definitions | Narrow newspaper-style text columns; stretched word spacing; frequent hyphenation; a definition table continues into the other column; polygon names and numbers visually run together | Remove multi-column flow from lesson bodies. Present definitions as a glossary/list or deliberately structured comparison. Build a properly spaced polygon-name reference. |
| `image(20261124-174404).png` — triangle classification | Heavy heading competes with dense body text; table headers read as one phrase; classifications lack visual examples; convention note consumes most of a second column | Use illustrated classification groups, a short introductory explanation, and a compact convention note. Give headings and table cells proper separation. |
| `image(20261124-174420).png` — rectangle/square comparison | “Shape / Perimeter / Area / Diagonal” cells crowd together; mathematical expressions have insufficient width; the square row appears across the column divide; learning outcomes resemble loose paragraphs | Rebuild the comparison as a genuine wide table on desktop and labeled shape summaries on narrow screens. Show outcomes as a compact, coherent list. |
| `image(20261124-174431).png` — rhombus formulas | A chained display equation runs into the neighboring explanation; symbols overlap; a vertical divider passes through the cramped composition | Split formula groups into separate mathematical statements with full-width room and adjacent symbol definitions. Remove the forced prose-column divider. |
| `image(20261124-174512).png` — whole lesson | Sidebar is roughly 480 px wide in this 1910 px image; menu and document have separate visible scrollbar tracks; header and lesson spacing is loose; diagram is far below the slider with much unused space; instructions sit off to the side | Use a compact navigation rail, one main page scroll, a consistent page grid, a smaller title block, and a bounded diagram/control composition. Put instructions next to the actual control. |
| User-reported mobile behavior | The desktop menu becomes a long, non-collapsible menu on mobile | Replace the menu with dropdown navigation at narrow widths. This behavior is user-reported; the supplied full-page screenshot is desktop. |

### Diagnose before changing CSS

Inspect actual computed styles and DOM, especially:

- `column-count`, `columns`, `column-width`, fragmentation, and inherited prose utilities.
- Fixed widths/heights, `min-width`, `min-height`, flex/grid min-content sizing, and repeated viewport-height sections.
- `text-align: justify`, automatic hyphenation, word/letter spacing, and global selectors affecting tables, lists, and spans.
- The sidebar's `overflow-y`, height restrictions, sticky offsets, and the number of independent scroll containers.
- Hallmark's styles, reset/preflight rules, stylesheet order, and existing local overrides.
- Math renderer output, stylesheet imports, inline/display mode selection, duplicate rendering, and its interaction with column layout and line height.
- Content extraction: whether developer instructions, formula IDs, and source corrections are being rendered as ordinary teaching prose.

Do not assume all of this comes from one library. Fix the verified source of each defect rather than layering broad `!important` overrides over it.

## 3. Hallmark integration requirements

Hallmark is already imported in the project. Discover what the actual import provides before editing it:

1. Find its import paths, installed package or local source, font declarations, stylesheet entry points, theme configuration, and usage sites.
2. Determine whether it supplies typography, a full theme, component styles, or another kind of UI integration. Do not invent a `HallmarkProvider`, hook, component, font family, or token API.
3. Read the installed code, types, and bundled documentation relevant to its supported customization points.
4. Retain and configure the existing integration using its real capabilities. Centralize the necessary app-level adaptations in the project's design-system layer.
5. If it supplies a display face, retain that character for brand/headings where appropriate, but verify comfortable body and UI typography. If it supplies prose styling, scope that styling to reading content rather than navigation, controls, diagrams, or equation internals.
6. Avoid a second imported UI framework or an unrequested font download merely to bypass the current styling problem.
7. Keep the math renderer's mathematical fonts and internal styles intact. Do not force Hallmark's type styling onto every descendant `span`, SVG text node, or math element.
8. Record which actual Hallmark settings or scoped adapters were changed in the implementation report.

## 4. Shared page layout

### Desktop

Use one aligned outer container shared by the header and lesson area. Suggested starting values:

| Property | Starting target |
|---|---|
| Outer content maximum | About 1280–1360 px, centered |
| Outer horizontal padding | 24–32 px on roomy screens |
| Navigation rail | About 240–272 px, never approximately 480 px at ordinary desktop widths |
| Rail-to-main gap | 28–40 px |
| Reading text width | Approximately 62–72 characters per line |
| Main track | Flexible, equivalent to `minmax(0, 1fr)` in a grid |
| Lesson content layout | One continuous vertical flow; explicitly placed grids only for complete components |
| Header height | Approximately 64–72 px, aligned with the content container |

These are implementation starting points, not reasons to break the site's existing layout system. Fit them to the actual font metrics and break the layout before content becomes cramped.

The main content may be wider than the reading paragraphs for a graph, formula comparison, or worked example. A narrower reading measure must not become a narrow maximum width on every diagram and table.

Use a compact lesson header containing breadcrumb/module, lesson title, a brief summary, and progress. Keep the title proportionate: approximately 40–48 px on desktop is a reasonable starting range, rather than the dominant oversized title currently shown. Put previous/next navigation in a consistent place and repeat it after the lesson where useful. Avoid scattering three unrelated navigation fragments across a large empty row.

### Compact desktop navigation

Replace the tall all-course menu with a compact module chooser and a short list of lessons in the current module. The chooser can be a supported accessible dropdown containing all 15 modules; the current module's 3–4 lessons remain visible below it on desktop.

A module index page can expose the full course outline without forcing the entire outline into every lesson's sidebar. Highlight the active lesson with more than just a subtle color change, and mark it semantically as current. Keep long module titles readable and ensure the final modules are reachable.

### Main lesson order

Use this default order, adapting where a particular lesson benefits from a different teaching sequence:

1. Compact lesson header and a short goals list.
2. Core explanation, anchored by a meaningful labeled figure where appropriate.
3. Formula/reference block with its assumptions.
4. Worked example with readable steps and a clear answer.
5. Interactive exploration with controls, figure, and computed output together.
6. Practice with hints and revealable solutions.
7. Optional reference details, sources, and previous/next navigation.

Do not force every section to fill a viewport. When exploration is the best introduction to a lesson, it can appear earlier, but it must be compact and purposeful.

## 5. Mobile and tablet navigation — required dropdowns

At widths where the desktop rail would constrain the lesson, remove it from the visual layout and accessibility tree. A practical starting breakpoint is around 1024–1120 px; select the final breakpoint from the actual content fit, not a device label alone.

Place two labeled dropdown selections above the lesson header:

- **Module:** current module name, with all 15 modules available.
- **Lesson:** lessons belonging to the selected module.

Use the existing accessible select component if Hallmark/project tooling actually provides one. Otherwise prefer native labeled selects. A custom select must implement the necessary focus, keyboard, open/close, and selected-state behavior; a visually styled div is insufficient.

Required behavior:

- No permanent expanded course list, off-canvas menu requirement, or long non-collapsible menu on mobile.
- Selects use the available width; stack on small phones. They may share a row only when both labels and values remain readable.
- Do not make option labels depend on fixed numbering alone; include meaningful module/lesson names.
- Selecting a module navigates to its first available lesson unless an existing documented resume behavior applies. Update the lesson choices and route together.
- Reflect deep links and browser back/forward navigation in both selections. Preserve query state that the existing app intentionally supports.
- Update the page title and current lesson. Move focus to the new lesson heading after an explicit in-page selection when using client-side routing; do not unexpectedly move focus just because the window resized.
- Keep module changes, lesson selection, previous/next links, and progress state synchronized through one route/state source.
- Ensure any hidden desktop navigation cannot retain keyboard focus.
- Offer a compact course-index link for users who want to browse all lessons.

The header also needs a deliberate narrow-screen arrangement. Brand, core navigation, and theme control must not collide, run offscreen, or occupy several accidental rows.

## 6. Spacing, type, color, and hierarchy

### Spacing

Use a small spacing scale, such as 4, 8, 12, 16, 24, 32, and 48 px. Apply it through the actual project tokens.

- Put closely related labels and controls within 8–12 px; control groups within 16–24 px.
- Separate a heading from its content by about 12–16 px, and substantial lesson sections by about 32–48 px.
- Use 16–24 px surface padding on desktop and roughly 16 px on mobile.
- Keep paragraphs separated consistently. Do not simulate paragraphs with repeated line breaks.
- Remove large blank top margins and fixed-height wrappers that separate a slider from its figure.
- Use rules to distinguish meaningful sections, not to frame every small paragraph.

### Typography

Use left-aligned, ragged-right prose. Remove full justification and automatic hyphenation from the lesson body. Let words wrap normally; avoid `word-break: break-all` and arbitrary letter-spacing fixes.

Suggested body size is 17–18 px desktop and 16–17 px phone, with line height around 1.55–1.7. Navigation and control labels should be visibly readable at normal zoom. Use a restrained heading scale and reasonable line height for wrapped headings.

If Hallmark supports a suitable reading face, use it; otherwise use the already installed or system reading/UI stack while retaining Hallmark's intended identity. Keep the math renderer's fonts separate. Do not assume every paragraph or control must inherit a decorative display treatment.

Replace repetitive headings such as “The idea.” with specific headings when they help scanning: “What makes a rhombus,” “Diagonal relationships,” or “Calculate the area.” Keep heading levels semantic and one primary page heading per lesson.

### Color and surfaces

Retain the existing warm neutral/coral direction if it works with Hallmark, but introduce a clear hierarchy: page background, subtle diagram/reference surface, primary text, secondary text, borders, and accent. Avoid an all-flat brown-black canvas where sections and controls are difficult to distinguish.

Use the accent for active navigation, selected geometry, and primary actions. Distinguish muted source notes from disabled controls. Check text, equations, figure labels, focus indicators, and control states in both existing themes. State mathematical differences with labels and line patterns as well as color.

Do not turn every paragraph into a rounded card. Reserve surfaces for meaningful units: a model, a key formula group, a worked example, or a quiz.

## 7. Content rendering — repair structure before decoration

### Remove newspaper flow

Do not use CSS multi-column flow for lesson prose, definitions, formulas, tables, or worked examples. The screenshots show reading order and table rows splitting in damaging ways.

An intentional two-column grid is acceptable for independent complete blocks, such as a diagram next to its controls, at sufficient width. Each block stays intact and has an explicit reading order. At narrow widths it stacks. `break-inside: avoid` may be useful defensively, but it is not a substitute for removing the inappropriate column layout.

### Tables, comparisons, and definitions

- Render genuine data comparisons with semantic tables, header cells, explicit cell padding, correct vertical alignment, and enough width for mathematical content.
- Do not reset table rows/cells into arbitrary inline spans or allow a table to fragment between prose columns.
- A starting cell padding of 12–16 px and subtle row separators should prevent headers such as “ClassificationDefinition” and “Perimeter AreaDiagonal” from visually merging.
- Two-column term/definition data often works better as a semantic definition list with consistent term spacing. Do not turn it into a dense spreadsheet by default.
- At narrow widths, transform suitable comparisons into labeled summaries grouped by shape or concept. Keep every value associated with its header and preserve a logical reading order.
- If a genuinely wide reference table must scroll, contain scrolling in that table region, with keyboard access and a clear cue. It must not create page-wide horizontal scrolling.
- Do not hide the perimeter, diagonal, condition, or units simply because the mobile layout is narrow.

### Math rendering

Inspect the installed renderer before changing its configuration. Confirm its required styles load once and are not overridden by generic typography rules.

- Keep inline math inline only when it fits naturally within a sentence.
- Give display math a complete block with sufficient height, vertical margins, and available width.
- Split long chains into semantically separate formulas or an aligned multiline expression supported by the existing renderer. Do not shrink every equation until it fits a narrow column.
- Preserve expression grouping, radicals, fractions, exponents, signs, degrees, and units. Do not insert arbitrary line breaks into LaTeX strings.
- Ensure flex/grid children can shrink through appropriate `min-width: 0` behavior. Inspect local overflow rather than clipping the entire application.
- Do not use fixed heights, negative margins, transforms, or absolute positioning to squeeze display equations beside prose.
- If math appears duplicated, inspect the renderer DOM and stylesheet integration; do not hide accessibility markup blindly.
- Rare unbreakable expressions may use a local, keyboard-scrollable math region. Prefer meaningful mathematical line breaks first.
- A diagram renderer and a prose math renderer must agree on symbols and the current parameter state.

For the rhombus example, give these separate space rather than one overflowing chain:

$$P=4q$$

$$K=bh=q^2\sin\theta$$

$$K=\frac{d_1d_2}{2}$$

$$q=\frac12\sqrt{d_1^2+d_2^2}$$

Then explain which measurements are required for each area formula. The separate formulas are a presentation change, not new mathematical content.

### Render student content, not the specification verbatim

The content pack includes both lesson text and IDE/editorial instructions. Do not render the whole Markdown file as one undifferentiated article.

Keep formula IDs, route metadata, acceptance checks, correction-log bookkeeping, interaction implementation instructions, and diagram briefs out of the normal student reading flow. Map them into implementation metadata or optional maintainer views. Source references can appear as compact expandable notes. A mathematically important convention or limitation must remain accessible to learners in an appropriate short note.

Preserve worked examples and all eligible practice. Needs-review source prompts must remain excluded from automatically graded practice, as specified in the content pack.

## 8. Scroll behavior

The aim is to remove redundant scroll regions and intrusive scrollbar chrome, not to make content unreachable.

- Use the document as the primary vertical scroller. Remove the tall internally scrolling all-module list by simplifying navigation.
- Avoid a separate fixed-height lesson scroller inside an already scrolling page.
- Do not set `overflow: hidden` on `html` or `body` to conceal layout defects.
- Do not globally apply `scrollbar-width: none` or hide all scrollbar pseudo-elements.
- Keep native page scrolling, touch gestures, wheel scrolling, and keyboard navigation working. Browser/OS page scrollbar visibility can differ; a native document scrollbar is not itself a failure.
- For genuinely necessary local scroll regions, use restrained styling compatible with the project and platform, maintain discoverability, and provide focus access where scrolling requires it.
- Prevent page-wide horizontal scrolling by fixing the oversized child, not by cropping the root.
- If using sticky elements, account for header height and ensure focused controls and anchor targets are not hidden behind them.

## 9. Interactive model composition

Use one visual unit containing a clear prompt, the diagram, controls, and derived results. A desktop layout can pair the diagram with a compact control area; mobile stacks them in a sensible order. Keep the question or instruction immediately associated with its controls.

- Each slider needs a visible label, units, current value, useful range, and a corresponding numeric input where precise entry matters.
- Display the selected angle as `60°`, not a bare `60` when the unit is otherwise unclear.
- Include a reset control and useful lesson presets. Prevent impossible geometry using explicit constraints and inline feedback.
- Size diagrams to their geometry; remove the large empty region between the rhombus slider and the shape.
- As a starting point, a bounded model stage around 280–420 px tall on desktop and 220–320 px on phone may work; allow adjustment for label density and actual content. Do not enforce a universal fixed height that clips a graph or squashes a solid.
- Fit or recenter the model when valid parameters change. Labels must remain visible and separated from edges and controls.
- Use equal coordinate scales for graphs and preserve aspect ratio. A circle should look circular in a coordinate graph; a perspective view of a solid may naturally project circles as ellipses.
- Show the relevant dependent results, not just decorative geometry. A rhombus area exploration should show height and area changing with angle.
- Retain meaningful numeric feedback for keyboard users and provide a text description or equivalent data for essential visual results.
- Do not announce every animation frame or slider tick to screen readers. Use appropriate state summaries.
- Animation should be optional and respect the user's reduced-motion preference.

## 10. Module-by-module design requirements

Implement these as content-aware compositions using shared components. They are not requests for 15 unrelated themes. Each module retains the common header, navigation, controls, and learning flow.

| Module / stable route | Primary presentation | Specific exploration and content arrangement | Completion check |
|---|---|---|---|
| **1. Plane Figures and Polygons** — `plane-figures-polygons` | Illustrated shape gallery plus labeled polygon anatomy | Separate vocabulary from the polygon-name reference. Show convex/concave and regularity with examples. Pair a side-count control with a regular polygon and compact angle/perimeter/area outputs. Expand optional large polygon names in a reference disclosure. | No split definition rows or merged side/name labels; the full polygon-name reference remains accessible. |
| **2. Triangles** — `triangles` | Two clearly separated classification groups: by sides and by angles | Use small accurate diagrams for classifications. Give the isosceles convention a concise note. Special-segment lessons use separate toggles for altitudes, medians, and angle bisectors, with a visible legend and corresponding center. Put Heron/SAS/base-height choices into a formula-selection reference. | Learners can distinguish classifications and segments visually; altitudes on extensions are not clipped; triangle inequalities are enforced. |
| **3. Quadrilaterals** — `quadrilaterals` | Shape comparisons with consistent labeled figures | Use separate shape summaries for rectangle and square on mobile. For rhombi, group perimeter, area alternatives, and side-from-diagonals formulas individually. An angle control updates a true equal-sided rhombus, its height, diagonals, and area. Use a dedicated trapezoid view and keep the naming convention visible. | Fix all three quadrilateral screenshots: no crowded tables, fragmented shape rows, or formula collisions. Include the corrected QD04 example from the pack. |
| **4. Cartesian Coordinates** — `cartesian-coordinates` | Coordinate plane with a concise supporting explanation | Plot/quadrant, distance triangle, segment-division parameter, and shoelace area are separate lesson compositions. Pair the shoelace product table with numbered vertices, not unrelated prose columns. | Plot labels fit on phone; distance and division calculations stay synchronized with points; table rows remain legible. |
| **5. Lines** — `lines` | Graph plus equation/direction summary | Separate slope, angle mode, and line-equation lessons. Show vertical slope as undefined. Use an explicit selector for smaller line angle versus directed/interior-angle tasks. Group equivalent line forms in labeled blocks. | Vertical/horizontal cases remain usable; selected angle convention is visible; equations do not overflow. |
| **6. Conics and Circles** — `circles` | Circle diagram with center/radius and a tangent state | Eccentricity introduction needs its own conceptual figure. Circle equations pair standard/general forms with completing-the-square steps. Tangent controls show radius perpendicularity. Circle/point/empty outcomes use a clear status explanation. | Tangency points and equations agree; no invented finite circle directrix; circle classification is not communicated by color alone. |
| **7. Parabolas** — `parabolas` | Focus/directrix/vertex relationship | Put signed parameter and orientation controls beside a responsive plot. Show the matching standard form and coordinate list. Keep the two Q01 cases distinct. Reveal equal-distance construction and latus rectum as independent overlays. | Directrix and focus are correctly labeled for every orientation; labels do not leave the stage; no invalid zero-parameter preset. |
| **8. Ellipses** — `ellipses` | Axes-and-foci figure with distance-sum explanation | Separate center/orientation controls from semiaxis controls. Keep vertex, covertex, focus, directrix, and focal-chord details in a readable reference linked to figure overlays. Use a concise parameter summary rather than a dense full-parts table beside a tiny plot. | Major-axis orientation matches the equation; circle limit is labeled; all four focal-chord endpoints remain distinguishable. |
| **9. Hyperbolas** — `hyperbolas` | Two branches, reference rectangle, and asymptotes | Give branch/orientation controls and a clear legend. Show focal-distance difference separately from ellipse-style sum. Group asymptote formulas with their corresponding orientation diagram. | Branches are never connected through the center; asymptotes and directrices remain readable in both orientations. |
| **10. Prisms** — `prisms` | Solid paired with a selectable net or cross-section | Distinguish base area, perpendicular height, and lateral-edge length. Show individual face contributions to lateral/total area. Give right/oblique cases explicit labels and prevent right-only shortcuts in oblique mode. | PR03 net matches its solid and measurements; inconsistent original source examples are not live exercises. |
| **11. Parallelepipeds and Cubes** — `parallelepipeds-cubes` | Cube/cuboid dimensions with face-versus-space diagonal view | Use toggles for diagonal type, net, and oblique extension where implemented. Separate packing and hollow-foundation examples into diagrams with dimension labels and unit conversions. | Face and space diagonals cannot be confused; painting/wall inclusion is explicit; long unit conversions wrap readably. |
| **12. Cylinders** — `cylinders` | Circular, hollow, and elliptic modes with a longitudinal section | Show radius/diameter clearly, expose which surfaces are included, and display each area contribution. Ellipse mode must label full axes/semiaxes and the perimeter method. Keep capacity and material-volume examples distinct. | Tube openings are not drawn as solid disks; units are consistent; unsupported source capacity prompt stays excluded. |
| **13. Pyramids** — `pyramids` | Solid plus selectable right-triangle section | Let learners distinguish altitude, slant height, lateral edge, apothem, and circumradius through a controlled overlay/section, not five overlapping labels. A separate inverted-pyramid fill view shows water depth and wetted wall area. | PY01 section triangles agree with formulas; filled liquid and wetted wall are separately identified. |
| **14. Cones** — `cones` | Cone with axial triangle, sector net, and cube-inscribed preset | Use three deliberate views with shared parameter state. Explain base inclusion in total area. Cube preset derives radius and height from the cube edge and visibly places the apex at the opposite face center. | CO04 geometry remains inscribed as the cube changes; net arc/base circumference agree; exact area is retained. |
| **15. Spheres and Spherical Segments** — `spheres-segments` | Separate sphere, shell, cap, band, and bowl views | Cut positions should generate valid radii. Use distinct toggles and labels for curved zone, flat disk(s), full segment boundary, and wetted wall. Keep bowl depth and center offset visibly distinct. | SP03 clearly distinguishes wet area `20π` from segment boundary `36π`; complementary zones reconstruct full sphere area. |

### Apply the redesign to every lesson

Each row above covers a whole module. Review its individual 3–4 lessons, not just its landing page or first example. Use the 49 stable lesson IDs from the pack as the implementation checklist. Shared improvements must reach every lesson renderer, including formulas and practice views accessible from the top navigation.

Keep the definitions, conditions, exact answers, correction decisions, and needs-review exclusions from the content pack authoritative. This task changes presentation and interaction design; it does not authorize substituting an incorrect diagram or formula to simplify layout.

## 11. Component and stylesheet structure

Adapt these conceptual responsibilities to the existing codebase; these are not assumed component names or Hallmark exports:

- Application shell: shared container, header, responsive navigation, main landmark.
- Module/lesson selection: one route-driven source of truth with desktop and compact presentations.
- Lesson header: title, context, goals, and progress.
- Reading content: scoped prose with no inherited newspaper columns.
- Definition list and illustrated classification group.
- Responsive comparison: desktop table or narrow-screen labeled summary.
- Formula block: math, symbols, conditions, and sufficient width.
- Model stage: figure, accessible description, local controls, computed results, reset/presets.
- Worked example: given information, ordered steps, answer, optional reveal.
- Practice item: prompt, response, feedback, hint, revealable solution.
- Optional reference/source note: compact and separate from the main explanation.

Remove obsolete layout rules and competing implementations as you replace them. Avoid per-module copies of the entire shell, broad global table/span overrides, and a growing set of route-specific margin fixes. Use module-specific content configuration and small specialized visualizations where the mathematics requires them.

## 12. Implementation sequence

### Phase 1 — Inspect and fix the shared failure modes

1. Inspect the actual app and Hallmark integration; identify the verified causes of columns, math overflow, table crowding, and nested scrolling.
2. Establish scoped type/spacing/layout tokens and repair the Markdown/content-to-component mapping.
3. Replace the navigation rail and implement the mobile/tablet dropdown behavior.
4. Repair tables, formulas, and overflow at the component level.

### Phase 2 — Rebuild representative lessons, then complete every module

First use three affected lessons to verify the shared foundation: polygon vocabulary, triangle classification, and quadrilateral rhombi. Review them at phone and desktop widths, then apply the established components while completing the content-aware designs for all 15 modules. This pilot is a checkpoint within the implementation, not the final deliverable.

### Phase 3 — Verify and finish

Walk every lesson and interactive state. Fix remaining defects, run the repository's relevant checks, and provide a concise report with the actual Hallmark integration changes, modules completed, responsive checks, and any concrete remaining limitation.

Do not end the task with only an audit, a redesign proposal, unimplemented placeholder diagrams, or a first-module-only patch. If a capability is absent, preserve a useful labeled static figure with the correct explanation and report the specific missing interaction; do not falsely label a nonfunctional control as complete.

## 13. Acceptance checklist

### Shared visual and navigation acceptance

- [ ] All 49 lessons render within a common, deliberate shell.
- [ ] Hallmark remains integrated through its actual supported customization points; no fabricated APIs or duplicate font imports.
- [ ] Reading content is single-column, left-aligned, and free from forced word stretching and automatic hyphenation.
- [ ] No table row or mathematical expression flows into a neighboring prose column.
- [ ] No overlapping equations, clipped fractions, merged table headers, or offscreen results.
- [ ] Desktop sidebar is compact and does not contain the previous oversized independently scrolling course list.
- [ ] Mobile/tablet uses labeled module and lesson dropdown selections; no permanent expanded sidebar.
- [ ] All 15 modules and every lesson are reachable through navigation, including the final modules.
- [ ] Dropdowns, route changes, browser back/forward, previous/next, and progress remain synchronized.
- [ ] The document is the primary vertical scroller; no global scrollbar hiding or root overflow clipping.
- [ ] No page-wide horizontal scroll at narrow widths; essential wide references remain locally accessible.
- [ ] Interactive stages use their space purposefully, with controls, instructions, and results together.
- [ ] Both themes have readable body text, math, diagrams, labels, and visible focus states.
- [ ] Touch targets are comfortably operable; aim for at least 44 px height for primary touch controls.
- [ ] Navigation and interactions work with keyboard input; essential diagram information has a textual equivalent.
- [ ] Zoom and larger text do not create inaccessible fixed-height regions or hide controls.
- [ ] Editorial implementation instructions and formula-ID bookkeeping are not ordinary learner prose.

### Verification matrix

| Scenario | What to inspect |
|---|---|
| 320–390 px wide phone | Header, dropdown labels/values, prose wrapping, long lesson titles, narrow formula/table alternatives, diagram labels |
| Around 768 px | Navigation stays compact while content uses the available width; no awkward half-sidebar state |
| Around the selected navigation breakpoint | Resize across the breakpoint; check focus, route state, and layout stability |
| 1280–1440 px desktop | Sidebar-to-main ratio, reading width, bounded diagrams, aligned header/content edges |
| 1920 px desktop | Content stays centered and readable without excess sidebar growth or stretched prose |
| Short landscape viewport | All controls and navigation remain reachable; sticky UI does not trap content |
| 200% zoom / larger text | Reflow and keyboard reachability; formulas and navigation remain usable |
| Long formulas and the supplied table cases | Rhombus formulas, rectangle/square comparison, triangle classification, polygon names |
| Route/history test | Deep-link into a later module; change selections; go back and forward; confirm visible lesson and selected options |
| Parameter extremes | Very acute/obtuse valid shapes, both conic orientations, hollow/solid modes, near-empty/full bowl; no model or label clipping |

Use the project's existing automated checks for behavior that warrants regression coverage: route/dropdown synchronization, formula/table rendering, overflow detection where reliable, and mathematical interactions. Perform visual review as well; passing a build or DOM assertion does not prove the design works. Keep a module-by-module checklist with all 49 lessons so unreviewed routes are not silently counted as complete.

### Required completion report from the IDE assistant

Provide a short account of the verified causes, shared changes, actual Hallmark integration adjustments, module-specific work completed, checks run, and any remaining defect with its exact route. Include before/after screenshots if the development environment supports them. Do not claim testing for browsers, devices, routes, or interactions that were not actually checked.
