import { useMemo, useState } from 'react';
import {
  Rocket,
  Check,
  PackageOpen,
  Eye,
  MousePointerClick,
  Calendar,
  CreditCard,
  AlertCircle,
} from 'lucide-react';
import FacebookIcon from '../../components/icons/FacebookIcon';
import { useMyStore } from '../../hooks/useMyStore';
import { formatPrice, resolveMediaUrl } from '../../services/api';
import type { CatalogItem } from '../../types';
import Modal from '../../components/ui/Modal';

type Tab = 'produtos' | 'facebook' | 'impulsionar';

const BUDGET_OPTIONS = [
  { value: 10, label: 'R$ 10/dia', reach: '~500 pessoas/dia' },
  { value: 25, label: 'R$ 25/dia', reach: '~1.500 pessoas/dia' },
  { value: 50, label: 'R$ 50/dia', reach: '~4.000 pessoas/dia' },
];

const DURATION_OPTIONS = [
  { value: 7, label: '7 dias' },
  { value: 14, label: '14 dias' },
  { value: 30, label: '30 dias' },
];

export default function StoreBoostPage() {
  const { store, loading, error } = useMyStore();
  const [tab, setTab] = useState<Tab>('produtos');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [facebookLinked, setFacebookLinked] = useState(false);
  const [dailyBudget, setDailyBudget] = useState(25);
  const [duration, setDuration] = useState(7);
  const [successOpen, setSuccessOpen] = useState(false);

  const products = store?.products ?? [];
  const selectedProducts = products.filter((p) => selectedIds.includes(p.id));

  const totalCost = useMemo(() => dailyBudget * duration, [dailyBudget, duration]);
  const costPerProduct = selectedProducts.length > 0 ? totalCost / selectedProducts.length : 0;

  function toggleProduct(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function canGoToFacebook() {
    return selectedIds.length > 0;
  }

  function canBoost() {
    return selectedIds.length > 0 && facebookLinked;
  }

  if (loading) return <p className="text-muted">Carregando...</p>;

  if (error || !store) {
    return (
      <div className="card p-8 text-center">
        <p className="text-red-600">{error || 'Loja não encontrada'}</p>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; step: number }[] = [
    { id: 'produtos', label: 'Selecionar produtos', step: 1 },
    { id: 'facebook', label: 'Vincular Facebook', step: 2 },
    { id: 'impulsionar', label: 'Impulsionar', step: 3 },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <h1 className="heading-section flex items-center gap-2">
              <Rocket className="w-7 h-7 text-navy" />
              Tráfego pago
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
              Demonstração
            </span>
          </div>
          <p className="text-muted text-sm max-w-xl">
            Selecione produtos, vincule ao Facebook e impulsione sua revista. Integração real em
            breve — por enquanto, apenas visualização do fluxo.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map(({ id, label, step }) => {
          const disabled =
            (id === 'facebook' && !canGoToFacebook()) ||
            (id === 'impulsionar' && !canGoToFacebook());

          return (
            <button
              key={id}
              type="button"
              disabled={disabled}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                tab === id
                  ? 'bg-navy text-white'
                  : 'bg-white border border-border/60 text-text-muted hover:border-navy/30'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  tab === id ? 'bg-white/20' : 'bg-navy/8 text-navy'
                }`}
              >
                {step}
              </span>
              {label}
            </button>
          );
        })}
      </div>

      {tab === 'produtos' && (
        <section className="space-y-6">
          <div className="card p-5 flex items-start gap-3 bg-blue-50/50 border-blue-100">
            <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900/80">
              Escolha os produtos que deseja impulsionar. Eles aparecerão com mais destaque na
              revista e, futuramente, em anúncios no Facebook e Instagram.
            </p>
          </div>

          {products.length === 0 ? (
            <div className="card p-12 text-center">
              <PackageOpen className="w-12 h-12 text-text-light mx-auto mb-4" />
              <p className="font-semibold text-text mb-2">Nenhum produto no catálogo</p>
              <p className="text-muted text-sm">Cadastre produtos antes de impulsionar.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted">
                {selectedIds.length} de {products.length} produtos selecionados
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((item: CatalogItem) => {
                  const selected = selectedIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleProduct(item.id)}
                      className={`card p-4 text-left transition-all ${
                        selected
                          ? 'ring-2 ring-navy border-navy/30 bg-navy/3'
                          : 'hover:border-navy/20'
                      }`}
                    >
                      <div className="flex gap-3">
                        <img
                          src={resolveMediaUrl(item.imageUrl)}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-text text-sm line-clamp-2">{item.name}</p>
                          <p className="text-navy font-bold text-sm mt-1">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            selected ? 'bg-navy border-navy text-white' : 'border-border'
                          }`}
                        >
                          {selected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={!canGoToFacebook()}
                  onClick={() => setTab('facebook')}
                  className="btn-navy disabled:opacity-50"
                >
                  Continuar para Facebook
                </button>
              </div>
            </>
          )}
        </section>
      )}

      {tab === 'facebook' && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#1877F2] flex items-center justify-center">
                <FacebookIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-navy text-lg">Meta Business</h2>
                <p className="text-muted text-sm">Facebook & Instagram Ads</p>
              </div>
            </div>

            {!facebookLinked ? (
              <>
                <p className="text-sm text-muted mb-6 leading-relaxed">
                  Vincule sua conta do Facebook para veicular anúncios dos produtos selecionados
                  para pessoas da região de Maracanaú e Fortaleza.
                </p>
                <ul className="space-y-3 mb-6 text-sm text-muted">
                  <li className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-navy" />
                    Mais visualizações na revista
                  </li>
                  <li className="flex items-center gap-2">
                    <MousePointerClick className="w-4 h-4 text-navy" />
                    Cliques direto para WhatsApp
                  </li>
                  <li className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-navy" />
                    Campanhas por período definido
                  </li>
                </ul>
                <button
                  type="button"
                  onClick={() => setFacebookLinked(true)}
                  className="w-full py-3 rounded-lg bg-[#1877F2] text-white font-semibold hover:bg-[#166FE5] transition-colors flex items-center justify-center gap-2"
                >
                  <FacebookIcon className="w-5 h-5" />
                  Conectar com Facebook (demo)
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-semibold text-emerald-800 text-sm">Conta vinculada</p>
                    <p className="text-emerald-700/80 text-xs">Loja {store.name} · Box {store.boxNumber}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFacebookLinked(false)}
                  className="btn-outline text-sm w-full"
                >
                  Desvincular (demo)
                </button>
              </div>
            )}
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-navy mb-4">Prévia do anúncio</h3>
            <div className="border border-border/60 rounded-xl overflow-hidden bg-[#f0f2f5]">
              <div className="p-3 flex items-center gap-2 bg-white border-b border-border/40">
                <div className="avatar-store w-8 h-8 text-xs">{store.avatarLetter}</div>
                <div>
                  <p className="text-xs font-semibold text-text">{store.name}</p>
                  <p className="text-[10px] text-text-muted">Patrocinado · Facebook</p>
                </div>
              </div>
              {selectedProducts[0] ? (
                <>
                  <img
                    src={resolveMediaUrl(selectedProducts[0].imageUrl)}
                    alt=""
                    className="w-full aspect-square object-cover"
                  />
                  <div className="p-3 bg-white">
                    <p className="font-semibold text-sm text-text">{selectedProducts[0].name}</p>
                    <p className="text-navy font-bold text-sm">
                      {formatPrice(selectedProducts[0].price)}
                    </p>
                    {selectedProducts.length > 1 && (
                      <p className="text-xs text-muted mt-1">
                        + {selectedProducts.length - 1} produto(s) na campanha
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-muted text-sm">Selecione produtos na aba anterior</div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 flex justify-between">
            <button type="button" onClick={() => setTab('produtos')} className="btn-outline">
              Voltar
            </button>
            <button
              type="button"
              disabled={!facebookLinked}
              onClick={() => setTab('impulsionar')}
              className="btn-navy disabled:opacity-50"
            >
              Continuar para impulsionar
            </button>
          </div>
        </section>
      )}

      {tab === 'impulsionar' && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h2 className="font-bold text-navy mb-4">Produtos selecionados</h2>
              <ul className="space-y-3">
                {selectedProducts.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 p-3 bg-surface-muted/50 rounded-lg">
                    <img src={resolveMediaUrl(item.imageUrl)} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted">{formatPrice(item.price)}</p>
                    </div>
                    <span className="text-xs font-semibold text-navy shrink-0">
                      ~{formatPrice(costPerProduct)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-6">
              <h2 className="font-bold text-navy mb-4">Orçamento da campanha</h2>
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-semibold text-text mb-3">Investimento diário</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {BUDGET_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setDailyBudget(opt.value)}
                        className={`p-4 rounded-xl border text-left transition-colors ${
                          dailyBudget === opt.value
                            ? 'border-navy bg-navy/5 ring-2 ring-navy/20'
                            : 'border-border hover:border-navy/30'
                        }`}
                      >
                        <p className="font-bold text-navy">{opt.label}</p>
                        <p className="text-xs text-muted mt-1">{opt.reach}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-text mb-3">Duração</p>
                  <div className="flex flex-wrap gap-2">
                    {DURATION_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setDuration(opt.value)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                          duration === opt.value
                            ? 'bg-navy text-white border-navy'
                            : 'bg-white text-text-muted border-border hover:border-navy/40'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6 h-fit sticky top-6">
            <h2 className="font-bold text-navy mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Resumo
            </h2>
            <dl className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <dt className="text-muted">Produtos</dt>
                <dd className="font-semibold">{selectedProducts.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Diário</dt>
                <dd className="font-semibold">{formatPrice(dailyBudget)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Duração</dt>
                <dd className="font-semibold">{duration} dias</dd>
              </div>
              <div className="border-t border-border/60 pt-3 flex justify-between">
                <dt className="font-bold text-text">Total estimado</dt>
                <dd className="font-bold text-navy text-xl">{formatPrice(totalCost)}</dd>
              </div>
            </dl>
            <p className="text-xs text-muted mb-4">
              Valores simulados para demonstração. Pagamento e veiculação real serão integrados
              futuramente.
            </p>
            <button
              type="button"
              disabled={!canBoost()}
              onClick={() => setSuccessOpen(true)}
              className="btn-navy w-full disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Rocket className="w-5 h-5" />
              Impulsionar agora
            </button>
            <button type="button" onClick={() => setTab('facebook')} className="btn-outline w-full mt-3">
              Voltar
            </button>
          </div>
        </section>
      )}

      <Modal open={successOpen} onClose={() => setSuccessOpen(false)} title="Campanha criada (demo)">
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <Rocket className="w-8 h-8 text-emerald-600" />
          </div>
          <p className="font-semibold text-text mb-2">Impulsionamento simulado com sucesso!</p>
          <p className="text-muted text-sm mb-6">
            {selectedProducts.length} produto(s) · {formatPrice(totalCost)} · {duration} dias
            <br />
            Em produção, sua campanha seria enviada ao Facebook Ads.
          </p>
          <button type="button" onClick={() => setSuccessOpen(false)} className="btn-navy">
            Entendi
          </button>
        </div>
      </Modal>
    </div>
  );
}
