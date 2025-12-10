/**
 * Pagination query parameters
 * @openapi
 * components:
 *   parameters:
 *     PageParam:
 *       name: page
 *       in: query
 *       description: Page number (1-indexed)
 *       required: false
 *       schema:
 *         type: integer
 *         minimum: 1
 *         default: 1
 *         example: 1
 *     LimitParam:
 *       name: limit
 *       in: query
 *       description: Number of items per page
 *       required: false
 *       schema:
 *         type: integer
 *         minimum: 1
 *         maximum: 100
 *         default: 10
 *         example: 10
 */
export interface PaginationQuery {
    /**
     * Page number (1-indexed)
     * @default "1"
     */
    page?: string;

    /**
     * Number of items per page
     * @default "10"
     */
    limit?: string;
}
