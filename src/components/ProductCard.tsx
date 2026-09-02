import React from 'react';
import { Star, ShoppingCart, Info, Package } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  key?: any;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // Format price as currency (Argentine Pesos or standard Local currency formatting)
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'pañales': return 'bg-sky-100 text-sky-700 border-sky-200';
      case 'higiene': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'ropa': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'calzado': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'rodados': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'pañales': return '🍼';
      case 'higiene': return '🧼';
      case 'ropa': return '👕';
      case 'calzado': return '👟';
      case 'rodados': return '🛒';
      default: return '🎁';
    }
  };

  return (
    <div
      className="group bg-white border border-rose-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-rose-300 hover:shadow-rose-100/60 transition-all duration-300 flex flex-col h-full relative"
      id={`product-card-${product.id}`}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-rose-50/20 flex items-center justify-center">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-rose-300 gap-2 select-none">
            <Package className="w-12 h-12 stroke-[1.2] animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-rose-400/60">Sin imagen</span>
          </div>
        )}

        {/* Featured Badge */}
        {product.featured && (
          <span className="absolute top-3 left-3 px-3 py-1 text-[10px] font-black tracking-wider uppercase bg-rose-400 text-white rounded-full shadow-md shadow-rose-200">
            Destacado
          </span>
        )}

        {/* Category Tag */}
        <span className={`absolute top-3 right-3 px-3 py-1 text-[11px] font-bold border rounded-full backdrop-blur-xs flex items-center gap-1 ${getCategoryColor(product.category)}`}>
          <span>{getCategoryEmoji(product.category)}</span>
          <span className="capitalize">{product.category}</span>
        </span>

        {/* Out of Stock Mask */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/85 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-slate-800 text-white font-black px-4 py-2 rounded-2xl text-xs uppercase tracking-widest">
              Sin Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-5 flex flex-col flex-1">
        {/* Rating, Reviews and Subcategory */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1">
            <div className="flex items-center text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              <span className="text-xs font-bold text-slate-700 ml-1">{product.rating}</span>
            </div>
            <span className="text-[11px] text-slate-400">({product.reviews})</span>
          </div>
          {product.subCategory && (
            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-lg select-none">
              {product.subCategory === 'Toallitas Humedas' ? 'Toallitas Húmedas' : product.subCategory === 'Oleo' ? 'Óleo' : product.subCategory === 'Jabon' ? 'Jabón' : product.subCategory}
            </span>
          )}
        </div>

        {/* Name and Description */}
        <h3 className="text-sm md:text-base font-bold text-slate-800 line-clamp-1 group-hover:text-rose-500 transition-colors duration-200">
          {product.name}
        </h3>
        <p className="text-xs text-slate-500 mt-1 mb-4 line-clamp-2 flex-1 leading-relaxed">
          {product.description}
        </p>

        {/* Footer Area: Price, Stock, Add to Cart */}
        <div className="pt-3 border-t border-rose-50 flex items-center justify-between gap-2 mt-auto">
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-black text-slate-800">
              {formatPrice(product.price)}
            </span>
            <span className={`text-[10px] font-bold ${product.stock <= 5 ? 'text-rose-500' : 'text-slate-400'}`}>
              {product.stock <= 5 ? `¡Solo ${product.stock} restantes!` : 'Disponible'}
            </span>
          </div>

          <button
            onClick={() => product.stock > 0 && onAddToCart(product)}
            disabled={product.stock === 0}
            className={`cursor-pointer h-10 px-4 rounded-full flex items-center gap-1.5 font-bold text-xs transition duration-200 shadow-md ${
              product.stock === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-rose-400 hover:bg-rose-500 active:scale-95 text-white shadow-rose-200'
            }`}
            id={`add-to-cart-btn-${product.id}`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Agregar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
