import Joi from 'joi';

/**
 * Recipe creation validation schema
 * @openapi
 * components:
 *   schemas:
 *     CreateRecipeRequest:
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
 *             type: object
 *             required:
 *               - ingredientId
 *               - measure
 *             properties:
 *               ingredientId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the ingredient
 *               measure:
 *                 type: string
 *                 description: Measurement amount
 *                 example: "2 cups"
 */
export const createRecipeSchema = Joi.object({
    title: Joi.string().min(3).max(100).required().messages({
        'string.min': 'Title must be at least 3 characters',
        'string.max': 'Title must be at most 100 characters',
        'any.required': 'Title is required',
    }),
    categoryId: Joi.string().uuid().required().messages({
        'string.guid': 'Category ID must be a valid UUID',
        'any.required': 'Category ID is required',
    }),
    areaId: Joi.string().uuid().required().messages({
        'string.guid': 'Area ID must be a valid UUID',
        'any.required': 'Area ID is required',
    }),
    instructions: Joi.string().min(10).required().messages({
        'string.min': 'Instructions must be at least 10 characters',
        'any.required': 'Instructions are required',
    }),
    time: Joi.string().optional().messages({
        'string.base': 'Time must be a string',
    }),
    ingredients: Joi.array()
        .items(
            Joi.object({
                ingredientId: Joi.string().uuid().required().messages({
                    'string.guid': 'Ingredient ID must be a valid UUID',
                    'any.required': 'Ingredient ID is required',
                }),
                measure: Joi.string().required().messages({
                    'any.required': 'Measure is required',
                }),
            })
        )
        .min(1)
        .required()
        .messages({
            'array.min': 'At least one ingredient is required',
            'any.required': 'Ingredients are required',
        }),
});
