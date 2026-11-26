import 'katex/dist/katex.min.css';
import './styles/main.css';
import './styles/gallery.css';
import katex from 'katex';
import { mountSharedLayout } from './lib/shared-layout.js';
import { replayMotion } from './lib/motion.js';
import { FAMILIES } from './lib/gallery-figure-utils.js';
import {
  defaultState,
  families,
  figureById,
  formulaLink,
  lessonLinks,
  moduleFor,
  partById,
  partNames,
  quizLink,
  searchFigures,
} from './lib/gallery-registry.js';
import {
  attachRotation,
  buildPreviewSvg,
  createGallerySvg,
  isRotationSuppressed,
} from './lib/gallery-view.js';

const app = document.querySelector('#gallery-app');
mountSharedLayout();

let currentFigureId = null;
let state = null;
let pinnedPart = null;
let previewPart = null;
let built = null;
let detachRotation = null;

const VIEW_PRESETS = [
  { id: 'front', label: 'Front', azimuth: 0, elevation: 0.12 },
  { id: 'isometric', label: 'Isometric', azimuth: -Math.PI / 4, elevation: 0.55 },
  { id: 'side', label: 'Side', azimuth: Math.PI / 2, elevation: 0.12 },
  { id: 'top', label: 'Top', azimuth: 0, elevation: 1.35 },
];

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function richText(value) {
  const source = String(value ?? '');
  const segments = source.split(/(\$[^$]+\$)/g);
  return segments.map((segment) => {
    if (segment.startsWith('$') && segment.endsWith('$') && segment.length > 2) {
      try {
        return katex.renderToString(segment.slice(1, -1), {
          throwOnError: false,
          output: 'htmlAndMathml',
        });
      } catch {
        return escapeHtml(segment);
      }
    }
    return escapeHtml(segment);
  }).join('');
}

function activeFigure() {
  return figureById.get(currentFigureId) ?? null;
}

function currentUrl() {
  return new URL(window.location.href);
}

function syncUrl() {
  const url = currentUrl();
  const figure = activeFigure();
  if (!figure) {
    for (const key of ['figure', 'preset', 'part']) url.searchParams.delete(key);
  } else {
    url.searchParams.set('figure', figure.id);
    if (state.preset) url.searchParams.set('preset', state.preset);
    else url.searchParams.delete('preset');
    if (pinnedPart) url.searchParams.set('part', pinnedPart);
    else url.searchParams.delete('part');
  }
  window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
}

function renderIndex() {
  closeRotation();
  currentFigureId = null;
  state = null;
  pinnedPart = null;
  previewPart = null;
  built = null;
  app.innerHTML = `
    <section class="gallery-index" aria-labelledby="gallery-index-heading">
      <div class="gallery-search-row">
        <label class="gallery-search" for="gallery-search">
          <span>Search figures and parts</span>
          <input id="gallery-search" type="search" placeholder="Try “lateral edge” or “directrix”" autocomplete="off" />
        </label>
        <label class="gallery-family-filter" for="gallery-family">
          <span>Family</span>
          <select id="gallery-family">
            <option value="">All families</option>
            ${families().map((group) => `<option value="${escapeHtml(group.id)}">${escapeHtml(group.id)}</option>`).join('')}
          </select>
        </label>
      </div>
      <p class="gallery-result-count" id="gallery-result-count" aria-live="polite"></p>
      <div id="gallery-card-groups"></div>
    </section>
  `;

  const groups = document.querySelector('#gallery-card-groups');
  for (const group of families()) {
    const section = document.createElement('section');
    section.className = 'gallery-family';
    section.dataset.family = group.id;
    section.innerHTML = `
      <header class="gallery-family-heading">
        <h2 id="gallery-family-${escapeHtml(group.id.replace(/\W+/g, '-'))}">${escapeHtml(group.id)}</h2>
        <span>${group.figures.length} figures</span>
      </header>
      <div class="gallery-cards"></div>
    `;
    const cards = section.querySelector('.gallery-cards');
    for (const figure of group.figures) {
      const previewBuilt = figure.build(defaultState(figure));
      const module = moduleFor(figure);
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'gallery-card';
      card.dataset.figure = figure.id;
      card.dataset.search = [
        figure.title,
        figure.id,
        module?.title ?? '',
        figure.parts.map((item) => `${item.name} ${item.searchAliases?.join(' ') ?? ''}`).join(' '),
      ].join(' ').toLowerCase();
      card.innerHTML = `
        <span class="gallery-card-preview" aria-hidden="true"></span>
        <span class="gallery-card-copy">
          <span class="gallery-card-kicker">${escapeHtml(module?.title ?? figure.moduleId)}</span>
          <span class="gallery-card-title">${escapeHtml(figure.title)}</span>
          <span class="gallery-card-meta">${figure.parts.length} inspectable parts · ${figure.presets.length} presets</span>
        </span>
        <span class="gallery-card-open" aria-hidden="true">Inspect →</span>
      `;
      card.querySelector('.gallery-card-preview').append(buildPreviewSvg(previewBuilt));
      card.addEventListener('click', () => openFigure(figure.id));
      cards.append(card);
    }
    groups.append(section);
  }

  const search = document.querySelector('#gallery-search');
  const family = document.querySelector('#gallery-family');
  const count = document.querySelector('#gallery-result-count');
  function filter() {
    const needle = search.value.trim().toLowerCase();
    const matches = searchFigures(needle);
    const familyFilter = family.value;
    let visible = 0;
    for (const section of groups.querySelectorAll('.gallery-family')) {
      let familyVisible = 0;
      for (const card of section.querySelectorAll('.gallery-card')) {
        const show = (!familyFilter || section.dataset.family === familyFilter)
          && matches.some((figure) => figure.id === card.dataset.figure);
        card.hidden = !show;
        if (show) familyVisible += 1;
      }
      section.hidden = familyVisible === 0;
      visible += familyVisible;
    }
    count.textContent = `${visible} figure${visible === 1 ? '' : 's'} available`;
  }
  search.addEventListener('input', filter);
  family.addEventListener('change', filter);
  filter();
  syncUrl();
}

function closeRotation() {
  detachRotation?.();
  detachRotation = null;
}

function openFigure(figureId, options = {}) {
  const figure = figureById.get(figureId);
  if (!figure) {
    renderIndex();
    return;
  }
  currentFigureId = figureId;
  state = defaultState(figure);
  pinnedPart = null;
  previewPart = null;

  const url = currentUrl();
  const preset = url.searchParams.get('preset');
  const requestedPreset = figure.presets.find((item) => item.id === preset) ?? figure.presets[0];
  if (requestedPreset) applyPreset(requestedPreset);
  const requestedPart = url.searchParams.get('part');
  if (requestedPart && partById(figure, requestedPart)) pinnedPart = requestedPart;
  if (options.part && partById(figure, options.part)) pinnedPart = options.part;
  renderViewer();
}

function applyPreset(preset) {
  state.preset = preset.id;
  Object.assign(state.params, preset.values ?? {});
}

function renderViewer({ preserveFocus = false } = {}) {
  const figure = activeFigure();
  if (!figure) {
    renderIndex();
    return;
  }
  const focusId = preserveFocus ? document.activeElement?.id : null;
  closeRotation();
  built = figure.build(state);
  const module = moduleFor(figure);
  const names = partNames(figure);
  const isSolid = figure.family === FAMILIES.solids;

  app.innerHTML = `
    <section class="gallery-viewer" aria-labelledby="gallery-viewer-title">
      <div class="gallery-viewer-topbar">
        <button type="button" class="gallery-back" id="gallery-back">← All figures</button>
        <p class="gallery-viewer-kicker">${escapeHtml(figure.family)} · ${escapeHtml(module?.title ?? figure.moduleId)}</p>
      </div>
      <header class="gallery-viewer-heading">
        <h2 id="gallery-viewer-title">${escapeHtml(built.title ?? figure.title)}</h2>
        <p>${richText(built.description ?? '')}</p>
        ${built.note ? `<p class="gallery-viewer-note">${richText(built.note)}</p>` : ''}
      </header>

      <div class="gallery-workspace">
        <div class="gallery-main-column">
          <div class="gallery-controls">
            <label class="gallery-control gallery-control--preset" for="gallery-preset">
              <span>Preset</span>
              <select id="gallery-preset">
                ${figure.presets.map((preset) => `<option value="${escapeHtml(preset.id)}" ${preset.id === state.preset ? 'selected' : ''}>${escapeHtml(preset.label)}</option>`).join('')}
              </select>
            </label>
            ${(figure.parameters ?? []).map((parameter) => parameter.type === 'select' ? `
              <label class="gallery-control" for="gallery-param-${escapeHtml(parameter.id)}">
                <span>${escapeHtml(parameter.label)}</span>
                <select id="gallery-param-${escapeHtml(parameter.id)}">
                  ${(parameter.options ?? []).map((option) => {
                    const value = Array.isArray(option) ? option[0] : option.value;
                    const text = Array.isArray(option) ? option[1] : option.label;
                    return `<option value="${escapeHtml(value)}" ${value === state.params[parameter.id] ? 'selected' : ''}>${escapeHtml(text)}</option>`;
                  }).join('')}
                </select>
              </label>
            ` : `
              <label class="gallery-control gallery-control--range" for="gallery-param-${escapeHtml(parameter.id)}">
                <span>${escapeHtml(parameter.label)} <output id="gallery-output-${escapeHtml(parameter.id)}">${escapeHtml(formatParam(parameter, state.params[parameter.id]))}</output></span>
                <input id="gallery-param-${escapeHtml(parameter.id)}" type="range" min="${parameter.min}" max="${parameter.max}" step="${parameter.step}" value="${state.params[parameter.id]}" />
              </label>
            `).join('')}
            ${isSolid ? `
              <fieldset class="gallery-control gallery-view-presets">
                <legend>View</legend>
                <div class="gallery-view-buttons">
                  ${VIEW_PRESETS.map((view) => `<button type="button" data-view="${view.id}" aria-pressed="${isViewActive(view)}">${escapeHtml(view.label)}</button>`).join('')}
                </div>
              </fieldset>
            ` : ''}
            <fieldset class="gallery-control gallery-toggles">
              <legend>Display</legend>
              <div class="gallery-toggle-row">
                <label><input type="checkbox" id="gallery-toggle-labels" ${state.showLabels ? 'checked' : ''} /> Labels</label>
                <label><input type="checkbox" id="gallery-toggle-guides" ${state.showGuides ? 'checked' : ''} /> Guides</label>
                <label><input type="checkbox" id="gallery-toggle-hidden" ${state.showHidden ? 'checked' : ''} /> Hidden edges</label>
              </div>
            </fieldset>
            <div class="gallery-actions">
              <button type="button" id="gallery-reset-dimensions">Reset dimensions</button>
              <button type="button" id="gallery-reset-view">Reset view</button>
              <button type="button" id="gallery-clear-selection" ${pinnedPart ? '' : 'disabled'}>Clear selection</button>
            </div>
          </div>

          <div class="gallery-stage" id="gallery-stage">
            <div class="gallery-stage-surface" id="gallery-stage-surface"></div>
            <div class="gallery-tooltip" id="gallery-tooltip" role="status" hidden></div>
          </div>
          <p class="gallery-stage-hint" id="gallery-stage-hint">Hover or focus a part for a quick label. Click, tap, or press Enter to pin its details.</p>

          <section class="gallery-dimensions" aria-labelledby="gallery-dimensions-heading">
            <h3 id="gallery-dimensions-heading">Dimensions in this figure</h3>
            <div class="gallery-measurements" id="gallery-measurements"></div>
          </section>
        </div>

        <aside class="gallery-side-column" aria-label="Parts and inspector">
          <section class="gallery-parts" aria-labelledby="gallery-parts-heading">
            <h3 id="gallery-parts-heading">Parts</h3>
            <p class="gallery-parts-help">Select a row to inspect the same geometry shown in the figure.</p>
            <ul class="gallery-parts-list" id="gallery-parts-list"></ul>
          </section>
          <section class="gallery-inspector" aria-labelledby="gallery-inspector-heading">
            <h3 id="gallery-inspector-heading">Inspector</h3>
            <p class="visually-hidden" id="gallery-selection-status" aria-live="polite"></p>
            <div id="gallery-inspector-body"></div>
          </section>
        </aside>
      </div>
    </section>
  `;

  const stageSurface = document.querySelector('#gallery-stage-surface');

  function mountFigureSvg() {
    built = figure.build(state);
    stageSurface.replaceChildren();
    const svg = createGallerySvg(built, {
      partNames: names,
      visibility: state,
      isDragging: () => isRotationSuppressed(stageSurface),
      onHover: (partId, _event, isFocus) => previewPartHover(partId, isFocus),
      onLeave: (isBlur) => clearPreview(isBlur),
      onSelect: (partId) => selectPart(partId),
    });
    svg.classList.toggle('gallery-svg--rotatable', isSolid);
    stageSurface.append(svg);
    renderMeasurements();
    renderInspector();
    applyHighlight();
  }

  function refreshFigure() {
    mountFigureSvg();
    syncUrl();
  }

  function syncControls() {
    const presetSelect = document.querySelector('#gallery-preset');
    if (presetSelect) presetSelect.value = state.preset;
    for (const parameter of figure.parameters ?? []) {
      const input = document.getElementById(`gallery-param-${parameter.id}`);
      const output = document.getElementById(`gallery-output-${parameter.id}`);
      if (input) input.value = String(state.params[parameter.id]);
      if (output) output.textContent = formatParam(parameter, state.params[parameter.id]);
    }
    const labels = document.querySelector('#gallery-toggle-labels');
    const guides = document.querySelector('#gallery-toggle-guides');
    const hidden = document.querySelector('#gallery-toggle-hidden');
    if (labels) labels.checked = state.showLabels;
    if (guides) guides.checked = state.showGuides;
    if (hidden) hidden.checked = state.showHidden;
    for (const button of document.querySelectorAll('[data-view]')) {
      const view = VIEW_PRESETS.find((item) => item.id === button.dataset.view);
      if (view) button.setAttribute('aria-pressed', String(isViewActive(view)));
    }
    const clearButton = document.querySelector('#gallery-clear-selection');
    if (clearButton) clearButton.disabled = !pinnedPart;
  }

  if (isSolid) {
    detachRotation = attachRotation(stageSurface, {
      enabled: () => true,
      getView: () => state.view,
      onRotate: (azimuth, elevation) => {
        state.view.azimuth = azimuth;
        state.view.elevation = elevation;
        mountFigureSvg();
        syncUrl();
      },
    });
  }
  mountFigureSvg();

  const partsList = document.querySelector('#gallery-parts-list');
  for (const item of figure.parts) {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gallery-part-row';
    button.dataset.part = item.id;
    button.setAttribute('aria-pressed', String(pinnedPart === item.id));
    button.innerHTML = `
      <span class="gallery-part-row-name">${escapeHtml(item.name)}</span>
      <span class="gallery-part-row-type">${escapeHtml(item.geometricType)}</span>
    `;
    button.addEventListener('mouseenter', () => previewPartHover(item.id, false));
    button.addEventListener('mouseleave', () => clearPreview(false));
    button.addEventListener('focus', () => previewPartHover(item.id, true));
    button.addEventListener('blur', () => clearPreview(true));
    button.addEventListener('click', () => selectPart(item.id));
    li.append(button);
    partsList.append(li);
  }

  document.querySelector('#gallery-back').addEventListener('click', () => renderIndex());
  document.querySelector('#gallery-preset').addEventListener('change', (event) => {
    const preset = figure.presets.find((item) => item.id === event.target.value);
    if (!preset) return;
    applyPreset(preset);
    syncControls();
    refreshFigure();
  });
  for (const parameter of figure.parameters ?? []) {
    const input = document.getElementById(`gallery-param-${parameter.id}`);
    const eventName = parameter.type === 'select' ? 'change' : 'input';
    input.addEventListener(eventName, (event) => {
      state.params[parameter.id] = parameter.type === 'select'
        ? event.target.value
        : Number(event.target.value);
      const output = document.getElementById(`gallery-output-${parameter.id}`);
      if (output) output.textContent = formatParam(parameter, state.params[parameter.id]);
      refreshFigure();
    });
  }
  for (const button of document.querySelectorAll('[data-view]')) {
    button.addEventListener('click', () => {
      const view = VIEW_PRESETS.find((item) => item.id === button.dataset.view);
      if (!view) return;
      state.view = { azimuth: view.azimuth, elevation: view.elevation, scale: 1 };
      syncControls();
      refreshFigure();
    });
  }
  document.querySelector('#gallery-toggle-labels').addEventListener('change', (event) => {
    state.showLabels = event.target.checked;
    refreshFigure();
  });
  document.querySelector('#gallery-toggle-guides').addEventListener('change', (event) => {
    state.showGuides = event.target.checked;
    refreshFigure();
  });
  document.querySelector('#gallery-toggle-hidden').addEventListener('change', (event) => {
    state.showHidden = event.target.checked;
    refreshFigure();
  });
  document.querySelector('#gallery-reset-dimensions').addEventListener('click', () => {
    const fresh = defaultState(figure);
    fresh.view = state.view;
    fresh.showLabels = state.showLabels;
    fresh.showHidden = state.showHidden;
    fresh.showGuides = state.showGuides;
    state = fresh;
    syncControls();
    refreshFigure();
  });
  document.querySelector('#gallery-reset-view').addEventListener('click', () => {
    state.view = defaultState(figure).view;
    syncControls();
    refreshFigure();
  });
  document.querySelector('#gallery-clear-selection').addEventListener('click', clearSelection);

  syncUrl();

  if (focusId && document.getElementById(focusId)) document.getElementById(focusId).focus({ preventScroll: true });

  function previewPartHover(partId, isFocus) {
    previewPart = partId;
    positionTooltip(partId);
    renderInspector();
    applyHighlight();
    if (isFocus) document.querySelector('#gallery-selection-status').textContent = `Previewing ${names.get(partId) ?? partId}.`;
  }

  function clearPreview() {
    if (!previewPart) return;
    previewPart = null;
    document.querySelector('#gallery-tooltip').hidden = true;
    renderInspector();
    applyHighlight();
  }

  function positionTooltip(partId) {
    const currentTooltip = document.querySelector('#gallery-tooltip');
    const group = document.querySelector(`.gallery-part[data-part="${CSS.escape(partId)}"]`);
    if (!group || !currentTooltip) return;
    const stageRect = document.querySelector('#gallery-stage').getBoundingClientRect();
    const groupRect = group.getBoundingClientRect();
    currentTooltip.textContent = names.get(partId) ?? partId.replace(/-/g, ' ');
    currentTooltip.hidden = false;
    const tooltipRect = currentTooltip.getBoundingClientRect();
    const left = Math.max(8, Math.min(
      groupRect.left - stageRect.left + groupRect.width / 2 - tooltipRect.width / 2,
      stageRect.width - tooltipRect.width - 8,
    ));
    const above = groupRect.top - stageRect.top - tooltipRect.height - 10;
    const top = above >= 8 ? above : groupRect.bottom - stageRect.top + 10;
    currentTooltip.style.left = `${left}px`;
    currentTooltip.style.top = `${Math.min(top, stageRect.height - tooltipRect.height - 8)}px`;
  }

  function selectPart(partId) {
    const needsHidden = built.primitives.some((primitive) => primitive.part === partId && primitive.hidden && !state.showHidden);
    const needsGuides = built.primitives.some((primitive) => primitive.part === partId
      && (primitive.role ?? 'segment') === 'guide' && !state.showGuides);
    if (needsHidden) state.showHidden = true;
    if (needsGuides) state.showGuides = true;
    pinnedPart = partId;
    previewPart = null;
    if (needsHidden || needsGuides) {
      syncControls();
      refreshFigure();
      return;
    }
    document.querySelector('#gallery-tooltip').hidden = true;
    document.querySelector('#gallery-clear-selection').disabled = false;
    document.querySelector('#gallery-selection-status').textContent = `Pinned ${names.get(partId) ?? partId}.`;
    renderInspector();
    applyHighlight();
    replayMotion(document.querySelector('#gallery-inspector-body'), 'motion-panel');
    syncUrl();
  }

  function clearSelection() {
    pinnedPart = null;
    previewPart = null;
    document.querySelector('#gallery-tooltip').hidden = true;
    const clearButton = document.querySelector('#gallery-clear-selection');
    if (clearButton) clearButton.disabled = true;
    document.querySelector('#gallery-selection-status').textContent = 'Selection cleared.';
    renderInspector();
    applyHighlight();
    syncUrl();
  }
}

function formatParam(parameter, value) {
  const suffix = parameter.unit ? ` ${parameter.unit}` : '';
  return `${escapeHtml(String(value))}${escapeHtml(suffix)}`;
}

function isViewActive(view) {
  if (!state?.view) return false;
  return Math.abs(state.view.azimuth - view.azimuth) < 0.02
    && Math.abs(state.view.elevation - view.elevation) < 0.02;
}

function applyHighlight() {
  const active = previewPart ?? pinnedPart;
  for (const group of document.querySelectorAll('.gallery-part')) {
    const partId = group.dataset.part;
    group.classList.toggle('is-active', partId === active);
    group.classList.toggle('is-preview', partId === previewPart && partId !== pinnedPart);
    group.classList.toggle('is-pinned', partId === pinnedPart);
  }
  for (const button of document.querySelectorAll('.gallery-part-row')) {
    const partId = button.dataset.part;
    button.classList.toggle('is-active', partId === active);
    button.classList.toggle('is-preview', partId === previewPart && partId !== pinnedPart);
    button.classList.toggle('is-pinned', partId === pinnedPart);
    button.setAttribute('aria-pressed', String(partId === pinnedPart));
  }
}

function renderMeasurements() {
  const target = document.querySelector('#gallery-measurements');
  if (!target || !built?.measurements?.length) {
    if (target) target.innerHTML = '<p class="gallery-muted">No scalar measurements are needed for this view.</p>';
    return;
  }
  target.innerHTML = `<dl>${built.measurements.map((item) => `
    <div class="gallery-measurement">
      <dt>${escapeHtml(item.label)} <span class="gallery-measurement-kind">${escapeHtml(item.kind)}</span></dt>
      <dd>${richText(String(item.value))}${item.note ? `<span class="gallery-measurement-note">${richText(item.note)}</span>` : ''}</dd>
    </div>
  `).join('')}</dl>`;
}

function renderInspector() {
  const target = document.querySelector('#gallery-inspector-body');
  if (!target) return;
  const figure = activeFigure();
  if (!figure) return;
  const shownId = pinnedPart ?? previewPart;
  const part = shownId ? partById(figure, shownId) : null;
  if (!part) {
    target.innerHTML = `
      <div class="gallery-inspector-empty">
        <p><strong>Pick a part to begin.</strong></p>
        <p>Hover or focus for a quick preview. Click, tap, or press Enter to pin the definition, wording, and links here.</p>
      </div>
    `;
    return;
  }

  const lessonItems = lessonLinks(part.lessonIds?.length ? part.lessonIds : figure.lessonIds);
  const formulaItems = (part.relatedFormulaIds ?? [])
    .map((id) => formulaLink(id))
    .filter(Boolean);
  const status = pinnedPart ? 'Pinned selection' : 'Hover preview';
  target.innerHTML = `
    <article class="gallery-inspector-card">
      <p class="gallery-inspector-status">${status}${previewPart && pinnedPart && previewPart !== pinnedPart
        ? ` · previewing ${escapeHtml(partById(figure, previewPart)?.name ?? '')} while ${escapeHtml(part.name)} stays pinned`
        : ''}</p>
      <h4>${escapeHtml(part.name)}</h4>
      <dl class="gallery-inspector-fields">
        <div><dt>What is highlighted?</dt><dd>${escapeHtml(part.geometricType)}</dd></div>
        <div><dt>Definition</dt><dd>${richText(part.definition)}</dd></div>
        <div><dt>Measurement / symbol</dt><dd>${part.symbol ? richText(part.symbol) : 'No standard symbol in this context.'}${part.measurementKind !== 'none' ? ` <span class="gallery-measurement-kind">${escapeHtml(part.measurementKind)}</span>` : ''}</dd></div>
        <div><dt>Wording you may see</dt><dd>
          <ul class="gallery-wording-list">
            ${(part.wordingExamples ?? []).map((example) => `
              <li>
                <span class="gallery-relation">${escapeHtml(example.relationshipType)}</span>
                <span>${richText(example.text)}</span>
                ${example.condition ? `<span class="gallery-condition">${escapeHtml(example.condition)}</span>` : ''}
              </li>
            `).join('') || '<li>No special wording has been added for this part.</li>'}
          </ul>
        </dd></div>
        ${part.distinctionNote ? `<div><dt>Important distinction</dt><dd>${richText(part.distinctionNote)}</dd></div>` : ''}
        <div><dt>Related formula</dt><dd>
          ${formulaItems.length ? `<ul class="gallery-link-list">${formulaItems.map((formula) => `
            <li>
              <a class="text-link" href="${formula.href}">${escapeHtml(formula.catalogueId)} · ${escapeHtml(formula.name)}</a>
              ${formula.expressions[0] ? `<span class="gallery-formula-expression">${katex.renderToString(formula.expressions[0].latex, { throwOnError: false, output: 'htmlAndMathml' })}</span>` : ''}
              ${formula.conditions ? `<span class="gallery-condition">${escapeHtml(formula.conditions)}</span>` : ''}
            </li>
          `).join('')}</ul>` : 'No catalogue formula is needed to identify this part.'}
        </dd></div>
        <div><dt>Learn more</dt><dd>
          <ul class="gallery-link-list">
            ${lessonItems.slice(0, 3).map((lesson) => `<li><a class="text-link" href="${lesson.href}">${escapeHtml(lesson.code)} · ${escapeHtml(lesson.title)}</a></li>`).join('')}
            <li><a class="text-link" href="${quizLink(figure)}">Quiz · ${escapeHtml(moduleFor(figure)?.title ?? figure.moduleId)}</a></li>
          </ul>
        </dd></div>
      </dl>
    </article>
  `;
}

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !currentFigureId || !app.contains(document.activeElement)) return;
  if (document.querySelector('dialog[open]')) return;
  const clearButton = document.querySelector('#gallery-clear-selection');
  if (clearButton && !clearButton.disabled) clearButton.click();
});

const url = currentUrl();
const requestedFigure = url.searchParams.get('figure');
if (requestedFigure && figureById.has(requestedFigure)) openFigure(requestedFigure);
else renderIndex();
