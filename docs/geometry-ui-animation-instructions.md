---
title: "Geometry Website: UI Animation Implementation Brief"
version: "1.0"
scope: "Existing redesigned website, 15 geometry modules, and the integrated quiz page"
companion_documents:
  - "geometry-ui-overhaul-instructions.md"
  - "geodive-integration-and-formula-quiz-instructions.md"
  - "geometry-website-content-pack.md"
---

# Add purposeful animation to the existing website

## Copy this task into the IDE assistant

> Implement a restrained, consistent motion system across the existing redesigned geometry website and its integrated quiz page. Inspect the current shared components, Hallmark integration, router, math renderer, interactive diagrams, and installed animation tools first. Preserve the completed design and the long-name navigation overflow fix. Add the transitions and feedback described below using shared motion tokens, accessible interaction, and reduced-motion support. Reuse existing dependencies and actual supported APIs; complete the implementation and verify representative states in all 15 modules. Do not return only a plan, install a second UI system, redesign the website again, or make learning/quiz state depend on animation completion.

This brief specifies work for the IDE assistant. The current application source and the final rendered site have not been inspected here. Suggested durations and component responsibilities must be adapted to the actual project rather than treated as existing APIs or selectors.

## 1. Motion direction

The site should feel responsive, calm, and deliberate. Animation should help a learner notice a state change, understand a geometric relationship, or stay oriented between lessons. Keep the existing main-site visual identity, Hallmark styling, theme, typography, and layout.

Prioritize:

1. Clear hover, press, focus, and selection feedback.
2. Small transitions between lessons and quiz questions.
3. Smooth opening of explanations, hints, and reference sections.
4. Clear quiz answer and progress feedback.
5. Mathematical demonstrations whose motion explains the lesson.

Avoid perpetual bobbing, parallax, typewriter paragraphs, letter-by-letter math reveals, rubbery page transitions, animated backgrounds behind reading content, or repeated celebrations. Do not animate every element because it is technically possible.

## 2. Inspect before implementing

Find the actual shared page shell, navigation/dropdowns, button/select/dialog components, lesson renderer, formula component, model stage, quiz session state, theme controls, and progress store. Check whether any motion helpers already exist.

- Use the project's existing animation library where it already solves the required behavior. Inspect its installed version, types, and bundled documentation before using its APIs.
- Prefer ordinary CSS transitions/keyframes for simple visual states. More complex presence or diagram transitions may use the project's existing tools.
- Do not assume Hallmark is an animation library, add invented Hallmark hooks, or overwrite its integration.
- Do not add a large dependency for effects that the existing stack can implement comfortably.
- Identify existing motion and consolidate conflicting effects instead of layering several animations onto the same element.
- Separate visual animation from route state, form state, correctness, score calculation, persistence, and timekeeping.

## 3. Shared motion tokens

Centralize durations, easing, and movement distances in the existing token/theme layer. These are suggested starting values, not hard-coded per-component exceptions:

| Token responsibility | Suggested value | Use |
|---|---|---|
| Fast feedback | 100–120 ms | Press, immediate selection, small state changes |
| Control transition | 150–180 ms | Button surfaces, custom disclosure indicator |
| Content transition | 180–240 ms | Question replacement, hint/solution entrance |
| Larger demonstration step | 240–320 ms | Deliberate model preset or net step |
| Entry movement | 4–8 px maximum | Small content translation; no full-screen sliding |
| Hover lift | 1–2 px maximum | Optional pointer hover on actionable cards |
| Entry easing | A smooth ease-out curve | Arrive promptly and settle without bouncing |
| Exit easing | A brief ease-in curve | Optional exit, shorter than entrance |

An illustrative CSS token definition:

```css
:root {
  --motion-fast: 110ms;
  --motion-control: 160ms;
  --motion-content: 220ms;
  --motion-demo: 280ms;
  --motion-ease-out: cubic-bezier(0.2, 0.7, 0.2, 1);
  --motion-ease-in: cubic-bezier(0.4, 0, 1, 1);
  --motion-distance: 6px;
}
```

Map these to the actual project's tokens. Do not apply `transition: all` to the page or to math-renderer internals. Name the properties that should change.

## 4. Shared UI animation specification

| Surface / trigger | Desired animation | Limits and behavior |
|---|---|---|
| Buttons | Brief surface/border change; optional very small press compression | Preserve target size and focus ring; avoid moving surrounding layout |
| Actionable module cards | Small pointer-only lift and border/surface transition | Apply only to interactive cards; keyboard focus must be equally clear without requiring movement |
| Module index arrival | Light entrance on a few visible items | Optional stagger around 20–30 ms, capped to a small initial group and roughly 150 ms total delay; do not cascade through all 15 modules |
| Lesson navigation | Active-state surface change | Keep wrapped long labels and row heights correct; no moving sidebar track or oversized active marker |
| Module/lesson selection | Short main-content entrance after navigation commits | Leave global header and navigation stable; do not block selection while waiting for decorative exits |
| Custom dropdown | Brief opacity and small position change, if supported by its component | Keep collision/viewport constraints and correct focus handling; no animated full course list on mobile |
| Native select | Retain native interaction | Do not attempt to animate the browser/OS-owned option popup or replace it just for an effect |
| Hint, solution, glossary disclosure | Smooth reveal of the content region and optional chevron rotation | Support variable content height and rendered equations; do not truncate with an arbitrary fixed maximum height |
| Dialog | Brief backdrop and panel appearance | Use existing accessible dialog behavior; focus trap and return focus do not wait on unreliable animation callbacks |
| Tabs or segmented controls | Clear selected surface/indicator transition | Labels and panels must not shift unpredictably or flash previous state |
| Theme change | Short surface/text color transition where appropriate | Preserve immediate readability; no full-screen flash, expanding theme circle, or transitions on every math descendant |
| Progress update | Short fill transition | Label reflects actual progress; animation never invents intermediate completed work |
| Validation | Border/icon/text appearance | Explain the issue in text; avoid shaking the form or shifting it sideways |

### Safe content entrances

Use one motion boundary around the changed main-content region rather than animating every nested paragraph, table cell, and equation. The content must remain readable if animation support fails or JavaScript is disabled where the app otherwise supports that state.

Do not leave content permanently at `opacity: 0` pending an observer, timer, or animation event. Scroll-based entrances are optional and should never hide essential reading material. Do not replay them every time the learner scrolls slightly up and down.

For disclosures, reserve space correctly through real layout changes. A measured-height transition, existing reliable presence component, or simpler fade is preferable to an arbitrary `max-height` that cuts off long solutions. Opening content may legitimately expand the document; it must not overlap the next section.

## 5. Navigation and the existing overlap bug

The previous long-name fix is a prerequisite. Animation must not conceal or reintroduce it.

- Module triggers, lesson rows, active backgrounds, and labels remain bounded by the navigation track.
- Long lesson names wrap normally and rows grow to fit. Avoid fixed-height animated rows that assume one line.
- Animate an inner label or background only when doing so cannot move it into the main content or clip its focus ring.
- Keep a real layout gap between navigation and lesson content. Do not animate that gap or sidebar width on every selection.
- At the established compact breakpoint, retain the **Module** and **Lesson** dropdown selections. Do not animate the desktop sidebar into an expanded mobile list.
- Open custom popups may intentionally overlay content while open; they still need viewport constraints. Persistent navigation overlap is never an acceptable transition state.
- Avoid transforming an ancestor of a positioned menu without checking its placement behavior. Keep any menu positioning/portal strategy consistent with the existing component.

Regression-test “Parallelepipeds and Cubes,” “Cubes and rectangular parallelepipeds,” “Packing, unit conversion, and shell subtraction,” and “Spheres and Spherical Segments.”

## 6. Routes, focus, and interrupted transitions

- Commit the selected route/state immediately. Decorative motion may accompany the new content, but must not become a prerequisite for navigation.
- Preserve deep links, back/forward behavior, saved scroll positions where appropriate, and the current module/lesson selections.
- After explicit lesson/question navigation, move focus predictably to its heading. Do not reset focus during a slider drag, a resize, or every frame of a model update.
- Do not animate document scroll as part of every transition. Respect reduced motion and the router's existing scroll-restoration behavior.
- If an exit/entry implementation briefly retains old and new panels, the outgoing panel cannot remain keyboard-interactive, expose duplicate IDs, or compete with the new panel in assistive reading order.
- Rapid navigation must cancel or supersede outdated animations. The final visible content must match the latest route, with no stale labels or delayed state writes.
- A transition interrupted by route exit, resizing, or a preference change must leave the interface in a usable final state.
- Animation cleanup must not submit an answer, change a score, mark a lesson complete, or reset progress.

## 7. Mathematical diagrams: animate the relationship

Keep ordinary UI transitions distinct from instructional demonstrations. Continuous parameter updates must follow one authoritative mathematical model.

**Direct manipulation:** Slider and drag changes should track the learner's input immediately. Avoid easing that makes the geometry lag behind the handle or displaying final numerical values while the figure still represents a different parameter state.

**Preset changes:** A short transition can help connect valid model states. If interpolating would cross invalid geometry or create a misleading deformation, use a quick crossfade or staged explanation instead. Do not interpolate arbitrary SVG paths and assume the intermediate figure still satisfies the equations.

**Step demonstrations:** Use explicit Play/Next/Reset controls where motion teaches a construction. Provide the same information through a labeled static or step-by-step state. Do not autoplay every lesson's model on entry.

| Module / route | Useful demonstration | Mathematical constraint |
|---|---|---|
| Plane Figures and Polygons — `plane-figures-polygons` | Reveal center triangles/apothem; show how measurements update with side count | Side count is discrete; rebuild/crossfade between polygons instead of pretending fractional side counts are valid |
| Triangles — `triangles` | Toggle medians, altitudes, bisectors, and their centers | Keep the chosen triangle valid; show altitude extensions where required |
| Quadrilaterals — `quadrilaterals` | Change rhombus angle while showing height and area | Equal side lengths remain equal; formulas and labels follow the same angle state |
| Cartesian Coordinates — `cartesian-coordinates` | Move a division point, reveal a distance right triangle, step through shoelace products | Coordinate readouts agree with the displayed positions; vertex order remains explicit |
| Lines — `lines` | Change slope or rotate a line; reveal an angle construction | Handle vertical slopes and perpendicular cases without infinite numeric artifacts |
| Conics and Circles — `circles` | Move a tangency point and show its perpendicular radius | Point stays on the circle and tangent stays perpendicular at every shown state |
| Parabolas — `parabolas` | Show focus/directrix distances for a moving point | Equal-distance property holds; use a safe switch for orientation/sign changes that would cross invalid $p=0$ |
| Ellipses — `ellipses` | Move a point and display the sum of distances to foci | Maintain valid semiaxes; no finite directrix in the circle limit |
| Hyperbolas — `hyperbolas` | Reveal construction rectangle, asymptotes, then branches | Branches stay separate; do not morph through a connecting central curve |
| Prisms — `prisms` | Step from solid to labeled net; highlight area contributions | Face sizes remain consistent; oblique cases do not use right-only area shortcuts |
| Parallelepipeds and Cubes — `parallelepipeds-cubes` | Highlight face versus space diagonal; unfold a cube net | Identify which diagonal is active and keep dimensions fixed during a net fold |
| Cylinders — `cylinders` | Unroll the curved wall; reveal pipe cross-section and annular ends | Rectangle width matches circumference; distinguish material volume from capacity |
| Pyramids — `pyramids` | Reveal altitude/slant/lateral-edge sections; move liquid level | Similarity determines the partially filled dimensions; wetted wall excludes exposed liquid surface |
| Cones — `cones` | Reveal axial triangle, unfold sector, switch to cube-inscribed preset | Sector arc length matches the base circumference; cube preset derives linked dimensions |
| Spheres and Spherical Segments — `spheres-segments` | Move cutting planes or bowl fill level; toggle zone and flat disks | Derive cut radii from the same sphere; distinguish curved/wetted area from total segment boundary |

Use existing actual diagram components and their capabilities. If a full 3D net animation is absent, a clear selectable solid/net pair with a short transition is preferable to a geometrically wrong folding animation. Do not add heavy 3D infrastructure solely for decorative motion.

## 8. Quiz and formula-practice motion

Apply this to the integrated quiz page, using the same main-site motion language.

### Selecting and locking an answer

- Selecting an option changes its border/surface promptly without grading it yet.
- On lock, commit the answer once, stop its timer, and update the actual score before any optional visual flourish.
- In Learn mode, reveal correct/incorrect labels and the explanation with a short entrance. A small one-time success indicator is sufficient.
- Incorrect answers receive a calm, legible explanation. No shaking, flashing, punitive motion, or repeated warning pulse.
- In Test mode, neither movement, color, sound, timing differences, progress decoration, nor score counters may reveal correctness before the results page. Only neutral “Answer recorded” feedback appears.
- Disable repeated submission through state logic, not by waiting for a transition or relying only on a visually disabled button.

### Moving to the next question

Use a small fade/translation around the whole question region. Preserve enough layout stability that the answer action does not jump unpredictably beneath a learner's pointer. Allow the region to grow for longer questions and display formulas at their natural readable size.

Do not crossfade individual mathematical symbols, scramble answer text, animate equation typing, or move the correct option into place. Store shuffled option order for the current question; animations must not reshuffle it.

### Scores and progress

Animate a progress bar briefly toward the real new value. If using a decorative score count-up, keep its accessible value at the true score and expose the final value immediately for reduced motion. A count-up must not change the stored score or delay access to the next prompt.

On results, one restrained summary entrance is enough. Keep answer review immediately available. Avoid a long confetti or depth-descent sequence that blocks reviewing mistakes.

### Timers

Timers measure time independently of animation frames and callbacks. Starting a CSS entrance must not start a second timer. Route remounts, retries, tab visibility changes, and interrupted transitions must not duplicate intervals or award extra time accidentally. Preserve the specified dialog pause policy and clear all timer resources on exit.

Formula Practice remains untimed by default. Decorative motion does not consume a learner's response window before the prompt is available. Define a clear prompt-ready moment for any optional timed mode.

## 9. Reduced motion and access

Honor `prefers-reduced-motion` in both CSS and any JavaScript-driven animation. If the site already has a motion preference setting, integrate with it and keep its precedence explicit. An additional setting is optional; OS preference support is required.

In reduced-motion mode:

- Remove positional movement, scaling effects, stagger, automatic geometry playback, and animated counting.
- Present the final correct UI state immediately; a brief nonmoving color change is acceptable if comfortable.
- Keep every control, explanation, selected state, and score fully functional.
- Preserve essential instructional information through manually stepped or static diagrams. Do not remove the underlying learning content.
- Avoid smooth automatic scrolling.

Scope overrides to the motion system rather than blindly setting every animation on the entire document to a tiny duration. Third-party components may have different completion behavior. State cleanup must work even when no `animationend` or `transitionend` event fires.

A possible scoped CSS approach, using example class names only:

```css
@media (prefers-reduced-motion: reduce) {
  .motion-enter,
  .motion-panel,
  .motion-feedback {
    animation: none;
    transition: none;
    transform: none;
    opacity: 1;
  }

  .motion-progress {
    transition: none;
  }
}
```

Apply the actual preference to canvas, SVG, requestAnimationFrame loops, and library-based animations too; CSS alone does not stop every JavaScript loop.

Focus indicators must appear immediately and remain visible throughout transitions. Live feedback should announce meaningful outcomes once, not every count-up frame, slider tick, or progress-bar movement.

## 10. Performance and maintenance

- Prefer opacity and small transforms for decorative entrance/exit effects; use layout-changing effects only where the layout genuinely changes, such as an expanding explanation.
- Avoid animating large shadows, repeated blur filters, entire-page height, or every table/math descendant.
- Do not keep permanent rendering hints or per-element animation loops on every card in a long page.
- Reuse shared motion helpers and tokens instead of copying bespoke timing rules into each module.
- Clean up observers, intervals, timeouts, and animation handles when components are removed.
- Avoid forced layout reads/writes on every pointer event. Keep coordinate transforms and model updates consistent with the diagram renderer's architecture.
- Motion must not create horizontal overflow, duplicate scroll containers, clipped dropdowns, unstable reading columns, or growing memory use after repeated navigation.
- Existing functionality and mathematical accuracy take priority when an effect conflicts with them.

## 11. Implementation sequence

1. Audit existing UI/motion code, shared components, Hallmark integration, and diagram capabilities.
2. Confirm the current layout and long-name navigation fix remain correct before adding motion.
3. Add shared tokens and a single reduced-motion preference path.
4. Implement controls, disclosures, navigation, and dialog motion in shared components.
5. Add the lesson/question content boundary and safe quiz feedback/progress updates.
6. Add appropriate mathematical demonstrations using the existing module components; cover all 15 modules without forcing the same effect onto every diagram.
7. Test reduced motion, interruptions, quiz correctness secrecy, navigation, and responsiveness; remove any effect that harms reading or interaction.

Do not stop after animating a hero or adding hover effects to the homepage. Complete the shared interaction states and quiz flow, and review all module-specific visualizations for appropriate behavior.

## 12. Acceptance and verification

| Scenario | Expected result |
|---|---|
| Normal lesson navigation | Subtle content change; shell stays stable; route and focus are correct |
| Rapid repeated navigation | Latest route wins; no stale panel, duplicate listener, or stuck opacity |
| Long module/lesson names | Labels wrap within navigation through all animation states |
| Mobile dropdowns | Remain compact and usable; no animated permanently expanded course menu |
| Long math explanation opens | Real readable expansion with no clipped fractions or overlap |
| Slider manipulation | Diagram, labels, and numbers agree without visible easing lag |
| Change between incompatible model presets | Valid crossfade/step instead of misleading invalid intermediate geometry |
| Learn-mode answer lock | One committed answer and score update; readable feedback follows |
| Test-mode answer lock | Neutral motion and feedback; no correctness signal before results |
| Double click / rapid Enter | Exactly one submission and one progress increment |
| Optional timer expires during UI activity | Correct single timeout handling, with the defined pause policy |
| Reduced motion enabled | Functional final states immediately; no positional entrance or autoplay |
| Reduced motion changes while page is open | Current state remains usable and unnecessary animation stops |
| Keyboard focus during a dialog/transition | Correct focus trap/return and no hidden-but-focusable outgoing content |
| 320–390 px phone, tablet, desktop | No motion-induced overflow, clipping, or loss of controls |
| 200% zoom / larger text | No fixed-height cuts in long labels, choices, or explanations |
| Back/forward and route exit | Correct content and scroll behavior; timers and animation resources cleaned up |
| Both site themes | Motion states remain readable and consistent with the main design |

Use the repository's existing checks and actual browser visual review. Add focused regression checks for stateful behavior where useful; do not assert that a successful build proves that animation looks correct.

At completion, report which shared components and module demonstrations changed, how reduced motion is handled, which quiz/navigation regressions were checked, and any effect that could not be implemented faithfully. Include the actual checks performed and concrete remaining limitations rather than claiming unsupported browser coverage.
