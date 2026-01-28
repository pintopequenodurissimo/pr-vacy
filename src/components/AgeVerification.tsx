import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import privacyLogo from "@/assets/privacy-logo-png_seeklogo-648492.png";

interface AgeVerificationProps {
  onVerified: () => void;
}

const AgeVerification = ({ onVerified }: AgeVerificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleConfirm = () => {
    localStorage.setItem("age_verified", "true");
    setIsVisible(false);
    onVerified();
  };

  const handleDeny = () => {
    window.location.href = "https://www.google.com";
  };

  useEffect(() => {
    const verified = localStorage.getItem("age_verified");
    if (verified === "true") {
      setIsVisible(false);
      onVerified();
    }
  }, [onVerified]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-center animate-in fade-in zoom-in duration-300 overflow-hidden">
        <div className="mx-auto mb-4 sm:mb-6 flex justify-center h-28 sm:h-32 overflow-hidden">
          <img
            src={privacyLogo}
            alt="Privacy logo"
            className="w-48 sm:w-56 h-48 sm:h-56 object-contain object-top -translate-y-2 sm:-translate-y-3"
          />
        </div>
        
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
          Verificação de Idade
        </h2>
        
        <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6">
          Este site contém conteúdo adulto destinado apenas para maiores de 18 anos.
        </p>

        <div className="bg-muted/50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <p className="text-foreground font-medium text-sm sm:text-base">
            Você tem 18 anos ou mais?
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:gap-3">
          <Button
            onClick={handleConfirm}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 sm:py-6 text-sm sm:text-base"
          >
            Sim, tenho 18+
          </Button>
          <Button
            onClick={handleDeny}
            variant="outline"
            className="w-full border-border text-foreground hover:bg-muted py-4 sm:py-6 text-sm sm:text-base"
          >
            Não, sou menor
          </Button>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6">
          Ao clicar em "Sim, tenho 18+", você confirma que tem idade legal para visualizar conteúdo adulto.
        </p>
      </div>
    </div>
  );
};

export default AgeVerification;
