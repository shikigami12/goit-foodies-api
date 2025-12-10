import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { createHttpError } from '../helpers';

/**
 * Allowed MIME types for image uploads
 */
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

/**
 * Maximum file size in bytes (5MB)
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Multer memory storage configuration.
 * Files are stored in memory as Buffer objects for direct upload to Cloudinary.
 */
const storage = multer.memoryStorage();

/**
 * File filter to accept only valid image types.
 *
 * @param req - Express request
 * @param file - Uploaded file
 * @param callback - Multer callback
 */
const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
): void => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(
            createHttpError(
                400,
                `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`
            )
        );
    }
};

/**
 * Multer middleware configured for image uploads.
 *
 * Configuration:
 * - Memory storage (for Cloudinary upload)
 * - File filter (JPEG, PNG, GIF, WebP only)
 * - Max file size: 5MB
 *
 * @example
 * // Single file upload
 * router.patch('/avatar', upload.single('avatar'), userController.updateAvatar);
 *
 * // Multiple files
 * router.post('/gallery', upload.array('images', 5), galleryController.upload);
 *
 * @openapi
 * components:
 *   requestBodies:
 *     ImageUpload:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Image file (JPEG, PNG, GIF, WebP, max 5MB)
 */
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE,
    },
});

export default upload;
