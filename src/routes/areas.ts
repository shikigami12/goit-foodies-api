import { Router } from 'express';
import { areasController } from '../controllers';
import { ctrlWrapper } from '../helpers';

const router = Router();

/**
 * @openapi
 * /api/areas:
 *   get:
 *     tags:
 *       - Areas
 *     summary: Get all areas
 *     description: Returns a list of all cuisine areas/regions sorted alphabetically
 *     responses:
 *       200:
 *         description: List of areas
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
 *                     description: Area unique identifier
 *                     example: "550e8400-e29b-41d4-a716-446655440000"
 *                   name:
 *                     type: string
 *                     description: Area/region name
 *                     example: "Italian"
 */
router.get('/', ctrlWrapper(areasController.getAll));

export default router;
