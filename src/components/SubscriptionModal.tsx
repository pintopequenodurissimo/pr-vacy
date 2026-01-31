import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import { useState, useEffect } from "react";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe?: (plan: 'monthly' | 'quarterly' | 'annual') => void;
}

const SubscriptionModal = ({ isOpen, onClose, onSubscribe }: SubscriptionModalProps) => {
  const [step, setStep] = useState<'intro' | 'plans'>('intro');

  useEffect(() => {
    if (isOpen) {
      setStep('intro');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNextStep = () => {
    setStep('plans');
  };

  const handleSubscribe = (plan: 'monthly' | 'quarterly' | 'annual') => {
    if (onSubscribe) {
      onSubscribe(plan);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-center animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X size={24} className="text-foreground" />
          </button>
        </div>

        {step === 'intro' ? (
          <>
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
              onClick={handleNextStep}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 sm:py-6 text-sm sm:text-base"
            >
              Entendi, vou assinar!
            </Button>
          </>
        ) : (
          <div className="text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 text-center">
              Escolha seu plano
            </h2>
            <SubscriptionPlans onSubscribe={handleSubscribe} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionModal;
