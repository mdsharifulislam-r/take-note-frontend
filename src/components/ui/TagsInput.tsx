import { X } from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';

type TagsInputProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  label?: string;
  error?: string;
  placeholder?: string;
};

export function TagsInput({
  value,
  onChange,
  label,
  error,
  placeholder = 'Type and press Enter',
}: TagsInputProps) {
  const [input, setInput] = useState('');

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput('');
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className="w-full">
      {label && <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>}
      <div
        className={cn(
          'flex min-h-[42px] flex-wrap gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20',
          error && 'border-red-500',
        )}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-md bg-primary-100 px-2 py-0.5 text-sm text-primary-800"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="rounded hover:bg-primary-200"
              aria-label={`Remove ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => input && addTag(input)}
          placeholder={value.length === 0 ? placeholder : ''}
          className="min-w-[120px] flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-gray-400"
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
