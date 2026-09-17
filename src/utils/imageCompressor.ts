/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Robust image compression utility to ensure images fit securely
 * within Firestore's 1MB document limit and reduce memory/network overhead.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

/**
 * Compress a File object into a compact base64 data URL
 */
export function compressImageFile(
  file: File,
  options: CompressionOptions = {}
): Promise<string> {
  const { maxWidth = 850, maxHeight = 850, quality = 0.68 } = options;

  return new Promise((resolve, reject) => {
    // If SVG, return as is or read as data URL
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read SVG file'));
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (!result || typeof result !== 'string') {
        reject(new Error('Failed to read image as data URL'));
        return;
      }
      compressBase64String(result, { maxWidth, maxHeight, quality })
        .then(resolve)
        .catch(reject);
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Downsamples / re-compresses an existing base64 string to a safe size
 */
export function compressBase64String(
  base64Str: string,
  options: CompressionOptions = {}
): Promise<string> {
  const { maxWidth = 850, maxHeight = 850, quality = 0.68 } = options;

  if (!base64Str || typeof base64Str !== 'string' || !base64Str.startsWith('data:image/')) {
    return Promise.resolve(base64Str);
  }

  // If already tiny (< 25KB), return directly
  if (base64Str.length < 25000) {
    return Promise.resolve(base64Str);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      // Ensure dimensions are valid
      width = Math.max(1, Math.min(width, maxWidth));
      height = Math.max(1, Math.min(height, maxHeight));

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64Str);
        return;
      }

      // Fill white background in case of transparent PNG converted to JPEG
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      try {
        const compressed = canvas.toDataURL('image/jpeg', quality);
        // Only return compressed if it's actually smaller or valid
        resolve(compressed.length < base64Str.length ? compressed : base64Str);
      } catch {
        resolve(base64Str);
      }
    };

    img.onerror = () => {
      resolve(base64Str);
    };

    img.src = base64Str;
  });
}
