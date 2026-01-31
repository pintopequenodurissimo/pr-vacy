import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import instagramIcon from '@/assets/instagram-icon.png'; // Assuming you might want an app icon

interface AndroidNotificationProps {
  show: boolean;
  onClose: () => void;
  onClick: () => void;
  title: string;
  message: string;
  appName?: string;
  time?: string;
}

const AndroidNotification = ({
  show,
  onClose,
  onClick,
  title,
  message,
  appName = "Privacy",
  time = "agora"
}: AndroidNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      requestAnimationFrame(() => setIsAnimating(true));
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300); // Wait for slide-up animation
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!isVisible) return null;

  return (
    <div 
      className={cn(
        "fixed top-2 left-2 right-2 z-[100] transition-all duration-500 ease-in-out transform",
        isAnimating ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      )}
    >
      <div 
        onClick={onClick}
        className="bg-[#2C2C2C] text-white rounded-2xl p-4 shadow-2xl w-full max-w-sm mx-auto cursor-pointer border border-white/5 backdrop-blur-md"
        style={{ fontFamily: 'Roboto, sans-serif' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
             <div className="w-5 h-5 bg-primary rounded-md flex items-center justify-center text-[10px] font-bold">
               P
             </div>
            <span className="text-xs text-gray-400 font-medium">{appName}</span>
            <span className="text-xs text-gray-500">• {time}</span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <span className="sr-only">Fechar</span>
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          </button>
        </div>

        {/* Content */}
        <div className="flex gap-3">
          <div className="flex-1">
            <h4 className="font-bold text-sm mb-0.5">{title}</h4>
            <p className="text-sm text-gray-300 leading-tight">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AndroidNotification;
