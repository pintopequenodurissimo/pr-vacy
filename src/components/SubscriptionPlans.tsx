import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface SubscriptionPlansProps {
  onSubscribe?: (plan: 'monthly' | 'quarterly' | 'annual') => void;
}

const SubscriptionPlans = ({ onSubscribe }: SubscriptionPlansProps) => {
  const [showPromos, setShowPromos] = useState(true);

  const handleSubscribe = (plan: 'monthly' | 'quarterly' | 'annual') => {
    if (onSubscribe) {
      onSubscribe(plan);
    }
  };

  return (
    <div id="subscription-plans" className="card-elevated p-4 sm:p-6">
      <h4 className="text-base sm:text-lg font-semibold text-foreground mb-4">Assine agora:</h4>

      {/* Featured plan - Monthly */}
      <div className="mb-4" onClick={() => handleSubscribe('monthly')}>
        <span className="badge-popular mb-2 inline-flex items-center gap-1 text-xs sm:text-sm">
          MAIS POPULAR 🔥
        </span>
        <div className="plan-card-featured flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 cursor-pointer">
          <div>
            <p className="font-bold text-base sm:text-lg">ACESSO MENSAL</p>
            <p className="text-xs sm:text-sm opacity-90">+ ACESSO AS LIVES DIÁRIAS!</p>
          </div>
          <p className="text-lg sm:text-xl font-bold whitespace-nowrap">R$ 29,90</p>
        </div>
      </div>

      {/* Promotions section */}
      <div className="border border-border rounded-xl overflow-hidden">
        <button
          onClick={() => setShowPromos(!showPromos)}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between bg-card hover:bg-muted/50 transition-colors"
        >
          <span className="font-medium text-foreground text-sm sm:text-base">Promoções</span>
          <ChevronDown
            className={`text-muted-foreground transition-transform ${
              showPromos ? "rotate-180" : ""
            }`}
            size={18}
          />
        </button>

        {showPromos && (
          <div className="border-t border-border">
            {/* Quarterly plan */}
            <div className="plan-card m-2 sm:m-3 mb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 cursor-pointer" onClick={() => handleSubscribe('quarterly')}>
              <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-xs sm:text-sm line-clamp-2">ACESSO TRIMESTRAL (25% OFF)</p>
                  <span className="badge-promo text-xs">Economia</span>
                </div>
              </div>
              <p className="text-base sm:text-lg font-bold text-primary whitespace-nowrap">R$ 69,90</p>
            </div>

            {/* Annual plan */}
            <div className="plan-card m-2 sm:m-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 cursor-pointer" onClick={() => handleSubscribe('annual')}>
              <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-xs sm:text-sm line-clamp-2">ACESSO ANUAL (60% OFF)</p>
                  <span className="badge-promo text-xs">Melhor Oferta</span>
                </div>
              </div>
              <p className="text-base sm:text-lg font-bold text-primary whitespace-nowrap">R$ 149,90</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
