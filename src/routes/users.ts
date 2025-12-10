import { Router } from 'express';
import { usersController } from '../controllers';
import { auth, upload } from '../middlewares';
import { ctrlWrapper } from '../helpers';

const router = Router();

/**
 * @openapi
 * /api/users/current:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get current user
 *     description: Returns the currently authenticated user with aggregated statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user with stats
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserWithStatsResponse'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/current', auth, ctrlWrapper(usersController.getCurrentUser));

/**
 * @openapi
 * /api/users/following:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get current user's following list
 *     description: Returns list of users that the current user is following
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Following list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FollowingResponse'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/following', auth, ctrlWrapper(usersController.getFollowing));

/**
 * @openapi
 * /api/users/avatar:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update avatar
 *     description: Upload a new avatar image for the current user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Image file (JPEG, PNG, GIF, WebP, max 5MB)
 *     responses:
 *       200:
 *         description: Updated user with new avatar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: No file uploaded or invalid file type
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
router.patch('/avatar', auth, upload.single('avatar'), ctrlWrapper(usersController.updateAvatar));

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by ID
 *     description: Returns public info about another user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     responses:
 *       200:
 *         description: User public info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                   nullable: true
 *                 recipesCount:
 *                   type: integer
 *                 followersCount:
 *                   type: integer
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', auth, ctrlWrapper(usersController.getUserById));

/**
 * @openapi
 * /api/users/{id}/followers:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user's followers
 *     description: Returns list of users following the specified user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     responses:
 *       200:
 *         description: Followers list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FollowersResponse'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id/followers', auth, ctrlWrapper(usersController.getFollowers));

/**
 * @openapi
 * /api/users/{id}/follow:
 *   post:
 *     tags:
 *       - Users
 *     summary: Follow user
 *     description: Follow another user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID to follow
 *     responses:
 *       201:
 *         description: Successfully followed user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully followed user
 *       400:
 *         description: Cannot follow yourself
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
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Already following this user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/:id/follow', auth, ctrlWrapper(usersController.followUser));

/**
 * @openapi
 * /api/users/{id}/follow:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Unfollow user
 *     description: Unfollow a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID to unfollow
 *     responses:
 *       204:
 *         description: Successfully unfollowed user
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Not following this user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id/follow', auth, ctrlWrapper(usersController.unfollowUser));

export default router;
