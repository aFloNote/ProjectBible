import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

interface AuthImageProps {
  // Define any props for the component here
}

export const AuthImage: React.FC<AuthImageProps> = () => {
  const [images, setImages] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Map the accepted files into an array of file object URLs and update state
    const mappedImages = acceptedFiles.map(file => ({
      preview: URL.createObjectURL(file)
    }));
    setImages(mappedImages.map(file => file.preview));
  }, []);

  const { getRootProps, getInputProps} = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    maxFiles: 1,
  });

  // Function to removev an image
  const removeImage = (event: React.MouseEvent<HTMLButtonElement>, imageSrc: string) => {
    event.stopPropagation();
    setImages(images.filter(src => src !== imageSrc));
    URL.revokeObjectURL(imageSrc); // Clean up the object URL to avoid memory leaks
  };

  useEffect(() => {
    // Clean up all object URLs to avoid memory leaks
    return () => images.forEach(imageSrc => URL.revokeObjectURL(imageSrc));
  }, [images]);
  
  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      {images.length > 0 ? (
        <div className="flex flex-col items-center justify-center">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img src={image} alt="preview" className="max-w-xs max-h-32" />
              <button 
                onClick={(event) => removeImage(event,image)} 
                className="absolute top-0 right-0 p-1 rounded-full"
                type="button"
              >
                &times; {/* Cross symbol to indicate removal */}
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
