import { useEffect, useState, type FormEvent, type ChangeEvent } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import Modal from '../ui/Modal';
import AudioProductDemo from './AudioProductDemo';
import { PRODUCT_SIZES } from '../../lib/sizes';
import type { CatalogItem, CategoryType, CreateCatalogData, UpdateCatalogData } from '../../types';
import type { ParsedVoiceProduct } from '../../lib/voiceProductAgent';
import { resolveMediaUrl } from '../../services/api';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCatalogData | UpdateCatalogData) => Promise<void>;
  storeCategory?: CategoryType;
  product?: CatalogItem | null;
}

export default function ProductFormModal({
  open,
  onClose,
  onSubmit,
  storeCategory = 'MODA',
  product = null,
}: Props) {
  const isEditing = Boolean(product);
  const [name, setName] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [customSize, setCustomSize] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (product) {
      setName(product.name);
      setSelectedSizes([...product.sizes]);
      setCustomSize('');
      setPrice(product.price.toFixed(2).replace('.', ','));
      setDescription(product.description ?? '');
      setFeatured(product.featured);
      setExistingImages(
        product.images?.length ? [...product.images] : product.imageUrl ? [product.imageUrl] : []
      );
      setPhotos([]);
      setPreviews([]);
      setError('');
      return;
    }

    setName('');
    setSelectedSizes([]);
    setCustomSize('');
    setPrice('');
    setDescription('');
    setFeatured(false);
    setExistingImages([]);
    setPhotos([]);
    setPreviews([]);
    setError('');
  }, [open, product]);

  function handleClose() {
    previews.forEach((url) => URL.revokeObjectURL(url));
    onClose();
  }

  function toggleSize(size: string) {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  }

  function addCustomSize() {
    const trimmed = customSize.trim();
    if (!trimmed || selectedSizes.includes(trimmed)) return;
    setSelectedSizes((prev) => [...prev, trimmed]);
    setCustomSize('');
  }

  function removeSize(size: string) {
    setSelectedSizes((prev) => prev.filter((s) => s !== size));
  }

  function handlePhotosChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const allowed = Math.max(0, 6 - existingImages.length - photos.length);
    const newPhotos = [...photos, ...files.slice(0, allowed)];
    setPhotos(newPhotos);
    previews.forEach((url) => URL.revokeObjectURL(url));
    setPreviews(newPhotos.map((f) => URL.createObjectURL(f)));
  }

  function removeNewPhoto(index: number) {
    URL.revokeObjectURL(previews[index]);
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  function removeExistingImage(index: number) {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  }

  function applyVoiceProduct(parsed: ParsedVoiceProduct) {
    setName(parsed.name);
    setSelectedSizes(parsed.sizes);
    setPrice(parsed.price.toFixed(2).replace('.', ','));
    setDescription(parsed.description ?? '');
    setError('');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (selectedSizes.length === 0) {
      setError('Selecione pelo menos um tamanho');
      return;
    }

    const totalImages = existingImages.length + photos.length;
    if (totalImages === 0) {
      setError('Adicione pelo menos uma foto');
      return;
    }

    const parsedPrice = parseFloat(price.replace(',', '.'));
    if (!price || isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Informe um preço válido');
      return;
    }

    setLoading(true);
    try {
      if (isEditing && product) {
        await onSubmit({
          name,
          sizes: selectedSizes,
          price: parsedPrice,
          description: description || undefined,
          featured,
          keepImages: existingImages,
          photos,
        });
      } else {
        await onSubmit({
          name,
          sizes: selectedSizes,
          price: parsedPrice,
          description: description || undefined,
          featured,
          photos,
        });
      }
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar produto');
    } finally {
      setLoading(false);
    }
  }

  const totalImages = existingImages.length + photos.length;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEditing ? 'Editar Produto' : 'Cadastrar Produto'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 border border-red-100 rounded-lg">
            {error}
          </div>
        )}

        {!isEditing && (
          <AudioProductDemo category={storeCategory} onParsed={applyVoiceProduct} />
        )}

        <div>
          <label htmlFor="prod-name" className="block text-sm font-semibold text-text mb-2">
            Nome da peça *
          </label>
          <input
            id="prod-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input-field"
            placeholder="Ex: Vestido de Verão Estampado"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-text mb-2">
            Tamanhos disponíveis *
          </label>
          <p className="text-muted text-xs mb-3">Selecione todos os tamanhos que você vende</p>
          <div className="flex flex-wrap gap-2">
            {PRODUCT_SIZES.map((s) => {
              const active = selectedSizes.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSize(s)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                    active
                      ? 'bg-navy text-white border-navy'
                      : 'bg-white text-text-muted border-border hover:border-navy/40'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 mt-3">
            <input
              value={customSize}
              onChange={(e) => setCustomSize(e.target.value)}
              className="input-field flex-1"
              placeholder="Outro tamanho (ex: 38, 40)"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomSize();
                }
              }}
            />
            <button type="button" onClick={addCustomSize} className="btn-outline shrink-0">
              Adicionar
            </button>
          </div>

          {selectedSizes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/60">
              {selectedSizes.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-navy/8 text-navy text-xs font-semibold rounded-full"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => removeSize(s)}
                    className="hover:text-red-600 transition-colors"
                    aria-label={`Remover tamanho ${s}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="prod-price" className="block text-sm font-semibold text-text mb-2">
            Preço (R$) *
          </label>
          <input
            id="prod-price"
            type="text"
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="input-field"
            placeholder="89,90"
          />
        </div>

        <div>
          <label htmlFor="prod-desc" className="block text-sm font-semibold text-text mb-2">
            Descrição
          </label>
          <textarea
            id="prod-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="input-field resize-none"
            placeholder="Material, cor, detalhes..."
          />
        </div>

        <label className="flex items-start gap-3 p-4 bg-navy/4 border border-navy/10 rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="mt-0.5 accent-navy"
          />
          <span>
            <span className="block text-sm font-semibold text-text">Exibir na revista principal</span>
            <span className="block text-xs text-muted mt-0.5">
              Apenas produtos marcados aparecem na Vitrine Virtual (máx. 6 por vez).
            </span>
          </span>
        </label>

        <div>
          <label className="block text-sm font-semibold text-text mb-2">Fotos *</label>
          <p className="text-muted text-xs mb-3">Até 6 imagens · Máx. 5 MB cada</p>

          {totalImages > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
              {existingImages.map((imageUrl, index) => (
                <div key={imageUrl} className="relative aspect-square rounded-lg overflow-hidden group">
                  <img src={resolveMediaUrl(imageUrl)} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute top-1.5 right-1.5 p-1 bg-black/60 text-white rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                    aria-label="Remover foto"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {previews.map((preview, index) => (
                <div key={preview} className="relative aspect-square rounded-lg overflow-hidden group">
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewPhoto(index)}
                    className="absolute top-1.5 right-1.5 p-1 bg-black/60 text-white rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                    aria-label="Remover foto"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {totalImages < 6 && (
            <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-navy/40 hover:bg-navy/3 transition-colors">
              <div className="w-10 h-10 rounded-full bg-navy/8 flex items-center justify-center">
                {totalImages === 0 ? (
                  <Upload className="w-5 h-5 text-navy" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-navy" />
                )}
              </div>
              <span className="text-sm font-medium text-navy">
                {totalImages === 0 ? 'Adicionar fotos' : 'Adicionar mais'}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotosChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
          <button type="button" onClick={handleClose} className="btn-outline sm:flex-none">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="btn-navy flex-1 disabled:opacity-60">
            {loading ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Cadastrar produto'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
