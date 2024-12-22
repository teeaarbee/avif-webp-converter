export async function convertToPNG(file: File): Promise<string> {
  // Validate file type
  if (!['image/webp', 'image/avif'].includes(file.type)) {
    throw new Error('Please upload a WebP or AVIF image');
  }

  try {
    // Create object URL for the file
    const objectUrl = URL.createObjectURL(file);
    
    // Create and load image
    const image = new Image();
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = objectUrl;
    });
    
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
    
    // Convert to PNG
    return canvas.toDataURL('image/png');
  } catch (error) {
    throw new Error('Failed to convert image. Please try again.');
  }
}

export async function copyImageToClipboard(dataUrl: string): Promise<void> {
  try {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob
      })
    ]);
  } catch (error) {
    throw new Error('Failed to copy to clipboard. Please try again.');
  }
}

export function downloadImage(dataUrl: string, filename: string = 'converted-image.png'): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}