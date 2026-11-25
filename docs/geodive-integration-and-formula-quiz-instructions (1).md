---
title: "GeoDive Integration and Formula Quiz Expansion"
version: "1.1"
inputs:
  - "geodive.html"
  - "geometry-website-content-pack.md"
  - "geometry-ui-overhaul-instructions.md"
new_formula_questions: 90
modules: 15
---

# Integrate GeoDive as the website's quiz page

## Copy this task into the IDE assistant

> Add the supplied `geodive.html` quiz app as a separate page within the existing website. Refactor it into the project's normal architecture and reuse the main website's current, already-overhauled design, shared shell, Hallmark integration, theme, typography, components, and responsive behavior. Keep the main website's brand and navigation; GeoDive is a feature within it. Also fix the shared module/lesson navigation overflow for long names, following the required navigation fix in section 3. Preserve the working quizzes, explanations, review, retries, and progress. Add a dedicated Formula Practice mode using the 90 new question seeds below. Formula answers must be selected from rendered mathematical choices, not typed as LaTeX or free text. Preserve typed recall only for suitable vocabulary questions. Use the corrected content pack as the mathematics authority. Complete the integration, formula expansion, progress migration, and verification; do not stop at a plan, cosmetic mockup, or iframe wrapper.

This file is an implementation brief with a concrete new formula-question bank. It does not assert that the main website's code or its final redesigned appearance was inspected here. Inspect those in the IDE before choosing files, components, or APIs.

## 1. Inputs and authority

| Input | Use |
|---|---|
| `geodive.html` | Existing game behavior and question content; a prototype to refactor |
| Current main website | Authority for implemented design, shared shell, navigation, responsive layout, and theme |
| `geometry-website-content-pack.md` | Correct mathematical content, lesson IDs, source references, and source-error decisions |
| `geometry-ui-overhaul-instructions.md` | Background constraints and regression checklist; do not use it to overwrite a newer completed main-site design |
| This document | New integration behavior and formula-question requirements |

The inspected GeoDive prototype contains **105 multiple-choice questions**, **15 open-recall prompts**, and 15 module categories. Add the 90 distinct formula questions below, retaining the original questions. The target bank is **195 choice questions plus 15 recall prompts**, or **210 total prompts**. Derive UI counts from the actual bank rather than hard-coding those totals.

The PDFs are optional editorial references if the corrected content pack is present. New formulas, diagrams, and instructions should not require fetching the PDFs at runtime.

## 2. Separate page, shared website

### Route and navigation

- Add a dedicated route such as `/quiz`, following the actual router/base-path conventions. If the site uses static HTML pages, an equivalent `quiz.html` page may be appropriate.
- Add a clear **Quiz** link within the existing navigation and mobile navigation. Do not replace the lessons homepage, formula reference, or existing practice content with the quiz page.
- Reuse the real site header, logo/brand, footer, theme state, container, and navigation components. Do not mount the prototype's separate header/footer inside them.
- Make the quiz page directly addressable, refresh-safe, and reachable through browser history. Use the project's existing route conventions for setup, active session, and results.
- Offer **Practice this module** links from module pages. Carry the stable module identifier into the quiz setup and preselect it.
- Add **Review this lesson** links from quiz explanations where a verified lesson mapping is available. Do not invent routes from guessed slugs.
- Warn before abandoning an active run through in-app navigation. Finishing a run and returning to lessons should feel like moving within one product.

### Refactor rather than embed

Do not use an iframe, `srcdoc`, or an injected complete HTML document as the final integration. Extract data, session logic, presentation, and persistence into the existing architecture. Use the project's framework only if it already uses one; a framework migration is not part of the task.

Replace document-wide event handlers and global selectors with component- or page-scoped behavior. Cancel timers and unsubscribe listeners when leaving the page. Avoid duplicate event registration during rerenders, route changes, or development hot reload.

Keep the prototype's behavior where it remains useful, but improve its implementation to fit the site. Preserve underlying question correctness and source notes rather than copying a fragile HTML-string renderer unchanged.

## 3. Match the completed main-site design

Inspect representative completed pages: a module overview, a lesson with math, a worked example, and the mobile navigation. Identify their actual components and design tokens before changing GeoDive.

Reuse:

- Brand treatment and page-header scale.
- Hallmark's actual installed/imported integration and supported styling hooks.
- Reading and UI fonts, math fonts, type sizes, line heights, and spacing.
- Current light/dark palettes, accent colors, surfaces, borders, corners, and focus states.
- Buttons, labeled selects, inputs, chips, dialogs/disclosures, progress bars, and feedback states.
- Page width, responsive breakpoints, mobile dropdown behavior, and shared navigation.

Remove or replace the prototype's independent navy/mint palette, system-font declarations, oversized hero, submarine illustration, marketing footer, and separate brand header where they conflict with the main site. Do not recolor the main website to match GeoDive. Keep the quiz flow and progress metaphor only where they fit the main-site design.

The integrated page can be titled **Quiz** or **Quiz & Recall**, with GeoDive as a secondary feature name if appropriate. Avoid presenting it as a second unrelated product.

Keep the mathematical renderer's fonts intact. Do not invent Hallmark components, provider names, imports, or configuration APIs. Reuse the exact implementation already present in the project.

### Required shared fix: long module and lesson names must stay inside navigation

**New screenshot reference:** `image(20261124-200030).png`. The module control displays “11 · Parallelepipeds and Cubes,” while the lesson links below it extend toward or into the main lesson column. Long entries include “Cubes and rectangular parallelepipeds,” “General parallelepipeds and painting,” and “Packing, unit conversion, and shell subtraction.”

Treat this as a **shared course-navigation layout defect**, affecting lessons as well as the new quiz page. Fix the shared component and its layout constraints so all routes benefit. It is not sufficient to shorten this particular course name or add a quiz-only override.

The screenshot suggests overflow from lesson rows or their parent track; it does not establish the exact DOM or CSS cause. Inspect the actual module selector, lesson list, sidebar, and main-content grid before choosing a fix.

#### Inspect the actual cause

Check for:

- Navigation labels inheriting `white-space: nowrap`, fixed line height/height, `width: max-content`, or a nonshrinking flex basis.
- Grid/flex children retaining their default minimum content width instead of being allowed to shrink.
- List/link widths plus padding/borders exceeding the sidebar's available width.
- A fixed-width native select or custom trigger exceeding its parent.
- Active-item backgrounds, marker elements, or pseudo-elements having independent oversized widths.
- Absolute positioning, negative margins, transforms, or breakpoint rules that move the lesson list outside normal layout.
- A custom menu panel sized to its longest option without viewport/collision constraints.
- Inherited Hallmark/prose rules that unintentionally affect navigation text.

#### Required desktop behavior

1. Keep a deliberate navigation track and a separate flexible main-content track with a real gap using the current design tokens. Long text must not change the allocation unexpectedly or paint into that gap/main area.
2. Let the main track shrink safely, typically through a grid track equivalent to `minmax(0, 1fr)`, and apply `min-width: 0` where needed to navigation and content children.
3. Keep the module selector, lesson list, each row, and the active background within the navigation track's inner width, including their padding and borders.
4. **Wrap lesson names naturally onto multiple lines** at word boundaries. Let row height grow with the label. Keep comfortable line height and vertical padding.
5. Keep active markers/icons in their own nonshrinking space; give the label the remaining flexible space. Wrapped continuation lines should align with the label's first line, not under the marker.
6. Use emergency word wrapping only for unusually long unbroken tokens. Do not break every ordinary word into arbitrary characters.
7. Do not shrink the type until long labels fit, remove meaningful words, widen the sidebar indefinitely, or truncate every lesson name with ellipses.
8. Avoid blanket `overflow: hidden` on the sidebar. It can conceal the defect while cutting off text, focus rings, or a real popup.

**Native module select:** Constrain the closed control to its container, using the equivalent of `width: 100%`, `max-width: 100%`, `min-width: 0`, and border-box sizing in the actual component system. Native select text and open option menus are rendered differently across platforms; do not assume styling `option { white-space: normal }` guarantees wrapping. If the closed control cannot display the full selected title, provide the complete selected module name in adjacent visible text. A tooltip alone is insufficient on touch devices.

**Custom module select:** Reuse the existing accessible component. Give the trigger a shrinking/wrapping label track and a separate chevron track. Allow trigger height to grow if its design wraps the selected title. Constrain the open panel to the viewport, preserve keyboard/focus behavior, and wrap long option labels. A menu may intentionally overlay nearby content while open; the persistent overlap of closed navigation/lesson rows is the defect to remove. Increasing `z-index` alone does not fix it.

#### Illustrative layout pattern

Adapt the following responsibilities to the actual markup and design tokens. These class names are examples, not known project selectors or Hallmark APIs. Reuse existing classes/components instead of creating a competing style layer.

```css
.course-layout {
  display: grid;
  grid-template-columns: minmax(0, 17rem) minmax(0, 1fr);
  gap: 2rem; /* Prefer the current site's spacing token. */
}

.course-navigation,
.course-main,
.course-navigation__list,
.course-navigation__item {
  min-width: 0;
}

.course-navigation__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.course-navigation__link {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 0.375rem minmax(0, 1fr);
  align-items: start;
  column-gap: 0.625rem;
  width: 100%;
  padding: 0.625rem 0.75rem;
}

.course-navigation__label {
  min-width: 0;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: normal;
  line-height: 1.45;
}

.course-navigation__select {
  box-sizing: border-box;
  display: block;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}
```

Use the two-column link pattern only when the actual link has separate marker and label children. A text-only link does not need an empty marker column. Position a marker deliberately at the first text line, using the existing visual design; do not vertically stretch it with the entire wrapped row.

Retain the main site's existing content-fit breakpoint. At compact widths, switch the page to one content column and use the already-required **Module** and **Lesson** dropdown selections instead of the desktop lesson list. A fixed desktop sidebar plus a very narrow main column is not an acceptable intermediate layout.

#### Mobile, zoom, and regression checks

- Check the reported module and all of its lesson names at 320, 375, 390, 768, 1024, and 1440 px widths, plus the actual navigation breakpoint on either side.
- Include “Spheres and Spherical Segments” and “Trapezoids and general convex quadrilaterals” as additional long-name cases.
- Verify the active and inactive states, keyboard focus ring, hover state, light/dark themes, 200% zoom, and increased text size.
- In desktop flow, check that every label and active-row background stays inside the navigation's allocated bounds, and that the main heading/explanation begins after the actual grid gap.
- In compact flow, check both selectors' closed states, opened menus, selected values, and the full-name fallback where native controls truncate text.
- Confirm navigation remains usable through touch, keyboard, and browser back/forward.
- Check that the document has no horizontal overflow. Resolve the offending child rather than hiding overflow on `html` or `body`.
- Preserve visible focus rings. Do not make the bounding-box check pass by clipping them away.

**Done means:** long module and topic names remain readable, rows grow as needed, the main lesson never shares space with persistent navigation content, and the shared fix reaches the existing lessons and the integrated quiz page. Include the affected module in before/after visual verification.

## 4. Quiz modes and answer interaction

Separate the **question category** from the **session behavior**. A user should be able to choose formula questions with either immediate feedback or end-of-run feedback.

| Question category | Interaction | Default timing |
|---|---|---|
| Formula Practice — primary addition | Select a rendered formula from four choices | Untimed |
| Problem Solving | Existing numerical/conceptual multiple-choice questions | Untimed |
| Vocabulary Recall | Type one short geometric term from a curated accepted set | Untimed in custom practice; retain the daily recall challenge separately |
| Mixed Review | Include selected categories, clearly identified per prompt | Untimed |

Session behavior choices:

- **Learn:** explanation and correct answer after the learner locks an answer.
- **Test:** correctness and explanations revealed after the final question.

Retain the optional seven-prompt daily recall challenge and its vocabulary-only typed input. The short timed format is optional; it must not force students to type equations or race through algebra.

Formula Practice is the recommended path for “guess the formula.” Do not use answer rarity, authored vocabulary tiers, or open-ended string matching to grade formula selections.

### Required formula interaction

1. State what quantity or relationship is requested.
2. Define the symbols and geometric conditions in the prompt or a concise visible note.
3. Show four properly rendered formula choices with one correct choice.
4. Allow mouse, touch, and keyboard selection; use clear selected and focus states.
5. Require **Check answer** or **Lock answer** before committing.
6. Show the correct formula, a useful explanation, and a linked lesson/source after submission in Learn mode.
7. Review missed formulas at the end, with a retry option.

Use option IDs for grading. The prototype's vocabulary normalizer removes punctuation and other symbols; applying it to formulas could erase mathematical differences such as a minus sign. Do not reuse it for equations.

### Optional follow-up exercises

These can follow the required 90 recognition questions; they do not replace that bank:

- **Fill one missing token:** choose a coefficient, exponent, operator, or denominator from buttons.
- **Match a quantity to a formula:** click a quantity and its matching expression; provide a keyboard/touch equivalent to any drag interaction.
- **Spot the mistake:** select which part of a displayed formula is wrong, then reveal the corrected form.

No mandatory free-text formula input, LaTeX keyboard, external equation editor, or generic AI grader is needed. Optional numerical substitutions may use a simple numeric field with clearly specified units and rounding.

## 5. Formula bank authoring rules

The tables below contain **90 seed questions: six per module**. Each row is one new formula-recognition question. The IDE assistant must turn each row into a complete question record with four choices, a stable correct-choice ID, a concise explanation, and source/lesson metadata.

### Common notation

- $K$ is plane area, $P$ is perimeter, $B$ is the area of one solid base, and $P_b$ is base perimeter.
- $A_L$ is lateral area and $A_T$ is the total area of the explicitly included boundary surfaces.
- $h$ denotes a perpendicular height unless a different subscript is given; $L$ denotes a prism's perpendicular length.
- Triangle sides $a,b,c$ are opposite vertices $A,B,C$; $s_p=(a+b+c)/2$.
- In regular polygons, side length is $s$ and apothem is $r_a$.
- For parabolas, $p\ne0$ is signed; for ellipses/hyperbolas, $a,b,c$ have their content-pack meanings.
- For spheres, $R$ is sphere radius and $r$ is a cut-circle radius.

Each actual question must restate the relevant symbols; learners should not need to memorize this authoring notation section to interpret a prompt.

### Distractors and mathematical uniqueness

Create three plausible distractors based on real mistakes: missing $1/2$ or $1/3$, swapping radius and diameter, adding instead of subtracting focal squares, confusing slant and perpendicular height, or adding an excluded face.

- Exactly one option must be correct under the stated conditions.
- Do not use algebraically equivalent formulas as separate correct/incorrect options. For example, $Pa/2$ and $aP/2$ cannot be opposing choices.
- Check uniqueness across the whole permitted variable domain, not one numerical substitution where expressions happen to coincide.
- Keep notation and symbol definitions identical across choices; the difference should test mathematics, not formatting.
- Specify a noncircular ellipse, a nondegenerate triangle, a right prism, or closed/open surfaces where needed.
- Use a representative diagram where it clarifies the prompt. Avoid rendering labels that accidentally reveal the answer before submission.
- Source references below identify the corrected content pack. If the original PDF is incorrect, use the pack's corrected mathematics.
- New distractors and question wording are authored adaptations, not verbatim source quotations.

## 6. The 90 new formula-question seeds

### A. Plane Figures and Polygons — `plane-figures-polygons`

| ID | Prompt / target | Correct formula | Conditions and reference |
|---|---|---|---|
| FG-POLY-01 | Perimeter of a regular $n$-gon with side $s$ | $P=ns$ | Integer $n\ge3$, $s>0$; POLY-03 |
| FG-POLY-02 | Each interior angle of a regular $n$-gon | $\theta_i=(n-2)180^\circ/n$ | Distinguish each angle from the total sum; POLY-03 |
| FG-POLY-03 | Number of polygon diagonals | $N_d=n(n-3)/2$ | Count, not length; POLY-03 |
| FG-POLY-04 | Apothem from side and side count | $r_a=s/[2\tan(\pi/n)]$ | Angle in radians; degree form uses $180^\circ/n$; POLY-04 |
| FG-POLY-05 | Regular-polygon area from perimeter and apothem | $K=Pr_a/2$ | Regular polygon; POLY-04 |
| FG-POLY-06 | Area ratio of similar polygons with corresponding side ratio $q=s_1/s_2$ | $K_1/K_2=q^2$ | Consistent numerator correspondence; POLY-02 |

### B. Triangles — `triangles`

| ID | Prompt / target | Correct formula | Conditions and reference |
|---|---|---|---|
| FG-TRI-01 | Area from base $b_0$ and its altitude $h$ | $K=b_0h/2$ | Perpendicular height; TRI-03 |
| FG-TRI-02 | Area from sides $a,b$ and included angle $\theta$ | $K=ab\sin\theta/2$ | Included angle; TRI-03 |
| FG-TRI-03 | Area from three sides | $K=\sqrt{s_p(s_p-a)(s_p-b)(s_p-c)}$ | Valid triangle, $s_p=(a+b+c)/2$; TRI-03 |
| FG-TRI-04 | Altitude to side $c$, given area $K$ | $h_c=2K/c$ | $c>0$; TRI-02 |
| FG-TRI-05 | Median to side $c$ | $m_c=\tfrac12\sqrt{2a^2+2b^2-c^2}$ | Side labels as defined; TRI-02 |
| FG-TRI-06 | Internal angle-bisector length from vertex $C$ | $\ell_c=\sqrt{ab[(a+b)^2-c^2]}/(a+b)$ | $a,b$ adjoin angle $C$; TRI-02 |

### C. Quadrilaterals — `quadrilaterals`

| ID | Prompt / target | Correct formula | Conditions and reference |
|---|---|---|---|
| FG-QUAD-01 | Area of a parallelogram with sides $a,b$, included angle $\theta$ | $K=ab\sin\theta$ | $0<\theta<\pi$; QUAD-01 |
| FG-QUAD-02 | The unordered pair of parallelogram diagonal lengths | $\{\sqrt{a^2+b^2-2ab\cos\theta},\sqrt{a^2+b^2+2ab\cos\theta}\}$ | Same included side angle; QUAD-01 |
| FG-QUAD-03 | Rectangle diagonal from length $L$ and width $W$ | $d=\sqrt{L^2+W^2}$ | Rectangle; QUAD-02 |
| FG-QUAD-04 | Rhombus area from diagonal lengths | $K=d_1d_2/2$ | Full diagonals; QUAD-03 |
| FG-QUAD-05 | Trapezoid area from bases and height | $K=(b_1+b_2)h/2$ | Parallel bases, perpendicular $h$; QUAD-04 |
| FG-QUAD-06 | Convex-quadrilateral area from sides and opposite-angle sum | $K=\sqrt{(s_p-a)(s_p-b)(s_p-c)(s_p-d)-abcd\cos^2((\alpha+\gamma)/2)}$ | Opposite interior angles $\alpha,\gamma$, consistent geometry; QUAD-04 |

### D. Cartesian Coordinates — `cartesian-coordinates`

| ID | Prompt / target | Correct formula | Conditions and reference |
|---|---|---|---|
| FG-CART-01 | Distance between two plane points | $d=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$ | Add squared differences; CART-02 |
| FG-CART-02 | Midpoint of a segment | $M=((x_1+x_2)/2,(y_1+y_2)/2)$ | Coordinate pair; CART-03 |
| FG-CART-03 | Point a fraction $t$ along the directed segment from $A$ toward $B$ | $Q=A+t(B-A)$ | $0\le t\le1$ for the segment; CART-03 |
| FG-CART-04 | Internal division with $AQ:QB=m:n$ | $Q=(nA+mB)/(m+n)$ | Coordinate-vector notation, $m,n>0$; CART-03 |
| FG-CART-05 | External division with unsigned $AQ:QB=m:n$ | $Q=(mB-nA)/(m-n)$ | Distinct endpoints, $m,n>0$, $m\ne n$; CART-03 |
| FG-CART-06 | Area of an ordered simple polygon | $K=\tfrac12\left\lvert\sum_{i=1}^{n}(x_i y_{i+1}-y_i x_{i+1})\right\rvert$ | Vertices in boundary order; index $n+1$ means vertex 1; CART-04 |

### E. Lines — `lines`

| ID | Prompt / target | Correct formula | Conditions and reference |
|---|---|---|---|
| FG-LINE-01 | Slope between two points | $m=(y_2-y_1)/(x_2-x_1)$ | $x_2\ne x_1$; LINE-01 |
| FG-LINE-02 | Point-slope equation | $y-y_1=m(x-x_1)$ | Finite slope; LINE-03 |
| FG-LINE-03 | Slope-intercept equation | $y=mx+b$ | Nonvertical line, $b$ its $y$-intercept; LINE-03 |
| FG-LINE-04 | Line with nonzero finite intercepts $a_x,b_y$ | $x/a_x+y/b_y=1$ | Intercepts on the respective axes; LINE-03 |
| FG-LINE-05 | Tangent of smaller angle between two nonperpendicular, finite-slope lines | $\tan\alpha=\left\lvert(m_2-m_1)/(1+m_1m_2)\right\rvert$ | $1+m_1m_2\ne0$; LINE-02 |
| FG-LINE-06 | Distance from $(x_0,y_0)$ to $Ax+By+C=0$ | $d=\lvert Ax_0+By_0+C\rvert/\sqrt{A^2+B^2}$ | $(A,B)\ne(0,0)$; LINE-03 |

### F. Conics and Circles — `circles`

| ID | Prompt / target | Correct formula | Conditions and reference |
|---|---|---|---|
| FG-CIRC-01 | Standard circle equation | $(x-h)^2+(y-k)^2=r^2$ | Center $(h,k)$, $r>0$; CIRC-02 |
| FG-CIRC-02 | Center of $x^2+y^2+Dx+Ey+F=0$ | $(h,k)=(-D/2,-E/2)$ | Normalized quadratic coefficients; CIRC-02 |
| FG-CIRC-03 | Radius squared from normalized general form | $r^2=(D^2+E^2)/4-F$ | A circle requires this result positive; CIRC-02 |
| FG-CIRC-04 | Tangent at circle point $T=(x_t,y_t)$ | $(x_t-h)(x-x_t)+(y_t-k)(y-y_t)=0$ | $T$ lies on a positive-radius circle; CIRC-03 |
| FG-CIRC-05 | Radius when the center and a tangent line are given | $r=\lvert Ah+Bk+C\rvert/\sqrt{A^2+B^2}$ | Tangent $Ax+By+C=0$, center not on it; CIRC-03 |
| FG-CIRC-06 | Focus-directrix definition of a noncircular conic | $PF=e\,d(P,\ell)$ | Positive eccentricity, nondegenerate construction; CIRC-01 |

### G. Parabolas — `parabolas`

| ID | Prompt / target | Correct formula | Conditions and reference |
|---|---|---|---|
| FG-PARA-01 | Standard parabola equation with horizontal axis | $(y-k)^2=4p(x-h)$ | Vertex $(h,k)$, signed $p\ne0$; PARA-02 |
| FG-PARA-02 | Standard parabola equation with vertical axis | $(x-h)^2=4p(y-k)$ | Same signed-parameter convention; PARA-02 |
| FG-PARA-03 | Focus of $(y-k)^2=4p(x-h)$ | $F=(h+p,k)$ | Horizontal axis; PARA-02 |
| FG-PARA-04 | Focus of $(x-h)^2=4p(y-k)$ | $F=(h,k+p)$ | Vertical axis; PARA-02 |
| FG-PARA-05 | Directrix of $(y-k)^2=4p(x-h)$ | $x=h-p$ | Horizontal axis, signed $p$; PARA-02 |
| FG-PARA-06 | Length of a parabola's latus rectum | $L_{LR}=4\lvert p\rvert$ | Length must be nonnegative; PARA-02 |

### H. Ellipses — `ellipses`

| ID | Prompt / target | Correct formula | Conditions and reference |
|---|---|---|---|
| FG-ELLI-01 | Horizontal-major-axis ellipse equation | $(x-h)^2/a^2+(y-k)^2/b^2=1$ | $a>b>0$; ELLI-02 |
| FG-ELLI-02 | Vertical-major-axis ellipse equation | $(x-h)^2/b^2+(y-k)^2/a^2=1$ | $a>b>0$; ELLI-02 |
| FG-ELLI-03 | Center-to-focus distance relation | $c^2=a^2-b^2$ | Noncircular ellipse; ELLI-01 |
| FG-ELLI-04 | Eccentricity | $e=c/a$ | $0<e<1$, $a$ semimajor; ELLI-01 |
| FG-ELLI-05 | Directrices of a horizontal-major-axis ellipse | $x=h\pm a^2/c$ | $c>0$; ELLI-02 |
| FG-ELLI-06 | Length of each latus rectum | $L_{LR}=2b^2/a$ | Full chord, not half-length; ELLI-01–02 |

### I. Hyperbolas — `hyperbolas`

| ID | Prompt / target | Correct formula | Conditions and reference |
|---|---|---|---|
| FG-HYP-01 | Horizontal-transverse-axis equation | $(x-h)^2/a^2-(y-k)^2/b^2=1$ | $a,b>0$; HYP-02 |
| FG-HYP-02 | Vertical-transverse-axis equation | $(y-k)^2/a^2-(x-h)^2/b^2=1$ | $a,b>0$; HYP-02 |
| FG-HYP-03 | Center-to-focus distance relation | $c^2=a^2+b^2$ | Nondegenerate hyperbola; HYP-01 |
| FG-HYP-04 | Eccentricity | $e=c/a$ | $e>1$, $a$ center-to-vertex distance; HYP-01 |
| FG-HYP-05 | Horizontal-transverse-axis asymptotes | $y-k=\pm(b/a)(x-h)$ | Match orientation, $a,b>0$; HYP-02 |
| FG-HYP-06 | Vertical-transverse-axis asymptotes | $y-k=\pm(a/b)(x-h)$ | Match orientation, $a,b>0$; HYP-02 |

### J. Prisms — `prisms`

| ID | Prompt / target | Correct formula | Conditions and reference |
|---|---|---|---|
| FG-PRISM-01 | Volume of any prism | $V=Bh$ | Perpendicular base-plane separation; PRISM-02 |
| FG-PRISM-02 | Right-prism lateral area | $A_L=P_bh$ | Right prism; do not imply a general oblique rule; PRISM-02 |
| FG-PRISM-03 | Closed-prism total area | $A_T=A_L+2B$ | Both base faces included; PRISM-02 |
| FG-PRISM-04 | Right triangular-prism volume | $V=b_0h_tL/2$ | $b_0,h_t$ matched triangle base/altitude; PRISM-02 |
| FG-PRISM-05 | Right triangular-prism total area | $A_T=b_0h_t+(u+v+w)L$ | Actual triangle side lengths $u,v,w$; PRISM-02 |
| FG-PRISM-06 | Volume of a right regular $n$-gonal prism from side $s$ and height $h$ | $V=ns^2h/[4\tan(\pi/n)]$ | Radian angle, valid regular base; POLY-04 + PRISM-02; derived combination |

### K. Parallelepipeds and Cubes — `parallelepipeds-cubes`

| ID | Prompt / target | Correct formula | Conditions and reference |
|---|---|---|---|
| FG-BOX-01 | Cube total surface area | $A_T=6q^2$ | Cube edge $q>0$; BOX-01 |
| FG-BOX-02 | Cube volume | $V=q^3$ | Same cube edge; BOX-01 |
| FG-BOX-03 | Cube face diagonal | $d_f=q\sqrt2$ | Lies within one square face; BOX-01 |
| FG-BOX-04 | Cube space diagonal | $d_s=q\sqrt3$ | Opposite vertices through the interior; BOX-01 |
| FG-BOX-05 | Rectangular-prism total area | $A_T=2(LW+LH+WH)$ | Three perpendicular edge lengths; BOX-01 |
| FG-BOX-06 | Rectangular-prism space diagonal | $d_s=\sqrt{L^2+W^2+H^2}$ | Not a general oblique formula; BOX-01 |

### L. Cylinders — `cylinders`

| ID | Prompt / target | Correct formula | Conditions and reference |
|---|---|---|---|
| FG-CYL-01 | Circular-cylinder volume using diameter $d$ | $V=\pi d^2h/4$ | Perpendicular height; CYL-01 |
| FG-CYL-02 | Right circular-cylinder lateral area | $A_L=2\pi rh$ | Right cylinder; CYL-01 |
| FG-CYL-03 | Closed right circular-cylinder total area | $A_T=2\pi rh+2\pi r^2$ | Both disks included; CYL-01 |
| FG-CYL-04 | Material volume of a right hollow cylinder | $V_m=\pi(R^2-r^2)h$ | Outer radius $R>r>0$; CYL-02 |
| FG-CYL-05 | All boundary area of an open-bore right pipe including both annular end faces | $A_{all}=2\pi(R+r)h+2\pi(R^2-r^2)$ | Inner + outer curved surfaces + two annuli; CYL-02 |
| FG-CYL-06 | Elliptic-cylinder volume | $V=\pi abh$ | $a,b$ are semiaxes; perpendicular height; CYL-03 |

### M. Pyramids — `pyramids`

| ID | Prompt / target | Correct formula | Conditions and reference |
|---|---|---|---|
| FG-PYR-01 | Volume of any pyramid | $V=Bh/3$ | Perpendicular altitude; PYR-02 |
| FG-PYR-02 | Regular-pyramid lateral area | $A_L=P_b\ell/2$ | Shared face slant height $\ell$; PYR-02 |
| FG-PYR-03 | Closed regular-pyramid total area | $A_T=P_b\ell/2+B$ | Include one polygonal base; PYR-02 |
| FG-PYR-04 | Slant height from altitude and base apothem | $\ell^2=h^2+r_a^2$ | Regular pyramid; PYR-01 |
| FG-PYR-05 | Lateral edge from face slant height and base side | $E^2=\ell^2+(s/2)^2$ | Half a base edge, regular pyramid; PYR-01 |
| FG-PYR-06 | Lateral edge from altitude and base circumradius | $E^2=h^2+R_b^2$ | Regular pyramid; PYR-01 |

### N. Cones — `cones`

| ID | Prompt / target | Correct formula | Conditions and reference |
|---|---|---|---|
| FG-CONE-01 | Circular-cone volume | $V=\pi r^2h/3$ | Perpendicular height; CONE-01 |
| FG-CONE-02 | Right circular-cone lateral area | $A_L=\pi r\ell$ | Slant height $\ell$; CONE-01 |
| FG-CONE-03 | Closed right circular-cone total area | $A_T=\pi r(\ell+r)$ | Include base disk; CONE-01 |
| FG-CONE-04 | Right-cone slant height | $\ell=\sqrt{r^2+h^2}$ | $r,h>0$; CONE-01 |
| FG-CONE-05 | Volume of the specified cone inscribed in a cube of edge $q$ | $V=\pi q^3/12$ | Base circle in one face, apex at opposite face center; CONE-03 |
| FG-CONE-06 | Closed total area of that cube-inscribed cone | $A_T=\pi q^2(1+\sqrt5)/4$ | Same placement: $r=q/2$, $h=q$; CONE-03 |

### O. Spheres and Spherical Segments — `spheres-segments`

| ID | Prompt / target | Correct formula | Conditions and reference |
|---|---|---|---|
| FG-SPH-01 | Sphere surface area | $A=4\pi R^2$ | Sphere radius $R$; SPH-01 |
| FG-SPH-02 | Sphere enclosed volume | $V=4\pi R^3/3$ | Sphere radius $R$; SPH-01 |
| FG-SPH-03 | Curved spherical-zone area | $A_z=2\pi Rh$ | $h$ is perpendicular zone height; no cut disks; SPH-02 |
| FG-SPH-04 | One-base spherical-cap volume | $V=\pi h^2(3R-h)/3$ | $0<h<2R$; SPH-02 |
| FG-SPH-05 | Two-base spherical-segment volume | $V=\pi h(3r_1^2+3r_2^2+h^2)/6$ | Consistent parallel cuts of one sphere; SPH-02 |
| FG-SPH-06 | Closed total boundary area of a one-base spherical cap | $A_T=2\pi Rh+\pi r^2$ | Include the circular cut disk; distinguish wetted bowl area; SPH-02–03 |

## 7. Four fully specified sample questions

Apply this level of clarity to the rest of the bank. Correct answers are marked here for authoring only; never reveal them in the live prompt.

### FG-POLY-03 — Diagonal count

**Prompt:** A simple polygon has $n\ge3$ vertices. Which formula counts its diagonals?

- A: $n(n-3)/2$ — correct.
- B: $n(n-3)$.
- C: $n(n-1)/2$.
- D: $(n-2)180^\circ$.

**Explanation:** Every vertex joins $n-3$ nonadjacent vertices. Divide by two because each diagonal was counted from both endpoints. B double-counts, C includes sides, and D is an angle sum.

### FG-PARA-06 — A length with signed parameters

**Prompt:** In $(y-k)^2=4p(x-h)$, the parameter $p\ne0$ is signed. Which expression gives the length of the latus rectum?

- A: $4\lvert p\rvert$ — correct.
- B: $2\lvert p\rvert$.
- C: $p^2$.
- D: $-4\lvert p\rvert$.

**Explanation:** The full focal chord has length $4\lvert p\rvert$. A length is positive. Avoid using $4p$ as the sole distractor unless the prompt explicitly fixes $p<0$; it equals the correct expression on the positive branch and can create ambiguity.

### FG-CYL-03 — Included surfaces

**Prompt:** A closed right circular cylinder has radius $r>0$ and height $h>0$. Which formula includes its curved wall and both circular disks?

- A: $2\pi rh+2\pi r^2$ — correct.
- B: $2\pi rh$.
- C: $2\pi rh+\pi r^2$.
- D: $\pi r^2h$.

**Explanation:** The wall unfolds to a $2\pi r$ by $h$ rectangle. Add two disks. B omits both disks, C omits one, and D is volume.

### FG-SPH-03 — Zone versus total boundary

**Prompt:** A sphere of radius $R$ is cut by parallel planes whose perpendicular separation is $h$. Which formula gives only the curved zone area?

- A: $2\pi Rh$ — correct.
- B: $2\pi Rh+\pi r_1^2+\pi r_2^2$.
- C: $\pi h(3r_1^2+3r_2^2+h^2)/6$.
- D: $2\pi Rh^2$.

**Explanation:** A zone is a curved surface. B adds flat cut disks, C is a segment volume, and D has cubic dimensions rather than area dimensions. Use consistent cutting geometry in any diagram.

## 8. Data and grading model

Use the project's language/types. This conceptual record is a schema recommendation, not an assumed dependency:

```text
Question {
  id: stable string
  moduleId: stable content-pack route identifier
  lessonIds: verified stable lesson IDs
  category: "formula" | "problem" | "vocabulary"
  interaction: "single-choice" | "text-recall"
  prompt: learner-facing text/math
  symbolDefinitions: optional list
  conditions: explicit assumptions
  options: [{id, latex or text, accessibleLabel}]
  correctOptionId: stable option ID, for single-choice
  acceptedAliases: only for vocabulary recall
  explanation: learner-facing reason
  distractorExplanations: optional map keyed by option ID
  sourceRefs: verified source/lesson records
  editorialStatus: adapted | corrected | supplemental
  formulaFamilyId: stable relationship identifier
}
```

Keep the correct option independent from its displayed letter or position. Shuffle a copy, then store the displayed order in the session. Changing selection must not change that order or the correct-answer identity.

The new question IDs in this document are quiz IDs. Keep the content pack's existing formula and lesson IDs unchanged and link them through metadata rather than renaming them.

### Avoid duplicate-formula overload

Some relationships occur in several lessons, such as $V=Bh$ and $e=c/a$. Keep their module-specific questions, but tag equivalent relationships with a shared `formulaFamilyId`. In mixed quizzes, avoid asking the same underlying relationship repeatedly while other requested families remain untested. If a larger requested run exhausts unique families, allow the remaining context variants and explain the available count honestly.

Do not count shuffled options, a different variable letter, or arbitrary scalar rearrangements as newly authored questions. The 90 specified seeds are the required baseline records.

## 9. Rendering, accessibility, and responsive behavior

- Reuse the website's real math component and its stylesheet integration. Formula choices must render fractions, roots, exponents, subscripts, absolute values, and signs clearly.
- Formula text is content, not an image. Keep an accessible spoken/text equivalent without exposing two confusing duplicate versions to assistive technology.
- On phones, stack formula choices vertically. Use auto height, comfortable padding, and enough line height for fractions. Long expressions such as Bretschneider's formula need a deliberate multiline presentation.
- Do not shrink formulas into unreadable text or let equation content overlap nearby options.
- Use a semantic single-choice control group, preferably native radios with full-choice labels or the project's established accessible equivalent.
- Preserve visible focus, selected state, disabled state, correct/incorrect labels, and keyboard operation.
- Do not rely solely on green/red. Include text or icons with accessible labels.
- Keep the main document as the primary scroll area. Avoid nested fixed-height question panels and page-wide horizontal scroll.
- Reuse existing module dropdowns and the compact mobile shell; do not restore the old non-collapsible mobile sidebar.
- When navigating between prompts, move focus predictably to the prompt heading. Do not repeatedly steal focus while a student is reading an explanation.
- Source notes and question IDs should be available in appropriate reference/debug areas, not crowd the main question.

## 10. Scores, timers, progress, and migration

### Scores

For formula and problem choice questions, award 100 points per correct answer, zero for incorrect/skipped/timed-out answers, and no speed bonus by default. Show accuracy separately from points. If the site retains a depth meter, clearly equate this with game points rather than measuring understanding or answer rarity.

Keep the existing authored vocabulary tiers only inside Vocabulary Recall and explain their meaning. Distinguish modes in score history so a longer run or a tiered recall game is not misleadingly compared with a fixed-length formula test.

### Timers

Formula practice defaults to untimed. Allow an optional limit through quiz setup. A daily vocabulary timer does not silently transfer into formula sessions. Define whether dialogs pause timed runs, and keep the behavior consistent. Use elapsed time for actual timing rather than assuming interval ticks occur on schedule.

### Progress

The prototype uses `geodive-v1` with legacy choice IDs such as `q0-0` and recall IDs such as `r0`. Preserve or migrate that data rather than resetting it because the UI changed.

- Map the old fixed module indices to verified stable module IDs. Do not infer the mapping from a reordered module array.
- Retain the 105 existing question IDs or record an explicit old-to-new ID mapping.
- Add the 90 formula questions with their new stable IDs. They begin unattempted.
- Use versioned, app-scoped storage and an idempotent migration marker. Do not import the same old history twice.
- Do not overwrite unrelated main-site lesson progress or wipe all origin storage.
- If the main site already has an appropriate progress store, integrate with it. Otherwise keep quiz progress separately namespaced.
- Track formula progress separately from problem-solving and vocabulary where useful. Distinguish “answered correctly once” from current accuracy across attempts.
- Handle unavailable storage gracefully and report that session progress will not persist.
- Clean up timers and session listeners when the route unmounts. Retrying missed questions should not double-submit or double-count an attempt.

## 11. Suggested integrated page flow

1. Open **Quiz** in the normal site shell.
2. Select a module or mixed modules, question category, Learn/Test behavior, question count, and optional timer.
3. Show the actual eligible-question count before starting. In one-module recall mode, the prototype may have only one eligible prompt; never promise seven when only one exists.
4. Render one prompt at a time with a visible progress indicator.
5. Select a formula/answer, lock it, and receive feedback according to the selected session behavior.
6. Finish with accuracy, points, missed questions, explanations, retry, and a return-to-lesson action.
7. Store progress and expose previous runs in the site's design language.

A learner should be able to choose **Formula Practice → Spheres → Learn → Untimed** without interacting with any typed-recall or rarity mechanic.

## 12. Implementation order and acceptance

### Work order

1. Inspect main-site architecture, current design system, Hallmark usage, and math renderer.
2. Inspect `geodive.html`, preserve its data, and identify the cleanest page/component integration.
3. Implement the new separate route and shared-shell navigation.
4. Refactor existing quiz behavior into scoped, maintainable code.
5. Add the formula category and all 90 seed questions, including three reviewed distractors per question.
6. Implement filters, feedback, grading, mixed-family sampling, progress migration, and lesson links.
7. Check the integrated design and mathematical behavior across all 15 modules.

### Completion checklist

- [ ] Quiz is a real separate page in the existing website, with direct navigation and working refresh/history behavior.
- [ ] It matches the completed main-site design and uses the actual Hallmark integration.
- [ ] Shared course navigation keeps long module and lesson names inside its bounds with readable wrapping and responsive dropdown behavior.
- [ ] No iframe, duplicate application header/footer, conflicting global styles, or second independent theme.
- [ ] Original 105 choice questions and 15 recall prompts remain available with corrected answers.
- [ ] All 90 new formula questions are implemented, six per module, with four rendered choices each.
- [ ] Every formula record has explicit symbols/conditions, a correct option ID, explanation, and source/lesson mapping.
- [ ] Formula input is selectable; no mandatory equation typing.
- [ ] Learn and Test feedback behavior works for the formula category.
- [ ] Only one choice is mathematically correct under each prompt's conditions; equivalent formulas are not conflicting options.
- [ ] Unsupported or ambiguous original PDF problems remain excluded from automatic scoring.
- [ ] Counts, selected categories, available pool sizes, and progress denominators are derived correctly.
- [ ] Legacy progress migration is repeat-safe and preserves existing main-site data.
- [ ] Both themes, narrow screens, keyboard navigation, and mathematical rendering work together.
- [ ] Complete-run scoring, repeated clicks, skip, timeout, retries, storage failure, route exit, and browser history have meaningful checks.

### Specific regression checks

| Check | Expected behavior |
|---|---|
| Long course/topic names | Wrapped lesson rows remain inside desktop navigation; mobile selectors stay within their container and show full names accessibly |
| Formula-only quiz | No typed-answer field; all prompts use formula choices |
| Formula default timing | Untimed, independently of the daily recall setting |
| Circle/ellipse/hyperbola forms | Signs and axis orientations remain intact in prompt and choices |
| Signed parabola parameter | Latus rectum uses $4\lvert p\rvert$ as a length |
| Cylinder surface count | Closed, open-top, and hollow-bore surfaces are stated explicitly |
| Sphere wet area | Curved contact area is distinguished from total segment boundary |
| Option shuffling | Correct option ID is preserved across order changes and rerenders |
| Test mode | Neither color nor feedback leaks correctness before completion |
| Stored legacy run | Old score/history is imported once, without erasing lesson progress |
| Formula retry | Only missed formula records are queued; grading and explanations still work |
| A very long expression on a 320 px viewport | Readable math and reachable controls; no page-wide horizontal overflow |
| Return from a question to a lesson | In-app leave warning for an unfinished run, then normal site navigation |

Use the repository's relevant checks and actual visual review. The standalone prototype previously received logic checks, but browser rendering was not verified in that executor; do not treat it as an already visually certified component.

### Final report from the IDE assistant

Report the added route, shared components reused, actual Hallmark integration changes, formula-question count by module, progress migration behavior, checks actually performed, and any concrete remaining limitation. This is an implementation request; finish the integration and expansion rather than returning only a proposal.
