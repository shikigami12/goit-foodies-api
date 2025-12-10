import { Request, Response } from 'express';
import { Area } from '../models';

/**
 * Get all areas
 * @route GET /api/areas
 */
export const getAll = async (req: Request, res: Response): Promise<void> => {
    const areas = await Area.findAll({
        order: [['name', 'ASC']],
    });

    res.json(areas);
};
