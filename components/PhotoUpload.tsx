'use client';
import { useRef } from 'react';

interface PhotoUploadProps {
  photo?: string;
  onPhotoChange: (base64: string | undefined) => void;
  size?: 'sm' | 'md' | 'lg';
  name?: string;
}

export default function PhotoUpload({ photo, onPhotoChange, size = 'md', name = '' }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-20 h-20 text-2xl',
    lg: 'w-28 h-28 text-4xl',
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onPhotoChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden cursor-pointer border-2 border-dashed border-[#e8e8ec] hover:border-[#1a5276] transition-colors relative`}
        onClick={() => inputRef.current?.click()}
        title="Cambiar foto"
      >
        {photo ? (
          <img src={photo} alt="foto" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-[#d6eaf8] flex items-center justify-center text-[#1a5276] font-bold">
            {name ? name.charAt(0).toUpperCase() : '📷'}
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-xs text-[#1a5276] hover:underline"
        >
          {photo ? 'Cambiar foto' : 'Agregar foto'}
        </button>
        {photo && (
          <button
            type="button"
            onClick={() => onPhotoChange(undefined)}
            className="text-xs text-[#c62828] hover:underline"
          >
            Quitar
          </button>
        )}
      </div>
    </div>
  );
}
