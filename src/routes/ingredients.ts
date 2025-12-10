import { Router } from 'express';
import { ingredientsController } from '../controllers';
import { ctrlWrapper } from '../helpers';

const router = Router();

/**
 * @openapi
 * /api/ingredients:
 *   get:
 *     tags:
 *       - Ingredients
 *     summary: Get all ingredients
 *     description: Returns a list of all ingredients sorted alphabetically
 *     responses:
 *       200:
 *         description: List of ingredients
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
 *                     description: Ingredient unique identifier
 *                     example: "550e8400-e29b-41d4-a716-446655440000"
 *                   name:
 *                     type: string
 *                     description: Ingredient name
 *                     example: "Chicken"
 *                   description:
 *                     type: string
 *                     nullable: true
 *                     description: Ingredient description
 *                     example: "A versatile poultry meat"
 *                   img:
 *                     type: string
 *                     format: uri
 *                     nullable: true
 *                     description: Ingredient image URL
 *                     example: "https://res.cloudinary.com/demo/image/upload/chicken.jpg"
 */
router.get('/', ctrlWrapper(ingredientsController.getAll));

export default router;
