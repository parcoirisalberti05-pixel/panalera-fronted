import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onOpenCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onOpenCheckout
}: CartDrawerProps) {
  const total = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900 z-50 cursor-pointer"
            id="cart-backdrop"
          />

          {/* Drawer container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col h-full"
            id="cart-drawer"
          >
            {/* Header */}
            <div className="p-4.5 border-b border-rose-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-rose-400" />
                <h2 className="text-base md:text-lg font-black text-slate-800">Tu Carrito</h2>
                <span className="bg-rose-50 text-rose-500 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              </div>
              <button
                onClick={onClose}
                className="cursor-pointer p-1.5 hover:bg-rose-50 rounded-full text-slate-500 transition"
                id="close-cart-btn"
                aria-label="Cerrar Carrito"
              >
                <X className="w-5 h-5 text-rose-450" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3 bg-white p-3.5 rounded-3xl border border-rose-50 shadow-xs"
                    id={`cart-item-${item.product.id}`}
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-rose-50/20 border border-rose-50/60 flex-shrink-0 flex items-center justify-center">
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="text-rose-300">
                          <Package className="w-6 h-6 stroke-[1.2]" />
                        </div>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs md:text-sm font-bold text-slate-800 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-medium">
                        {formatPrice(item.product.price)} x {item.quantity}
                      </p>
                      
                      {/* Quantity Incrementor / Decrementor */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="cursor-pointer w-6 h-6 rounded-lg bg-white border border-rose-100 flex items-center justify-center hover:border-rose-300 text-rose-400 transition"
                          id={`qty-minus-${item.product.id}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-slate-700 w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="cursor-pointer w-6 h-6 rounded-lg bg-white border border-rose-100 flex items-center justify-center hover:border-rose-300 text-rose-400 transition"
                          disabled={item.quantity >= item.product.stock}
                          id={`qty-plus-${item.product.id}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex flex-col items-end gap-3 justify-between h-full">
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="cursor-pointer p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                        id={`remove-cart-item-${item.product.id}`}
                        aria-label="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <span className="text-xs md:text-sm font-black text-slate-800">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-12" id="cart-empty-state">
                  <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-400 mb-4 shadow-sm">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-sm font-black text-slate-700">Tu carrito está vacío</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-[240px] font-medium leading-relaxed">
                    ¡Explorá nuestras secciones de pañales, ropita y accesorios para empezar a sumar artículos!
                  </p>
                  <button
                    onClick={onClose}
                    className="cursor-pointer mt-4 px-6 py-2.5 text-xs font-bold bg-rose-400 text-white rounded-full shadow-md shadow-rose-100 hover:bg-rose-500 transition-all hover:scale-105"
                  >
                    Ver catálogo
                  </button>
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div className="p-4 border-t border-rose-50 bg-[#FFFBF9] space-y-4">
                <div className="space-y-1.5 text-xs text-slate-500 font-medium">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span className="text-teal-600 font-bold">¡GRATIS!</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-800 pt-1.5 border-t border-rose-50">
                    <span>Total a pagar</span>
                    <span className="text-rose-500 text-base font-black">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 justify-center py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-[10px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pago 100% Protegido con SSL de 256 bits</span>
                </div>

                <button
                  onClick={onOpenCheckout}
                  className="cursor-pointer w-full h-12 bg-rose-400 hover:bg-rose-500 active:scale-[0.99] text-white font-black text-xs md:text-sm rounded-full flex items-center justify-center gap-2 transition duration-200 shadow-md shadow-rose-200"
                  id="checkout-trigger-btn"
                >
                  <span>Iniciar Compra Segura</span>
                  <ArrowRight className="w-4 h-4 animate-pulse" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
