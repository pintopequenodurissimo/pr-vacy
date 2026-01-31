import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const accepted = localStorage.getItem("cookies_accepted");
    if (!accepted) {
      // Show with a small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookies_accepted", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border shadow-2xl animate-in slide-in-from-bottom duration-500">
      <div className="container max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="p-2 bg-primary/10 rounded-full shrink-0 hidden sm:block">
            <Cookie className="w-5 h-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            Utilizamos cookies para personalizar conteúdo e anúncios, fornecer recursos de mídia social e analisar nosso tráfego. Ao continuar navegando, você concorda com a nossa política de privacidade.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
          <Button 
            onClick={handleAccept} 
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20"
          >
            Aceitar e Continuar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
