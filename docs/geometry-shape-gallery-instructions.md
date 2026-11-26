---
title: "Replace Practice with an Interactive Shape Gallery"
version: "1.0"
inputs:
  - "geometry-website-content-pack.md"
  - "geometry-formula-catalogue.md"
  - "geometry-ui-overhaul-instructions.md"
  - "geodive-integration-and-formula-quiz-instructions.md"
  - "geometry-ui-animation-instructions.md"
---

# Interactive Shape Gallery — IDE implementation brief

## Copy this task into the IDE assistant

> Replace the redundant Practice navigation destination with a Gallery page for exploring the shapes and diagrams in this course. Reuse the existing redesigned website, Hallmark integration, shared shell, responsive navigation, and motion conventions. Build mathematically accurate interactive figures whose points, edges, dimension lines, faces, curves, and surfaces can be hovered, focused, or selected to reveal their names, definitions, relevant symbols, and conditional wording used in problems. Click/tap pins a part's details; mobile and keyboard users must have equivalent access. Use the supplied content pack and formula catalogue as the subject-content authority. Preserve useful existing practice questions and progress by auditing and linking/migrating them into Quiz without duplication or data loss. Complete the shared gallery interface and the module-specific figure coverage below, including the right-versus-oblique prism terminology comparison. Do not return only a static image grid, an iframe, or a collection of nonfunctional hover labels.

This is a feature brief for the IDE assistant. Inspect the actual repository before choosing component names, routes, or renderer APIs. The main application source and current deployed design were not available for inspection when this brief was written.

## 1. What each tab should do

| Tab | Learner purpose |
|---|---|
| Formulas | Find a relationship, notation, and its applicability |
| Lessons | Read explanations and worked examples |
| Gallery | Identify and explore geometry, its parts, and problem wording |
| Quiz | Answer questions, receive feedback, and review performance |

Gallery is an anatomy and terminology explorer. It should help learners answer “What part is the problem referring to?” rather than reproduce another quiz or lesson wall of text.

Keep the main site's current brand, Hallmark integration, theme, type, spacing, component styling, and accessibility behavior. The Gallery should look like another part of the same website.

## 2. Replace the destination without losing content

1. Audit the current Practice page, questions, deep links, and saved progress.
2. Identify questions already present in Quiz; do not import those twice.
3. Keep additional valid questions accessible through Quiz, with stable identities and explanations. Respect the content pack's needs-review exclusions.
4. Change the primary tab from **Practice** to **Gallery**, with a route such as `/gallery` using actual project routing conventions.
5. Update “Practice this module” links to the appropriate Quiz setup rather than sending learners to an anatomy page.
6. Handle existing `/practice` links intentionally. Use a compatibility redirect or meaningful transition page suited to the old link's purpose; preserve supported module/query state.
7. Preserve unrelated lesson and quiz progress. Renaming a navigation destination must not reset storage or erase prior attempts.

Primary navigation should read **Formulas / Lessons / Gallery / Quiz**, following the current site's order and responsive component system. Avoid retaining two competing primary destinations called Practice and Quiz after this replacement.

## 3. Core interaction: inspect a part

### Pointer hover

Hovering a part should highlight its actual geometry and show a concise label, such as **Lateral edge**. Highlight the matching entry in the parts list as well. A tiny vertex or thin edge needs a larger invisible hit target, without visibly thickening the entire drawing.

The floating label contains brief text. Put links, definitions, and longer explanations in the inspector, not inside an interactive tooltip. Position the label within the viewport without covering the hovered target or spilling into neighboring navigation. Avoid a tooltip that follows every tiny cursor movement and becomes difficult to read.

### Click or tap

Clicking/tapping a part pins its details in the inspector. A pinned selection remains stable while the learner moves the pointer away. Hover previews must not silently overwrite the pinned details. Provide an explicit clear selection/reset action; Escape can clear the pin when focus is within the gallery, unless an open dialog/menu already owns Escape.

On touch screens, one deliberate tap selects the part. No essential action may depend on hover. Provide a labeled **Parts** list with selectable rows as a reliable alternative when the drawing is crowded.

### Keyboard and parts list

Every concept must be selectable from an ordinary accessible parts list, even if the diagram renderer is canvas/WebGL. Focus/selection in the list highlights the same geometry. Use the project's semantic controls and visible focus styles. Do not create hundreds of tab stops for every repeated edge; group equivalent parts where useful.

If individual SVG parts are focusable, give them names and an intentional focus order. Do not make a decorative overlay intercept the real controls.

### Inspector content

| Field | Meaning |
|---|---|
| Name | Canonical geometric name |
| What is highlighted? | Point, segment, dimension guide, face, curved surface, region, or reference line |
| Definition | One or two clear sentences |
| Measurement / symbol | The relevant length, area, angle, or coordinate symbol, if used in this context |
| Wording you may see | Conditional phrases a problem may use for this part or its measurement |
| Important distinction | A likely confusion and when two measurements do or do not coincide |
| Related formula | Existing applicable formula from the catalogue, if any |
| Learn more | Verified lesson link; optional Quiz link preselected to the module |

Do not label a face itself “square units.” A face is the object; its **area** is measured in square units. Likewise a base edge, its length, the whole base face, its area, and its perimeter are different concepts.

## 4. Required prism example: terminology with context

Make this the first complete reference implementation. Use a right triangular prism initially, with a switch to a corresponding oblique view. State which two faces are the selected bases. The bases need not appear at the bottom of a perspective drawing.

| Selected part | Definition / meaning | Possible problem wording | Required qualification |
|---|---|---|---|
| Base face | One of the congruent parallel polygonal end faces | “Triangular end,” “area of the base” | The face is an object; $B$ refers to its area |
| Base edge | A boundary segment of a selected base | “Side of the triangular end,” “base side” | Not the entire base area or prism height |
| Lateral face | Face joining corresponding base edges | “Side face,” “rectangular side panel” in a right prism | In an oblique prism it is generally a parallelogram, not necessarily a rectangle |
| Lateral edge | Segment joining corresponding vertices of the two bases | “Lateral edge”; sometimes “prism length” when the problem defines it that way | Its length equals perpendicular height in a right prism; not generally in an oblique prism |
| Altitude / perpendicular height | Perpendicular distance between the base planes | “Height of the prism,” “perpendicular separation of the bases” | Show a perpendicular guide and right-angle marker; it need not be a visible physical edge |
| Axis segment | Segment joining base centroids | “Axis,” “segment joining the base centers” where those centers are defined | It is parallel and equal in length to lateral edges; it is a separate segment |
| Altitude of triangular end | Perpendicular altitude within the triangular base | “Height of the triangle,” “height of the triangular end” | This is $h_t$, not the prism length $L$ in PRISM-02 |
| Right section | Section perpendicular to the lateral-edge direction | “Right section” | It is not automatically the selected base of an oblique prism |
| Vertex | Corner where edges meet | “Vertex,” “corner” in descriptive wording | Highlight a point, not the whole adjoining edge |

**Critical learning comparison:** In right mode, show that lateral-edge length and perpendicular height agree. In oblique mode, draw both distinctly and explain why they differ. Never attach “height,” “length,” and “lateral edge” as unconditional interchangeable aliases to every long line in a prism.

The existing content pack defines these parts in `PRISM-01`, distinguishes triangle-end height from prism length in `PRISM-02`, and restricts $A_L=P_bh$ to right prisms. Follow those rules.

These example problem phrases are authored explanatory wording, not claimed quotations from every source PDF. Keep canonical definitions and mathematical applicability grounded in the supplied material.

## 5. Gallery organization and figure coverage

Use a searchable card index with clear families: **Plane figures**, **Coordinates & conics**, and **Solids**. Cards should show small accurate previews. Opening a card reveals the interactive viewer, parts list, and inspector. Search should find both shape names and meaningful part names.

Use a compact shape/preset dropdown on phones. Keep long names wrapping correctly and avoid restoring the old expanded mobile sidebar. A card grid alone is not the completed feature: each listed family needs its working anatomy view.

| Course module / stable ID | Required figure or presets | Inspectable parts and distinctions | Lesson references |
|---|---|---|---|
| Plane Figures and Polygons — `plane-figures-polygons` | Regular polygon with side-count control; convex/concave examples | Side, vertex, diagonal, interior/exterior/central angle, center, apothem; apothem perpendicular to a side | POLY-01, POLY-03, POLY-04 |
| Triangles — `triangles` | Side/angle classifications and a special-segment view | Side, vertex, base, corresponding altitude, median, internal angle bisector, centroid, orthocenter, incenter; extend sides when an altitude lies outside | TRI-01, TRI-02 |
| Quadrilaterals — `quadrilaterals` | Parallelogram, rectangle, square, rhombus, right trapezoid, general convex quadrilateral | Sides, bases where applicable, height, diagonals, included side angle versus diagonal angle; distinguish properties that depend on the selected class | QUAD-01–QUAD-04 |
| Cartesian Coordinates — `cartesian-coordinates` | Coordinate plane with two points and a division point | Axes, origin, quadrants, ordered point, coordinate differences, midpoint, division point, distance segment; guides are not extra polygon edges | CART-01–CART-04 |
| Lines — `lines` | Intersecting, parallel, perpendicular, vertical/horizontal presets | Line, point, x/y intercept, rise/run guides, angle between lines, perpendicular bisector; a vertical line has undefined slope | LINE-01–LINE-03 |
| Conics and Circles — `circles` | Circle and tangent view | Center, radius, diameter, chord, tangent line, point of tangency; distinguish disk/area from the circle boundary when a solid base is shown elsewhere | CIRC-02, CIRC-03 |
| Parabolas — `parabolas` | Four axis-parallel opening presets | Vertex, focus, directrix, axis, latus rectum and endpoints; reference lines are not parts of the curve itself | PARA-01, PARA-02 |
| Ellipses — `ellipses` | Horizontal/vertical major-axis presets | Center, major/minor axis, semiaxes, vertices, covertices, foci, directrices, latera recta; full axis versus semiaxis | ELLI-01, ELLI-02 |
| Hyperbolas — `hyperbolas` | Horizontal/vertical transverse-axis presets | Branches, center, vertices, foci, transverse/conjugate axes, asymptotes, directrices, latera recta; conjugate-axis endpoints are not on the curve | HYP-01, HYP-02 |
| Prisms — `prisms` | Right/oblique triangular prism; regular polygon base presets | Complete prism reference implementation in section 4; selected bases, edges, faces, altitude, axis, right section | PRISM-01, PRISM-02 |
| Parallelepipeds and Cubes — `parallelepipeds-cubes` | Cube, cuboid, oblique parallelepiped | Face, edge, vertex, selected base, face diagonal, space diagonal, perpendicular height; different oblique space diagonals need not match | BOX-01, BOX-02 |
| Cylinders — `cylinders` | Right circular, oblique circular, hollow circular, right elliptic | Base disk, rim, radius, diameter, axis, altitude, curved wall; inner/outer radii and annular ends; ellipse full axes versus semiaxes | CYL-01–CYL-03 |
| Pyramids — `pyramids` | Regular square and pentagonal pyramids | Apex, base face/edge, lateral face/edge, altitude, face slant height, apothem, circumradius; three different right-triangle sections | PYR-01, PYR-02 |
| Cones — `cones` | Right circular cone, axial section, cube-inscribed preset | Apex, base disk/rim, radius, diameter, altitude, axis, slant height, curved lateral surface; cube preset shows the defined placement | CONE-01, CONE-03 |
| Spheres and Spherical Segments — `spheres-segments` | Sphere, hemisphere, shell, one-base cap, two-base segment, partially filled bowl | Center, sphere radius, great/small circle, cut-circle radius, segment height, curved zone, cut disk(s), inner/outer surface, wetted wall versus free liquid surface | SPH-01–SPH-03 |

Use only the parts and concepts supported by the supplied course material. Do not quietly extend the syllabus with unrelated solids, extra triangle centers, or additional circle theorems because they are common in other geometry courses.

## 6. Terminology must be conditional, not a synonym dump

Classify displayed wording internally:

- **Canonical term:** the geometric definition used by the course.
- **Equivalent name in this context:** a valid alternate term under stated assumptions.
- **Measurement relationship:** different geometric objects may have the same length in this configuration.
- **Problem wording:** descriptive phrasing that can refer to a part when the prompt defines it that way.

For example, a cube's face diagonal and space diagonal are not aliases; an ellipse's major axis and semimajor axis differ by a factor of two; a pyramid's slant height and lateral edge are different segments; a sphere's zone and solid segment have different dimensions. Make these distinctions visible.

A dimension named “length” or “width” depends on the problem's chosen orientation and labels. Do not assign a universal semantic meaning based on the longest edge on screen. A perspective drawing's projected segment lengths are not the actual mathematical measurements.

Attach simple authored wording examples such as “If the problem gives the height of the triangular end, inspect this altitude.” They should explain interpretation, not invent a new source quotation or add another graded practice system.

## 7. Viewer and controls

### Shared viewer

- Provide a useful default view and Reset view / Reset dimensions controls.
- Let learners toggle labels, hidden edges, and construction/dimension guides independently where relevant.
- Include front/side/isometric presets for solids where supported by the actual renderer. Rotation may help, but a correct labeled diagram is the priority.
- Keep the parts list and inspector stable while the geometry changes. On phones, place them below the viewer or in the existing accessible disclosure system.
- Avoid hiding essential details in a floating tooltip that disappears when moving toward it.
- Display the selected part's measurement, where available, with units and a clear distinction between length, angle, area, and volume.
- Derive measurements and labels from one model state; selections must stay valid after resizing or changing a parameter.

### Picking and hit targets

For thin lines, use an invisible wider pointer target that follows the same geometry. For crowded scenes, give vertices/edges/dimension guides a deliberate selection priority over a large face, or provide a way to choose the intended overlapping part through the parts list.

Ensure transparent faces do not intercept every click and make edges unreachable. Define how hidden/back parts are selected: through the parts list, a hidden-edge toggle, or rotating the model. Do not highlight an unrelated front edge when a learner selects a rear one.

If rotation is available, distinguish drag from click/tap using a movement threshold. A rotate drag should not accidentally pin a random part at pointer release. Provide buttons/presets for non-drag users, and do not trap normal mobile page scrolling inside the viewer.

### Geometry and rendering

Use the existing SVG/canvas/3D stack where possible. Do not generate a picture and treat pixel guesses as geometry. For a 2D projection, keep the geometric model separate from the screen projection so dimensions remain mathematically correct.

Do not pretend every solid has a net already implemented. When a supported net view exists, reuse it; it is secondary to correct part inspection. Avoid a major framework replacement solely to make the gallery rotatable.

## 8. Constraints and educational overlays

Useful parameter changes include regular-polygon side count, a rhombus's included angle, circle radius, conic orientation/parameters, prism tilt, and solid dimensions. Add only controls supported by a valid model and existing lesson content.

- Preserve triangle inequalities and selected shape properties.
- Keep a regular pyramid's apex above its base center when using its regular-pyramid relations.
- In an oblique-prism comparison, show altitude separately from a slanting lateral edge. If holding base area and perpendicular height constant, volume remains constant as the top base translates.
- Derive spherical cut radii from cutting-plane positions on the same sphere.
- Keep hyperbola branches disconnected and avoid a finite directrix in the circle limit.
- Distinguish a visible boundary edge from a dashed construction guide or a selected cross-section.

Use subtle highlight transitions following the animation brief. Direct manipulation should update promptly; do not make labels and geometry lag behind controls. Respect reduced motion, avoid autoplay rotation, and keep all information accessible in a static inspection state.

## 9. Data model and links

Adapt this conceptual schema to the project's existing code; these names are not assumed exports:

```text
GalleryFigure {
  id, title, family, moduleId, lessonIds,
  presetIds, parameterDefinitions, partDefinitions
}

GalleryPart {
  id, conceptId, instanceId,
  name, geometricType,
  definition, measurementKind, symbol,
  wordingExamples: [{text, relationshipType, condition}],
  distinctionNote,
  relatedFormulaIds, lessonIds,
  geometryBinding, visibilityCondition
}
```

Keep concept identity separate from one drawn instance: several edges may all be lateral edges. Selecting one instance can highlight it strongly while showing equivalent instances more subtly if that helps.

Use verified lesson IDs from the content pack and existing formula IDs from the catalogue, such as `PRISM-01`, `PRISM-02`, `F-PR01`, `F-PR02`, `PYR-01`, and `F-PY01`. Resolve them through the actual app's route/data mapping; do not guess a URL by concatenating strings.

A face can be associated with its area formula without claiming the scalar area symbol names the face itself. If a part has no useful formula relationship, a correct definition and lesson link are sufficient. Do not invent a formula merely to fill the inspector.

Search aliases and explanatory wording must preserve conditions. Prefer named predicates in application code over evaluating arbitrary condition strings.

## 10. Implementation and acceptance

### Work order

1. Audit the existing Practice/Quiz content, progress, shared shell, diagram renderers, and typography.
2. Add the Gallery route/tab and safe handling of old Practice links.
3. Implement a reusable index, viewer, selectable parts list, pinning behavior, and inspector.
4. Complete the right/oblique triangular-prism example and verify its terminology.
5. Extend the shared interface to every family in the coverage table using specialized geometry where required.
6. Add lesson/formula/quiz cross-links and module/part search.
7. Test input methods, correctness, responsive layout, route compatibility, and progress preservation.

The prism implementation is a checkpoint, not the entire feature. Do not stop with one working shape while the remaining cards are placeholders.

### Required checks

| Scenario | Expected result |
|---|---|
| Hover a prism lateral edge | Correct segment highlights and label says “Lateral edge” |
| Select its altitude in right mode | Perpendicular guide is identified; matching lengths are explained conditionally |
| Switch to oblique mode | Altitude and lateral edge become visibly distinct; no unconditional height alias |
| Hover a base face | Face highlights; inspector distinguishes the face from B, its area |
| Inspect the triangular-end altitude | Described as triangle height, distinct from prism length |
| Pin a part, then hover another | Pinned inspector stays stable; preview behavior is unambiguous |
| Select a part from the list | Same geometry highlights as a pointer selection |
| Touch-only phone | Every part can be selected without hover or precision tapping |
| Keyboard-only navigation | All concepts are reachable through semantic controls with visible focus |
| Rotate then release | Drag does not accidentally select a part |
| Hidden/back edge selection | Target is revealed or explained through a deliberate mechanism |
| Cube diagonal view | Face and space diagonals are distinct and correctly named |
| Ellipse dimension selection | Full major/minor axes and their semiaxes are distinguished |
| Pyramid selection | Slant height, lateral edge, altitude, apothem, and circumradius do not collapse into one label |
| Hollow-cylinder inspection | Inner/outer wall and annular end face are different selectable surfaces |
| Sphere/bowl inspection | Zone, segment, wetted wall, and free liquid disk are distinguished |
| Long part/topic names | Wrap inside the parts list/inspector; no overlap with the main content |
| Narrow screen and 200% zoom | Diagram and readable details fit; no page-wide horizontal overflow |
| Reduced motion | Selection and demonstrations remain informative without positional animation |
| Old Practice deep link | Meaningful preserved destination; no unexplained broken route |
| Saved lesson/quiz progress | Retained; imported practice questions are not duplicated |

Use actual browser review as well as relevant repository checks. Verify geometry and terminology at representative parameter extremes, not only the default camera angle. The completion report should list the implemented figure families, input methods tested, content/progress handling, and concrete limitations. Do not claim interactive coverage for a static preview card.
