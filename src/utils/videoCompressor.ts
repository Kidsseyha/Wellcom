/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VideoCompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  videoBitrate?: number; // e.g. 180000 = 180kbps
  maxDurationSeconds?: number;
  fps?: number;
  onProgress?: (percent: number) => void;
}

export function isVideoMedia(url?: string): boolean {
  if (!url) return false;
  const clean = url.toLowerCase().split('?')[0];
  return (
    clean.startsWith('data:video/') ||
    clean.endsWith('.mp4') ||
    clean.endsWith('.webm') ||
    clean.endsWith('.mov') ||
    clean.endsWith('.ogg') ||
    clean.endsWith('.m4v') ||
    url.includes('youtube.com') ||
    url.includes('youtu.be') ||
    url.includes('vimeo.com')
  );
}

/**
 * Compresses a short video file to an ultra-compact lightweight data URL using HTML5 Video + Canvas + MediaRecorder
 */
export async function compressVideoFile(
  file: File,
  options: VideoCompressionOptions = {}
): Promise<string> {
  const {
    maxWidth = 360,
    maxHeight = 360,
    videoBitrate = 180_000, // 180 kbps for ultra-lightweight payload (< 200KB)
    maxDurationSeconds = 8,
    fps = 18,
    onProgress,
  } = options;

  // If browser does not support MediaRecorder or Canvas captureStream
  if (
    typeof window === 'undefined' ||
    typeof MediaRecorder === 'undefined' ||
    !HTMLCanvasElement.prototype.captureStream
  ) {
    if (file.size > 500_000) {
      throw new Error('ឯកសារវីដេអូមានទំហំធំពេក សូមប្រើប្រាស់វីដេអូខ្លីក្រោម 500KB ឬតំណភ្ជាប់ YouTube/Video Link');
    }
    return fileToDataUrl(file);
  }

  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.playsInline = true;
    video.autoplay = false;

    const fileUrl = URL.createObjectURL(file);
    video.src = fileUrl;

    video.onloadedmetadata = () => {
      let width = video.videoWidth || 480;
      let height = video.videoHeight || 480;

      // Scale down dimensions while maintaining aspect ratio
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      // Ensure dimensions are even numbers (requirement for certain video codecs)
      width = Math.max(120, Math.round(width / 2) * 2);
      height = Math.max(120, Math.round(height / 2) * 2);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', { alpha: false });

      if (!ctx) {
        URL.revokeObjectURL(fileUrl);
        if (file.size <= 450_000) {
          fileToDataUrl(file).then(resolve).catch(reject);
        } else {
          reject(new Error('Canvas context unavailable and file is too large.'));
        }
        return;
      }

      const totalDuration = Math.min(video.duration || 6, maxDurationSeconds);
      const stream = canvas.captureStream(fps);

      let mimeType = 'video/webm;codecs=vp8';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = '';
      }

      let recorder: MediaRecorder;
      try {
        recorder = new MediaRecorder(
          stream,
          mimeType
            ? { mimeType, videoBitsPerSecond: videoBitrate }
            : { videoBitsPerSecond: videoBitrate }
        );
      } catch (err) {
        console.warn('MediaRecorder init failed, checking fallback:', err);
        URL.revokeObjectURL(fileUrl);
        if (file.size <= 450_000) {
          fileToDataUrl(file).then(resolve).catch(reject);
        } else {
          reject(new Error('វីដេអូមានទំហំធំពេក សូមប្រើប្រាស់វីដេអូខ្លី ឬ Video URL (YouTube, MP4)'));
        }
        return;
      }

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        URL.revokeObjectURL(fileUrl);
        const finalBlob = new Blob(chunks, { type: recorder.mimeType || 'video/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            if (onProgress) onProgress(100);
            resolve(reader.result);
          } else {
            reject(new Error('Failed to convert compressed video to base64'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read compressed video blob'));
        reader.readAsDataURL(finalBlob);
      };

      let animationFrameId: number;
      const drawFrame = () => {
        if (video.paused || video.ended || video.currentTime >= totalDuration) {
          if (recorder.state === 'recording') {
            recorder.stop();
          }
          return;
        }

        ctx.drawImage(video, 0, 0, width, height);

        if (onProgress && totalDuration > 0) {
          const pct = Math.min(98, Math.round((video.currentTime / totalDuration) * 100));
          onProgress(pct);
        }

        animationFrameId = requestAnimationFrame(drawFrame);
      };

      recorder.start(100); // collect in 100ms slices

      video.currentTime = 0;
      video
        .play()
        .then(() => {
          drawFrame();
        })
        .catch((err) => {
          console.warn('Video play error during compression:', err);
          if (recorder.state === 'recording') {
            recorder.stop();
          }
        });

      // Stop recording when duration reached or video ends
      video.onended = () => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
        cancelAnimationFrame(animationFrameId);
      };

      video.ontimeupdate = () => {
        if (video.currentTime >= totalDuration) {
          video.pause();
          if (recorder.state === 'recording') {
            recorder.stop();
          }
          cancelAnimationFrame(animationFrameId);
        }
      };
    };

    video.onerror = () => {
      URL.revokeObjectURL(fileUrl);
      if (file.size <= 450_000) {
        fileToDataUrl(file).then(resolve).catch(reject);
      } else {
        reject(new Error('មិនអាចដំណើរការវីដេអូនេះបានទេ។ សូមជ្រើសរើសវីដេអូខ្លីជាងនេះ ឬប្រើ Video URL។'));
      }
    };
  });
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file as data URL'));
    reader.readAsDataURL(file);
  });
}
