import { Request, Response } from 'express';
import { Op } from 'sequelize';
import {
    Recipe,
    RecipeIngredient,
    Favorite,
    User,
    Category,
    Area,
    Ingredient,
} from '../models';
import sequelize from '../db/sequelize';
import { HttpErrors } from '../helpers';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary';
import { AuthenticatedRequest, CreateRecipeDto } from '../types';

/**
 * Common includes for recipe queries
 */
const recipeListIncludes = [
    { model: Category, as: 'category' },
    { model: Area, as: 'area' },
    { model: User, as: 'owner', attributes: ['id', 'name', 'avatar'] },
];

const recipeDetailIncludes = [
    ...recipeListIncludes,
    {
        model: RecipeIngredient,
        as: 'ingredients',
        include: [{ model: Ingredient, as: 'ingredient' }],
    },
];

/**
 * Search recipes with filters and pagination
 * @route GET /api/recipes
 */
export const searchRecipes = async (req: Request, res: Response): Promise<void> => {
    const { category, ingredient, area } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    const offset = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (category) {
        where.categoryId = category;
    }

    if (area) {
        where.areaId = area;
    }

    // Filter by ingredient requires a subquery
    if (ingredient) {
        const recipeIds = await RecipeIngredient.findAll({
            where: { ingredientId: ingredient as string },
            attributes: ['recipeId'],
        });
        where.id = { [Op.in]: recipeIds.map((ri) => ri.recipeId) };
    }

    const { rows: recipes, count: total } = await Recipe.findAndCountAll({
        where,
        include: recipeListIncludes,
        limit,
        offset,
        order: [['created_at', 'DESC']],
        distinct: true,
    });

    res.json({
        recipes,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    });
};

/**
 * Get popular recipes by favorites count
 * @route GET /api/recipes/popular
 */
export const getPopularRecipes = async (req: Request, res: Response): Promise<void> => {
    const recipes = await Recipe.findAll({
        include: recipeListIncludes,
        attributes: {
            include: [
                [
                    sequelize.literal(
                        '(SELECT COUNT(*) FROM favorites WHERE favorites.recipe_id = "Recipe".id)'
                    ),
                    'favoritesCount',
                ],
            ],
        },
        order: [[sequelize.literal('"favoritesCount"'), 'DESC']],
        limit: 10,
    });

    res.json(recipes);
};

/**
 * Get recipe by ID with full details
 * @route GET /api/recipes/:id
 */
export const getRecipeById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const recipe = await Recipe.findByPk(id, {
        include: recipeDetailIncludes,
    });

    if (!recipe) {
        throw HttpErrors.NotFound('Recipe not found');
    }

    res.json(recipe);
};

/**
 * Create new recipe
 * @route POST /api/recipes
 */
export const createRecipe = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
        throw HttpErrors.Unauthorized('Not authorized');
    }

    const { title, categoryId, areaId, instructions, time, ingredients } =
        req.body as CreateRecipeDto;

    // Upload thumbnail if provided
    let thumbUrl: string | null = null;
    if (req.file) {
        thumbUrl = await uploadToCloudinary(req.file.buffer, 'recipes');
    }

    // Create recipe with ingredients in a transaction
    const recipe = await sequelize.transaction(async (t) => {
        const newRecipe = await Recipe.create(
            {
                title,
                instructions,
                thumb: thumbUrl,
                time: time || null,
                ownerId: userId,
                categoryId,
                areaId,
            },
            { transaction: t }
        );

        await RecipeIngredient.bulkCreate(
            ingredients.map((ing) => ({
                recipeId: newRecipe.id,
                ingredientId: ing.ingredientId,
                measure: ing.measure,
            })),
            { transaction: t }
        );

        return newRecipe;
    });

    // Fetch the complete recipe with associations
    const fullRecipe = await Recipe.findByPk(recipe.id, {
        include: recipeDetailIncludes,
    });

    res.status(201).json(fullRecipe);
};

/**
 * Delete own recipe
 * @route DELETE /api/recipes/:id
 */
export const deleteRecipe = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
        throw HttpErrors.Unauthorized('Not authorized');
    }

    const recipe = await Recipe.findByPk(id);

    if (!recipe) {
        throw HttpErrors.NotFound('Recipe not found');
    }

    if (recipe.ownerId !== userId) {
        throw HttpErrors.Forbidden('You can only delete your own recipes');
    }

    // Delete thumbnail from Cloudinary if exists
    if (recipe.thumb) {
        await deleteFromCloudinary(recipe.thumb);
    }

    // Delete recipe (cascades to ingredients and favorites)
    await recipe.destroy();

    res.status(204).send();
};

/**
 * Get user's own recipes
 * @route GET /api/recipes/own
 */
export const getOwnRecipes = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
        throw HttpErrors.Unauthorized('Not authorized');
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    const offset = (page - 1) * limit;

    const { rows: recipes, count: total } = await Recipe.findAndCountAll({
        where: { ownerId: userId },
        include: recipeListIncludes,
        limit,
        offset,
        order: [['created_at', 'DESC']],
        distinct: true,
    });

    res.json({
        recipes,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    });
};

/**
 * Add recipe to favorites
 * @route POST /api/recipes/:id/favorite
 */
export const addFavorite = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const userId = req.user?.id;
    const recipeId = req.params.id;

    if (!userId) {
        throw HttpErrors.Unauthorized('Not authorized');
    }

    // Check if recipe exists
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) {
        throw HttpErrors.NotFound('Recipe not found');
    }

    // Check if already in favorites
    const existingFavorite = await Favorite.findOne({
        where: { userId, recipeId },
    });

    if (existingFavorite) {
        throw HttpErrors.Conflict('Recipe already in favorites');
    }

    await Favorite.create({ userId, recipeId });

    res.status(201).json({ message: 'Recipe added to favorites' });
};

/**
 * Remove recipe from favorites
 * @route DELETE /api/recipes/:id/favorite
 */
export const removeFavorite = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const userId = req.user?.id;
    const recipeId = req.params.id;

    if (!userId) {
        throw HttpErrors.Unauthorized('Not authorized');
    }

    const deleted = await Favorite.destroy({
        where: { userId, recipeId },
    });

    if (deleted === 0) {
        throw HttpErrors.NotFound('Recipe not in favorites');
    }

    res.status(204).send();
};

/**
 * Get user's favorite recipes
 * @route GET /api/recipes/favorites
 */
export const getFavorites = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
        throw HttpErrors.Unauthorized('Not authorized');
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    const offset = (page - 1) * limit;

    // Get favorite recipe IDs
    const { rows: favorites, count: total } = await Favorite.findAndCountAll({
        where: { userId },
        attributes: ['recipeId'],
        limit,
        offset,
        order: [['created_at', 'DESC']],
    });

    const recipeIds = favorites.map((f) => f.recipeId);

    // Fetch recipes with full details
    const recipes = await Recipe.findAll({
        where: { id: { [Op.in]: recipeIds } },
        include: recipeListIncludes,
    });

    // Maintain order from favorites
    const orderedRecipes = recipeIds.map((id) =>
        recipes.find((r) => r.id === id)
    ).filter(Boolean);

    res.json({
        recipes: orderedRecipes,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    });
};
