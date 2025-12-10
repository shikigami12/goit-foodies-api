import HttpError from './HttpError';

/**
 * Factory function to create HttpError instances.
 * Provides a cleaner API for creating HTTP errors.
 *
 * @param status - HTTP status code
 * @param message - Error message
 * @returns New HttpError instance
 *
 * @example
 * throw createHttpError(404, 'User not found');
 * throw createHttpError(401, 'Not authorized');
 */
export const createHttpError = (status: number, message: string): HttpError => {
    return new HttpError({ status, message });
};

export default createHttpError;
