/**
 * The KI set in the browser (#580) and the local KI's model (#577): what the page «KI» reads and saves, its
 * «Verbindung prüfen», and the download of the model it starts
 */

import { Elysia, t } from 'elysia';
import { llmConfig } from '../config/llm';
import { CodedError, errorBody } from '../services/coded-error';
import { loadModel, modelState } from '../services/ki-model.service';
import {
	checkKiConnection,
	currentKi,
	kiSettingsView,
	saveKiSettings
} from '../services/ki-settings.service';

const STATUS: Record<string, number> = {
	KI_SET_BY_OPERATOR: 409,
	KI_NOT_LOCAL: 409,
	KI_PROVIDER_INCOMPLETE: 422,
	KI_KEY_FOR_NEW_ADDRESS: 422,
	KI_ENCRYPTION_KEY_MISSING: 422
};

const refused = (error: unknown, set: { status?: number | string }) => {
	if (!(error instanceof CodedError) || !STATUS[error.code]) throw error;
	set.status = STATUS[error.code];
	return errorBody(error, error.message);
};

const text = t.Optional(t.String({ maxLength: 2048 }));
const ki = t.Object({
	mode: t.Union([t.Literal('local'), t.Literal('provider'), t.Literal('none')]),
	baseUrl: text,
	apiKey: text,
	model: text,
	provider: text,
	providerCountry: text,
	confirmed: t.Optional(t.Boolean())
});

export const kiSettingsRoutes = new Elysia({ prefix: '/api/v1' })
	.get('/ki-settings', () => kiSettingsView())
	.put(
		'/ki-settings',
		async ({ body, set }) => {
			try {
				return await saveKiSettings(body);
			} catch (error) {
				return refused(error, set);
			}
		},
		{ body: ki }
	)
	.post(
		'/ki-settings/check',
		async ({ body, set }) => {
			try {
				return await checkKiConnection(body);
			} catch (error) {
				return refused(error, set);
			}
		},
		{ body: ki }
	)
	// How far the local KI's model is (#577), for the overview and the page «KI»
	.get('/ki/model', () => modelState())
	// Download it again (domain review 580 F-5); Ollama is asked only while the local KI is chosen (fach review 577 R-2)
	.post('/ki/model', async ({ set }) => {
		const { mode, baseUrl, model } = await currentKi();
		if (mode !== 'local')
			return refused(new CodedError('KI_NOT_LOCAL', 'Die lokale KI ist nicht gewählt.'), set);
		void loadModel({ baseUrl, model, local: llmConfig.enabled });
		set.status = 202;
		return modelState();
	});
