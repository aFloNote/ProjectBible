import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';

interface AuthAudioProps {
  onAudioUpdate: (files: File[]) => void;
}

interface AudioWithPreview {
  file: File;
  preview: string;
}

export const AuthAudio: React.FC<AuthAudioProps> = ({ onAudioUpdate }) => {
  const [audios, setAudios] = useState<AudioWithPreview[]>([]);
  const prevAudiosRef = useRef<AudioWithPreview[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const mappedAudios = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setAudios(mappedAudios);
  }, []);

  const removeAudio = (event: React.MouseEvent<HTMLButtonElement>, audioSrc: string) => {
    event.stopPropagation();
    const newAudios = audios.filter(audio => audio.preview !== audioSrc);
    setAudios(newAudios);
    onAudioUpdate(newAudios.map(audio => audio.file)); // Add this line
    URL.revokeObjectURL(audioSrc);
  };
  const memoizedOnAudioUpdate = useCallback(onAudioUpdate, []);
  useEffect(() => {
    const files = audios.map(audio => audio.file);
    if (JSON.stringify(prevAudiosRef.current) !== JSON.stringify(files)) {
      onAudioUpdate(files);
    }
  }, [audios, memoizedOnAudioUpdate]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {'audio/mpeg':[],'audio/wav':[]},
    maxFiles: 1,
  });

  return (
    <div {...getRootProps()} className="cursor-pointer text-black dark:text-white">
      <input {...getInputProps()} />
      {audios.length > 0 ? (
        <div className="flex flex-col items-center justify-center">
          {audios.map((audio, index) => (
            <div key={index} className="relative">
              <audio src={audio.preview} controls className="max-w-xs max-h-32" />
              <button 
                onClick={(event) => removeAudio(event, audio.preview)} 
                className="absolute top-0 right-0 p-1 rounded-full text-red-500"
                type="button"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>Drag 'n' or click to add audio</p>
      )}
    </div>
  );
};