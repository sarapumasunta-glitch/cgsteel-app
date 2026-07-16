"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

export type PendingImage = { file: File; previewUrl: string };

export function readImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = url;
  });
}

export default function MultiImageDropzone({
  images,
  onChange,
}: {
  images: PendingImage[];
  onChange: (images: PendingImage[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  function addFiles(fileList: FileList | File[]) {
    const newImages = Array.from(fileList)
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({ file, previewUrl: URL.createObjectURL(file) }));
    if (newImages.length > 0) {
      onChange([...images, ...newImages]);
    }
  }

  function removeAt(index: number) {
    const target = images[index];
    URL.revokeObjectURL(target.previewUrl);
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded p-6 text-center cursor-pointer transition-colors ${
          dragOver
            ? "border-industrial-orange bg-industrial-orange/5"
            : "border-steel-gray/30"
        }`}
      >
        <Upload className="mx-auto text-steel-gray" size={24} />
        <p className="mt-2 text-sm text-steel-gray">
          Arrastra fotos aquí o haz clic para seleccionar (puedes elegir
          varias a la vez)
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((img, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <div
              key={img.previewUrl}
              className="relative aspect-square bg-off-white rounded overflow-hidden"
            >
              <img
                src={img.previewUrl}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeAt(i)}
                aria-label="Quitar foto"
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
