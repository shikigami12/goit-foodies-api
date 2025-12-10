import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Schema } from 'joi';
import { createHttpError } from '../helpers';

/**
 * Middleware factory for validating request body against a Joi schema.
 *
 * Features:
 * - Returns all validation errors (not just the first)
 * - Strips unknown fields from the request body
 * - Returns 400 Bad Request for invalid data
 *
 * @param schema - Joi validation schema
 * @returns Express middleware function
 *
 * @example
 * // Define schema
 * const registerSchema = Joi.object({
 *   name: Joi.string().min(2).max(50).required(),
 *   email: Joi.string().email().required(),
 *   password: Joi.string().min(6).required(),
 * });
 *
 * // Use in route
 * router.post('/register', validateBody(registerSchema), authController.register);
 */
const validateBody = (schema: Schema): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req.body, {
            abortEarly: false, // Return all errors, not just the first one
            stripUnknown: true, // Remove unknown fields from req.body
        });

        if (error) {
            const errorMessage = error.details
                .map((detail) => detail.message)
                .join(', ');

            next(createHttpError(400, errorMessage));
            return;
        }

        next();
    };
};

export default validateBody;
