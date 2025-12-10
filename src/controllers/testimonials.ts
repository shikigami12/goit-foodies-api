import { Request, Response } from 'express';
import { Testimonial, User } from '../models';

/**
 * Get all testimonials with user info
 * @route GET /api/testimonials
 */
export const getAll = async (req: Request, res: Response): Promise<void> => {
    const testimonials = await Testimonial.findAll({
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'avatar'],
            },
        ],
        order: [['createdAt', 'DESC']],
    });

    res.json(testimonials);
};
