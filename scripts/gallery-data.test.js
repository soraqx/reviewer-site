import assert from 'node:assert/strict';
import test from 'node:test';
import course from '../src/data/course.generated.json' with { type: 'json' };
import {
  defaultState,
  figures,
  formulaLink,
  lessonLinks,
  moduleFor,
  partById,
} from '../src/lib/gallery-registry.js';

const RELATIONSHIP_TYPES = new Set([
  'canonical term',
  'equivalent name in this context',
  'measurement relationship',
  'problem wording',
]);

test('gallery covers every course module exactly once', () => {
  const figureModules = new Set(figures.map((figure) => figure.moduleId));
  const courseModules = new Set(course.modules.map((module) => module.id));
  assert.equal(figures.length, courseModules.size);
  assert.deepEqual([...figureModules].sort(), [...courseModules].sort());
  assert.equal(new Set(figures.map((figure) => figure.id)).size, figures.length);
});

test('every figure exposes verified metadata and a working default build', () => {
  for (const figure of figures) {
    assert.ok(figure.title, `${figure.id} needs a title`);
    assert.ok(figure.family, `${figure.id} needs a family`);
    assert.ok(moduleFor(figure), `${figure.id} has an unknown moduleId`);
    assert.ok(figure.presets.length, `${figure.id} needs a preset`);
    assert.ok(figure.parts.length, `${figure.id} needs parts`);
    assert.equal(lessonLinks(figure.lessonIds).length, figure.lessonIds.length);

    const built = figure.build(defaultState(figure));
    assert.ok(Array.isArray(built.primitives), `${figure.id} must return primitives`);
    assert.ok(built.primitives.length, `${figure.id} default view is empty`);
    assert.ok(Array.isArray(built.measurements), `${figure.id} must return measurements`);
  }
});

test('all presets and parameters produce inspectable geometry', () => {
  for (const figure of figures) {
    const state = defaultState(figure);
    for (const preset of figure.presets) {
      const presetState = { ...state, preset: preset.id, params: { ...state.params, ...preset.values } };
      const built = figure.build(presetState);
      assert.ok(built.primitives.length, `${figure.id}/${preset.id} produced no geometry`);
      for (const primitive of built.primitives) {
        if (primitive.part) {
          assert.ok(
            partById(figure, primitive.part),
            `${figure.id}/${preset.id} draws unregistered part "${primitive.part}"`,
          );
        }
      }
    }
  }
});

test('part definitions stay conditional and link only to verified course data', () => {
  for (const figure of figures) {
    const partIds = new Set();
    for (const item of figure.parts) {
      assert.ok(item.id && item.name, `${figure.id} has an unnamed part`);
      assert.ok(!partIds.has(item.id), `${figure.id} has duplicate part ID ${item.id}`);
      partIds.add(item.id);
      assert.ok(item.definition, `${figure.id}/${item.id} needs a definition`);
      for (const example of item.wordingExamples ?? []) {
        assert.ok(RELATIONSHIP_TYPES.has(example.relationshipType),
          `${figure.id}/${item.id} has invalid relationship type ${example.relationshipType}`);
        assert.ok(example.text, `${figure.id}/${item.id} has empty wording`);
      }
      for (const formulaId of item.relatedFormulaIds ?? []) {
        assert.ok(formulaLink(formulaId), `${figure.id}/${item.id} links unknown formula ${formulaId}`);
      }
      assert.equal(lessonLinks(item.lessonIds ?? []).length, (item.lessonIds ?? []).length);
    }
  }
});

test('prism reference implementation includes every required terminology part', () => {
  const prisms = figures.find((figure) => figure.id === 'prisms');
  assert.ok(prisms);
  for (const id of [
    'base-face',
    'base-edge',
    'lateral-face',
    'lateral-edge',
    'altitude',
    'axis',
    'triangle-altitude',
    'right-section',
    'vertex',
  ]) {
    assert.ok(partById(prisms, id), `prism figure is missing ${id}`);
  }
});
