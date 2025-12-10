/**
 * Ingredient DTO for recipe creation
 * @openapi
 * components:
 *   schemas:
 *     RecipeIngredientDto:
 *       type: object
 *       required:
 *         - ingredientId
 *         - measure
 *       properties:
 *         ingredientId:
 *           type: string
 *           format: uuid
 *           description: ID of the ingredient
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         measure:
 *           type: string
 *           description: Measurement amount (e.g., "2 cups", "100g")
 *           example: "2 cups"
 */
export interface RecipeIngredientDto {
    /**
     * UUID of the ingredient
     */
    ingredientId: string;

    /**
     * Measurement amount (e.g., "2 cups", "100g", "1 tbsp")
     */
    measure: string;
}

/**
 * Recipe creation data transfer object
 * @openapi
 * components:
 *   schemas:
 *     CreateRecipeDto:
 *       type: object
 *       required:
 *         - title
 *         - categoryId
 *         - areaId
 *         - instructions
 *         - ingredients
 *       properties:
 *         title:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *           description: Recipe title
 *           example: "Pasta Carbonara"
 *         categoryId:
 *           type: string
 *           format: uuid
 *           description: ID of the recipe category
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         areaId:
 *           type: string
 *           format: uuid
 *           description: ID of the recipe origin area
 *           example: "550e8400-e29b-41d4-a716-446655440001"
 *         instructions:
 *           type: string
 *           minLength: 10
 *           description: Step-by-step cooking instructions
 *           example: "1. Boil pasta. 2. Fry bacon. 3. Mix eggs with cheese..."
 *         time:
 *           type: string
 *           description: Estimated cooking time
 *           example: "30 mins"
 *         ingredients:
 *           type: array
 *           minItems: 1
 *           description: List of ingredients with measurements
 *           items:
 *             $ref: '#/components/schemas/RecipeIngredientDto'
 */
export interface CreateRecipeDto {
    /**
     * Recipe title (3-100 characters)
     */
    title: string;

    /**
     * UUID of the category
     */
    categoryId: string;

    /**
     * UUID of the area/region
     */
    areaId: string;

    /**
     * Step-by-step cooking instructions
     */
    instructions: string;

    /**
     * Estimated cooking time (e.g., "30 mins")
     */
    time?: string;

    /**
     * List of ingredients with measurements
     */
    ingredients: RecipeIngredientDto[];
}
