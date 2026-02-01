import { useState, useEffect } from "react";
import { Star, User, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Review {
  id: number;
  rating: number;
  comment: string;
  time: string;
}

const REVIEWS: Review[] = [
  {
    id: 1,
    rating: 5,
    comment: "Que rabão do caralho, chupava esse cuzinho até o talo 🤤🤤",
    time: "há 2 horas"
  },
  {
    id: 2,
    rating: 5,
    comment: "Puta que pariu, que vontade de gozar bem na sua cara vadiazinha 💦💦",
    time: "há 5 horas"
  },
  {
    id: 3,
    rating: 4,
    comment: "Essa buceta deve ser apertadinha demais, sonho de consumo... 😈",
    time: "há 1 dia"
  },
  {
    id: 4,
    rating: 5,
    comment: "Gostosa da porra, batendo uma pra você agora mesmo aqui no banheiro 🍆✊",
    time: "há 2 dias"
  },
  {
    id: 5,
    rating: 5,
    comment: "Vadia safada, mostra esse cuzinho rosa pra gente logo... 🔥🔥",
    time: "há 3 dias"
  }
];

const Reviews = () => {
  const [showLockModal, setShowLockModal] = useState(false);

  useEffect(() => {
    if (showLockModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showLockModal]);

  const handleViewAllClick = () => {
    setShowLockModal(true);
  };

  const handleGoToPlans = () => {
    setShowLockModal(false);
    const plansSection = document.getElementById('subscription-plans');
    if (plansSection) {
      plansSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-4 relative">
      <div className="flex items-center justify-between px-2">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Star className="w-5 h-5 fill-primary text-primary" />
          Avaliações Recentes
        </h3>
        <span className="text-sm text-muted-foreground">
          4.9 de 5.0 (1.2k avaliações)
        </span>
      </div>

      <div className="grid gap-4">
        {REVIEWS.map((review) => (
          <div 
            key={review.id} 
            className="card-elevated p-4 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Anônimo</p>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i}
                        className={cn(
                          "w-3 h-3",
                          i < review.rating 
                            ? "fill-primary text-primary" 
                            : "fill-muted text-muted"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{review.time}</span>
            </div>
            
            <p className="text-sm text-foreground/90 leading-relaxed">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
      
      <div className="text-center pt-2">
        <button 
          onClick={handleViewAllClick}
          className="text-primary text-sm font-medium hover:underline"
        >
          Ver todas as 1.243 avaliações
        </button>
      </div>

      {/* Lock Modal */}
      {showLockModal && (
        <div className="fixed inset-0 w-screen h-screen z-[2147483647] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 top-0 left-0 right-0 bottom-0">
          <div className="bg-card rounded-xl p-6 max-w-sm w-full shadow-2xl border border-border animate-in zoom-in-95 duration-200 relative z-[2147483647]">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-bold text-lg text-black">Conteúdo Bloqueado</h3>
                <p className="text-sm text-black">
                  Para ver todas as avaliações e deixar o seu comentário, você precisa ser um assinante ativo.
                </p>
              </div>

              <Button 
                onClick={handleGoToPlans}
                className="w-full font-semibold"
              >
                Ver Planos Disponíveis
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
