/**
 * User response with aggregated statistics
 * @openapi
 * components:
 *   schemas:
 *     UserWithStatsResponse:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *         - recipesCount
 *         - favoritesCount
 *         - followersCount
 *         - followingCount
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique user identifier
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         name:
 *           type: string
 *           description: User's display name
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: "john.doe@example.com"
 *         avatar:
 *           type: string
 *           format: uri
 *           nullable: true
 *           description: URL to user's avatar image
 *           example: "https://res.cloudinary.com/demo/image/upload/avatar.jpg"
 *         recipesCount:
 *           type: integer
 *           description: Number of recipes created by user
 *           example: 5
 *         favoritesCount:
 *           type: integer
 *           description: Number of recipes in user's favorites
 *           example: 12
 *         followersCount:
 *           type: integer
 *           description: Number of users following this user
 *           example: 100
 *         followingCount:
 *           type: integer
 *           description: Number of users this user is following
 *           example: 25
 */
export interface UserWithStatsResponse {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  recipesCount: number;
  favoritesCount: number;
  followersCount: number;
  followingCount: number;
}
