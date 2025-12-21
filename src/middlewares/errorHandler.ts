import { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';
import { HttpError } from '../helpers';

/**
 * Error response structure
 */
interface ErrorResponse {
    message: string;
}

/**
 * Maximum file size in MB (must match upload.ts config)
 */
const MAX_FILE_SIZE_MB = 5;

/**
 * Global error handler middleware.
 * Catches all errors and returns formatted JSON responses.
 *
 * Handles the following error types:
 * - HttpError (custom API errors)
 * - PrismaClientKnownRequestError (database errors)
 * - PrismaClientValidationError (validation errors)
 * - JsonWebTokenError (invalid JWT)
 * - TokenExpiredError (expired JWT)
 * - Generic errors (fallback to 500)
 *
 * @param err - Error object
 * @param req - Express request
 * @param res - Express response
 * @param _next - Express next function (unused but required)
 *
 * @example
 * // In app.ts
 * app.use(errorHandler);
 *
 * @openapi
 * components:
 *   responses:
 *     BadRequest:
 *       description: Invalid request data
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     Unauthorized:
 *       description: Authentication required or failed
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     Forbidden:
 *       description: Access denied
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     NotFound:
 *       description: Resource not found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     Conflict:
 *       description: Resource conflict (e.g., duplicate email)
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     InternalServerError:
 *       description: Internal server error
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 */
const errorHandler = (
    err: Error | HttpError,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    // Handle custom HttpError
    if (err instanceof HttpError) {
        res.status(err.status).json({ message: err.message });
        return;
    }

    // Handle Multer errors (file upload)
    if (err instanceof MulterError) {
        let message = 'File upload error';

        switch (err.code) {
            case 'LIMIT_FILE_SIZE':
                message = `File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB`;
                break;
            case 'LIMIT_FILE_COUNT':
                message = 'Too many files uploaded';
                break;
            case 'LIMIT_UNEXPECTED_FILE':
                message = 'Unexpected file field';
                break;
            case 'LIMIT_PART_COUNT':
                message = 'Too many parts in multipart request';
                break;
            case 'LIMIT_FIELD_KEY':
                message = 'Field name too long';
                break;
            case 'LIMIT_FIELD_VALUE':
                message = 'Field value too long';
                break;
            case 'LIMIT_FIELD_COUNT':
                message = 'Too many fields';
                break;
            default:
                message = err.message || 'File upload error';
        }

        res.status(400).json({ message });
        return;
    }

    // Handle Prisma errors
    if (err.name === 'PrismaClientKnownRequestError') {
        res.status(400).json({ message: 'Database operation failed' });
        return;
    }

    if (err.name === 'PrismaClientValidationError') {
        res.status(400).json({ message: 'Invalid data provided' });
        return;
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        res.status(401).json({ message: 'Invalid token' });
        return;
    }

    if (err.name === 'TokenExpiredError') {
        res.status(401).json({ message: 'Token expired' });
        return;
    }

    // Log unexpected errors
    console.error('Unexpected error:', err);

    // Generic error response
    const response: ErrorResponse = {
        message: err.message || 'Internal server error',
    };

    res.status(500).json(response);
};

export default errorHandler;
