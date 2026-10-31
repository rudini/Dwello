/**
 * Notfallblatt (#718, #860): the Wiederherstellungscode with what to do in an emergency, in the landlord's language, to
 * print and keep apart from the computer; never stored (Fachreview 718b R-3). Wording: Fachreview 718b-1 and 718b-2.
 */

import { once } from 'events';
import PDFDocument from 'pdfkit';
import { embedFonts, FONT, type Language } from './pdf.service';

const GUIDE = 'https://github.com/rudini/Dwello/blob/main/docs/installation.md';

const WORDING: Record<
	Language,
	Record<'title' | 'code' | 'address' | 'date' | 'older' | 'location' | 'emergency' | 'self' | 'keep', string>
> = {
	de: {
		title: 'Notfallblatt Dwello',
		code: 'Wiederherstellungscode',
		address: 'Ihre Dwello-Installation: {address}',
		date: 'Code erstellt am {date}. Er gilt für die Sicherungen ab dem Tag, an dem Sie ihn in Dwello bestätigt haben.',
		// a new code (#718, part 3, fach review 718c V-5)
		older: 'Ältere Sicherungen öffnet das Notfallblatt von vorher; geben Sie im Notfall beide Blätter weiter.',
		location:
			'Die Sicherungen liegen auf dem Server dieser Dwello-Installation im Ordner «backups» und in der Kopie, die die Person, die Dwello betreut, regelmässig auf einem anderen Gerät ablegen soll.',
		emergency:
			'Im Notfall: Geben Sie dieses Blatt der Person, die Dwello betreut. Mit dem Code stellt sie den Stand der letzten Sicherung wieder her; was Sie danach erfasst haben, fehlt.',
		self: 'Betreuen Sie Dwello selbst, finden Sie das Vorgehen in der Installationsanleitung:',
		keep: 'Bewahren Sie dieses Blatt getrennt von Ihrem Computer an einem sicheren Ort auf.'
	},
	fr: {
		title: 'Fiche d’urgence Dwello',
		code: 'Code de restauration',
		address: 'Votre installation Dwello : {address}',
		date: 'Code créé le {date}. Il vaut pour les sauvegardes à partir du jour où vous l’avez confirmé dans Dwello.',
		// a new code (#718, part 3, fach review 718c V-5)
		older: 'Les sauvegardes plus anciennes s’ouvrent avec la fiche d’urgence précédente ; en cas d’urgence, remettez les deux fiches.',
		location:
			'Les sauvegardes se trouvent sur le serveur de cette installation Dwello, dans le dossier « backups », et dans la copie que la personne qui s’occupe de Dwello doit déposer régulièrement sur un autre appareil.',
		emergency:
			'En cas d’urgence : remettez cette fiche à la personne qui s’occupe de Dwello. Avec le code, elle restaure l’état de la dernière sauvegarde ; ce que vous avez saisi ensuite manquera.',
		self: 'Si vous vous occupez vous-même de Dwello, la marche à suivre figure dans le guide d’installation :',
		keep: 'Conservez cette fiche en lieu sûr, à l’écart de votre ordinateur.'
	},
	it: {
		title: 'Scheda di emergenza Dwello',
		code: 'Codice di ripristino',
		address: 'La Sua installazione di Dwello: {address}',
		date: 'Codice creato il {date}. Vale per le copie di sicurezza a partire dal giorno in cui lo ha confermato in Dwello.',
		// a new code (#718, part 3, fach review 718c V-5)
		older: 'Le copie di sicurezza più vecchie si aprono con la scheda di emergenza precedente; in caso di emergenza consegni entrambe le schede.',
		location:
			'Le copie di sicurezza si trovano sul server di questa installazione di Dwello, nella cartella «backups», e nella copia che la persona che si occupa di Dwello deve depositare regolarmente su un altro dispositivo.',
		emergency:
			'In caso di emergenza: consegni questa scheda alla persona che si occupa di Dwello. Con il codice, questa persona ripristina lo stato dell’ultima copia di sicurezza; ciò che Lei ha registrato dopo mancherà.',
		self: 'Se si occupa Lei stesso di Dwello, trova la procedura nella guida all’installazione:',
		keep: 'Conservi questa scheda in un luogo sicuro, lontano dal Suo computer.'
	},
	en: {
		title: 'Dwello emergency sheet',
		code: 'Recovery code',
		address: 'Your Dwello installation: {address}',
		date: 'Code created on {date}. It applies to backups from the day you confirmed it in Dwello.',
		// a new code (#718, part 3, fach review 718c V-5)
		older: 'Older backups open with the previous emergency sheet; in an emergency, hand over both sheets.',
		location:
			'The backups are kept on the server of this Dwello installation in the folder «backups» and in the copy that the person who looks after Dwello should keep regularly on another device.',
		emergency:
			'In an emergency: give this sheet to the person who looks after Dwello. With the code they restore the state of the last backup; anything you entered after it will be missing.',
		self: 'If you look after Dwello yourself, the steps are in the installation guide:',
		keep: 'Keep this sheet in a safe place away from your computer.'
	}
};

/** dd.mm.yyyy of the Swiss day, in every language as on the statement PDF */
const swissDay = (date: Date) =>
	date.toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' }).split('-').reverse().join('.');

export async function renderEmergencySheet(
	code: string,
	createdAt: Date,
	address: string,
	language: Language,
	replacing = false
) {
	const w = WORDING[language];
	const doc = embedFonts(
		new PDFDocument({
			size: 'A4',
			margins: { top: 60, bottom: 60, left: 70, right: 70 },
			info: { Title: w.title }
		})
	);
	const finished = once(doc, 'end');
	const pages: Buffer[] = [];
	doc.on('data', (page: Buffer) => pages.push(page));

	doc.font(FONT.bold).fontSize(18).fillColor('#111318').text(w.title);
	doc.moveDown().font(FONT.regular).fontSize(11).text(w.code);
	doc.font(FONT.bold).fontSize(20).text(code, { characterSpacing: 1 });
	doc
		.moveDown()
		.font(FONT.regular)
		.fontSize(11)
		.text(w.date.replace('{date}', swissDay(createdAt)), { width: 455 });
	if (replacing) doc.moveDown().text(w.older, { width: 455 });
	doc.moveDown().text(w.address.replace('{address}', address), { width: 455 });
	for (const paragraph of [w.location, w.emergency, w.self])
		doc.moveDown().text(paragraph, { width: 455 });
	// on a line of its own, so the address is not broken
	doc.text(GUIDE);
	doc.moveDown().text(w.keep, { width: 455 });
	doc.end();

	await finished;
	return Buffer.concat(pages);
}
