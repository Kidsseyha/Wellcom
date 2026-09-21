import { useState, useRef, type DragEvent, type ChangeEvent, type FormEvent } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, X } from 'lucide-react';
import { ThemeMode } from './ThemeToggle';

interface ImageUploadInputProps {
  label: string;
  value: string;
  onChange: (newUrl: string) => void;
  aspectRatio?: string; // e.g. 'aspect-[3/4]', 'aspect-video', 'aspect-square'
  helpText?: string;
  theme?: ThemeMode;
}

import { compressImageFile } from '../utils/imageCompressor';

// Compress image via canvas to prevent database quota and size errors
function compressImage(file: File, maxWidth = 800, maxHeight = 800, quality = 0.68): Promise<string> {
  return compressImageFile(file, { maxWidth, maxHeight, quality });
}

export default function ImageUploadInput({
  label,
  value,
  onChange,
  aspectRatio = 'aspect-video',
  helpText,
  theme = 'dark',
}: ImageUploadInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(value.startsWith('http') ? value : '');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('សូមជ្រើសរើសឯកសារជារូបភាព (PNG, JPG, WEBP)! / Please select an image file.');
      return;
    }

    try {
      setIsProcessing(true);
      const isSquare = aspectRatio === 'aspect-square';
      const dataUrl = await compressImage(file, isSquare ? 600 : 1000, isSquare ? 600 : 1000, isSquare ? 0.8 : 0.75);
      onChange(dataUrl);
    } catch (err) {
      console.error('Error processing image:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUrlSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  const handleClear = () => {
    onChange('');
    setUrlInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className={`block text-xs font-semibold ${theme === 'light' ? 'text-amber-950' : 'text-amber-200/90'} font-khmer`}>
          {label}
        </label>
        <div className="flex items-center gap-1.5 text-[11px]">
          <button
            type="button"
            onClick={() => setInputMode('upload')}
            className={`px-2 py-0.5 rounded transition-all ${
              inputMode === 'upload'
                ? 'bg-amber-400 text-amber-950 font-bold shadow-sm'
                : theme === 'light'
                ? 'text-neutral-600 hover:text-amber-900'
                : 'text-neutral-400 hover:text-amber-300'
            }`}
          >
            បញ្ចូលរូបភាព (Upload)
          </button>
          <span className={theme === 'light' ? 'text-neutral-400' : 'text-neutral-600'}>|</span>
          <button
            type="button"
            onClick={() => setInputMode('url')}
            className={`px-2 py-0.5 rounded transition-all ${
              inputMode === 'url'
                ? 'bg-amber-400 text-amber-950 font-bold shadow-sm'
                : theme === 'light'
                ? 'text-neutral-600 hover:text-amber-900'
                : 'text-neutral-400 hover:text-amber-300'
            }`}
          >
            តំណភ្ជាប់ (URL)
          </button>
        </div>
      </div>

      {/* Hidden File Input for click-to-upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className={`relative rounded-xl overflow-hidden border ${
          theme === 'light' ? 'border-amber-300/80 bg-amber-50/50 shadow-sm' : 'border-amber-500/40 bg-black/60'
        } group`}>
          <div className={`${aspectRatio} w-full flex items-center justify-center ${theme === 'light' ? 'bg-amber-100/40' : 'bg-black/40'} overflow-hidden`}>
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Direct Top-Left Change Button Icon */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="absolute top-2 left-2 z-20 p-2 rounded-full bg-amber-400 hover:bg-amber-300 text-amber-950 shadow-md border border-amber-500/30 transition-all hover:scale-110 active:scale-90 flex items-center justify-center cursor-pointer"
            title="ប្តូររូបភាព (Change Image)"
            aria-label="Change Image"
          >
            <Upload className="w-3.5 h-3.5 shrink-0" />
          </button>

          {/* Direct Top-Right Delete Button Icon */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="absolute top-2 right-2 z-20 p-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-md border border-rose-300 transition-all hover:scale-110 active:scale-90 flex items-center justify-center cursor-pointer"
            title="លុបរូបភាព (Delete Image)"
            aria-label="Delete Image"
          >
            <X className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      ) : (
        <>
          {inputMode === 'upload' ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                isDragging
                  ? theme === 'light'
                    ? 'border-amber-500 bg-amber-100/70 scale-[1.01]'
                    : 'border-amber-400 bg-amber-950/40 scale-[1.01]'
                  : theme === 'light'
                  ? 'border-amber-300 hover:border-amber-500 bg-amber-50/60 hover:bg-amber-100/50'
                  : 'border-amber-500/30 hover:border-amber-400 bg-black/40 hover:bg-amber-950/20'
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <div className={`w-10 h-10 rounded-full ${theme === 'light' ? 'bg-amber-200/80 text-amber-800' : 'bg-amber-500/20 text-amber-400'} flex items-center justify-center`}>
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className={`text-xs font-semibold ${theme === 'light' ? 'text-amber-950' : 'text-amber-200'} font-khmer`}>
                    {isProcessing ? 'កំពុងដំណើរការរូបភាព...' : 'ទាញទម្លាក់រូបភាព ឬ ចុចដើម្បីជ្រើសរើស'}
                  </p>
                  <p className={`text-[11px] ${theme === 'light' ? 'text-neutral-600' : 'text-neutral-400'} font-khmer mt-0.5`}>
                    Drag and drop, or click to browse image file
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs focus:outline-none ${
                    theme === 'light'
                      ? 'bg-white border-amber-300 text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20'
                      : 'bg-black/60 border-amber-500/30 text-amber-100 placeholder-neutral-500 focus:border-amber-400'
                  }`}
                />
              </div>
              <button
                type="button"
                onClick={handleUrlSubmit}
                className="px-3.5 py-2 rounded-xl bg-amber-400 text-amber-950 font-bold text-xs font-khmer hover:bg-amber-300 shadow-sm"
              >
                ដាក់រូប
              </button>
            </div>
          )}
        </>
      )}

      {helpText && (
        <p className={`text-[10px] ${theme === 'light' ? 'text-neutral-600' : 'text-neutral-400'} font-khmer`}>
          {helpText}
        </p>
      )}
    </div>
  );
}
