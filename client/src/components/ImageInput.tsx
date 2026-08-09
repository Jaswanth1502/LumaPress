import React, { useRef } from 'react';
import { Image as ImageIcon, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface ImageInputProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  placeholder?: string;
}

export const ImageInput: React.FC<ImageInputProps> = ({
  value,
  onChange,
  label = 'Cover Image (Optional)',
  placeholder = 'Paste image URL or upload from your device...',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image file size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
        toast.success('Image uploaded from device!');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1 flex items-center">
          <ImageIcon className="w-5 h-5 absolute left-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-2xs active:scale-95"
        >
          <Upload className="w-4 h-4 text-emerald-700" />
          <span>Upload Image</span>
        </button>
      </div>

      {value && (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 max-h-48 flex items-center justify-center mt-2 group">
          <img
            src={value}
            alt="Preview"
            className="w-full h-48 object-cover rounded-2xl"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-colors shadow-md cursor-pointer"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
