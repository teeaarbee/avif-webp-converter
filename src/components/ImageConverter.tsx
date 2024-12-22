import React, { useState, useCallback } from 'react';
import { Upload, Download, Clipboard, Check } from 'lucide-react';
import { convertToPNG, copyImageToClipboard, downloadImage } from '../utils/imageConverter';

export function ImageConverter() {
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await handleImage(file);
  };

  const handleImage = async (file: File) => {
    setLoading(true);
    setError(null);
    setCopySuccess(false);

    try {
      const pngUrl = await convertToPNG(file);
      setConvertedImage(pngUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert image');
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleImage(file);
    }
  }, []);

  const handleCopyToClipboard = async () => {
    if (!convertedImage) return;
    try {
      await copyImageToClipboard(convertedImage);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDownload = () => {
    if (convertedImage) {
      downloadImage(convertedImage);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">WebP/AVIF to PNG Converter</h1>
        <p className="text-gray-600">Convert your WebP or AVIF images to PNG format</p>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/webp,image/avif"
          onChange={handleImageUpload}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center cursor-pointer"
        >
          <Upload className="w-12 h-12 text-gray-400 mb-3" />
          <span className="text-gray-600">Drop your image here or click to upload</span>
          <span className="text-sm text-gray-500 mt-1">Supports WebP and AVIF formats</span>
        </label>
      </div>

      {loading && (
        <div className="text-center text-gray-600">
          Converting image...
        </div>
      )}

      {error && (
        <div className="text-center text-red-600">
          {error}
        </div>
      )}

      {convertedImage && (
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <img
              src={convertedImage}
              alt="Converted PNG"
              className="max-w-full h-auto mx-auto"
            />
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleCopyToClipboard}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                copySuccess 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {copySuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Clipboard className="w-4 h-4" />
                  Copy to Clipboard
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PNG
            </button>
          </div>
        </div>
      )}
    </div>
  );
}