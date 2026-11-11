// Films the running Dwello (docs/design/tools/persona-stack.sh, :3300) through Chromium's screencast: every painted
// frame with its timestamp, turned into a 30 fps H.264 clip in build/marketing-video/clips/ (#1445).
// A visible mouse pointer with a click ripple, eased mouse moves and typing at a human pace.
// fallow-ignore-file unused-file
// (the scripts of this folder are run by hand, README.md: no entry point reaches them)
/* global Buffer, URL, console, crypto, process -- Node globals; document -- in page.evaluate */
/* global document */
import { createRequire } from 'module';
import { mkdirSync, writeFileSync, rmSync } from 'fs';
import { execFileSync } from 'child_process';
import { sessionToken } from '../design/tools/persona-kit.mjs';

const require = createRequire(new URL('../../package.json', import.meta.url));
export const { chromium } = require('@playwright/test');

export const BASE = process.env.BASE || 'http://localhost:3300';
// MV_BUILD: another output folder (with a trailing slash)
export const BUILD = process.env.MV_BUILD || new URL('../../build/marketing-video/', import.meta.url).pathname;
export const OUT = BUILD + 'clips/';
mkdirSync(OUT, { recursive: true });

const cursor = (touch) => `
(() => {
  const TOUCH = ${touch};
  const add = () => {
    if (document.getElementById('__cur')) return;
    const c = document.createElement('div');
    c.id = '__cur';
    if (TOUCH) {
      // a fingertip on the phone instead of a pointer
      Object.assign(c.style, { width: '34px', height: '34px', marginLeft: '-17px', marginTop: '-17px', borderRadius: '50%', background: 'rgba(22,28,33,.28)', border: '2px solid rgba(255,255,255,.9)' });
    } else {
      c.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24"><path d="M4 2 L4 19 L8.5 15 L11.5 22 L14.5 20.7 L11.6 14 L18 14 Z" fill="#161c21" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';
      c.style.transform = 'translate(-4px,-2px)';
      c.style.filter = 'drop-shadow(0 2px 3px rgba(0,0,0,.3))';
    }
    Object.assign(c.style, { position: 'fixed', left: '-100px', top: '-100px', zIndex: 2147483647, pointerEvents: 'none' });
    document.documentElement.appendChild(c);
    const pos = JSON.parse(sessionStorage.getItem('__cur') || '[-100,-100]');
    c.style.left = pos[0] + 'px'; c.style.top = pos[1] + 'px';
    addEventListener('mousemove', (e) => { c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px'; sessionStorage.setItem('__cur', JSON.stringify([e.clientX, e.clientY])); }, true);
    addEventListener('mousedown', (e) => {
      const r = document.createElement('div');
      Object.assign(r.style, { position: 'fixed', left: e.clientX - 18 + 'px', top: e.clientY - 18 + 'px', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(27,88,115,.35)', zIndex: 2147483646, pointerEvents: 'none', transition: 'transform .45s ease-out, opacity .45s ease-out', transform: 'scale(.3)' });
      document.documentElement.appendChild(r);
      requestAnimationFrame(() => { r.style.transform = 'scale(1.6)'; r.style.opacity = '0'; });
      setTimeout(() => r.remove(), 600);
    }, true);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add();
})();`;

/**
 * A signed-in Chromium (the persona stack's Liegenschaftsverwalter) whose frames come out at `out` pixels:
 * 1920x1080 from a 1280x720 page by default, 1080x1920 from a 390x693 page for the vertical cut.
 */
export async function launch({ width = 1280, height = 720, out = [1920, 1080], signedIn = true, mobile = false } = {}) {
	const browser = await chromium.launch({ env: { ...process.env, LC_ALL: 'C.UTF-8' } });
	const context = await browser.newContext({
		baseURL: BASE,
		viewport: { width, height },
		deviceScaleFactor: out[0] / width,
		locale: 'de-CH',
		isMobile: mobile,
		hasTouch: false
	});
	if (signedIn) {
		const token = await sessionToken();
		await context.addCookies([
			{ name: 'dwello_session', value: token, url: BASE },
			{ name: 'dwello_xsrf', value: crypto.randomUUID(), url: BASE }
		]);
	}
	await context.addInitScript(cursor(mobile));
	const page = await context.newPage();
	page.setDefaultTimeout(120000);
	let mx = width / 2;
	let my = height / 2;
	const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
	const h = {
		page,
		browser,
		out,
		async moveTo(target, { ms = 700, dx = 0.5, dy = 0.5 } = {}) {
			let x, y;
			if (Array.isArray(target)) [x, y] = target;
			else {
				await target.scrollIntoViewIfNeeded();
				const b = await target.boundingBox();
				x = b.x + b.width * dx;
				y = b.y + Math.min(b.height * dy, 40);
			}
			const steps = Math.max(8, Math.round(ms / 16));
			const [sx, sy] = [mx, my];
			for (let i = 1; i <= steps; i++) {
				const t = ease(i / steps);
				await page.mouse.move(sx + (x - sx) * t, sy + (y - sy) * t);
				await page.waitForTimeout(16);
			}
			[mx, my] = [x, y];
		},
		async click(target, opts) {
			await h.moveTo(target, opts);
			await page.waitForTimeout(150);
			await page.mouse.down();
			await page.waitForTimeout(80);
			await page.mouse.up();
		},
		async type(text, delay = 70) {
			for (const ch of text) {
				await page.keyboard.type(ch);
				await page.waitForTimeout(delay + Math.random() * 40);
			}
		},
		async scroll(dy, ms = 900) {
			const steps = Math.round(ms / 16);
			for (let i = 0; i < steps; i++) {
				await page.mouse.wheel(0, dy / steps);
				await page.waitForTimeout(16);
			}
		},
		wait: (ms) => page.waitForTimeout(ms)
	};
	return h;
}

/** Records what `fn` does on the page into clips/<name>.mp4 */
export async function record(h, name, fn) {
	const dir = `${OUT}${name}-frames/`;
	rmSync(dir, { recursive: true, force: true });
	mkdirSync(dir, { recursive: true });
	const cdp = await h.page.context().newCDPSession(h.page);
	const frames = [];
	cdp.on('Page.screencastFrame', ({ data, metadata, sessionId }) => {
		const file = `${dir}${String(frames.length).padStart(6, '0')}.jpg`;
		writeFileSync(file, Buffer.from(data, 'base64'));
		frames.push({ file, t: metadata.timestamp });
		cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
	});
	const [w, hgt] = h.out;
	await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 95, maxWidth: w, maxHeight: hgt, everyNthFrame: 1 });
	// a repaint, so the clip has a first frame even on a still page
	await h.page.evaluate(() => document.body.style.setProperty('outline', '0px solid transparent'));
	try {
		await fn(h);
	} finally {
		await h.page.evaluate(() => document.body.style.removeProperty('outline'));
		await h.wait(300);
		const end = Date.now() / 1000;
		await cdp.send('Page.stopScreencast');
		// each frame lasts until the next one: Chromium paints only what changes
		let list = '';
		frames.forEach((f, i) => {
			const next = i + 1 < frames.length ? frames[i + 1].t : Math.max(end, f.t + 0.04);
			list += `file '${f.file}'\nduration ${Math.max(0.001, next - f.t).toFixed(4)}\n`;
		});
		list += `file '${frames.at(-1).file}'\n`;
		writeFileSync(dir + 'list.txt', list);
		execFileSync('ffmpeg', [
			'-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', dir + 'list.txt',
			'-vf', `scale=${w}:${hgt}:flags=lanczos,fps=30,format=yuv420p`,
			'-c:v', 'libx264', '-crf', '16', '-preset', 'slow', `${OUT}${name}.mp4`
		]);
		rmSync(dir, { recursive: true, force: true });
		console.log('clip', name, frames.length, 'frames');
	}
}
