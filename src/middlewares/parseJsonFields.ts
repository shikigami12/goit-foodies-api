import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Middleware factory for parsing JSON string fields in multipart/form-data requests.
 *
 * When using multipart/form-data, arrays and objects must be sent as JSON strings.
 * This middleware parses specified fields from JSON strings back to objects/arrays.
 *
 * @param fields - Array of field names to parse as JSON
 * @returns Express middleware function
 *
 * @example
 * // In route definition
 * router.post('/',
 *   upload.single('thumb'),
 *   parseJsonFields(['ingredients']),
 *   validateBody(schema),
 *   controller
 * );
 */
const parseJsonFields = (fields: string[]): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction): void => {
        for (const field of fields) {
            if (req.body[field] && typeof req.body[field] === 'string') {
                try {
                    req.body[field] = JSON.parse(req.body[field]);
                } catch {
                    // Leave as string if parsing fails - validation will catch it
                }
            }
        }
        next();
    };
};

export default parseJsonFields;
