/**
 * Follower item in list response
 * @openapi
 * components:
 *   schemas:
 *     FollowerItem:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: User's unique identifier
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         name:
 *           type: string
 *           description: User's display name
 *           example: "Jane Doe"
 *         avatar:
 *           type: string
 *           format: uri
 *           nullable: true
 *           description: URL to user's avatar image
 *           example: "https://res.cloudinary.com/demo/image/upload/avatar.jpg"
 */
export interface FollowerItem {
    id: string;
    name: string;
    avatar: string | null;
}

/**
 * Followers list response
 * @openapi
 * components:
 *   schemas:
 *     FollowersResponse:
 *       type: object
 *       required:
 *         - followers
 *         - total
 *       properties:
 *         followers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FollowerItem'
 *           description: List of followers
 *         total:
 *           type: integer
 *           description: Total number of followers
 *           example: 100
 */
export interface FollowersResponse {
    followers: FollowerItem[];
    total: number;
}

/**
 * Following list response
 * @openapi
 * components:
 *   schemas:
 *     FollowingResponse:
 *       type: object
 *       required:
 *         - following
 *         - total
 *       properties:
 *         following:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FollowerItem'
 *           description: List of users being followed
 *         total:
 *           type: integer
 *           description: Total number of users being followed
 *           example: 25
 */
export interface FollowingResponse {
    following: FollowerItem[];
    total: number;
}

/**
 * Follower model with included follower user details
 * Used for type-safe access to Sequelize includes
 */
export interface FollowerWithFollowerUser {
    followerUser: FollowerItem;
}

/**
 * Follower model with included followed user details
 * Used for type-safe access to Sequelize includes
 */
export interface FollowerWithFollowedUser {
    followedUser: FollowerItem;
}
