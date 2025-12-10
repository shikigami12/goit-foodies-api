import { Request, Response } from 'express';
import { Ingredient } from '../models';

/**
 * Get all ingredients
 * @route GET /api/ingredients
 */
export const getAll = async (req: Request, res: Response): Promise<void> => {
    const ingredients = await Ingredient.findAll({
        order: [['name', 'ASC']],
    });

    res.json(ingredients);
};
