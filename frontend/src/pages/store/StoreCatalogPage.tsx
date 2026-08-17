import { useState } from 'react';
import { Plus, Shirt, Star, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useMyStore } from '../../hooks/useMyStore';
import { api, formatPrice, resolveMediaUrl } from '../../services/api';
import type { CatalogItem, CreateCatalogData, UpdateCatalogData } from '../../types';
import ProductFormModal from '../../components/admin/ProductFormModal';
import ConfirmModal from '../../components/ui/ConfirmModal';

export default function StoreCatalogPage() {
  const { store, loading, error, reload } = useMyStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CatalogItem | null>(null);
  const [productToDelete, setProductToDelete] = useState<CatalogItem | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  function openCreateModal() {
    setEditingProduct(null);
    setModalOpen(true);
  }

  function openEditModal(item: CatalogItem) {
    setEditingProduct(item);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingProduct(null);
  }

  async function toggleFeatured(item: CatalogItem) {
    if (!store) return;
    setUpdatingId(item.id);
    try {
      await api.updateProductFeatured(store.id, item.id, !item.featured);
      await reload();
      toast.success(item.featured ? 'Produto removido da vitrine' : 'Produto em destaque na revista');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao atualizar destaque');
    } finally {
      setUpdatingId(null);
    }
  }

  async function confirmDelete() {
    if (!store || !productToDelete) return;

    setDeleting(true);
    try {
      await api.deleteCatalogItem(store.id, productToDelete.id);
      await reload();
      toast.success('Produto excluído com sucesso');
      setProductToDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao excluir produto');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <p className="text-muted">Carregando...</p>;

  if (error || !store) {
    return (
      <div className="card p-8 text-center">
        <p className="text-red-600">{error || 'Loja não encontrada'}</p>
      </div>
    );
  }

  const products = store.products ?? [];

  function renderFeaturedAction(item: CatalogItem, layout: 'mobile' | 'desktop') {
    const isBusy = updatingId === item.id || deleting;

    if (layout === 'mobile') {
      return (
        <button
          type="button"
          onClick={() => toggleFeatured(item)}
          disabled={isBusy}
          className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 ${
            item.featured
              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
              : 'bg-surface-muted text-text-muted hover:bg-navy/8 hover:text-navy'
          }`}
        >
          <Star className={`w-4 h-4 ${item.featured ? 'fill-yellow-600' : ''}`} />
          {item.featured ? 'Em destaque na revista' : 'Destacar na revista'}
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={() => toggleFeatured(item)}
        disabled={isBusy}
        title={item.featured ? 'Remover da vitrine' : 'Exibir na vitrine da revista'}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors disabled:opacity-50 ${
          item.featured
            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
            : 'bg-surface-muted text-text-muted hover:bg-navy/8 hover:text-navy'
        }`}
      >
        <Star className={`w-3.5 h-3.5 ${item.featured ? 'fill-yellow-600' : ''}`} />
        {item.featured ? 'Em destaque' : 'Destacar'}
      </button>
    );
  }

  function renderRowActions(item: CatalogItem, layout: 'mobile' | 'desktop') {
    const isBusy = updatingId === item.id || deleting;

    if (layout === 'mobile') {
      return (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => openEditModal(item)}
            disabled={isBusy}
            className="btn-outline w-full text-sm py-2.5"
          >
            <Pencil className="w-4 h-4" />
            Editar
          </button>
          <button
            type="button"
            onClick={() => setProductToDelete(item)}
            disabled={isBusy}
            className="inline-flex items-center justify-center gap-1.5 w-full px-3 py-2.5 rounded-lg text-sm font-semibold border-2 border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            Excluir
          </button>
        </div>
      );
    }

    return (
      <div className="inline-flex items-center justify-end gap-1">
        <button
          type="button"
          onClick={() => openEditModal(item)}
          disabled={isBusy}
          title="Editar produto"
          aria-label="Editar produto"
          className="p-2 text-text-muted hover:text-navy hover:bg-navy/8 rounded-lg transition-colors disabled:opacity-50"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setProductToDelete(item)}
          disabled={isBusy}
          title="Excluir produto"
          aria-label="Excluir produto"
          className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="heading-section flex items-center gap-2">
            <Shirt className="w-7 h-7" />
            Catálogo
          </h1>
          <p className="text-muted mt-1">
            Produtos da {store.name} — marque destaques para a vitrine da revista.
          </p>
        </div>
        <button type="button" onClick={openCreateModal} className="btn-navy">
          <Plus className="w-5 h-5" />
          Adicionar produto
        </button>
      </div>

      {products.length === 0 ? (
        <div className="card p-12 text-center">
          <Shirt className="w-12 h-12 text-text-light mx-auto mb-4" />
          <p className="text-text font-semibold mb-2">Nenhum produto cadastrado</p>
          <p className="text-muted text-sm mb-6">
            Adicione produtos para aparecerem na categoria e na revista.
          </p>
          <button type="button" onClick={openCreateModal} className="btn-navy">
            <Plus className="w-5 h-5" />
            Adicionar produto
          </button>
        </div>
      ) : (
        <>
          <div className="md:hidden space-y-3">
            {products.map((item) => (
              <article key={item.id} className="card p-4">
                <div className="flex gap-3">
                  <img
                    src={resolveMediaUrl(item.imageUrl)}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text truncate">{item.name}</h3>
                    <p className="text-navy font-bold mt-1">
                      {item.price > 0 ? formatPrice(item.price) : '—'}
                    </p>
                    {item.sizes.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.sizes.map((s) => (
                          <span
                            key={s}
                            className="text-xs font-semibold text-navy bg-navy/8 px-2 py-0.5 rounded-full"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {renderFeaturedAction(item, 'mobile')}
                  {renderRowActions(item, 'mobile')}
                </div>
              </article>
            ))}
          </div>

          <div className="hidden md:block card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-muted border-b border-border/60">
                    <th className="text-left py-3 px-5 font-semibold text-text-muted">Produto</th>
                    <th className="text-left py-3 px-5 font-semibold text-text-muted">Tamanhos</th>
                    <th className="text-right py-3 px-5 font-semibold text-text-muted">Preço</th>
                    <th className="text-center py-3 px-5 font-semibold text-text-muted">Revista</th>
                    <th className="text-right py-3 px-5 font-semibold text-text-muted w-28">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {products.map((item) => (
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
                      <td className="py-4 px-5 text-right font-semibold text-navy whitespace-nowrap">
                        {item.price > 0 ? formatPrice(item.price) : '—'}
                      </td>
                      <td className="py-4 px-5 text-center">
                        {renderFeaturedAction(item, 'desktop')}
                      </td>
                      <td className="py-4 px-5 text-right">
                        {renderRowActions(item, 'desktop')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <ProductFormModal
        open={modalOpen}
        onClose={closeModal}
        product={editingProduct}
        storeCategory={store.category}
        onSubmit={async (data: CreateCatalogData | UpdateCatalogData) => {
          if (editingProduct) {
            await api.updateCatalogItem(store.id, editingProduct.id, data as UpdateCatalogData);
            await reload();
            toast.success('Produto atualizado com sucesso');
            return;
          }

          await api.createCatalogItem(store.id, data as CreateCatalogData);
          await reload();
          toast.success('Produto cadastrado com sucesso');
        }}
      />

      <ConfirmModal
        open={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        onConfirm={confirmDelete}
        title="Excluir produto"
        description={
          productToDelete
            ? `Tem certeza que deseja excluir "${productToDelete.name}"? Essa ação não pode ser desfeita.`
            : ''
        }
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        loading={deleting}
        variant="danger"
      />
    </div>
  );
}
