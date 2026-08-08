import { ImageIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type FileInputProps = {
  label?: string;
  error?: string;
  accept?: string;
  previewUrl?: string;
  onChange: (file: File | null) => void;
};

export function FileInput({
  label,
  error,
  accept = 'image/*',
  previewUrl,
  onChange,
}: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const displayPreview = localPreview || previewUrl;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onChange(file);
    if (file) {
      setLocalPreview(URL.createObjectURL(file));
    } else {
      setLocalPreview(null);
    }
  };

  return (
    <div className="w-full">
      {label && <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>}
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-primary-400',
          error && 'border-red-500',
        )}
      >
        {displayPreview ? (
          <img
            src={displayPreview}
            alt="Preview"
            className="mb-3 max-h-48 rounded-lg object-cover"
          />
        ) : (
          <ImageIcon className="mb-2 h-10 w-10 text-gray-400" />
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          {displayPreview ? 'Change image' : 'Upload image'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
