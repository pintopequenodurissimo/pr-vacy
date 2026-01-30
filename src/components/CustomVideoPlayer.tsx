import { useRef, useState, useEffect } from "react";
import { Play, Pause, Lock } from "lucide-react";

interface CustomVideoPlayerProps {
  src: string;
  poster?: string;
}

const CustomVideoPlayer = ({ src, poster }: CustomVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    // Force mute to ensure it stays muted
    video.muted = true;
    
    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  return (
    <div className="relative group w-full h-full aspect-square bg-black rounded-lg overflow-hidden cursor-pointer" onClick={togglePlay}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        muted
        playsInline
        loop
        // No controls attribute to hide default controls
      />
      
      {/* Custom Overlay */}
      <div className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-200 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
        <div className="bg-black/50 p-3 rounded-full backdrop-blur-sm">
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white fill-white" />
          ) : (
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          )}
        </div>
      </div>

      {/* Locked overlay for consistency with other previews if needed, but for now just player */}
      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1">
        <Lock className="w-3 h-3 text-white/90" />
        <span className="text-[10px] font-bold text-white/90 uppercase">Preview</span>
      </div>
    </div>
  );
};

export default CustomVideoPlayer;
