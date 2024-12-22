export async function copyImageToClipboard(dataUrl: string): Promise<void> {
  try {
    // Focus the window before attempting to write to clipboard
    window.focus();
    
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