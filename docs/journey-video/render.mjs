// Renders a cut of the journey video as an animatic: every scene of scenes-<cut>.mjs drawn into one page, seeked
// frame by frame in Chromium and piped into ffmpeg, with the English subtitles burned in.
//   node docs/journey-video/render.mjs long             build/journey-video/long-animatic.mp4
//   node docs/journey-video/render.mjs long --stills    one still per scene, as contact sheets (to check drawings)
//   node docs/journey-video/render.mjs long --only 5-9  only these scenes (indices as --stills prints them)
//   node docs/journey-video/render.mjs long --text      writes sprechtext-<cut>.md next to this file
// fallow-ignore-file unused-file
/* global URL, process, console -- Node globals; window -- in page.evaluate */
/* global window */
import { mkdirSync, writeFileSync } from 'fs';
import { spawn, execFileSync } from 'child_process';
import { createRequire } from 'module';

const require = createRequire(new URL('../../package.json', import.meta.url));
const { chromium } = require('playwright');
const HERE = new URL('.', import.meta.url).pathname;
const ROOT = new URL('../../', import.meta.url).pathname;
const BUILD = process.env.JV_BUILD || ROOT + 'build/journey-video/';
const MODULES = process.env.JV_MODULES || BUILD + 'node_modules/';
const FPS = 12;

const [cut = 'long', ...flags] = process.argv.slice(2);
const flag = (name) => flags.includes(name);
const only = flag('--only') ? flags[flags.indexOf('--only') + 1] : undefined;
const { SCENES } = await import(`./scenes-${cut}.mjs`);
mkdirSync(BUILD, { recursive: true });

// a scene lasts as long as its sentence takes to say, a title card 3.4 s
let t = 0;
const all = SCENES.map((s, i) => {
	const length = s.card ? 3.4 : s.de.length / 13.5 + 1.6 + (s.extra || 0);
	const scene = { ...s, i, start: t, end: t + length, length };
	t += length;
	return scene;
});
const [from, to] = only ? only.split('-').map(Number) : [0, all.length - 1];
const TL = all.slice(from, (to ?? from) + 1);
const offset = TL[0].start;
const TOTAL = TL.at(-1).end - offset;
const clock = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

if (flag('--text')) {
	const md = [`# Sprechtext (${cut})`, '', `Generiert aus \`scenes-${cut}.mjs\` (\`node docs/journey-video/render.mjs ${cut} --text\`). Länge ${clock(all.at(-1).end)}.`, ''];
	for (const s of all) {
		if (s.card) md.push(`## ${s.args.n ? s.args.n + '. ' : ''}${s.args.title} (${clock(s.start)})`, '');
		else md.push(`> ${s.de}`, '>', `> *${s.en}*`, '');
	}
	writeFileSync(`${HERE}sprechtext-${cut}.md`, md.join('\n'));
	console.log(`sprechtext-${cut}.md, ${clock(all.at(-1).end)}`);
	process.exit(0);
}

const page = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:Hand;font-weight:700;src:url(file://${MODULES}@fontsource/kalam/files/kalam-latin-700-normal.woff2)}
*{box-sizing:border-box;margin:0;animation-play-state:paused!important}
body{width:1920px;height:1080px;overflow:hidden;background:#fdfcf9;font-family:Hand;font-weight:700}
.scene{position:absolute;inset:0;visibility:hidden}.scene svg{position:absolute;inset:0}
.t{position:absolute;white-space:nowrap;line-height:1.1;animation:write linear both}
@keyframes write{from{clip-path:inset(-30% 100% -30% -5%)}to{clip-path:inset(-30% -5% -30% -5%)}}
.photo{position:absolute;border:14px solid #fff;box-shadow:0 3px 14px rgba(0,0,0,.28)}
.tape{position:absolute;width:110px;height:34px;background:rgba(232,220,170,.8)}
path{stroke-linecap:round;stroke-linejoin:round}
path.s{stroke-dasharray:1;animation:draw ease-in-out both}
@keyframes draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
</style><body><script src="file://${MODULES}roughjs/bundled/rough.js"></script><script src="file://${HERE}figures.js"></script><script>
const ROOT=${JSON.stringify('file://' + ROOT)};
const TL=${JSON.stringify(TL.map((s) => [s.start - offset, s.end - offset]))};
const DRAW=[${TL.map((s) => s.draw.toString()).join(',\n')}];
const ARGS=${JSON.stringify(TL.map((s) => s.args || {}))};
const sc=DRAW.map((fn,i)=>window.makeScene(i,(d,T)=>fn(d,T,ARGS[i],ROOT),TL[i][1]-TL[i][0]));
window.seek=(t)=>{sc.forEach((s,i)=>{const on=t>=TL[i][0]&&t<TL[i][1];s.style.visibility=on?'visible':'hidden';
 if(on)s.style.opacity=Math.min(1,(TL[i][1]-t)/0.3)});
 for(const a of document.getAnimations()){const i=sc.indexOf(a.effect.target.closest('.scene'));a.currentTime=Math.max(0,(t-TL[i][0])*1000)}};
</script>`;
writeFileSync(`${BUILD}${cut}.html`, page);

const ts = (s) => new Date(s * 1000).toISOString().slice(11, 23).replace('.', ',');
const spoken = TL.filter((s) => !s.card);
for (const k of ['de', 'en'])
	writeFileSync(`${BUILD}${cut}.${k}.srt`, spoken.map((s, i) => `${i + 1}\n${ts(s.start - offset + 0.3)} --> ${ts(s.end - offset - 0.25)}\n${s[k]}\n`).join('\n'));

const browser = await chromium.launch();
const tab = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
tab.on('pageerror', (e) => console.log('PAGE ERROR', e.message));
await tab.goto(`file://${BUILD}${cut}.html`);
await tab.evaluate(() => window.document.fonts.load('700 40px Hand').then(() => window.document.fonts.ready));

if (flag('--stills')) {
	const dir = `${BUILD}stills-${cut}/`;
	mkdirSync(dir, { recursive: true });
	for (const s of TL) {
		await tab.evaluate((x) => window.seek(x), s.start - offset + s.length * 0.97 - 0.31);
		await tab.screenshot({ path: `${dir}${String(s.i).padStart(3, '0')}.jpg`, type: 'jpeg', quality: 80 });
	}
	await browser.close();
	// contact sheets of nine scenes, numbered
	const files = TL.map((s) => String(s.i).padStart(3, '0'));
	for (let n = 0; n < files.length; n += 9) {
		const part = files.slice(n, n + 9);
		while (part.length < 9) part.push(part.at(-1));
		const inputs = part.flatMap((f) => ['-i', `${dir}${f}.jpg`]);
		const label = part.map((f, k) => `[${k}]scale=640:-1,drawtext=text='${f}':x=10:y=10:fontsize=34:fontcolor=red[v${k}]`).join(';');
		execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', `${label};[v0][v1][v2]hstack=3[a];[v3][v4][v5]hstack=3[b];[v6][v7][v8]hstack=3[c];[a][b][c]vstack=3`, `${dir}sheet-${files[n]}.jpg`]);
	}
	console.log(`${TL.length} stills in ${dir}`);
	process.exit(0);
}

const out = `${BUILD}${cut}-animatic${only ? '-' + only : ''}.mp4`;
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-vf',
	`subtitles=${BUILD}${cut}.en.srt:force_style='FontName=DejaVu Sans,FontSize=14,Outline=0,Shadow=0,BorderStyle=4,BackColour=&H301D1816,PrimaryColour=&H00FFFFFF,MarginV=18',fps=24`,
	'-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '21', out], { stdio: ['pipe', 'inherit', 'inherit'] });
for (let f = 0; f < TOTAL * FPS; f++) {
	await tab.evaluate((x) => window.seek(x), f / FPS);
	if (!ff.stdin.write(await tab.screenshot({ type: 'jpeg', quality: 90 }))) await new Promise((r) => ff.stdin.once('drain', r));
}
ff.stdin.end();
await browser.close();
await new Promise((r) => ff.on('close', r));
console.log(`${out}, ${clock(TOTAL)}`);
