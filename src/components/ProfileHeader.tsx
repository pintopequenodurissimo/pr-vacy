import { Image, Video, Heart, BadgeCheck } from "lucide-react";
import bannerImage from "@/assets/banner.jpg";
import profileImage from "@/assets/profile.jpg";

interface ProfileHeaderProps {
  onOpenSubscriptionModal: () => void;
}

const ProfileHeader = ({ onOpenSubscriptionModal }: ProfileHeaderProps) => {
  return (
    <div className="card-elevated overflow-hidden">
      {/* Banner */}
      <div className="relative h-32 sm:h-40 md:h-56 overflow-hidden">
        <img
          src={bannerImage}
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        
        {/* Stats overlay */}
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-white/90 text-xs sm:text-sm font-medium">
          <h2 className="text-sm sm:text-lg md:text-xl font-bold text-white">Japinha do Pijama</h2>
        </div>
        
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-2 sm:gap-4 text-white/90 text-xs sm:text-sm">
          <span className="flex items-center gap-0.5 sm:gap-1">
            <Image size={14} className="sm:hidden" />
            <Image size={16} className="hidden sm:block" /> 
            <span className="hidden sm:inline">156</span>
          </span>
          <span className="flex items-center gap-0.5 sm:gap-1">
            <Video size={14} className="sm:hidden" />
            <Video size={16} className="hidden sm:block" /> 
            <span className="hidden sm:inline">42</span>
          </span>
          <span className="flex items-center gap-0.5 sm:gap-1">
            <Heart size={14} className="sm:hidden" />
            <Heart size={16} className="hidden sm:block" /> 
            <span className="hidden sm:inline">8.2K</span>
          </span>
        </div>
      </div>

      {/* Profile picture */}
      <div className="relative flex justify-center sm:justify-start px-4 sm:px-6 md:px-8">
        <div className="absolute -top-14 sm:-top-16 md:-top-20 left-1/2 -translate-x-1/2 sm:left-6 sm:translate-x-0 md:left-8">
          <div className="relative">
            <button
              onClick={onOpenSubscriptionModal}
              className="group w-28 sm:w-32 md:w-36 h-28 sm:h-32 md:h-36 rounded-full border-[3px] sm:border-4 border-primary overflow-hidden bg-card cursor-pointer transition-transform transition-shadow duration-300 ease-out hover:scale-110 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/40"
            >
              <img
                src={profileImage}
                alt="Japinha do Pijama"
                className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-110 group-hover:brightness-110"
              />
            </button>
            <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 -translate-x-1/2 z-10">
              <span className="badge-live relative whitespace-nowrap text-xs shadow-lg shadow-red-500/50 animate-live-glow">
                AO VIVO AGORA
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile info */}
      <div className="pt-20 sm:pt-24 md:pt-20 pb-4 sm:pb-6 px-4 sm:px-6 md:px-8 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-1 sm:gap-2 mb-1">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground">Japinha do Pijama</h3>
          <BadgeCheck className="w-5 h-5 text-primary fill-primary text-white" />
        </div>
        <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4">@japinhadopijama</p>
        
        <p className="text-foreground text-sm sm:text-base mb-2">
          A japinha mais brasileira que você vai ver!! 🇧🇷 aqui você pode me conhecer melhor!! 😘
        </p>
        <p className="text-primary font-medium text-xs sm:text-sm">
          Conteúdo exclusivo e sem censura 💖 😈
        </p>
      </div>

    </div>
  );
};

export default ProfileHeader;
