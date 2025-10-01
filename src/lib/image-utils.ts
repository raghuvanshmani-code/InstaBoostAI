import imageCompression from 'browser-image-compression';

const MAX_FILE_SIZE_MB = 50; // Increased limit
const MAX_IMAGE_WIDTH = 1080;
const COMPRESSION_TARGET_MB = 1;
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
    maxSizeMB: COMPRESSION_TARGET_MB,
    maxWidthOrHeight: MAX_IMAGE_WIDTH,
    useWebWorker: true,
  };

  try {
    // Only compress if the file is larger than the target size or not a GIF.
    // The library is smart, but this check can avoid unnecessary processing.
    const needsCompression = file.size > options.maxSizeMB * 1024 * 1024;
    const isAnimatedGif = file.type === 'image/gif';

    if (needsCompression && !isAnimatedGif) {
        const compressedFile = await imageCompression(file, options);
        return compressedFile;
    }
    
    // Return original file if it doesn't need compression or is a GIF
    return file;
  } catch (error) {
    console.error('Image compression error:', error);
    // If compression fails, throw a specific error to be caught by the UI.
    throw new Error('Could not process the image. It might be corrupted or in an unsupported format.');
  }
}
