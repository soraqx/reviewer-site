---
title: "Geometry Formula Catalogue — Extracted from the Content Pack"
version: "1.0"
source_file: "geometry-website-content-pack.md"
source_content_version: "1.1"
source_library_version: 1
source_documents_represented_by_pack: 13
source_named_formula_groups: 101
catalogue_entries: 142
module_reference_entries: 128
shared_support_entries: 2
advanced_implementation_entries: 12
---

# Concrete formula list for the website's Formula tab

## Scope: strictly the supplied content pack

**Yes: the content pack already provides formulas throughout its lessons.** This catalogue consolidates them from `geometry-website-content-pack.md`, content version **1.1**, without adding formulas from the web, from another textbook, or from the later quiz-question instructions.

All **101 existing named formula-group IDs** are accounted for. A group can contain multiple equations or coordinate rules; it is not necessarily one formula card. The reference also collects reusable unnumbered relationships explicitly present in the document. Repeated relationships used in different modules remain cross-referenced rather than being claimed as new mathematics.

There are **142 catalogue entries**: 128 module-reference entries, 2 shared support entries, and 12 advanced/implementation entries. These are editorial group counts, not a claim of 142 distinct mathematical equations. `F-PR04` is the document's stated oblique-prism area rule, not a symbolic equation.

### What “strictly the document” means here

- The formula expressions below are copied from the current content pack. Their existing signs, variable names, and degree/radian conventions are retained.
- Descriptive headings, expression labels, and compact conditions organize the source material; they do not introduce new identities.
- The pack itself is an adaptation of the PDFs and already contains corrected and supplemental material. This catalogue does **not** claim every entry is a verbatim formula from an original PDF.
- Existing supplemental teaching formulas are labeled. Explicit optional/advanced implementation material is separated at the end; it should not silently become required student material.
- Numerical substitutions and answers from individual exercises are not promoted into new general formulas. The reusable rhombus identity explicitly used in example QD04 is included and identified as such.
- Incorrect formulas quoted in the correction log or discussed as errors are excluded. Use the corrected teaching expression.
- No additional rearrangements, cyclic variants, or familiar formulas are invented to fill perceived gaps. Where the pack instructs cycling labels, the same instruction is retained.
- `X-...` and `IMPL-...` are catalogue-only identifiers for source material without its own named formula ID. They do not replace the pack's lesson or formula IDs.

### Instructions for the IDE assistant

Use this file as the explicit formula inventory for the Formula tab. Keep `geometry-website-content-pack.md` as the authority for explanation and full context. Create searchable entries grouped by the 15 stable module slugs below. Preserve conditions and surface-inclusion notes alongside the equations. A display expression such as `$q^3$` is labeled as the volume expression in its source table; do not treat it as a missing or invalid equation.

Reuse the main site's existing mathematical renderer and redesigned UI. Keep developer metadata out of the normal formula display. Link each formula to its verified lesson ID, show a compact source/reference disclosure, and keep advanced/implementation formulas in a clearly optional section. Do not import distractors or new formulas from quiz-generation instructions into this reference.

An existing named ID can cover several useful display rows: for example, standard form, focus, directrix, and endpoints. Keep that relationship in metadata instead of assigning conflicting meanings to the original ID.

### Source-location convention

`L203`, for example, means **line 203 of the verified version 1.1 content pack**. These are Markdown line numbers, not PDF page numbers. The accompanying source note is the PDF/page attribution reported by that lesson in the content pack; the original PDFs were not reread for this extraction. Prefer stable lesson IDs for application links because later document edits can move line numbers.

## Module index

| Order | Module | Stable module ID | Reference entries |
|---:|---|---|---:|
| 1 | Plane Figures and Polygons | `plane-figures-polygons` | 10 |
| 2 | Triangles | `triangles` | 9 |
| 3 | Quadrilaterals | `quadrilaterals` | 11 |
| 4 | Cartesian Coordinates | `cartesian-coordinates` | 12 |
| 5 | Lines | `lines` | 15 |
| 6 | Conics and Circles | `circles` | 9 |
| 7 | Parabolas | `parabolas` | 5 |
| 8 | Ellipses | `ellipses` | 8 |
| 9 | Hyperbolas | `hyperbolas` | 9 |
| 10 | Prisms | `prisms` | 7 |
| 11 | Parallelepipeds and Cubes | `parallelepipeds-cubes` | 5 |
| 12 | Cylinders | `cylinders` | 9 |
| 13 | Pyramids | `pyramids` | 3 |
| 14 | Cones | `cones` | 4 |
| 15 | Spheres and Spherical Segments | `spheres-segments` | 12 |

## Notation and numerical conventions copied from the pack

### Shared notation

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


### Additional local notation

Each module's symbol meanings are stated below. Symbols are local: for example, the `a` of an ellipse is not a polygon apothem. Follow the notation of the selected formula instead of renaming all variables across the catalogue.

## 1. Plane Figures and Polygons

**Module ID:** `plane-figures-polygons`

n: number of sides; s: side length; P: perimeter; A: area; r_a: apothem; N_d: diagonal count; S: interior-angle sum; q: similarity scale factor.

### X-POLY-01 — Similarity scale, perimeter ratio, and area ratio

**Lesson:** `POLY-02`  
**Classification:** Unnumbered relationship already in the pack  
**Content-pack location:** L187

$$
q=\frac{s_1}{s_2},\qquad \frac{P_1}{P_2}=q,\qquad \frac{A_1}{A_2}=q^2
$$

**Use/conditions:** Corresponding sides s₁,s₂ with q=s₁/s₂; preserve numerator order.

**Lesson source note in the pack:** SRC-POLY p. 11; corrected ratio notation.

### F-P01 — Perimeter

**Lesson:** `POLY-03`  
**Classification:** Teaching formula  
**Content-pack location:** L203

$$
P=ns
$$

**Use/conditions:** Regular polygon with integer n≥3 and side length s>0. P is the perimeter.

**Lesson source note in the pack:** SRC-POLY pp. 12–14.

### F-P02 — Central angle

**Lesson:** `POLY-03`  
**Classification:** Teaching formula  
**Content-pack location:** L204

$$
\theta_c=360^\circ/n
$$

**Use/conditions:** Regular polygon with integer n≥3; this is one central angle, measured in degrees.

**Lesson source note in the pack:** SRC-POLY pp. 12–14.

### F-P03 — Interior-angle sum

**Lesson:** `POLY-03`  
**Classification:** Teaching formula  
**Content-pack location:** L205

$$
S=(n-2)180^\circ
$$

**Use/conditions:** Simple n-gon with integer n≥3; S is the total interior-angle sum in degrees, not one angle.

**Lesson source note in the pack:** SRC-POLY pp. 12–14.

### F-P04 — Each interior angle

**Lesson:** `POLY-03`  
**Classification:** Teaching formula  
**Content-pack location:** L206

$$
\theta_i=(n-2)180^\circ/n
$$

**Use/conditions:** Regular n-gon with integer n≥3; θ_i is each interior angle, measured in degrees.

**Lesson source note in the pack:** SRC-POLY pp. 12–14.

### F-P05 — Each exterior angle

**Lesson:** `POLY-03`  
**Classification:** Teaching formula  
**Content-pack location:** L207

$$
\theta_e=180^\circ-\theta_i=360^\circ/n
$$

**Use/conditions:** Regular n-gon with integer n≥3; θ_e is the exterior angle supplementary to the interior angle, in degrees.

**Lesson source note in the pack:** SRC-POLY pp. 12–14.

### F-P06 — Diagonal count

**Lesson:** `POLY-03`  
**Classification:** Teaching formula  
**Content-pack location:** L208

$$
N_d=n(n-3)/2
$$

**Use/conditions:** Simple n-gon with integer n≥3; diagonals join nonadjacent vertices and are counted once. The result is dimensionless.

**Lesson source note in the pack:** SRC-POLY pp. 12–14.

### X-POLY-02 — Apothem right-triangle tangent relation

**Lesson:** `POLY-04`  
**Classification:** Unnumbered relationship already in the pack  
**Content-pack location:** L220

$$
\tan(180^\circ/n)=\frac{s/2}{r_a}
$$

**Use/conditions:** Regular polygon; s is side length, r_a apothem, P perimeter. Trigonometric angle is in degrees as written.

**Lesson source note in the pack:** SRC-POLY pp. 15–19.

### F-P07 — Regular-polygon apothem

**Lesson:** `POLY-04`  
**Classification:** Teaching formula  
**Content-pack location:** L224

$$
\boxed{r_a=\frac{s}{2\tan(180^\circ/n)}}
$$

**Use/conditions:** Regular polygon; s is side length, r_a apothem, P perimeter. Trigonometric angle is in degrees as written.

**Lesson source note in the pack:** SRC-POLY pp. 15–19.

### F-P08 — Regular-polygon area

**Lesson:** `POLY-04`  
**Classification:** Teaching formula  
**Content-pack location:** L226

$$
\boxed{A=\frac12Pr_a=\frac{ns^2}{4\tan(180^\circ/n)}}
$$

**Use/conditions:** Regular polygon; s is side length, r_a apothem, P perimeter. Trigonometric angle is in degrees as written.

**Lesson source note in the pack:** SRC-POLY pp. 15–19.

---

## 2. Triangles

**Module ID:** `triangles`

a,b,c: sides opposite A,B,C; K: area; s_p: semiperimeter; h_c,m_c,ℓ_c: altitude, median, internal bisector to side c; q: equilateral side.

### X-TRI-01 — Triangle semiperimeter

**Lesson:** `TRI-02`  
**Classification:** Unnumbered relationship already in the pack  
**Content-pack location:** L314

$$
s_p=(a+b+c)/2
$$

**Use/conditions:** a,b,c are the three triangle side lengths.

**Lesson source note in the pack:** SRC-TRI pp. 5–7; notation standardized and geometric details clarified.

### F-T01 — Triangle altitude

**Lesson:** `TRI-02`  
**Classification:** Teaching formula  
**Content-pack location:** L316

$$
h_c=\frac{2K}{c}=\frac{2\sqrt{s_p(s_p-a)(s_p-b)(s_p-c)}}{c}
$$

**Use/conditions:** Nondegenerate triangle; a,b,c are opposite A,B,C; s_p is semiperimeter and K area. Cycle labels for the other vertices.

**Lesson source note in the pack:** SRC-TRI pp. 5–7; notation standardized and geometric details clarified.

### F-T02 — Triangle median

**Lesson:** `TRI-02`  
**Classification:** Teaching formula  
**Content-pack location:** L318

$$
m_c=\frac12\sqrt{2a^2+2b^2-c^2}
$$

**Use/conditions:** Nondegenerate triangle; a,b,c are opposite A,B,C; s_p is semiperimeter and K area. Cycle labels for the other vertices.

**Lesson source note in the pack:** SRC-TRI pp. 5–7; notation standardized and geometric details clarified.

### F-T03 — Triangle internal angle-bisector length

**Lesson:** `TRI-02`  
**Classification:** Teaching formula  
**Content-pack location:** L320

$$
\ell_c=\frac{\sqrt{ab[(a+b)^2-c^2]}}{a+b}
$$

**Use/conditions:** Nondegenerate triangle; a,b,c are opposite A,B,C; s_p is semiperimeter and K area. Cycle labels for the other vertices.

**Lesson source note in the pack:** SRC-TRI pp. 5–7; notation standardized and geometric details clarified.

### F-T04 — Triangle perimeter

**Lesson:** `TRI-03`  
**Classification:** Teaching formula  
**Content-pack location:** L344

$$
P=a+b+c
$$

**Use/conditions:** Use a perpendicular base/height pair or the included angle for the two specified sides. Heron requires valid triangle side lengths.

**Lesson source note in the pack:** SRC-TRI pp. 8–13.

### F-T05 — Triangle area from base and altitude

**Lesson:** `TRI-03`  
**Classification:** Teaching formula  
**Content-pack location:** L345

$$
K=b_0h/2
$$

**Use/conditions:** Use a perpendicular base/height pair or the included angle for the two specified sides. Heron requires valid triangle side lengths.

**Lesson source note in the pack:** SRC-TRI pp. 8–13.

### F-T06 — Triangle area from two sides and included angle

**Lesson:** `TRI-03`  
**Classification:** Teaching formula  
**Content-pack location:** L346

$$
K=ab\sin\theta/2
$$

**Use/conditions:** Use a perpendicular base/height pair or the included angle for the two specified sides. Heron requires valid triangle side lengths.

**Lesson source note in the pack:** SRC-TRI pp. 8–13.

### F-T07 — Heron’s formula

**Lesson:** `TRI-03`  
**Classification:** Teaching formula  
**Content-pack location:** L347

$$
K=\sqrt{s_p(s_p-a)(s_p-b)(s_p-c)}
$$

**Use/conditions:** Use a perpendicular base/height pair or the included angle for the two specified sides. Heron requires valid triangle side lengths.

**Lesson source note in the pack:** SRC-TRI pp. 8–13.

### F-T08 — Equilateral triangle height, area, and perimeter

**Lesson:** `TRI-03`  
**Classification:** Teaching formula  
**Content-pack location:** L348

**Equilateral altitude**

$$
h=q\sqrt3/2
$$

**Equilateral area**

$$
K=q^2\sqrt3/4
$$

**Equilateral perimeter**

$$
P=3q
$$

**Use/conditions:** Use a perpendicular base/height pair or the included angle for the two specified sides. Heron requires valid triangle side lengths.

**Lesson source note in the pack:** SRC-TRI pp. 8–13.

**Companion rule stated in TRI-01:** For a valid triangle, compare the longest side squared with the sum of the other two squares to classify right/acute/obtuse. The centroid division ratio 2:1 is labeled supplemental explanatory material in TRI-02.

---

## 3. Quadrilaterals

**Module ID:** `quadrilaterals`

a,b: adjacent parallelogram sides; θ: included side angle; φ: angle between diagonals; d₁,d₂: full diagonals; L,W: rectangle dimensions; q: square/rhombus side; s_p: semiperimeter.

### F-QD01 — Parallelogram perimeter and area

**Lesson:** `QUAD-01`  
**Classification:** Teaching formula  
**Content-pack location:** L407

$$
P=2(a+b),\qquad K=ab\sin\theta=b h
$$

**Use/conditions:** Adjacent sides a,b with included angle θ. For the diagonal-area formula, φ is the angle between diagonals, not generally θ.

**Lesson source note in the pack:** SRC-QUAD pp. 4–7.

### F-QD02 — Parallelogram diagonal lengths (unordered pair)

**Lesson:** `QUAD-01`  
**Classification:** Teaching formula  
**Content-pack location:** L411

$$
\left\{\sqrt{a^2+b^2-2ab\cos\theta},\sqrt{a^2+b^2+2ab\cos\theta}\right\}
$$

**Use/conditions:** Adjacent sides a,b with included angle θ. For the diagonal-area formula, φ is the angle between diagonals, not generally θ.

**Lesson source note in the pack:** SRC-QUAD pp. 4–7.

### F-QD03 — Parallelogram area from diagonals and their included angle

**Lesson:** `QUAD-01`  
**Classification:** Teaching formula  
**Content-pack location:** L415

$$
K=\tfrac12d_1d_2\sin\phi
$$

**Use/conditions:** Adjacent sides a,b with included angle θ. For the diagonal-area formula, φ is the angle between diagonals, not generally θ.

**Lesson source note in the pack:** SRC-QUAD pp. 4–7.

### F-QD04 — Rectangle perimeter, area, and diagonal

**Lesson:** `QUAD-02`  
**Classification:** Teaching formula  
**Content-pack location:** L433

**Perimeter expression**

$$
2(L+W)
$$

**Area expression**

$$
LW
$$

**Diagonal expression**

$$
\sqrt{L^2+W^2}
$$

**Use/conditions:** Positive rectangle dimensions L,W or square side q; formulas are expressions under the source table headers.

**Lesson source note in the pack:** SRC-QUAD pp. 8–11.

### F-QD05 — Square perimeter, area, and diagonal

**Lesson:** `QUAD-02`  
**Classification:** Teaching formula  
**Content-pack location:** L434

**Perimeter expression**

$$
4q
$$

**Area expression**

$$
q^2
$$

**Diagonal expression**

$$
q\sqrt2
$$

**Use/conditions:** Positive rectangle dimensions L,W or square side q; formulas are expressions under the source table headers.

**Lesson source note in the pack:** SRC-QUAD pp. 8–11.

### F-QD06 — Rhombus perimeter, area, and side from diagonals

**Lesson:** `QUAD-03`  
**Classification:** Teaching formula  
**Content-pack location:** L452

$$
P=4q,\quad K=bh=q^2\sin\theta=\frac{d_1d_2}{2},\quad q=\frac12\sqrt{d_1^2+d_2^2}
$$

**Use/conditions:** Rhombus side q, full diagonal lengths d₁,d₂, perpendicular height h, and included side angle θ.

**Lesson source note in the pack:** SRC-QUAD pp. 12–14.

### X-QUAD-01 — Rhombus diagonal-square expressions

**Lesson:** `QUAD-03`  
**Classification:** Unnumbered relationship already in the pack  
**Content-pack location:** L454

**One diagonal square**

$$
2q^2(1-\cos\theta)
$$

**Other diagonal square**

$$
2q^2(1+\cos\theta)
$$

**Use/conditions:** Rhombus side q, full diagonal lengths d₁,d₂, perpendicular height h, and included side angle θ.

**Lesson source note in the pack:** SRC-QUAD pp. 12–14.

### X-QUAD-03 — Rhombus side/diagonal relation used in the corrected example

**Lesson:** `QUAD-03`  
**Classification:** Unnumbered relationship already in the pack  
**Content-pack location:** L461

$$
AC^2+BD^2=4q^2
$$

**Use/conditions:** Consecutive rhombus vertices A,B,C,D; q is side length. Relation is explicitly used in worked example QD04.

**Lesson source note in the pack:** SRC-QUAD pp. 12–14.

### F-QD07 — Trapezoid area

**Lesson:** `QUAD-04`  
**Classification:** Teaching formula  
**Content-pack location:** L473

$$
K=\tfrac12(b_1+b_2)h
$$

**Use/conditions:** Use perpendicular height between trapezoid bases. Bretschneider uses a convex quadrilateral, consistent side data, semiperimeter, and opposite interior angles.

**Lesson source note in the pack:** SRC-QUAD pp. 15–18.

### X-QUAD-02 — Quadrilateral semiperimeter

**Lesson:** `QUAD-04`  
**Classification:** Unnumbered relationship already in the pack  
**Content-pack location:** L488

$$
s_p=(a+b+c+d)/2
$$

**Use/conditions:** Four boundary side lengths a,b,c,d.

**Lesson source note in the pack:** SRC-QUAD pp. 15–18.

### F-QD08 — Bretschneider’s convex-quadrilateral area

**Lesson:** `QUAD-04`  
**Classification:** Teaching formula  
**Content-pack location:** L490

$$
K=\sqrt{(s_p-a)(s_p-b)(s_p-c)(s_p-d)-abcd\cos^2\!\left(\frac{\alpha+\gamma}{2}\right)}
$$

**Use/conditions:** Use perpendicular height between trapezoid bases. Bretschneider uses a convex quadrilateral, consistent side data, semiperimeter, and opposite interior angles.

**Lesson source note in the pack:** SRC-QUAD pp. 15–18.

---

## 4. Cartesian Coordinates

**Module ID:** `cartesian-coordinates`

(x₁,y₁),(x₂,y₂): endpoints; m:n: division ratio; t: directed interpolation parameter; A: area in the coordinate-area formulas. A and B in Q=A+t(B−A) denote points.

### X-CART-01 — Directed and ordinary number-line distances

**Lesson:** `CART-02`  
**Classification:** Unnumbered relationship already in the pack  
**Content-pack location:** L538

**Directed displacement expression**

$$
x_2-x_1
$$

**Ordinary distance expression**

$$
|x_2-x_1|
$$

**Use/conditions:** First expression is signed displacement; second is ordinary nonnegative distance.

**Lesson source note in the pack:** SRC-CART pp. 11–17.

### X-CART-02 — Coordinate differences

**Lesson:** `CART-02`  
**Classification:** Unnumbered relationship already in the pack  
**Content-pack location:** L540

**Horizontal coordinate difference**

$$
\Delta x=x_2-x_1
$$

**Vertical coordinate difference**

$$
\Delta y=y_2-y_1
$$

**Use/conditions:** Final coordinate minus initial coordinate.

**Lesson source note in the pack:** SRC-CART pp. 11–17.

### F-C01 — Distance between plane points

**Lesson:** `CART-02`  
**Classification:** Teaching formula  
**Content-pack location:** L542

$$
\boxed{d=\sqrt{(\Delta x)^2+(\Delta y)^2}}
$$

**Use/conditions:** Ordinary distance is nonnegative. Horizontal/vertical segment formulas use absolute values; coincident points have distance zero.

**Lesson source note in the pack:** SRC-CART pp. 11–17.

### X-CART-03 — Vertical and horizontal distance expressions

**Lesson:** `CART-02`  
**Classification:** Unnumbered relationship already in the pack  
**Content-pack location:** L546, L547

**Vertical distance expression**

$$
\vert y_2-y_1\vert
$$

**Horizontal distance expression**

$$
\vert x_2-x_1\vert
$$

**Use/conditions:** First: same x-coordinate; second: same y-coordinate.

**Lesson source note in the pack:** SRC-CART pp. 11–17.

### X-CART-05 — Collinearity determinant expression

**Lesson:** `CART-02`  
**Classification:** Supplemental teaching relationship already in the pack  
**Content-pack location:** L562

$$
(x_B-x_A)(y_C-y_A)-(y_B-y_A)(x_C-x_A)
$$

**Use/conditions:** Zero means collinear, as explicitly stated in the pack’s supplemental proof tools.

**Lesson source note in the pack:** SRC-CART pp. 11–17.

### F-C02 — Midpoint

**Lesson:** `CART-03`  
**Classification:** Teaching formula  
**Content-pack location:** L570

$$
\boxed{M=\left(\frac{x_1+x_2}{2},\frac{y_1+y_2}{2}\right)}
$$

**Use/conditions:** Endpoints are (x₁,y₁),(x₂,y₂). Internal unsigned ratio m:n has m,n>0; external division also requires m≠n and distinct endpoints.

**Lesson source note in the pack:** SRC-CART pp. 19–26; midpoint formula made explicit.

### F-C03 — Parametric division point

**Lesson:** `CART-03`  
**Classification:** Teaching formula  
**Content-pack location:** L574

$$
\boxed{Q=A+t(B-A)}
$$

**Use/conditions:** Endpoints are (x₁,y₁),(x₂,y₂). Internal unsigned ratio m:n has m,n>0; external division also requires m≠n and distinct endpoints.

**Lesson source note in the pack:** SRC-CART pp. 19–26; midpoint formula made explicit.

### F-C04 — Internal segment division

**Lesson:** `CART-03`  
**Classification:** Teaching formula  
**Content-pack location:** L580

$$
\boxed{Q=\left(\frac{nx_1+mx_2}{m+n},\frac{ny_1+my_2}{m+n}\right)}
$$

**Use/conditions:** Endpoints are (x₁,y₁),(x₂,y₂). Internal unsigned ratio m:n has m,n>0; external division also requires m≠n and distinct endpoints.

**Lesson source note in the pack:** SRC-CART pp. 19–26; midpoint formula made explicit.

### X-CART-04 — Division parameters for unsigned ratios

**Lesson:** `CART-03`  
**Classification:** Unnumbered relationship already in the pack  
**Content-pack location:** L582, L588

**Internal-division parameter**

$$
t=m/(m+n)
$$

**External-division parameter**

$$
t=m/(m-n)
$$

**Use/conditions:** First is internal m:n; second external m:n with m≠n.

**Lesson source note in the pack:** SRC-CART pp. 19–26; midpoint formula made explicit.

### F-C05 — External segment division

**Lesson:** `CART-03`  
**Classification:** Teaching formula  
**Content-pack location:** L586

$$
\boxed{Q=\left(\frac{mx_2-nx_1}{m-n},\frac{my_2-ny_1}{m-n}\right)}
$$

**Use/conditions:** Endpoints are (x₁,y₁),(x₂,y₂). Internal unsigned ratio m:n has m,n>0; external division also requires m≠n and distinct endpoints.

**Lesson source note in the pack:** SRC-CART pp. 19–26; midpoint formula made explicit.

### F-C06 — Triangle area from coordinates

**Lesson:** `CART-04`  
**Classification:** Teaching formula  
**Content-pack location:** L606

$$
\boxed{A=\frac12\left|x_1(y_2-y_3)+x_2(y_3-y_1)+x_3(y_1-y_2)\right|}
$$

**Use/conditions:** Vertices are listed around a simple polygon boundary; close the cycle by setting vertex n+1 equal to vertex 1. Take the absolute value.

**Lesson source note in the pack:** SRC-CART pp. 28–31.

### F-C07 — Shoelace area of an ordered polygon

**Lesson:** `CART-04`  
**Classification:** Teaching formula  
**Content-pack location:** L610

$$
\boxed{A=\frac12\left|\sum_{i=1}^n(x_i y_{i+1}-y_i x_{i+1})\right|}
$$

**Use/conditions:** Vertices are listed around a simple polygon boundary; close the cycle by setting vertex n+1 equal to vertex 1. Take the absolute value.

**Lesson source note in the pack:** SRC-CART pp. 28–31.

---

## 5. Lines

**Module ID:** `lines`

m: slope; (x₁,y₁): known point; A,B,C: line coefficients; a_x,b_y: nonzero intercepts; u,v: direction or vertex vectors as specified.

### F-L01 — Slope

**Lesson:** `LINE-01`  
**Classification:** Teaching formula  
**Content-pack location:** L679

$$
\boxed{m=\frac{y_2-y_1}{x_2-x_1}}\quad (x_2\ne x_1)
$$

**Use/conditions:** Slope requires distinct points and x₂≠x₁. Vertical slope is undefined. Include separate horizontal/vertical perpendicular cases.

**Lesson source note in the pack:** SRC-LINE pp. 4–6, 17–19.

### X-LINE-01 — Nonvertical perpendicular slopes

**Lesson:** `LINE-01`  
**Classification:** Unnumbered relationship already in the pack  
**Content-pack location:** L683

$$
m_1m_2=-1
$$

**Use/conditions:** The pack separately treats a vertical line as perpendicular to a horizontal line.

**Lesson source note in the pack:** SRC-LINE pp. 4–6, 17–19.

### F-L02 — Directed angle tangent between finite-slope lines

**Lesson:** `LINE-02`  
**Classification:** Teaching formula  
**Content-pack location:** L693

$$
\tan\theta=\frac{m_2-m_1}{1+m_1m_2}
$$

**Use/conditions:** Do not confuse directed angle, smaller unoriented angle, and triangle interior angle. Slope-tangent fractions exclude perpendicular denominators; vector angles require nonzero vectors.

**Lesson source note in the pack:** SRC-LINE pp. 7–13; vector formulation added for robustness.

### X-LINE-02 — Smaller unoriented angle tangent

**Lesson:** `LINE-02`  
**Classification:** Unnumbered relationship already in the pack  
**Content-pack location:** L699

$$
\tan\alpha=\left|\frac{m_2-m_1}{1+m_1m_2}\right|
$$

**Use/conditions:** Use absolute value; the perpendicular case is 90° rather than division by zero.

**Lesson source note in the pack:** SRC-LINE pp. 7–13; vector formulation added for robustness.

### F-L03 — Smaller line angle from direction vectors

**Lesson:** `LINE-02`  
**Classification:** Supplemental teaching formula already in the pack  
**Content-pack location:** L703

$$
\alpha=\operatorname{atan2}(|u_xv_y-u_yv_x|,|u\cdot v|)
$$

**Use/conditions:** Do not confuse directed angle, smaller unoriented angle, and triangle interior angle. Slope-tangent fractions exclude perpendicular denominators; vector angles require nonzero vectors.

**Lesson source note in the pack:** SRC-LINE pp. 7–13; vector formulation added for robustness.

### F-L04 — Triangle interior angle from vertex vectors

**Lesson:** `LINE-02`  
**Classification:** Supplemental teaching formula already in the pack  
**Content-pack location:** L707

$$
\beta=\operatorname{atan2}(|u_xv_y-u_yv_x|,u\cdot v)
$$

**Use/conditions:** Do not confuse directed angle, smaller unoriented angle, and triangle interior angle. Slope-tangent fractions exclude perpendicular denominators; vector angles require nonzero vectors.

**Lesson source note in the pack:** SRC-LINE pp. 7–13; vector formulation added for robustness.

### X-LINE-03 — Tangent of a non-right interior angle

**Lesson:** `LINE-02`  
**Classification:** Supplemental teaching relationship already in the pack  
**Content-pack location:** L709

$$
\tan\beta=|\det(u,v)|/(u\cdot v)
$$

**Use/conditions:** Vectors point from the same vertex; negative tangent indicates an obtuse interior angle.

**Lesson source note in the pack:** SRC-LINE pp. 7–13; vector formulation added for robustness.

### F-L05 — General equation of a line

**Lesson:** `LINE-03`  
**Classification:** Teaching formula  
**Content-pack location:** L727

$$
Ax+By+C=0
$$

**Use/conditions:** Respect each line form’s conditions: nonzero general-form normal, distinct points, finite slope where used, and nonzero intercepts for intercept form.

**Lesson source note in the pack:** SRC-LINE pp. 15–21.

### F-L06 — Point-slope form

**Lesson:** `LINE-03`  
**Classification:** Teaching formula  
**Content-pack location:** L728

$$
y-y_1=m(x-x_1)
$$

**Use/conditions:** Respect each line form’s conditions: nonzero general-form normal, distinct points, finite slope where used, and nonzero intercepts for intercept form.

**Lesson source note in the pack:** SRC-LINE pp. 15–21.

### F-L07 — Slope-intercept form

**Lesson:** `LINE-03`  
**Classification:** Teaching formula  
**Content-pack location:** L729

$$
y=mx+b
$$

**Use/conditions:** Respect each line form’s conditions: nonzero general-form normal, distinct points, finite slope where used, and nonzero intercepts for intercept form.

**Lesson source note in the pack:** SRC-LINE pp. 15–21.

### F-L08 — Two-point line equation

**Lesson:** `LINE-03`  
**Classification:** Teaching formula  
**Content-pack location:** L730

$$
(x_2-x_1)(y-y_1)=(y_2-y_1)(x-x_1)
$$

**Use/conditions:** Respect each line form’s conditions: nonzero general-form normal, distinct points, finite slope where used, and nonzero intercepts for intercept form.

**Lesson source note in the pack:** SRC-LINE pp. 15–21.

### F-L09 — Intercept-intercept form

**Lesson:** `LINE-03`  
**Classification:** Teaching formula  
**Content-pack location:** L731

$$
x/a_x+y/b_y=1
$$

**Use/conditions:** Respect each line form’s conditions: nonzero general-form normal, distinct points, finite slope where used, and nonzero intercepts for intercept form.

**Lesson source note in the pack:** SRC-LINE pp. 15–21.

### F-L10 — Vertical-line equation

**Lesson:** `LINE-03`  
**Classification:** Teaching formula  
**Content-pack location:** L732

$$
x=x_1
$$

**Use/conditions:** Respect each line form’s conditions: nonzero general-form normal, distinct points, finite slope where used, and nonzero intercepts for intercept form.

**Lesson source note in the pack:** SRC-LINE pp. 15–21.

### F-L11 — Horizontal-line equation

**Lesson:** `LINE-03`  
**Classification:** Teaching formula  
**Content-pack location:** L733

$$
y=y_1
$$

**Use/conditions:** Respect each line form’s conditions: nonzero general-form normal, distinct points, finite slope where used, and nonzero intercepts for intercept form.

**Lesson source note in the pack:** SRC-LINE pp. 15–21.

### F-L12 — Point-to-line perpendicular distance

**Lesson:** `LINE-03`  
**Classification:** Supplemental teaching formula already in the pack  
**Content-pack location:** L747

$$
\boxed{d=\frac{|Ax_0+By_0+C|}{\sqrt{A^2+B^2}}}
$$

**Use/conditions:** Respect each line form’s conditions: nonzero general-form normal, distinct points, finite slope where used, and nonzero intercepts for intercept form.

**Lesson source note in the pack:** SRC-LINE pp. 15–21.

**Companion rule stated in LINE-01:** Distinct nonvertical parallel lines have equal slopes. A vertical line is perpendicular to a horizontal line. The pack states these rules in words; this catalogue does not add newly typeset equations for them.

---

## 6. Conics and Circles

**Module ID:** `circles`

(h,k): circle center; r: radius; D,E,F: normalized general-circle coefficients; e: eccentricity; f: focus coordinate in the special focus/directrix constructions.

### F-K01 — Focus-directrix conic definition

**Lesson:** `CIRC-01`  
**Classification:** Teaching formula  
**Content-pack location:** L808

$$
\boxed{PF=e\,d(P,\ell)},\qquad e>0
$$

**Use/conditions:** Positive eccentricity and a nondegenerate focus/directrix construction. A circle has no finite directrix in this model.

**Lesson source note in the pack:** SRC-CIRC pp. 3–14; limitations clarified.

### F-K02 — Focus on x-axis, directrix the y-axis

**Lesson:** `CIRC-01`  
**Classification:** Teaching formula  
**Content-pack location:** L825

$$
\boxed{(x-f)^2+y^2=e^2x^2}
$$

**Use/conditions:** Positive eccentricity and a nondegenerate focus/directrix construction. A circle has no finite directrix in this model.

**Lesson source note in the pack:** SRC-CIRC pp. 3–14; limitations clarified.

### F-K03 — Focus on y-axis, directrix the x-axis

**Lesson:** `CIRC-01`  
**Classification:** Teaching formula  
**Content-pack location:** L829

$$
\boxed{x^2+(y-f)^2=e^2y^2}
$$

**Use/conditions:** Positive eccentricity and a nondegenerate focus/directrix construction. A circle has no finite directrix in this model.

**Lesson source note in the pack:** SRC-CIRC pp. 3–14; limitations clarified.

### F-O01 — Standard circle equation

**Lesson:** `CIRC-02`  
**Classification:** Teaching formula  
**Content-pack location:** L868

$$
\boxed{(x-h)^2+(y-k)^2=r^2},\quad r>0
$$

**Use/conditions:** Normalize equal nonzero quadratic coefficients first. Positive r² gives a circle; zero gives a point and negative gives an empty real locus.

**Lesson source note in the pack:** SRC-CIRC pp. 15–30.

### X-CIRC-01 — Normalized general circle equation

**Lesson:** `CIRC-02`  
**Classification:** Unnumbered relationship already in the pack  
**Content-pack location:** L872

$$
x^2+y^2+Dx+Ey+F=0
$$

**Use/conditions:** Normalize equal nonzero quadratic coefficients first. Positive r² gives a circle; zero gives a point and negative gives an empty real locus.

**Lesson source note in the pack:** SRC-CIRC pp. 15–30.

### F-O02 — Circle center and radius squared from general form

**Lesson:** `CIRC-02`  
**Classification:** Teaching formula  
**Content-pack location:** L876

$$
\boxed{(h,k)=(-D/2,-E/2),\qquad r^2=(D^2+E^2)/4-F}
$$

**Use/conditions:** Normalize equal nonzero quadratic coefficients first. Positive r² gives a circle; zero gives a point and negative gives an empty real locus.

**Lesson source note in the pack:** SRC-CIRC pp. 15–30.

### X-CIRC-02 — Completing the square identity

**Lesson:** `CIRC-02`  
**Classification:** Unnumbered relationship already in the pack  
**Content-pack location:** L886

$$
x^2+Dx=(x+D/2)^2-(D/2)^2
$$

**Use/conditions:** Preserve the factored coefficient of a variable group when completing its square.

**Lesson source note in the pack:** SRC-CIRC pp. 15–30.

### F-O03 — Circle tangent at a known circle point

**Lesson:** `CIRC-03`  
**Classification:** Supplemental teaching formula already in the pack  
**Content-pack location:** L934

$$
\boxed{(x_t-h)(x-x_t)+(y_t-k)(y-y_t)=0}
$$

**Use/conditions:** The tangency point lies on a positive-radius circle. For a tangent line, (A,B)≠(0,0); radius is the positive center-to-line distance.

**Lesson source note in the pack:** SRC-CIRC pp. 31–33; general tangent formula added.

### F-O04 — Circle radius from center and a tangent line

**Lesson:** `CIRC-03`  
**Classification:** Teaching formula  
**Content-pack location:** L940

$$
\boxed{r=\frac{|Ah+Bk+C|}{\sqrt{A^2+B^2}}}
$$

**Use/conditions:** The tangency point lies on a positive-radius circle. For a tangent line, (A,B)≠(0,0); radius is the positive center-to-line distance.

**Lesson source note in the pack:** SRC-CIRC pp. 31–33; general tangent formula added.

---

## 7. Parabolas

**Module ID:** `parabolas`

(h,k): vertex; p: signed vertex-to-focus displacement, p≠0. Vertical and horizontal formulas have different axis and directrix equations.

### X-PARA-01 — Origin-vertex focus/directrix derivation

**Lesson:** `PARA-01`  
**Classification:** Unnumbered relationship already in the pack  
**Content-pack location:** L994

$$
\sqrt{(x-p)^2+y^2}=|x+p|
$$

**Use/conditions:** Signed p≠0; focus (p,0), directrix x=−p, vertex at origin for the derivation.

**Lesson source note in the pack:** SRC-PARA pp. 3–14.

### F-Q01 — Horizontal parabola: equation and essential parts

**Lesson:** `PARA-02`  
**Classification:** Teaching formula  
**Content-pack location:** L1004, L1005, L1006, L1007, L1008

**Standard equation**

$$
(y-k)^2=4p(x-h)
$$

**Vertex**

$$
(h,k)
$$

**Focus**

$$
(h+p,k)
$$

**Directrix**

$$
x=h-p
$$

**Axis**

$$
y=k
$$

**Use/conditions:** Vertex (h,k); signed p≠0. Horizontal axis is y=k, vertical axis is x=h. Distances and lengths use |p|.

**Lesson source note in the pack:** SRC-PARA pp. 6–21; signed notation standardized.

### F-Q02 — Vertical parabola: equation and essential parts

**Lesson:** `PARA-02`  
**Classification:** Teaching formula  
**Content-pack location:** L1004, L1005, L1006, L1007, L1008

**Standard equation**

$$
(x-h)^2=4p(y-k)
$$

**Vertex**

$$
(h,k)
$$

**Focus**

$$
(h,k+p)
$$

**Directrix**

$$
y=k-p
$$

**Axis**

$$
x=h
$$

**Use/conditions:** Vertex (h,k); signed p≠0. Horizontal axis is y=k, vertical axis is x=h. Distances and lengths use |p|.

**Lesson source note in the pack:** SRC-PARA pp. 6–21; signed notation standardized.

### F-Q03 — Parabola latus rectum: length and endpoints

**Lesson:** `PARA-02`  
**Classification:** Teaching formula  
**Content-pack location:** L1011, L1012

**Length expression**

$$
4\vert p\vert
$$

**Horizontal-axis endpoints**

$$
(h+p,k\pm2\vert p\vert )
$$

**Vertical-axis endpoints**

$$
(h\pm2\vert p\vert ,k+p)
$$

**Use/conditions:** Vertex (h,k); signed p≠0. Horizontal axis is y=k, vertical axis is x=h. Distances and lengths use |p|.

**Lesson source note in the pack:** SRC-PARA pp. 6–21; signed notation standardized.

### X-PARA-02 — Axis-parallel parabola general forms

**Lesson:** `PARA-03`  
**Classification:** Unnumbered relationship already in the pack  
**Content-pack location:** L1053, L1054

**Vertical-axis general form**

$$
Ax^2+Dx+Ey+F=0
$$

**Horizontal-axis general form**

$$
By^2+Dx+Ey+F=0
$$

**Use/conditions:** For a vertical parabola, the x² coefficient and y-linear coefficient are nonzero; reverse variables for a horizontal parabola.

**Lesson source note in the pack:** SRC-PARA pp. 23–32.

---

## 8. Ellipses

**Module ID:** `ellipses`

(h,k): center; a: semimajor axis; b: semiminor axis; c: center-to-focus distance; e: eccentricity. Use a>b>0 for the noncircular cases.

### F-E01 — Ellipse constant focal-distance sum

**Lesson:** `ELLI-01`  
**Classification:** Teaching formula  
**Content-pack location:** L1119

$$
\boxed{PF_1+PF_2=2a}
$$

**Use/conditions:** Noncircular ellipse: a>b>0, c²=a²−b², e=c/a. Full axis lengths are 2a and 2b. Circle limit a=b has no finite directrix.

**Lesson source note in the pack:** SRC-ELLI pp. 3–8.

### X-ELLI-01 — Ellipse major/minor axis lengths and focal half-chord

**Lesson:** `ELLI-01`  
**Classification:** Unnumbered relationship already in the pack  
**Content-pack location:** L1121, L1125

**Full major-axis length expression**

$$
2a
$$

**Full minor-axis length expression**

$$
2b
$$

**Focus-to-latus-endpoint distance expression**

$$
b^2/a
$$

**Use/conditions:** Noncircular ellipse: a>b>0, c²=a²−b², e=c/a. Full axis lengths are 2a and 2b. Circle limit a=b has no finite directrix.

**Lesson source note in the pack:** SRC-ELLI pp. 3–8.

### F-E02 — Ellipse focal relation and eccentricity

**Lesson:** `ELLI-01`  
**Classification:** Teaching formula  
**Content-pack location:** L1123

$$
\boxed{c^2=a^2-b^2,\qquad e=c/a,\qquad0<e<1}
$$

**Use/conditions:** Noncircular ellipse: a>b>0, c²=a²−b², e=c/a. Full axis lengths are 2a and 2b. Circle limit a=b has no finite directrix.

**Lesson source note in the pack:** SRC-ELLI pp. 3–8.

### X-ELLI-02 — Ellipse center-to-directrix distance

**Lesson:** `ELLI-01`  
**Classification:** Unnumbered relationship already in the pack  
**Content-pack location:** L1125

$$
a/e=a^2/c
$$

**Use/conditions:** Noncircular ellipse with c>0.

**Lesson source note in the pack:** SRC-ELLI pp. 3–8.

### F-E03 — Horizontal ellipse: standard equation and parts

**Lesson:** `ELLI-02`  
**Classification:** Teaching formula  
**Content-pack location:** L1137, L1138, L1139, L1140, L1141, L1142, L1143

**Equation**

$$
(x-h)^2/a^2+(y-k)^2/b^2=1
$$

**Center**

$$
(h,k)
$$

**Vertices**

$$
(h\pm a,k)
$$

**Covertices**

$$
(h,k\pm b)
$$

**Foci**

$$
(h\pm c,k)
$$

**Directrices**

$$
x=h\pm a^2/c
$$

**Latus rectum endpoints**

$$
(h\pm c,k\pm b^2/a)
$$

**Use/conditions:** Noncircular axis-parallel ellipse; a>b>0. In focal-chord endpoint formulas, the two ± signs are independent, giving four points.

**Lesson source note in the pack:** SRC-ELLI pp. 9–21.

### F-E04 — Vertical ellipse: standard equation and parts

**Lesson:** `ELLI-02`  
**Classification:** Teaching formula  
**Content-pack location:** L1137, L1138, L1139, L1140, L1141, L1142, L1143

**Equation**

$$
(x-h)^2/b^2+(y-k)^2/a^2=1
$$

**Center**

$$
(h,k)
$$

**Vertices**

$$
(h,k\pm a)
$$

**Covertices**

$$
(h\pm b,k)
$$

**Foci**

$$
(h,k\pm c)
$$

**Directrices**

$$
y=k\pm a^2/c
$$

**Latus rectum endpoints**

$$
(h\pm b^2/a,k\pm c)
$$

**Use/conditions:** Noncircular axis-parallel ellipse; a>b>0. In focal-chord endpoint formulas, the two ± signs are independent, giving four points.

**Lesson source note in the pack:** SRC-ELLI pp. 9–21.

### F-E05 — Ellipse latus rectum length

**Lesson:** `ELLI-02`  
**Classification:** Teaching formula  
**Content-pack location:** L1145

$$
2b^2/a
$$

**Use/conditions:** Noncircular ellipse: a>b>0, c²=a²−b², e=c/a. Full axis lengths are 2a and 2b. Circle limit a=b has no finite directrix.

**Lesson source note in the pack:** SRC-ELLI pp. 9–21.

### X-ELLI-03 — Axis-parallel ellipse general form

**Lesson:** `ELLI-03`  
**Classification:** Unnumbered relationship already in the pack  
**Content-pack location:** L1192

$$
Ax^2+By^2+Dx+Ey+F=0
$$

**Use/conditions:** Axis-parallel general form with same-sign nonzero quadratic coefficients; complete squares and check a positive real locus.

**Lesson source note in the pack:** SRC-ELLI pp. 24–33.

---

## 9. Hyperbolas

**Module ID:** `hyperbolas`

(h,k): center; a: center-to-vertex distance; b: conjugate semiaxis; c: center-to-focus distance; e: eccentricity. a,b>0, without an a>b requirement.

### F-H01 — Hyperbola constant absolute focal-distance difference

**Lesson:** `HYP-01`  
**Classification:** Teaching formula  
**Content-pack location:** L1250

$$
\boxed{|PF_1-PF_2|=2a}
$$

**Use/conditions:** a,b>0; c²=a²+b² and e>1. No condition a>b is required.

**Lesson source note in the pack:** SRC-HYP pp. 3–7.

### X-HYP-01 — Hyperbola transverse/conjugate axis lengths

**Lesson:** `HYP-01`  
**Classification:** Unnumbered relationship already in the pack  
**Content-pack location:** L1252

**Transverse-axis length expression**

$$
2a
$$

**Conjugate-axis length expression**

$$
2b
$$

**Use/conditions:** Full lengths: transverse 2a, conjugate 2b.

**Lesson source note in the pack:** SRC-HYP pp. 3–7.

### F-H02 — Hyperbola focal relation and eccentricity

**Lesson:** `HYP-01`  
**Classification:** Teaching formula  
**Content-pack location:** L1256

$$
\boxed{c^2=a^2+b^2,\qquad e=c/a>1}
$$

**Use/conditions:** a,b>0; c²=a²+b² and e>1. No condition a>b is required.

**Lesson source note in the pack:** SRC-HYP pp. 3–7.

### X-HYP-02 — Hyperbola center-to-directrix distance

**Lesson:** `HYP-01`  
**Classification:** Unnumbered relationship already in the pack  
**Content-pack location:** L1258

$$
a/e=a^2/c
$$

**Use/conditions:** a,b>0; c²=a²+b² and e>1. No condition a>b is required.

**Lesson source note in the pack:** SRC-HYP pp. 3–7.

### F-H03 — Horizontal hyperbola: standard equation and parts

**Lesson:** `HYP-02`  
**Classification:** Teaching formula  
**Content-pack location:** L1266, L1268, L1269, L1270, L1271, L1272, L1274

**Equation**

$$
(x-h)^2/a^2-(y-k)^2/b^2=1
$$

**Center**

$$
(h,k)
$$

**Vertices**

$$
(h\pm a,k)
$$

**Conjugate-axis endpoints**

$$
(h,k\pm b)
$$

**Foci**

$$
(h\pm c,k)
$$

**Directrices**

$$
x=h\pm a^2/c
$$

**Latus rectum endpoints**

$$
(h\pm c,k\pm b^2/a)
$$

**Use/conditions:** Axis-parallel hyperbola, a,b>0. Positive squared term determines transverse-axis direction. Independent ± signs generate all four latus endpoints.

**Lesson source note in the pack:** SRC-HYP pp. 8–21.

### F-H04 — Vertical hyperbola: standard equation and parts

**Lesson:** `HYP-02`  
**Classification:** Teaching formula  
**Content-pack location:** L1266, L1268, L1269, L1270, L1271, L1272, L1274

**Equation**

$$
(y-k)^2/a^2-(x-h)^2/b^2=1
$$

**Center**

$$
(h,k)
$$

**Vertices**

$$
(h,k\pm a)
$$

**Conjugate-axis endpoints**

$$
(h\pm b,k)
$$

**Foci**

$$
(h,k\pm c)
$$

**Directrices**

$$
y=k\pm a^2/c
$$

**Latus rectum endpoints**

$$
(h\pm b^2/a,k\pm c)
$$

**Use/conditions:** Axis-parallel hyperbola, a,b>0. Positive squared term determines transverse-axis direction. Independent ± signs generate all four latus endpoints.

**Lesson source note in the pack:** SRC-HYP pp. 8–21.

### F-H05 — Hyperbola asymptotes in both orientations

**Lesson:** `HYP-02`  
**Classification:** Teaching formula  
**Content-pack location:** L1273

**Horizontal transverse axis**

$$
y-k=\pm(b/a)(x-h)
$$

**Vertical transverse axis**

$$
y-k=\pm(a/b)(x-h)
$$

**Use/conditions:** Axis-parallel hyperbola, a,b>0. Positive squared term determines transverse-axis direction. Independent ± signs generate all four latus endpoints.

**Lesson source note in the pack:** SRC-HYP pp. 8–21.

### F-H06 — Hyperbola latus rectum length

**Lesson:** `HYP-02`  
**Classification:** Teaching formula  
**Content-pack location:** L1276

$$
2b^2/a
$$

**Use/conditions:** a,b>0; c²=a²+b² and e>1. No condition a>b is required.

**Lesson source note in the pack:** SRC-HYP pp. 8–21.

### X-HYP-03 — Axis-parallel hyperbola general form and coefficient condition

**Lesson:** `HYP-03`  
**Classification:** Unnumbered relationship already in the pack  
**Content-pack location:** L1312

$$
Ax^2+By^2+Dx+Ey+F=0
$$

$$
AB<0
$$

**Use/conditions:** Opposite-sign quadratic coefficients AB<0. A zero translated constant gives intersecting lines, not a nondegenerate hyperbola.

**Lesson source note in the pack:** SRC-HYP pp. 23–32.

---

## 10. Prisms

**Module ID:** `prisms`

B: one base area; P_b: base perimeter; h: perpendicular base-plane separation; b₀,h_t: triangular-end base/altitude; u,v,w: triangular-end sides; L: perpendicular prism length.

### X-PRISM-01 — n-gonal prism face, edge, and vertex counts

**Lesson:** `PRISM-01`  
**Classification:** Unnumbered relationship already in the pack  
**Content-pack location:** L1388

**Face count expression**

$$
n+2
$$

**Edge count expression**

$$
3n
$$

**Vertex count expression**

$$
2n
$$

**Use/conditions:** In order: faces, edges, vertices. These are counts, not measurements.

**Lesson source note in the pack:** SRC-PRISM pp. 3–6, 8–10.

### F-PR01 — Volume

**Lesson:** `PRISM-02`  
**Classification:** Teaching formula  
**Content-pack location:** L1400

$$
V=Bh
$$

**Use/conditions:** B is one base area; h is perpendicular base-plane separation. P_bh is lateral area only for a right prism. A closed prism includes two bases.

**Lesson source note in the pack:** SRC-PRISM pp. 7–10; formula labels and restrictions corrected.

### F-PR02 — Lateral surface area

**Lesson:** `PRISM-02`  
**Classification:** Teaching formula  
**Content-pack location:** L1401

$$
A_L=P_bh
$$

**Use/conditions:** B is one base area; h is perpendicular base-plane separation. P_bh is lateral area only for a right prism. A closed prism includes two bases.

**Lesson source note in the pack:** SRC-PRISM pp. 7–10; formula labels and restrictions corrected.

### F-PR03 — Total surface area

**Lesson:** `PRISM-02`  
**Classification:** Teaching formula  
**Content-pack location:** L1402

$$
A_T=A_L+2B
$$

**Use/conditions:** B is one base area; h is perpendicular base-plane separation. P_bh is lateral area only for a right prism. A closed prism includes two bases.

**Lesson source note in the pack:** SRC-PRISM pp. 7–10; formula labels and restrictions corrected.

### F-PR04 — General oblique-prism lateral-area rule

**Lesson:** `PRISM-02`  
**Classification:** Teaching formula  
**Content-pack location:** L1403

Sum the actual areas of the lateral parallelogram faces. The source states a rule rather than a symbolic equation.

**Use/conditions:** B is one base area; h is perpendicular base-plane separation. P_bh is lateral area only for a right prism. A closed prism includes two bases.

**Lesson source note in the pack:** SRC-PRISM pp. 7–10; formula labels and restrictions corrected.

### F-PR05 — Right triangular prism

**Lesson:** `PRISM-02`  
**Classification:** Teaching formula  
**Content-pack location:** L1404

**Volume**

$$
V=(b_0h_t/2)L
$$

**Closed total surface area**

$$
A_T=b_0h_t+(u+v+w)L
$$

**Use/conditions:** B is one base area; h is perpendicular base-plane separation. P_bh is lateral area only for a right prism. A closed prism includes two bases.

**Lesson source note in the pack:** SRC-PRISM pp. 7–10; formula labels and restrictions corrected.

### F-PR06 — Rectangular prism

**Lesson:** `PRISM-02`  
**Classification:** Teaching formula  
**Content-pack location:** L1405

**Volume**

$$
V=LWH
$$

**Closed total surface area**

$$
A_T=2(LW+LH+WH)
$$

**Use/conditions:** B is one base area; h is perpendicular base-plane separation. P_bh is lateral area only for a right prism. A closed prism includes two bases.

**Lesson source note in the pack:** SRC-PRISM pp. 7–10; formula labels and restrictions corrected.

---

## 11. Parallelepipeds and Cubes

**Module ID:** `parallelepipeds-cubes`

q: cube edge; L,W,H: cuboid edge lengths; B: selected base area; h: its perpendicular height. Vector u,v,w occur only in the optional extension.

### F-BX01 — Cube and cuboid: Volume

**Lesson:** `BOX-01`  
**Classification:** Teaching formula  
**Content-pack location:** L1509

**Cube expression**

$$
q^3
$$

**Cuboid expression**

$$
LWH
$$

**Use/conditions:** Cube edge q or three mutually perpendicular cuboid edges L,W,H. Face and space diagonals are distinct.

**Lesson source note in the pack:** SRC-BOX pp. 3–11, 16.

### F-BX02 — Cube and cuboid: Total surface area

**Lesson:** `BOX-01`  
**Classification:** Teaching formula  
**Content-pack location:** L1510

**Cube expression**

$$
6q^2
$$

**Cuboid expression**

$$
2(LW+LH+WH)
$$

**Use/conditions:** Cube edge q or three mutually perpendicular cuboid edges L,W,H. Face and space diagonals are distinct.

**Lesson source note in the pack:** SRC-BOX pp. 3–11, 16.

### F-BX03 — Cube and cuboid: Face diagonal

**Lesson:** `BOX-01`  
**Classification:** Teaching formula  
**Content-pack location:** L1511

**Cube expression**

$$
q\sqrt2
$$

**Cuboid expression**

$$
\sqrt{L^2+W^2}
$$

**Use/conditions:** Cube edge q or three mutually perpendicular cuboid edges L,W,H. Face and space diagonals are distinct.

**Lesson source note in the pack:** SRC-BOX pp. 3–11, 16.

### F-BX04 — Cube and cuboid: Space diagonal

**Lesson:** `BOX-01`  
**Classification:** Teaching formula  
**Content-pack location:** L1512

**Cube expression**

$$
q\sqrt3
$$

**Cuboid expression**

$$
\sqrt{L^2+W^2+H^2}
$$

**Use/conditions:** Cube edge q or three mutually perpendicular cuboid edges L,W,H. Face and space diagonals are distinct.

**Lesson source note in the pack:** SRC-BOX pp. 3–11, 16.

### X-BOX-01 — General parallelepiped volume

**Lesson:** `BOX-02`  
**Classification:** Unnumbered relationship already in the pack  
**Content-pack location:** L1528

$$
V=Bh
$$

**Use/conditions:** B is base area and h perpendicular height. Reuses the prism volume relationship.

**Lesson source note in the pack:** SRC-BOX pp. 12–17, 20; general surface-area claims corrected.

---

## 12. Cylinders

**Module ID:** `cylinders`

r: circular radius or pipe inner radius; R: pipe outer radius; d: diameter; h: perpendicular height/pipe length; a,b: ellipse semiaxes; C_e: ellipse perimeter.

### X-CYL-01 — Cylinder diameter-radius relationship

**Lesson:** `CYL-01`  
**Classification:** Unnumbered relationship already in the pack  
**Content-pack location:** L1602

$$
d=2r
$$

**Use/conditions:** d is full diameter and r radius.

**Lesson source note in the pack:** SRC-CYL pp. 3–6; diameter formula and example arithmetic corrected.

### F-CY01 — Circular-cylinder volume: radius and diameter forms

**Lesson:** `CYL-01`  
**Classification:** Teaching formula  
**Content-pack location:** L1604

$$
V=\pi r^2h=\frac{\pi d^2h}{4}
$$

**Use/conditions:** Right circular cylinder with positive radius r, diameter d=2r, and perpendicular height h. Closed total area includes two disks.

**Lesson source note in the pack:** SRC-CYL pp. 3–6; diameter formula and example arithmetic corrected.

### F-CY02 — Right circular-cylinder lateral and closed total areas

**Lesson:** `CYL-01`  
**Classification:** Teaching formula  
**Content-pack location:** L1606

$$
A_L=2\pi rh=\pi dh,\qquad A_T=2\pi rh+2\pi r^2=2\pi r(h+r)
$$

**Use/conditions:** Right circular cylinder with positive radius r, diameter d=2r, and perpendicular height h. Closed total area includes two disks.

**Lesson source note in the pack:** SRC-CYL pp. 3–6; diameter formula and example arithmetic corrected.

### F-CY03 — Hollow-cylinder material volume

**Lesson:** `CYL-02`  
**Classification:** Teaching formula  
**Content-pack location:** L1634

$$
V_{material}=\pi(R^2-r^2)h
$$

**Use/conditions:** Right pipe, R>r>0. Curved area includes inner and outer walls; all-area formula also includes two annular ends, not full bore-closing disks.

**Lesson source note in the pack:** SRC-CYL pp. 7–9.

### F-CY04 — Combined inner and outer curved pipe area

**Lesson:** `CYL-02`  
**Classification:** Teaching formula  
**Content-pack location:** L1636

$$
A_{curved}=2\pi Rh+2\pi rh=2\pi(R+r)h
$$

**Use/conditions:** Right pipe, R>r>0. Curved area includes inner and outer walls; all-area formula also includes two annular ends, not full bore-closing disks.

**Lesson source note in the pack:** SRC-CYL pp. 7–9.

### F-CY05 — All pipe surfaces, including annular ends

**Lesson:** `CYL-02`  
**Classification:** Teaching formula  
**Content-pack location:** L1638

$$
A_{all}=2\pi(R+r)h+2\pi(R^2-r^2)
$$

**Use/conditions:** Right pipe, R>r>0. Curved area includes inner and outer walls; all-area formula also includes two annular ends, not full bore-closing disks.

**Lesson source note in the pack:** SRC-CYL pp. 7–9.

### X-CYL-02 — Pipe interior capacity expression

**Lesson:** `CYL-02`  
**Classification:** Unnumbered relationship already in the pack  
**Content-pack location:** L1640

$$
\pi r^2h
$$

**Use/conditions:** Use inner radius r and length h; this is capacity, not material volume.

**Lesson source note in the pack:** SRC-CYL pp. 7–9.

### F-CY06 — Ellipse base area and elliptic-cylinder volume

**Lesson:** `CYL-03`  
**Classification:** Teaching formula  
**Content-pack location:** L1671

$$
B=\pi ab,\qquad V=\pi abh
$$

**Use/conditions:** Right elliptic cylinder; a,b are semiaxes, not full axes, and C_e is the true ellipse perimeter. Clearly distinguish exact and approximate expressions.

**Lesson source note in the pack:** SRC-CYL pp. 10–13; ellipse-perimeter formula corrected.

### F-CY07 — Right elliptic-cylinder lateral and total areas

**Lesson:** `CYL-03`  
**Classification:** Teaching formula  
**Content-pack location:** L1673

$$
A_L=C_eh,\qquad A_T=C_eh+2\pi ab
$$

**Use/conditions:** Right elliptic cylinder; a,b are semiaxes, not full axes, and C_e is the true ellipse perimeter. Clearly distinguish exact and approximate expressions.

**Lesson source note in the pack:** SRC-CYL pp. 10–13; ellipse-perimeter formula corrected.

---

## 13. Pyramids

**Module ID:** `pyramids`

B,P_b: base area/perimeter; h: altitude; ℓ: face slant height; E: lateral edge; s: base side; r_a: base apothem; R_b: base circumradius.

### F-PY01 — Regular-pyramid right-triangle relations

**Lesson:** `PYR-01`  
**Classification:** Teaching formula  
**Content-pack location:** L1731

$$
\ell^2=h^2+r_a^2,\quad E^2=\ell^2+(s/2)^2=h^2+R_b^2,\quad R_b^2=r_a^2+(s/2)^2
$$

**Use/conditions:** Regular pyramid: h altitude, ℓ face slant height, E lateral edge, s base edge, r_a apothem, R_b circumradius.

**Lesson source note in the pack:** SRC-PYCS pp. 5–10; two Pythagorean relations corrected.

### F-PY02 — Pyramid volume

**Lesson:** `PYR-02`  
**Classification:** Teaching formula  
**Content-pack location:** L1739

$$
V=\frac13Bh\quad\text{for any pyramid}
$$

**Use/conditions:** Volume uses perpendicular altitude for any pyramid. Factored lateral-area formula requires the common slant height of a regular pyramid.

**Lesson source note in the pack:** SRC-PYCS pp. 6, 11–12.

### F-PY03 — Regular-pyramid lateral and total areas

**Lesson:** `PYR-02`  
**Classification:** Teaching formula  
**Content-pack location:** L1741

$$
A_L=\frac12P_b\ell,\qquad A_T=A_L+B\quad\text{for a regular pyramid}
$$

**Use/conditions:** Volume uses perpendicular altitude for any pyramid. Factored lateral-area formula requires the common slant height of a regular pyramid.

**Lesson source note in the pack:** SRC-PYCS pp. 6, 11–12.

---

## 14. Cones

**Module ID:** `cones`

r: base radius; h: perpendicular height; ℓ: slant height; q: cube edge only in the specified inscribed-cone preset.

### F-CO01 — Right circular-cone slant-height relation

**Lesson:** `CONE-01`  
**Classification:** Teaching formula  
**Content-pack location:** L1795

$$
\ell^2=r^2+h^2
$$

**Use/conditions:** Right circular cone for the slant-height and surface-area relations; r radius, h perpendicular height, ℓ slant height. Closed total area includes its disk.

**Lesson source note in the pack:** SRC-PYCS pp. 15–16.

### X-CONE-01 — Cone base circumference expression

**Lesson:** `CONE-01`  
**Classification:** Unnumbered relationship already in the pack  
**Content-pack location:** L1797

$$
2\pi r
$$

**Use/conditions:** The net sector’s arc length equals this circumference; r is base radius.

**Lesson source note in the pack:** SRC-PYCS pp. 15–16.

### F-CO02 — Right circular-cone lateral area, total area, and volume

**Lesson:** `CONE-01`  
**Classification:** Teaching formula  
**Content-pack location:** L1799

$$
A_L=\pi r\ell,\quad A_T=\pi r\ell+\pi r^2=\pi r(\ell+r),\quad V=\frac13\pi r^2h
$$

**Use/conditions:** Right circular cone for the slant-height and surface-area relations; r radius, h perpendicular height, ℓ slant height. Closed total area includes its disk.

**Lesson source note in the pack:** SRC-PYCS pp. 15–16.

### X-CONE-02 — Cube-inscribed cone preset relations

**Lesson:** `CONE-03`  
**Classification:** General preset rule already in the pack  
**Content-pack location:** L1847

**Height**

$$
h=q
$$

**Base radius**

$$
r=q/2
$$

**Slant height**

$$
\ell=q\sqrt5/2
$$

**Volume**

$$
V=\pi q^3/12
$$

**Closed total surface area**

$$
A_T=\pi q^2(1+\sqrt5)/4
$$

**Use/conditions:** Specific inscription: cone base circle inscribed in one cube face; apex at center of the opposite face. q is cube edge.

**Lesson source note in the pack:** SRC-PYCS p. 20; rounding improved and placement stated explicitly.

---

## 15. Spheres and Spherical Segments

**Module ID:** `spheres-segments`

R: sphere radius; D: sphere diameter; h: zone/cap/segment height; r,r₁,r₂: cut-circle radii; R_o,R_i: outer/inner hemispherical shell radii.

### F-SP01 — Full sphere surface area

**Lesson:** `SPH-01`  
**Classification:** Teaching formula  
**Content-pack location:** L1872

$$
4\pi R^2=\pi D^2
$$

**Use/conditions:** R is sphere/hemisphere radius; D diameter. Hemisphere total area includes its disk. Shell volume subtracts concentric hemispherical volumes.

**Lesson source note in the pack:** SRC-PYCS pp. 24–25, 27–28.

### F-SP02 — Full sphere volume

**Lesson:** `SPH-01`  
**Classification:** Teaching formula  
**Content-pack location:** L1873

$$
4\pi R^3/3
$$

**Use/conditions:** R is sphere/hemisphere radius; D diameter. Hemisphere total area includes its disk. Shell volume subtracts concentric hemispherical volumes.

**Lesson source note in the pack:** SRC-PYCS pp. 24–25, 27–28.

### F-SP03 — Hemisphere curved area

**Lesson:** `SPH-01`  
**Classification:** Teaching formula  
**Content-pack location:** L1874

$$
2\pi R^2
$$

**Use/conditions:** R is sphere/hemisphere radius; D diameter. Hemisphere total area includes its disk. Shell volume subtracts concentric hemispherical volumes.

**Lesson source note in the pack:** SRC-PYCS pp. 24–25, 27–28.

### F-SP04 — Hemisphere total area including base disk

**Lesson:** `SPH-01`  
**Classification:** Teaching formula  
**Content-pack location:** L1875

$$
3\pi R^2
$$

**Use/conditions:** R is sphere/hemisphere radius; D diameter. Hemisphere total area includes its disk. Shell volume subtracts concentric hemispherical volumes.

**Lesson source note in the pack:** SRC-PYCS pp. 24–25, 27–28.

### F-SP05 — Hemisphere volume

**Lesson:** `SPH-01`  
**Classification:** Teaching formula  
**Content-pack location:** L1876

$$
2\pi R^3/3
$$

**Use/conditions:** R is sphere/hemisphere radius; D diameter. Hemisphere total area includes its disk. Shell volume subtracts concentric hemispherical volumes.

**Lesson source note in the pack:** SRC-PYCS pp. 24–25, 27–28.

### F-SP06 — Hemispherical shell material volume

**Lesson:** `SPH-01`  
**Classification:** Teaching formula  
**Content-pack location:** L1877

$$
2\pi(R_o^3-R_i^3)/3
$$

**Use/conditions:** R is sphere/hemisphere radius; D diameter. Hemisphere total area includes its disk. Shell volume subtracts concentric hemispherical volumes.

**Lesson source note in the pack:** SRC-PYCS pp. 24–25, 27–28.

### F-SP07 — Spherical-zone curved area

**Lesson:** `SPH-02`  
**Classification:** Teaching formula  
**Content-pack location:** L1901

$$
\boxed{A_{zone}=2\pi Rh}
$$

**Use/conditions:** R sphere radius, h perpendicular segment/zone height. Cap: 0<h<2R. Cut radii must come from the same sphere; total boundary adds the cut disk(s).

**Lesson source note in the pack:** SRC-PYCS p. 26.

### F-SP08 — Spherical-cap cut-radius relation

**Lesson:** `SPH-02`  
**Classification:** Teaching formula  
**Content-pack location:** L1907

$$
r^2=2Rh-h^2
$$

**Use/conditions:** R sphere radius, h perpendicular segment/zone height. Cap: 0<h<2R. Cut radii must come from the same sphere; total boundary adds the cut disk(s).

**Lesson source note in the pack:** SRC-PYCS p. 26.

### F-SP09 — One-base spherical-cap volume

**Lesson:** `SPH-02`  
**Classification:** Teaching formula  
**Content-pack location:** L1909

$$
V_{cap}=\frac{\pi h^2}{3}(3R-h)=\frac{\pi h}{6}(3r^2+h^2)
$$

**Use/conditions:** R sphere radius, h perpendicular segment/zone height. Cap: 0<h<2R. Cut radii must come from the same sphere; total boundary adds the cut disk(s).

**Lesson source note in the pack:** SRC-PYCS p. 26.

### F-SP10 — One-base cap curved and closed total areas

**Lesson:** `SPH-02`  
**Classification:** Teaching formula  
**Content-pack location:** L1911

$$
A_{curved}=2\pi Rh,\qquad A_{total}=2\pi Rh+\pi r^2
$$

**Use/conditions:** R sphere radius, h perpendicular segment/zone height. Cap: 0<h<2R. Cut radii must come from the same sphere; total boundary adds the cut disk(s).

**Lesson source note in the pack:** SRC-PYCS p. 26.

### F-SP11 — Two-base spherical-segment volume

**Lesson:** `SPH-02`  
**Classification:** Teaching formula  
**Content-pack location:** L1915

$$
V=\frac{\pi h}{6}(3r_1^2+3r_2^2+h^2)
$$

**Use/conditions:** R sphere radius, h perpendicular segment/zone height. Cap: 0<h<2R. Cut radii must come from the same sphere; total boundary adds the cut disk(s).

**Lesson source note in the pack:** SRC-PYCS p. 26.

### F-SP12 — Two-base segment curved and closed total areas

**Lesson:** `SPH-02`  
**Classification:** Teaching formula  
**Content-pack location:** L1917

$$
A_{curved}=2\pi Rh,\qquad A_{total}=2\pi Rh+\pi r_1^2+\pi r_2^2
$$

**Use/conditions:** R sphere radius, h perpendicular segment/zone height. Cap: 0<h<2R. Cut radii must come from the same sphere; total boundary adds the cut disk(s).

**Lesson source note in the pack:** SRC-PYCS p. 26.

**Wetted-area distinction already in SPH-03:** Example SP03 uses the same curved-area relationship, 2πRh, for the bowl wall in contact with liquid. The liquid’s top disk is excluded from wetted wall area. Its numerical example gives wet area 20π in² and total segment boundary 36π in². These are example values, not additional general formulas.

---

## 16. Shared support formulas already in the document

### X-SHARED-01 — Mass from density and volume

**Lesson:** `Shared/implementation reference`  
**Classification:** Shared notation already in the pack  
**Content-pack location:** L116

$$
m=\rho V
$$

**Use/conditions:** ρ is mass per unit volume; m is mass, not force weight.

### X-SHARED-02 — Degrees-to-radians conversion

**Lesson:** `Shared/implementation reference`  
**Classification:** Shared numerical rule already in the pack  
**Content-pack location:** L120

$$
\theta_{rad}=\theta_{deg}\pi/180
$$

**Use/conditions:** The pack uses degree angles unless otherwise stated; programming trigonometric functions commonly use radians.

## 17. Advanced / implementation formulas already in the document

Keep these separate from the main student formula reference unless the website deliberately exposes an advanced or implementation section. They are reproduced here for completeness because they already exist in the supplied content pack. Their inclusion does not make them original-PDF formulas or required syllabus material. The approximation must remain labeled approximate.

### F-BX05 — General parallelepiped: vector volume and surface area

**Lesson:** `BOX-02`  
**Classification:** Optional implementation extension already in the pack  
**Content-pack location:** L1532

$$
V=|u\cdot(v\times w)|,\qquad A_T=2\bigl(\|u\times v\|+\|u\times w\|+\|v\times w\|\bigr)
$$

**Use/conditions:** V=Bh uses base area, not total surface area. The vector expression is an optional implementation extension already in the pack.

**Lesson source note in the pack:** SRC-BOX pp. 12–17, 20; general surface-area claims corrected.

### F-CY08 — Exact ellipse perimeter as an integral

**Lesson:** `CYL-03`  
**Classification:** Exact advanced perimeter reference already in the pack  
**Content-pack location:** L1677

$$
C_e=4\int_0^{\pi/2}\sqrt{a^2\sin^2t+b^2\cos^2t}\,dt
$$

**Use/conditions:** Ellipse semiaxes a≥b>0; the expression is exact and intended as an advanced numerical-integration reference in the pack.

**Lesson source note in the pack:** SRC-CYL pp. 10–13; ellipse-perimeter formula corrected.

### F-CY09 — Approximate ellipse perimeter

**Lesson:** `CYL-03`  
**Classification:** Optional approximation already in the pack  
**Content-pack location:** L1681

$$
C_e\approx\pi\left[3(a+b)-\sqrt{(3a+b)(a+3b)}\right]
$$

**Use/conditions:** Right elliptic cylinder; a,b are semiaxes, not full axes, and C_e is the true ellipse perimeter. Clearly distinguish exact and approximate expressions.

**Lesson source note in the pack:** SRC-CYL pp. 10–13; ellipse-perimeter formula corrected.

### IMPL-2200 — Circle parameterization

**Lesson:** `Shared/implementation reference`  
**Classification:** Implementation addition already labeled in the pack  
**Content-pack location:** L2200

$$
x=h+r\cos t
$$

$$
y=k+r\sin t
$$

$$
0\le t\le2\pi
$$

**Use/conditions:** t is in radians for trigonometric parameterizations; hyperbola branches use σ=−1 or +1, with a finite viewport-dependent parameter range.

### IMPL-2201 — Horizontal-major ellipse parameterization

**Lesson:** `Shared/implementation reference`  
**Classification:** Implementation addition already labeled in the pack  
**Content-pack location:** L2201

$$
x=h+a\cos t
$$

$$
y=k+b\sin t
$$

**Use/conditions:** t is in radians for trigonometric parameterizations; hyperbola branches use σ=−1 or +1, with a finite viewport-dependent parameter range.

### IMPL-2202 — Vertical-major ellipse parameterization

**Lesson:** `Shared/implementation reference`  
**Classification:** Implementation addition already labeled in the pack  
**Content-pack location:** L2202

$$
x=h+b\cos t
$$

$$
y=k+a\sin t
$$

**Use/conditions:** t is in radians for trigonometric parameterizations; hyperbola branches use σ=−1 or +1, with a finite viewport-dependent parameter range.

### IMPL-2203 — Horizontal parabola parameterization

**Lesson:** `Shared/implementation reference`  
**Classification:** Implementation addition already labeled in the pack  
**Content-pack location:** L2203

$$
x=h+t^2/(4p)
$$

$$
y=k+t
$$

**Use/conditions:** t is in radians for trigonometric parameterizations; hyperbola branches use σ=−1 or +1, with a finite viewport-dependent parameter range.

### IMPL-2204 — Vertical parabola parameterization

**Lesson:** `Shared/implementation reference`  
**Classification:** Implementation addition already labeled in the pack  
**Content-pack location:** L2204

$$
x=h+t
$$

$$
y=k+t^2/(4p)
$$

**Use/conditions:** t is in radians for trigonometric parameterizations; hyperbola branches use σ=−1 or +1, with a finite viewport-dependent parameter range.

### IMPL-2205 — Horizontal hyperbola branch parameterization

**Lesson:** `Shared/implementation reference`  
**Classification:** Implementation addition already labeled in the pack  
**Content-pack location:** L2205

$$
x=h+\sigma a\cosh t
$$

$$
y=k+b\sinh t
$$

$$
\sigma\in\{-1,1\}
$$

**Use/conditions:** t is in radians for trigonometric parameterizations; hyperbola branches use σ=−1 or +1, with a finite viewport-dependent parameter range.

### IMPL-2206 — Vertical hyperbola branch parameterization

**Lesson:** `Shared/implementation reference`  
**Classification:** Implementation addition already labeled in the pack  
**Content-pack location:** L2206

$$
x=h+b\sinh t
$$

$$
y=k+\sigma a\cosh t
$$

$$
\sigma\in\{-1,1\}
$$

**Use/conditions:** t is in radians for trigonometric parameterizations; hyperbola branches use σ=−1 or +1, with a finite viewport-dependent parameter range.

### IMPL-POLYGON — Regular-polygon vertex construction and circumradius

**Lesson:** `Shared/implementation reference`  
**Classification:** Implementation addition already labeled in the pack  
**Content-pack location:** L2208

**Vertex expression**

$$
C+R(\cos(\phi+2\pi j/n),\sin(\phi+2\pi j/n))
$$

**Vertex index range**

$$
j=0,\ldots,n-1
$$

**Circumradius relation**

$$
R=s/[2\sin(\pi/n)]
$$

**Use/conditions:** Center C, circumradius R, rotation φ, integer n≥3; the source uses R here for the polygon circumradius.

### IMPL-SPHERE — Sphere cut geometry and volume cross-check

**Lesson:** `SPH-03`  
**Classification:** Implementation geometry already labeled in the pack  
**Content-pack location:** L1951

**Cut radius expression**

$$
\sqrt{R^2-z^2}
$$

**Cut-position range**

$$
-R\le z_1<z_2\le R
$$

**Plane separation**

$$
h=z_2-z_1
$$

**Cut radius relation**

$$
r_i=\sqrt{R^2-z_i^2}
$$

**Volume cross-check**

$$
V=\pi[R^2z-z^3/3]_{z_1}^{z_2}
$$

**Use/conditions:** Cuts z₁,z₂ refer to the same radius-R sphere centered at the origin; h=z₂−z₁.

**Lesson source note in the pack:** SRC-PYCS pp. 29–30.

## 18. Formula-tab completeness checks

- Account for all 101 named formula-group IDs in the original document, including the non-symbolic F-PR04 rule. Named IDs can cover several displayed expressions.
- Include the reusable unnumbered teaching relationships listed here, with catalogue IDs distinct from existing content IDs.
- Preserve the 15 module slugs and actual lesson IDs when linking the Formula tab to lessons.
- Keep vector robustness formulas, approximation status, and optional renderer extensions visibly distinguished as specified above.
- Preserve degree-based polygon trigonometry as written. Do not silently replace 180°/n with π/n without also making the angle-unit change explicit.
- Preserve signed p and absolute lengths for parabolas, the different focal-square signs for ellipses/hyperbolas, and all included/excluded solid surfaces.
- Do not add a familiar formula simply because it seems useful. Additions beyond this document require a separate content decision.
- Do not copy wrong formulas from the source correction log into reference cards.
- The summary tables in source section 16 repeat earlier teaching formulas. They are not an additional source of unique formulas.
- Numerical worked examples and quiz distractors are not new formula definitions.

### Verification record

The extraction checked that every displayed formula expression is a substring of its recorded source line, after removing only formula-number tags and terminal sentence punctuation. All 101 named formula-group IDs in the teaching portion are represented. Group labels and scope notes were organized for the website; the mathematical expressions were not derived or supplemented from outside the document.

The source file was checked against the current version's Library identity and byte count before extraction. The original content pack is unchanged.
