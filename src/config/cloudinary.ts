import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Configure Cloudinary SDK with environment variables.
 *
 * Required environment variables:
 * - CLOUDINARY_CLOUD_NAME
 * - CLOUDINARY_API_KEY
 * - CLOUDINARY_API_SECRET
 */
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload an image buffer to Cloudinary.
 *
 * Features:
 * - Automatic image optimization (quality: auto)
 * - Automatic format conversion to WebP
 * - Max dimensions: 800x800 (preserves aspect ratio)
 *
 * @param fileBuffer - Image file as Buffer
 * @param folder - Cloudinary folder name (default: 'foodies')
 * @returns Promise resolving to the secure URL of the uploaded image
 *
 * @example
 * const imageUrl = await uploadToCloudinary(req.file.buffer, 'avatars');
 * // Returns: "https://res.cloudinary.com/demo/image/upload/avatars/abc123.webp"
 *
 * @throws Error if upload fails
 */
export const uploadToCloudinary = async (
    fileBuffer: Buffer,
    folder: string = 'foodies'
): Promise<string> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(
                {
                    folder,
                    resource_type: 'image',
                    transformation: [
                        { width: 800, height: 800, crop: 'limit' },
                        { quality: 'auto' },
                        { format: 'webp' },
                    ],
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else if (result) {
                        resolve(result.secure_url);
                    } else {
                        reject(new Error('Upload failed'));
                    }
                }
            )
            .end(fileBuffer);
    });
};

/**
 * Delete an image from Cloudinary by its URL.
 *
 * Silently fails if the image doesn't exist (logs error but doesn't throw).
 *
 * @param imageUrl - Full Cloudinary URL of the image to delete
 *
 * @example
 * await deleteFromCloudinary('https://res.cloudinary.com/demo/image/upload/avatars/abc123.webp');
 */
export const deleteFromCloudinary = async (imageUrl: string): Promise<void> => {
    try {
        // Extract public_id from URL
        // URL format: https://res.cloudinary.com/{cloud}/image/upload/{folder}/{filename}.{ext}
        const urlParts = imageUrl.split('/');
        const folderAndFile = urlParts.slice(-2).join('/');
        const publicId = folderAndFile.replace(/\.[^/.]+$/, ''); // Remove extension

        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Failed to delete image from Cloudinary:', error);
    }
};

export default cloudinary;
