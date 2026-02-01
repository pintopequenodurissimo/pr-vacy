import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck, Lock, Loader2, Copy, Check, QrCode } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import profileImage from "@/assets/profile.jpg";
import Header from "@/components/Header";
import { toast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    document: ""
  });
  const [pixData, setPixData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  
  // Default to monthly if no plan is provided
  const planKey = (location.state?.plan as keyof typeof PLANS) || 'monthly';
  const selectedPlan = PLANS[planKey];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFinishPurchase = async () => {
    if (!formData.name || !formData.email || !formData.document) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os dados para continuar.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulation of 3 seconds delay for "creating payment" animation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await fetch('/api/privacy/checkout/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: planKey,
          customer: formData
        }),
      });

      const responseText = await response.text();
      console.log('Raw API Response:', responseText);

      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error('Failed to parse JSON:', e);
        throw new Error('Resposta inválida do servidor: ' + responseText);
      }

      console.log('API Response (Genesys/Native):', data);

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao criar pagamento');
      }

      setPixData(data);
      toast({
        title: "PIX Gerado!",
        description: "Realize o pagamento para liberar seu acesso.",
      });

    } catch (error) {
      console.error(error);
      toast({
        title: "Erro no pagamento",
        description: "Não foi possível gerar o PIX. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    // Check for nested pix payload structure from Genesys
    const code = pixData?.pix?.payload || pixData?.qrcode || pixData?.qr_code || pixData?.emv || pixData?.copy_paste;
    
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      toast({ title: "Copiado!", description: "Código PIX copiado para a área de transferência." });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Extract QR Code string/url from response safely
  // Genesys response structure: { pix: { payload: "..." } }
  const qrCodeString = pixData?.pix?.payload || pixData?.qrcode || pixData?.qr_code || pixData?.emv || pixData?.copy_paste || "";

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
              Criando pagamento PIX...
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

        {!pixData ? (
          <>
            {/* Payment Method - Only PIX */}
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <QrCode className="h-5 w-5 text-primary" />
                Método de Pagamento
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className="p-3 border-2 border-primary bg-primary/5 rounded-lg flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-4 border-primary bg-background"></div>
                    <span className="font-medium">PIX (Instantâneo)</span>
                  </div>
                  <div className="flex gap-1">
                    <QrCode className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input 
                      id="name"
                      name="name"
                      placeholder="Seu nome" 
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com" 
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="document">CPF</Label>
                    <Input 
                      id="document"
                      name="document"
                      placeholder="000.000.000-00" 
                      value={formData.document}
                      onChange={handleInputChange}
                    />
                 </div>
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
              Gerar PIX
            </Button>
          </>
        ) : (
          /* PIX Display Area */
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Pedido Criado!</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Escaneie o QR Code abaixo para pagar
              </p>
            </div>

            <div className="flex justify-center mb-6 bg-white p-4 rounded-xl w-fit mx-auto">
              <QRCodeSVG value={qrCodeString} size={200} />
            </div>

            <div className="space-y-2">
              <Label className="text-center block text-muted-foreground">Copia e Cola</Label>
              <div className="flex gap-2">
                <Input value={qrCodeString} readOnly className="bg-muted" />
                <Button size="icon" variant="outline" onClick={copyToClipboard}>
                  {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-6">
              Após o pagamento, seu acesso será liberado automaticamente em alguns segundos.
            </p>
          </div>
        )}

        </div>
      </div>
    </div>
  );
};

export default Checkout;
