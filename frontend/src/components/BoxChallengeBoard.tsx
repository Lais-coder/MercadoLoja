import { Trophy } from 'lucide-react';
import type { BoxChallenge, Store } from '../types';
import BoxChallengeCard from './BoxChallengeCard';

interface Props {
  challenges: BoxChallenge[];
}

export default function BoxChallengeBoard({ challenges }: Props) {
  const valid = challenges.filter((c) => c.store);
  if (valid.length === 0) return null;

  return (
    <section id="desafios" className="section bg-navy text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-4 border-yellow-cta" />
        <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full border-4 border-white" />
      </div>

      <div className="container-main relative">
        <div className="section-header mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-7 h-7 text-yellow-cta" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Desafios do Mercado</h2>
            </div>
            <p className="text-white/70 text-sm max-w-xl leading-relaxed">
              Visite os boxes, participe das missões e ganhe descontos exclusivos!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {valid.map((challenge) => (
            <BoxChallengeCard key={challenge.id} challenge={challenge} store={challenge.store!} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface StoreSectionProps {
  store: Store;
  challenges: BoxChallenge[];
}

export function StoreChallengeSection({ store, challenges }: StoreSectionProps) {
  if (challenges.length === 0) return null;

  return (
    <section id="desafios" className="section bg-surface-muted/40">
      <div className="container-main">
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="w-6 h-6 text-yellow-cta" />
          <div>
            <h2 className="heading-section">Desafio desta loja</h2>
            <p className="text-muted text-sm mt-1">
              Visite o Box {store.boxNumber} e resgate seu desconto!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
          {challenges.map((challenge) => (
            <BoxChallengeCard
              key={challenge.id}
              challenge={challenge}
              store={store}
              showStoreLink={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
