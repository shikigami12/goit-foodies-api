/**
 * User info included in testimonial response
 */
export interface TestimonialUser {
    id: string;
    name: string;
    avatar: string | null;
}

/**
 * Testimonial response with user info
 * @openapi
 * components:
 *   schemas:
 *     TestimonialResponse:
 *       type: object
 *       required:
 *         - id
 *         - testimonial
 *         - createdAt
 *         - user
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Testimonial unique identifier
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         testimonial:
 *           type: string
 *           description: Testimonial text content
 *           example: "Amazing recipes! This app changed my cooking game."
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the testimonial was created
 *           example: "2024-01-15T10:30:00.000Z"
 *         user:
 *           type: object
 *           required:
 *             - id
 *             - name
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               description: User's unique identifier
 *               example: "550e8400-e29b-41d4-a716-446655440001"
 *             name:
 *               type: string
 *               description: User's display name
 *               example: "Jane Doe"
 *             avatar:
 *               type: string
 *               format: uri
 *               nullable: true
 *               description: User's avatar URL
 *               example: "https://res.cloudinary.com/demo/image/upload/avatar.jpg"
 */
export interface TestimonialResponse {
    id: string;
    testimonial: string;
    createdAt: Date;
    user: TestimonialUser;
}
