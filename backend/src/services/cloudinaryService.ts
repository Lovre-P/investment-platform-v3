import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

export interface CloudinaryUploadOptions {
  folder?: string;
  public_id?: string;
  transformation?: object;
}

/**
 * Upload a file buffer to Cloudinary
 * @param fileBuffer - The file buffer to upload
 * @param options - Upload options
 * @returns Promise with upload result
 */
export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult> => {
  try {
    // Validate Cloudinary configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary configuration is missing. Please check environment variables.');
    }

    // Generate unique public_id if not provided
    const publicId = options.public_id || `investment_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    // Default upload options
    const uploadOptions = {
      folder: options.folder || 'mega-invest/investments',
      public_id: publicId,
      resource_type: 'image' as const,
      quality: 'auto',
      ...options.transformation,
    };

    // Upload using stream
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(new Error(`Cloudinary upload failed: ${error.message}`));
          } else if (result) {
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
              format: result.format,
              width: result.width,
              height: result.height,
              bytes: result.bytes,
            });
          } else {
            reject(new Error('Cloudinary upload failed: No result returned'));
          }
        }
      );

      // Create readable stream from buffer and pipe to Cloudinary
      const bufferStream = new Readable();
      bufferStream.push(fileBuffer);
      bufferStream.push(null);
      bufferStream.pipe(uploadStream);
    });
  } catch (error) {
    console.error('Cloudinary service error:', error);
    throw error;
  }
};

/**
 * Delete an image from Cloudinary
 * @param publicId - The public ID of the image to delete
 * @returns Promise with deletion result
 */
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== 'ok') {
      console.warn(`Failed to delete image from Cloudinary: ${publicId}`, result);
    }
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    // Don't throw error for deletion failures to avoid breaking the main flow
  }
};

/**
 * Generate optimized URL for an image
 * @param publicId - The public ID of the image
 * @param transformations - Optional transformations
 * @returns Optimized image URL
 */
export const getOptimizedImageUrl = (
  publicId: string,
  transformations: object = {}
): string => {
  return cloudinary.url(publicId, {
    quality: 'auto',
    ...transformations,
  });
};

/**
 * Upload multiple files to Cloudinary
 * @param files - Array of file buffers with metadata
 * @param options - Upload options
 * @returns Promise with array of upload results
 */
export const uploadMultipleToCloudinary = async (
  files: { buffer: Buffer; originalname: string }[],
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult[]> => {
  try {
    const uploadPromises = files.map((file, index) => {
      const fileOptions = {
        ...options,
        public_id: options.public_id 
          ? `${options.public_id}_${index}` 
          : `investment_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 15)}`,
      };
      return uploadToCloudinary(file.buffer, fileOptions);
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple files to Cloudinary:', error);
    throw error;
  }
};

/**
 * Check if Cloudinary is properly configured
 * @returns boolean indicating if configuration is valid
 */
export const isCloudinaryConfigured = (): boolean => {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};
