import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { Marked } from 'marked';
import katex from 'katex';
import sanitizeHtml from 'sanitize-html';

const sourcePath = new URL('../docs/geometry-website-content-pack.md', import.meta.url);
const outputPath = new URL('../src/data/course.generated.json', import.meta.url);
const generatedPath = new URL('../public/generated/', import.meta.url);
const marked = new Marked({ gfm: true, breaks: false });
const allowedTags = [
  ...sanitizeHtml.defaults.allowedTags,
  'h4',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'del',
  'input',
];

function splitTableRow(line) {
  return line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim());
}

function markdownToHtml(markdown) {
  const rhombusEquation = String.raw`$$P=4q,\quad K=bh=q^2\sin\theta=\frac{d_1d_2}{2},\quad q=\frac12\sqrt{d_1^2+d_2^2}.\tag{F-QD06}$$`;
  const studentEquation = String.raw`$$P=4q$$

$$K=bh=q^2\sin\theta$$

$$K=\frac{d_1d_2}{2}$$

$$q=\frac12\sqrt{d_1^2+d_2^2}$$`;
  const lines = markdown.replace(rhombusEquation, studentEquation).split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    if (!lines[index].startsWith('|')) continue;
    const header = splitTableRow(lines[index]);
    if (header[0]?.toLowerCase() !== 'formula id') continue;
    while (index < lines.length && lines[index].startsWith('|')) {
      lines[index] = lines[index].replace(/^\|\s*[^|]*\|/, '|');
      index += 1;
    }
    index -= 1;
  }
  const studentMarkdown = lines.join('\n');
  const math = [];
  const protectedMarkdown = studentMarkdown.replace(
    /\$\$([\s\S]+?)\$\$|\$([^$\n]+)\$/g,
    (match, display, inline) => {
      const index = math.length;
      const latex = (display ?? inline).replace(/\\tag\{F-[A-Z0-9-]+\}/g, '');
      math.push(katex.renderToString(latex.trim(), {
        displayMode: display !== undefined,
        output: 'htmlAndMathml',
        throwOnError: true,
        trust: false,
      }));
      return `COURSEMATHPLACEHOLDER${index}END`;
    },
  );
  let html = sanitizeHtml(marked.parse(protectedMarkdown), {
    allowedTags,
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel'],
      th: ['align'],
      td: ['align'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
  });
  for (const [index, rendered] of math.entries()) {
    html = html.replaceAll(`COURSEMATHPLACEHOLDER${index}END`, rendered);
  }
  html = html.replace(/\s*\(F-[A-Z0-9-]+\)/g, '');
  html = html.replace(
    /<p>(For larger counts,[\s\S]*?Large names are reference material, not core assessment targets\.)<\/p>/,
    '<details class="polygon-name-reference"><summary>Extended polygon names</summary><p>$1</p></details>',
  );
  return html.replace(
    /(<table\b[\s\S]*?<\/table>)/gi,
    '<div class="table-scroll" role="region" aria-label="Scrollable reference table" tabindex="0">$1</div>',
  );
}

function stripEditorialBlocks(markdown) {
  return markdown
    .split(/\n\s*\n/)
    .filter((block) =>
      !/^\*\*(?:Sources?|Interaction|Diagram brief):/i.test(block.trim())
      && !/^Formula IDs:/i.test(block.trim())
      && !/^\*\*Review-only/i.test(block.trim()))
    .join('\n\n')
    .trim();
}

function sourceFor(markdown) {
  const match = markdown.match(/^\*\*Sources?:\*\*\s*(.+)$/m);
  return match?.[1].replace(/\.$/, '') ?? 'Source details are listed in the module content pack.';
}

function lessonLead(markdown, fallback) {
  const firstParagraph = stripEditorialBlocks(markdown)
    .split(/\n\s*\n/)
    .find((paragraph) => paragraph.trim() && !paragraph.trim().startsWith('|'));
  if (!firstParagraph) return fallback;
  const mathSegments = [];
  const protectedText = firstParagraph
    .replace(/\$\$([^$]+)\$\$/g, (_, expression) => {
      const token = `\u0000${mathSegments.push(`$$${expression}$$`) - 1}\u0000`;
      return token;
    })
    .replace(/\$([^$]+)\$/g, (_, expression) => {
      const token = `\u0000${mathSegments.push(`$${expression}$`) - 1}\u0000`;
      return token;
    })
    .replace(/\^\s*\\circ\b/g, '°')
    .replace(/[*`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const firstSentence = protectedText.match(/^.*?(?:[.!?](?=\s|$)|$)/)?.[0] ?? protectedText;
  return firstSentence
    .replace(/\u0000(\d+)\u0000/g, (_, index) => mathSegments[Number(index)])
    .slice(0, 200);
}

function collectExamples(markdown) {
  const matches = [...markdown.matchAll(/^#### Worked example (.+)$/gm)];
  return matches.map((match, index) => {
    const start = match.index + match[0].length;
    const end = index + 1 < matches.length ? matches[index + 1].index : markdown.length;
    const body = markdown.slice(start, end)
      .split(/\n\s*\n/)
      .filter((block) => !/^\*\*(?:Interaction|Diagram brief|Practice):/i.test(block.trim()))
      .join('\n\n')
      .trim();
    return {
      title: match[1].trim(),
      solutionHtml: markdownToHtml(body),
    };
  });
}

function collectPracticeTables(markdown, moduleId, currentLessonId) {
  const lines = markdown.split(/\r?\n/);
  const practice = [];
  for (let index = 0; index < lines.length - 2; index += 1) {
    if (!lines[index].startsWith('|') || !lines[index + 1].startsWith('|')) continue;
    const headers = splitTableRow(lines[index]).map((header) => header.toLowerCase());
    const promptIndex = headers.findIndex((header) => header.includes('prompt'));
    const answerIndex = headers.findIndex((header) => header.includes('answer'));
    const idIndex = headers.findIndex((header) => header === 'id');
    const sourceIndex = headers.findIndex((header) => header === 'source');
    if (promptIndex < 0 || answerIndex < 0 || idIndex < 0) continue;

    index += 2;
    while (index < lines.length && lines[index].startsWith('|')) {
      const cells = splitTableRow(lines[index]);
      const id = cells[idIndex] ?? '';
      const prompt = cells[promptIndex] ?? '';
      const answer = cells[answerIndex] ?? '';
      const source = sourceIndex < 0 ? '' : cells[sourceIndex] ?? '';
      const combined = `${id} ${prompt} ${answer}`;
      if (
        /^[A-Z][A-Z0-9-]*$/.test(id)
        && prompt
        && answer
        && !/(?:^|-)R(?:EV)?-?\d*$/i.test(id)
        && !/review[- ]only|needs review|quarantin/i.test(combined)
      ) {
        practice.push({
          id,
          moduleId,
          lessonId: currentLessonId,
          promptHtml: markdownToHtml(prompt),
          answerHtml: markdownToHtml(answer),
          source,
        });
      }
      index += 1;
    }
    index -= 1;
  }
  return practice;
}

function parseOutcomes(section) {
  const match = section.match(/^\*\*Learning outcomes(?::)?\*\*:?\s*\n?([\s\S]*?)(?=\n### |\n---|$)/m);
  if (!match) return [];
  const bullets = [...match[1].matchAll(/^- (.+)$/gm)].map((item) => item[1].trim());
  if (bullets.length) return bullets;
  const inline = match[1].split(/\r?\n/, 1)[0].trim().replace(/\.$/, '');
  return inline ? inline.split(/;\s*/).map((outcome) => outcome.trim()) : [];
}

function parseModules(markdown) {
  const navigationRows = new Map(
    [...markdown.matchAll(/^\|\s*\d+\s*\|\s*([a-z0-9-]+)\s*\|[^|]*\|\s*([^|]+)\|/gm)]
      .map((match) => [match[1], match[2].trim()]),
  );
  const headings = [...markdown.matchAll(/^## (\d+)\. (.+)$/gm)]
    .filter((match) => Number(match[1]) >= 1 && Number(match[1]) <= 15);

  return headings.map((heading, moduleIndex) => {
    const start = heading.index + heading[0].length;
    const end = moduleIndex + 1 < headings.length
      ? headings[moduleIndex + 1].index
      : markdown.length;
    const section = markdown.slice(start, end);
    const id = section.match(/^\*\*Module ID:\*\*\s*`([^`]+)`/m)?.[1];
    if (!id) throw new Error(`Module ID is missing for "${heading[2]}".`);
    const overview = section.match(/^\*\*Overview:\*\*\s*(.+)$/m)?.[1]?.trim();
    const lessonHeadings = [...section.matchAll(/^### ([A-Z]+-\d{2}) — (.+)$/gm)];
    const lessons = lessonHeadings.map((lessonHeading, lessonIndex) => {
      const lessonStart = lessonHeading.index + lessonHeading[0].length;
      const lessonEnd = lessonIndex + 1 < lessonHeadings.length
        ? lessonHeadings[lessonIndex + 1].index
        : section.length;
      const lessonBlock = section.slice(lessonStart, lessonEnd);
      const exampleStart = lessonBlock.search(/^#### Worked example /m);
      const directiveStart = lessonBlock.search(/^\*\*(?:Interaction|Diagram brief):/m);
      const cutPoints = [exampleStart, directiveStart].filter((point) => point >= 0);
      const explanationEnd = cutPoints.length ? Math.min(...cutPoints) : lessonBlock.length;
      const explanation = stripEditorialBlocks(lessonBlock.slice(0, explanationEnd));
      const practiceNotes = [...lessonBlock.matchAll(/^\*\*(?:Quick practice[^*]*|Practice):\*\*[\s\S]*?(?=\n\n|$)/gm)]
        .map((match) => match[0].trim());
      const cleanExamples = collectExamples(lessonBlock);

      return {
        id: lessonHeading[1].toLowerCase(),
        code: lessonHeading[1],
        moduleId: id,
        moduleTitle: heading[2],
        moduleOrder: Number(heading[1]),
        lessonOrder: lessonIndex + 1,
        title: lessonHeading[2].trim(),
        lead: lessonLead(explanation, overview),
        outcomes: parseOutcomes(section),
        contentHtml: markdownToHtml(explanation),
        practiceNotesHtml: practiceNotes.map(markdownToHtml),
        examples: cleanExamples,
        source: sourceFor(lessonBlock),
      };
    });

    const practice = collectPracticeTables(section, id, null);
    return {
      id,
      title: heading[2].trim(),
      order: Number(heading[1]),
      summary: overview,
      prerequisites: navigationRows.get(id) ?? '',
      outcomes: parseOutcomes(section),
      lessonIds: lessons.map(({ id: lessonId }) => lessonId),
      practice,
      lessons,
    };
  });
}

const source = await readFile(sourcePath, 'utf8');
const modules = parseModules(source);
const lessons = modules.flatMap(({ lessons: moduleLessons }) => moduleLessons);
const practice = modules.flatMap(({ practice: modulePractice }) => modulePractice);
if (modules.length !== 15 || lessons.length !== 49) {
  throw new Error(`Expected 15 modules and 49 lessons; found ${modules.length} modules and ${lessons.length} lessons.`);
}

await mkdir(new URL('../src/data/', import.meta.url), { recursive: true });
await mkdir(new URL('lessons/', generatedPath), { recursive: true });
const lessonIndex = lessons.map(({ contentHtml, practiceNotesHtml, examples, ...metadata }) => metadata);
const courseIndex = {
  modules: modules.map(({ practice: _practice, lessons: moduleLessons, ...module }) => ({
    ...module,
    lessons: moduleLessons.map(({ contentHtml, practiceNotesHtml, examples, ...metadata }) => metadata),
  })),
  lessons: lessonIndex,
};
await writeFile(outputPath, JSON.stringify(courseIndex, null, 2));
await writeFile(new URL('practice.json', generatedPath), JSON.stringify(practice));
await Promise.all(lessons.map((lesson) =>
  writeFile(
    new URL(`lessons/${lesson.id}.json`, generatedPath),
    JSON.stringify(lesson),
  ),
));
console.log(`Compiled ${modules.length} modules, ${lessons.length} lessons, and ${practice.length} practice items.`);
