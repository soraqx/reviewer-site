/* Gallery figure registry and verified link resolution. */

import course from '../data/course.generated.json' with { type: 'json' };
import formulaData from '../data/formulas.json' with { type: 'json' };
import { FAMILIES } from './gallery-figure-utils.js';
import { figures as planeFigures } from './gallery-figures/plane.js';
import { figures as conics } from './gallery-figures/conics.js';
import { figures as solids } from './gallery-figures/solids.js';

export const figures = [...planeFigures, ...conics, ...solids];
export const figureById = new Map(figures.map((figure) => [figure.id, figure]));

const moduleById = new Map(course.modules.map((module) => [module.id, module]));
const lessonById = new Map(course.lessons.map((lesson) => [lesson.id, lesson]));
const formulaByKey = new Map();
for (const entry of formulaData.entries) {
  formulaByKey.set(entry.catalogueId.toLowerCase(), entry);
  formulaByKey.set(entry.id.toLowerCase(), entry);
}

export function moduleFor(figure) {
  return moduleById.get(figure.moduleId) ?? null;
}

export function lessonLinks(lessonIds = []) {
  return lessonIds
    .map((id) => lessonById.get(id))
    .filter(Boolean)
    .map((lesson) => ({
      id: lesson.id,
      code: lesson.code,
      title: lesson.title,
      href: `/lessons/${lesson.id}.html`,
    }));
}

export function formulaLink(catalogueId) {
  const entry = formulaByKey.get(String(catalogueId).toLowerCase());
  if (!entry) return null;
  return {
    id: entry.id,
    catalogueId: entry.catalogueId,
    name: entry.name,
    conditions: entry.conditions,
    expressions: entry.expressions ?? [],
    href: `/formulas/#${entry.id}`,
  };
}

export function quizLink(figure) {
  return `/quiz/?module=${encodeURIComponent(figure.moduleId)}`;
}

export function defaultState(figure) {
  const preset = figure.presets[0];
  const params = Object.fromEntries(
    (figure.parameters ?? []).map((parameter) => [parameter.id, parameter.default]),
  );
  Object.assign(params, preset?.values ?? {});
  return {
    preset: preset?.id ?? '',
    params,
    view: figure.family === FAMILIES.solids
      ? { azimuth: -Math.PI / 4, elevation: 0.55, scale: 1 }
      : { azimuth: 0, elevation: 0, scale: 1 },
    showLabels: true,
    showHidden: false,
    showGuides: true,
  };
}

export function families() {
  const order = [FAMILIES.plane, FAMILIES.coordinates, FAMILIES.solids];
  return order.map((family) => ({
    id: family,
    figures: figures.filter((figure) => figure.family === family),
  })).filter((group) => group.figures.length);
}

export function searchFigures(query) {
  const needle = query.trim().toLowerCase();
  if (!needle) return figures;
  return figures.filter((figure) => {
    const module = moduleFor(figure);
    const haystack = [
      figure.title,
      figure.id,
      module?.title ?? '',
      figure.presets.map((preset) => preset.label).join(' '),
      figure.parts.map((item) => [
        item.name,
        item.id,
        item.searchAliases?.join(' ') ?? '',
        item.wordingExamples?.map((example) => example.text).join(' ') ?? '',
      ].join(' ')).join(' '),
    ].join(' ').toLowerCase();
    return haystack.includes(needle);
  });
}

export function partById(figure, partId) {
  return figure.parts.find((item) => item.id === partId) ?? null;
}

export function partNames(figure) {
  return new Map(figure.parts.map((item) => [item.id, item.name]));
}
