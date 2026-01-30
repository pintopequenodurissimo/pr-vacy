import { Lock } from "lucide-react";
import CustomVideoPlayer from "./CustomVideoPlayer";
import preview1 from "@/assets/preview1.jpg";
import preview2 from "@/assets/preview2.jpg";
import preview3 from "@/assets/preview3.jpg";
import preview4 from "@/assets/preview4.jpg";
import preview5 from "@/assets/preview5.jpg";
import preview6 from "@/assets/preview6.jpg";
import video1 from "@/assets/video_previews/0130(1).mp4";
import video2 from "@/assets/video_previews/0130(2).mp4";

const previews = [
  { id: 'v1', type: 'video', src: video1 },
  { id: 'v2', type: 'video', src: video2 },
  { id: 1, type: 'image', src: preview1 },
  { id: 2, type: 'image', src: preview2 },
  { id: 3, type: 'image', src: preview3 },
  { id: 4, type: 'image', src: preview4 },
  { id: 5, type: 'image', src: preview5 },
  { id: 6, type: 'image', src: preview6 },
];

const PreviewFeed = () => {
  return (
    <div className="card-elevated p-4 sm:p-6">
      <h4 className="text-base sm:text-lg font-semibold text-foreground mb-4">Prévia do conteúdo:</h4>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3">
        {previews.map((preview) => (
          preview.type === 'video' ? (
            <div key={preview.id} className="preview-image">
              <CustomVideoPlayer src={preview.src} />
            </div>
          ) : (
            <div key={preview.id} className="preview-image group cursor-pointer">
              <img
                src={preview.src}
                alt={`Preview ${preview.id}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="preview-blur">
                <div className="text-center">
                  <Lock className="text-white/80 mx-auto mb-1 sm:mb-2 w-5 sm:w-7 h-5 sm:h-7" />
                  <p className="text-white/90 text-xs sm:text-sm font-medium">Desbloqueie</p>
                </div>
              </div>
            </div>
          )
        ))}
      </div>

      <p className="text-center text-muted-foreground text-xs sm:text-sm mt-4">
        Assine para ver todo o conteúdo exclusivo 💋
      </p>
    </div>
  );
};

export default PreviewFeed;
