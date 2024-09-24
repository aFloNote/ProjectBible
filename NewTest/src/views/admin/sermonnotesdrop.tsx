import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';

interface AuthAudioProps {
  onAudioUpdate: (files: File[],fileType:"text") => void;
  audiopath: string;
}

interface AudioWithPreview {
  file: File;
  preview: string;
 
}

export const NotesDrop: React.FC<AuthAudioProps> = ({ onAudioUpdate,audiopath }) => {
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
    onAudioUpdate(newAudios.map(audio => audio.file),'text'); // Add this line
    URL.revokeObjectURL(audioSrc);
  };
  const memoizedOnAudioUpdate = useCallback(onAudioUpdate, []);
  useEffect(() => {
    const files = audio.map(audio => audio.file);
    if (JSON.stringify(prevAudiosRef.current) !== JSON.stringify(files)) {
      onAudioUpdate(files,'text');
    }
  }, [audio, memoizedOnAudioUpdate]);
  useEffect(() => {
    if (audiopath) {
  
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
    accept: { 
		'text/plain': [],      // For .txt files
		'application/pdf': [],  // For .pdf files
		'application/msword': [],  // For .doc files
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [], // For .docx files
		'application/vnd.oasis.opendocument.text': [] // For .odt files
		},
    maxFiles: 1,
  });

  return (
    <div {...getRootProps()} className="cursor-pointer text-black dark:text-white">
      <input {...getInputProps()} />
      {audio.length > 0 ? (
        <div className="flex flex-col items-center">
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
        <p className='flex justify-center'>Drag 'n' or click to add Sermon Notes</p>
      )}
    </div>
  );
};