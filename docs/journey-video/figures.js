// The drawing kit of the journey video, loaded into the page that render.mjs films: rough.js strokes that draw
// themselves, a handwriting font, and the cast. People have a big egg head with dot eyes and a small body; the
// agents are small robots in the same line. Every scene's draw function receives `d` (the primitives) and the
// scene's length in seconds, and gives each stroke the second at which it starts.
// fallow-ignore-file unused-file
/* global rough */
(() => {
	const INK = '#16181d';
	const RED = '#e0301e';
	const GREEN = '#1f8a4c';
	const GREY = '#6b6b6b';
	const W = { fill: '#fff', fillStyle: 'solid' };
	const K = { fill: INK, fillStyle: 'solid' };
	const R0 = { fill: RED, fillStyle: 'solid', stroke: RED };
	Object.assign(window, { INK, RED, GREEN, GREY, W, K, R0 });
	// the cast: the product owner and the five personas (docs/design/personas/README.md)
	Object.assign(window, {
		ME: { tuft: true },
		HELGA: { glasses: true, curls: true },
		MARCO: { spikes: true },
		WEBER: { glasses: true, tie: true, cap: 'k', brows: 'skeptic', mouth: 'flat' },
		SVEN: { dark: true },
		ANNA: { pigtails: true, cap: 'w', mouth: 'grin' }
	});

	// one scene: an SVG for the strokes, the section for texts and photos
	window.makeScene = (index, draw, length) => {
		const section = document.createElement('section');
		section.className = 'scene';
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('viewBox', '0 0 1920 1080');
		section.append(svg);
		document.body.append(section);
		const rc = rough.svg(svg);
		let seed = index * 1000 + 1;
		const fade = (el, at, dur) => {
			el.style.opacity = 0;
			el.animate({ opacity: [0, 1] }, { duration: dur * 1000, delay: at * 1000, fill: 'both' }).pause();
		};
		const add = (node, at, dur, tf) => {
			if (tf) node.setAttribute('transform', tf);
			node.querySelectorAll('path').forEach((p) => {
				const fill = p.getAttribute('fill');
				if (fill && fill !== 'none') return fade(p, at + dur * 0.5, 0.25);
				if (p.getAttribute('stroke-dasharray')) return fade(p, at, dur);
				p.classList.add('s');
				p.setAttribute('pathLength', 1);
				p.style.animationDelay = at + 's';
				p.style.animationDuration = dur + 's';
			});
			svg.append(node);
		};
		const o = (x) => ({ stroke: INK, strokeWidth: 5.5, roughness: 0.55, bowing: 0.7, disableMultiStroke: true, seed: seed++, ...x });
		const d = {
			rect: (x, y, w, h, at, dur = 0.5, x2) => add(rc.rectangle(x, y, w, h, o(x2)), at, dur, x2 && x2.tf),
			line: (a, b, c, e, at, dur = 0.3, x2) => add(rc.line(a, b, c, e, o(x2)), at, dur, x2 && x2.tf),
			circle: (x, y, dia, at, dur = 0.5, x2) => add(rc.circle(x, y, dia, o(x2)), at, dur, x2 && x2.tf),
			ellipse: (x, y, w, h, at, dur = 0.5, x2) => add(rc.ellipse(x, y, w, h, o(x2)), at, dur, x2 && x2.tf),
			path: (p, at, dur = 0.5, x2) => add(rc.path(p, o(x2)), at, dur, x2 && x2.tf),
			text: (x, y, str, size, at, color = INK, rot = 0) => {
				const e = document.createElement('div');
				e.className = 't';
				e.textContent = str;
				e.style.cssText = `left:${x}px;top:${y}px;font-size:${Math.round(size * 0.74)}px;color:${color};rotate:${rot}deg;animation-delay:${at}s;animation-duration:${Math.max(0.3, str.length * 0.04)}s`;
				section.append(e);
			},
			// a real screenshot, pasted in like a photo with two strips of tape
			photo: (src, x, y, w, at, rot = 0) => {
				const e = document.createElement('img');
				e.className = 'photo';
				e.src = src;
				e.style.cssText = `left:${x}px;top:${y}px;width:${w}px;rotate:${rot}deg`;
				section.append(e);
				fade(e, at, 0.5);
				const tape = (tx) => {
					const t = document.createElement('div');
					t.className = 'tape';
					t.style.cssText = `left:${tx}px;top:${y - 18}px;rotate:${rot + (tx > x + w / 2 ? 8 : -8)}deg`;
					section.append(t);
					fade(t, at + 0.4, 0.2);
				};
				tape(x + 20);
				tape(x + w - 130);
			}
		};
		Object.assign(d, kit(d));
		draw(d, length);
		return section;
	};

	// shapes made of the primitives
	function kit(d) {
		const k = {};
		k.arrow = (x, y, len, at, dir = 0) => {
			const p = `M0 -20 L${len - 50} -20 L${len - 50} -44 L${len} 0 L${len - 50} 44 L${len - 50} 20 L0 20 Z`;
			d.path(p, at, 0.4, { fill: '#4a4a4a', fillStyle: 'solid', stroke: '#4a4a4a', tf: `translate(${x} ${y}) rotate(${dir})` });
		};
		k.check = (x, y, size, at, color = GREEN) =>
			d.path(`M${x} ${y} L${x + size * 0.35} ${y + size * 0.4} L${x + size} ${y - size * 0.55}`, at, 0.25, { stroke: color, strokeWidth: 9 });
		k.cross = (x, y, size, at, color = RED) => {
			d.line(x - size / 2, y - size / 2, x + size / 2, y + size / 2, at, 0.15, { stroke: color, strokeWidth: 9 });
			d.line(x + size / 2, y - size / 2, x - size / 2, y + size / 2, at + 0.15, 0.15, { stroke: color, strokeWidth: 9 });
		};
		// a sheet of paper with a title and scribbled lines, or given texts
		k.paper = (x, y, w, h, at, opt) => {
			const o = { size: 46, color: INK, texts: [], gap: 52, tsize: 38, step: 0.35, tcolor: INK, lines: opt.texts ? 0 : 3, ...opt };
			const top = y + (o.title ? 80 : 26);
			d.path(`M${x} ${y} L${x + w - 30} ${y} L${x + w} ${y + 30} L${x + w} ${y + h} L${x} ${y + h} Z`, at, 0.4, W);
			d.path(`M${x + w - 30} ${y} L${x + w - 30} ${y + 30} L${x + w} ${y + 30}`, at + 0.3, 0.1, { strokeWidth: 3.5 });
			parts(o, { title: (t) => d.text(x + 22, y + 14, t, o.size, at + 0.4, o.color) });
			o.texts.forEach((t, i) => d.text(x + 22, top + i * o.gap, t, o.tsize, at + 0.6 + i * o.step, o.tcolor));
			const n = Math.min(o.lines, Math.floor((y + h - 30 - top) / 34) + 1);
			Array.from({ length: Math.max(0, n) }, (_, i) => d.line(x + 22, top + 12 + i * 34, x + w - 30 - ((i * 53) % 70), top + 12 + i * 34, at + 0.5 + i * 0.1, 0.2, { stroke: GREY, strokeWidth: 3.5 }));
		};
		// the door of the API, with the floor and its sign
		k.apiDoor = (at) => {
			d.line(160, 880, 1780, 880, at, 0.6, { stroke: GREY });
			d.rect(1000, 300, 320, 580, at + 0.2, 0.6, W);
			d.rect(1060, 200, 200, 80, at + 0.8, 0.3, W);
			d.text(1110, 205, 'API', 66, at + 1);
		};
		k.screen = (x, y, w, h, at, opt = {}) => {
			d.rect(x, y, w, h, at, 0.5, W);
			if (!opt.noStand) {
				d.line(x + w / 2, y + h, x + w / 2, y + h + 70, at + 0.3, 0.2);
				d.line(x + w / 2 - 70, y + h + 70, x + w / 2 + 70, y + h + 70, at + 0.4, 0.2);
			}
			if (opt.title) d.text(x + 24, y + 14, opt.title, opt.size || 48, at + 0.5, GREY);
		};
		k.db = (x, y, w, h, at, label) => {
			d.path(`M${x} ${y} L${x} ${y + h} A${w / 2} ${w / 6} 0 0 0 ${x + w} ${y + h} L${x + w} ${y}`, at, 0.4, W);
			d.ellipse(x + w / 2, y, w, w / 3, at + 0.2, 0.3, W);
			if (label) d.text(x + 18, y + h / 2 - 10, label, 40, at + 0.5, GREY);
		};
		k.house = (x, y, w, h, at) => {
			d.rect(x, y, w, h, at, 0.5, W);
			d.path(`M${x - 40} ${y + 6} L${x + w / 2} ${y - h * 0.5} L${x + w + 40} ${y + 6}`, at + 0.4, 0.4);
		};
		k.flipchart = (x, y, w, h, at) => {
			d.line(x + 40, y + h, x - 10, y + h + 240, at, 0.3);
			d.line(x + w - 40, y + h, x + w + 10, y + h + 240, at + 0.1, 0.3);
			d.line(x + w / 2, y + h, x + w / 2, y + h + 240, at + 0.2, 0.3);
			d.rect(x, y, w, h, at + 0.3, 0.5, W);
		};
		// a barrier: a post and a striped bar, closed or raised
		k.gate = (x, y, len, at, open = false, label) => {
			d.rect(x - 22, y - 30, 44, 190, at, 0.3, W);
			const tf = open ? `rotate(-70 ${x} ${y})` : '';
			d.rect(x, y - 16, len, 32, at + 0.3, 0.4, { ...W, tf });
			for (let i = 1; i < len / 60; i++) d.rect(x + i * 60 - 30, y - 14, 28, 28, at + 0.6 + i * 0.05, 0.1, { ...R0, tf });
			if (label) d.text(x - 40, y + 175, label, 60, at + 0.8, GREY);
		};
		k.lock = (x, y, s, at, open = false) => {
			d.path(`M${x - 34 * s} ${y} L${x - 34 * s} ${y - 50 * s} A${34 * s} ${34 * s} 0 0 1 ${x + 34 * s} ${y - 50 * s} L${x + 34 * s} ${open ? y - 30 * s : y}`, at, 0.4, {
				strokeWidth: 10,
				tf: open ? `translate(${30 * s} ${-28 * s})` : ''
			});
			d.rect(x - 55 * s, y, 110 * s, 90 * s, at + 0.3, 0.3, { fill: '#e8c547', fillStyle: 'solid' });
			d.circle(x, y + 40 * s, 18 * s, at + 0.6, 0.1, K);
		};
		k.stamp = (x, y, str, size, at, color = RED, rot = -8) => {
			const w = str.length * size * 0.5 + 60;
			d.rect(x, y, w, size * 1.3, at, 0.3, { stroke: color, strokeWidth: 8, tf: `rotate(${rot} ${x + w / 2} ${y + size * 0.65})` });
			d.text(x + 30, y + size * 0.1, str, size, at + 0.15, color, rot);
		};
		k.tag = (x, y, str, at, color = RED) => {
			const w = str.length * 22 + 50;
			d.path(`M${x} ${y} L${x + 30} ${y - 26} L${x + w} ${y - 26} L${x + w} ${y + 26} L${x + 30} ${y + 26} Z`, at, 0.3, { stroke: color, strokeWidth: 4, fill: '#fff', fillStyle: 'solid' });
			d.circle(x + 26, y, 10, at + 0.2, 0.1, { stroke: color, strokeWidth: 3 });
			d.text(x + 44, y - 24, str, 46, at + 0.3, color);
		};
		// a traffic light: red lights up at `red`, green at `green`
		k.light = (x, y, s, at, red, green) => {
			d.rect(x, y, 70 * s, 160 * s, at, 0.3, K);
			d.circle(x + 35 * s, y + 42 * s, 46 * s, at + 0.2, 0.1, { stroke: '#555', strokeWidth: 3 });
			d.circle(x + 35 * s, y + 118 * s, 46 * s, at + 0.25, 0.1, { stroke: '#555', strokeWidth: 3 });
			if (red !== undefined) d.circle(x + 35 * s, y + 42 * s, 46 * s, red, 0.1, R0);
			if (green !== undefined) {
				d.circle(x + 35 * s, y + 42 * s, 46 * s, green, 0.1, { fill: '#333', fillStyle: 'solid', stroke: '#555' });
				d.circle(x + 35 * s, y + 118 * s, 46 * s, green, 0.1, { fill: GREEN, fillStyle: 'solid', stroke: GREEN });
			}
		};
		k.gear = (x, y, r, at, color = INK) => {
			let p = '';
			for (let i = 0; i < 12; i++) {
				const a1 = (i / 12) * Math.PI * 2;
				const a2 = a1 + Math.PI / 12;
				const pt = (a, rr) => `${(x + Math.cos(a) * rr).toFixed(1)} ${(y + Math.sin(a) * rr).toFixed(1)}`;
				p += (i ? 'L' : 'M') + pt(a1, r) + 'L' + pt(a1 + 0.08, r + 26) + 'L' + pt(a2 - 0.08, r + 26) + 'L' + pt(a2, r);
			}
			d.path(p + 'Z', at, 0.8, { stroke: color, ...W });
			d.circle(x, y, r * 0.6, at + 0.6, 0.2, { stroke: color });
		};
		// a cloud for thoughts, with two small circles toward the thinker
		k.thought = (x, y, w, h, at, toward) => {
			d.circle(toward[0], toward[1], 18, at, 0.1, { strokeWidth: 3.5 });
			d.circle((toward[0] + x) / 2, (toward[1] + y + h / 2) / 2, 30, at + 0.1, 0.1, { strokeWidth: 3.5 });
			const n = 9;
			let p = '';
			for (let i = 0; i <= n; i++) {
				const a = (i / n) * Math.PI * 2;
				const px = x + Math.cos(a) * w * 0.5;
				const py = y + Math.sin(a) * h * 0.5;
				if (!i) p = `M${px.toFixed(1)} ${py.toFixed(1)}`;
				else {
					const am = a - Math.PI / n;
					p += ` Q${(x + Math.cos(am) * w * 0.66).toFixed(1)} ${(y + Math.sin(am) * h * 0.7).toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)}`;
				}
			}
			d.path(p, at + 0.2, 0.6, { ...W, strokeWidth: 4 });
		};
		// a speech bubble with its tail toward the speaker
		k.say = (x, y, w, h, str, size, at, tail, color = INK) => {
			d.line(x + (tail[0] < x ? -w * 0.2 : w * 0.2), y + h * 0.4, tail[0], tail[1], at + 0.3, 0.15, { strokeWidth: 4 });
			d.ellipse(x, y, w, h, at, 0.5, { ...W, strokeWidth: 4 });
			d.text(x - str.length * size * 0.2, y - size * 0.52, str, size, at + 0.6, color);
		};
		// a desk seen from the side, its top at y
		k.desk = (x1, x2, y, at) => {
			d.rect(x1, y, x2 - x1, 24, at, 0.4, W);
			d.line(x1 + 30, y + 24, x1 + 26, y + 170, at + 0.2, 0.2);
			d.line(x2 - 30, y + 24, x2 - 26, y + 170, at + 0.25, 0.2);
		};
		// an empty office chair from the side, its seat at y
		k.chair = (x, y, s, at, f = 1) => {
			const X = (v) => x + f * v * s;
			const Y = (v) => y + v * s;
			d.path(`M${X(-58)} ${Y(-98)} C${X(-78)} ${Y(-98)} ${X(-80)} ${Y(-74)} ${X(-74)} ${Y(-48)} L${X(-62)} ${Y(18)} L${X(-42)} ${Y(18)} L${X(-46)} ${Y(-86)} Z`, at, 0.4, K);
			d.rect(Math.min(X(-62), X(58)), Y(0), 120 * s, 20 * s, at + 0.1, 0.3, K);
			d.rect(Math.min(X(-8), X(8)), Y(20), 16 * s, 64 * s, at + 0.15, 0.2, K);
			d.line(X(-56), Y(88), X(56), Y(88), at + 0.2, 0.2, { strokeWidth: 9 });
			[-56, 0, 56].forEach((w, i) => d.circle(X(w), Y(100), 18 * s, at + 0.25 + i * 0.03, 0.1, K));
		};
		k.laptop = (x, y, at, face = 1) => {
			d.path(`M${x} ${y} L${x + face * 130} ${y}`, at, 0.2, { strokeWidth: 8 });
			d.path(`M${x + (face > 0 ? 0 : 0)} ${y} L${x - face * 30} ${y - 100}`, at + 0.15, 0.2, { strokeWidth: 8 });
		};
		Object.assign(k, cast(d, k));
		return k;
	}

	// draws the parts whose option is set: table maps an option to the function that draws it, given its value
	function parts(o, table) {
		Object.keys(table)
			.filter((key) => o[key])
			.forEach((key) => table[key](o[key]));
	}

	// the cast: P a standing person, S a person seated from the side on an office chair, R a robot
	function cast(d) {
		let tubes = 0;
		const tube = (a, b, c, s, t) => {
			const p = `M${a[0]} ${a[1]} Q${b[0]} ${b[1]} ${c[0]} ${c[1]}`;
			const seed = 9000 + tubes++;
			d.path(p, t, 0.25, { strokeWidth: 21 * s, seed });
			d.path(p, t + 0.03, 0.25, { strokeWidth: 10.5 * s, stroke: '#fff', seed });
			d.circle(c[0], c[1], 25 * s, t + 0.2, 0.1, W);
		};
		const elbow = (a, c, k, s) => [(a[0] + c[0]) / 2 + k * 8 * s, (a[1] + c[1]) / 2 + 24 * s];
		// both arms from the shoulders to the hands, with what the right hand holds
		const twoArms = (f, sL, sR, L, Rr, t2) => {
			tube(sL, f.elbowL(L), L, f.s, t2);
			tube(sR, elbow(sR, Rr, 1, f.s), Rr, f.s, t2 + 0.05);
			hold(f, Rr, t2);
		};
		// what the right hand holds
		const hold = (f, Rr, t2) =>
			parts(f.o, {
				cane: () => {
					d.line(Rr[0], Rr[1], f.X(112), f.Y(290), t2 + 0.2, 0.3, { strokeWidth: 7, stroke: GREY });
					d.line(f.X(106), f.Y(268), f.X(112), f.Y(290), t2 + 0.4, 0.1, { strokeWidth: 7, stroke: RED });
				},
				phone: () => d.path(`M${Rr[0] - 12 * f.s} ${Rr[1] - 44 * f.s} l${26 * f.s} ${-4 * f.s} l${6 * f.s} ${46 * f.s} l${-26 * f.s} ${4 * f.s} Z`, t2 + 0.3, 0.2, K),
				stick: (st) => d.line(Rr[0], Rr[1], st[0], st[1], t2 + 0.25, 0.3, { strokeWidth: 4 })
			});
		// a frame: the scaled coordinates of a figure at x, y (mirrored for face -1) and its options with defaults
		const frame = (x, y, s, o0, face = 1) => {
			const o = { tilt: 0, look: 0, mouth: 'smile', brows: 'none', floor: !o0.noFloor, now: !o0.defer, ...o0 };
			const X = (v) => x + face * v * s;
			const Y = (v) => y + v * s;
			return { o, s, X, Y, p: (a, b) => X(a) + ' ' + Y(b), x, y };
		};

		// the head with hair, face and accessories; o.look moves the eyes sideways
		const head = (f, at) => {
			const { o, s, X, Y, p } = f;
			const H = { tf: `rotate(${o.tilt} ${f.x} ${Y(78)})` };
			const lk = o.look * 5 * s;
			const M = { tf: `translate(${o.look * 3 * s} 0) ` + H.tf };
			parts(o, {
				curls: () => [[-48, -30], [-38, -62], [-14, -84], [14, -84], [38, -62], [48, -30]].forEach((c) => d.circle(X(c[0]), Y(c[1]), 44 * s, at + 0.05, 0.15, { fill: '#d8d8d8', fillStyle: 'solid', ...H })),
				spikes: () => d.path(`M${p(-46, -40)} L${p(-40, -96)} L${p(-24, -70)} L${p(-12, -108)} L${p(2, -74)} L${p(18, -104)} L${p(28, -68)} L${p(44, -90)} L${p(48, -38)} Z`, at + 0.05, 0.3, { ...K, ...H }),
				pigtails: () =>
					[-1, 1].forEach((k) => {
						d.ellipse(X(k * 80), Y(14), 38 * s, 70 * s, at + 0.05, 0.25, { ...W, ...H });
						d.path(`M${p(k * 56, -14)} l${k * 16 * s} ${-12 * s} l0 ${24 * s} Z`, at + 0.3, 0.15, { ...K, ...H });
					})
			});
			d.path(`M${p(0, -86)} C${p(40, -86)} ${p(63, -14)} ${p(61, 28)} C${p(59, 62)} ${p(32, 79)} ${p(0, 79)} C${p(-32, 79)} ${p(-59, 62)} ${p(-61, 28)} C${p(-63, -14)} ${p(-40, -86)} ${p(0, -86)} Z`, at + 0.1, 0.5, { ...W, ...H });
			const eyes = {
				dots: () => [-13, 13].forEach((e, i) => d.circle(X(e) + lk, Y(-2), 11 * s, at + 0.6 + i * 0.05, 0.1, { ...K, strokeWidth: 2, ...H })),
				dark: () => d.path(`M${p(-44, -14)} L${p(44, -14)} L${p(40, 8)} L${p(6, 10)} L${p(0, 0)} L${p(-6, 10)} L${p(-40, 8)} Z`, at + 0.6, 0.2, { ...K, ...H })
			};
			eyes[o.dark ? 'dark' : 'dots']();
			parts(o, {
				cap: (c) => d.path(`M${p(-58, -4)} C${p(-56, -62)} ${p(-34, -90)} ${p(0, -90)} C${p(36, -90)} ${p(58, -58)} ${p(59, -4)} C${p(40, -44)} ${p(-4, -52)} ${p(-58, -4)} Z`, at + 0.55, 0.3, { ...{ k: K, w: W }[c], ...H }),
				tuft: () => [[-10, -100, -2], [2, -108, 6], [14, -98, 12]].forEach((q) => d.path(`M${p(q[2] - 4, -84)} Q${p(q[0] - 6, -96)} ${p(q[0], q[1])}`, at + 0.6, 0.1, { strokeWidth: 4, ...H })),
				glasses: () => [-15, 19].forEach((e) => d.circle(X(e) + lk, Y(-4), 34 * s, at + 0.7, 0.2, { strokeWidth: 3.5, ...H }))
			});
			const brow = (a, b, c, t) => d.path(`M${p(...a)} Q${p(...b)} ${p(...c)}`, at + t, 0.1, { strokeWidth: 4, ...H });
			const brows = {
				none: () => {},
				up: () => brow([-26, -30], [-14, -42], [-4, -32], 0.7) || brow([4, -32], [14, -42], [26, -30], 0.72),
				skeptic: () => brow([-28, -28], [-17, -26], [-6, -24], 0.7) || brow([4, -34], [16, -44], [28, -34], 0.72),
				worry: () => brow([-28, -26], [-17, -30], [-6, -34], 0.7) || brow([6, -34], [17, -30], [28, -26], 0.72)
			};
			brows[o.brows]();
			const mouths = {
				smile: () => d.path(`M${p(-27, 22)} Q${p(0, 54)} ${p(27, 22)}`, at + 0.75, 0.2, M),
				o: () => d.ellipse(X(2) + o.look * 3 * s, Y(40), 18 * s, 24 * s, at + 0.75, 0.2, { ...K, ...H }),
				grin: () => d.path(`M${p(-26, 24)} Q${p(0, 66)} ${p(26, 24)} Z`, at + 0.75, 0.2, { ...K, ...M }),
				flat: () => d.path(`M${p(-16, 34)} Q${p(0, 30)} ${p(18, 36)}`, at + 0.75, 0.2, M),
				sad: () => d.path(`M${p(-20, 42)} Q${p(0, 26)} ${p(20, 42)}`, at + 0.75, 0.2, M)
			};
			mouths[o.mouth]();
		};
		const shirt = (f, at) => {
			const { o, X, Y, p } = f;
			d.path(`M${p(-34, 84)} C${p(-42, 84)} ${p(-46, 94)} ${p(-45, 106)} L${p(-40, 178)} L${p(40, 178)} L${p(45, 106)} C${p(46, 94)} ${p(42, 84)} ${p(34, 84)} Z`, at + 0.3, 0.4, W);
			const front = {
				tie: () => d.path(`M${p(0, 92)} L${p(-9, 134)} L${p(0, 154)} L${p(9, 134)} Z`, at + 0.7, 0.2, R0),
				buttons: () => [122, 148].forEach((b) => d.circle(X(0), Y(b), 6 * f.s, at + 0.7, 0.1, K))
			};
			front[o.tie ? 'tie' : 'buttons']();
			d.path(`M${p(-18, 82)} L${p(0, 104)} L${p(18, 82)}`, at + 0.65, 0.15, { strokeWidth: 4 });
		};
		const floor = (f, a, b, yy, at) => parts(f.o, { floor: () => d.line(f.X(a), f.Y(yy), f.X(b), f.Y(yy), at + 0.2, 0.3, { strokeWidth: 3, stroke: GREY }) });
		const shoe = (f, a, b, c, at) => d.path(`M${f.p(a, 272)} C${f.p(a, 256)} ${f.p(b, 260)} ${f.p(c, 280)} C${f.p(c, 292)} ${f.p(a, 292)} ${f.p(a, 272)} Z`, at, 0.2, W);
		// where the hands rest by default, and the left elbow
		const rest = (f) => {
			const { o, X, Y } = f;
			const kind = ['hip', 'cane', 'phone'].find((key) => o[key]) ?? 'none';
			const table = { hip: [[-46, 150], [56, 176]], cane: [[-56, 176], [66, 150]], phone: [[-56, 176], [54, 128]], none: [[-56, 176], [56, 176]] }[kind];
			return { L: [X(table[0][0]), Y(table[0][1])], R: [X(table[1][0]), Y(table[1][1])], hip: kind === 'hip' };
		};

		// a standing person; the arms are drawn by arms() so that they can reach in front of a table
		const P = (x, y, s, at, o0 = {}) => {
			const f = frame(x, y, s, { stand: o0.pose !== 'sit', ...o0 });
			const { X, Y, p } = f;
			parts(f.o, {
				stand: () => {
					floor(f, -90, 100, 293, at);
					d.path(`M${p(-17, 174)} L${p(-22, 266)}`, at + 0.5, 0.3, { strokeWidth: 31 * s });
					d.path(`M${p(17, 174)} L${p(24, 266)}`, at + 0.55, 0.3, { strokeWidth: 31 * s });
					shoe(f, -6, -54, -58, at + 0.8);
					shoe(f, 8, 58, 62, at + 0.85);
				},
				chair: () => d.path(`M${p(-66, 86)} C${p(-66, 58)} ${p(66, 58)} ${p(66, 86)} L${p(60, 198)} L${p(-60, 198)} Z`, at, 0.4, K)
			});
			shirt(f, at);
			head(f, at);
			const arms = (l, r, t2 = at + 0.9) => {
				const home = rest(f);
				const sL = [X(-41), Y(106)];
				f.elbowL = (L) => [elbow(sL, L, -1, s), [X(-80), Y(118)]][Number(home.hip && !l)];
				twoArms(f, sL, [X(41), Y(106)], l ?? home.L, r ?? home.R, t2);
			};
			parts(f.o, { now: () => arms(f.o.armL, f.o.armR) });
			return { arms };
		};

		// a person seated from the side on a black office chair, facing right (face 1) or left (face -1)
		const S = (x, y, s, at, o0 = {}) => {
			const f = frame(x, y, s, o0, o0.face ?? 1);
			const { X, Y, p } = f;
			d.path(`M${p(-58, 80)} C${p(-78, 80)} ${p(-80, 104)} ${p(-74, 130)} L${p(-62, 196)} L${p(-42, 196)} L${p(-46, 92)} Z`, at, 0.4, K);
			d.rect(Math.min(X(-62), X(58)), Y(178), 120 * s, 20 * s, at + 0.1, 0.3, K);
			d.rect(Math.min(X(-8), X(8)), Y(198), 16 * s, 64 * s, at + 0.15, 0.2, K);
			d.line(X(-56), Y(266), X(56), Y(266), at + 0.2, 0.2, { strokeWidth: 9 });
			[-56, 0, 56].forEach((w, i) => d.circle(X(w), Y(278), 18 * s, at + 0.25 + i * 0.03, 0.1, K));
			d.path(`M${p(-10, 170)} L${p(78, 172)} L${p(84, 270)}`, at + 0.4, 0.4, { strokeWidth: 31 * s });
			d.path(`M${p(74, 280)} C${p(74, 262)} ${p(118, 264)} ${p(124, 282)} C${p(124, 294)} ${p(74, 296)} ${p(74, 280)} Z`, at + 0.7, 0.2, W);
			floor(f, -100, 150, 298, at);
			shirt(f, at);
			head({ ...f, X: (v) => x + v * s, p: (a, b) => x + a * s + ' ' + Y(b), o: { ...f.o, look: (o0.face ?? 1) * 2.4, ...o0 } }, at);
			const arms = (r, t2 = at + 0.9) => {
				const Rr = r ?? [X(108), Y(150)];
				tube([X(18), Y(106)], [X(30), Y(160)], Rr, s, t2);
				hold(f, Rr, t2);
			};
			parts(f.o, { now: () => arms(f.o.arm) });
			return { arms };
		};

		// a robot
		const R = (x, y, s, at, o0 = {}) => {
			const f = frame(x, y, s, o0);
			const { o, X, Y, p } = f;
			const H = { tf: `rotate(${o.tilt} ${x} ${Y(56)})` };
			const lk = o.look * 5 * s;
			parts(o, {
				legs: () => {
					floor(f, -80, 90, 262, at);
					d.path(`M${p(-16, 166)} L${p(-18, 238)}`, at + 0.8, 0.2, { strokeWidth: 20 * s });
					d.path(`M${p(16, 166)} L${p(18, 238)}`, at + 0.85, 0.2, { strokeWidth: 20 * s });
					d.ellipse(X(-24), Y(250), 52 * s, 22 * s, at + 1, 0.1, W);
					d.ellipse(X(26), Y(250), 52 * s, 22 * s, at + 1.05, 0.1, W);
				}
			});
			d.path(`M${p(-40, 76)} Q${p(-42, 64)} ${p(-30, 64)} L${p(30, 64)} Q${p(42, 64)} ${p(40, 76)} L${p(36, 168)} L${p(-36, 168)} Z`, at + 0.4, 0.4, W);
			d.rect(X(-20), Y(96), 40 * s, 30 * s, at + 0.7, 0.2, { strokeWidth: 3.5 });
			d.circle(X(-8), Y(144), 8 * s, at + 0.75, 0.1, R0);
			d.circle(X(10), Y(144), 8 * s, at + 0.78, 0.1, K);
			d.line(X(0), Y(-54), X(0), Y(-82), at + 0.2, 0.1, H);
			d.circle(X(0), Y(-92), 22 * s, at + 0.25, 0.15, { ...R0, ...H });
			[-1, 1].forEach((k) => d.rect(X(k * 60 - 7), Y(-16), 14 * s, 30 * s, at + 0.1, 0.1, { ...K, ...H }));
			d.path(`M${p(-54, -38)} Q${p(-56, -54)} ${p(-40, -54)} L${p(40, -54)} Q${p(56, -54)} ${p(54, -38)} L${p(54, 38)} Q${p(56, 54)} ${p(40, 54)} L${p(-40, 54)} Q${p(-56, 54)} ${p(-54, 38)} Z`, at, 0.4, { ...W, ...H });
			[-1, 1].forEach((k) => d.circle(X(k * 19) + lk, Y(-6), 12 * s, at + 0.5, 0.1, { ...K, strokeWidth: 2, ...H }));
			parts(o, {
				glasses: () => [-1, 1].forEach((k) => d.circle(X(k * 19) + lk, Y(-6), 34 * s, at + 0.55, 0.15, { strokeWidth: 3.5, ...H })),
				hat: () => d.path(`M${p(-62, -50)} C${p(-60, -100)} ${p(60, -100)} ${p(62, -50)} Z`, at + 0.6, 0.3, { fill: '#e8c547', fillStyle: 'solid', ...H })
			});
			const mouths = {
				smile: () => d.path(`M${p(-18, 26)} Q${p(0, 42)} ${p(18, 26)}`, at + 0.55, 0.15, H),
				flat: () => d.line(X(-16), Y(30), X(16), Y(30), at + 0.55, 0.1, H),
				grin: () => d.path(`M${p(-22, 22)} Q${p(0, 50)} ${p(22, 22)} Z`, at + 0.55, 0.15, { ...K, ...H }),
				o: () => d.ellipse(X(0), Y(30), 16 * s, 20 * s, at + 0.55, 0.15, { ...K, ...H })
			};
			mouths[o.mouth]();
			const arms = (l, r, t2 = at + 0.8) => {
				const sL = [X(-38), Y(86)];
				f.elbowL = (L) => elbow(sL, L, -1, s);
				twoArms(f, sL, [X(38), Y(86)], l ?? [X(-62), Y(156)], r ?? [X(62), Y(156)], t2);
			};
			parts(o, { now: () => arms(o.armL, o.armR) });
			return { arms };
		};
		return { P, S, R };
	}
})();
