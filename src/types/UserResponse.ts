/**
 * User response DTO (without sensitive data like password)
 * @openapi
 * components:
 *   schemas:
 *     UserResponse:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
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
 */
export interface UserResponse {
    /**
     * Unique user identifier (UUID)
     */
    id: string;

    /**
     * User's display name
     */
    name: string;

    /**
     * User's email address
     */
    email: string;

    /**
     * URL to user's avatar image (null if not set)
     */
    avatar: string | null;
}
