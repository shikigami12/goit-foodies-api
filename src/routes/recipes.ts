import { Router } from 'express';
import { recipesController } from '../controllers';
import { auth, upload, validateBody } from '../middlewares';
import { ctrlWrapper } from '../helpers';
import { createRecipeSchema } from '../schemas';

const router = Router();

/**
 * @openapi
 * /api/recipes/popular:
 *   get:
 *     tags:
 *       - Recipes
 *     summary: Get popular recipes
 *     description: Returns top 10 recipes sorted by favorites count
 *     responses:
 *       200:
 *         description: List of popular recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RecipeListItem'
 */
router.get('/popular', ctrlWrapper(recipesController.getPopularRecipes));

/**
 * @openapi
 * /api/recipes/own:
 *   get:
 *     tags:
 *       - Recipes
 *     summary: Get user's own recipes
 *     description: Returns recipes created by the current user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         description: User's recipes with pagination
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedRecipes'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/own', auth, ctrlWrapper(recipesController.getOwnRecipes));

/**
 * @openapi
 * /api/recipes/favorites:
 *   get:
 *     tags:
 *       - Recipes
 *     summary: Get favorite recipes
 *     description: Returns recipes in user's favorites list
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         description: Favorite recipes with pagination
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedRecipes'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/favorites', auth, ctrlWrapper(recipesController.getFavorites));

/**
 * @openapi
 * /api/recipes:
 *   get:
 *     tags:
 *       - Recipes
 *     summary: Search recipes
 *     description: Search recipes with optional filters and pagination
 *     parameters:
 *       - name: category
 *         in: query
 *         description: Filter by category ID
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: area
 *         in: query
 *         description: Filter by area ID
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: ingredient
 *         in: query
 *         description: Filter by ingredient ID
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         description: Recipes matching filters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedRecipes'
 */
router.get('/', ctrlWrapper(recipesController.searchRecipes));

/**
 * @openapi
 * /api/recipes:
 *   post:
 *     tags:
 *       - Recipes
 *     summary: Create new recipe
 *     description: Create a new recipe with optional thumbnail image
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - categoryId
 *               - areaId
 *               - instructions
 *               - ingredients
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 description: Recipe title
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *                 description: Category ID
 *               areaId:
 *                 type: string
 *                 format: uuid
 *                 description: Area ID
 *               instructions:
 *                 type: string
 *                 minLength: 10
 *                 description: Cooking instructions
 *               time:
 *                 type: string
 *                 description: Cooking time (e.g., "30 mins")
 *               ingredients:
 *                 type: string
 *                 description: JSON array of ingredients
 *               thumb:
 *                 type: string
 *                 format: binary
 *                 description: Recipe thumbnail image
 *     responses:
 *       201:
 *         description: Recipe created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecipeDetail'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
    '/',
    auth,
    upload.single('thumb'),
    validateBody(createRecipeSchema),
    ctrlWrapper(recipesController.createRecipe)
);

/**
 * @openapi
 * /api/recipes/{id}:
 *   get:
 *     tags:
 *       - Recipes
 *     summary: Get recipe by ID
 *     description: Returns detailed recipe information including ingredients
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Recipe details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecipeDetail'
 *       404:
 *         description: Recipe not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', ctrlWrapper(recipesController.getRecipeById));

/**
 * @openapi
 * /api/recipes/{id}:
 *   delete:
 *     tags:
 *       - Recipes
 *     summary: Delete recipe
 *     description: Delete own recipe
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Recipe ID
 *     responses:
 *       204:
 *         description: Recipe deleted successfully
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - not owner of recipe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Recipe not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', auth, ctrlWrapper(recipesController.deleteRecipe));

/**
 * @openapi
 * /api/recipes/{id}/favorite:
 *   post:
 *     tags:
 *       - Recipes
 *     summary: Add to favorites
 *     description: Add recipe to user's favorites
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Recipe ID
 *     responses:
 *       201:
 *         description: Recipe added to favorites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Recipe added to favorites"
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Recipe not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Recipe already in favorites
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/:id/favorite', auth, ctrlWrapper(recipesController.addFavorite));

/**
 * @openapi
 * /api/recipes/{id}/favorite:
 *   delete:
 *     tags:
 *       - Recipes
 *     summary: Remove from favorites
 *     description: Remove recipe from user's favorites
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Recipe ID
 *     responses:
 *       204:
 *         description: Recipe removed from favorites
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Recipe not in favorites
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id/favorite', auth, ctrlWrapper(recipesController.removeFavorite));

export default router;

/**
 * @openapi
 * components:
 *   parameters:
 *     PageParam:
 *       name: page
 *       in: query
 *       description: Page number (1-indexed)
 *       required: false
 *       schema:
 *         type: integer
 *         minimum: 1
 *         default: 1
 *     LimitParam:
 *       name: limit
 *       in: query
 *       description: Items per page (max 100)
 *       required: false
 *       schema:
 *         type: integer
 *         minimum: 1
 *         maximum: 100
 *         default: 10
 *   schemas:
 *     RecipeListItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         thumb:
 *           type: string
 *           nullable: true
 *         time:
 *           type: string
 *           nullable: true
 *         category:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             name:
 *               type: string
 *         area:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             name:
 *               type: string
 *         owner:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             name:
 *               type: string
 *             avatar:
 *               type: string
 *               nullable: true
 *     RecipeDetail:
 *       allOf:
 *         - $ref: '#/components/schemas/RecipeListItem'
 *         - type: object
 *           properties:
 *             instructions:
 *               type: string
 *             ingredients:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   measure:
 *                     type: string
 *                   ingredient:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       name:
 *                         type: string
 *                       img:
 *                         type: string
 *                         nullable: true
 *     PaginatedRecipes:
 *       type: object
 *       properties:
 *         recipes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RecipeListItem'
 *         total:
 *           type: integer
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         totalPages:
 *           type: integer
 */
