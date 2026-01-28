import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionModal = ({ isOpen, onClose }: SubscriptionModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-center animate-in fade-in zoom-in duration-300">
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X size={24} className="text-foreground" />
          </button>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
          Conteúdo Exclusivo
        </h2>

        <p className="text-muted-foreground text-sm sm:text-base mb-6">
          Para assistir às lives em tempo real e acessar todo o conteúdo exclusivo, você precisa assinar o Privacy!
        </p>

        <div className="bg-primary/10 rounded-lg p-4 mb-6">
          <p className="text-foreground font-semibold mb-2">
            🎬 Acesso completo às lives diárias
          </p>
          <p className="text-foreground font-semibold">
            💖 Conteúdo exclusivo sem censura
          </p>
        </div>

        <Button
          onClick={onClose}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 sm:py-6 text-sm sm:text-base"
        >
          Entendi, vou assinar!
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionModal;
