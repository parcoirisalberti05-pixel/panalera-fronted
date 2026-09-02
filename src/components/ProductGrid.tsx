import React, { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, Sparkles, FilterX } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import ProductCard from './ProductCard';

interface ProductGridProps {
  activeCategory: 'pañales' | 'higiene' | 'ropa' | 'calzado' | 'rodados' | 'alimentacion' | 'accesorios' | null;
  onSelectCategory: (category: 'pañales' | 'higiene' | 'ropa' | 'calzado' | 'rodados' | 'alimentacion' | 'accesorios' | null) => void;
  onAddToCart: (product: Product) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

// Datos reales que llegan del backend para cada id_web
interface StockReal {
  price: number;
  stock: number;
}

// URL del backend local. Si en algún momento el backend corre en otra
// dirección/puerto, solo hay que cambiar esta constante.
const API_URL = 'http://localhost:3000/api/productos-web';

export default function ProductGrid({
  activeCategory,
  onSelectCategory,
  onAddToCart,
  searchQuery,
  onSearchChange: setSearchQuery
}: ProductGridProps) {
  const [sortBy, setSortBy] = useState<'default' | 'priceAsc' | 'priceDesc' | 'rating'>('default');
  const [selectedBrand, setSelectedBrand] = useState<'Estrella' | 'Huggies' | 'Pampers' | 'Baby Sec' | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

  // Mapa id_web -> { price, stock } con los datos reales del backend.
  // Empieza vacío: mientras no llegue la respuesta (o si el producto
  // todavía no está vinculado en productos_web), se usan los valores
  // estáticos de PRODUCTS como respaldo.
  const [realData, setRealData] = useState<Record<string, StockReal>>({});

  // Trae el stock y precio real del backend una sola vez al montar
  useEffect(() => {
    let cancelado = false;

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Respuesta no ok del backend');
        return res.json();
      })
      .then((data: { id_web: string; precio: string | number; stock: string | number }[]) => {
        if (cancelado) return;
        const mapa: Record<string, StockReal> = {};
        data.forEach((item) => {
          mapa[item.id_web] = {
            price: Number(item.precio),
            stock: Number(item.stock)
          };
        });
        setRealData(mapa);
      })
      .catch((error) => {
        console.warn('No se pudo obtener stock real, usando datos estáticos:', error);
      });

    return () => {
      cancelado = true;
    };
  }, []);

  // Combina PRODUCTS con los datos reales. Los productos sin id_web
  // vinculado en productos_web mantienen su precio/stock estático.
  const mergedProducts = useMemo(() => {
    return PRODUCTS.map((product) => {
      const real = realData[product.id];
      if (!real) return product;
      return {
        ...product,
        price: real.price,
        stock: real.stock
      };
    });
  }, [realData]);

  // Clear filters on category changes
  useEffect(() => {
    setSelectedBrand(null);
    setSelectedSubCategory(null);
  }, [activeCategory]);

  const activeBrand = activeCategory === 'pañales' ? selectedBrand : null;
  const activeSubCategory = (activeCategory === 'higiene' || activeCategory === 'alimentacion' || activeCategory === 'accesorios') ? selectedSubCategory : null;

  const categories: { key: 'pañales' | 'higiene' | 'ropa' | 'calzado' | 'rodados' | 'alimentacion' | 'accesorios' | null; label: string }[] = [
    { key: null, label: 'Todos' },
    { key: 'pañales', label: 'Pañales' },
    { key: 'higiene', label: 'Higiene' },
    { key: 'alimentacion', label: 'Alimentación' },
    { key: 'accesorios', label: 'Accesorios' },
    { key: 'ropa', label: 'Ropa' },
    { key: 'calzado', label: 'Calzado' },
    { key: 'rodados', label: 'Rodados' },
  ];

  const filteredProducts = useMemo(() => {
    let result = [...mergedProducts];

    if (activeCategory) {
      result = result.filter(p => p.category === activeCategory);
    }

    if (activeCategory === 'pañales' && activeBrand) {
      result = result.filter(p => p.brand === activeBrand);
    }

    if ((activeCategory === 'higiene' || activeCategory === 'alimentacion' || activeCategory === 'accesorios') && activeSubCategory) {
      result = result.filter(p => p.subCategory === activeSubCategory);
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    if (sortBy === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [mergedProducts, activeCategory, activeBrand, activeSubCategory, searchQuery, sortBy]);

  const activeCategoryLabel = categories.find(c => c.key === activeCategory)?.label || 'Todos los Productos';

  return (
    <div className="w-full space-y-6" id="product-grid-section">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rose-100 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-400" />
            {activeCategoryLabel}
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {filteredProducts.length === 1
              ? '1 producto encontrado'
              : `${filteredProducts.length} productos encontrados`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Search className="w-4 h-4 text-rose-400" />
            </span>
            <input
              type="text"
              placeholder="¿Qué necesita tu bebé hoy?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 text-xs md:text-sm bg-white border border-rose-100 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all text-slate-700 placeholder-slate-400 shadow-xs"
              id="product-search-input"
            />
          </div>

          <div className="relative flex items-center gap-1.5 h-11 px-3.5 bg-white border border-rose-100 rounded-full shadow-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-rose-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-bold text-slate-600 bg-transparent focus:outline-none cursor-pointer pr-1"
              id="product-sort-select"
            >
              <option value="default">Ordenar: Destacados</option>
              <option value="priceAsc">Menor precio</option>
              <option value="priceDesc">Mayor precio</option>
              <option value="rating">Mejor valorados</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map((cat) => {
          const emojis: Record<string, string> = {
            all: '✨',
            pañales: '🍼',
            higiene: '🧼',
            alimentacion: '🥣',
            accesorios: '🧷',
            ropa: '👕',
            calzado: '👟',
            rodados: '🛒'
          };
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key || 'all'}
              onClick={() => onSelectCategory(cat.key)}
              className={`cursor-pointer px-5 py-2.5 text-xs md:text-sm font-bold rounded-full border whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-rose-400 text-white border-rose-400 shadow-md shadow-rose-200'
                  : 'bg-white text-slate-600 border-rose-100 hover:border-rose-300 hover:text-rose-500 shadow-xs'
              }`}
              id={`category-bar-btn-${cat.key || 'all'}`}
            >
              <span>{emojis[cat.key || 'all']}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {activeCategory === 'pañales' && (
        <div className="bg-rose-50/30 border border-rose-100/60 rounded-2xl p-4 space-y-3 animate-fade-in" id="brand-filters">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filtrar por Marca</span>
            {activeBrand && (
              <button
                onClick={() => setSelectedBrand(null)}
                className="cursor-pointer text-xs font-bold text-rose-450 hover:text-rose-600 transition-colors"
                id="reset-brand-filter-btn"
              >
                Ver todos los pañales
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(['Estrella', 'Huggies', 'Pampers', 'Baby Sec'] as const).map((brand) => {
              const isActive = activeBrand === brand;
              return (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(isActive ? null : brand)}
                  className={`cursor-pointer px-4 py-2.5 text-xs md:text-sm font-bold rounded-xl border whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-rose-400 text-white border-rose-400 shadow-sm'
                      : 'bg-white text-slate-600 border-rose-100 hover:border-rose-300 hover:text-rose-500 shadow-2xs'
                  }`}
                  id={`brand-filter-btn-${brand.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {brand}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeCategory === 'higiene' && (
        <div className="bg-rose-50/30 border border-rose-100/60 rounded-2xl p-4 space-y-3 animate-fade-in" id="higiene-subcategory-filters">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span>🧼</span>
              <span>Filtrar por Subcategoría</span>
            </span>
            {activeSubCategory && (
              <button
                onClick={() => setSelectedSubCategory(null)}
                className="cursor-pointer text-xs font-bold text-rose-450 hover:text-rose-600 transition-colors"
                id="reset-subcategory-filter-btn"
              >
                Ver toda Higiene
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {([
              { key: 'Oleo', label: 'Óleo', emoji: '🧴' },
              { key: 'Shampoo', label: 'Shampoo', emoji: '🧴' },
              { key: 'Acondicionador', label: 'Acondicionador', emoji: '🧴' },
              { key: 'Algodón', label: 'Algodón', emoji: '☁️' },
              { key: 'Toallitas Humedas', label: 'Toallitas Húmedas', emoji: '🧻' },
              { key: 'Jabon', label: 'Jabón', emoji: '🧼' },
              { key: 'Perfume', label: 'Perfume', emoji: '🌸' },
              { key: 'Talco', label: 'Talco', emoji: '💨' },
              { key: 'Protección', label: 'Protección', emoji: '🛡️' },
              { key: 'Crema', label: 'Crema', emoji: '🧴' },
              { key: 'Aceite', label: 'Aceite', emoji: '💧' }
            ] as const).map((subCat) => {
              const isActive = activeSubCategory === subCat.key;
              return (
                <button
                  key={subCat.key}
                  onClick={() => setSelectedSubCategory(isActive ? null : subCat.key)}
                  className={`cursor-pointer px-4 py-2.5 text-xs md:text-sm font-bold rounded-xl border whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-rose-400 text-white border-rose-400 shadow-md shadow-rose-200'
                      : 'bg-white text-slate-600 border-rose-100 hover:border-rose-300 hover:text-rose-500 shadow-2xs'
                  }`}
                  id={`subcategory-filter-btn-${subCat.key.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <span>{subCat.emoji}</span>
                  <span>{subCat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeCategory === 'alimentacion' && (
        <div className="bg-rose-50/30 border border-rose-100/60 rounded-2xl p-4 space-y-3 animate-fade-in" id="alimentacion-subcategory-filters">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span>🥣</span>
              <span>Filtrar por Subcategoría</span>
            </span>
            {activeSubCategory && (
              <button
                onClick={() => setSelectedSubCategory(null)}
                className="cursor-pointer text-xs font-bold text-rose-450 hover:text-rose-600 transition-colors"
                id="reset-alimentacion-subcategory-filter-btn"
              >
                Ver toda Alimentación
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {([
              { key: 'Nutrilon', label: 'Nutrilon', emoji: '🌾' },
              { key: 'Sancor Advance', label: 'Sancor Advance', emoji: '🥛' },
              { key: 'Vital', label: 'Vital', emoji: '👶' },
              { key: 'Otros', label: 'Otros', emoji: '🥣' }
            ] as const).map((subCat) => {
              const isActive = activeSubCategory === subCat.key;
              return (
                <button
                  key={subCat.key}
                  onClick={() => setSelectedSubCategory(isActive ? null : subCat.key)}
                  className={`cursor-pointer px-4 py-2.5 text-xs md:text-sm font-bold rounded-xl border whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-rose-400 text-white border-rose-400 shadow-md shadow-rose-200'
                      : 'bg-white text-slate-600 border-rose-100 hover:border-rose-300 hover:text-rose-500 shadow-2xs'
                  }`}
                  id={`subcategory-filter-btn-${subCat.key.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <span>{subCat.emoji}</span>
                  <span>{subCat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeCategory === 'accesorios' && (
        <div className="bg-rose-50/30 border border-rose-100/60 rounded-2xl p-4 space-y-3 animate-fade-in" id="accesorios-subcategory-filters">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span>🧷</span>
              <span>Filtrar por Subcategoría</span>
            </span>
            {activeSubCategory && (
              <button
                onClick={() => setSelectedSubCategory(null)}
                className="cursor-pointer text-xs font-bold text-rose-450 hover:text-rose-600 transition-colors"
                id="reset-accesorios-subcategory-filter-btn"
              >
                Ver todos los Accesorios
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {([
              { key: 'Avent', label: 'Avent', emoji: '🍼' },
              { key: 'Nuk', label: 'Nuk', emoji: '🧸' },
              { key: 'Loopi', label: 'Loopi', emoji: '🥣' },
              { key: 'Natelle', label: 'Natelle', emoji: '🍽️' },
              { key: 'Dispita', label: 'Dispita', emoji: '🥄' },
              { key: 'Vaita', label: 'Vaita', emoji: '🥛' },
              { key: 'Varias Marcas', label: 'Varias Marcas', emoji: '🎨' }
            ] as const).map((subCat) => {
              const isActive = activeSubCategory === subCat.key;
              return (
                <button
                  key={subCat.key}
                  onClick={() => setSelectedSubCategory(isActive ? null : subCat.key)}
                  className={`cursor-pointer px-4 py-2.5 text-xs md:text-sm font-bold rounded-xl border whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-rose-400 text-white border-rose-400 shadow-md shadow-rose-200'
                      : 'bg-white text-slate-600 border-rose-100 hover:border-rose-300 hover:text-rose-500 shadow-2xs'
                  }`}
                  id={`subcategory-filter-btn-${subCat.key.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <span>{subCat.emoji}</span>
                  <span>{subCat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            // @ts-ignore
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center border-2 border-dashed border-rose-100 rounded-3xl flex flex-col items-center justify-center p-6 bg-white/50" id="empty-product-state">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-400 mb-4 shadow-sm">
            <FilterX className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-700">No encontramos productos</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Intentá buscando con otras palabras o borrando los filtros activos de búsqueda.
          </p>
          <button
            onClick={() => { setSearchQuery(''); onSelectCategory(null); }}
            className="cursor-pointer mt-4 px-6 py-2.5 text-xs font-bold bg-rose-400 hover:bg-rose-500 text-white rounded-full shadow-md shadow-rose-200 transition-all"
            id="clear-filters-btn"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}