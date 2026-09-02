import React, { useState } from 'react';
import { Menu, X, ShoppingCart, Package, Heart, Sparkles, Footprints, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';
// @ts-expect-error - image asset
import brandLogo from '../assets/images/Logo-Pañalera.46.44.jpeg';

interface NavbarProps {
  cartItems: CartItem[];
  onOpenCart: () => void;
  activeCategory: 'pañales' | 'higiene' | 'ropa' | 'calzado' | 'rodados' | 'alimentacion' | 'accesorios' | null;
  onSelectCategory: (category: 'pañales' | 'higiene' | 'ropa' | 'calzado' | 'rodados' | 'alimentacion' | 'accesorios' | null) => void;
  onNavigateToView: (view: 'shop' | 'tracking') => void;
  currentView: 'shop' | 'tracking';
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Navbar({
  cartItems,
  onOpenCart,
  activeCategory,
  onSelectCategory,
  onNavigateToView,
  currentView,
  searchQuery,
  onSearchChange
}: NavbarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuOptions: { key: 'pañales' | 'higiene' | 'ropa' | 'calzado' | 'rodados' | 'alimentacion' | 'accesorios'; label: string }[] = [
    { key: 'pañales', label: 'Pañales' },
    { key: 'higiene', label: 'Higiene' },
    { key: 'alimentacion', label: 'Alimentación' },
    { key: 'accesorios', label: 'Accesorios' },
    { key: 'ropa', label: 'Ropa' },
    { key: 'calzado', label: 'Calzado' },
    { key: 'rodados', label: 'Rodados' }
  ];

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleOptionClick = (key: 'pañales' | 'higiene' | 'ropa' | 'calzado' | 'rodados' | 'alimentacion' | 'accesorios' | null) => {
    onSelectCategory(key);
    onNavigateToView('shop');
    setIsSidebarOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-rose-50 shadow-sm" id="store-header">
        <div className="max-w-7xl mx-auto w-full">
          {/* Main Header Row */}
          <div className="px-4 md:px-8 py-3.5 flex items-center justify-between gap-3 md:gap-6">
            
            {/* Left Side: Hamburger & Brand Title */}
            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
              {/* Custom Styled Hamburger Button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="w-10 h-10 flex flex-col justify-center gap-1.5 items-center hover:bg-rose-50 rounded-full transition-colors focus:outline-none cursor-pointer"
                id="hamburger-menu-btn"
                aria-label="Abrir Menú de Categorías"
              >
                <div className="w-5 h-0.5 bg-rose-400 rounded-full"></div>
                <div className="w-5 h-0.5 bg-rose-400 rounded-full"></div>
                <div className="w-5 h-0.5 bg-rose-400 rounded-full"></div>
              </button>

              {/* Brand Logo & Name */}
              <button
                onClick={() => { handleOptionClick(null); onNavigateToView('shop'); }}
                className="cursor-pointer flex items-center focus:outline-none animate-fade-in"
                id="brand-logo-btn"
              >
                <img
                  src={brandLogo}
                  alt="Logo Pañalera Arcoiris"
                  className="h-12 md:h-14 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </button>
            </div>

            {/* Middle: Brand New Integrated Search Bar (Buscador) */}
            <div className="flex-1 max-w-md mx-1 md:mx-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-rose-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="¿Qué necesita tu bebé hoy?"
                  value={searchQuery}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    if (currentView !== 'shop') {
                      onNavigateToView('shop');
                    }
                  }}
                  className="w-full h-9.5 pl-9 pr-8 text-xs bg-rose-50/30 border border-rose-100 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all text-slate-700 placeholder-slate-400 shadow-xs focus:bg-white"
                  id="navbar-search-input"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-rose-450 cursor-pointer"
                    id="navbar-search-clear-btn"
                    title="Limpiar búsqueda"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Side: Shopping actions */}
            <div className="flex items-center gap-1.5 md:gap-3 flex-shrink-0">
              {/* Order Tracking Center Portal */}
              <button
                onClick={() => onNavigateToView('tracking')}
                className={`cursor-pointer px-3 py-1.5 text-[11px] font-bold rounded-full transition-all flex items-center gap-1 ${
                  currentView === 'tracking'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-100'
                    : 'text-slate-600 hover:text-sky-500 hover:bg-sky-50'
                }`}
                id="nav-tracking-portal-btn"
                title="Seguimiento de pedidos"
              >
                <Package className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Mis Pedidos</span>
              </button>

              {/* Floating Shopping Cart Trigger */}
              <button
                onClick={onOpenCart}
                className="cursor-pointer relative p-2 bg-yellow-100 hover:bg-yellow-200 rounded-full transition flex items-center justify-center w-9 h-9"
                id="nav-cart-trigger"
                aria-label="Abrir Carrito"
              >
                <span className="text-lg">🛒</span>
                {totalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold border-2 border-white">
                    {totalCartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Secondary Row: Desktop Category Quick Links */}
          <div className="hidden lg:flex items-center justify-center gap-6 border-t border-rose-50/50 py-2">
            {menuOptions.map((opt) => {
              const emojis: Record<string, string> = {
                pañales: '🍼',
                higiene: '🧼',
                alimentacion: '🥣',
                accesorios: '🧷',
                ropa: '👕',
                calzado: '👟',
                rodados: '🛒'
              };
              return (
                <button
                  key={opt.key}
                  onClick={() => handleOptionClick(opt.key)}
                  className={`cursor-pointer px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                    currentView === 'shop' && activeCategory === opt.key
                      ? 'bg-rose-400 text-white shadow-md shadow-rose-100'
                      : 'text-slate-600 hover:text-rose-400 hover:bg-rose-50/50'
                  }`}
                  id={`navbar-link-${opt.key}`}
                >
                  <span>{emojis[opt.key]}</span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Hamburger Sliding Sidebar Menu */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900 z-50 cursor-pointer"
              id="hamburger-backdrop"
            />

            {/* Sidebar box */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-full max-w-[290px] bg-white border-r border-rose-100 shadow-2xl z-50 flex flex-col h-full p-6"
              id="hamburger-sidebar"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between border-b border-rose-100 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <img
                    src={brandLogo}
                    alt="Logo Pañalera Arcoiris"
                    className="h-10 w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-lg font-black text-slate-800 tracking-tight">Pañalera Arcoiris<span className="text-rose-400">.</span></span>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="cursor-pointer p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-400 rounded-full transition"
                  id="hamburger-close-btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sidebar options */}
              <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3">Categorías</p>
                {menuOptions.map((opt) => {
                  const emojis: Record<string, string> = {
                    pañales: '🍼',
                    higiene: '🧼',
                    alimentacion: '🥣',
                    accesorios: '🧷',
                    ropa: '👕',
                    calzado: '👟',
                    rodados: '🛒'
                  };
                  const isActive = currentView === 'shop' && activeCategory === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleOptionClick(opt.key)}
                      className={`cursor-pointer w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-200 ${
                        isActive
                          ? 'bg-sky-500 text-white shadow-md shadow-sky-100 font-bold'
                          : 'text-slate-700 hover:bg-rose-100 hover:text-slate-900 font-medium'
                      }`}
                      id={`sidebar-link-${opt.key}`}
                    >
                      <span className="text-xl">{emojis[opt.key]}</span>
                      <span className="text-sm">{opt.label}</span>
                    </button>
                  );
                })}

                <button
                  onClick={() => handleOptionClick(null)}
                  className={`cursor-pointer w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-200 ${
                    currentView === 'shop' && activeCategory === null
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-100 font-bold'
                      : 'text-slate-700 hover:bg-rose-100 hover:text-slate-900 font-medium'
                  }`}
                  id="sidebar-link-all"
                >
                  <span className="text-xl">🌟</span>
                  <span className="text-sm">Ver Todo</span>
                </button>
              </div>

              {/* Sidebar Footer info */}
              <div className="mt-auto pt-4 border-t border-rose-50">
                <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-500 font-semibold mb-2">Pago Seguro</p>
                  <div className="flex gap-1.5 opacity-60">
                    <div className="w-8 h-5 bg-blue-800 rounded flex items-center justify-center text-[8px] text-white font-bold">VISA</div>
                    <div className="w-8 h-5 bg-orange-500 rounded flex items-center justify-center text-[8px] text-white font-bold">MC</div>
                    <div className="w-8 h-5 bg-green-600 rounded flex items-center justify-center text-[8px] text-white font-bold">AMEX</div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 font-medium text-center mt-4">© 2026 Pañalera Arcoiris. Todos los derechos reservados.</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
