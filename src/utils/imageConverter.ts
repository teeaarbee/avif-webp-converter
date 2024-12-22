import heic2any from 'heic2any';
import { copyImageToClipboard } from './clipboard';
import { downloadImage } from './download';

export async function convertToPNG(file: File): Promise<string> {
  try {
    let imageBlob: Blob = file;
    
    // Check if it's an iPhone HEIC/HEIF image
    const isHeicImage = file.type === 'image/heic' || 
                       file.type === 'image/heif' || 
                       file.name.toLowerCase().endsWith('.heic') || 
                       file.name.toLowerCase().endsWith('.heif') ||
                       file.type === ''; // iPhone sometimes sends empty type

    if (isHeicImage) {
      try {
        const convertedBlob = await heic2any({
          blob: file,
          toType: 'image/jpeg', // Use JPEG as intermediate format for better compatibility
          quality: 0.95
        });
        
        imageBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
      } catch (heicError) {
        console.error('HEIC conversion error:', heicError);
        throw new Error('Unable to convert this HEIC image. Please make sure it\'s a valid image file.');
      }
    } else if (!['image/webp', 'image/avif', 'image/jpeg', 'image/png'].includes(file.type)) {
      throw new Error('Please upload a WebP, AVIF, HEIC, or HEIF image');
    }

    // Create object URL for the blob
    const objectUrl = URL.createObjectURL(imageBlob);
    
    // Create and load image
    const image = new Image();
    const imageLoaded = new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () => reject(new Error('Failed to load the converted image'));
      image.src = objectUrl;
    });

    try {
      await imageLoaded;
    } catch (error) {
      URL.revokeObjectURL(objectUrl);
      throw error;
    }
    
    // Create canvas with image dimensions
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    
    // Draw image to canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');
    
    ctx.drawImage(image, 0, 0);
    
    // Clean up
    URL.revokeObjectURL(objectUrl);
    
    // Convert to PNG with maximum quality
    return canvas.toDataURL('image/png', 1.0);
  } catch (error) {
    console.error('Conversion error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to convert image. Please try again.');
  }
}

export { copyImageToClipboard, downloadImage };