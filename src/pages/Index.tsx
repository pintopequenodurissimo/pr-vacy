import { useState, useCallback, useEffect } from "react";
import Header from "@/components/Header";
import ProfileHeader from "@/components/ProfileHeader";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import PreviewFeed from "@/components/PreviewFeed";
import AgeVerification from "@/components/AgeVerification";
import SubscriptionModal from "@/components/SubscriptionModal";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

const Index = () => {
  const [isVerified, setIsVerified] = useState(() => {
    return localStorage.getItem("age_verified") === "true";
  });

  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);

  const openSubscriptionModal = useCallback(() => {
    setIsSubscriptionOpen(true);
  }, []);

  const handleVerified = useCallback(() => {
    setIsVerified(true);
  }, []);

  useEffect(() => {
    // Mostra o toast apenas uma vez por navegador
    const alreadyShown = localStorage.getItem("remote_mode_toast_shown") === "true";
    if (alreadyShown) return;

    const delayMs = 5000 + Math.random() * 10000; // entre 5 e 15 segundos

    const timeoutId = setTimeout(() => {
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

      localStorage.setItem("remote_mode_toast_shown", "true");
    }, delayMs);

    return () => clearTimeout(timeoutId);
  }, [openSubscriptionModal]);

  return (
    <div className="min-h-screen bg-background">
      <SubscriptionModal isOpen={isSubscriptionOpen} onClose={() => setIsSubscriptionOpen(false)} />

      {!isVerified && <AgeVerification onVerified={handleVerified} />}
      
      <Header />
      
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-2xl">
        <div className="space-y-3 sm:space-y-4">
          <ProfileHeader onOpenSubscriptionModal={openSubscriptionModal} />
          <SubscriptionPlans />
          <PreviewFeed />
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
