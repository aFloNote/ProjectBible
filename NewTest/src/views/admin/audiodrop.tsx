import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';

interface AuthAudioProps {
  onAudioUpdate: (files: File[]) => void;
  audiopath: string;
}

interface AudioWithPreview {
  file: File;
  preview: string;
 
}

export const AuthAudio: React.FC<AuthAudioProps> = ({ onAudioUpdate,audiopath }) => {
  const [audio, setAudio] = useState<AudioWithPreview[]>([]);
  const prevAudiosRef = useRef<AudioWithPreview[]>([]);
  const b2endpoint = import.meta.env.VITE_REACT_B2_ENDPOINT;
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const mappedAudios = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setAudio(mappedAudios);
  }, []);

  const removeAudio = (event: React.MouseEvent<HTMLButtonElement>, audioSrc: string) => {
    event.stopPropagation();
    const newAudios = audio.filter(audio => audio.preview !== audioSrc);
    setAudio(newAudios);
    onAudioUpdate(newAudios.map(audio => audio.file)); // Add this line
    URL.revokeObjectURL(audioSrc);
  };
  const memoizedOnAudioUpdate = useCallback(onAudioUpdate, []);
  useEffect(() => {
    const files = audio.map(audio => audio.file);
    if (JSON.stringify(prevAudiosRef.current) !== JSON.stringify(files)) {
      onAudioUpdate(files);
    }
  }, [audio, memoizedOnAudioUpdate]);
  useEffect(() => {
    if (audiopath) {
      console.log(b2endpoint + encodeURIComponent(audiopath))
      setAudio([
        {
          file: new File([], b2endpoint + encodeURIComponent(audiopath)),
          preview: b2endpoint + encodeURIComponent(audiopath),
        },
      ]);
    }
  }, [audiopath]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {'audio/mpeg':[],'audio/wav':[]},
    maxFiles: 1,
  });

  return (
    <div {...getRootProps()} className="cursor-pointer text-black dark:text-white">
      <input {...getInputProps()} />
      {audio.length > 0 ? (
        <div className="flex flex-col items-center justify-center">
          {audio.map((audio, index) => (
            <div key={index} className="relative">
            <p className="overflow-auto">{decodeURIComponent(audio.file.name).split('/').pop()}</p>
              <button 
                onClick={(event) => removeAudio(event, audio.preview)} 
                className="rounded-full text-red-500"
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