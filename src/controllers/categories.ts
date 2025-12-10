import { Request, Response } from 'express';
import { Category } from '../models';

/**
 * Get all categories
 * @route GET /api/categories
 */
export const getAll = async (req: Request, res: Response): Promise<void> => {
    const categories = await Category.findAll({
        order: [['name', 'ASC']],
    });

    res.json(categories);
};
