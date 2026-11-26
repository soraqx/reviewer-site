import { readFile, writeFile } from 'node:fs/promises';

const cataloguePath = new URL('../docs/geometry-formula-catalogue.md', import.meta.url);
const coursePath = new URL('../src/data/course.generated.json', import.meta.url);
const outputPath = new URL('../src/data/formulas.json', import.meta.url);

const [catalogue, courseSource] = await Promise.all([
  readFile(cataloguePath, 'utf8'),
  readFile(coursePath, 'utf8'),
]);
const course = JSON.parse(courseSource);
const lessonByCode = new Map(course.lessons.map((lesson) => [lesson.code, lesson]));
const moduleById = new Map(course.modules.map((module) => [module.id, module]));
const lines = catalogue.split(/\r?\n/);

function readMetadata() {
  const values = {};
  for (const line of lines) {
    const match = line.match(/^([a-z_]+):\s*(.+)$/);
    if (match) values[match[1]] = match[2].replace(/^"|"$/g, '');
  }
  return values;
}

function parseField(line, label) {
  const prefix = `**${label}:** `;
  return line.startsWith(prefix) ? line.slice(prefix.length).trim() : null;
}

function stripInlineMarkup(text) {
  return text.replace(/\*\*/g, '').replace(/`/g, '');
}

function referenceTypeFor(classification) {
  const value = classification.toLocaleLowerCase();
  if (value.includes('unnumbered')) return 'unnumbered-relationship';
  if (value.includes('supplemental')) return 'supplemental-relationship';
  if (value.includes('approximation')) return 'approximation';
  if (value.includes('exact advanced')) return 'exact-advanced-reference';
  if (value.includes('optional implementation')) return 'optional-extension';
  if (value.includes('implementation')) return 'implementation';
  if (value.includes('shared')) return 'shared-support';
  return 'teaching-formula';
}

function tagsFor(entry) {
  const tags = [entry.referenceType];
  const allMath = entry.expressions.map(({ latex }) => latex).join(' ');
  const allText = `${entry.name} ${entry.conditions} ${entry.notes.join(' ')}`;
  if (allMath.includes('\\approx') || /approximate/i.test(allText)) tags.push('approximation');
  if (allMath.includes('^\\circ') || allMath.includes('180^\\circ')) tags.push('degree-angles');
  if (/surface area|curved area|total area|wetted area/i.test(allText)) tags.push('surface-area');
  if (entry.sectionId === 'advanced-implementation' || /implementation/i.test(entry.classification)) {
    tags.push('implementation');
  }
  return [...new Set(tags)];
}

const rawSections = [];
let section = null;
let entry = null;

for (const line of lines) {
  const sectionMatch = line.match(/^## (\d+)\. (.+)$/);
  if (sectionMatch) {
    section = {
      order: Number(sectionMatch[1]),
      title: sectionMatch[2],
      introduction: [],
      entries: [],
    };
    rawSections.push(section);
    entry = null;
    continue;
  }
  const entryMatch = line.match(/^### ((?:X-|F-|IMPL-)[A-Z0-9-]+) — (.+)$/);
  if (entryMatch && section) {
    entry = { catalogueId: entryMatch[1], name: entryMatch[2], lines: [] };
    section.entries.push(entry);
    continue;
  }
  if (!section || section.order > 17) continue;
  if (entry) entry.lines.push(line);
  else if (line.trim() && line !== '---') {
    section.introduction.push(line.trim());
  }
}

function sectionIdentity(rawSection) {
  if (rawSection.order <= 15) {
    const moduleId = rawSection.introduction
      .find((line) => line.startsWith('**Module ID:**'))
      ?.match(/`([^`]+)`/)?.[1];
    if (!moduleId || !moduleById.has(moduleId)) {
      throw new Error(`Missing or invalid module ID in section ${rawSection.order}.`);
    }
    return { id: moduleId, kind: 'module', title: moduleById.get(moduleId).title };
  }
  if (rawSection.order === 16) {
    return { id: 'shared-support', kind: 'shared', title: 'Shared support formulas' };
  }
  return {
    id: 'advanced-implementation',
    kind: 'advanced',
    title: 'Optional advanced / implementation formulas',
  };
}

const sections = rawSections
  .filter((rawSection) => rawSection.order <= 17)
  .map((rawSection) => {
    const identity = sectionIdentity(rawSection);
    const prose = rawSection.introduction.find((line) => !line.startsWith('**')) ?? '';
    return {
      id: identity.id,
      order: rawSection.order,
      title: identity.title,
      kind: identity.kind,
      notation: identity.kind === 'module' ? prose : '',
      note: identity.kind === 'advanced'
        ? 'These relationships are already in the supplied content pack, but they are optional and are not required student material. Approximate expressions are labeled.'
        : '',
    };
  });

const entries = [];
for (const rawSection of rawSections.filter((item) => item.order <= 17)) {
  const identity = sectionIdentity(rawSection);
  for (const rawEntry of rawSection.entries) {
    const fields = {
      expressions: [],
      notes: [],
    };
    let label = null;

    for (let index = 0; index < rawEntry.lines.length; index += 1) {
      const line = rawEntry.lines[index];
      const lesson = parseField(line, 'Lesson');
      const classification = parseField(line, 'Classification');
      const location = parseField(line, 'Content-pack location');
      const conditions = parseField(line, 'Use/conditions');
      const sourceNote = parseField(line, 'Lesson source note in the pack');

      if (lesson) fields.lessonCode = stripInlineMarkup(lesson);
      if (classification) fields.classification = stripInlineMarkup(classification);
      if (location) fields.location = stripInlineMarkup(location);
      if (conditions) fields.conditions = stripInlineMarkup(conditions);
      if (sourceNote) fields.sourceNote = stripInlineMarkup(sourceNote);

      if (line.trim() === '$$') {
        const latex = [];
        index += 1;
        while (index < rawEntry.lines.length && rawEntry.lines[index].trim() !== '$$') {
          latex.push(rawEntry.lines[index]);
          index += 1;
        }
        fields.expressions.push({ label, latex: latex.join('\n').trim() });
        label = null;
        continue;
      }

      const labelMatch = line.match(/^\*\*([^*]+)\*\*\s*$/);
      if (labelMatch && !/^(Lesson|Classification|Content-pack location|Use\/conditions|Lesson source note in the pack)$/.test(labelMatch[1])) {
        label = stripInlineMarkup(labelMatch[1]);
        continue;
      }
      if (
        line.trim()
        && line !== '---'
        && !lesson
        && !classification
        && !location
        && !conditions
        && !sourceNote
      ) {
        fields.notes.push(stripInlineMarkup(line.trim()));
      }
    }

    const isSharedReference = fields.lessonCode === 'Shared/implementation reference';
    const lesson = isSharedReference ? null : lessonByCode.get(fields.lessonCode);
    if (!isSharedReference && !lesson) {
      throw new Error(`Unmapped lesson "${fields.lessonCode}" for ${rawEntry.catalogueId}.`);
    }
    if (!fields.conditions) throw new Error(`Missing conditions for ${rawEntry.catalogueId}.`);
    if (!fields.expressions.length && !fields.notes.length) {
      throw new Error(`Missing expression or rule for ${rawEntry.catalogueId}.`);
    }

    const entry = {
      id: rawEntry.catalogueId.toLowerCase(),
      catalogueId: rawEntry.catalogueId,
      name: rawEntry.name,
      sectionId: identity.id,
      sectionOrder: rawSection.order,
      sectionTitle: identity.title,
      topic: identity.title,
      kind: identity.kind,
      lessonCode: fields.lessonCode,
      lessonId: lesson?.id ?? null,
      lessonTitle: lesson?.title ?? '',
      classification: fields.classification,
      referenceType: referenceTypeFor(fields.classification),
      sourceLocation: fields.location,
      sourceNote: fields.sourceNote ?? '',
      conditions: fields.conditions,
      expressions: fields.expressions,
      notes: fields.notes,
    };
    entry.tags = tagsFor(entry);
    entries.push(entry);
  }
}

const metadata = readMetadata();
const expectedCounts = {
  all: Number(metadata.catalogue_entries),
  module: Number(metadata.module_reference_entries),
  shared: Number(metadata.shared_support_entries),
  advanced: Number(metadata.advanced_implementation_entries),
};
const actualCounts = {
  all: entries.length,
  module: entries.filter((entry) => entry.kind === 'module').length,
  shared: entries.filter((entry) => entry.kind === 'shared').length,
  advanced: entries.filter((entry) => entry.kind === 'advanced').length,
};
for (const key of Object.keys(expectedCounts)) {
  if (expectedCounts[key] !== actualCounts[key]) {
    throw new Error(`Catalogue count mismatch for ${key}: expected ${expectedCounts[key]}, found ${actualCounts[key]}.`);
  }
}
const namedGroupIds = new Set(entries.filter((entry) => entry.catalogueId.startsWith('F-')).map((entry) => entry.catalogueId));
if (namedGroupIds.size !== Number(metadata.source_named_formula_groups)) {
  throw new Error(`Expected ${metadata.source_named_formula_groups} named formula groups; found ${namedGroupIds.size}.`);
}

const catalogueData = {
  catalogueVersion: metadata.version,
  sourceContentVersion: metadata.source_content_version,
  sourceFile: metadata.source_file,
  sections,
  entries,
};

await writeFile(outputPath, `${JSON.stringify(catalogueData, null, 2)}\n`, 'utf8');
console.log(`Compiled ${entries.length} catalogue entries from ${sections.length} sections.`);
