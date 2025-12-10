/**
 * Generic paginated response wrapper
 * @openapi
 * components:
 *   schemas:
 *     PaginatedResponse:
 *       type: object
 *       required:
 *         - data
 *         - total
 *         - page
 *         - limit
 *         - totalPages
 *       properties:
 *         data:
 *           type: array
 *           description: Array of items for the current page
 *           items: {}
 *         total:
 *           type: integer
 *           description: Total number of items across all pages
 *           example: 150
 *         page:
 *           type: integer
 *           description: Current page number (1-indexed)
 *           example: 1
 *         limit:
 *           type: integer
 *           description: Number of items per page
 *           example: 10
 *         totalPages:
 *           type: integer
 *           description: Total number of pages
 *           example: 15
 *     ErrorResponse:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *           example: "Not found"
 */
export interface PaginatedResponse<T> {
    /**
     * Array of items for the current page
     */
    data: T[];

    /**
     * Total number of items across all pages
     */
    total: number;

    /**
     * Current page number (1-indexed)
     */
    page: number;

    /**
     * Number of items per page
     */
    limit: number;

    /**
     * Total number of pages
     */
    totalPages: number;
}
