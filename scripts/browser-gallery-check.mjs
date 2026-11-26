/* Dependency-free Chrome DevTools Protocol check for the shape gallery.
 * Run manually with: node scripts/browser-gallery-check.mjs
 */

import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const PORT = 4178;
const DEBUG_PORT = 9333;
const BASE = `http://127.0.0.1:${PORT}`;
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(check, message, timeout = 20000) {
  const started = Date.now();
  let lastError;
  while (Date.now() - started < timeout) {
    try {
      const result = await check();
      if (result) return result;
    } catch (error) {
      lastError = error;
    }
    await sleep(150);
  }
  throw new Error(`${message}${lastError ? `: ${lastError.message}` : ''}`);
}

class Cdp {
  constructor(socket) {
    this.socket = socket;
    this.id = 0;
    this.pending = new Map();
    this.events = [];
    socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (!message.id) {
        this.events.push(message);
        return;
      }
      if (!this.pending.has(message.id)) return;
      const { resolve, reject } = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) reject(new Error(`${message.error.code}: ${message.error.message}`));
      else resolve(message.result);
    });
  }

  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const result = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.text ?? 'Runtime.evaluate failed');
    }
    return result.result.value;
  }

  async navigate(url) {
    await this.send('Page.navigate', { url });
    await waitFor(
      () => this.evaluate('document.readyState === "complete"'),
      `Page did not finish loading: ${url}`,
    );
  }
}

async function startPreview() {
  const server = spawn(process.execPath, [
    resolve(process.cwd(), 'node_modules/vite/bin/vite.js'),
    'preview',
    '--host', '127.0.0.1',
    '--port', String(PORT),
    '--strictPort',
  ], {
    cwd: process.cwd(),
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  await waitFor(async () => {
    try {
      const response = await fetch(`${BASE}/gallery/`);
      return response.ok;
    } catch {
      return false;
    }
  }, 'Vite preview did not start');
  return server;
}

async function connectChrome() {
  const profile = mkdtempSync(join(tmpdir(), 'gallery-cdp-'));
  const chrome = spawn(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${profile}`,
    'about:blank',
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  const target = await waitFor(async () => {
    const response = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`);
    const targets = await response.json();
    return targets.find((item) => item.type === 'page');
  }, 'Chrome debugging endpoint did not start');

  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  const cdp = new Cdp(socket);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  return { chrome, cdp, profile };
}

function assertCount(value, expected, message) {
  assert.equal(value, expected, `${message}: expected ${expected}, got ${value}`);
}

async function run() {
  const server = await startPreview();
  let chrome;
  let profile;
  try {
    const connection = await connectChrome();
    chrome = connection.chrome;
    profile = connection.profile;
    const { cdp } = connection;

    await cdp.navigate(`${BASE}/gallery/`);
    await waitFor(() => cdp.evaluate('Boolean(document.querySelector("#gallery-card-groups"))'), 'Gallery index did not render');
    assertCount(await cdp.evaluate('document.querySelectorAll(".gallery-card").length'), 15, 'Figure card count');
    assertCount(await cdp.evaluate('document.querySelectorAll(".gallery-family").length'), 3, 'Family count');

    await cdp.evaluate(`
      window.__galleryErrors = [];
      window.addEventListener('error', (event) => window.__galleryErrors.push(event.message));
      window.addEventListener('unhandledrejection', (event) => window.__galleryErrors.push(String(event.reason)));
      document.querySelector('.gallery-card[data-figure="prisms"]').click();
    `);
    try {
      await waitFor(() => cdp.evaluate('Boolean(document.querySelector(".gallery-part-row"))'), 'Prism viewer did not render');
    } catch (error) {
      console.error('Viewer state:', JSON.stringify(await cdp.evaluate(`({
        parts: document.querySelectorAll('.gallery-part-row').length,
        groups: document.querySelectorAll('.gallery-part').length,
        stage: document.querySelector('#gallery-stage-surface')?.innerHTML.length ?? -1,
        controls: Boolean(document.querySelector('#gallery-preset')),
        list: Boolean(document.querySelector('#gallery-parts-list')),
        errors: window.__galleryErrors,
        listHtml: document.querySelector('#gallery-parts-list')?.innerHTML.slice(0, 500) ?? '',
      })`)));
      console.error('Browser events:', JSON.stringify(cdp.events.filter((event) => event.method === 'Runtime.exceptionThrown' || event.method === 'Runtime.consoleAPICalled'), null, 2));
      throw error;
    }
    assert.ok(await cdp.evaluate('document.querySelectorAll(".gallery-part-row").length') >= 9, 'Prism parts list');
    assert.ok(await cdp.evaluate('document.querySelectorAll(".gallery-part[data-part=\\"lateral-edge\\"]").length') > 0, 'Lateral edge is drawable');

    await cdp.evaluate(`document.querySelector('.gallery-part-row[data-part="lateral-edge"]').click()`);
    assert.match(await cdp.evaluate('document.querySelector(".gallery-inspector-card h4").textContent'), /Lateral edge/i);

    await cdp.evaluate(`
      (() => {
        const group = document.querySelector('.gallery-part[data-part="altitude"]');
        group.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse', bubbles: false }));
      })()
    `);
    assert.match(await cdp.evaluate('document.querySelector("#gallery-tooltip").textContent'), /altitude|height/i);
    assert.match(await cdp.evaluate('document.querySelector(".gallery-inspector-card h4").textContent'), /Lateral edge/i, 'Hover must not overwrite the pinned inspector');

    await cdp.evaluate(`
      (() => {
        const group = document.querySelector('.gallery-part[data-part="base-face"]');
        group.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      })()
    `);
    assert.match(await cdp.evaluate('document.querySelector(".gallery-inspector-card h4").textContent'), /base face/i);

    const beforeDrag = await cdp.evaluate('document.querySelector(".gallery-inspector-card h4").textContent');
    await cdp.evaluate(`
      (() => {
        const svg = document.querySelector('.gallery-svg');
        const rect = svg.getBoundingClientRect();
        const at = (x, y) => ({ clientX: rect.left + x, clientY: rect.top + y, pointerId: 1, bubbles: true });
        svg.dispatchEvent(new PointerEvent('pointerdown', at(100, 100)));
        svg.dispatchEvent(new PointerEvent('pointermove', at(145, 102)));
        svg.dispatchEvent(new PointerEvent('pointerup', at(145, 102)));
      })()
    `);
    await sleep(50);
    assert.equal(await cdp.evaluate('document.querySelector(".gallery-inspector-card h4").textContent'), beforeDrag, 'Rotation drag must not pin a part');

    await cdp.navigate(`${BASE}/gallery/?figure=prisms&preset=oblique-triangular&part=altitude`);
    await waitFor(() => cdp.evaluate('Boolean(document.querySelector(".gallery-inspector-card"))'), 'Deep link did not restore');
    assert.match(await cdp.evaluate('document.querySelector(".gallery-inspector-card h4").textContent'), /altitude|height/i);
    assert.equal(
      await cdp.evaluate('document.querySelector("#gallery-preset").value'),
      'oblique-triangular',
      'Preset deep link',
    );

    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 360, height: 740, deviceScaleFactor: 2, mobile: true,
    });
    await sleep(150);
    const overflow = await cdp.evaluate('document.documentElement.scrollWidth - window.innerWidth');
    assert.ok(overflow <= 1, `Horizontal overflow at 360px: ${overflow}px`);

    await cdp.send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
    });
    await cdp.evaluate(`document.querySelector('.gallery-part-row[data-part="axis"]')?.click()`);
    assert.match(await cdp.evaluate('document.querySelector(".gallery-inspector-card h4").textContent'), /axis/i);

    await cdp.navigate(`${BASE}/practice/?module=prisms`);
    await waitFor(
      () => cdp.evaluate('location.pathname === "/quiz/"'),
      'Old practice link did not redirect to Quiz',
    );
    assert.equal(await cdp.evaluate('new URLSearchParams(location.search).get("module")'), 'prisms');

    console.log('Gallery browser checks passed.');
  } finally {
    try {
      if (chrome?.pid) spawnSync('taskkill', ['/PID', String(chrome.pid), '/T', '/F'], { stdio: 'ignore' });
      else chrome?.kill();
    } catch { /* already stopped */ }
    try {
      spawnSync('taskkill', ['/PID', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
    } catch { /* already stopped */ }
    if (profile) {
      for (let attempt = 0; attempt < 5; attempt += 1) {
        try {
          rmSync(profile, { recursive: true, force: true });
          break;
        } catch {
          await sleep(200);
        }
      }
    }
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
