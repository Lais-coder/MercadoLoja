import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Shirt,
  Users,
  Megaphone,
  Package,
  UserPlus,
  Sparkles,
  KeyRound,
  Pencil,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { api, formatPrice, getCategoryLabel, getStoreRevistaUrl, resolveMediaUrl } from '../../services/api';
import type {
  Store,
  CatalogItem,
  Employee,
  StorePromotion,
  CreateCatalogData,
  UpdateCatalogData,
  StoreUser,
} from '../../types';
import EmployeeFormModal from '../../components/admin/EmployeeFormModal';
import PromotionFormModal from '../../components/admin/PromotionFormModal';
import ProductFormModal from '../../components/admin/ProductFormModal';
import StoreAccessFormModal from '../../components/admin/StoreAccessFormModal';
import ConfirmModal from '../../components/ui/ConfirmModal';

type ModalType = 'employee' | 'promotion' | 'product' | 'access' | null;

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Package;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-navy">{value}</p>
        <p className="text-muted text-sm">{label}</p>
      </div>
    </div>
  );
}

export default function StoreDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [store, setStore] = useState<Store | null>(null);
  const [storeUsers, setStoreUsers] = useState<StoreUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [editingProduct, setEditingProduct] = useState<CatalogItem | null>(null);
  const [productToDelete, setProductToDelete] = useState<CatalogItem | null>(null);
  const [deletingProduct, setDeletingProduct] = useState(false);

  function openProductModal(product?: CatalogItem) {
    setEditingProduct(product ?? null);
    setActiveModal('product');
  }

  function closeProductModal() {
    setActiveModal(null);
    setEditingProduct(null);
  }

  async function confirmDeleteProduct() {
    if (!id || !productToDelete) return;

    setDeletingProduct(true);
    try {
      await api.deleteCatalogItem(id, productToDelete.id);
      loadStore();
      toast.success('Produto excluído com sucesso');
      setProductToDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao excluir produto');
    } finally {
      setDeletingProduct(false);
    }
  }

  function loadStore() {
    if (!id) return;
    Promise.all([api.getStore(id), api.getStoreAccess(id)])
      .then(([storeData, accessData]) => {
        setStore(storeData);
        setStoreUsers(accessData);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar loja'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    setLoading(true);
    loadStore();
  }, [id]);

  if (loading) {
    return <p className="text-muted">Carregando...</p>;
  }

  if (error || !store) {
    return (
      <div className="card p-8 text-center">
        <p className="text-red-600">{error || 'Loja não encontrada'}</p>
        <Link to="/admin/lojas" className="text-link mt-4 inline-flex">
          Voltar para lojas
        </Link>
      </div>
    );
  }

  const products = store.products ?? [];
  const employees = store.employees ?? [];
  const promotions = store.promotions ?? [];
  const productCount = store._count?.products ?? products.length;
  const employeeCount = store._count?.employees ?? employees.length;
  const promotionCount = store._count?.promotions ?? promotions.length;

  return (
    <div>
      <Link to="/admin/lojas" className="text-link mb-6 inline-flex">
        <ArrowLeft className="w-4 h-4" />
        Voltar para lojas
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="avatar-store w-14 h-14 text-lg">{store.avatarLetter}</div>
          <div>
            <h1 className="heading-section">{store.name}</h1>
            <p className="text-muted">
              Box {store.boxNumber} · {getCategoryLabel(store.category)}
            </p>
            {store.slug && (
              <a
                href={getStoreRevistaUrl(store.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link text-sm mt-2 inline-flex"
              >
                Ver revista pública →
              </a>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setActiveModal('product')}
          className="btn-navy"
        >
          <Plus className="w-5 h-5" />
          Adicionar produto
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard
          icon={Package}
          label="Produtos cadastrados"
          value={productCount}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={Users}
          label="Funcionários"
          value={employeeCount}
          color="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          icon={Megaphone}
          label="Chamativos da semana"
          value={promotionCount}
          color="bg-amber-50 text-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
        <section className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-navy flex items-center gap-2">
              <KeyRound className="w-5 h-5" />
              Acesso da Loja
            </h2>
            <button
              type="button"
              onClick={() => setActiveModal('access')}
              className="btn-outline text-xs py-1.5 px-3"
            >
              <UserPlus className="w-4 h-4" />
              Criar acesso
            </button>
          </div>

          {storeUsers.length === 0 ? (
            <p className="text-muted text-sm">
              Nenhum login cadastrado. Crie um acesso para o lojista gerenciar catálogo e revista.
            </p>
          ) : (
            <ul className="divide-y divide-border/60">
              {storeUsers.map((user) => (
                <li key={user.id} className="py-3">
                  <p className="font-medium text-text">{user.name}</p>
                  <p className="text-muted text-sm">{user.email}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-navy flex items-center gap-2">
              <Users className="w-5 h-5" />
              Funcionários
            </h2>
            <button
              type="button"
              onClick={() => setActiveModal('employee')}
              className="btn-outline text-xs py-1.5 px-3"
            >
              <UserPlus className="w-4 h-4" />
              Adicionar
            </button>
          </div>

          {employees.length === 0 ? (
            <p className="text-muted text-sm">Nenhum funcionário cadastrado.</p>
          ) : (
            <ul className="divide-y divide-border/60">
              {employees.map((emp: Employee) => (
                <li key={emp.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-navy/8 flex items-center justify-center text-navy font-semibold text-sm">
                      {emp.name.charAt(0)}
                    </div>
                    <span className="font-medium text-text">{emp.name}</span>
                  </div>
                  {emp.role && (
                    <span className="text-xs text-muted bg-surface-muted px-2.5 py-1 rounded-full">
                      {emp.role}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-navy flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Chamativos da Semana
            </h2>
            <button
              type="button"
              onClick={() => setActiveModal('promotion')}
              className="btn-outline text-xs py-1.5 px-3"
            >
              <Plus className="w-4 h-4" />
              Novo chamativo
            </button>
          </div>

          {promotions.length === 0 ? (
            <p className="text-muted text-sm">Nenhum chamativo cadastrado esta semana.</p>
          ) : (
            <ul className="space-y-3">
              {promotions.map((promo: StorePromotion) => (
                <li
                  key={promo.id}
                  className="p-4 bg-amber-50/60 border border-amber-100 rounded-lg"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-text text-sm">{promo.title}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                        promo.active
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {promo.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  {promo.description && (
                    <p className="text-muted text-xs mt-1.5">{promo.description}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-navy flex items-center gap-2">
            <Shirt className="w-5 h-5" />
            Produtos do Catálogo
          </h2>
          {products.length > 0 && (
            <button
              type="button"
              onClick={() => openProductModal()}
              className="btn-outline text-xs py-1.5 px-3"
            >
              <Plus className="w-4 h-4" />
              Adicionar produto
            </button>
          )}
        </div>

        {products.length === 0 ? (
          <div className="card p-12 text-center">
            <Shirt className="w-12 h-12 text-text-light mx-auto mb-4" />
            <p className="text-text font-semibold mb-2">Nenhum produto cadastrado</p>
            <button
              type="button"
              onClick={() => openProductModal()}
              className="btn-navy mt-4"
            >
              <Plus className="w-5 h-5" />
              Adicionar produto
            </button>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-muted border-b border-border/60">
                    <th className="text-left py-3 px-5 font-semibold text-text-muted">Produto</th>
                    <th className="text-left py-3 px-5 font-semibold text-text-muted">Tamanhos</th>
                    <th className="text-left py-3 px-5 font-semibold text-text-muted hidden sm:table-cell">
                      Descrição
                    </th>
                    <th className="text-right py-3 px-5 font-semibold text-text-muted">Preço</th>
                    <th className="text-right py-3 px-5 font-semibold text-text-muted w-28">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {products.map((item: CatalogItem) => (
                    <tr key={item.id} className="hover:bg-surface-muted/50 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={resolveMediaUrl(item.imageUrl)}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                          <span className="font-medium text-text">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex flex-wrap gap-1.5">
                          {item.sizes.map((s) => (
                            <span
                              key={s}
                              className="text-xs font-semibold text-navy bg-navy/8 px-2 py-0.5 rounded-full"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-5 hidden sm:table-cell">
                        <span className="text-muted line-clamp-1">
                          {item.description || '—'}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right font-semibold text-navy whitespace-nowrap">
                        {item.price > 0 ? formatPrice(item.price) : '—'}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openProductModal(item)}
                            disabled={deletingProduct}
                            title="Editar produto"
                            aria-label="Editar produto"
                            className="p-2 text-text-muted hover:text-navy hover:bg-navy/8 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setProductToDelete(item)}
                            disabled={deletingProduct}
                            title="Excluir produto"
                            aria-label="Excluir produto"
                            className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      <EmployeeFormModal
        open={activeModal === 'employee'}
        onClose={() => setActiveModal(null)}
        onSubmit={async (data) => {
          if (!id) return;
          await api.createEmployee(id, data);
          loadStore();
        }}
      />

      <PromotionFormModal
        open={activeModal === 'promotion'}
        onClose={() => setActiveModal(null)}
        onSubmit={async (data) => {
          if (!id) return;
          await api.createPromotion(id, data);
          loadStore();
        }}
      />

      <ProductFormModal
        open={activeModal === 'product'}
        onClose={closeProductModal}
        product={editingProduct}
        storeCategory={store.category}
        onSubmit={async (data: CreateCatalogData | UpdateCatalogData) => {
          if (!id) return;

          if (editingProduct) {
            await api.updateCatalogItem(id, editingProduct.id, data as UpdateCatalogData);
            loadStore();
            toast.success('Produto atualizado com sucesso');
            return;
          }

          await api.createCatalogItem(id, data as CreateCatalogData);
          loadStore();
          toast.success('Produto cadastrado com sucesso');
        }}
      />

      <StoreAccessFormModal
        open={activeModal === 'access'}
        onClose={() => setActiveModal(null)}
        onSubmit={async (data) => {
          if (!id) return;
          await api.createStoreAccess(id, data);
          loadStore();
        }}
      />

      <ConfirmModal
        open={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        onConfirm={confirmDeleteProduct}
        title="Excluir produto"
        description={
          productToDelete
            ? `Tem certeza que deseja excluir "${productToDelete.name}"? Essa ação não pode ser desfeita.`
            : ''
        }
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        loading={deletingProduct}
        variant="danger"
      />
    </div>
  );
}
