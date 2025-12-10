import { Router } from 'express';
import { testimonialsController } from '../controllers';
import { ctrlWrapper } from '../helpers';

const router = Router();

/**
 * @openapi
 * /api/testimonials:
 *   get:
 *     tags:
 *       - Testimonials
 *     summary: Get all testimonials
 *     description: Returns a list of all testimonials with user info, sorted by newest first
 *     responses:
 *       200:
 *         description: List of testimonials
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TestimonialResponse'
 */
router.get('/', ctrlWrapper(testimonialsController.getAll));

export default router;
