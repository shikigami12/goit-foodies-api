import { HttpErrorOptions } from '../types/HttpErrorOptions';

/**
 * Custom HTTP Error class for API error handling.
 * Extends the native Error class with an HTTP status code.
 *
 * @class HttpError
 * @extends Error
 *
 * @example
 * throw new HttpError({ status: 404, message: 'User not found' });
 *
 * @openapi
 * components:
 *   schemas:
 *     HttpError:
 *       type: object
 *       required:
 *         - status
 *         - message
 *       properties:
 *         status:
 *           type: integer
 *           description: HTTP status code
 *           example: 404
 *         message:
 *           type: string
 *           description: Error message
 *           example: "Not found"
 *         name:
 *           type: string
 *           description: Error name
 *           example: "HttpError"
 */
class HttpError extends Error {
    /**
     * HTTP status code (e.g., 400, 401, 404, 500)
     */
    status: number;

    /**
     * Creates a new HttpError instance
     * @param options - Error options containing status and message
     */
    constructor({ status, message }: HttpErrorOptions) {
        super(message);
        this.status = status;
        this.name = 'HttpError';
    }
}

export default HttpError;
