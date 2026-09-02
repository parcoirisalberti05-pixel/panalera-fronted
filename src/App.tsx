import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Carousel from './components/Carousel';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderHistory from './components/OrderHistory';
import { Product, CartItem, Order } from './types';
import { PRODUCTS } from './data/products';
import { ShieldCheck, Truck, PhoneCall, HelpCircle, Heart, Instagram } from 'lucide-react';

export default function App() {
  // 1. Core States
  const [cart, setCart] = useState<CartItem[]>(() => {
    const cached = localStorage.getItem('peque_cart');
    return cached ? JSON.parse(cached) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const cached = localStorage.getItem('peque_orders');
    if (cached) {
      return JSON.parse(cached);
    }
    
    // Default sweet history orders for immediate high-fidelity viewing
    const defaultOrders: Order[] = [
      {
        id: 'PP-289104',
        date: '10/07/2026',
        items: [
          { product: PRODUCTS[0], quantity: 2 }, // Pañales
          { product: PRODUCTS[4], quantity: 1 }  // Óleo calcáreo
        ],
        total: 35700,
        status: 'entregado',
        shippingAddress: {
          name: 'Sofía Rodríguez',
          address: 'Av. Santa Fe 3421, Piso 3A',
          city: 'Palermo, CABA',
          phone: '11 4567 8912',
          zipCode: 'C1425BGA'
        },
        paymentMethod: {
          cardBrand: 'Visa',
          last4: '4931'
        },
        trackingNumber: 'ENV-4891024-AR',
        trackingHistory: [
          {
            date: '10/07/2026 14:32',
            status: 'pendiente',
            description: '¡Pago aprobado! Tu pedido ha sido recibido y está pendiente de validación.',
            completed: true
          },
          {
            date: '11/07/2026 09:15',
            status: 'preparando',
            description: 'Estamos embalando y preparando con mucho amor tus artículos para el envío.',
            completed: true
          },
          {
            date: '11/07/2026 15:40',
            status: 'en_camino',
            description: 'Tu pedido es entregado a la empresa de correo para su reparto.',
            completed: true
          },
          {
            date: '13/07/2026 11:20',
            status: 'entregado',
            description: '¡El pedido ya está en tus manos!',
            completed: true
          }
        ]
      }
    ];
    return defaultOrders;
  });

  const [activeCategory, setActiveCategory] = useState<'pañales' | 'higiene' | 'ropa' | 'calzado' | 'rodados' | 'alimentacion' | 'accesorios' | null>(null);
  const [currentView, setCurrentView] = useState<'shop' | 'tracking'>('shop');
  const [activeOrderSearchId, setActiveOrderSearchId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // UI Open/Close States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // 2. Cache Synchronization
  useEffect(() => {
    localStorage.setItem('peque_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('peque_orders', JSON.stringify(orders));
  }, [orders]);

  // 3. Listen to external routing triggers (e.g. from Success screen inside Checkout)
  useEffect(() => {
    const handleNavTracking = (e: Event) => {
      const orderId = (e as CustomEvent).detail;
      setActiveOrderSearchId(orderId);
      setCurrentView('tracking');
    };

    window.addEventListener('nav-tracking', handleNavTracking);
    return () => window.removeEventListener('nav-tracking', handleNavTracking);
  }, []);

  // 4. Cart Operation Handlers
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        // Prevent exceeding stock limit
        if (existing.quantity >= product.stock) {
          alert(`Disculpas, solo contamos con ${product.stock} unidades en stock.`);
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    // Open drawer automatically for microinteraction feedback
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            // Prevent exceeding product stock
            if (nextQty > item.product.stock) {
              alert(`Solo hay ${item.product.stock} unidades en stock de este artículo.`);
              return item;
            }
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // 5. Order Management Handlers
  const handleOrderCompleted = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    // Clear cart
    setCart([]);
  };

  const handleUpdateOrderStatus = (orderId: string, nextStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          // Clone the tracking steps and activate the target one
          const statusIndex = ['pendiente', 'preparando', 'en_camino', 'entregado'].indexOf(nextStatus);
          const nowStr = new Date().toLocaleDateString('es-AR', { hour: '2-digit', minute: '2-digit' });
          
          const updatedHistory = order.trackingHistory.map((step, idx) => {
            if (idx <= statusIndex) {
              return {
                ...step,
                completed: true,
                date: step.date === 'Pendiente' ? nowStr : step.date
              };
            }
            return step;
          });

          return {
            ...order,
            status: nextStatus,
            trackingHistory: updatedHistory
          };
        }
        return order;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#FCF8F5] flex flex-col font-sans" id="app-root">
      {/* Upper Navigation Bar */}
      <Navbar
        cartItems={cart}
        onOpenCart={() => setIsCartOpen(true)}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onNavigateToView={setCurrentView}
        currentView={currentView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
        {currentView === 'shop' ? (
          <div className="space-y-8 animate-fade-in">
            {/* Show carousel only on main home catalog (no filter) */}
            {!activeCategory && (
              <Carousel onSelectCategory={setActiveCategory} />
            )}

            {/* Catalog Grid */}
            <ProductGrid
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              onAddToCart={handleAddToCart}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
        ) : (
          <div className="animate-fade-in">
            <OrderHistory
              orders={orders}
              activeOrderSearchId={activeOrderSearchId}
              onClearSearchId={() => setActiveOrderSearchId(null)}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onBackToShop={() => setCurrentView('shop')}
            />
          </div>
        )}
      </main>

      {/* Sliding Shopping Cart Overlay */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onOpenCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Secure Checkout Screen Dialog */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Trust & Help Footer Banner */}
      <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800" id="store-footer">
        {/* Superior Row: Brand Values */}
        <div className="border-b border-slate-800 py-10 px-4 md:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Transacciones 100% Seguras</h4>
                <p className="text-xs text-slate-400 mt-0.5">Pasarelas encriptadas con protocolos SSL modernos.</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Soporte y Atención Personalizada</h4>
                <p className="text-xs text-slate-400 mt-0.5">¿Dudas? Chat directo por WhatsApp las 24 hs.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Inferior Row: Links and Copyright */}
        <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-xs md:text-sm">
          <div className="space-y-3">
            <h5 className="font-bold text-white text-base">Pañalera Arcoiris</h5>
            <p className="text-slate-400 leading-relaxed text-xs">
              Tu tienda de confianza especializada en brindar artículos de máxima calidad para el cuidado y crecimiento feliz de los más pequeños.
            </p>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs">Secciones</h5>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => { setActiveCategory('pañales'); setCurrentView('shop'); }} className="cursor-pointer hover:text-white transition-colors">Pañales</button></li>
              <li><button onClick={() => { setActiveCategory('higiene'); setCurrentView('shop'); }} className="cursor-pointer hover:text-white transition-colors">Higiene</button></li>
              <li><button onClick={() => { setActiveCategory('alimentacion'); setCurrentView('shop'); }} className="cursor-pointer hover:text-white transition-colors">Alimentación</button></li>
              <li><button onClick={() => { setActiveCategory('ropa'); setCurrentView('shop'); }} className="cursor-pointer hover:text-white transition-colors">Ropa</button></li>
              <li><button onClick={() => { setActiveCategory('calzado'); setCurrentView('shop'); }} className="cursor-pointer hover:text-white transition-colors">Calzado</button></li>
              <li><button onClick={() => { setActiveCategory('rodados'); setCurrentView('shop'); }} className="cursor-pointer hover:text-white transition-colors">Rodados</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs">Soporte</h5>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors"><HelpCircle className="w-4 h-4 text-rose-450" /> Centro de ayuda</li>
              <li className="cursor-pointer hover:text-white transition-colors">Preguntas frecuentes (FAQ)</li>
              <li className="cursor-pointer hover:text-white transition-colors">Políticas de devolución</li>
              <li className="cursor-pointer hover:text-white transition-colors">Términos y condiciones</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs">Ubicación y Contacto</h5>
            <p className="text-slate-400 leading-relaxed text-xs">
              Hipolito Irigoyen 520, Manuel Alberti, Buenos Aires, Argentina.<br />
              <strong>Email:</strong> p.arcoiris.alberti05@gmail.com<br />
              <strong>Teléfono:</strong> 1160438977
            </p>
          </div>
        </div>

        {/* Bottom credits */}
        <div className="bg-slate-950 py-6 px-4 md:px-8 border-t border-slate-800 text-center text-[11px] text-slate-500">
          <p className="flex items-center justify-center gap-1">
            Hecho con <Heart className="w-3 h-3 text-rose-400 fill-rose-400" /> para tu bebé © {new Date().getFullYear()} Pañalera Arcoiris. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* Floating Instagram Button */}
      <a
        href="https://www.instagram.com/p.arcoiris.alberti"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 z-50 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white p-4 rounded-full shadow-lg hover:opacity-95 transition-all duration-300 hover:scale-110 flex items-center justify-center"
        title="Perfil de Instagram"
        id="instagram-floating-button"
      >
        <Instagram className="w-6 h-6" />
      </a>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/5491160438977"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#20ba5a] transition-all duration-300 hover:scale-110 flex items-center justify-center"
        title="Chat de WhatsApp"
        id="whatsapp-floating-button"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.705 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}

