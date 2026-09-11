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

// Compress image via canvas to prevent localStorage quota errors
function compressImage(file: File, maxWidth = 1400, maxHeight = 1400, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
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
      const dataUrl = await compressImage(file);
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

          {/* Action overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-amber-400 text-amber-950 font-khmer text-xs font-bold shadow-md hover:bg-amber-300 flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>ប្តូររូប</span>
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500 shadow-md"
              title="Remove"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
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
