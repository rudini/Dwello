/**
 * Category Routes
 * CRUD endpoints for utility cost category management
 */

import { Elysia, t } from 'elysia';
import { codedBody, errorBody, refusal } from '../services/coded-error';
import { authMiddleware } from '../middleware/auth';
import {
	listCategories,
	getCategory,
	getAllowedCategories,
	createCategory,
	updateCategory,
	deleteCategory
} from '../services/category.service';
import { Conflict } from '../services/conflict';
import { proposeAllocability } from '../services/llm.service';
import { deleteResponse } from './delete-response';

// Validation schemas
const categoryQuerySchema = t.Object({
	search: t.Optional(t.String()),
	isAllowedUtilityCost: t.Optional(t.String()), // 'true' or 'false'
	limit: t.Optional(t.String()),
	offset: t.Optional(t.String())
});

const categoryBodySchema = t.Object({
	name: t.String({ minLength: 1, maxLength: 100 }),
	nameDE: t.Optional(t.Nullable(t.String())),
	nameFR: t.Optional(t.Nullable(t.String())),
	nameIT: t.Optional(t.Nullable(t.String())),
	nameEN: t.Optional(t.Nullable(t.String())),
	isAllowedUtilityCost: t.Boolean(),
	isHeatingCost: t.Optional(t.Boolean()),
	isFuel: t.Optional(t.Boolean()),
	description: t.Optional(t.Nullable(t.String())),
	sortOrder: t.Optional(t.Number())
});

const categoryUpdateSchema = t.Partial(categoryBodySchema);

export const categoryRoutes = new Elysia({ prefix: '/api/v1/categories' })
	.use(authMiddleware)
	// List categories with pagination and filters
	.get(
		'/',
		async ({ query }) => {
			const filters = {
				search: query.search,
				isAllowedUtilityCost:
					query.isAllowedUtilityCost !== undefined
						? query.isAllowedUtilityCost === 'true'
						: undefined,
				limit: query.limit ? parseInt(query.limit, 10) : undefined,
				offset: query.offset ? parseInt(query.offset, 10) : undefined
			};
			return await listCategories(filters);
		},
		{
			query: categoryQuerySchema
		}
	)
	// Get allowed utility cost categories only
	.get('/allowed', async () => {
		return await getAllowedCategories();
	})
	// The KI's proposal whether a new category is umlagefähig; without a sure answer the user chooses alone
	.post(
		'/propose',
		async ({ body, set }) => {
			try {
				return await proposeAllocability(body);
			} catch (error) {
				set.status = 503;
				return codedBody(error, 'KI_PROPOSAL_UNAVAILABLE', 'Die KI ist nicht erreichbar.');
			}
		},
		{
			body: t.Object({
				name: t.String({ minLength: 1, maxLength: 100 }),
				description: t.Optional(t.Nullable(t.String())),
				language: t.Optional(t.UnionEnum(['de', 'fr', 'it', 'en']))
			})
		}
	)
	// Get single category
	.get('/:id', async ({ params, set }) => {
		const category = await getCategory(params.id);
		if (!category) {
			set.status = 404;
			return refusal('CATEGORY_NOT_FOUND', 'Category not found');
		}
		return category;
	})
	// Create category
	.post(
		'/',
		async ({ body, set }) => {
			try {
				const category = await createCategory(body);
				set.status = 201;
				return category;
			} catch (error) {
				set.status = error instanceof Conflict ? 409 : 400;
				return errorBody(error, 'Failed to create category');
			}
		},
		{
			body: categoryBodySchema
		}
	)
	// Update category
	.put(
		'/:id',
		async ({ params, body, set }) => {
			try {
				const category = await updateCategory(params.id, body);
				if (!category) {
					set.status = 404;
					return refusal('CATEGORY_NOT_FOUND', 'Category not found');
				}
				return category;
			} catch (error) {
				set.status = error instanceof Conflict ? 409 : 400;
				return errorBody(error, 'Failed to update category');
			}
		},
		{
			body: categoryUpdateSchema
		}
	)
	// Delete category
	.delete('/:id', async ({ params, set }) => deleteResponse(set, await deleteCategory(params.id)));
