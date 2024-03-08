import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import { FaUndo, FaRedo, FaPlay, FaPause, FaDownload } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { SermonFullType } from "@/types/sermon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";

interface AudioProps {
  audio_link: string;
  sermonFull: SermonFullType[];
}

export function Audio({ audio_link, sermonFull }: AudioProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const playerRef = useRef<ReactPlayer>(null);
  const b2endpoint = import.meta.env.VITE_REACT_B2_ENDPOINT;
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showSpeedControl, setShowSpeedControl] = useState(false);

  const handleSpeedChange = (value: number[]) => {
    setPlaybackRate(value[0]);
  };
  const handleSliderChange = (value: number[]) => {
    setPlayed(value[0]);
    playerRef.current?.seekTo(value[0], "fraction");
  };

  const resetSpeed = () => {
    setPlaybackRate(1.0);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleFastForward = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(
        playerRef.current.getCurrentTime() + 15,
        "seconds"
      );
    }
  };

  const handleRewind = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(
        playerRef.current.getCurrentTime() - 15,
        "seconds"
      );
    }
  };

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    setPlayed(state.played);
    setPlayedSeconds(state.playedSeconds);
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setPositionState({
        duration: duration,
        playbackRate: playbackRate,
        position: state.playedSeconds,
      });
    }
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [h, m > 9 ? m : h ? "0" + m : m || "0", s > 9 ? s : "0" + s]
      .filter(Boolean)
      .join(":");
  };
  useEffect(() => {
    if (
      "mediaSession" in navigator &&
      sermonFull &&
      sermonFull[0] &&
      playerRef.current
    ) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: sermonFull[0].SermonType.title,
        artist: sermonFull[0].AuthorType.name,
        artwork: [
          {
            src:
              b2endpoint +
              encodeURIComponent(sermonFull[0].SeriesType.image_path),
          },
        ],
      });
    }
  }, [sermonFull, b2endpoint]);

  return (
    <div>
      <ReactPlayer
        key={isPlaying ? "playing" : "paused"}
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
              preload: "metadata",
            },
          },
        }}
      />
      <div className="flex justify-center items-center pr-2 pl-2">
        <span className="pr-1">{formatTime(playedSeconds)}</span>
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={[played]}
          onValueChange={handleSliderChange}
          className="w-80"
        />
        <span className="pl-1">{formatTime(duration)}</span>
      </div>
      <div className="flex justify-center space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="text-2xl p-4 text-sm"
              onClick={() => setShowSpeedControl(!showSpeedControl)}
            >
              {playbackRate}x
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <p className="text-md">Playback speed</p>
            <div className="flex justify-between items-center">
              <span>0.5x</span>
              <div className="flex-grow mx-2">
                <Slider
                  defaultValue={[1.0]}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  value={[playbackRate]}
                  onValueChange={handleSpeedChange}
                />
              </div>
              <span>2.0x</span>
            </div>
            <div className="flex justify-center">
              <Button variant="ghost" onClick={resetSpeed}>
                Reset
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <button className="text-2xl p-4" onClick={handleRewind}>
          <FaUndo />
        </button>
        <button className="text-2xl p-4" onClick={togglePlayPause}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button className="text-2xl p-4" onClick={handleFastForward}>
          <FaRedo />
        </button>

        <div className="pt-2">
          <Button
            variant="ghost"
            onClick={() =>
              (window.location.href = `${
                b2endpoint + audio_link
              }?download=true`)
            }
          >
            <FaDownload />
          </Button>
        </div>
      </div>
    </div>
  );
}
