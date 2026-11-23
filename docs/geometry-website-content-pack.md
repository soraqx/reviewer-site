---
title: "Engineering Mathematics 2: Geometry Website Content Pack"
version: "1.0"
language: "en"
audience: "Introductory college geometry and engineering mathematics students"
format: "Framework-independent Markdown with LaTeX mathematics"
source_documents: 7
source_pages: 209
content_policy: "Adapted instruction; corrected mathematics; source-linked examples; explicitly marked additions"
---

# Geometry Website Content Pack

## 0. Instructions for the IDE assistant

Use this file as the content specification for an educational website. It contains the teaching material, mathematical rules, worked examples, practice answers, diagram requirements, and source correction notes. Build the website within the user's existing project and design conventions. This file does not prescribe a framework, hosting service, authentication system, or backend.

### How to use this pack

1. Read this section and the correction log before implementing lessons or calculators.
2. Create the seven modules in the navigation order below. Use stable IDs for routes, search, examples, and progress records.
3. Treat module explanations and worked examples as student-facing content. Treat implementation notes, provenance, and the correction log as editorial/developer information.
4. Preserve LaTeX expressions. Render inline math with `$...$` and display math with `$$...$$`, or convert consistently to the project's math renderer.
5. Keep answer keys hidden until requested by the learner. Do not put editorial review items into automatically graded quizzes.
6. Use the corrected content in this pack when a source slide contradicts it. Do not copy known incorrect equations from the PDFs.
7. Draw mathematical figures from coordinates and equations. Screenshot decoration and slide backgrounds are not required assets.
8. Label any lessons, examples, applications, or questions added beyond this pack as newly authored content in the site's internal content records.

### Scope and editorial status

This is an adapted content pack, not a verbatim transcription. It retains the instructional topics and identifiable mathematical problems from all seven PDFs; combines repeated slides; turns image-based formulas into text; supplies independently derived answers; and flags incomplete or conflicting prompts. Institutional title slides, decorative images, historical digressions, and repeated bibliography slides are not lessons. The course sources identify the MPS Department, FEU Institute of Technology; retain source attribution in an About/Sources area without implying institutional endorsement.

All page citations below are **1-based PDF page numbers**, not printed labels. `P01`, `C01`, etc. are pack identifiers, not IDs from the original PDFs. Suggested interactions, accessibility requirements, additional explanations, and computational safeguards are implementation additions. Answer keys were derived for this pack unless an example already contains a valid source solution. No external websites or listed source bibliographies were consulted.

### Source manifest

| Source ID | Exact PDF filename | Pages | Content |
|---|---|---:|---|
| SRC-POLY | STPDF1_Plane_Figures_and_Polygons.pdf | 21 | Plane figures, polygons, similarity, regular polygon mensuration |
| SRC-CART | STPDF1 Review of Cartesian Coordinate System.pdf | 32 | Coordinates, distance, division, coordinate area |
| SRC-LINE | STPDF2 Lines.pdf | 22 | Slopes, angles, equations of lines |
| SRC-CIRC | STPDF1 Circles.pdf | 34 | Conic foundations, circles, tangent lines |
| SRC-PARA | STPDF2 Parabola.pdf | 33 | Parabolas and their equations |
| SRC-ELLI | STPDF3 ELLIPSE.pdf | 34 | Ellipses and their equations |
| SRC-HYP | STPDF4 HYPERBOLA.pdf | 33 | Hyperbolas and their equations |

### Navigation and prerequisites

| Order | Module ID / route slug | Title | Prerequisites | Lesson IDs |
|---:|---|---|---|---|
| 1 | plane-figures-polygons | Plane Figures and Polygons | Basic algebra and right-triangle trigonometry | POLY-01 through POLY-04 |
| 2 | cartesian-coordinates | Cartesian Coordinates | Basic algebra and the Pythagorean theorem | CART-01 through CART-04 |
| 3 | lines | Lines | CART-01, CART-02 | LINE-01 through LINE-03 |
| 4 | circles | Conics and Circles | CART-02, LINE-03, completing the square | CIRC-01 through CIRC-03 |
| 5 | parabolas | Parabolas | CIRC-01, completing the square | PARA-01 through PARA-03 |
| 6 | ellipses | Ellipses | CIRC-01, completing the square | ELLI-01 through ELLI-03 |
| 7 | hyperbolas | Hyperbolas | CIRC-01, ELLI-01, completing the square | HYP-01 through HYP-03 |

This yields **23 lessons**. A module page should expose its overview, outcomes, lessons, worked examples, practice, and summary formulas. Global search should match lesson titles, glossary terms, formula names, and example IDs.

### Suggested content record contract

This schema is a recommendation for turning the Markdown into structured content, not an additional artifact that already exists.

```text
Module: id, title, order, summary, prerequisiteIds[], objectiveTexts[], lessonIds[]
Lesson: id, moduleId, title, explanationMarkdown, formulaIds[], exampleIds[],
        interactionIds[], misconceptionTexts[], sources[]
Formula: id, name, latex, symbolDefinitions, applicability, units, sources[]
Example: id, lessonId, promptMarkdown, stepsMarkdown[], answerMarkdown,
         sources[], editorialStatus
Practice: id, lessonId, promptMarkdown, hintMarkdown, answerMarkdown,
          solutionMethod, gradingMode, editorialStatus, sources[]
SourceRef: sourceId, pageStart, pageEnd
Interaction: id, lessonId, controls, constraints, derivedOutputs, diagramSpec,
             accessibleDescription, expectedBehavior
```

Recommended `editorialStatus`: `adapted`, `corrected`, `supplemental`, or `needs-review`. Recommended `gradingMode`: `numeric`, `symbolic`, `coordinate`, `classification`, or `manual`. A `needs-review` item is excluded from live quizzes until an instructor resolves it.

### Shared notation and numerical rules

| Symbol | Meaning | Scope |
|---|---|---|
| $n$ | Number of polygon sides | Integer $n\ge3$ |
| $s,P,A$ | Side length, perimeter, area | Polygon lessons |
| $r_a$ | Apothem | Polygon lessons; sources use $a$ |
| $N_d$ | Number of diagonals | Polygon lessons; sources use $d$ |
| $(h,k)$ | Center or vertex, as specified | Conics |
| $r$ | Circle radius | Circle lessons |
| $p$ | Signed vertex-to-focus displacement | Parabolas only; sources often use $a$ |
| $a,b,c$ | Semiaxis parameters and center-to-focus distance | Ellipses and hyperbolas |
| $e$ | Eccentricity | Conics |
| $m$ | Slope | Lines |

Keep exact fractions and radicals in explanations. Round displayed measurement results at the end, usually to two decimals; do not round intermediate values. Angles are in degrees unless explicitly stated otherwise. Trigonometric programming functions commonly expect radians: convert degrees using $\theta_{rad}=\theta_{deg}\pi/180$. A count is dimensionless, lengths have linear units, and areas have square units.

For computer checks, compare scaled numerical residuals with a documented tolerance. Compare lines and polynomial equations up to a nonzero scalar multiple. Do not grade a valid equivalent equation as wrong because terms are ordered differently. A reasonable initial numeric answer tolerance is $10^{-6}$ for unrounded values; accept the stated rounding interval when the question requests rounded answers. Exact forms should remain accepted.

---

## 1. Plane Figures and Polygons

**Module ID:** `plane-figures-polygons`  
**Source:** SRC-POLY pp. 2–19.

**Overview:** Describe plane figures, compare similar polygons, and calculate the angles, diagonal count, perimeter, apothem, and area of regular polygons.

**Learning outcomes**

- Classify polygons by shape, side count, side lengths, and angle measures.
- Distinguish regularity from having equal sides alone.
- Apply similarity ratios to lengths, perimeters, and areas.
- Calculate regular polygon measurements with appropriate units.

### POLY-01 — Plane figures and polygon vocabulary

**Sources:** SRC-POLY pp. 3–10.

A **plane** is a flat, two-dimensional surface extending indefinitely. A **plane figure** lies in a plane. **Mensuration** concerns measurements such as lengths, areas, and volumes; this module focuses on plane measurements.

A **simple polygon** is a closed plane figure formed from at least three straight line segments. Adjacent sides meet at vertices, and nonadjacent sides do not cross. An open chain, a figure with a curved boundary, and a self-crossing chain are not simple polygons under this course's definition.

| Term | Student-facing definition |
|---|---|
| Side or edge | One segment forming a polygon's boundary |
| Vertex | A shared endpoint of adjacent sides |
| Diagonal | A segment joining nonadjacent vertices |
| Convex polygon | A simple polygon whose interior angles are all less than $180^\circ$ |
| Concave polygon | A simple polygon with at least one interior angle greater than $180^\circ$ |
| Equilateral polygon | A polygon with all side lengths equal |
| Equiangular polygon | A polygon with all interior angles equal |
| Regular polygon | A polygon that is both equilateral and equiangular |
| Interior angle | An angle inside the polygon between adjacent sides |
| Exterior angle | Here, the angle supplementary to an interior angle at a convex vertex |
| Central angle | For a regular polygon, the angle at the center between radii to adjacent vertices |
| Apothem | The perpendicular segment from a regular polygon's center to a side; it meets the side at its midpoint |

A rhombus need not be regular: equal sides do not force equal angles. A rectangle need not be regular: equal angles do not force equal sides. A square satisfies both conditions.

| Sides | Name | Sides | Name |
|---:|---|---:|---|
| 3 | Triangle | 12 | Dodecagon |
| 4 | Quadrilateral | 13 | Tridecagon |
| 5 | Pentagon | 14 | Tetradecagon |
| 6 | Hexagon | 15 | Pentadecagon |
| 7 | Heptagon | 16 | Hexadecagon |
| 8 | Octagon | 17 | Heptadecagon |
| 9 | Nonagon | 18 | Octadecagon |
| 10 | Decagon | 19 | Enneadecagon |
| 11 | Undecagon | 20 | Icosagon |

For larger counts, use the unambiguous label “$n$-gon.” Optional extended labels from the source are 30: triacontagon; 40: tetracontagon; 50: pentacontagon; 70: heptacontagon; 80: octacontagon; 90: enneacontagon; 100: hectogon; 1,000: chiliagon; 10,000: myriagon. Use “60-gon” instead of the source's incorrect repeated label “hexadecagon.” A megagon has $10^6$ sides, and a googolgon has $10^{100}$ sides. Large names are reference material, not core assessment targets.

**Diagram brief:** Show a triangle, convex pentagon, concave pentagon, open chain, curved-boundary figure, and self-crossing figure. Add a labeled regular hexagon with a side, vertex, diagonal, central angle, interior angle, exterior angle, center, and perpendicular apothem. Explain classification in text as well as color.

### POLY-02 — Similar polygons

**Source:** SRC-POLY p. 11; corrected ratio notation.

Two polygons are similar when corresponding angles are equal and corresponding sides share one scale factor. If polygon 1 and polygon 2 have corresponding side lengths $s_1,s_2$, then

$$q=\frac{s_1}{s_2},\qquad \frac{P_1}{P_2}=q,\qquad \frac{A_1}{A_2}=q^2.$$

All corresponding lengths, including apothems of similar regular polygons, scale by $q$. Areas scale by the square because both dimensions change.

**Supplemental example P-SIM:** Similar polygons have corresponding sides 6 cm and 9 cm. Their perimeter ratio is $2:3$ and their area ratio is $4:9$. If the smaller area is $20\text{ cm}^2$, the larger area is $20(3/2)^2=45\text{ cm}^2$.

**Common mistake:** Applying the length ratio directly to areas. First determine which polygon is the numerator; use the same correspondence throughout.

### POLY-03 — Angles, perimeter, and diagonals

**Sources:** SRC-POLY pp. 12–14.

For a regular polygon with $n$ sides of length $s$:

| Formula ID | Quantity | Formula |
|---|---|---|
| F-P01 | Perimeter | $P=ns$ |
| F-P02 | Central angle | $\theta_c=360^\circ/n$ |
| F-P03 | Interior-angle sum | $S=(n-2)180^\circ$ |
| F-P04 | Each interior angle | $\theta_i=(n-2)180^\circ/n$ |
| F-P05 | Each exterior angle | $\theta_e=180^\circ-\theta_i=360^\circ/n$ |
| F-P06 | Diagonal count | $N_d=n(n-3)/2$ |

The interior-angle sum applies to any simple $n$-gon. Equal individual interior angles and central angles here assume regularity. The diagonal-count formula also applies to any simple polygon when counting all pairs of nonadjacent vertices, including diagonals outside a concave polygon.

**Why these formulas work:** Drawing diagonals from a vertex of a convex polygon creates $n-2$ triangles. For the diagonal count, each of $n$ vertices can connect to $n-3$ nonadjacent vertices. Divide by two because each diagonal was counted from both ends. A diagonal count has no length unit.

### POLY-04 — Apothem and area

**Sources:** SRC-POLY pp. 15–19.

Split a regular polygon into $n$ congruent triangles by joining its center to every vertex. Bisect one triangle. Its opposite leg is $s/2$, adjacent leg is the apothem, and angle at the center is $180^\circ/n$:

$$\tan(180^\circ/n)=\frac{s/2}{r_a}.$$

Therefore,

$$\boxed{r_a=\frac{s}{2\tan(180^\circ/n)}}\tag{F-P07}$$

$$\boxed{A=\frac12Pr_a=\frac{ns^2}{4\tan(180^\circ/n)}}\tag{F-P08}$$

The first area form sums the $n$ triangle areas $\tfrac12sr_a$. Use these formulas for regular polygons, not arbitrary equilateral or irregular polygons.

#### Worked example P01 — Regular nonagon

**Source:** SRC-POLY p. 17. **Given:** $n=9$, $s=5\text{ cm}$.

1. $P=9(5)=45\text{ cm}$; $\theta_c=360^\circ/9=40^\circ$.
2. $S=7(180^\circ)=1260^\circ$; $\theta_i=140^\circ$; $\theta_e=40^\circ$.
3. $N_d=9(6)/2=27$.
4. $r_a=5/[2\tan20^\circ]\approx6.86869355\text{ cm}$.
5. $A=45r_a/2\approx154.55\text{ cm}^2$.

#### Worked example P02 — Recover the side count

**Source:** SRC-POLY p. 18. **Given:** $S=1800^\circ$, $P=180\text{ in}$.

1. $(n-2)180=1800$, so $n=12$: a dodecagon.
2. $s=180/12=15\text{ in}$.
3. $\theta_c=\theta_e=30^\circ$; $\theta_i=150^\circ$; $N_d=54$.
4. $r_a=15/[2\tan15^\circ]\approx27.99038106\text{ in}$.
5. $A=90r_a\approx2519.13\text{ in}^2$.

#### Worked example P03 — Recover $n$ from diagonals

**Source:** SRC-POLY p. 19. **Given:** $N_d=464$, $r_a=8\text{ ft}$.

1. $n(n-3)/2=464$ gives $n^2-3n-928=0$.
2. The roots are $32$ and $-29$; only $n=32$ is valid.
3. $\theta_c=\theta_e=11.25^\circ$; $S=5400^\circ$; $\theta_i=168.75^\circ$.
4. $s=2(8)\tan(180^\circ/32)\approx1.57586245\text{ ft}$.
5. $P\approx50.42759852\text{ ft}$; $A=Pr_a/2\approx201.71\text{ ft}^2$.

**Source rounding note:** The PDFs round intermediate values, producing different areas. The pack retains precision until the final answer.

**Interaction INT-POLY:** Let learners change integer $n$ from 3 to 32 and positive side length. Update every formula and a regular polygon drawing. Toggle center triangles, apothem, one diagonal, and all diagonals. Label diagonal count as a count. Provide presets P01–P03; P03 can initialize by apothem. If a calculator accepts a diagonal count, reject counts whose quadratic produces no integer $n\ge3$.

**Quick practice (supplemental):** A regular hexagon has side 4 cm. Find the perimeter, apothem, and area. **Answer:** $24\text{ cm}$, $2\sqrt3\text{ cm}$, and $24\sqrt3\text{ cm}^2$. A polygon has interior-angle sum $900^\circ$: **answer** $n=7$; if regular, each exterior angle is $360^\circ/7$.

---

## 2. Cartesian Coordinates

**Module ID:** `cartesian-coordinates`  
**Sources:** SRC-CART pp. 2–31.

**Overview:** Connect geometric positions to ordered pairs, then use coordinates to measure lengths, locate division points, and calculate areas.

**Learning outcomes:** Plot points; identify quadrants and axes; compute directed and ordinary distances; classify segments; divide segments internally or externally; calculate polygon areas from ordered vertices.

### CART-01 — The coordinate plane

**Sources:** SRC-CART pp. 4–9.

The horizontal $x$-axis and vertical $y$-axis meet at the origin $(0,0)$. An ordered pair $(x,y)$ gives a signed horizontal displacement followed by a signed vertical displacement. The coordinate axes are perpendicular and use a common scale when comparing geometric lengths.

| Region | Sign of $x$ | Sign of $y$ |
|---|---|---|
| Quadrant I | Positive | Positive |
| Quadrant II | Negative | Positive |
| Quadrant III | Negative | Negative |
| Quadrant IV | Positive | Negative |

Points with $x=0$ lie on the $y$-axis; points with $y=0$ lie on the $x$-axis. Axis points do not belong to a quadrant. Quadrants are numbered counterclockwise from the upper right. The source illustrates $(3,5)$ in quadrant I. “Octants” refer to three-dimensional space and are outside this two-dimensional lesson.

**Interaction INT-CART-PLOT:** Click or enter a point and display its coordinates, projections to both axes, and quadrant or axis classification. Include keyboard adjustment and reset. Keep the coordinate readout visible.

### CART-02 — Directed distance and distance between points

**Sources:** SRC-CART pp. 11–17.

On a number line, directed displacement from $A(x_1)$ to $B(x_2)$ is $x_2-x_1$. Reversing the direction changes its sign. Ordinary distance is the nonnegative value $|x_2-x_1|$.

In the plane, let $\Delta x=x_2-x_1$ and $\Delta y=y_2-y_1$. The Pythagorean theorem gives

$$\boxed{d=\sqrt{(\Delta x)^2+(\Delta y)^2}}\tag{F-C01}$$

| Segment case | Condition | Distance |
|---|---|---|
| Vertical | $x_1=x_2$, $y_1\ne y_2$ | $\vert y_2-y_1\vert $ |
| Horizontal | $y_1=y_2$, $x_1\ne x_2$ | $\vert x_2-x_1\vert $ |
| Oblique | Both coordinates differ | $\sqrt{(\Delta x)^2+(\Delta y)^2}$ |
| Coincident points | Both coordinates match | $0$; no unique joining line |

The two squares are **added**. A negative sign between them is a source error.

#### Worked example C01 — Right triangle from coordinates

**Source:** SRC-CART p. 17 item 1. Let $A=(4,-3)$, $B=(0,0)$, $C=(3,4)$.

1. $AB^2=4^2+(-3)^2=25$.
2. $BC^2=3^2+4^2=25$.
3. $AC^2=(-1)^2+7^2=50$.
4. Since $AB^2+BC^2=AC^2$, the angle at $B$ is $90^\circ$. Also $AB=BC=5$, so it is an isosceles right triangle.

**Supplemental proof tools:** To test collinearity without undefined slopes, compute the determinant $(x_B-x_A)(y_C-y_A)-(y_B-y_A)(x_C-x_A)$; zero means collinear. To prove a quadrilateral is a square, show four equal nonzero sides and one right angle, or four equal sides and equal diagonals. Equal sides alone establish a rhombus.

### CART-03 — Midpoints and division of a segment

**Sources:** SRC-CART pp. 19–26; midpoint formula made explicit.

For endpoints $A=(x_1,y_1)$ and $B=(x_2,y_2)$:

$$\boxed{M=\left(\frac{x_1+x_2}{2},\frac{y_1+y_2}{2}\right)}\tag{F-C02}$$

A unified parameter form is

$$\boxed{Q=A+t(B-A)}\tag{F-C03}$$

For $0<t<1$, $Q$ is inside the segment; $t=0,1$ gives its endpoints; $t<0$ or $t>1$ gives a point on the extended line.

For **internal division** with $AQ:QB=m:n$, where $m,n>0$:

$$\boxed{Q=\left(\frac{nx_1+mx_2}{m+n},\frac{ny_1+my_2}{m+n}\right)}\tag{F-C04}$$

Here $t=m/(m+n)$. Notice the crossed weights: the coordinate of $A$ is multiplied by $n$.

For **external division** with unsigned distances $AQ:QB=m:n$, where $m,n>0$ and $m\ne n$:

$$\boxed{Q=\left(\frac{mx_2-nx_1}{m-n},\frac{my_2-ny_1}{m-n}\right)}\tag{F-C05}$$

Here $t=m/(m-n)$. For distinct endpoints, equal unsigned distances do not give a finite external division point. Do not apply that restriction to a different problem where an already known point is the midpoint of two other points.

#### Worked example C02 — Internal ratio $3:1$

**Source:** SRC-CART p. 25 item 1. Find $B$ on $AC$ when $A=(9,5)$, $C=(-7,1)$, and $AB:BC=3:1$.

1. $t=3/(3+1)=3/4$.
2. $B=(9,5)+(3/4)(-16,-4)=(-3,2)$.
3. Check: $AB=(3/4)AC$ and $BC=(1/4)AC$.

**Interaction INT-CART-DIVIDE:** Drag $A$ and $B$ or adjust $t$. Mark internal/external position, coordinates, and ratios. Explain the distinction between a directed parameter and an unsigned ratio. Reject coincident endpoints when a unique ratio construction is requested.

### CART-04 — Area from coordinates

**Sources:** SRC-CART pp. 28–31.

For a triangle,

$$\boxed{A=\frac12\left|x_1(y_2-y_3)+x_2(y_3-y_1)+x_3(y_1-y_2)\right|}\tag{F-C06}$$

For an ordered simple polygon with vertices $V_i=(x_i,y_i)$ around its boundary and $V_{n+1}=V_1$:

$$\boxed{A=\frac12\left|\sum_{i=1}^n(x_i y_{i+1}-y_i x_{i+1})\right|}\tag{F-C07}$$

This is the **shoelace formula**. The absolute value produces nonnegative geometric area. Vertex order matters: enter points around the perimeter, not in an arbitrary list. A self-crossing input gives an algebraic signed-area quantity and should be flagged rather than presented as the simple polygon's area.

#### Worked example C03 — Triangle area

**Source:** SRC-CART p. 29 item 1. Vertices: $(1,2)$, $(-2,1)$, $(3,0)$.

1. Forward products: $1(1)+(-2)(0)+3(2)=7$.
2. Backward products: $2(-2)+1(3)+0(1)=-1$.
3. $A=|7-(-1)|/2=4$ square units.

**Interaction INT-CART-AREA:** Let learners add and drag ordered vertices. Show numbered vertices, cross products, signed area, and absolute area. Reversing the order should reverse the signed area and preserve the absolute area. Detect self-crossings and duplicate consecutive points.

### Cartesian practice bank

The following tables adapt the source exercise sets. Entries marked review are editorial records only.

| ID | Source | Prompt | Answer / teaching note |
|---|---|---|---|
| C-P01 | p. 12 item 1 | Directed distance from $A=6$ to $B=-4$ | $-10$ |
| C-P02 | p. 12 item 2 | From $A=-\sqrt{48}$ to $B=-\sqrt{12}$ | $2\sqrt3$ |
| C-P03 | p. 12 item 3 | From $A=k$ to $B=3k$ | $2k$ |
| C-P04 | p. 12 item 4 | From $A=x+y$ to $B=x+y$ | $0$ |
| C-P05 | p. 12 item 5 | From $A=\sqrt{63}$ to $B=-\sqrt{28}$ | $-5\sqrt7$ |
| C-P06 | p. 13 | Number line $A=-5,B=-1,C=0,D=3,E=8,F=12$; find $AD,CA,FC,CE,BF$ | $8,5,12,8,13$ units |
| C-P07 | p. 14 | Square of side 2, one vertex $(0,0)$, one diagonal on the $x$-axis; find other vertices | For the diagonal to the right: $(\sqrt2,\sqrt2),(\sqrt2,-\sqrt2),(2\sqrt2,0)$. Reflection across the $y$-axis is also valid unless direction is specified. |
| C-P08 | p. 16 item 1 | Distance and segment type: $(-9,6),(3,9)$ | $3\sqrt{17}$; oblique |
| C-P09 | p. 16 item 2 | $(2,13),(4,5)$ | $2\sqrt{17}$; oblique |
| C-P10 | p. 16 item 3 | $(0,0),(9,18)$ | $9\sqrt5$; oblique |
| C-P11 | p. 16 item 4 | $(-6,8),(14,8)$ | $20$; horizontal |
| C-P12 | p. 16 item 5 | $(0,12),(0,28)$ | $16$; vertical |
| C-P13 | p. 17 item 1 | Test $A=(4,-3),B=(0,0),C=(3,4)$ for a right triangle | Yes; right angle at $B$; see C01 |
| C-P14 | p. 17 item 2 | Find pairwise distances for $D=(-2,0),E=(1,-2),F=(5,4)$ | $DE=\sqrt{13},EF=2\sqrt{13},DF=\sqrt{65}$; right at $E$ |
| C-P15 | p. 17 item 3 | Show $(-1,2),(3,0),(7,-2)$ are collinear | Successive displacement vectors are both $(4,-2)$ |
| C-P16 | p. 17 item 4 | Test $(0,1),(2,5),(-1,4)$ for an isosceles triangle | Yes; distances $2\sqrt5,\sqrt{10},\sqrt{10}$ |
| C-P17 | p. 17 item 5 | Prove $A=(-2,6),B=(4,3),C=(1,-3),D=(-5,0)$ form a square | All sides $3\sqrt5$; adjacent vectors $(6,-3)$ and $(-3,-6)$ have dot product zero |
| C-P18 | p. 17 item 6 | Point on $y$-axis equidistant from $(6,1)$ and $(-2,3)$ | $(0,-6)$; equate squared distances |
| C-P19 | p. 25 item 1 | $A=(9,5),C=(-7,1)$; $AB:BC=3:1$ | $B=(-3,2)$ |
| C-P20 | p. 25 item 2 | $A=(8,-8),C=(-7,-3)$; $AB=AC/5$, with $B$ on $AC$ | $B=(5,-7)$ |
| C-P21 | p. 25 item 3 | “External” point $C$; $A=(1,-9),B=(2,0)$; $AB:BC=1:1$ | Needs review: specify that $C$ is beyond $B$ on ray $AB$. With that intended placement, $C=2B-A=(3,9)$. This is extension by an equal segment, not equal-ratio external division of fixed endpoints $A,B$. |
| C-P22 | p. 26 item 4 | Collinear $A=(-7,-8),B=(-3,-5)$; $B$ between $A,C$; $AB:AC=1:4$. Find $C$. | $C=A+4(B-A)=(9,4)$ |
| C-P23 | p. 26 items 5–6 | $A=(-7,2),C=(3,-2)$; $AB:BC=3:1$. Find $B$ on $AC$. | $B=(1/2,-1)$; source numbering is split across lines |
| C-P24 | p. 26 item 7 | $A=(8,1),C=(-7,7)$; $AB=AC/3$. Find $B$ on $AC$. | $B=(3,3)$ |
| C-P25 | p. 29 item 1 | Area: $(1,2),(-2,1),(3,0)$ | $4$ square units |
| C-P26 | p. 29 item 2 | Area: $(3,0),(2,3),(-2,-1)$ | $8$ square units |
| C-P27 | p. 29 item 3 | Area: $F=(2,0),E=(6,4),U=(3,2)$ | $2$ square units |
| C-P28 | p. 31 item 1 | Area: $(3,5),(6,8),(9,6),(5,0)$ in order | $47/2$ square units |
| C-P29 | p. 31 item 2 | Area: $(0,8),(6,5),(6,-1),(-2,-4),(-5,3)$ | $88$ square units |
| C-P30 | p. 31 item 3 | Area: $(-3,10),(9,4),(9,-10)$ | $84$ square units |
| C-P31 | p. 31 item 4 | Area: $(-4,4),(-9,-1),(-4,-6),(1,-1)$ | $50$ square units |

**Review-only fragment C-R01 (SRC-CART p. 24):** The source lists $3AB=5AC$, $(2/3)AB=5AC$, $2AC=(4/3)BA$, $AB=3BC$, $AC=(3/5)CB$, and $BA/BC=3/2$ under “Recall,” without a complete task or point-order convention. Preserve as a teacher note, not a solvable quiz. A future exercise must say whether these are directed segments or ordinary lengths and what ratio or point is requested.

---

## 3. Lines

**Module ID:** `lines`  
**Sources:** SRC-LINE pp. 2–21.

**Overview:** Use slope to describe direction, analyze line relationships, measure angles, and construct line equations.

**Learning outcomes:** Calculate slope; identify parallel and perpendicular lines including vertical cases; distinguish directed angles from the smaller angle between lines; write equations from points, slopes, or intercepts.

### LINE-01 — Slope and relationships

**Sources:** SRC-LINE pp. 4–6, 17–19.

$$\boxed{m=\frac{y_2-y_1}{x_2-x_1}}\quad (x_2\ne x_1)\tag{F-L01}$$

Slope is rise divided by run. Horizontal lines have slope zero. Vertical lines have undefined slope, not an infinite number that can safely be used in arithmetic. Two identical points do not determine a unique line.

Distinct nonvertical lines are parallel if their slopes are equal. Two nonvertical lines are perpendicular when $m_1m_2=-1$. A vertical line is perpendicular to a horizontal line. Equal slopes can also describe the same line: compare intercepts or full equations before calling lines distinct and parallel.

**Supplemental robust formulation:** A direction vector through distinct points is $v=(\Delta x,\Delta y)$. Parallel direction vectors have determinant zero; perpendicular vectors have dot product zero. These tests include vertical lines without special slope arithmetic.

### LINE-02 — Angles between lines

**Sources:** SRC-LINE pp. 7–13; vector formulation added for robustness.

For inclinations $\theta_1,\theta_2$, a counterclockwise angle from line 1 to line 2 is obtained from their difference, with the intended angle convention specified. For finite slopes,

$$\tan\theta=\frac{m_2-m_1}{1+m_1m_2}.\tag{F-L02}$$

This follows from $\tan(\theta_2-\theta_1)$; it is not $\tan\theta_2-\tan\theta_1$.

For the **smaller unoriented angle** $\alpha\in[0,90^\circ]$:

$$\tan\alpha=\left|\frac{m_2-m_1}{1+m_1m_2}\right|,$$

with $\alpha=90^\circ$ when the denominator is zero. A vector implementation can use

$$\alpha=\operatorname{atan2}(|u_xv_y-u_yv_x|,|u\cdot v|).\tag{F-L03}$$

For a **triangle's interior angle**, use the two vectors pointing from that vertex to the other two vertices:

$$\beta=\operatorname{atan2}(|u_xv_y-u_yv_x|,u\cdot v).\tag{F-L04}$$

Here $0\le\beta\le180^\circ$. Do not take an absolute value of the dot product for triangle angles; doing so turns obtuse angles into their acute supplements. For a non-right interior angle, $\tan\beta=|\det(u,v)|/(u\cdot v)$; it is negative when the angle is obtuse.

#### Worked example L01 — Rotate a line by $45^\circ$

**Source:** SRC-LINE p. 10 item 2. Given $m_1=2/3$ and a counterclockwise line angle of $45^\circ$:

1. $1=(m_2-2/3)/(1+(2/3)m_2)$.
2. $1+(2/3)m_2=m_2-2/3$.
3. $5/3=m_2/3$, so $m_2=5$.

The corresponding inclination changes from about $33.69^\circ$ to $78.69^\circ$.

### LINE-03 — Equations of a line

**Sources:** SRC-LINE pp. 15–21.

| Formula ID | Form | Conditions |
|---|---|---|
| F-L05 | $Ax+By+C=0$ | $(A,B)\ne(0,0)$ |
| F-L06 | $y-y_1=m(x-x_1)$ | Known finite slope and point |
| F-L07 | $y=mx+b$ | Nonvertical line; $b$ is the $y$-intercept |
| F-L08 | $(x_2-x_1)(y-y_1)=(y_2-y_1)(x-x_1)$ | Two distinct points; also works for vertical lines |
| F-L09 | $x/a_x+y/b_y=1$ | Nonzero finite $x$- and $y$-intercepts |
| F-L10 | $x=x_1$ | Vertical line |
| F-L11 | $y=y_1$ | Horizontal line |

The point-slope form includes the factor $m$. The intercept form does not represent a line through the origin using zero denominators.

#### Worked example L02 — A line through axis intercepts

**Source:** SRC-LINE p. 21. Through $(4,0)$ and $(0,-3)$:

1. $m=(-3-0)/(0-4)=3/4$.
2. $y=(3/4)(x-4)$.
3. Equivalent answers: $3x-4y=12$, $y=(3/4)x-3$, and $x/4+y/(-3)=1$.

**Supplemental formula needed in the circle module:** The perpendicular distance from $(x_0,y_0)$ to $Ax+By+C=0$ is

$$\boxed{d=\frac{|Ax_0+By_0+C|}{\sqrt{A^2+B^2}}}.\tag{F-L12}$$

**Interaction INT-LINES:** Drag two points on each of two lines or enter general-form coefficients. Display equations, slopes or “undefined,” and selected angle mode: smaller line angle, directed counterclockwise line angle modulo $180^\circ$, or triangle interior angle. Mark parallel, coincident, and perpendicular cases accurately. Never pass a zero-length vector to angle computations.

### Lines practice bank

| ID | Source | Prompt | Answer / teaching note |
|---|---|---|---|
| L-P01 | p. 5 item 1a | Are $D=(-2,0),E=(1,-2),F=(5,4)$ a right triangle? | Yes, at $E$; vectors $(-3,2)$ and $(4,6)$ have dot product 0 |
| L-P02 | p. 5 item 1b | $A=(1,2),B=(3,5),C=(-3,9)$ | Yes, at $B$; vectors $(-2,-3)$ and $(-6,4)$ are perpendicular |
| L-P03 | p. 5 item 2a | Are $(-1,2),(3,0),(7,-2)$ collinear? | Yes; slope $-1/2$ |
| L-P04 | p. 5 item 2b | Are $(-6,2),(0,-2),(3,-4)$ collinear? | Yes; slope $-2/3$ |
| L-P05 | p. 5 item 3 | Slope from $(1/6,10/21)$ to $(1/7,y)$ is $-1$. Find $y$. | $y=1/2$ |
| L-P06 | p. 6 item 4 | Show the perpendicular bisector of $(-1,2),(5,-2)$ passes through $(6,6)$ | Midpoint $(2,0)$; bisector $y=(3/2)(x-2)$; $(6,6)$ satisfies it |
| L-P07 | p. 6 item 5 | Segment from $(22/9,y)$ to $(4,1)$ is perpendicular to the segment from $(-5,-6)$ to $(4,1)$. Find $y$. | $y=3$ |
| L-P08 | p. 6 item 6 | Circle with diameter endpoints $(-4,3),(6,3)$: show $(-2,7)$ lies on it | Center $(1,3)$, $r=5$; $(-3)^2+4^2=25$ |
| L-P09 | p. 10 item 1 | Tangents of the interior angles of $A=(0,1),B=(7,2),C=(3,8)$ | $\tan A=23/14$, $\tan B=23/11$, $\tan C=23/15$ |
| L-P10 | p. 10 item 2 | Counterclockwise angle $45^\circ$ from slope $2/3$ to slope $m_2$ | $m_2=5$; see L01 |
| L-P11 | p. 10 item 3 | Segments $(4,3)$ to $(6,-2)$ and $(9,5)$ to $(6,-2)$; find $\tan\theta$ | Smaller line angle and the angle between the given rays at $(6,-2)$: $45^\circ$, with tangent $29/29=1$. A supplementary angle is $135^\circ$ and has tangent $-1$; identify any chosen supplementary angle explicitly. |
| L-P12 | p. 11 item 4 | Isosceles right triangle has hypotenuse slope 3. Slopes of equal sides? | $1/2$ and $-2$ |
| L-P13 | p. 11 item 5 | $B=(8,43),E=(2,1),L=(-1,5),O=(6,4)$; show $BE$ bisects $\angle LEO$ | It does: unit directions $EL=(-3/5,4/5)$ and $EO=(4/5,3/5)$ sum to $(1/5,7/5)$; $EB=(6,42)$ is a positive multiple. Source wording “bisects LEO” is interpreted as angle bisection. |

**Editorial clarification for L-P11:** The source does not show which angle is called $\theta$. For a live quiz, ask explicitly for the smaller angle between supporting lines (then $45^\circ$) or the interior angle between the given rays (also $45^\circ$ for these coordinates).

SRC-LINE p. 12 lists five triples but does not identify a single target vertex. Adapt each nondegenerate row to “Find **all three interior angles**, in the named order.” Answers below are rounded to $0.01^\circ$.

| ID | Source item | Points in named order | Interior angles in that order |
|---|---|---|---|
| L-A01 | p. 12 item 1 | $F=(2,0),E=(6,4),U=(3,2)$ | $18.43^\circ,11.31^\circ,150.26^\circ$ |
| L-A02 | p. 12 item 2 | $R=(5,4),S=(1,2),T=(7,-1)$ | $85.24^\circ,53.13^\circ,41.63^\circ$ |
| L-A03 | p. 12 item 3 | $C=(2,4),D=(5,8),E=(-1,0)$ | Collinear; not a triangle. Needs a revised prompt, such as “Explain why no triangle is formed.” |
| L-A04 | p. 12 item 4 | $K=(1,-2),L=(0,1),M=(3,2)$ | $45^\circ,90^\circ,45^\circ$ |
| L-A05 | p. 12 item 5 | $B=(4,0),C=(3,1),D=(2,-1)$ | $71.57^\circ,71.57^\circ,36.87^\circ$ |

For SRC-LINE p. 13, explicitly ask for the **smaller angle between supporting lines**. Convert the exact tangent below to degrees if needed.

| ID | Source item | First line through | Second line through | Exact tangent of smaller angle |
|---|---|---|---|---|
| L-A06 | p. 13 item 6 | $(2,-1),(6,0)$ | $(1,-1),(-7,0)$ | $12/31$ |
| L-A07 | p. 13 item 7 | $(1,-1),(7,0)$ | $(1,2),(3,-1)$ | $20/9$ |
| L-A08 | p. 13 item 8 | $(-2,4),(2,1)$ | $(0,2),(-3,1)$ | $13/9$ |
| L-A09 | p. 13 item 9 | $(1,-2),(0,1)$ | $(0,-3),(2,0)$ | $9/7$ |
| L-A10 | p. 13 item 10 | $(1,0),(-2,1)$ | $(0,-1),(3,2)$ | $2$ |

---

## 4. Conics and Circles

**Module ID:** `circles`  
**Sources:** SRC-CIRC pp. 2–33.

**Overview:** Introduce conics through eccentricity, then describe, graph, construct, and classify circle equations and tangent lines.

**Learning outcomes:** Interpret focus-directrix distance ratios; distinguish conic types; determine circle centers and radii; form circle equations from geometric conditions; find tangent lines and circles tangent to a given line.

### CIRC-01 — Conics and eccentricity

**Sources:** SRC-CIRC pp. 3–14; limitations clarified.

A **locus** is the set of all points satisfying a geometric condition. For a focus $F$ and directrix $\ell$, a noncircular conic can be described by

$$\boxed{PF=e\,d(P,\ell)},\qquad e>0.\tag{F-K01}$$

The focus does not lie on the directrix in these nondegenerate constructions. The ratio of distances is the **eccentricity** $e$.

| Eccentricity | Conic |
|---|---|
| $0<e<1$ | Noncircular ellipse |
| $e=1$ | Parabola |
| $e>1$ | Hyperbola |
| $e=0$ | Circle as a special case of an ellipse, described by constant distance from its center |

A circle does not have a finite directrix in this focus-directrix model. Substituting $e=0$ with a fixed finite focus/directrix gives only the focus, not a circle.

The **principal axis** passes through the focus and is perpendicular to the directrix. A parabola has one vertex and no center of symmetry. A noncircular ellipse or hyperbola has two vertices on its principal axis and a center at their midpoint. A **latus rectum** is a chord through a focus perpendicular to the principal axis.

For focus $(f,0)$ and directrix $x=0$:

$$\boxed{(x-f)^2+y^2=e^2x^2}.\tag{F-K02}$$

For focus $(0,f)$ and directrix $y=0$:

$$\boxed{x^2+(y-f)^2=e^2y^2}.\tag{F-K03}$$

These equations come from squaring the distance relation. Ordinary point-to-line distance uses an absolute value, even when squaring later removes it.

#### Worked example K01 — Conic from focus, directrix, and $e$

**Source:** SRC-CIRC p. 6. Focus $(4,0)$, directrix $x=0$, $e=1/2$:

1. $(x-4)^2+y^2=x^2/4$.
2. Expand and multiply by 4: $4x^2-32x+64+4y^2=x^2$.
3. $3x^2+4y^2-32x+64=0$. Since $0<e<1$, this is an ellipse.

#### Worked example K02 — Corrected vertical-axis calculation

**Source:** SRC-CIRC p. 8. Focus $(0,3)$, directrix $y=0$, $e=2/3$:

1. $x^2+(y-3)^2=(4/9)y^2$.
2. $9x^2+9y^2-54y+81=4y^2$.
3. $\boxed{9x^2+5y^2-54y+81=0}$: an ellipse. The source incorrectly prints a minus sign on $5y^2$.

**Optional derivation from SRC-CIRC pp. 9–11:** For a centered noncircular ellipse or hyperbola with one focus $(c,0)$, $c=ae$, and corresponding directrix $x=d=a/e$, expand $(x-c)^2+y^2=e^2(x-d)^2$. Since $de^2=c$, the linear terms cancel, leaving $(1-e^2)x^2+y^2=a^2-c^2$. Here $d(P,\ell)=|x-d|$, not the signed difference $x-d$.

**Practice K-P01–K-P04 (SRC-CIRC pp. 12–14):** For focus $(4,0)$ and directrix $x=-4$, compute $e=PF/|x+4|$ for each given point. These are four separate conics, not four points asserted to lie on the same conic.

| ID | Point | Eccentricity | Type |
|---|---|---|---|
| K-P01 | $(-5,6)$ | $\sqrt{117}=3\sqrt{13}$ | Hyperbola |
| K-P02 | $(0,0)$ | $1$ | Parabola |
| K-P03 | $(6,0)$ | $1/5$ | Ellipse |
| K-P04 | $(2,5)$ | $\sqrt{29}/6$ | Ellipse |

**Interaction INT-ECCENTRICITY:** Let learners move a point along one chosen conic and display $PF$, its perpendicular distance to the matching directrix, and their constant ratio. Use separate presets for the four practice cases. For $e=0$, switch to the circle definition and hide the finite directrix.

### CIRC-02 — Circle equations and classification

**Sources:** SRC-CIRC pp. 15–30.

A **circle** is the set of points in a plane at a fixed positive distance $r$ from a fixed point, its **center** $(h,k)$. A **radius** joins the center to a circle point. A **diameter** is a chord through the center and has length $2r$.

$$\boxed{(x-h)^2+(y-k)^2=r^2},\quad r>0.\tag{F-O01}$$

The normalized general form is

$$x^2+y^2+Dx+Ey+F=0,$$

with

$$\boxed{(h,k)=(-D/2,-E/2),\qquad r^2=(D^2+E^2)/4-F}.\tag{F-O02}$$

If the two quadratic coefficients are equal and nonzero, divide by that common coefficient first. No $xy$ term appears in these circle equations.

| Computed $r^2$ | Real locus |
|---|---|
| Positive | Circle |
| Zero | One point $(h,k)$; degenerate, not a positive-radius circle |
| Negative | Empty set |

To complete a square, use $x^2+Dx=(x+D/2)^2-(D/2)^2$. If a group has a coefficient, factor it out before completing the square.

#### Worked example O01 — Complete the square

**Source:** SRC-CIRC p. 17. $x^2+y^2-8x+15=0$:

1. $x^2-8x+y^2=-15$.
2. Add 16 to both sides: $(x-4)^2+y^2=1$.
3. Center $(4,0)$; radius $1$.

#### Worked example O02 — Normalize first

**Source:** SRC-CIRC p. 18. $3x^2+3y^2-6x+12y-15=0$:

1. Divide by 3: $x^2+y^2-2x+4y-5=0$.
2. Complete both squares: $(x-1)^2+(y+2)^2=10$.
3. Center $(1,-2)$; radius $\sqrt{10}$.

#### Worked example O03 — Center and radius given

**Source:** SRC-CIRC p. 20. Center $(-1,3)$, $r=2$:

1. $(x+1)^2+(y-3)^2=4$.
2. Expand: $x^2+y^2+2x-6y+6=0$.

#### Worked example O04 — Diameter endpoints given

**Source:** SRC-CIRC pp. 21–23. Endpoints $(-3,4),(5,8)$:

1. Center is the midpoint $(1,6)$.
2. Diameter length $\sqrt{8^2+4^2}=4\sqrt5$; $r=2\sqrt5$.
3. $(x-1)^2+(y-6)^2=20$.
4. General equation: $x^2+y^2-2x-12y+17=0$.

#### Worked example O05 — Center and a point given

**Source:** SRC-CIRC p. 24. Center $(1,1)$ and circle point $(-4,3)$:

1. $r^2=(-4-1)^2+(3-1)^2=29$.
2. $(x-1)^2+(y-1)^2=29$.
3. General equation: $x^2+y^2-2x-2y-27=0$.

### CIRC-03 — Tangent lines

**Sources:** SRC-CIRC pp. 31–33; general tangent formula added.

A tangent line meets a circle at exactly one point. The radius to that point is perpendicular to the tangent. If $T=(x_t,y_t)$ lies on the circle, then

$$\boxed{(x_t-h)(x-x_t)+(y_t-k)(y-y_t)=0}.\tag{F-O03}$$

This dot-product form works for vertical and horizontal tangents. Check that $T$ is on the circle before using it.

If a circle's center and a tangent line $Ax+By+C=0$ are given, its radius is the center-to-line distance:

$$\boxed{r=\frac{|Ah+Bk+C|}{\sqrt{A^2+B^2}}}.\tag{F-O04}$$

#### Worked example O06 — A vertical tangent

**Source:** SRC-CIRC p. 32, corrected. Center $(2,2)$, radius 3, tangency point $(5,2)$:

1. The radius points horizontally from $(2,2)$ to $(5,2)$.
2. Its perpendicular tangent is vertical through $(5,2)$.
3. $\boxed{x=5}$, not the source's $x=2$.

#### Worked example O07 — Circle tangent to a given line

**Source:** SRC-CIRC p. 33, corrected. Center $(1,1)$, tangent line $4x-3y-26=0$:

1. $r=|4(1)-3(1)-26|/\sqrt{4^2+(-3)^2}=25/5=5$.
2. $(x-1)^2+(y-1)^2=25$.
3. $\boxed{x^2+y^2-2x-2y-23=0}$.

**Interaction INT-CIRCLE:** Controls for $h,k,r>0$ and a point angle. Display the equation, center, radius, diameter, tangency point, radius segment, and tangent. Optional general-form entry must distinguish circle, point, empty set, and noncircle. Keep horizontal and vertical axis scales equal so circles look circular.

### Circle classification practice

**Source:** SRC-CIRC pp. 26–30.

| ID | Equation | Result |
|---|---|---|
| O-P01 | $x^2+y^2+4x-6y+15=0$ | $(x+2)^2+(y-3)^2=-2$; empty real locus |
| O-P02 | $x^2-y^2+3x+2y-10=0$ | Not a circle; opposite-sign quadratic terms give a hyperbola here |
| O-P03 | $x^2+y^2-2x-4y+5=0$ | $(x-1)^2+(y-2)^2=0$; point $(1,2)$ |
| O-P04 | $x^2+y^2+6x+6y-1=0$ | $(x+3)^2+(y+3)^2=19$; center $(-3,-3)$, $r=\sqrt{19}$ |

**Review-only O-R01 (SRC-CIRC p. 19):** The printed equation $2x^2-2y^2-8x-3=0$ is a hyperbola: $(x-2)^2-y^2=11/2$. Its slide solution changes signs, moves constants incorrectly, and reports an unrelated center. There is no justified single intended circle problem to recover. Do not use it as a circle example. An optional corrected classification exercise may ask learners to explain why the printed equation is not a circle.

---

## 5. Parabolas

**Module ID:** `parabolas`  
**Sources:** SRC-PARA pp. 2–32.

**Overview:** Describe a parabola using its focus and directrix, identify its essential parts, and construct equations from geometric conditions.

**Learning outcomes:** Define a parabola; determine its opening; identify vertex, focus, directrix, axis, and latus rectum; convert between general and standard forms; find equations from given conditions.

### PARA-01 — Definition, parts, and derivation

**Sources:** SRC-PARA pp. 3–14.

A **parabola** is the locus of points equally distant from a focus and a directrix. Its eccentricity is $e=1$. Its **vertex** lies halfway between the focus and the directrix along the perpendicular axis of symmetry. It has one vertex and no center of symmetry.

Use a signed parameter $p\ne0$, rather than alternating between a signed parameter and a positive distance. The actual vertex-to-focus distance is $|p|$.

For vertex $(0,0)$, focus $(p,0)$, and directrix $x=-p$:

$$\sqrt{(x-p)^2+y^2}=|x+p|.$$

Squaring and expanding gives $(x-p)^2+y^2=(x+p)^2$, hence $y^2=4px$. Translating the vertex yields the standard forms below.

### PARA-02 — Standard forms and essential parts

**Sources:** SRC-PARA pp. 6–21; signed notation standardized.

| Quantity | Horizontal axis | Vertical axis |
|---|---|---|
| Standard equation | $(y-k)^2=4p(x-h)$ | $(x-h)^2=4p(y-k)$ |
| Vertex | $(h,k)$ | $(h,k)$ |
| Focus | $(h+p,k)$ | $(h,k+p)$ |
| Directrix | $x=h-p$ | $y=k-p$ |
| Axis | $y=k$ | $x=h$ |
| Opening for $p>0$ | Right | Up |
| Opening for $p<0$ | Left | Down |
| Latus rectum length | $4\vert p\vert $ | $4\vert p\vert $ |
| Latus rectum endpoints | $(h+p,k\pm2\vert p\vert )$ | $(h\pm2\vert p\vert ,k+p)$ |

Formula IDs: **F-Q01** horizontal equation; **F-Q02** vertical equation; **F-Q03** latus rectum length and endpoint formulas.

The latus rectum is centered at the focus. The distance from focus to either latus rectum endpoint is $2|p|$, and focus-to-directrix distance is also $2|p|$. A parabola opens toward its focus.

#### Worked example Q01 — Resolve the source's two equations separately

**Sources:** SRC-PARA pp. 15–17, corrected editorial split.

The problem statement on p. 15 says $x^2-4y=0$, while the solution on pp. 16–17 uses $x^2-20y=0$. Both are valid examples, but they are different parabolas:

| Part | Q01a: $x^2=4y$ | Q01b: $x^2=20y$ |
|---|---|---|
| $p$ | $1$ | $5$ |
| Vertex | $(0,0)$ | $(0,0)$ |
| Focus | $(0,1)$ | $(0,5)$ |
| Directrix | $y=-1$ | $y=-5$ |
| Axis | $x=0$ | $x=0$ |
| Opening | Up | Up |
| Latus rectum length | $4$ | $20$ |
| Latus rectum endpoints | $(-2,1),(2,1)$ | $(-10,5),(10,5)$ |

Read $4p$ from the coefficient of $y$, then use the vertical-axis formulas. The source summary's $x=-5$ directrix and duplicate endpoints are incorrect.

#### Worked example Q02 — Complete the square

**Source:** SRC-PARA pp. 18–21. $y^2-8x-4y+20=0$:

1. $y^2-4y=8x-20$.
2. $(y-2)^2=8x-16=8(x-2)$.
3. Vertex $(2,2)$; $p=2$; opens right.
4. Focus $(4,2)$; directrix $x=0$; axis $y=2$.
5. Latus rectum length $8$; endpoints $(4,-2),(4,6)$.

### PARA-03 — Constructing equations

**Sources:** SRC-PARA pp. 23–32.

For an axis-parallel, nondegenerate parabola, the expanded equation has exactly one squared variable:

- Vertical axis: $Ax^2+Dx+Ey+F=0$, with $A\ne0$, $E\ne0$.
- Horizontal axis: $By^2+Dx+Ey+F=0$, with $B\ne0$, $D\ne0$.

The nonzero linear coefficient of the other variable prevents degeneracy. A lone squared variable does not automatically guarantee a parabola.

#### Worked example Q03 — Vertex, axis, and a point

**Source:** SRC-PARA pp. 24–26. Vertex $(0,0)$, axis the $x$-axis, passing through $(1,-2)$:

1. Use $y^2=4px$.
2. $(-2)^2=4p(1)$, so $p=1$.
3. $\boxed{y^2=4x}$.

#### Worked example Q04 — Vertex and focus

**Source:** SRC-PARA pp. 27–28. Vertex $(3,1)$, focus $(3,-5)$:

1. Axis is vertical; signed $p=-5-1=-6$.
2. $(x-3)^2=-24(y-1)$.
3. $\boxed{x^2-6x+24y-15=0}$.

#### Worked example Q05 — Focus and directrix

**Source:** SRC-PARA p. 29; source solution completed in this pack. Focus $(-2,-3)$, directrix $x=3$:

1. Axis $y=-3$; the vertex is halfway between $x=-2$ and $x=3$: $V=(1/2,-3)$.
2. $p=-2-1/2=-5/2$, so the parabola opens left.
3. $(y+3)^2=-10(x-1/2)$.
4. $\boxed{y^2+6y+10x+4=0}$.

#### Worked example Q06 — Latus rectum endpoints

**Source:** SRC-PARA pp. 30–31. Upward-opening parabola with endpoints $(-4,2),(16,2)$:

1. Focus is their midpoint: $(6,2)$.
2. Latus rectum length $20=4|p|$; upward opening means $p=5$.
3. Vertex $(6,2-5)=(6,-3)$.
4. $(x-6)^2=20(y+3)$.
5. $\boxed{x^2-12x-20y-24=0}$.

#### Worked example Q07 — Axis from a focus

**Source:** SRC-PARA p. 32, corrected. A right-opening parabola has focus $(-3,4)$. Its axis is the horizontal line through that point: $\boxed{y=4}$. These conditions determine the axis, but not a unique parabola equation.

**Interaction INT-PARABOLA:** Controls for $(h,k)$, axis orientation, and nonzero signed $p$. Show focus, vertex, directrix, axis, and latus rectum. Provide a movable point $P$ with a segment to the focus and a perpendicular segment to the directrix; show equal distances. Provide presets Q01a, Q01b, and Q02. Do not allow $p=0$ as a parabola.

**Supplemental practice Q-P01:** Vertex $(2,-1)$, focus $(2,2)$. **Answer:** $(x-2)^2=12(y+1)$; directrix $y=-4$; latus rectum length 12.  
**Supplemental practice Q-P02:** $(y+1)^2=-12(x-2)$. **Answer:** vertex $(2,-1)$, focus $(-1,-1)$, directrix $x=5$, left opening, latus endpoints $(-1,-7),(-1,5)$.

---

## 6. Ellipses

**Module ID:** `ellipses`  
**Sources:** SRC-ELLI pp. 2–33.

**Overview:** Use the constant sum of distances to two foci to understand an ellipse, locate its parts, and construct its equation.

**Learning outcomes:** Convert general to standard form; determine center, vertices, covertices, foci, directrices, and latera recta; construct ellipse equations from specified conditions.

### ELLI-01 — Definition and parameters

**Sources:** SRC-ELLI pp. 3–8.

An **ellipse** is the locus of points for which the sum of distances to two fixed foci is constant:

$$\boxed{PF_1+PF_2=2a}.\tag{F-E01}$$

For a noncircular ellipse, let $a>b>0$. The major axis has length $2a$ and its endpoints are the **vertices**. The perpendicular minor axis has length $2b$ and its endpoints are the **covertices**. Their intersection is the **center**, also the midpoint of the two foci. The principal axis is the line containing the major axis and foci.

$$\boxed{c^2=a^2-b^2,\qquad e=c/a,\qquad0<e<1}.\tag{F-E02}$$

Each latus rectum has length $2b^2/a$. Its midpoint is a focus and its half-length is $b^2/a$. Each directrix is perpendicular to the major axis and lies at distance $a/e=a^2/c$ from the center. The directrices lie outside the ellipse.

If $a=b>0$, the equation describes a circle, the foci coincide, and $e=0$; there are no finite directrices in this model.

**Source check (SRC-ELLI p. 8):** Foci $(-3,4)$ and $(4,4)$ have equal $y$-coordinates, so the principal axis is horizontal, namely $y=4$.

### ELLI-02 — Standard forms, parts, and graphing

**Sources:** SRC-ELLI pp. 9–21.

| Quantity | Horizontal major axis | Vertical major axis |
|---|---|---|
| Equation | $(x-h)^2/a^2+(y-k)^2/b^2=1$ | $(x-h)^2/b^2+(y-k)^2/a^2=1$ |
| Center | $(h,k)$ | $(h,k)$ |
| Vertices | $(h\pm a,k)$ | $(h,k\pm a)$ |
| Covertices | $(h,k\pm b)$ | $(h\pm b,k)$ |
| Foci | $(h\pm c,k)$ | $(h,k\pm c)$ |
| Directrices | $x=h\pm a^2/c$ | $y=k\pm a^2/c$ |
| Latus endpoints through each focus | $(h\pm c,k\pm b^2/a)$ | $(h\pm b^2/a,k\pm c)$ |

Formula IDs: **F-E03** horizontal standard form and parts; **F-E04** vertical standard form and parts; **F-E05** latus rectum length $2b^2/a$.

The two $\pm$ signs in the endpoint formulas are independent and produce four points. The larger denominator is $a^2$ and identifies the major-axis direction. Take square roots of denominators to obtain $a$ and $b$.

**Graphing method:** Normalize to right-hand side 1; identify center and major-axis direction; plot vertices and covertices; draw a smooth closed curve symmetric about both axes. Add foci, directrices, and latera recta as requested. The ellipse lies inside its axis-aligned bounding rectangle and passes through all four axis endpoints.

#### Worked example E01 — Vertical ellipse

**Source:** SRC-ELLI pp. 12–14. $4x^2+y^2=64$:

1. Divide by 64: $x^2/16+y^2/64=1$.
2. Center $(0,0)$; vertical major axis; $a=8,b=4$.
3. Vertices $(0,\pm8)$; covertices $(\pm4,0)$.
4. Additional parts from pack formulas: $c=4\sqrt3$; foci $(0,\pm4\sqrt3)$; $e=\sqrt3/2$; directrices $y=\pm16\sqrt3/3$; latus rectum length 4.

#### Worked example E02 — Complete the square and locate directrices

**Source:** SRC-ELLI pp. 15–17, corrected. $x^2+4y^2+6x-8y+9=0$:

1. $(x^2+6x)+4(y^2-2y)=-9$.
2. $(x+3)^2+4(y-1)^2=4$.
3. $(x+3)^2/4+(y-1)^2=1$.
4. Center $(-3,1)$; $a=2,b=1,c=\sqrt3$; horizontal major axis.
5. Vertices $(-5,1),(-1,1)$; covertices $(-3,0),(-3,2)$.
6. Foci $(-3\pm\sqrt3,1)$; $e=\sqrt3/2$.
7. Directrices $\boxed{x=-3\pm4/\sqrt3}$.
8. Each latus rectum has length 1. Its endpoints are $\boxed{(-3\pm\sqrt3,1/2),(-3\pm\sqrt3,3/2)}$.

The endpoints must be offset above and below the focus's $y$-coordinate 1; they are not centered about $y=0$.

#### Worked example E03 — Full set of essential parts

**Source:** SRC-ELLI pp. 18–21. $4x^2+9y^2-24x+36y+36=0$:

1. $4(x^2-6x)+9(y^2+4y)=-36$.
2. $4(x-3)^2+9(y+2)^2=36$.
3. $(x-3)^2/9+(y+2)^2/4=1$.
4. Center $(3,-2)$; $a=3,b=2,c=\sqrt5$; horizontal major axis.
5. Vertices $(0,-2),(6,-2)$; covertices $(3,-4),(3,0)$.
6. Foci $(3\pm\sqrt5,-2)$; $e=\sqrt5/3$.
7. Directrices $x=3\pm9/\sqrt5$.
8. Latus rectum length $8/3$; endpoints $(3\pm\sqrt5,-2\pm4/3)$, all four sign combinations.

### ELLI-03 — Constructing equations

**Sources:** SRC-ELLI pp. 24–33.

Axis-parallel equations have form $Ax^2+By^2+Dx+Ey+F=0$ with $A,B$ nonzero and the same sign. After completing the square, a positive normalized right-hand side is required for a real nondegenerate ellipse. Same-sign coefficients alone may instead give a point or empty set. Equal normalized quadratic coefficients give the circle special case.

#### Worked example E04 — Center, focus, and vertex

**Source:** SRC-ELLI pp. 25–26. Center $(0,0)$, focus $(4,0)$, vertex $(6,0)$:

1. Horizontal major axis; $a=6,c=4$.
2. $b^2=a^2-c^2=36-16=20$.
3. $\boxed{x^2/36+y^2/20=1}$.

#### Worked example E05 — Major-axis endpoints and a covertex

**Source:** SRC-ELLI pp. 27–29. Vertices $(4,-4),(4,6)$; covertex $(5,1)$:

1. Center is midpoint $(4,1)$; major axis is vertical.
2. $a=5,b=1$.
3. $(x-4)^2+(y-1)^2/25=1$.
4. $\boxed{25x^2+y^2-200x-2y+376=0}$.

#### Worked example E06 — Center, vertex, and another point

**Source:** SRC-ELLI pp. 30–32. Center $(-4,-4)$, vertex $(6,-4)$, passing through $(3,1)$:

1. Horizontal major axis; $a=10$.
2. Start with $(x+4)^2/100+(y+4)^2/b^2=1$.
3. Substitute $(3,1)$: $49/100+25/b^2=1$.
4. $25/b^2=51/100$, so $b^2=2500/51$.
5. $\boxed{(x+4)^2/100+(y+4)^2/(2500/51)=1}$.

#### Worked example E07 — Find the foci

**Source:** SRC-ELLI p. 33. Vertices $(3,1),(3,9)$; covertex $(4,5)$:

1. Center $(3,5)$; vertical major axis; $a=4,b=1$.
2. $c=\sqrt{16-1}=\sqrt{15}$.
3. $\boxed{F_1=(3,5-\sqrt{15}),\quad F_2=(3,5+\sqrt{15})}$.

**Interaction INT-ELLIPSE:** Controls for center, orientation, $a$, and $b$ with $a>b>0$. Move $P$ along the ellipse; show $PF_1+PF_2=2a$. Toggle axes, foci, both directrices, and both latera recta. Allow an explicitly labeled circle mode at $a=b$ and hide finite directrices. Do not let an ellipse parameter input drift into $b>a$ without swapping axis labels or reporting the constraint.

**Supplemental practice E-P01:** $9x^2+4y^2=36$. **Answer:** $x^2/4+y^2/9=1$; vertical major axis; $a=3,b=2,c=\sqrt5$; foci $(0,\pm\sqrt5)$; directrices $y=\pm9/\sqrt5$.

---

## 7. Hyperbolas

**Module ID:** `hyperbolas`  
**Sources:** SRC-HYP pp. 2–32.

**Overview:** Describe the two branches of a hyperbola, locate its essential parts, use asymptotes to graph it, and construct equations from geometric conditions.

**Learning outcomes:** Define and graph a hyperbola; identify transverse-axis orientation; calculate vertices, foci, directrices, conjugate-axis endpoints, and latera recta; construct standard and general equations; find asymptotes.

### HYP-01 — Definition and parameters

**Sources:** SRC-HYP pp. 3–7.

A **hyperbola** is the locus of points whose **absolute difference** of distances to two fixed foci is constant:

$$\boxed{|PF_1-PF_2|=2a}.\tag{F-H01}$$

Its graph has two disconnected **branches**. The **center** is the midpoint of the foci. The **principal axis** passes through the foci and vertices. The **transverse axis** is the segment between vertices and has length $2a$. The perpendicular **conjugate axis** is a reference segment of length $2b$ through the center; its endpoints are not points on the hyperbola.

For $a,b>0$:

$$\boxed{c^2=a^2+b^2,\qquad e=c/a>1}.\tag{F-H02}$$

Unlike the ellipse, a hyperbola does not require $a>b$. The positive term in normalized standard form determines its transverse-axis direction. Each latus rectum has length $2b^2/a$, and each directrix is at distance $a/e=a^2/c$ from the center.

### HYP-02 — Standard forms, asymptotes, and graphing

**Sources:** SRC-HYP pp. 8–21.

| Quantity | Horizontal transverse axis | Vertical transverse axis |
|---|---|---|
| Equation | $(x-h)^2/a^2-(y-k)^2/b^2=1$ | $(y-k)^2/a^2-(x-h)^2/b^2=1$ |
| Branches open | Left and right | Up and down |
| Center | $(h,k)$ | $(h,k)$ |
| Vertices | $(h\pm a,k)$ | $(h,k\pm a)$ |
| Conjugate-axis endpoints | $(h,k\pm b)$ | $(h\pm b,k)$ |
| Foci | $(h\pm c,k)$ | $(h,k\pm c)$ |
| Directrices | $x=h\pm a^2/c$ | $y=k\pm a^2/c$ |
| Asymptotes | $y-k=\pm(b/a)(x-h)$ | $y-k=\pm(a/b)(x-h)$ |
| Latus endpoints | $(h\pm c,k\pm b^2/a)$ | $(h\pm b^2/a,k\pm c)$ |

Formula IDs: **F-H03** horizontal form and parts; **F-H04** vertical form and parts; **F-H05** asymptotes; **F-H06** latus rectum length $2b^2/a$.

Each directrix lies between the center and its corresponding vertex, although the line is infinite. The asymptotes pass through the center. A nondegenerate axis-parallel hyperbola approaches its asymptotes and does not intersect them.

**Graphing method:** Normalize to 1; plot the center, vertices, and conjugate-axis endpoints; form a reference rectangle with half-dimensions $a,b$ placed according to orientation; draw its extended diagonals as asymptotes; draw two smooth branches through the vertices approaching the asymptotes. Add foci and latera recta. Never connect the branches across the center.

#### Worked example H01 — A horizontal hyperbola

**Source:** SRC-HYP pp. 9–15; radicals preserved from the visual source.

1. $4x^2-9y^2=36$ becomes $x^2/9-y^2/4=1$.
2. Center $(0,0)$; $a=3,b=2,c=\sqrt{13}$.
3. Vertices $(\pm3,0)$; conjugate-axis endpoints $(0,\pm2)$.
4. Foci $(\pm\sqrt{13},0)$; $e=\sqrt{13}/3$.
5. Asymptotes $y=\pm(2/3)x$.
6. Directrices $x=\pm9/\sqrt{13}$.
7. Latus rectum length $8/3$; endpoints $(\pm\sqrt{13},\pm4/3)$, all four sign combinations.

#### Worked example H02 — A translated hyperbola

**Source:** SRC-HYP pp. 16–21. $(x-1)^2-(y+3)^2/(1/4)=1$:

1. Center $(1,-3)$; horizontal transverse axis; $a=1,b=1/2$.
2. Vertices $(0,-3),(2,-3)$.
3. Conjugate-axis endpoints $(1,-7/2),(1,-5/2)$.
4. $c=\sqrt{1+1/4}=\sqrt5/2$; foci $(1\pm\sqrt5/2,-3)$.
5. Latus rectum half-length $b^2/a=1/4$; endpoints $(1\pm\sqrt5/2,-13/4)$ and $(1\pm\sqrt5/2,-11/4)$.
6. Asymptotes $\boxed{y+3=\pm\tfrac12(x-1)}$.
7. Additional parts: $e=\sqrt5/2$; directrices $x=1\pm2/\sqrt5$.

The denominator $1/4$ means the second term is $4(y+3)^2$, not $(y+3)^2/4$.

### HYP-03 — Constructing equations

**Sources:** SRC-HYP pp. 23–32.

Use the unambiguous expanded form $Ax^2+By^2+Dx+Ey+F=0$ with $AB<0$. Complete both squares. If the resulting constant is nonzero, normalize to 1; the positive squared term gives the transverse-axis direction. If the constant is zero, the equation represents a pair of intersecting lines, not a nondegenerate hyperbola.

#### Worked example H03 — Center, focus, and vertex

**Source:** SRC-HYP pp. 24–25. Center $(0,0)$, focus $(6,0)$, vertex $(4,0)$:

1. Horizontal transverse axis; $a=4,c=6$.
2. $b^2=c^2-a^2=36-16=20$.
3. $\boxed{x^2/16-y^2/20=1}$.

#### Worked example H04 — Vertices and conjugate endpoint

**Source:** SRC-HYP pp. 26–28. Vertices $(4,-4),(4,6)$; conjugate endpoint $(5,1)$:

1. Center $(4,1)$; vertical transverse axis.
2. $a=5,b=1$.
3. $(y-1)^2/25-(x-4)^2=1$.
4. Multiply by 25 and expand: $y^2-2y+1-25x^2+200x-400=25$.
5. $\boxed{25x^2-y^2-200x+2y+424=0}$.

#### Worked example H05 — Center, vertex, and another point

**Source:** SRC-HYP pp. 29–31, corrected final sign. Center $(-4,-4)$, vertex $(6,-4)$, passing through $(7,1)$:

1. Horizontal transverse axis; $a=10$.
2. $(x+4)^2/100-(y+4)^2/b^2=1$.
3. Substitute $(7,1)$: $121/100-25/b^2=1$.
4. $25/b^2=21/100$, so $b^2=2500/21$.
5. $\boxed{(x+4)^2/100-(y+4)^2/(2500/21)=1}$.

The source's final plus sign would produce an ellipse and would not satisfy the given point.

#### Worked example H06 — Find the foci

**Source:** SRC-HYP p. 32. Vertices $(3,1),(3,9)$; conjugate endpoint $(4,5)$:

1. Center $(3,5)$; vertical transverse axis; $a=4,b=1$.
2. $c=\sqrt{16+1}=\sqrt{17}$.
3. $\boxed{F_1=(3,5-\sqrt{17}),\quad F_2=(3,5+\sqrt{17})}$.

**Interaction INT-HYPERBOLA:** Controls for center, orientation, $a>0$, and $b>0$. Toggle reference rectangle, axes, asymptotes, foci, directrices, and latera recta. Move $P$ on either branch and show $|PF_1-PF_2|=2a$. Include a branch selector; render branches separately. Include presets H01 and H02.

**Supplemental practice H-P01:** $y^2/16-x^2/9=1$. **Answer:** center $(0,0)$; vertical transverse axis; vertices $(0,\pm4)$; foci $(0,\pm5)$; asymptotes $y=\pm(4/3)x$; directrices $y=\pm16/5$; latus rectum length $9/2$.

---

## 8. Cross-module reference

### Compare the conics

| Feature | Circle | Parabola | Noncircular ellipse | Hyperbola |
|---|---|---|---|---|
| Defining condition | Fixed center distance $r$ | $PF=d(P,\ell)$ | Sum of focal distances $2a$ | Absolute difference of focal distances $2a$ |
| Eccentricity | $0$ | $1$ | $0<e<1$ | $e>1$ |
| Center of symmetry | Yes | No | Yes | Yes |
| Vertices in principal-axis convention | No unique preferred pair | One | Two | Two |
| Focus count | Coincident ellipse foci at center | One | Two | Two |
| Finite directrices in this model | None | One | Two | Two |
| Bounded curve | Yes | No | Yes | No |
| Parameter relation | Radius $r>0$ | Signed $p\ne0$ | $c^2=a^2-b^2$ | $c^2=a^2+b^2$ |
| Latus rectum length | Not used here | $4\vert p\vert $ | $2b^2/a$ | $2b^2/a$ |

### Completing the square: shared method

1. Group terms by variable and move the constant to the other side.
2. Factor each squared-variable coefficient from its group.
3. Add the needed square-completing terms to both sides, including their factored coefficients.
4. Factor into squares.
5. For ellipses and hyperbolas, divide by the resulting nonzero constant to make the right-hand side 1.
6. Check signs, positive semiaxis squares, and degenerate cases before naming the conic.
7. Substitute a known point or expand the result to check the algebra.

### Classification boundaries

The core lessons treat axis-parallel conics with no $xy$ term. For a broader input $Ax^2+Bxy+Cy^2+Dx+Ey+F=0$, either report “rotation or further analysis required” when $B\ne0$, or implement a separate validated classifier. Do not apply the axis-parallel parameter tables directly to rotated equations. Opposite-sign squared terms or same-sign squared terms alone are insufficient to rule out every degenerate case.

### Short glossary and search aliases

| Term | Definition / alias |
|---|---|
| Abscissa | $x$-coordinate |
| Ordinate | $y$-coordinate |
| Cartesian plane | Rectangular coordinate plane |
| Directed distance | Signed displacement along an oriented line |
| Ordinary distance | Nonnegative length |
| Midpoint | Point halfway between two endpoints |
| Internal division | Division point inside a segment |
| External division | Division point on the extended line outside the segment |
| Collinear | Lying on one line |
| Slope | Rise/run for a nonvertical line |
| Perpendicular bisector | Line through a segment's midpoint perpendicular to the segment |
| Locus | Set of points satisfying a condition |
| Focus / foci | Fixed point / fixed points in a conic's distance definition |
| Directrix / directrices | Fixed reference line / lines in the focus-directrix definition |
| Principal axis | Conic's symmetry line containing its focus or foci |
| Vertex / vertices | Specified axis endpoint(s) on a conic; polygon corner(s) in polygon context |
| Covertex / covertices | Endpoint(s) of an ellipse's minor axis |
| Latus rectum / latera recta | Focal chord / chords perpendicular to the principal axis |
| Eccentricity | Focus-to-point / directrix-distance ratio; $c/a$ for noncircular ellipses and hyperbolas |
| Transverse axis | Hyperbola segment between vertices |
| Conjugate axis | Perpendicular reference segment of a hyperbola, length $2b$ |
| Asymptote | A line approached by an unbounded branch of a curve |
| Tangent | For a circle, a line meeting it at exactly one point |
| Apothem | Regular polygon center-to-side perpendicular segment |
| Shoelace formula | Coordinate formula for area of an ordered simple polygon |

---

## 9. Editorial correction and ambiguity log

Keep this section available to maintainers. The student-facing lessons above already apply the corrections. “Clarification” entries improve precision; “review” entries require a prompt decision and should not become live graded items automatically.

| ID | Source / page(s) | Issue | Treatment in this pack |
|---|---|---|---|
| ERR-01 | SRC-POLY p. 10 | 60 sides labeled “hexadecagon”; megagon shown with $10^8$ sides | Use “60-gon”; hexadecagon is 16 sides; megagon is $10^6$ sides |
| ERR-02 | SRC-POLY p. 11 | Area-ratio expression uses inconsistent side labels and explanation repeats perimeter wording | Use matching corresponding sides: $P_1/P_2=q$, $A_1/A_2=q^2$ |
| ERR-03 | SRC-POLY p. 14 | Diagonal count said to have length units | Count is dimensionless |
| ERR-04 | SRC-POLY pp. 17–19 | Intermediate rounding alters final measurements; later tables retain “Nonagon” labels | Recalculate without intermediate rounding; p. 18 is a dodecagon, p. 19 a 32-gon |
| ERR-05 | SRC-CART p. 15 | Oblique distance subtracts squared coordinate differences | Use the sum of squares |
| ERR-06 | SRC-CART p. 14 | Direction of square diagonal not fixed | Accept right- and left-reflected configurations unless direction is added |
| REV-01 | SRC-CART p. 24 | Ratio reminders have no complete task or directed/unsigned convention | Store C-R01 for teacher review only |
| REV-02 | SRC-CART p. 25 item 3 | “External” $C$, with $AB:BC=1:1$, does not explicitly state point order | Add “$C$ lies beyond $B$ on ray $AB$”; then $C=(3,9)$ |
| ERR-07 | SRC-CART p. 26 | Split/incomplete numbering around items 5 and 6 | Combine into C-P23 using the complete ratio and coordinates |
| ERR-08 | SRC-LINE p. 15 | Point-slope equation omits $m$ | $y-y_1=m(x-x_1)$ |
| CLA-01 | SRC-LINE pp. 7–13 | Directed angle, smaller line angle, and interior angle are not consistently distinguished | Add explicit angle modes and vector formulas |
| REV-03 | SRC-LINE p. 12 | Five point triples do not name target vertices; one triple is collinear | Adapt to all interior angles; exclude collinear row until reframed |
| CLA-02 | SRC-CIRC pp. 3–4 | Introductory statements can imply every conic has two vertices and a center | State that parabolas have one vertex and no center; circle is a special case |
| ERR-09 | SRC-CIRC p. 8 | Final coefficient is printed as $-5y^2$ | Correct to $+5y^2$ |
| CLA-03 | SRC-CIRC p. 10 | Distance to $x=d$ written without absolute value | $\vert x-d\vert $ before squaring |
| REV-04 | SRC-CIRC p. 19 | Printed hyperbola called circle; solution changes signs and gives unrelated center | Quarantine original circle example; printed equation is $(x-2)^2-y^2=11/2$ |
| ERR-10 | SRC-CIRC p. 25 | “Nonempty set” used where empty locus is intended | Classify by sign of $r^2$: circle, point, empty set |
| ERR-11 | SRC-CIRC p. 32 | Tangent at $(5,2)$ reported as $x=2$ | Correct to $x=5$ |
| ERR-12 | SRC-CIRC p. 33 | $25/5$ evaluated as 2, producing wrong circle | $r=5$; constant in expanded equation is $-23$ |
| CLA-04 | SRC-PARA pp. 6, 12–13 | $a$ alternates between directed and positive distance | Use signed $p$ and lengths $\vert p\vert $ consistently |
| ERR-13 | SRC-PARA pp. 15–17 | Problem uses $x^2=4y$; solution uses $x^2=20y$ | Split into Q01a and Q01b |
| ERR-14 | SRC-PARA p. 17 | Wrong directrix orientation and duplicate latus endpoint | For $x^2=20y$: $y=-5$, endpoints $(-10,5),(10,5)$ |
| CLA-05 | SRC-PARA p. 23 | General-form templates omit nondegeneracy conditions | Require the squared coefficient and the other variable's linear coefficient to be nonzero |
| ADD-01 | SRC-PARA p. 29 | Focus/directrix example stops before computing final equation | Complete to $y^2+6y+10x+4=0$ |
| ERR-15 | SRC-PARA p. 32 | Right-opening parabola with focus $(-3,4)$ has axis labeled $y=-3$ | Axis is $y=4$ |
| ERR-16 | SRC-ELLI p. 7 | Minor-axis description says $b$ while its displayed length is $2b$ | $b$ is the semiminor axis; full minor-axis length is $2b$ |
| ERR-17 | SRC-ELLI p. 17 | Horizontal ellipse given horizontal directrices; latus endpoints not offset by center | Directrices $x=-3\pm4/\sqrt3$; endpoint $y$ values $1/2,3/2$ |
| ERR-18 | SRC-ELLI p. 17 | Conflicting $b^2/c$ and $b^2/a$ wording for focal chord half-length | Use $b^2/a$ |
| ERR-19 | SRC-ELLI p. 21 | One latus rectum endpoint duplicated | Use all four combinations $(3\pm\sqrt5,-2\pm4/3)$ |
| ERR-20 | SRC-ELLI p. 24 | Ellipse general form labeled “parabola” | Correct label; same-sign coefficients need real-locus checks |
| ERR-21 | SRC-ELLI p. 26 and SRC-HYP p. 25 | Intermediate subtraction uses 26 where $4^2=16$ | Correct arithmetic; final $b^2=20$ is retained |
| ERR-22 | SRC-ELLI p. 28 and SRC-HYP p. 27 | Selected vertex text swaps $(4,6)$ to $(6,4)$ | Use actual given vertex $(4,6)$ |
| CLA-06 | SRC-HYP p. 3 | Definition omits absolute value of distance difference | Use $\vert PF_1-PF_2\vert =2a$ for both branches |
| ERR-23 | SRC-HYP p. 8 | Both standard forms labeled horizontal | Positive $y$-square form is vertical |
| EXT-01 | SRC-HYP p. 13 and SRC-CART p. 12 | Plain text extraction loses some radical symbols even when they appear visually | Preserve visually verified radicals: $-\sqrt{13}$ in H01, and square-root inputs in C-P02 and C-P05. This is an extraction limitation, not a slide error. |
| ERR-25 | SRC-HYP p. 23 | Explicit minus sign combined with claim that $A,B$ have different signs | Use $Ax^2+By^2+Dx+Ey+F=0$, $AB<0$ |
| CLA-07 | SRC-HYP p. 4 | Conjugate-axis wording mixes squared lengths and lengths | Define endpoints at distance $b$ with $b^2=c^2-a^2$ |
| ERR-26 | SRC-HYP p. 28 | Intermediate expansion drops grouping around a subtracted square | Expand the entire negative square; final H04 equation remains valid |
| ERR-27 | SRC-HYP p. 31 | Final equation incorrectly changes minus to plus | Preserve the negative $y$-term in H05 |

### Boundaries on source reconstruction

- No single intended circle equation is invented for SRC-CIRC p. 19.
- Conflicting parabola examples remain distinct and explicitly traced to the source pages.
- Source angle questions receive an explicit angle convention before grading.
- Review-only fragments are recorded, not silently discarded or presented as complete questions.
- This is a mathematical content adaptation, not a claim that every historical statement or bibliographic link in the sources has been verified.

---

## 10. Implementation and quality requirements

These requirements are new website implementation guidance, not claims that the PDFs contain interactive features.

### Lesson presentation

- Use readable explanations followed by a formula, a labeled diagram, a worked example, and practice when available.
- Offer “Show next step” and “Show solution” for worked examples and answer keys.
- Display units next to measurements and separate degrees from raw numeric values.
- Cross-link prerequisites and glossary entries instead of repeating long definitions.
- Keep student content distinct from source notes and maintainer comments.
- Keep all supplied example and practice IDs stable even when route labels change.

### Diagram and interaction requirements

- Use SVG, canvas, or an existing coordinate plotting component with mathematically equal $x$- and $y$-unit scales.
- Include labeled axes, clear coordinates, readable point labels, optional grid, reset, and text equivalents of derived values.
- Provide keyboard-operable controls and numeric inputs alongside dragging. Do not rely on color alone to distinguish objects.
- Clip curves to the viewport. Never connect the two branches of a hyperbola or draw a discontinuity as a connecting segment.
- Distinguish infinite reference lines, finite axis segments, and highlighted chords in labels or line style.
- Recompute directrices, foci, endpoints, and equations from one parameter state so displayed text cannot disagree with the drawing.
- Explain invalid inputs inline: zero-length segment, $p=0$, nonpositive radius or semiaxis, invalid polygon side count, or degenerate equation.

### Recommended curve parameterizations

These are implementation additions; $t$ is in radians where trigonometric functions are used.

| Curve | Parameterization |
|---|---|
| Circle | $x=h+r\cos t$, $y=k+r\sin t$, $0\le t\le2\pi$ |
| Horizontal-major ellipse | $x=h+a\cos t$, $y=k+b\sin t$ |
| Vertical-major ellipse | $x=h+b\cos t$, $y=k+a\sin t$ |
| Horizontal parabola | $x=h+t^2/(4p)$, $y=k+t$ |
| Vertical parabola | $x=h+t$, $y=k+t^2/(4p)$ |
| Horizontal hyperbola, each branch | $x=h+\sigma a\cosh t$, $y=k+b\sinh t$, $\sigma\in\{-1,1\}$ |
| Vertical hyperbola, each branch | $x=h+b\sinh t$, $y=k+\sigma a\cosh t$, $\sigma\in\{-1,1\}$ |

For hyperbolas, choose a finite $t$ range from viewport bounds, not an arbitrary range that overflows. For regular polygons, use vertices $C+R(\cos(\phi+2\pi j/n),\sin(\phi+2\pi j/n))$ for $j=0,\ldots,n-1$, with circumradius $R=s/[2\sin(\pi/n)]$. Screen coordinates usually increase downward: reverse the sign of displayed mathematical $y$ when mapping to pixels.

### Suggested lesson checks

Use short concept checks to diagnose these mistakes: confusing a polygon's diagonal count with a length; using a length ratio for areas; subtracting in the distance formula; swapping segment-ratio weights; treating a vertical slope as zero; selecting the acute angle when the triangle angle is obtuse; using a circle radius squared as the radius; reading a parabola coefficient as $p$ rather than $4p$; swapping directrix orientation; confusing ellipse and hyperbola focal relations; treating a conjugate-axis endpoint as a point on a hyperbola.

### Acceptance checks for a future website build

The checks below specify expected behavior. They are not a claim that a website has been built or tested in this task.

| Check | Input | Expected result |
|---|---|---|
| Distance | $(0,0),(3,4)$ | 5 |
| Coincident endpoints | Same point entered twice | Distance 0; slope and unique line unavailable |
| Vertical line | $(2,-1),(2,5)$ | $x=2$, undefined slope |
| Internal division | C02 | $(-3,2)$ |
| Ordinary external division | Fixed $A\ne B$, unsigned $m=n$ | No finite external point |
| Area orientation | Reverse C03 vertex order | Signed area reverses; absolute area stays 4 |
| Regular polygon | P01 | 27 diagonals; area about 154.55 |
| Point locus | O-P03 | Point $(1,2)$; no positive-radius circle |
| Tangent correction | O06 | $x=5$ |
| Tangent circle correction | O07 | $r=5$, expanded constant $-23$ |
| Parabola split | Q01a versus Q01b | Distinct focus/directrix and latus rectum values |
| Parabola axis | Q07 | $y=4$ |
| Ellipse offset | E02 | Directrices vertical; latus endpoints at $y=1/2,3/2$ |
| Ellipse focal sum | Move $P$ on E01 | Sum remains 16 within numerical tolerance |
| Hyperbola focal difference | Move $P$ on H01 | Absolute difference remains 6 |
| Hyperbola final sign | H05 | Given point $(7,1)$ satisfies the equation with a minus sign |
| Interior angle | L-A01 at $U$ | About $150.26^\circ$, not its acute supplement |
| Vertical hyperbola | H-P01 | Asymptote slopes $\pm4/3$, not $\pm3/4$ |

### Suggested first implementation order

1. Build a reusable lesson renderer, math rendering, module navigation, and source-reference display.
2. Import all 23 lessons, examples, and eligible practice rows.
3. Add a coordinate plot component and reuse it across lines and conics.
4. Add the polygon explorer and conic parameter controls.
5. Add revealable solutions and answer checking, keeping review-only items excluded.
6. Validate the mathematical acceptance checks and accessibility behavior.

---

## 11. Source coverage map and attribution

| Source | Pages | Disposition |
|---|---|---|
| SRC-POLY | 1–2 | Course title and outcomes reflected in module metadata |
| SRC-POLY | 3–10 | POLY-01 definitions and names; divider p. 5 omitted |
| SRC-POLY | 11 | POLY-02 similarity, corrected |
| SRC-POLY | 12–16 | POLY-03 and POLY-04 formulas and derivations |
| SRC-POLY | 17–19 | P01–P03, recalculated |
| SRC-POLY | 20–21 | Original reference lists; not independently consulted |
| SRC-CART | 1–9 | Module outcomes and CART-01; historical narrative condensed out; quadrant image represented in text |
| SRC-CART | 10–17 | CART-02, C01, C-P01–C-P18 |
| SRC-CART | 18–26 | CART-03, C02, C-P19–C-P24, C-R01 |
| SRC-CART | 27–31 | CART-04, C03, C-P25–C-P31 |
| SRC-CART | 32 | Original reference list; not independently consulted |
| SRC-LINE | 1–6 | Outcomes, LINE-01, L-P01–L-P08; p. 3 divider omitted |
| SRC-LINE | 7–13 | LINE-02, L01, L-P09–L-P13, L-A01–L-A10 |
| SRC-LINE | 14–21 | LINE-03 and L02; duplicated two-point slides combined |
| SRC-LINE | 22 | Original reference list; not independently consulted |
| SRC-CIRC | 1–14 | Outcomes, CIRC-01, K01–K02, K-P01–K-P04 |
| SRC-CIRC | 15–24 | CIRC-02 and O01–O05; p. 19 quarantined as O-R01 |
| SRC-CIRC | 25–30 | Locus classification and O-P01–O-P04 |
| SRC-CIRC | 31–33 | CIRC-03 and corrected O06–O07 |
| SRC-CIRC | 34 | Original reference list; not independently consulted |
| SRC-PARA | 1–14 | Outcomes, PARA-01, PARA-02, four opening diagrams transcribed to parameter table |
| SRC-PARA | 15–21 | Q01a, Q01b, Q02; inconsistent example split |
| SRC-PARA | 22–32 | PARA-03, Q03–Q07; p. 22 divider omitted |
| SRC-PARA | 33 | Original reference list; not independently consulted |
| SRC-ELLI | 1–11 | Outcomes, ELLI-01, ELLI-02, labeled parts transcribed |
| SRC-ELLI | 12–21 | E01–E03 and graphing method |
| SRC-ELLI | 22–24 | Transition and ELLI-03 general form; divider pages omitted |
| SRC-ELLI | 25–33 | E04–E07 |
| SRC-ELLI | 34 | Original reference list; not independently consulted |
| SRC-HYP | 1–8 | Outcomes, HYP-01, HYP-02; graph figures represented by diagram requirements |
| SRC-HYP | 9–21 | H01–H02, graphing method, and asymptotes |
| SRC-HYP | 22–32 | HYP-03, H03–H06; p. 22 divider omitted |
| SRC-HYP | 33 | Original reference list; not independently consulted |

**Suggested website source credit:** “Adapted from Engineering Mathematics 2 instructional materials on plane geometry, Cartesian coordinates, lines, circles, parabolas, ellipses, and hyperbolas, MPS Department, FEU Institute of Technology. Explanations have been reorganized and selected mathematical errors corrected. Interactive activities and supplemental practice were added for this website.”

The PDFs cite works by Swokowski and Cole, Stewart, Comandante, Ymas, Burdette, Sprague, and others, as well as several web resources. Those are references reported by the PDFs, not independently verified sources for this pack. Retain the original PDFs as the source record. This Markdown pack is self-contained for lesson text and equation-driven diagrams; access to the PDFs is useful for editorial comparison but is not a runtime website dependency.
