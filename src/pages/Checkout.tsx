import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, ShieldCheck, Lock, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import profileImage from "@/assets/profile.jpg";
import Header from "@/components/Header";
import { toast } from "@/hooks/use-toast";

const PLANS = {
  monthly: {
    name: "Plano Mensal",
    price: 29.90,
    discount: 0
  },
  quarterly: {
    name: "Plano Trimestral",
    price: 69.90,
    discount: 19.80 // (29.90 * 3) - 69.90
  },
  annual: {
    name: "Plano Anual",
    price: 149.90,
    discount: 208.90 // (29.90 * 12) - 149.90
  }
};

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Default to monthly if no plan is provided
  const planKey = (location.state?.plan as keyof typeof PLANS) || 'monthly';
  const selectedPlan = PLANS[planKey];

  const handleFinishPurchase = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      // Aqui você pode adicionar o redirecionamento ou mensagem de sucesso
      toast({
        title: "Compra realizada com sucesso!",
        description: "Seu acesso foi liberado.",
      });
      navigate("/@japinhadopijama");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Overlay de carregamento */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
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

      <Header />

      <div className="flex flex-col items-center p-4">
        {/* Header */}
        <header className="w-full max-w-md flex flex-col items-center mb-6 gap-4">
          <div className="w-full flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold">Checkout Seguro</h1>
          </div>
        </header>

        <div className="w-full max-w-md space-y-6">
        {/* Order Summary */}
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <div className="flex items-center gap-4 mb-4 border-b border-border pb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
              <img 
                src={profileImage} 
                alt="Japinha do Pijama" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-bold text-lg">Japinha do Pijama</h2>
              <p className="text-sm text-muted-foreground">{selectedPlan.name}</p>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{selectedPlan.name}</span>
              <span className="font-medium">
                R$ {(selectedPlan.price + selectedPlan.discount).toFixed(2).replace('.', ',')}
              </span>
            </div>
            {selectedPlan.discount > 0 && (
              <div className="flex justify-between text-sm text-success font-medium">
                <span>Desconto</span>
                <span>- R$ {selectedPlan.discount.toFixed(2).replace('.', ',')}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-border">
            <span className="font-bold text-lg">Total</span>
            <span className="font-bold text-2xl text-primary">
              R$ {selectedPlan.price.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>

        {/* Payment Method Placeholder */}
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Método de Pagamento
          </h3>
          
          <div className="space-y-3">
            <div className="p-3 border border-primary bg-primary/5 rounded-lg flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-4 border-primary bg-background"></div>
                <span className="font-medium">Cartão de Crédito</span>
              </div>
              <div className="flex gap-1">
                <div className="w-8 h-5 bg-muted rounded"></div>
                <div className="w-8 h-5 bg-muted rounded"></div>
              </div>
            </div>
            
            <div className="p-3 border border-border rounded-lg flex items-center gap-3 opacity-60 cursor-not-allowed">
              <div className="w-4 h-4 rounded-full border border-muted-foreground"></div>
              <span className="font-medium">PIX</span>
            </div>
          </div>

          {/* Form Fields Placeholder */}
          <div className="mt-4 space-y-3">
             <input 
              type="text" 
              placeholder="Número do Cartão" 
              className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <div className="flex gap-3">
              <input 
                type="text" 
                placeholder="MM/AA" 
                className="w-1/2 p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <input 
                type="text" 
                placeholder="CVV" 
                className="w-1/2 p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <input 
              type="text" 
              placeholder="Nome no Cartão" 
              className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Security Badges */}
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <ShieldCheck className="h-4 w-4" />
            <span>Pagamento Seguro</span>
          </div>
          <div className="flex items-center gap-1">
            <Lock className="h-4 w-4" />
            <span>Dados Criptografados</span>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          className="w-full py-6 text-lg font-bold shadow-lg shadow-primary/20"
          onClick={handleFinishPurchase}
          disabled={isProcessing}
        >
          Finalizar Compra
        </Button>
      </div>
    </div>
    </div>
  );
};

export default Checkout;
