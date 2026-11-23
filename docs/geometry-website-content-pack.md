---
title: "Engineering Mathematics 2: Geometry Website Content Pack"
version: "1.1"
language: "en"
audience: "Introductory college geometry and engineering mathematics students"
format: "Framework-independent Markdown with LaTeX mathematics"
source_documents: 13
source_pages: 335
content_policy: "Adapted instruction; corrected mathematics; source-linked examples; explicitly marked additions"
---

# Geometry Website Content Pack

## 0. Instructions for the IDE assistant

Use this file as the content specification for an educational website. It contains the teaching material, mathematical rules, worked examples, practice answers, diagram requirements, and source correction notes. Build the website within the user's existing project and design conventions. This file does not prescribe a framework, hosting service, authentication system, or backend.

### How to use this pack

1. Read this section and the correction log before implementing lessons or calculators.
2. Create the fifteen modules in the navigation order below. Use stable IDs for routes, search, examples, and progress records.
3. Treat module explanations and worked examples as student-facing content. Treat implementation notes, provenance, and the correction log as editorial/developer information.
4. Preserve LaTeX expressions. Render inline math with `$...$` and display math with `$$...$$`, or convert consistently to the project's math renderer.
5. Keep answer keys hidden until requested by the learner. Do not put editorial review items into automatically graded quizzes.
6. Use the corrected content in this pack when a source slide contradicts it. Do not copy known incorrect equations from the PDFs.
7. Draw mathematical figures from coordinates and equations. Screenshot decoration and slide backgrounds are not required assets.
8. Label any lessons, examples, applications, or questions added beyond this pack as newly authored content in the site's internal content records.

### Scope and editorial status

This is an adapted content pack, not a verbatim transcription. It retains the instructional topics and identifiable mathematical problems from all thirteen PDFs; combines repeated slides; turns image-based formulas into text; supplies independently derived answers; and flags incomplete or conflicting prompts. Institutional title slides, decorative images, historical digressions, and repeated bibliography slides are not lessons. The course sources identify the MPS Department, FEU Institute of Technology; retain source attribution in an About/Sources area without implying institutional endorsement.

All page citations below are **1-based PDF page numbers**, not printed labels. `P01`, `C01`, etc. are pack identifiers, not IDs from the original PDFs. Suggested interactions, accessibility requirements, additional explanations, and computational safeguards are implementation additions. Answer keys were derived for this pack unless an example already contains a valid source solution. No external websites or listed source bibliographies were consulted.

### Version 1.1 additions

This revision adds six PDFs and eight modules (26 lessons) to the original seven-module pack. All original module slugs, lesson IDs, formula IDs, and exercise IDs are preserved. Section numbers and navigation order have changed so triangles and quadrilaterals precede the coordinate lessons, and solid geometry follows the conics. Use stable IDs rather than section numbers for stored progress and application links.

The updated pack is still a single, self-contained Markdown file. The PDFs are editorial references, not required runtime assets. New diagrams and image-only problem statements have been described in text so the IDE assistant can reconstruct them without the PDF files. Source examples that require clarification are explicitly flagged; revised variants do not pretend to recover an unambiguous original intention.

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
| SRC-TRI | STPDF2_Triangles(1).pdf | 17 | Triangle classification, special segments, perimeter and area |
| SRC-QUAD | STPDF3_Quadrilaterals.pdf | 20 | Quadrilateral classification, diagonals and area |
| SRC-PRISM | MTPDF10 Prisms (1).pdf | 22 | Prism parts, nets, surface area and volume |
| SRC-BOX | STPPT2 Parallelepiped and Cubes (1).pdf | 21 | Cubes, parallelepipeds, diagonals, packing and material quantities |
| SRC-CYL | STPPT3 Cylinders (1).pdf | 14 | Circular, hollow and elliptic cylinders |
| SRC-PYCS | MTPDF11 Pyramid and Non-polyhedron (1).pdf | 32 | Pyramids, cones, spheres, zones and spherical segments |

### Navigation and prerequisites

| Order | Module ID / route slug | Title | Prerequisites | Lesson IDs |
|---:|---|---|---|---|
| 1 | plane-figures-polygons | Plane Figures and Polygons | Basic algebra and right-triangle trigonometry | POLY-01 through POLY-04 |
| 2 | triangles | Triangles | POLY-01, basic algebra and trigonometry | TRI-01 through TRI-04 |
| 3 | quadrilaterals | Quadrilaterals | TRI-03, POLY-01 | QUAD-01 through QUAD-04 |
| 4 | cartesian-coordinates | Cartesian Coordinates | Basic algebra and Pythagorean theorem | CART-01 through CART-04 |
| 5 | lines | Lines | CART-01, CART-02 | LINE-01 through LINE-03 |
| 6 | circles | Conics and Circles | CART-02, LINE-03, completing the square | CIRC-01 through CIRC-03 |
| 7 | parabolas | Parabolas | CIRC-01, completing the square | PARA-01 through PARA-03 |
| 8 | ellipses | Ellipses | CIRC-01, completing the square | ELLI-01 through ELLI-03 |
| 9 | hyperbolas | Hyperbolas | CIRC-01, ELLI-01, completing the square | HYP-01 through HYP-03 |
| 10 | prisms | Prisms | TRI-03, QUAD-02, POLY-04 | PRISM-01 through PRISM-03 |
| 11 | parallelepipeds-cubes | Parallelepipeds and Cubes | PRISM-01, PRISM-02, QUAD-02 | BOX-01 through BOX-03 |
| 12 | cylinders | Cylinders | PRISM-02, circle area; ELLI-01 for elliptic bases | CYL-01 through CYL-03 |
| 13 | pyramids | Pyramids | TRI-03, POLY-04, PRISM-01 | PYR-01 through PYR-03 |
| 14 | cones | Cones | PYR-02, CYL-01, Pythagorean theorem | CONE-01 through CONE-03 |
| 15 | spheres-segments | Spheres and Spherical Segments | Circle area, volume units, Pythagorean theorem | SPH-01 through SPH-03 |

This yields **49 lessons across 15 modules**. A module page should expose its overview, outcomes, lessons, worked examples, practice, and summary formulas. Global search should match lesson titles, glossary terms, formula names, and example IDs.

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

**Plane and solid geometry notation:** Triangle area may be written $K$ to avoid confusion with vertex/angle $A$. Triangle semiperimeter is $s_p$ so it is not confused with polygon side $s$. In solids, $B$ is the area of one base, $P_b$ is base perimeter, $A_L$ is lateral/curved area as defined, $A_T$ is total included boundary area, and $V$ is volume. Use $m=\rho V$ for mass from density. Use $R_b$ for polygon circumradius, $r_a$ for apothem, $\ell$ for slant height, and $E$ for a pyramid's lateral edge. Reusing letters is acceptable within a lesson only when their meanings are defined there.

**Area distinctions:** A zone is a curved surface; a segment is a solid portion. Total surface area depends on which flat faces close the solid. Wetted container area includes only container surfaces touching liquid. The exposed liquid surface is not wetted container wall. Volume units are cubic; area units are square. Convert all linear measurements before multiplying, and cube the conversion factor for volumes.

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

## 2. Triangles

**Module ID:** `triangles`  
**Source:** SRC-TRI, STPDF2_Triangles(1).pdf, pp. 2–15.

**Overview:** Classify triangles, distinguish their special segments and centers, and calculate perimeter, area, altitude, median, and internal angle-bisector lengths.

**Learning outcomes:** Classify by sides and angles; identify incenter, orthocenter, and centroid; select an area formula from the given data; calculate all three kinds of special segment.

### TRI-01 — Classification and parts

**Sources:** SRC-TRI pp. 4–5.

A triangle is a three-sided polygon. Its interior angles sum to $180^\circ$. Use vertices $A,B,C$, with opposite side lengths $a=BC$, $b=CA$, $c=AB$. Side symbols represent lengths, while capital letters may denote angles at the corresponding vertices.

| Classification | Definition |
|---|---|
| Scalene | Three unequal side lengths; three unequal angles |
| Isosceles | At least two equal sides, with equal opposite angles |
| Equilateral | Three equal sides; all angles $60^\circ$ |
| Right | One $90^\circ$ angle |
| Acute | All angles less than $90^\circ$ |
| Obtuse | One angle greater than $90^\circ$ |
| Oblique | No right angle; includes acute and obtuse triangles |
| Equiangular | Three equal angles; equivalent to equilateral for triangles |

**Convention:** Use the inclusive definition of isosceles (“at least two”). Thus an equilateral triangle is also isosceles. If a quiz requires one exclusive label, ask for the most specific side classification.

In an isosceles triangle, the **vertex angle** is between the two equal sides, and the **base angles** adjoin the remaining side, the base. Any side of a general triangle may be chosen as the base when paired with its corresponding altitude.

A valid nondegenerate triangle with three positive sides satisfies all triangle inequalities; equivalently, the longest side is shorter than the sum of the other two. A sum equal to the longest side gives a straight, degenerate configuration.

**Supplemental classification check:** If $c$ is the longest side, compare $c^2$ with $a^2+b^2$: equal means right, smaller means acute, and larger means obtuse. Apply this only after checking the triangle inequalities.

### TRI-02 — Altitudes, medians, angle bisectors, and centers

**Sources:** SRC-TRI pp. 5–7; notation standardized and geometric details clarified.

| Object | Definition | Concurrency point |
|---|---|---|
| Altitude | Perpendicular segment from a vertex to the opposite side's supporting line | Orthocenter |
| Median | Segment from a vertex to the midpoint of the opposite side | Centroid |
| Internal angle bisector | Segment dividing a vertex angle into equal angles and ending on the opposite side | Incenter |

An altitude may end outside the side segment for an obtuse triangle. The incenter is the center of the inscribed circle. The centroid divides every median in a $2:1$ ratio, measured from vertex toward side midpoint; this ratio is a supplemental explanatory fact. A median, altitude, and angle bisector from the same vertex are generally different segments.

Let $K$ be triangle area and $s_p=(a+b+c)/2$ its semiperimeter. From vertex $C$ to side $c$:

$$h_c=\frac{2K}{c}=\frac{2\sqrt{s_p(s_p-a)(s_p-b)(s_p-c)}}{c}.\tag{F-T01}$$

$$m_c=\frac12\sqrt{2a^2+2b^2-c^2}.\tag{F-T02}$$

$$\ell_c=\frac{\sqrt{ab[(a+b)^2-c^2]}}{a+b}.\tag{F-T03}$$

Cycle the labels to calculate the corresponding quantities from $A$ or $B$. The lengths $a,b$ in the angle-bisector formula are the two sides adjacent to the bisected angle. F-T02 agrees with the source's displayed median formula and worked example on pp. 6–7. The leading factor $1/2$ is outside the square root.

#### Worked example T01 — All special segments of a 5–12–13 triangle

**Source:** SRC-TRI p. 7. Set $a=5$, $b=12$, $c=13$, in centimeters.

1. $s_p=15$ and $K=\sqrt{15(10)(3)(2)}=30\text{ cm}^2$.
2. Use $h_i=2K/i$ for the altitudes.
3. Substitute the side lengths in F-T02 and F-T03 for medians and internal bisectors.

| Vertex | Altitude | Median | Internal angle bisector |
|---|---|---|---|
| $A$ | $12\text{ cm}$ | $\sqrt{601}/2\text{ cm}$ | $12\sqrt{26}/5\text{ cm}$ |
| $B$ | $5\text{ cm}$ | $\sqrt{61}\text{ cm}$ | $5\sqrt{13}/3\text{ cm}$ |
| $C$ | $60/13\text{ cm}$ | $13/2\text{ cm}$ | $60\sqrt2/17\text{ cm}$ |

### TRI-03 — Perimeter and area

**Sources:** SRC-TRI pp. 8–13.

| Formula ID | Given information | Formula |
|---|---|---|
| F-T04 | Three sides | $P=a+b+c$ |
| F-T05 | Base $b_0$ and perpendicular height $h$ | $K=b_0h/2$ |
| F-T06 | Two sides and their included angle $\theta$ | $K=ab\sin\theta/2$ |
| F-T07 | Three valid side lengths | $K=\sqrt{s_p(s_p-a)(s_p-b)(s_p-c)}$ |
| F-T08 | Equilateral side $q$ | $h=q\sqrt3/2$, $K=q^2\sqrt3/4$, $P=3q$ |

F-T07 is **Heron's formula**. The included angle in F-T06 lies between the two given sides. Do not use an unrelated triangle angle. In a right triangle, the two legs can serve as base and perpendicular height.

#### Worked example T02 — Perimeter and area

**Source:** SRC-TRI p. 12. Sides $5,12,13\text{ cm}$ give $P=30\text{ cm}$ and $K=30\text{ cm}^2$, either by Heron's formula or $(5)(12)/2$.

#### Worked example T03 — Equilateral triangle from its perimeter

**Source:** SRC-TRI p. 13. A perimeter of $18\text{ cm}$ gives side $q=6\text{ cm}$, so $K=\sqrt3(6)^2/4=9\sqrt3\text{ cm}^2$.

### TRI-04 — Alternative configurations and angle ambiguity

**Sources:** SRC-TRI pp. 14–15.

#### Worked example T04 — Maximum among two isosceles configurations

**Source:** SRC-TRI p. 14. An isosceles triangle has perimeter $72\text{ cm}$ and one side $20\text{ cm}$. Find the maximum possible area.

1. If 20 is the base, the equal sides are 26. The altitude is $\sqrt{26^2-10^2}=24$, and area is $240\text{ cm}^2$.
2. If 20 is one of the equal sides, the sides are $20,20,32$. The altitude to side 32 is $\sqrt{20^2-16^2}=12$, and area is $192\text{ cm}^2$.
3. Both satisfy the conditions. The larger area is $\boxed{240\text{ cm}^2}$.

This compares the configurations allowed by the specific conditions; it is not an unconstrained optimization over every triangle of perimeter 72.

#### Worked example T05 — Two possible included angles

**Source:** SRC-TRI p. 15. Area $72\text{ in}^2$ with sides 12 in and 24 in gives

$$72=\tfrac12(12)(24)\sin\theta,\qquad\sin\theta=\tfrac12.$$

Since an interior angle lies between $0^\circ$ and $180^\circ$, the answers are $\boxed{30^\circ\text{ and }150^\circ}$. An inverse-sine button returns only one principal value, so check the supplementary angle as well.

**Interaction INT-TRIANGLE:** Enter three sides or drag three vertices. Validate noncollinearity and triangle inequalities, then display classifications, perimeter, and area. Toggle all altitudes, medians, and internal bisectors with their centers. Extend opposite sides when an altitude falls outside. Include T01 and T04 presets. A separate SAS mode should show how supplementary included angles produce equal areas.

**Practice:** Reuse T01–T05 with solutions initially hidden. **Supplemental T-P01:** For sides $13,14,15\text{ cm}$, find area and altitude to side 14. **Answer:** $84\text{ cm}^2$ and $12\text{ cm}$. **Supplemental T-P02:** Can $2,3,5$ be nondegenerate triangle sides? **Answer:** No; $2+3=5$.

---

## 3. Quadrilaterals

**Module ID:** `quadrilaterals`  
**Source:** SRC-QUAD, STPDF3_Quadrilaterals.pdf, pp. 2–18.

**Overview:** Classify quadrilaterals and calculate their perimeters, diagonals, and areas from suitable measurements.

**Learning outcomes:** Classify by parallel sides and special properties; use parallelogram and rhombus diagonal relations; solve rectangle, square, and trapezoid problems; use the general convex-quadrilateral area formula when sufficient angular data are supplied.

### QUAD-01 — Classification and parallelograms

**Sources:** SRC-QUAD pp. 4–7.

A quadrilateral is a four-sided polygon. For this pack, use the source's convention: a **trapezoid** has exactly one pair of parallel opposite sides, a **trapezium** has no parallel sides, and a **parallelogram** has two pairs. These names have other regional conventions, so state this convention in the lesson and quiz instructions.

Rectangles, rhombi, and squares are special parallelograms. A square is both a rectangle and a rhombus. In a parallelogram, opposite sides are parallel and equal, opposite angles are equal, consecutive angles are supplementary, and diagonals bisect one another. Use labels $A,B,C,D$ consecutively around the boundary; the source diagram uses a different vertex order on some pages.

For adjacent side lengths $a,b$ and their included angle $\theta$:

$$P=2(a+b),\qquad K=ab\sin\theta=b h.\tag{F-QD01}$$

The corresponding diagonal lengths form the unordered pair

$$\left\{\sqrt{a^2+b^2-2ab\cos\theta},\sqrt{a^2+b^2+2ab\cos\theta}\right\}.\tag{F-QD02}$$

With diagonal lengths $d_1,d_2$ and angle $\phi$ between them,

$$K=\tfrac12d_1d_2\sin\phi.\tag{F-QD03}$$

The angle between diagonals is not generally the angle between sides.

#### Worked example QD01 — Parallelogram diagonals and area

**Source:** SRC-QUAD p. 7. Sides $10,15\text{ cm}$ with included angle $135^\circ$:

1. The diagonal squares are $325\pm150\sqrt2$.
2. The diagonals are approximately $23.18\text{ cm}$ and $10.62\text{ cm}$.
3. $K=(10)(15)\sin135^\circ=75\sqrt2\approx106.07\text{ cm}^2$.

### QUAD-02 — Rectangles and squares

**Sources:** SRC-QUAD pp. 8–11.

| Shape | Perimeter | Area | Diagonal |
|---|---|---|---|
| Rectangle of length $L$, width $W$ | $2(L+W)$ | $LW$ | $\sqrt{L^2+W^2}$ |
| Square of side $q$ | $4q$ | $q^2$ | $q\sqrt2$ |

Formula IDs: **F-QD04** rectangle measurements; **F-QD05** square measurements.

#### Worked example QD02 — Rectangle from perimeter and ratio

**Source:** SRC-QUAD p. 9, intermediate arithmetic corrected. If $P=24\text{ cm}$ and $L=3W$, then $L+W=12$, $W=3$, and $L=9$. Area is $27\text{ cm}^2$. The diagonal is $\sqrt{9^2+3^2}=\sqrt{90}=3\sqrt{10}\text{ cm}$, not the intermediate $\sqrt{50}$ printed in the source.

#### Worked example QD03 — Square from its area

**Source:** SRC-QUAD p. 11. Area $25\text{ cm}^2$ gives side 5 cm, perimeter 20 cm, and diagonal $\sqrt{50}=5\sqrt2\text{ cm}$.

### QUAD-03 — Rhombi

**Sources:** SRC-QUAD pp. 12–14.

A **rhombus** is an equilateral parallelogram. Its diagonals bisect each other at right angles. For side length $q$:

$$P=4q,\quad K=bh=q^2\sin\theta=\frac{d_1d_2}{2},\quad q=\frac12\sqrt{d_1^2+d_2^2}.\tag{F-QD06}$$

The diagonal squares are $2q^2(1-\cos\theta)$ and $2q^2(1+\cos\theta)$, in an order depending on labels. They are not both $2q^2(1-\cos\theta)$, as printed on p. 12.

#### Worked example QD04 — Equilateral triangle inside a rhombus

**Source:** SRC-QUAD p. 14, corrected. Consecutive vertices are $A,B,C,D$, diagonal $BD=8\text{ cm}$, and triangle $ADC$ is equilateral.

1. If the rhombus side is $q$, equilateral triangle $ADC$ implies diagonal $AC=q$.
2. The rhombus identity gives $AC^2+BD^2=4q^2$.
3. Thus $q^2+64=4q^2$, so $q=8/\sqrt3$.
4. $K=AC\cdot BD/2=\boxed{32/\sqrt3=32\sqrt3/3\text{ cm}^2}$.

The source answer $32\sqrt3$ assumes the given 8 cm is the side of an equilateral constituent triangle. It is not: the printed label identifies the other diagonal $BD$. Keep the stated geometry and the corrected answer together.

### QUAD-04 — Trapezoids and general convex quadrilaterals

**Sources:** SRC-QUAD pp. 15–18.

A trapezoid's parallel sides are its bases. With lengths $b_1,b_2$ and perpendicular separation $h$:

$$K=\tfrac12(b_1+b_2)h.\tag{F-QD07}$$

Its perimeter is the sum of all four sides. The nonparallel sloping side is not generally the height.

#### Worked example QD05 — Right trapezoid

**Source:** SRC-QUAD p. 16; diagram measurements transcribed. Bases 5 cm and 9 cm, left side perpendicular to the bases, lower-right interior angle $45^\circ$:

1. Horizontal offset is $9-5=4\text{ cm}$.
2. $h=4\tan45^\circ=4\text{ cm}$; sloping side $4\sqrt2\text{ cm}$.
3. $K=(5+9)(4)/2=28\text{ cm}^2$.
4. $P=5+9+4+4\sqrt2=18+4\sqrt2\approx23.66\text{ cm}$.

**Diagram coordinates:** $(0,0),(9,0),(5,4),(0,4)$ in boundary order reproduce the geometry exactly.

For a convex quadrilateral with side lengths $a,b,c,d$ in order, semiperimeter $s_p=(a+b+c+d)/2$, and opposite interior angles $\alpha,\gamma$, **Bretschneider's formula** is

$$K=\sqrt{(s_p-a)(s_p-b)(s_p-c)(s_p-d)-abcd\cos^2\!\left(\frac{\alpha+\gamma}{2}\right)}.\tag{F-QD08}$$

This formula is not limited to the no-parallel-sides subclass. Four side lengths alone generally do not determine the area. Check geometric consistency of user input; a nonnegative radicand alone is not a complete construction test.

#### Worked example QD06 — Vacant lot

**Source:** SRC-QUAD p. 18. Sides $14,4,12,20\text{ m}$ with an opposite-angle sum of $240^\circ$:

1. $s_p=25\text{ m}$.
2. $K^2=(11)(21)(13)(5)-(14)(4)(12)(20)\cos^2120^\circ=11655$.
3. $K=\sqrt{11655}\approx107.96\text{ m}^2$.

**Interaction INT-QUADRILATERAL:** Offer constrained modes for parallelogram, rectangle, square, rhombus, and right trapezoid. Display side and diagonal measurements, angle properties, and area. Constrain dragging to preserve the selected class. Show a diagonal-based right-triangle construction for QD04. For a freely drawn quadrilateral, use ordered-coordinate area and identify self-intersection rather than applying a special-shape formula indiscriminately.

**Practice:** Reuse QD01–QD06 with solutions hidden. **Supplemental QD-P01:** Rhombus diagonals 6 and 8 cm. **Answer:** side 5 cm, perimeter 20 cm, area $24\text{ cm}^2$.

---

## 4. Cartesian Coordinates

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

## 5. Lines

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

## 6. Conics and Circles

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

## 7. Parabolas

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

## 8. Ellipses

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

## 9. Hyperbolas

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

## 10. Prisms

**Module ID:** `prisms`  
**Source:** SRC-PRISM, MTPDF10 Prisms (1).pdf, pp. 2–21.

**Overview:** Relate base area, perpendicular height, lateral faces, and nets to prism surface area and volume.

**Learning outcomes:** Identify right and oblique prisms and their parts; distinguish height from lateral-edge length; calculate lateral area, total area, volume, and simple density-based mass; evaluate whether a problem's dimensions are consistent.

### PRISM-01 — Parts, types, and nets

**Sources:** SRC-PRISM pp. 3–6, 8–10.

A **prism** is a polyhedron with two congruent polygonal bases in parallel planes, joined by parallelogram lateral faces. Corresponding points of the bases differ by the same translation. A **polyhedron** is a solid bounded by polygonal faces. A **net** lays a solid's faces flat while preserving their sizes and adjacency.

| Term | Definition |
|---|---|
| Base | Either of the congruent parallel polygonal faces |
| Lateral face | A face joining corresponding base edges |
| Lateral edge | Segment joining corresponding vertices of the bases |
| Altitude / perpendicular height $h$ | Perpendicular distance between the base planes |
| Axis segment | Segment joining the base centroids; parallel and equal in length to lateral edges |
| Right prism | Lateral edges are perpendicular to the bases; lateral faces are rectangles |
| Oblique prism | Lateral edges are not perpendicular to the bases |
| Right section | A section made by a plane perpendicular to the lateral-edge direction |

The source statement that a right prism's axis is “parallel” to its base is incorrect: it is perpendicular. The length of the axis segment equals a lateral edge; only for a right prism does that length equal the perpendicular height.

Name the prism by the base shape: triangular, rectangular, pentagonal, hexagonal, and so on. “Right regular pentagonal prism” specifies both a regular pentagon base and right lateral edges. A parallelogram-base prism is a parallelepiped.

For an $n$-gonal prism: faces $n+2$, edges $3n$, vertices $2n$. Thus a triangular prism has 5 faces, 9 edges, and 6 vertices; a rectangular prism has 6, 12, and 8, respectively.

**Diagram brief:** Draw paired right and oblique prisms with equal base area and perpendicular height. Show the altitude with a right-angle marker, distinct from a sloping lateral edge. Include an unfoldable right triangular-prism net with two congruent triangles and three rectangles.

### PRISM-02 — Area, volume, and applicability

**Sources:** SRC-PRISM pp. 7–10; formula labels and restrictions corrected.

Let $B$ be the area of **one** base, $P_b$ its perimeter, and $h$ the perpendicular distance between base planes.

| Formula ID | Quantity | Formula and condition |
|---|---|---|
| F-PR01 | Volume | $V=Bh$, right or oblique prism |
| F-PR02 | Lateral surface area | $A_L=P_bh$, right prism |
| F-PR03 | Total surface area | $A_T=A_L+2B$, closed prism |
| F-PR04 | General oblique lateral area | Sum the actual areas of the lateral parallelogram faces |
| F-PR05 | Right triangular prism | $V=(b_0h_t/2)L$, $A_T=b_0h_t+(u+v+w)L$ |
| F-PR06 | Rectangular prism | $V=LWH$, $A_T=2(LW+LH+WH)$ |

In F-PR05, $b_0,h_t$ are a matched base/altitude pair of the triangular end, $u,v,w$ are its actual side lengths, and $L$ is the prism length perpendicular to that end. These are different measurements.

For an oblique prism, $P_bh$ is generally not the lateral area. An alternative construction uses right-section perimeter times lateral-edge length when a complete right section crossing the lateral edges is available; the general implementation should instead sum the lateral-face areas.

**Open surfaces:** A missing end removes one $B$; two missing ends remove $2B$. State explicitly which faces are included. Volume refers to enclosed capacity or occupied space according to the problem; area concerns exposed surfaces.

#### Worked example PR01 — Rectangular-prism net

**Source:** SRC-PRISM p. 8. Dimensions $2,3,6\text{ cm}$:

$$A_T=2(2\cdot3+2\cdot6+3\cdot6)=72\text{ cm}^2.$$

The net has two $2\times3$, two $2\times6$, and two $3\times6$ rectangles. Its volume is $36\text{ cm}^3$ (additional derived output).

#### Worked example PR02 — Dimensions shown in a diagram

**Source:** SRC-PRISM p. 11. Rectangular prism edges 6, 5, and 3 cm:

$$A_T=2(6\cdot5+6\cdot3+5\cdot3)=126\text{ cm}^2.$$

Its volume is $90\text{ cm}^3$ (additional derived output). The order assigned to length, width, and height does not change these results.

#### Worked example PR03 — Valid triangular prism from a net

**Source:** SRC-PRISM p. 21; diagram dimensions transcribed. The triangular ends are right triangles with legs 9 and 12 cm, hypotenuse 15 cm, and prism length 10 cm.

1. $B=9(12)/2=54\text{ cm}^2$; $P_b=9+12+15=36\text{ cm}$.
2. $A_L=36(10)=360\text{ cm}^2$.
3. $A_T=360+2(54)=\boxed{468\text{ cm}^2}$.
4. $V=54(10)=\boxed{540\text{ cm}^3}$.

**Reconstructable diagram:** Use triangle vertices $(0,0),(12,0),(0,9)$ in the base plane and translate by 10 units perpendicularly. The net's three rectangles have widths 9, 12, and 15 and common length 10.

### PRISM-03 — Applications and inconsistent source prompts

**Sources:** SRC-PRISM pp. 12–20.

#### Worked example PR04 — Wooden block

**Source:** SRC-PRISM p. 18. A block measures $7.5\times8.7\times12\text{ cm}$, and its material has mass $0.7\text{ g}$ per cubic centimeter.

1. $V=7.5(8.7)(12)=783\text{ cm}^3$.
2. $A_T=2(7.5\cdot8.7+7.5\cdot12+8.7\cdot12)=519.3\text{ cm}^2$.
3. Space diagonal $D=\sqrt{7.5^2+8.7^2+12^2}\approx16.61\text{ cm}$.
4. Mass $m=\rho V=0.7(783)=548.1\text{ g}$.

The source calls this quantity “weight.” Grams measure mass. A force weight would require a specified gravitational acceleration and force units.

#### Worked example PR05 — Cube from its volume

**Source:** SRC-PRISM p. 19. For $V=95\text{ cm}^3$, the edge is $q=\sqrt[3]{95}\approx4.56\text{ cm}$, and total surface area is $6(95)^{2/3}\approx124.92\text{ cm}^2$. Retain the unrounded cube root when computing area.

#### Worked example PR06 — Regular hexagonal prism recast as a cube

**Source:** SRC-PRISM p. 20; clarified adaptation. The source says “base inscribed about a circle,” which mixes two different constructions. For the live version, state: **the regular hexagonal base is circumscribed about a circle of radius 2 cm** and prism height is 10 cm. Assume no material is lost on recasting.

1. Apothem $r_a=2$; side $s=2r_a\tan30^\circ=4/\sqrt3$.
2. $B=(6s)r_a/2=8\sqrt3\text{ cm}^2$.
3. Cube volume $V=80\sqrt3\text{ cm}^3$.
4. Cube edge $q=\sqrt[3]{80\sqrt3}\approx5.17\text{ cm}$.

If instead the regular hexagon is **inscribed in** a circle of radius 2, then side 2 gives $B=6\sqrt3$, and the cube edge is $\sqrt[3]{60\sqrt3}\approx4.70\text{ cm}$. Do not choose between these interpretations silently. PR06 is the explicitly clarified first interpretation.

**Review-only original triangular-prism examples:** These cannot represent the triangles implied by their stated side lengths and altitudes. Do not grade their printed numerical answers as correct geometry.

| Review ID | Source | Conflict | Printed calculation / status |
|---|---|---|---|
| PR-R01 | pp. 12–13 | Triangular base 3, altitude 4, other sides interpreted as 6 and 6; length 8 | $12+(3+6+6)8=132$, but a 3–6–6 triangle does not have altitude 4 to side 3 |
| PR-R02 | pp. 14–15 | Base 5, altitude 4, other sides 6 and 6 from solution; length 8 | $20+(5+6+6)8=156$, but a 5–6–6 triangle does not have altitude 4 to side 5 |
| PR-R03 | pp. 16–17 | Base 12, altitude 9, other sides 9 and 9 from text/solution; length 14 | Source also uses perimeter $9+9+9$, omitting the stated side 12; printed 486 is invalid |

**Explicitly revised variants (new adaptations, not inferred original intentions):** Retain each side triple and prism length, and derive a consistent triangle altitude. These can become practice items if their revised prompts replace the originals completely.

| ID | Revised triangular end and prism length | Derived altitude to first listed side | Correct total surface area |
|---|---|---|---|
| PR-V01 | Sides $3,6,6\text{ cm}$; length 8 cm | $3\sqrt{15}/2\text{ cm}$ | $120+9\sqrt{15}/2\approx137.43\text{ cm}^2$ |
| PR-V02 | Sides $5,6,6\text{ in}$; length 8 in | $\sqrt{119}/2\text{ in}$ | $136+5\sqrt{119}/2\approx163.27\text{ in}^2$ |
| PR-V03 | Sides $12,9,9\text{ in}$; length 14 in | $3\sqrt5\text{ in}$ | $420+36\sqrt5\approx500.50\text{ in}^2$ |

**Interaction INT-PRISM:** Choose a triangle or regular polygon base, right/oblique mode, and height. For right mode, unfold the lateral faces and show perimeter times height. In oblique mode, show perpendicular height and lateral-edge length separately; use face areas for surface area. Validate triangle side/altitude consistency. Include PR03 as a fully specified net preset.

---

## 11. Parallelepipeds and Cubes

**Module ID:** `parallelepipeds-cubes`  
**Source:** SRC-BOX, STPPT2 Parallelepiped and Cubes (1).pdf, pp. 2–20.

**Overview:** Recognize parallelepipeds and cubes as prisms and solve area, volume, diagonal, packing, and material-quantity problems.

**Learning outcomes:** Identify solid properties; distinguish face and space diagonals; calculate box and cube measurements; distinguish general oblique formulas from right-prism shortcuts; convert units before comparing volumes.

### BOX-01 — Cubes and rectangular parallelepipeds

**Sources:** SRC-BOX pp. 3–11, 16.

A **parallelepiped** has six parallelogram faces, with opposite faces congruent and parallel, 12 edges, and 8 vertices. A **rectangular parallelepiped**, or cuboid, has six rectangular faces. A **cube** has six congruent square faces and all edges equal; it is a right square prism and a regular hexahedron.

Each cube face shares edges with four other faces, and three faces and three edges meet at each vertex. A square is two-dimensional; a cube is three-dimensional. A cube is a prism because it has congruent parallel square bases and parallelogram lateral faces, not simply because it is a Platonic solid.

| Formula ID | Quantity | Cube, edge $q$ | Cuboid, edges $L,W,H$ |
|---|---|---|---|
| F-BX01 | Volume | $q^3$ | $LWH$ |
| F-BX02 | Total surface area | $6q^2$ | $2(LW+LH+WH)$ |
| F-BX03 | Face diagonal | $q\sqrt2$ | Example: $\sqrt{L^2+W^2}$ for the $L\times W$ face |
| F-BX04 | Space diagonal | $q\sqrt3$ | $\sqrt{L^2+W^2+H^2}$ |

A face diagonal lies in a face; a space diagonal joins opposite vertices through the interior. Label which is requested. When the source asks for “the diagonal of a cube” without a face qualifier, this pack uses the space diagonal and says so in the prompt.

#### Worked example BX01 — Cube edge 10 cm

**Source:** SRC-BOX p. 8. $A_T=6(10)^2=600\text{ cm}^2$; $V=10^3=1000\text{ cm}^3$.

#### Worked example BX02 — Recover a cube's edge

**Source:** SRC-BOX p. 9. $V=512\text{ cm}^3$ gives $q=\sqrt[3]{512}=8\text{ cm}$. The source's intermediate “512 cm²” is a unit typo.

### BOX-02 — General parallelepipeds and painting

**Sources:** SRC-BOX pp. 12–17, 20; general surface-area claims corrected.

The volume of any parallelepiped is $V=Bh$, where $B$ is **base area**, not total surface area, and $h$ is the perpendicular base-plane separation. Total area is always the sum of all six face areas. The shortcut $A_L=P_bh$ assumes a right prism.

**Optional implementation extension:** For edge vectors $u,v,w$ meeting at a vertex,

$$V=|u\cdot(v\times w)|,\qquad A_T=2\bigl(\|u\times v\|+\|u\times w\|+\|v\times w\|\bigr).\tag{F-BX05}$$

This vector formula is added for a reliable oblique-solid renderer; it is not a prerequisite lesson. Reject coplanar edge vectors as a zero-volume solid. In an oblique parallelepiped, different space diagonals need not have equal lengths, so do not reuse the cuboid diagonal formula.

The source mentions **zonohedra**: a parallelepiped belongs to this class because each face has central symmetry (a $180^\circ$ rotation maps it onto itself). This is optional vocabulary, not a visibility or mirror-image rule.

#### Worked example BX03 — Paint four outside walls

**Source:** SRC-BOX p. 17, corrected with explicit right-prism assumption. A right parallelepiped has base side lengths 5 in and 10 in, height 4 in, and painting cost INR 1.5 per square inch. Paint lateral walls only.

1. $P_b=2(5+10)=30\text{ in}$.
2. $A_L=30(4)=120\text{ in}^2$.
3. Cost $=120(1.5)=\boxed{\text{INR }180}$.

The source substitutes height 6 and obtains INR 270. The stated height is 4. Without the right-prism condition or sufficient slant geometry, lateral wall area would be underdetermined. The currency amount here is a supplied classroom rate, not a current market price.

### BOX-03 — Packing, unit conversion, and shell subtraction

**Sources:** SRC-BOX pp. 18–19.

#### Worked example BX04 — Stacked bricks

**Source:** SRC-BOX p. 18. A tightly packed rectangular pile is 7 ft high, 36 ft long, and 12 ft wide. Each brick measures $2\times4\times9\text{ in}$.

1. Pile volume $=7(36)(12)=3024\text{ ft}^3$.
2. Brick volume $=72\text{ in}^3=72/1728=1/24\text{ ft}^3$.
3. Count $=3024/(1/24)=\boxed{72576}$ bricks, assuming no gaps.

A compatible orientation exists: use 2 in vertically, 9 in along the 36 ft length, and 4 in along the 12 ft width. The counts are $42\times48\times36=72576$; the answer is not merely an unverified volume ratio.

#### Worked example BX05 — Rectangular barn foundation

**Source:** SRC-BOX p. 19; dimension convention made explicit. The **outside** rectangle measures 40 ft by 80 ft. Foundation walls are uniformly 2 ft thick and 12 ft high; exclude a floor slab.

1. Inner rectangle is $(40-4)\times(80-4)=36\times76\text{ ft}$.
2. Material volume $=[40(80)-36(76)]12=5568\text{ ft}^3$.
3. $1\text{ yd}^3=27\text{ ft}^3$, so $V=5568/27=\boxed{206.22\text{ yd}^3}$, rounded.

If the 40 by 80 measurements instead referred to inside or wall-centerline dimensions, the answer would change. Keep the outside-dimension condition in the website prompt.

### Cube practice bank

**Source:** SRC-BOX p. 11.

| ID | Prompt | Answer |
|---|---|---|
| BX-P01 | Cube edge 6 cm: total surface area? | $216\text{ cm}^2$ |
| BX-P02 | Cube edge 4 cm: volume? | $64\text{ cm}^3$ |
| BX-P03 | Cube total area $24\text{ cm}^2$: volume? | Edge 2 cm; volume $8\text{ cm}^3$ |
| BX-P04 | Cube edge 9 cm: space diagonal? | $9\sqrt3\text{ cm}$; a face diagonal would be $9\sqrt2\text{ cm}$ |

**Interaction INT-BOX:** Let learners change box edge lengths and unfold a net. Toggle face versus space diagonals. In a separate oblique mode, show vector or face-based area computation. Include a hollow rectangular-wall preset for BX05 with inside and outside dimensions labeled.

---

## 12. Cylinders

**Module ID:** `cylinders`  
**Source:** SRC-CYL, STPPT3 Cylinders (1).pdf, pp. 2–13.

**Overview:** Calculate capacities and exposed areas of circular cylinders, pipes, and elliptic cylinders, with careful radius/diameter and unit handling.

**Learning outcomes:** Identify right and oblique cylinders; calculate volume and circular-cylinder areas; solve hollow-cylinder and excavation problems; use ellipse semiaxes correctly; distinguish exact formulas from approximations.

### CYL-01 — Circular cylinders

**Sources:** SRC-CYL pp. 3–6; diameter formula and example arithmetic corrected.

A cylinder has parallel congruent bases connected by parallel generating line segments. The line joining the base centers is its axis. In a right cylinder, generators and axis are perpendicular to the bases; in an oblique cylinder they are inclined. The perpendicular separation of the base planes is the height $h$.

For a **right circular cylinder**, let radius $r>0$, diameter $d=2r$, and height $h>0$:

$$V=\pi r^2h=\frac{\pi d^2h}{4}.\tag{F-CY01}$$

$$A_L=2\pi rh=\pi dh,\qquad A_T=2\pi rh+2\pi r^2=2\pi r(h+r).\tag{F-CY02}$$

The lateral surface unfolds to a rectangle of width $2\pi r$ and height $h$. A closed cylinder adds two disks. An open-top container adds one disk; an ideal tube with no end disks adds none. An oblique cylinder still has $V=Bh$ but generally does not have $A_L=2\pi rh$.

#### Worked example CY01 — Height and volume from lateral area

**Source:** SRC-CYL p. 5; embedded image transcribed. Lateral area $1000\text{ m}^2$, diameter 20 m:

1. $r=10\text{ m}$ and $1000=2\pi(10)h$.
2. $h=50/\pi\approx15.92\text{ m}$.
3. $V=\pi(10)^2(50/\pi)=\boxed{5000\text{ m}^3}$ exactly.

#### Worked example CY02 — Radius 25 cm, height 15 cm

**Source:** SRC-CYL p. 6, corrected. The requested measurements are

- $V=\pi(25)^2(15)=9375\pi\approx29452.43\text{ cm}^3$.
- $A_L=2\pi(25)(15)=750\pi\approx2356.19\text{ cm}^2$.
- $A_T=750\pi+2\pi(25)^2=2000\pi\approx6283.19\text{ cm}^2$.

The source mixes centimeter and meter labels, has inconsistent intermediate values, and misprints its final total area. Keep all measurements in centimeters here.

### CYL-02 — Hollow cylinders and material quantities

**Sources:** SRC-CYL pp. 7–9.

For a right pipe with outside radius $R$, inside radius $r$, length $h$, and $R>r>0$:

$$V_{material}=\pi(R^2-r^2)h.\tag{F-CY03}$$

$$A_{curved}=2\pi Rh+2\pi rh=2\pi(R+r)h.\tag{F-CY04}$$

$$A_{all}=2\pi(R+r)h+2\pi(R^2-r^2).\tag{F-CY05}$$

Here $A_{all}$ includes the outer curved surface, inner curved surface, and **two annular end faces**. It does not add full disks across the pipe's opening. Interior capacity is $\pi r^2h$; material volume is the outer volume minus the hollow bore.

#### Worked example CY03 — Iron pipe

**Source:** SRC-CYL p. 8; embedded example recalculated. Inside diameter 15 cm, outside diameter 17 cm, length 10 m, and supplied mass density $0.8\text{ g/cm}^3$.

1. $r=7.5\text{ cm}$, $R=8.5\text{ cm}$, $h=1000\text{ cm}$.
2. $R^2-r^2=72.25-56.25=16\text{ cm}^2$.
3. Material volume $16000\pi\approx50265.48\text{ cm}^3$.
4. Mass $m=0.8V=12800\pi\text{ g}\approx40.21\text{ kg}$.
5. Combined inner and outer curved area $32000\pi\approx100530.96\text{ cm}^2$.
6. Total area including both annular ends $32032\pi\approx100631.50\text{ cm}^2$.

The source contains arithmetic and transcription errors. The density above is retained as a **given exercise parameter**; do not silently substitute a different material density or present it as independently verified iron data.

#### Worked example CY04 — Lined well

**Source:** SRC-CYL p. 9. Finished inside diameter 5 m, depth 36 m, lining thickness 25 cm, uniform and cylindrical; neglect a bottom slab and construction clearance.

1. Inner radius $r=2.5\text{ m}$; outer radius $R=2.75\text{ m}$.
2. Excavation volume $\pi(2.75)^2(36)=272.25\pi\approx855.30\text{ m}^3$.
3. Brickwork volume $\pi[(2.75)^2-(2.5)^2](36)=47.25\pi\approx148.44\text{ m}^3$.

Excavate to the outside of the lining. Use consistent units before adding the thickness to a radius.

### CYL-03 — Elliptic cylinders and practice

**Sources:** SRC-CYL pp. 10–13; ellipse-perimeter formula corrected.

For a right elliptic cylinder with ellipse **semiaxes** $a,b>0$ and perpendicular height $h$:

$$B=\pi ab,\qquad V=\pi abh.\tag{F-CY06}$$

$$A_L=C_eh,\qquad A_T=C_eh+2\pi ab,\tag{F-CY07}$$

where $C_e$ is the ellipse perimeter. It is **not generally $\pi(a+b)$**. If $a\ge b$, an exact expression suitable for numerical integration is

$$C_e=4\int_0^{\pi/2}\sqrt{a^2\sin^2t+b^2\cos^2t}\,dt.\tag{F-CY08}$$

An optional approximation, added for implementation, is

$$C_e\approx\pi\left[3(a+b)-\sqrt{(3a+b)(a+3b)}\right].\tag{F-CY09}$$

Label approximate surface areas accordingly. Both expressions reduce to $2\pi a$ when $a=b$. Full axis lengths must be halved before using $\pi ab$.

**Review-only CY-R01 (SRC-CYL p. 11):** The embedded problem asks for a container holding “9 quarter,” with ellipse axes 20 and 15 cm. Its solution converts a mass unit to cubic centimeters without a stated density and uses full axes as semiaxes. Capacity is not determined from that prompt as written. Do not use the printed height $119.36\text{ cm}$ as a verified answer. The instructor must specify a volume or a material mass and density, and identify full axes versus semiaxes.

**Supplemental replacement CY05:** A right elliptic cylinder holds $9\text{ L}=9000\text{ cm}^3$ and has full base axes 20 cm and 15 cm. Then $a=10,b=7.5\text{ cm}$ and $h=9000/(75\pi)=120/\pi\approx38.20\text{ cm}$. This is newly authored; it does not assume “quarter” meant liters.

**Practice from embedded images on SRC-CYL pp. 12–13:** Preserve the mathematical answers rather than relying on option letters.

| ID | Prompt | Answer |
|---|---|---|
| CY-P01 | Volume of a circular cylinder, radius $r$, height $h$ | $\pi r^2h$ |
| CY-P02 | Lateral area of a right circular cylinder | $2\pi rh$ |
| CY-P03 | Material volume of a hollow circular cylinder, radii $R,r$ | $\pi(R^2-r^2)h$ |
| CY-P04 | Volume of an elliptic cylinder, semiaxes $a,b$ | $\pi abh$ |
| CY-P05 | Elliptic cylinder full axes 20 m and 10 m, height 5 m | $a=10,b=5$; volume $250\pi\text{ m}^3$. Axis units are made explicit here. |
| CY-P06 | Circular cylinder height 10 cm, diameter 4 cm | Volume $40\pi\text{ cm}^3$ |

**Interaction INT-CYLINDER:** Choose solid circular, hollow circular, or elliptic base. Expose radius versus diameter inputs explicitly. Toggle each actual surface and display its contribution to the requested total. Show a circular-cylinder net and a longitudinal pipe section. In elliptic mode, label full axes and semiaxes separately and identify the perimeter method as numerical or approximate. Include the exact circle special case.

---

## 13. Pyramids

**Module ID:** `pyramids`  
**Source:** SRC-PYCS, MTPDF11 Pyramid and Non-polyhedron (1).pdf, pp. 3–13.

**Overview:** Distinguish a pyramid's vertical height, face slant height, and lateral edge, then calculate area, volume, and liquid-contact area.

**Learning outcomes:** Identify pyramid parts; calculate regular-pyramid measurements; distinguish general volume from regular-pyramid lateral-area formulas; use similarity for partial filling.

### PYR-01 — Parts and measurements

**Sources:** SRC-PYCS pp. 5–10; two Pythagorean relations corrected.

A **pyramid** has a polygonal base and triangular lateral faces meeting at one **apex**. A **regular pyramid** has a regular polygon base and its apex directly above the base center. For a general pyramid, lateral faces may have different altitudes.

| Symbol | Measurement |
|---|---|
| $s$ | A regular base edge |
| $B,P_b$ | Area and perimeter of the base |
| $h$ | Perpendicular altitude from apex to base plane |
| $\ell$ | Face slant height: apex to midpoint of a base edge, along a lateral face |
| $E$ | Lateral edge: apex to a base vertex |
| $r_a$ | Base apothem: base center to side midpoint |
| $R_b$ | Base circumradius: base center to a vertex |

For a regular pyramid:

$$\ell^2=h^2+r_a^2,\quad E^2=\ell^2+(s/2)^2=h^2+R_b^2,\quad R_b^2=r_a^2+(s/2)^2.\tag{F-PY01}$$

The slant height is the hypotenuse of the altitude/apothem right triangle. Half a base edge, not the whole edge, is the leg used in a half-lateral-face triangle. All these lengths represent different segments and must receive distinct diagram labels.

### PYR-02 — Surface area and volume

**Sources:** SRC-PYCS pp. 6, 11–12.

$$V=\frac13Bh\quad\text{for any pyramid}.\tag{F-PY02}$$

$$A_L=\frac12P_b\ell,\qquad A_T=A_L+B\quad\text{for a regular pyramid}.\tag{F-PY03}$$

For a nonregular pyramid, sum the triangular lateral-face areas individually. A common slant height must be justified before factoring it out of that sum. If the base is a regular $n$-gon, use POLY-04 for its apothem and area.

#### Worked example PY01 — Regular pentagonal pyramid

**Source:** SRC-PYCS pp. 11–12; precision improved. Base edge 10 cm; lateral edge 13 cm.

1. $\ell=\sqrt{13^2-5^2}=12\text{ cm}$.
2. $R_b=10/[2\sin36^\circ]\approx8.50650808\text{ cm}$.
3. $r_a=10/[2\tan36^\circ]\approx6.88190960\text{ cm}$.
4. $h=\sqrt{13^2-R_b^2}\approx9.83053001\text{ cm}$.
5. $B=5(10)r_a/2\approx172.04774006\text{ cm}^2$.
6. $V=Bh/3\approx\boxed{563.77\text{ cm}^3}$.
7. $A_L=(50)(12)/2=300\text{ cm}^2$; $A_T\approx\boxed{472.05\text{ cm}^2}$.

The source's volume 563.74 comes from rounded intermediate height. Use the full-precision height. The source's generic formulas on pp. 7–8 are incorrect even though its worked example uses the appropriate right triangles.

### PYR-03 — Water in an inverted pyramid

**Source:** SRC-PYCS p. 13.

#### Worked example PY02 — Partial fill and wetted area

An inverted regular square pyramid has full height 8 m and top side 12 m. Water reaches a depth of 6 m measured from the apex.

1. Similar cross-sections give water-surface side $x=12(6/8)=9\text{ m}$.
2. The water occupies a smaller square pyramid: $V=(1/3)(9^2)(6)=\boxed{162\text{ m}^3}$.
3. The submerged slant height is $\sqrt{6^2+(9/2)^2}=7.5\text{ m}$.
4. The wetted container area is the submerged lateral area: $A_{wet}=(1/2)(4\cdot9)(7.5)=\boxed{135\text{ m}^2}$.

Do not add the water's exposed horizontal surface: it is not container wall in contact with water. The apex has no finite flat bottom area.

**Interaction INT-PYRAMID:** Controls for regular base side count, side length, and either height or lateral edge. Link all derived lengths through F-PY01. Reject a supplied lateral edge $E\le R_b$ for a positive-height regular pyramid. Toggle a half-lateral-face triangle, center/apothem triangle, and center/vertex triangle. Add an inverted-square-pyramid fill slider; show volume and wetted area separately.

**Supplemental PY-P01:** Regular square pyramid base side 6 cm and height 4 cm. **Answer:** slant height 5 cm, lateral area $60\text{ cm}^2$, total area $96\text{ cm}^2$, volume $48\text{ cm}^3$.

---

## 14. Cones

**Module ID:** `cones`  
**Source:** SRC-PYCS pp. 15–20.

**Overview:** Calculate right circular cone measurements and interpret a cone inscribed in a cube using its specified placement.

**Learning outcomes:** Identify radius, vertical height, slant height, base, and apex; calculate lateral area, total area, and volume; recover missing dimensions from area or volume; model the cube-inscribed configuration.

### CONE-01 — Right circular cone geometry

**Sources:** SRC-PYCS pp. 15–16.

A cone tapers from a base to an apex. For a **right circular cone**, the base is a disk and the apex is directly above its center. The radius $r$, perpendicular height $h$, and slant height $\ell$ satisfy

$$\ell^2=r^2+h^2.\tag{F-CO01}$$

The lateral surface is curved. When unfolded, it is a circular sector of radius $\ell$ whose arc length is the base circumference $2\pi r$. Consequently,

$$A_L=\pi r\ell,\quad A_T=\pi r\ell+\pi r^2=\pi r(\ell+r),\quad V=\frac13\pi r^2h.\tag{F-CO02}$$

The total area here is for a cone **including its base disk**. If a problem describes a conical cover or open shell, identify whether that disk is included. The common right-cone slant-height and area formulas do not directly describe every oblique cone.

### CONE-02 — Recovering dimensions and solving examples

**Sources:** SRC-PYCS pp. 17–19.

#### Worked example CO01 — Height and radius given

**Source:** SRC-PYCS p. 17. $h=8\text{ cm}$, $r=6\text{ cm}$:

1. $\ell=\sqrt{8^2+6^2}=10\text{ cm}$.
2. $A_L=60\pi\text{ cm}^2$; $A_T=96\pi\text{ cm}^2$.
3. $V=(1/3)\pi(6^2)(8)=96\pi\text{ cm}^3$.

#### Worked example CO02 — Height and volume given

**Source:** SRC-PYCS p. 18. $h=12\text{ cm}$ and $V=324\pi\text{ cm}^3$:

1. $324\pi=(1/3)\pi r^2(12)$ implies $r=9\text{ cm}$.
2. $\ell=\sqrt{9^2+12^2}=15\text{ cm}$.
3. $A_L=135\pi\text{ cm}^2$; $A_T=216\pi\text{ cm}^2$.

#### Worked example CO03 — Total and base areas given

**Source:** SRC-PYCS p. 19. $A_T=360\pi\text{ cm}^2$ and $B=100\pi\text{ cm}^2$:

1. $r=10\text{ cm}$ from $\pi r^2=100\pi$.
2. $A_L=360\pi-100\pi=260\pi$ gives $\ell=26\text{ cm}$.
3. $h=\sqrt{26^2-10^2}=24\text{ cm}$.
4. $V=(1/3)(100\pi)(24)=\boxed{800\pi\text{ cm}^3}$.

### CONE-03 — Cone inscribed in a cube

**Source:** SRC-PYCS p. 20; rounding improved and placement stated explicitly.

#### Worked example CO04 — Cube edge 6 cm

The cone's base circle is inscribed in one square cube face, and its apex is at the center of the opposite face. This is the specific right-cone placement intended by the source.

1. Cube edge $q=6\text{ cm}$, cone height $h=q=6\text{ cm}$, radius $r=q/2=3\text{ cm}$.
2. $\ell=\sqrt{3^2+6^2}=3\sqrt5\text{ cm}$.
3. $V=(1/3)\pi(3^2)(6)=\boxed{18\pi\text{ cm}^3}$.
4. $A_T=\pi(3)(3\sqrt5)+9\pi=\boxed{9\pi(1+\sqrt5)\text{ cm}^2}$.

The exact coefficient is $9+9\sqrt5\approx29.1246$, so the total area is approximately $29.12\pi\text{ cm}^2$ if rounding only that coefficient to two decimals. The source's $29.13\pi$ comes from rounding the slant height first. Prefer the exact expression or a final numerical area rounded after evaluating $\pi$.

**General preset rule:** For this placement with cube edge $q$, $h=q$, $r=q/2$, $\ell=q\sqrt5/2$, $V=\pi q^3/12$, and $A_T=\pi q^2(1+\sqrt5)/4$.

**Interaction INT-CONE:** Switch between a standalone cone, sector net, and cube-inscribed preset. In the cube preset, make $r,h,\ell$ derived from the cube edge, rather than independently draggable dimensions that could violate inscription. Toggle the axial right triangle and base disk. Identify included surfaces in the area readout. A caption should explicitly identify the base face and opposite-face-center apex.

**Supplemental CO-P01:** $r=5\text{ cm}$ and $h=12\text{ cm}$. **Answer:** $\ell=13\text{ cm}$, total area $90\pi\text{ cm}^2$, volume $100\pi\text{ cm}^3$.

---

## 15. Spheres and Spherical Segments

**Module ID:** `spheres-segments`  
**Source:** SRC-PYCS pp. 22–30.

**Overview:** Calculate sphere and hemisphere measurements, distinguish spherical zones from solid segments, and calculate liquid volume and wetted bowl area.

**Learning outcomes:** Use radius/diameter correctly; calculate full-sphere and shell volumes; distinguish curved and total segment areas; calculate one-base and two-base segment volumes; interpret wetted area as a contact surface.

### SPH-01 — Sphere, hemisphere, and shell

**Sources:** SRC-PYCS pp. 24–25, 27–28.

A **sphere** is a surface whose points are all distance $R$ from a center. In elementary solid mensuration, “volume of a sphere” means the volume enclosed by that surface. A **great circle** is formed by a plane through the center and has radius $R$; a **small circle** is formed by a noncentral intersecting plane and has smaller radius. A **hemisphere** is half of the spherical solid, cut by a plane through the center.

| Formula ID | Quantity | Formula |
|---|---|---|
| F-SP01 | Full sphere surface area | $4\pi R^2=\pi D^2$ |
| F-SP02 | Full sphere volume | $4\pi R^3/3$ |
| F-SP03 | Hemisphere curved area | $2\pi R^2$ |
| F-SP04 | Hemisphere total area including base disk | $3\pi R^2$ |
| F-SP05 | Hemisphere volume | $2\pi R^3/3$ |
| F-SP06 | Hemispherical shell material volume | $2\pi(R_o^3-R_i^3)/3$ |

For a hemispherical shell with an open mouth, “inner surface area” and “outer surface area” in the example below mean curved surfaces only. A full total material-surface area would additionally include the annular rim.

#### Worked example SP01 — Surface area from volume

**Source:** SRC-PYCS p. 27. $V=288\pi\text{ ft}^3$ gives $R^3=216$, $R=6\text{ ft}$, and $A=144\pi\text{ ft}^2$.

#### Worked example SP02 — Hemispherical shell

**Source:** SRC-PYCS p. 28. Outer curved area $162\pi\text{ in}^2$, inner curved area $72\pi\text{ in}^2$:

1. $2\pi R_o^2=162\pi$ gives $R_o=9\text{ in}$.
2. $2\pi R_i^2=72\pi$ gives $R_i=6\text{ in}$.
3. Material volume $(2/3)\pi(9^3-6^3)=\boxed{342\pi\text{ in}^3}$.

### SPH-02 — Zones and spherical segments

**Source:** SRC-PYCS p. 26.

A **spherical zone** is the curved portion of a spherical surface between two parallel cutting planes. A cap's curved surface is the limiting one-base case. A **spherical segment** is the three-dimensional portion of the spherical solid cut off by one plane or lying between two parallel planes. The flat cut faces belong to the segment boundary, but not to its curved zone.

For sphere radius $R$ and perpendicular zone height $h$:

$$\boxed{A_{zone}=2\pi Rh}.\tag{F-SP07}$$

The height is a straight perpendicular separation of planes, not an arc length or slant length. These segment formulas describe the selected portion, not automatically the full sphere.

**One-base segment (spherical cap):** Let cap height $h$, sphere radius $R$, and circular base radius $r$. For $0<h<2R$,

$$r^2=2Rh-h^2,\tag{F-SP08}$$

$$V_{cap}=\frac{\pi h^2}{3}(3R-h)=\frac{\pi h}{6}(3r^2+h^2),\tag{F-SP09}$$

$$A_{curved}=2\pi Rh,\qquad A_{total}=2\pi Rh+\pi r^2.\tag{F-SP10}$$

**Two-base segment:** Let the parallel circular cut faces have radii $r_1,r_2$, with plane separation $h$:

$$V=\frac{\pi h}{6}(3r_1^2+3r_2^2+h^2),\tag{F-SP11}$$

$$A_{curved}=2\pi Rh,\qquad A_{total}=2\pi Rh+\pi r_1^2+\pi r_2^2.\tag{F-SP12}$$

The dimensions must come from cuts of the same sphere. Do not accept arbitrary independently chosen $R,r_1,r_2,h$ as automatically consistent.

**Diagram brief:** Show a sphere with two parallel planes, shade only the curved band for “zone,” and then shade the enclosed solid between planes for “segment.” Show the one-base cap in a separate view. Use distinct toggles for curved surface and each flat disk so “total” has an explicit geometric meaning.

### SPH-03 — Bowl liquid, wetted area, and complementary zones

**Sources:** SRC-PYCS pp. 29–30.

#### Worked example SP03 — Liquid in a hemispherical bowl

**Source:** SRC-PYCS p. 29; wetted-area result corrected. Bowl inner radius $R=5\text{ in}$. Liquid depth is $h=2\text{ in}$ measured upward from the lowest point. The diagram's 3 in is the water plane's distance below the center, not the liquid depth.

1. Water-surface radius $r=\sqrt{2Rh-h^2}=\sqrt{20-4}=4\text{ in}$.
2. Liquid volume $V=(\pi/3)(2^2)[3(5)-2]=\boxed{52\pi/3\text{ in}^3}$.
3. **Wetted bowl area:** $A_{wet}=2\pi Rh=\boxed{20\pi\text{ in}^2}$.
4. Free liquid-surface area: $\pi r^2=16\pi\text{ in}^2$.
5. Total boundary area of the liquid segment, counting its exposed top disk, is $20\pi+16\pi=36\pi\text{ in}^2$.

The source labels $36\pi$ as wet area. That is the total segment boundary area. Only the curved $20\pi$ is bowl wall in contact with the liquid.

#### Worked example SP04 — Two zones from one cutting plane

**Source:** SRC-PYCS p. 30. Sphere radius $R=12\text{ cm}$, plane 4 cm from the center:

1. The two cap heights are $12-4=8\text{ cm}$ and $12+4=16\text{ cm}$.
2. Curved areas are $2\pi(12)(8)=192\pi\text{ cm}^2$ and $2\pi(12)(16)=384\pi\text{ cm}^2$.
3. Sum $\boxed{576\pi\text{ cm}^2}$, equal to the original sphere area $4\pi(12)^2$.

The flat cutting disks are not included in the requested zone-area sum. Adding them would calculate a different quantity.

**Interaction INT-SPHERE:** Use separate full-sphere, shell, one-base cap, two-base segment, and hemispherical-bowl modes. For the bowl, constrain depth to $0\le h\le R$; for a generic cap, allow $0\le h\le2R$. Always show separate readouts for volume, curved area, cut-disk areas, total segment boundary area, and wetted area where applicable. At empty/full limits, use a clear limiting-state description.

**Implementation geometry:** Center the sphere at $(0,0,0)$ and use vertical coordinate $z$. A horizontal cut has radius $\sqrt{R^2-z^2}$. For two cuts $-R\le z_1<z_2\le R$, set $h=z_2-z_1$, $r_i=\sqrt{R^2-z_i^2}$. A cross-check on volume is $V=\pi[R^2z-z^3/3]_{z_1}^{z_2}$. Derive all radii from these cut positions, rather than treating radii and separation as unrelated controls.

**Supplemental SP-P01:** Hemisphere radius 3 cm. **Answer:** volume $18\pi\text{ cm}^3$, curved area $18\pi\text{ cm}^2$, closed total area $27\pi\text{ cm}^2$. **Supplemental SP-P02:** Sphere radius 5, cuts at $z=-1$ and $z=2$. **Answer:** $h=3$, base-radius squares 24 and 21, zone area $30\pi$, segment volume $72\pi$, total segment area $75\pi$ in corresponding units.

---

## 16. Cross-module reference

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

### Plane and solid mensuration reference

| Shape / condition | Area / surface area | Volume / other relation |
|---|---|---|
| Triangle | $K=bh/2=ab\sin\theta/2$ | Heron: $K^2=s_p(s_p-a)(s_p-b)(s_p-c)$ |
| Rectangle | $K=LW$ | Diagonal $\sqrt{L^2+W^2}$ |
| Parallelogram | $K=bh=ab\sin\theta$ | $P=2(a+b)$ |
| Rhombus | $K=d_1d_2/2$ | Side $\sqrt{d_1^2+d_2^2}/2$ |
| Trapezoid | $K=(b_1+b_2)h/2$ | Use perpendicular height |
| Right prism | $A_L=P_bh$, $A_T=A_L+2B$ | $V=Bh$ |
| General oblique prism | Sum lateral-face areas; add $2B$ if closed | $V=Bh$ with perpendicular $h$ |
| Cube | $A_T=6q^2$ | $V=q^3$; space diagonal $q\sqrt3$ |
| Right circular cylinder | $A_T=2\pi rh+2\pi r^2$ | $V=\pi r^2h$ |
| Right pipe | $A_{all}=2\pi(R+r)h+2\pi(R^2-r^2)$ | Material $V=\pi(R^2-r^2)h$ |
| Right elliptic cylinder | $A_T=C_eh+2\pi ab$ | $V=\pi abh$; $a,b$ are semiaxes |
| Regular pyramid | $A_T=P_b\ell/2+B$ | $V=Bh/3$ |
| Right circular cone | $A_T=\pi r(\ell+r)$ | $V=\pi r^2h/3$; $\ell^2=r^2+h^2$ |
| Sphere | $A=4\pi R^2$ | $V=4\pi R^3/3$ |
| Spherical cap | Curved $2\pi Rh$; closed adds $\pi r^2$ | $V=\pi h^2(3R-h)/3$ |
| Two-base spherical segment | Curved $2\pi Rh$; closed adds both cut disks | $V=\pi h(3r_1^2+3r_2^2+h^2)/6$ |

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
| Semiperimeter | Half of a polygon's perimeter; $s_p$ in triangle/quadrilateral formulas |
| Altitude | Perpendicular height to an opposite side line or base plane |
| Median | Triangle vertex-to-opposite-side-midpoint segment |
| Internal angle bisector | Segment splitting a vertex angle into two equal angles |
| Incenter | Intersection of a triangle's internal angle bisectors |
| Orthocenter | Intersection of a triangle's altitude lines |
| Centroid | Intersection of a triangle's medians; also a lamina's area-balance point |
| Trapezoid | In this pack, quadrilateral with exactly one pair of parallel opposite sides |
| Trapezium | In this pack, quadrilateral with no parallel opposite sides |
| Polyhedron | Solid bounded by polygonal faces |
| Prism | Two congruent parallel polygonal bases joined by parallelogram faces |
| Parallelepiped | Prism with parallelogram base; six parallelogram faces |
| Cuboid | Rectangular parallelepiped |
| Lateral area | Sum of designated side-surface areas, excluding bases |
| Net | Flat arrangement of a solid's unfolded boundary faces |
| Slant height | Cone or regular pyramid surface distance from apex to base rim or side midpoint |
| Space diagonal | Segment joining opposite vertices through a solid's interior |
| Annulus | Planar region between two concentric circles |
| Great circle | Sphere section through its center |
| Spherical zone | Curved sphere surface between parallel planes |
| Spherical segment | Solid portion cut from a sphere by one plane or between two parallel planes |
| Spherical cap | One-base spherical segment; specify whether referring to solid or curved boundary |
| Wetted area | Container surface area in direct contact with liquid |

---

## 17. Editorial correction and ambiguity log

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


### Corrections and clarifications for the six added PDFs

| ID | Source / page(s) | Issue | Treatment in this pack |
|---|---|---|---|
| TRI-CLA01 | SRC-TRI pp. 4–5 | Isosceles convention and altitude endpoints need precision | Use inclusive isosceles definition; altitudes may meet side extensions |
| TRI-CLA02 | SRC-TRI pp. 6–7 | Formula layout must be preserved during transcription | $m_c=\tfrac12\sqrt{2a^2+2b^2-c^2}$ has its factor $1/2$ outside the square root; the source formula is correct |
| QD-CLA01 | SRC-QUAD pp. 4–5 | Trapezoid/trapezium names vary; parallelogram definition omits “parallel”; source vertex order differs | State the source naming convention and use consecutive boundary labels |
| QD-ERR01 | SRC-QUAD p. 7 | Intermediate diagonal expression refers to $45^\circ-\theta$ | Use the supplement $180^\circ-\theta$ or the equivalent plus-cosine form |
| QD-ERR02 | SRC-QUAD p. 9 | Rectangle diagonal intermediate radical is 50 instead of 90 | $\sqrt{90}=3\sqrt{10}$; final source radical is retained |
| QD-ERR03 | SRC-QUAD p. 12 | Both rhombus diagonal squares use the same minus sign | Use $2q^2(1-\cos\theta)$ and $2q^2(1+\cos\theta)$ |
| QD-ERR04 | SRC-QUAD p. 14 | Given diagonal $BD=8$ is used as an equilateral triangle side | Keep triangle $ADC$ equilateral and $BD=8$; area is $32\sqrt3/3$, not $32\sqrt3$ |
| PR-ERR01 | SRC-PRISM p. 3 | Right prism described as having axis parallel to base | Axis/lateral edges are perpendicular to the bases |
| PR-ERR02 | SRC-PRISM p. 7 | Total-area expression labeled lateral area, with no right-prism restriction on $P_bh$ | Separate $A_L=P_bh$ for right prisms and $A_T=A_L+2B$ |
| PR-REV01 | SRC-PRISM pp. 12–17 | Three triangular-prism examples contain incompatible triangle dimensions; p. 17 also omits the 12-inch side from its perimeter | Quarantine PR-R01–PR-R03; supply explicitly revised, internally consistent PR-V01–PR-V03 |
| PR-CLA01 | SRC-PRISM p. 18 | “Weight” requested from grams per cubic centimeter | Report mass; do not confuse grams with force units |
| PR-REV02 | SRC-PRISM p. 20 | “Inscribed about” does not distinguish circumcircle from incircle | PR06 explicitly uses a regular hexagon circumscribed about the circle; show alternate interpretation separately |
| BX-ERR01 | SRC-BOX p. 9 | Volume 512 assigned square-centimeter units in solution | $512\text{ cm}^3$ |
| BX-ERR02 | SRC-BOX p. 10 | Cube said to be a prism because it is a Platonic solid | Justify by the prism definition |
| BX-ERR03 | SRC-BOX pp. 15, 20 | $P_bh$ stated as general parallelepiped lateral area | Restrict to right prisms; sum actual face areas in oblique mode |
| BX-ERR04 | SRC-BOX pp. 16, 20 | Volume stated as surface area times height | Use base area times perpendicular height |
| BX-ERR05 | SRC-BOX p. 17 | Height 4 in in problem becomes 6 in in solution; rightness unspecified | State right-prism assumption, keep height 4; cost INR 180 |
| BX-CLA01 | SRC-BOX pp. 13–14 | Symmetry/visibility descriptions are misleading | Define central symmetry by a half-turn; omit viewpoint-dependent visibility claims |
| BX-CLA02 | SRC-BOX p. 19 | Foundation measurement convention unstated in prompt | Preserve solution's outside dimensions; exclude floor slab |
| CY-ERR01 | SRC-CYL p. 4 | Diameter-based volume term lacks $d^2$ | $V=\pi d^2h/4$ |
| CY-ERR02 | SRC-CYL p. 6 | Example mixes unit labels and arithmetic, including incorrect total area | Recalculate with $r=25,h=15$ cm: $V=9375\pi$, $A_L=750\pi$, $A_T=2000\pi$ in appropriate units |
| CY-ERR03 | SRC-CYL p. 8 | Pipe example has incorrect inner-radius square, intermediate volume/mass, and end-face addition | Use $R^2-r^2=16$ and CY03 results |
| CY-ERR04 | SRC-CYL p. 10 | Elliptic cylinder volume mislabeled hollow; ellipse perimeter replaced by $\pi(a+b)$ | Solid volume $\pi abh$; use exact numerical perimeter or a labeled approximation |
| CY-REV01 | SRC-CYL p. 11 | Ambiguous “quarter,” mass-to-volume conversion without density, full axes used as semiaxes | Quarantine original; CY05 is a separately authored 9-liter replacement |
| CY-CLA01 | SRC-CYL p. 12 item 5 | Axis units not explicit | Add meter units to the adapted prompt; halve full axes |
| PY-ERR01 | SRC-PYCS p. 7 | Lateral-edge triangle uses full base edge rather than half | $E^2=\ell^2+(s/2)^2$ |
| PY-ERR02 | SRC-PYCS p. 8 | Slant-height/altitude Pythagorean relation reversed | $\ell^2=h^2+r_a^2$ |
| PY-CLA01 | SRC-PYCS p. 6 | Common-slant-height lateral-area formula presented without qualification | Use for regular pyramids; general pyramid volume remains $Bh/3$ |
| PY-NUM01 | SRC-PYCS pp. 11–12 | Premature height rounding changes volume | Full precision gives $563.77\text{ cm}^3$ |
| CO-NUM01 | SRC-PYCS p. 20 | Rounded slant height changes total-area coefficient | Keep exact $9\pi(1+\sqrt5)$ for cube edge 6 |
| SP-CLA01 | SRC-PYCS p. 26 | Zone area and segment total area can be conflated | Zone is curved surface only; total segment boundary adds its cut disks |
| SP-ERR01 | SRC-PYCS p. 29 | Wet bowl area includes exposed liquid disk | Wet area $20\pi$; total liquid-segment boundary $36\pi$ |
| EXT-02 | SRC-CYL pp. 5–6, 8–9, 11–13; SRC-PRISM pp. 11, 13, 15, 17, 21 | Problems and solutions are embedded as images and absent from ordinary text extraction | Recover prompt dimensions and formulas from visual inspection rather than treating these as empty pages |

### Boundaries on source reconstruction

- No single intended circle equation is invented for SRC-CIRC p. 19.
- Conflicting parabola examples remain distinct and explicitly traced to the source pages.
- Source angle questions receive an explicit angle convention before grading.
- Review-only fragments are recorded, not silently discarded or presented as complete questions.
- This is a mathematical content adaptation, not a claim that every historical statement or bibliographic link in the sources has been verified.

---

## 18. Implementation and quality requirements

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

### Solid-geometry implementation requirements

- A 3D perspective drawing may distort lengths visually; compute from the mathematical model, not screen distances. Supply orthographic sections when explaining right triangles.
- Give separate labels to perpendicular height, lateral-edge length, slant height, apothem, and circumradius. Show right-angle markers on the relevant sections.
- A selected “right” prism or cone must remain right as parameters change. Oblique modes must not reuse right-solid area shortcuts.
- Expose exactly which surfaces are included: curved wall, inner wall, outer wall, base disk, annular rim, flat cut face, or wetted wall. Show an additive surface breakdown.
- Validate base dimensions against their implied altitude/area. Three side lengths and an independently supplied altitude may conflict even if all are positive.
- Uniform scaling by factor $k>0$ multiplies all lengths by $k$, areas by $k^2$, and volumes by $k^3$. Use this as a cross-check for every solid.
- Separate volume/capacity, material volume, mass, and force weight. A mass problem needs density; an area alone is not a capacity.
- For partial-fill visualizations, define the level's zero point and whether it is depth from the bottom or distance from the center.
- Numerical integration or approximate formulas must be identified in displayed outputs, particularly elliptic-cylinder surface area. Exact $\pi$ forms should remain available.
- Preserve triangle/quadrilateral constraints during dragging. Never draw an impossible preset merely to match an incorrect slide answer.

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
| Triangle segments | T01 | Altitudes $12,5,60/13$; medians $\sqrt{601}/2,\sqrt{61},13/2$ |
| Invalid triangle | Sides 2, 3, 5 | Degenerate; exclude from nondegenerate triangle calculators |
| Rectangle correction | QD02 | Diagonal $3\sqrt{10}$ |
| Rhombus correction | QD04 | Area $32\sqrt3/3$ |
| Prism net | PR03 | Total area 468; volume 540 |
| Inconsistent prism data | Original PR-R01–PR-R03 | Excluded from live graded practice |
| Wooden block | PR04 | Volume 783; surface area 519.3; mass 548.1 g |
| Cube dimensional scaling | Double any cube edge | Area multiplies by 4; volume by 8 |
| Paint height | BX03 | Area 120 in²; cost INR 180 |
| Brick fit | BX04 | Integer packing $42\times48\times36=72576$ |
| Cylinder diameter form | $d=4,h=10$ | Volume $40\pi$, agreeing with $r=2$ |
| Pipe | CY03 | Material volume $16000\pi$; all-surface area $32032\pi$ |
| Elliptic circle limit | $a=b=r$ | Perimeter $2\pi r$; cylinder formulas agree with circular case |
| Full versus semi axes | CY-P05 | Volume $250\pi$, not $1000\pi$ |
| Pyramid slant triangle | PY-P01 | Height 4, apothem 3, slant height 5 |
| Water in pyramid | PY02 | Volume 162; wetted area 135 |
| Cube-inscribed cone | CO04 | $r=3,h=6,\ell=3\sqrt5$; exact area $9\pi(1+\sqrt5)$ |
| Bowl surface distinction | SP03 | Volume $52\pi/3$; wet area $20\pi$; total segment boundary $36\pi$ |
| Complementary zones | SP04 | Sum equals full sphere area $576\pi$ |
| Two-base segment | SP-P02 | Volume $72\pi$, curved area $30\pi$, total area $75\pi$ |

### Suggested first implementation order

1. Build a reusable lesson renderer, math rendering, module navigation, and source-reference display.
2. Import all 49 lessons, examples, and eligible practice rows.
3. Add a coordinate plot component and reuse it across lines and conics.
4. Add polygon, triangle, quadrilateral, conic, and solid parameter controls with reusable labeled diagrams, sections, and nets.
5. Add revealable solutions and answer checking, keeping review-only items excluded.
6. Validate the mathematical acceptance checks and accessibility behavior.

---

## 19. Source coverage map and attribution

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
| SRC-TRI | 1–3 | Module metadata; title/divider material omitted |
| SRC-TRI | 4–7 | TRI-01, TRI-02, T01 and corrected median template |
| SRC-TRI | 8–11 | TRI-03 perimeter and area formulas, including equilateral derivation |
| SRC-TRI | 12–15 | T02–T05; source numbering skips from 3 to 5 and is normalized by stable pack IDs |
| SRC-TRI | 16–17 | Original references; not independently consulted |
| SRC-QUAD | 1–4 | Module metadata and classification convention |
| SRC-QUAD | 5–7 | QUAD-01, QD01, image-based area table transcribed |
| SRC-QUAD | 8–11 | QUAD-02, QD02–QD03 |
| SRC-QUAD | 12–14 | QUAD-03, corrected QD04 |
| SRC-QUAD | 15–18 | QUAD-04, QD05–QD06 |
| SRC-QUAD | 19–20 | Original references; not independently consulted |
| SRC-PRISM | 1–6 | Module metadata, PRISM-01 parts, types and counts |
| SRC-PRISM | 7–10 | PRISM-02 formulas and PR01; lateral/total and right/oblique restrictions corrected |
| SRC-PRISM | 11 | PR02, image dimensions transcribed |
| SRC-PRISM | 12–17 | Review originals PR-R01–PR-R03; explicit revised variants PR-V01–PR-V03 |
| SRC-PRISM | 18–20 | PR04–PR06 applications, circle/base interpretation clarified |
| SRC-PRISM | 21 | PR03 from diagram and net |
| SRC-PRISM | 22 | Original references; not independently consulted |
| SRC-BOX | 1–7 | Module metadata, BOX-01 definitions and image formulas |
| SRC-BOX | 8–11 | BX01–BX02 and BX-P01–BX-P04 |
| SRC-BOX | 12–16 | BOX-02 general geometry and corrected volume/area restrictions |
| SRC-BOX | 17–19 | BX03–BX05, painting and dimension conventions clarified |
| SRC-BOX | 20 | FAQ concepts incorporated with corrected formulas |
| SRC-BOX | 21 | Original references; not independently consulted |
| SRC-CYL | 1–4 | Module metadata and CYL-01 definitions/formulas |
| SRC-CYL | 5–6 | CY01–CY02, embedded image examples recovered and recalculated |
| SRC-CYL | 7–9 | CYL-02, CY03–CY04; pipe solution corrected |
| SRC-CYL | 10–11 | CYL-03 formulas, CY-R01 quarantined; CY05 is a separate replacement |
| SRC-CYL | 12–13 | CY-P01–CY-P06 and answer key, embedded images transcribed |
| SRC-CYL | 14 | Original references; not independently consulted |
| SRC-PYCS | 1–4 | Module title/outcomes; divider material omitted |
| SRC-PYCS | 5–10 | PYR-01–PYR-02 formulas and corrected right-triangle relations |
| SRC-PYCS | 11–13 | PY01–PY02 |
| SRC-PYCS | 14–16 | Cone divider omitted; CONE-01 definitions and formulas |
| SRC-PYCS | 17–20 | CONE-02–CONE-03, CO01–CO04 |
| SRC-PYCS | 21–25 | Sphere module metadata and SPH-01 definitions/formulas |
| SRC-PYCS | 26 | SPH-02 zones, one-base and two-base segments |
| SRC-PYCS | 27–30 | SP01–SP04, wetted-area interpretation corrected |
| SRC-PYCS | 31–32 | Original references; not independently consulted |

**Suggested website source credit:** “Adapted from Engineering Mathematics 2 instructional materials on plane geometry, triangles, quadrilaterals, Cartesian coordinates, lines, conics, prisms, parallelepipeds, cubes, cylinders, pyramids, cones, spheres, and spherical segments, MPS Department, FEU Institute of Technology. Explanations have been reorganized and selected mathematical errors corrected. Interactive activities and supplemental practice were added for this website.”

The PDFs cite works by Swokowski and Cole, Stewart, Comandante, Ymas, Burdette, Sprague, and others, as well as several web resources. Those are references reported by the PDFs, not independently verified sources for this pack. Retain the original PDFs as the source record. This Markdown pack is self-contained for lesson text and equation-driven diagrams; access to the PDFs is useful for editorial comparison but is not a runtime website dependency.
