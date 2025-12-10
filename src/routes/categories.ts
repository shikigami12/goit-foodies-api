import { Router } from 'express';
import { categoriesController } from '../controllers';
import { ctrlWrapper } from '../helpers';

const router = Router();

/**
 * @openapi
 * /api/categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get all categories
 *     description: Returns a list of all recipe categories sorted alphabetically
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     description: Category unique identifier
 *                     example: "550e8400-e29b-41d4-a716-446655440000"
 *                   name:
 *                     type: string
 *                     description: Category name
 *                     example: "Breakfast"
 *                   thumb:
 *                     type: string
 *                     format: uri
 *                     nullable: true
 *                     description: Category thumbnail image URL
 *                     example: "https://res.cloudinary.com/demo/image/upload/breakfast.jpg"
 */
router.get('/', ctrlWrapper(categoriesController.getAll));

export default router;
