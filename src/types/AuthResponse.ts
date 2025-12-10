import { UserResponse } from './UserResponse';

/**
 * Authentication response with user data and JWT token
 * @openapi
 * components:
 *   schemas:
 *     AuthResponse:
 *       type: object
 *       required:
 *         - user
 *         - token
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/UserResponse'
 *         token:
 *           type: string
 *           description: JWT authentication token
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */
export interface AuthResponse {
    /**
     * Authenticated user data (without sensitive fields)
     */
    user: UserResponse;

    /**
     * JWT token for subsequent authenticated requests
     */
    token: string;
}
