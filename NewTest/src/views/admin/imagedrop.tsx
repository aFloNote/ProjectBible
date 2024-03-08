import React, { useCallback, useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";

interface AuthImageProps {
  onImageUpdate: (files: File[]) => void;
  imgpath?: string;
}

interface ImageWithPreview {
  file: File;
  preview: string;
}

export const AuthImage: React.FC<AuthImageProps> = ({
  onImageUpdate,
  imgpath,
}) => {
  const [images, setImages] = useState<ImageWithPreview[]>([]);
  const prevImagesRef = useRef<File[]>([]);
  const b2endpoint = import.meta.env.VITE_REACT_B2_ENDPOINT;
  useEffect(() => {
    if (imgpath) {
      console.log(b2endpoint + encodeURIComponent(imgpath))
      setImages([
        {
          
          file: new File([], b2endpoint + encodeURIComponent(imgpath)),
          preview: b2endpoint + encodeURIComponent(imgpath),
        },
      ]);
    }
  }, [imgpath]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const mappedImages = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages(mappedImages);
  }, []);

  const removeImage = (
    event: React.MouseEvent<HTMLButtonElement>,
    imageSrc: string
  ) => {
    event.stopPropagation();
    setImages(images.filter((image) => image.preview !== imageSrc));
    URL.revokeObjectURL(imageSrc);
  };

  useEffect(() => {
    const files = images.map((image) => image.file);
    if (JSON.stringify(prevImagesRef.current) !== JSON.stringify(files)) {
      onImageUpdate(files);
      prevImagesRef.current = files; // update the ref after calling onImageUpdate
    }
  }, [images, onImageUpdate]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className="w-32 h-32 cursor-pointer text-black dark:text-white"
    >
      <input {...getInputProps()} />
      {images.length > 0 ? (
        <div className="flex flex-col items-center justify-center">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image.preview}
                alt="preview"
                className="w-full h-full"
              />
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
        <p className=''>Drag 'n' drop or click to add img: required</p>
      )}
    </div>
  );
};
