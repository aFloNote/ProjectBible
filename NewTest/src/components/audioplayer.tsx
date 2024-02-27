import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { FaUndo, FaRedo, FaPlay, FaPause,FaDownload } from 'react-icons/fa';
import {Button} from '@/components/ui/button';

interface AudioProps {
  audio_link: string;
}

export function Audio({ audio_link }: AudioProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const playerRef = useRef<ReactPlayer>(null);
  const b2endpoint = import.meta.env.VITE_REACT_B2_ENDPOINT;

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleFastForward = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10, 'seconds');
    }
  };

  const handleRewind = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10, 'seconds');
    }
  };

  const handleProgress = (state: { played: number, playedSeconds: number }) => {
    setPlayed(state.played);
    setPlayedSeconds(state.playedSeconds);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [h, m > 9 ? m : h ? '0' + m : m || '0', s > 9 ? s : '0' + s].filter(Boolean).join(':');
  };
  const [playbackRate, setPlaybackRate] = useState(1.0); // new state variable for playback speed
  const [showSpeedControl, setShowSpeedControl] = useState(false); // new state variable for showing/hiding speed control

  // ... existing functions ...

  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPlaybackRate(parseFloat(e.target.value));
  };
  

  return (
    <div>
      <ReactPlayer
        ref={playerRef}
        url={b2endpoint + audio_link}
        playing={isPlaying}
        controls={false}
        onProgress={handleProgress}
        onDuration={handleDuration}
        playbackRate={playbackRate}
        width="100%"
        height="10px"
        config={{
          file: {
            attributes: {
              preload: 'auto',
            },
          },
        }}
      />
      <div className='flex justify-center items-center'>
  <span className='pr-2'>{formatTime(playedSeconds)}</span>
  <input
    type="range"
    min={0}
    max={1}
    step="any"
    value={played}
    onChange={(e) => playerRef.current?.seekTo(parseFloat(e.target.value), 'fraction')}
    style={{ width: '60%' }}
  />
  <span className='pl-2'>{formatTime(duration)}</span>
</div>
      <div className="flex justify-center space-x-2">
      <button className='text-2xl p-4 text-sm' onClick={() => setShowSpeedControl(!showSpeedControl)}>{playbackRate}x</button>
      {showSpeedControl && (
        <div className="absolute bg-white p-4 rounded shadow-lg">
          <label htmlFor="playbackRate">Playback Speed:</label>
          <select id="playbackRate" value={playbackRate} onChange={handleSpeedChange}>
            <option value="0.5">0.5x</option>
            <option value="1.0">1.0x</option>
            <option value="1.5">1.5x</option>
            <option value="2.0">2.0x</option>
          </select>
        </div>
      )}
        <button className='text-2xl p-4' onClick={handleRewind}><FaUndo /></button>
        <button className='text-2xl p-4' onClick={togglePlayPause}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button className='text-2xl p-4' onClick={handleFastForward}><FaRedo /></button>
        <Button variant='ghost' onClick={() => window.location.href = `${b2endpoint + audio_link}?download=true`}><FaDownload /></Button>
        

      </div>
    </div>
  );
}