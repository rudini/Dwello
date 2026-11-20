// A scene: the German line the product owner speaks, its English subtitle, and the drawing made while it is spoken.
// fallow-ignore-file unused-file
// draw(d, T, args, ROOT) runs in the page (figures.js), so it may use only its arguments and the page's globals.
export const sc = (de, en, draw, args) => ({ de, en, draw, args });

// a chapter card: number, title and a line below
export const card = (n, title, sub) => ({ card: true, args: { n, title, sub }, draw: drawCard });

function drawCard(d, T, a) {
	const x = [330, 520][Number(Boolean(a.n))];
	[a.n].filter(Boolean).forEach((n) => {
		d.circle(330, 470, 230, 0.1, 0.5, { strokeWidth: 7 });
		d.text(300, 380, String(n), 190, 0.4);
	});
	d.text(x, 360, a.title, Math.min(120, 1300 / (a.title.length * 0.36)), 0.5);
	d.path(`M${x} 520 C 800 500 1100 540 ${x + 980} 515`, 1.3, 0.5, { strokeWidth: 7, stroke: '#e0301e' });
	[a.sub].filter(Boolean).forEach((sub) => d.text(x + 4, 560, sub, 60, 1.3, '#6b6b6b'));
}
