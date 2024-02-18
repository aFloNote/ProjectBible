import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

interface AuthImageProps {
  onImageUpdate: (files: File[]) => void;
}

interface ImageWithPreview {
  file: File;
  preview: string;
}

export const AuthImage: React.FC<AuthImageProps> = ({ onImageUpdate }) => {
  const [images, setImages] = useState<ImageWithPreview[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const mappedImages = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages(mappedImages);
  }, []);

  const removeImage = (event: React.MouseEvent<HTMLButtonElement>, imageSrc: string) => {
    event.stopPropagation();
    setImages(images.filter(image => image.preview !== imageSrc));
    URL.revokeObjectURL(imageSrc);
  };

  useEffect(() => {
    const files = images.map(image => image.file);
    onImageUpdate(files);
  }, [images, onImageUpdate]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    maxFiles: 1,
  });

  return (
    <div {...getRootProps()} className="cursor-pointer text-black">
      <input {...getInputProps()} />
      {images.length > 0 ? (
        <div className="flex flex-col items-center justify-center">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img src={image.preview} alt="preview" className="max-w-xs max-h-32" />
              <button 
                onClick={(event) => removeImage(event, image.preview)} 
                className="absolute top-0 right-0 p-1 rounded-full text-red-500"
                type="button"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>Drag 'n' drop some images here, or click to select images</p>
      )}
    </div>
  );
};
