import React, { useState, useEffect } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { Product } from '../types';
import { MEDIDAS, DESCRIPCION_ETAPA, DESCRIPCIONES } from '../data/calzadoInfo';

interface ShoeDetailModalProps {
  // Todos los talles de un mismo modelo y color (un Product por talle)
  variants: Product[];
  initialSize: number | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ShoeDetailModal({ variants, initialSize, onClose, onAddToCart }: ShoeDetailModalProps) {
  const [selectedSize, setSelectedSize] = useState<number | null>(initialSize);

  // Cerrar con la tecla Escape y bloquear el scroll de fondo mientras está abierta
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const sorted = [...variants].sort((a, b) => (a.size ?? 0) - (b.size ?? 0));
  const first = sorted[0];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);

  const title = first.name.replace(/\s+art\.\S+\s+Talle\s+\d+$/i, '');
  const artMatch = first.name.match(/art\.(\S+)/i);
  const art = artMatch ? artMatch[1] : '';
  // Color: lo que va entre "Chapatitos" y "art."
  const colorMatch = first.name.match(/Chapatitos\s+(.+?)\s+art\./i);
  const color = colorMatch ? colorMatch[1] : '';

  const available = sorted.filter((v) => v.stock > 0);
  const totalStock = available.reduce((acc, v) => acc + v.stock, 0);
  const selected = sorted.find((v) => v.size === selectedSize && v.stock > 0) || null;

  const priceList = (available.length > 0 ? available : sorted).map((v) => v.price);
  const minPrice = Math.min(...priceList);
  const maxPrice = Math.max(...priceList);
  const shownPrice = selected ? selected.price : minPrice;
  const priceVaries = !selected && minPrice !== maxPrice;

  const stockLabel = selected
    ? selected.stock <= 2
      ? '¡Últimas unidades!'
      : 'Disponible'
    : totalStock === 0
    ? 'Sin stock'
    : 'Elegí un talle';

  const description =
    (first.modelKey && DESCRIPCIONES[first.modelKey]) ||
    (first.subCategory && DESCRIPCION_ETAPA[first.subCategory]) ||
    first.description;

  // Tabla de medidas: solo los talles de este modelo que tengan medida cargada
  const medidasEtapa = (first.subCategory && MEDIDAS[first.subCategory]) || {};
  const filasMedidas = sorted.filter((v) => v.size !== undefined && medidasEtapa[v.size]);

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 md:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      id={`shoe-modal-${first.modelKey}`}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 border border-rose-100 text-slate-500 hover:text-rose-500 flex items-center justify-center cursor-pointer"
          aria-label="Cerrar"
          id="shoe-modal-close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Foto grande */}
          <div className="bg-rose-50/20 flex items-center justify-center p-4 md:p-8 md:rounded-l-3xl">
            <img
              src={first.image}
              alt={title}
              className="w-full max-h-[60vh] object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Datos y compra */}
          <div className="p-5 md:p-8 flex flex-col">
            {first.subCategory && (
              <span className="self-start text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-lg select-none mb-2">
                {first.subCategory}
              </span>
            )}
            <h3 className="text-lg md:text-xl font-black text-slate-800 pr-8">{title}</h3>
            {art && <p className="text-xs text-slate-400 mt-0.5">Art. {art}</p>}
            {color && (
              <p className="text-sm text-slate-600 mt-3">
                <span className="font-bold text-slate-500 uppercase text-[11px] tracking-wider">Color: </span>
                <span className="font-semibold">{color}</span>
              </p>
            )}

            <div className="mt-4">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Talle{selected ? `: ${selected.size}` : ''}
              </p>
              <div className="flex flex-wrap gap-2">
                {sorted.map((v) => {
                  const inStock = v.stock > 0;
                  const isSelected = selected?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      disabled={!inStock}
                      onClick={() => inStock && setSelectedSize(v.size ?? null)}
                      title={inStock ? `Talle ${v.size}` : `Talle ${v.size} sin stock`}
                      className={`min-w-[2.75rem] h-10 px-3 rounded-xl border text-sm font-bold transition-all duration-150 ${
                        !inStock
                          ? 'bg-slate-50 text-slate-300 border-slate-100 line-through cursor-not-allowed'
                          : isSelected
                          ? 'bg-rose-400 text-white border-rose-400 shadow-md shadow-rose-200 cursor-pointer'
                          : 'bg-white text-slate-600 border-rose-100 hover:border-rose-300 hover:text-rose-500 cursor-pointer'
                      }`}
                      id={`modal-size-btn-${v.id}`}
                    >
                      {v.size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-2xl md:text-3xl font-black text-slate-800">
                {priceVaries ? 'Desde ' : ''}
                {formatPrice(shownPrice)}
              </p>
              <p
                className={`text-xs font-bold mt-1 ${
                  selected && selected.stock <= 2 ? 'text-rose-500' : 'text-slate-400'
                }`}
              >
                {stockLabel}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (selected) {
                  onAddToCart(selected);
                  onClose();
                }
              }}
              disabled={!selected}
              className={`mt-5 h-12 px-6 rounded-full flex items-center justify-center gap-2 font-bold text-sm transition duration-200 shadow-md ${
                !selected
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  : 'cursor-pointer bg-rose-400 hover:bg-rose-500 active:scale-95 text-white shadow-rose-200'
              }`}
              id={`modal-add-to-cart-${first.modelKey}`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{selected ? 'Agregar al carrito' : 'Elegí un talle'}</span>
            </button>
          </div>
        </div>

        {/* Descripción y medidas */}
        <div className="px-5 md:px-8 pb-6 md:pb-8 pt-2 space-y-5 border-t border-rose-50">
          <div className="pt-5">
            <h4 className="text-sm font-black text-slate-800 mb-1.5">Descripción</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
          </div>

          {filasMedidas.length > 0 && (
            <div>
              <h4 className="text-sm font-black text-slate-800 mb-2">Tabla de medidas</h4>
              <div className="overflow-x-auto">
                <table className="text-sm border border-rose-100 rounded-xl overflow-hidden">
                  <tbody>
                    <tr className="bg-rose-50/60">
                      <th className="px-3 py-2 text-left font-bold text-slate-600">Talle</th>
                      {filasMedidas.map((v) => (
                        <td key={v.id} className="px-3 py-2 text-center font-bold text-slate-700">{v.size}</td>
                      ))}
                    </tr>
                    <tr>
                      <th className="px-3 py-2 text-left font-bold text-slate-600">Cm</th>
                      {filasMedidas.map((v) => (
                        <td key={v.id} className="px-3 py-2 text-center text-slate-600">
                          {medidasEtapa[v.size as number]}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Se mide desde la punta del talón a la punta del dedo más largo del pie.
                Las medidas son aproximadas, de las plantillas, y pueden variar según la forma del producto.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

