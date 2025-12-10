import { createHttpError } from './createHttpError';

/**
 * Pre-defined HTTP error factory functions for common status codes.
 * Provides convenient shortcuts for creating standard HTTP errors.
 *
 * @example
 * throw HttpErrors.NotFound('User not found');
 * throw HttpErrors.Unauthorized(); // Uses default message
 * throw HttpErrors.BadRequest('Invalid email format');
 */
export const HttpErrors = {
    /**
     * Creates a 400 Bad Request error
     * @param message - Error message (default: "Bad request")
     */
    BadRequest: (message = 'Bad request') => createHttpError(400, message),

    /**
     * Creates a 401 Unauthorized error
     * @param message - Error message (default: "Not authorized")
     */
    Unauthorized: (message = 'Not authorized') => createHttpError(401, message),

    /**
     * Creates a 403 Forbidden error
     * @param message - Error message (default: "Forbidden")
     */
    Forbidden: (message = 'Forbidden') => createHttpError(403, message),

    /**
     * Creates a 404 Not Found error
     * @param message - Error message (default: "Not found")
     */
    NotFound: (message = 'Not found') => createHttpError(404, message),

    /**
     * Creates a 409 Conflict error
     * @param message - Error message (default: "Conflict")
     */
    Conflict: (message = 'Conflict') => createHttpError(409, message),

    /**
     * Creates a 500 Internal Server Error
     * @param message - Error message (default: "Internal server error")
     */
    InternalServer: (message = 'Internal server error') => createHttpError(500, message),
};

export default HttpErrors;
