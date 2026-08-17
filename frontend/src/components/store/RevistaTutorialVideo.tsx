import { useEffect, useState } from 'react';
import {
  Play,
  Pause,
  Package,
  Star,
  Megaphone,
  Trophy,
  Link2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const steps = [
  {
    title: 'Cadastre produtos no catálogo',
    description:
      'Em Catálogo, adicione fotos, preços e tamanhos. Cada produto aparece na sua revista e na categoria da loja.',
    icon: Package,
    accent: 'bg-blue-500/15 text-blue-700',
  },
  {
    title: 'Destaque na vitrine principal',
    description:
      'Marque até 6 produtos como destaque para aparecerem na página inicial da Revista MercadoFácil.',
    icon: Star,
    accent: 'bg-yellow-100 text-yellow-800',
  },
  {
    title: 'Publique chamativos do dia',
    description:
      'Crie ofertas e promoções em Chamativos para chamar a atenção dos clientes na revista.',
    icon: Megaphone,
    accent: 'bg-pink-500/15 text-pink-700',
  },
  {
    title: 'Crie desafios com cupom',
    description:
      'Em Desafios, monte missões como “Visite o Box” com desconto exclusivo para atrair clientes ao mercado.',
    icon: Trophy,
    accent: 'bg-emerald-500/15 text-emerald-700',
  },
  {
    title: 'Compartilhe sua revista',
    description:
      'Copie o link da sua revista online e envie no WhatsApp, Instagram ou cartazes da loja.',
    icon: Link2,
    accent: 'bg-navy/10 text-navy',
  },
];

const STEP_DURATION_MS = 6000;

export default function RevistaTutorialVideo() {
  const [activeStep, setActiveStep] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;

    const timer = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % steps.length);
    }, STEP_DURATION_MS);

    return () => window.clearInterval(timer);
  }, [playing]);

  const step = steps[activeStep];
  const StepIcon = step.icon;

  function goToStep(index: number) {
    setActiveStep(index);
  }

  function goPrev() {
    setActiveStep((current) => (current - 1 + steps.length) % steps.length);
  }

  function goNext() {
    setActiveStep((current) => (current + 1) % steps.length);
  }

  return (
    <div className="mb-4 max-w-lg">
      <div className="aspect-video rounded-lg overflow-hidden border border-border/60 bg-gradient-to-br from-navy-dark via-navy to-navy-light shadow-sm relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-4 left-4 w-12 h-12 rounded-full border-2 border-yellow-cta" />
          <div className="absolute bottom-4 right-4 w-16 h-16 rounded-full border-2 border-white" />
        </div>

        <div className="relative z-10 h-full flex flex-col p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
            <span className="text-white/80 text-[10px] sm:text-xs font-medium">
              Tutorial · Passo {activeStep + 1} de {steps.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={goPrev}
                className="p-1.5 rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Passo anterior"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPlaying((value) => !value)}
                className="p-1.5 rounded-md bg-yellow-cta text-navy hover:bg-yellow-hover transition-colors"
                aria-label={playing ? 'Pausar tutorial' : 'Reproduzir tutorial'}
              >
                {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
              </button>
              <button
                type="button"
                onClick={goNext}
                className="p-1.5 rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Próximo passo"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center px-1 sm:px-3">
            <div
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center mb-2 sm:mb-3 ${step.accent}`}
            >
              <StepIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-white text-sm sm:text-base font-bold mb-1.5 max-w-xs leading-snug">
              {step.title}
            </h3>
            <p className="text-white/80 text-[11px] sm:text-xs max-w-sm leading-relaxed line-clamp-3">
              {step.description}
            </p>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-2">
            {steps.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => goToStep(index)}
                aria-label={`Ir para o passo ${index + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  index === activeStep ? 'w-5 bg-yellow-cta' : 'w-1.5 bg-white/35 hover:bg-white/55'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="text-muted text-xs mt-2 leading-relaxed">
        Assista aos passos para cadastrar produtos, destacar na vitrine e compartilhar sua revista.
      </p>
    </div>
  );
}
