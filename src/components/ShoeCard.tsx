import React, { useState } from 'react';
import { ShoppingCart, Package } from 'lucide-react';
import { Product } from '../types';

interface ShoeCardProps {
  // Todos los talles de un mismo modelo y color (un Product por talle)
  variants: Product[];
  onAddToCart: (product: Product) => void;
  key?: any;
}

export default function ShoeCard({ variants, onAddToCart }: ShoeCardProps) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);

  const sorted = [...variants].sort((a, b) => (a.size ?? 0) - (b.size ?? 0));
  const first = sorted[0];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);

  // Nombre sin "art.XXXX Talle N"
  const title = first.name.replace(/\s+art\.\S+\s+Talle\s+\d+$/i, '');
  const artMatch = first.name.match(/art\.(\S+)/i);
  const art = artMatch ? artMatch[1] : '';

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

  return (
    <div
      className="group bg-white border border-rose-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-rose-300 hover:shadow-rose-100/60 transition-all duration-300 flex flex-col h-full relative"
      id={`shoe-card-${first.modelKey}`}
    >
      {/* Imagen */}
      <div className="relative aspect-square overflow-hidden bg-rose-50/20 flex items-center justify-center">
        {first.image ? (
          <img
            src={first.image}
            alt={title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-rose-300 gap-2 select-none">
            <Package className="w-12 h-12 stroke-[1.2]" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-rose-400/60">Sin imagen</span>
          </div>
        )}

        <span className="absolute top-3 right-3 px-3 py-1 text-[11px] font-bold border rounded-full backdrop-blur-xs flex items-center gap-1 bg-amber-100 text-amber-700 border-amber-200">
          <span>👟</span>
          <span>Calzado</span>
        </span>

        {totalStock === 0 && (
          <div className="absolute inset-0 bg-white/85 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-slate-800 text-white font-black px-4 py-2 rounded-2xl text-xs uppercase tracking-widest">
              Sin Stock
            </span>
          </div>
        )}
      </div>

      {/* Detalle */}
      <div className="p-5 flex flex-col flex-1">
        {first.subCategory && (
          <div className="flex items-center justify-end mb-2">
            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-lg select-none">
              {first.subCategory}
            </span>
          </div>
        )}

        <h3 className="text-sm md:text-base font-bold text-slate-800 line-clamp-2 group-hover:text-rose-500 transition-colors duration-200">
          {title}
        </h3>
        {art && <p className="text-[11px] text-slate-400 mt-0.5">Art. {art}</p>}

        {/* Selector de talle */}
        <div className="mt-3 mb-4 flex-1">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Talle</p>
          <div className="flex flex-wrap gap-1.5">
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
                  className={`min-w-[2.5rem] h-9 px-2 rounded-xl border text-xs font-bold transition-all duration-150 ${
                    !inStock
                      ? 'bg-slate-50 text-slate-300 border-slate-100 line-through cursor-not-allowed'
                      : isSelected
                      ? 'bg-rose-400 text-white border-rose-400 shadow-md shadow-rose-200 cursor-pointer'
                      : 'bg-white text-slate-600 border-rose-100 hover:border-rose-300 hover:text-rose-500 cursor-pointer'
                  }`}
                  id={`size-btn-${v.id}`}
                >
                  {v.size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Precio, stock, agregar */}
        <div className="pt-3 border-t border-rose-50 flex items-center justify-between gap-2 mt-auto">
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-black text-slate-800">
              {priceVaries ? 'Desde ' : ''}
              {formatPrice(shownPrice)}
            </span>
            <span
              className={`text-[10px] font-bold ${
                selected && selected.stock <= 2 ? 'text-rose-500' : 'text-slate-400'
              }`}
            >
              {stockLabel}
            </span>
          </div>

          <button
            onClick={() => selected && onAddToCart(selected)}
            disabled={!selected}
            className={`h-10 px-4 rounded-full flex items-center gap-1.5 font-bold text-xs transition duration-200 shadow-md ${
              !selected
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                : 'cursor-pointer bg-rose-400 hover:bg-rose-500 active:scale-95 text-white shadow-rose-200'
            }`}
            id={`add-to-cart-btn-${first.modelKey}`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Agregar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
