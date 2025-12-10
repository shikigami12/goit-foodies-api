import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { HttpErrors } from '../helpers';
import { AuthenticatedRequest } from '../types';

/**
 * JWT payload structure
 */
interface JwtPayload {
    id: string;
}

/**
 * Authentication middleware.
 * Verifies JWT token from Authorization header and attaches user to request.
 *
 * @example
 * // Protected route
 * router.get('/profile', auth, userController.getProfile);
 *
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: JWT token obtained from login/register
 */
const auth = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(' ');

    if (bearer !== 'Bearer' || !token) {
        next(HttpErrors.Unauthorized('Not authorized'));
        return;
    }

    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined');
        }

        const { id } = jwt.verify(token, jwtSecret) as JwtPayload;
        const user = await User.findByPk(id);

        if (!user || user.token !== token) {
            next(HttpErrors.Unauthorized('Not authorized'));
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        next(HttpErrors.Unauthorized('Not authorized'));
    }
};

export default auth;
