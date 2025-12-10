/**
 * HTTP Error constructor options
 * @openapi
 * components:
 *   schemas:
 *     HttpErrorOptions:
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
 */
export interface HttpErrorOptions {
    /**
     * HTTP status code (e.g., 400, 401, 404, 500)
     */
    status: number;

    /**
     * Human-readable error message
     */
    message: string;
}
