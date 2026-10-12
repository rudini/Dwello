/**
 * Heating Profile Routes
 * API endpoints for heating distribution profile management
 */

import { Elysia, t } from 'elysia';
import { errorBody, refusal } from '../services/coded-error';
import { deleteResponse } from './delete-response';
import {
	listHeatingProfiles,
	getHeatingProfile,
	createHeatingProfile,
	updateHeatingProfile,
	deleteHeatingProfile,
	getMonthlyPercentages
} from '../services/heating-profile.service';
import { Conflict } from '../services/conflict';

export const heatingProfileRoutes = new Elysia({ prefix: '/api/v1/heating-profiles' })
	// List all heating profiles
	.get(
		'/',
		async ({ query }) => {
			const { heatingProfiles, total } = await listHeatingProfiles({
				search: query.search,
				type: query.type as 'predefined' | 'custom' | undefined,
				limit: query.limit ? parseInt(query.limit) : undefined,
				offset: query.offset ? parseInt(query.offset) : undefined
			});

			return {
				data: heatingProfiles,
				total,
				limit: query.limit ? parseInt(query.limit) : 100,
				offset: query.offset ? parseInt(query.offset) : 0
			};
		},
		{
			query: t.Object({
				search: t.Optional(t.String()),
				type: t.Optional(t.String()),
				limit: t.Optional(t.String()),
				offset: t.Optional(t.String())
			})
		}
	)

	// Get a single heating profile
	.get(
		'/:id',
		async ({ params, set }) => {
			const profile = await getHeatingProfile(params.id);

			if (!profile) {
				set.status = 404;
				return refusal('HEATING_PROFILE_NOT_FOUND', 'Heating profile not found');
			}

			return {
				...profile,
				monthlyPercentages: getMonthlyPercentages(profile)
			};
		},
		{
			params: t.Object({
				id: t.String()
			})
		}
	)

	// Create a new heating profile
	.post(
		'/',
		async ({ body, set }) => {
			try {
				const profile = await createHeatingProfile({
					name: body.name,
					nameDE: body.nameDE,
					nameFR: body.nameFR,
					nameIT: body.nameIT,
					nameEN: body.nameEN,
					type: body.type || 'custom',
					description: body.description,
					januaryPct: String(body.januaryPct),
					februaryPct: String(body.februaryPct),
					marchPct: String(body.marchPct),
					aprilPct: String(body.aprilPct),
					mayPct: String(body.mayPct),
					junePct: String(body.junePct),
					julyPct: String(body.julyPct),
					augustPct: String(body.augustPct),
					septemberPct: String(body.septemberPct),
					octoberPct: String(body.octoberPct),
					novemberPct: String(body.novemberPct),
					decemberPct: String(body.decemberPct)
				});

				set.status = 201;
				return profile;
			} catch (error) {
				set.status = error instanceof Conflict ? 409 : 400;
				return errorBody(error, 'Failed to create heating profile');
			}
		},
		{
			body: t.Object({
				name: t.String({ minLength: 1 }),
				nameDE: t.Optional(t.String()),
				nameFR: t.Optional(t.String()),
				nameIT: t.Optional(t.String()),
				nameEN: t.Optional(t.String()),
				type: t.Optional(t.String()),
				description: t.Optional(t.String()),
				januaryPct: t.Number({ minimum: 0, maximum: 100 }),
				februaryPct: t.Number({ minimum: 0, maximum: 100 }),
				marchPct: t.Number({ minimum: 0, maximum: 100 }),
				aprilPct: t.Number({ minimum: 0, maximum: 100 }),
				mayPct: t.Number({ minimum: 0, maximum: 100 }),
				junePct: t.Number({ minimum: 0, maximum: 100 }),
				julyPct: t.Number({ minimum: 0, maximum: 100 }),
				augustPct: t.Number({ minimum: 0, maximum: 100 }),
				septemberPct: t.Number({ minimum: 0, maximum: 100 }),
				octoberPct: t.Number({ minimum: 0, maximum: 100 }),
				novemberPct: t.Number({ minimum: 0, maximum: 100 }),
				decemberPct: t.Number({ minimum: 0, maximum: 100 })
			})
		}
	)

	// Update a heating profile
	.put(
		'/:id',
		async ({ params, body, set }) => {
			try {
				const updateData: Record<string, unknown> = {};

				if (body.name !== undefined) updateData.name = body.name;
				if (body.nameDE !== undefined) updateData.nameDE = body.nameDE;
				if (body.nameFR !== undefined) updateData.nameFR = body.nameFR;
				if (body.nameIT !== undefined) updateData.nameIT = body.nameIT;
				if (body.nameEN !== undefined) updateData.nameEN = body.nameEN;
				if (body.description !== undefined) updateData.description = body.description;
				if (body.januaryPct !== undefined) updateData.januaryPct = String(body.januaryPct);
				if (body.februaryPct !== undefined) updateData.februaryPct = String(body.februaryPct);
				if (body.marchPct !== undefined) updateData.marchPct = String(body.marchPct);
				if (body.aprilPct !== undefined) updateData.aprilPct = String(body.aprilPct);
				if (body.mayPct !== undefined) updateData.mayPct = String(body.mayPct);
				if (body.junePct !== undefined) updateData.junePct = String(body.junePct);
				if (body.julyPct !== undefined) updateData.julyPct = String(body.julyPct);
				if (body.augustPct !== undefined) updateData.augustPct = String(body.augustPct);
				if (body.septemberPct !== undefined) updateData.septemberPct = String(body.septemberPct);
				if (body.octoberPct !== undefined) updateData.octoberPct = String(body.octoberPct);
				if (body.novemberPct !== undefined) updateData.novemberPct = String(body.novemberPct);
				if (body.decemberPct !== undefined) updateData.decemberPct = String(body.decemberPct);

				const profile = await updateHeatingProfile(params.id, updateData);

				if (!profile) {
					set.status = 404;
					return refusal('HEATING_PROFILE_NOT_FOUND', 'Heating profile not found');
				}

				return profile;
			} catch (error) {
				set.status = error instanceof Conflict ? 409 : 400;
				return errorBody(error, 'Failed to update heating profile');
			}
		},
		{
			params: t.Object({
				id: t.String()
			}),
			body: t.Object({
				name: t.Optional(t.String({ minLength: 1 })),
				nameDE: t.Optional(t.String()),
				nameFR: t.Optional(t.String()),
				nameIT: t.Optional(t.String()),
				nameEN: t.Optional(t.String()),
				description: t.Optional(t.String()),
				januaryPct: t.Optional(t.Number({ minimum: 0, maximum: 100 })),
				februaryPct: t.Optional(t.Number({ minimum: 0, maximum: 100 })),
				marchPct: t.Optional(t.Number({ minimum: 0, maximum: 100 })),
				aprilPct: t.Optional(t.Number({ minimum: 0, maximum: 100 })),
				mayPct: t.Optional(t.Number({ minimum: 0, maximum: 100 })),
				junePct: t.Optional(t.Number({ minimum: 0, maximum: 100 })),
				julyPct: t.Optional(t.Number({ minimum: 0, maximum: 100 })),
				augustPct: t.Optional(t.Number({ minimum: 0, maximum: 100 })),
				septemberPct: t.Optional(t.Number({ minimum: 0, maximum: 100 })),
				octoberPct: t.Optional(t.Number({ minimum: 0, maximum: 100 })),
				novemberPct: t.Optional(t.Number({ minimum: 0, maximum: 100 })),
				decemberPct: t.Optional(t.Number({ minimum: 0, maximum: 100 }))
			})
		}
	)

	// Delete a heating profile
	.delete(
		'/:id',
		async ({ params, set }) => deleteResponse(set, await deleteHeatingProfile(params.id)),
		{
			params: t.Object({
				id: t.String()
			})
		}
	);
