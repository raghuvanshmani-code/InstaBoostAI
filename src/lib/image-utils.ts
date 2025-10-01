import imageCompression from 'browser-image-compression';

const MAX_FILE_SIZE_MB = 10;
const MAX_IMAGE_WIDTH = 1080;
const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

/**
 * Validates the image file based on size and format.
 * @param file The image file to validate.
 * @returns An error message if invalid, otherwise null.
 */
export function validateImage(file: File): string | null {
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return `File is too large. Please select an image under ${MAX_FILE_SIZE_MB}MB.`;
  }
  if (!SUPPORTED_FORMATS.includes(file.type)) {
    return 'Invalid file format. Please use JPEG, PNG, GIF, or WebP.';
  }
  return null;
}

/**
 * Compresses and resizes an image file if necessary.
 * @param file The image file to process.
 * @returns A promise that resolves to the processed image file.
 */
export async function processImageForUpload(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1, // Compress to a file size of 1MB
    maxWidthOrHeight: MAX_IMAGE_WIDTH,
    useWebWorker: true,
  };

  try {
    // Only compress if the file is larger than the target size or needs resizing.
    // The library is smart, but this check avoids unnecessary processing for small images.
    if (file.size > options.maxSizeMB * 1024 * 1024 || !file.type.startsWith('image/gif')) {
        const compressedFile = await imageCompression(file, options);
        return compressedFile;
    }
    return file;
  } catch (error) {
    console.error('Image compression error:', error);
    // If compression fails, return the original file but warn the user.
    // This could happen with corrupted files.
    throw new Error('Could not process the image. It might be corrupted.');
  }
}
