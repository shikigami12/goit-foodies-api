import { Request } from 'express';
import { User } from '../models';

/**
 * Extended Express Request with authenticated user
 * @openapi
 * components:
 *   schemas:
 *     AuthenticatedRequest:
 *       description: Express Request object extended with authenticated user data
 */
export interface AuthenticatedRequest extends Request {
    /**
     * The authenticated user attached by auth middleware
     */
    user?: User;
}
