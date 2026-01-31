import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import ProfileHeader from "@/components/ProfileHeader";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import PreviewFeed from "@/components/PreviewFeed";
import Reviews from "@/components/Reviews";
import AgeVerification from "@/components/AgeVerification";
import SubscriptionModal from "@/components/SubscriptionModal";
import AndroidNotification from "@/components/AndroidNotification";
import CookieConsent from "@/components/CookieConsent";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isVerified, setIsVerified] = useState(() => {
    return localStorage.getItem("age_verified") === "true";
  });

  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [showAndroidNotification, setShowAndroidNotification] = useState(false);

  const openSubscriptionModal = useCallback(() => {
    setIsSubscriptionOpen(true);
    setShowAndroidNotification(false);
  }, []);

  const handleVerified = useCallback(() => {
    setIsVerified(true);
  }, []);

  const handleNavigateToCheckout = useCallback((plan: 'monthly' | 'quarterly' | 'annual') => {
    setIsSubscriptionOpen(false);
    setIsCreatingPayment(true);
    setTimeout(() => {
      navigate("/checkout", { state: { plan } });
    }, 3000);
  }, [navigate]);

  useEffect(() => {
    // Mostra o toast apenas uma vez por navegador
    const alreadyShown = localStorage.getItem("remote_mode_toast_shown") === "true";
    if (alreadyShown) return;

    const delayMs = 5000 + Math.random() * 10000; // entre 5 e 15 segundos

    const timeoutId = setTimeout(() => {
      if (isMobile) {
        setShowAndroidNotification(true);
        // Auto hide after 8 seconds if not clicked
        setTimeout(() => setShowAndroidNotification(false), 8000);
      } else {
        toast({
          title: "Modo controle remoto ativado",
          description: "@japinhadopijama acabou de ativar o modo controle remoto agora mesmo.",
          action: (
            <ToastAction
              altText="Ver live no modo controle remoto"
              onClick={() => {
                openSubscriptionModal();
              }}
            >
              Ver live
            </ToastAction>
          ),
        });
      }

      localStorage.setItem("remote_mode_toast_shown", "true");
    }, delayMs);

    return () => clearTimeout(timeoutId);
  }, [openSubscriptionModal, isMobile]);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Overlay de Criando Pagamento */}
      {isCreatingPayment && (
        <div className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="flex flex-col items-center gap-4 animate-in zoom-in-95 duration-300">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
              <Loader2 className="h-16 w-16 text-primary animate-spin relative z-10" />
            </div>
            <h2 className="text-xl font-semibold text-foreground animate-pulse">
              Criando pagamento...
            </h2>
          </div>
        </div>
      )}

      <SubscriptionModal 
        isOpen={isSubscriptionOpen} 
        onClose={() => setIsSubscriptionOpen(false)}
        onSubscribe={handleNavigateToCheckout}
      />

      <AndroidNotification
        show={showAndroidNotification}
        onClose={() => setShowAndroidNotification(false)}
        onClick={openSubscriptionModal}
        title="Modo controle remoto ativado"
        message="@japinhadopijama acabou de ativar o modo controle remoto agora mesmo."
      />

      <CookieConsent />

      {!isVerified && <AgeVerification onVerified={handleVerified} />}
      
      <Header />
      
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-2xl">
        <div className="space-y-3 sm:space-y-4">
          <ProfileHeader onOpenSubscriptionModal={openSubscriptionModal} />
          <SubscriptionPlans onSubscribe={handleNavigateToCheckout} />
          <PreviewFeed />
          <Reviews />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 sm:py-6 text-center text-muted-foreground text-xs sm:text-sm px-4">
        <p>© Privacy 2026. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Index;
