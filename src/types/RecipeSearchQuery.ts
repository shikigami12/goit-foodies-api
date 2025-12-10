import { PaginationQuery } from './PaginationQuery';

/**
 * Recipe search query parameters
 * @openapi
 * components:
 *   parameters:
 *     CategoryFilter:
 *       name: category
 *       in: query
 *       description: Filter by category ID
 *       required: false
 *       schema:
 *         type: string
 *         format: uuid
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     IngredientFilter:
 *       name: ingredient
 *       in: query
 *       description: Filter by ingredient ID
 *       required: false
 *       schema:
 *         type: string
 *         format: uuid
 *         example: "550e8400-e29b-41d4-a716-446655440001"
 *     AreaFilter:
 *       name: area
 *       in: query
 *       description: Filter by area/region ID
 *       required: false
 *       schema:
 *         type: string
 *         format: uuid
 *         example: "550e8400-e29b-41d4-a716-446655440002"
 */
export interface RecipeSearchQuery extends PaginationQuery {
    /**
     * Filter by category ID (UUID)
     */
    category?: string;

    /**
     * Filter by ingredient ID (UUID)
     */
    ingredient?: string;

    /**
     * Filter by area/region ID (UUID)
     */
    area?: string;
}
