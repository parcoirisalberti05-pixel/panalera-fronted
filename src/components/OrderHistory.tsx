import React, { useState } from 'react';
import { Search, Package, MapPin, Truck, CheckCircle2, Clock, Play, ArrowLeft, Calendar, CreditCard, ChevronRight } from 'lucide-react';
import { Order, TrackingStep } from '../types';

interface OrderHistoryProps {
  orders: Order[];
  activeOrderSearchId: string | null;
  onClearSearchId: () => void;
  onUpdateOrderStatus: (orderId: string, nextStatus: 'pendiente' | 'preparando' | 'en_camino' | 'entregado') => void;
  onBackToShop: () => void;
}

export default function OrderHistory({
  orders,
  activeOrderSearchId,
  onClearSearchId,
  onUpdateOrderStatus,
  onBackToShop
}: OrderHistoryProps) {
  const [searchTerm, setSearchTerm] = useState(activeOrderSearchId || '');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(
    orders.length > 0 ? (activeOrderSearchId || orders[0].id) : null
  );

  // Sync state if searched from the external trigger
  React.useEffect(() => {
    if (activeOrderSearchId) {
      setSearchTerm(activeOrderSearchId);
      setSelectedOrderId(activeOrderSearchId);
    }
  }, [activeOrderSearchId]);

  // Filter orders by search term (id or tracking number)
  const filteredOrders = orders.filter(o => {
    const term = searchTerm.toLowerCase().trim();
    if (term === '') return true;
    return o.id.toLowerCase().includes(term) || o.trackingNumber.toLowerCase().includes(term);
  });

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  // Format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Helper to determine status step number
  const getStatusStepIndex = (status: Order['status']) => {
    switch (status) {
      case 'pendiente': return 0;
      case 'preparando': return 1;
      case 'en_camino': return 2;
      case 'entregado': return 3;
    }
  };

  // Simulated status advancement triggers
  const advanceStatus = (order: Order) => {
    const currentIndex = getStatusStepIndex(order.status);
    if (currentIndex < 3) {
      const statuses: Order['status'][] = ['pendiente', 'preparando', 'en_camino', 'entregado'];
      const nextStatus = statuses[currentIndex + 1];
      onUpdateOrderStatus(order.id, nextStatus);
    }
  };

  return (
    <div className="w-full space-y-6" id="order-history-section">
      {/* Back button and title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-100 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToShop}
            className="cursor-pointer p-2.5 hover:bg-rose-50 rounded-full border border-rose-100 text-rose-400 hover:text-rose-500 transition-all shadow-xs"
            id="back-to-shop-btn"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2">
              <Package className="w-5 h-5 text-rose-400" />
              Seguimiento & Historial
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              Consultá tus compras realizadas y seguí el estado de tu envío en tiempo real
            </p>
          </div>
        </div>

        {/* Search input for order tracking */}
        <div className="relative w-full sm:w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <Search className="w-4 h-4 text-rose-400" />
          </span>
          <input
            type="text"
            placeholder="Buscar ID de Pedido o Envío..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              // Auto-select first matching order
              const matching = orders.find(o =>
                o.id.toLowerCase().includes(e.target.value.toLowerCase()) ||
                o.trackingNumber.toLowerCase().includes(e.target.value.toLowerCase())
              );
              if (matching) setSelectedOrderId(matching.id);
            }}
            className="w-full h-11 pl-10 pr-4 text-xs md:text-sm bg-white border border-rose-100 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition text-slate-700 shadow-xs placeholder-slate-400"
            id="tracking-search-input"
          />
        </div>
      </div>

      {/* Dynamic Tracking Summary Row matching the design mockup */}
      {selectedOrder && (
        <section className="animate-fade-in mb-8">
          <div className="bg-white rounded-3xl p-6 border border-rose-50 shadow-sm flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">🚚</div>
            <div className="flex-1 w-full">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-slate-800 text-sm md:text-base">Seguimiento de Envío</h3>
                <span className="text-xs font-bold text-sky-500 uppercase tracking-widest bg-sky-50 px-2.5 py-1 rounded-full">{selectedOrder.id}</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-sky-400 rounded-full transition-all duration-500" 
                  style={{ width: `${selectedOrder.status === 'pendiente' ? '25' : selectedOrder.status === 'preparando' ? '50' : selectedOrder.status === 'en_camino' ? '75' : '100'}%` }}
                />
              </div>
              <p className="text-xs mt-2.5 text-slate-500 font-medium">
                <strong>En camino:</strong> {
                  selectedOrder.status === 'pendiente' ? '¡Pago aprobado! Tu pedido está en lista de empaque.' :
                  selectedOrder.status === 'preparando' ? 'Estamos preparando tu paquete con mucho amor.' :
                  selectedOrder.status === 'en_camino' ? 'Tu pedido llega hoy antes de las 18:00hs' :
                  '¡Entregado! Tu pedido ya está en tus manos. ¡Muchas gracias!'
                }
              </p>
            </div>
          </div>
        </section>
      )}

      {orders.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-rose-100 rounded-3xl flex flex-col items-center justify-center p-6 bg-white/50" id="orders-empty-state">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-400 mb-4 shadow-sm">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-700">Aún no registraste compras</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Tus pedidos aprobados figurarán de forma segura en este panel para que puedas realizar el seguimiento detallado del envío.
          </p>
          <button
            onClick={onBackToShop}
            className="cursor-pointer mt-4 px-6 py-2.5 text-xs font-bold bg-rose-400 hover:bg-rose-500 text-white rounded-full shadow-md shadow-rose-200 transition-all"
          >
            Explorar Tienda
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Orders list selection (4 cols) */}
          <div className="lg:col-span-4 space-y-3 max-h-[600px] overflow-y-auto pr-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
              Listado de Pedidos ({filteredOrders.length})
            </h3>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const isActive = order.id === selectedOrderId;
                return (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`cursor-pointer w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                      isActive
                        ? 'bg-rose-50/50 border-rose-200 shadow-sm'
                        : 'bg-white border-rose-50 hover:border-rose-100 hover:shadow-xs'
                    }`}
                    id={`order-select-${order.id}`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-800">{order.id}</span>
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase ${
                          order.status === 'entregado' ? 'bg-emerald-50 text-emerald-600' :
                          order.status === 'en_camino' ? 'bg-indigo-50 text-indigo-600' :
                          order.status === 'preparando' ? 'bg-amber-50 text-amber-600' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {order.date} — {order.items.reduce((acc, i) => acc + i.quantity, 0)} artículos
                      </p>
                      <p className="text-xs font-bold text-slate-800">{formatPrice(order.total)}</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isActive ? 'translate-x-1' : ''}`} />
                  </button>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 italic p-4 text-center">No se encontraron pedidos con ese ID.</p>
            )}
          </div>

          {/* Right Column: Detailed Tracking and Invoice (8 cols) */}
          <div className="lg:col-span-8">
            {selectedOrder ? (
              <div className="bg-white border border-rose-100 rounded-3xl p-6 md:p-8 space-y-8 shadow-sm" id="order-details-container">
                {/* ID and Action Simulator banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-50 pb-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">Detalles de Pedido</span>
                      <h4 className="text-lg font-black text-slate-850">{selectedOrder.id}</h4>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                      <Truck className="w-3.5 h-3.5 text-rose-400" />
                      N° de Envío: <strong className="font-bold text-slate-700">{selectedOrder.trackingNumber}</strong>
                    </p>
                  </div>

                  {/* Shipment Status Simulator Tool */}
                  {selectedOrder.status !== 'entregado' && (
                    <button
                      onClick={() => advanceStatus(selectedOrder)}
                      className="cursor-pointer self-start sm:self-auto px-5 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-550 hover:to-teal-600 text-white font-bold text-xs rounded-full transition-all flex items-center gap-1.5 shadow-md shadow-emerald-100 hover:scale-105 active:scale-95"
                      id={`simulate-step-btn-${selectedOrder.id}`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Simular Avance de Envío</span>
                    </button>
                  )}
                </div>

                {/* 4-Step Interactive Tracking Stepper Timeline */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estado del Envío</h4>
                  
                  {/* Visual Stepper Row */}
                  <div className="relative flex items-center justify-between w-full pt-4 pb-8 px-2 md:px-8">
                    {/* Background Progress Bar */}
                    <div className="absolute left-8 right-8 top-1/2 -translate-y-4 h-1 bg-slate-100 z-0 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-400 transition-all duration-500 ease-in-out"
                        style={{
                          width: `${(getStatusStepIndex(selectedOrder.status) / 3) * 100}%`
                        }}
                      />
                    </div>

                    {/* Step 1: Recibido */}
                    <div className="flex flex-col items-center relative z-10 text-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        getStatusStepIndex(selectedOrder.status) >= 0
                          ? 'bg-rose-400 text-white shadow-md shadow-rose-200'
                          : 'bg-white border-2 border-slate-200 text-slate-400'
                      }`}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] md:text-xs font-bold text-slate-700 mt-2">Aprobado</span>
                    </div>

                    {/* Step 2: Preparando */}
                    <div className="flex flex-col items-center relative z-10 text-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        getStatusStepIndex(selectedOrder.status) >= 1
                          ? 'bg-rose-400 text-white shadow-md shadow-rose-200'
                          : 'bg-white border-2 border-slate-200 text-slate-400'
                      }`}>
                        <Clock className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] md:text-xs font-bold text-slate-700 mt-2">Preparado</span>
                    </div>

                    {/* Step 3: En camino */}
                    <div className="flex flex-col items-center relative z-10 text-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        getStatusStepIndex(selectedOrder.status) >= 2
                          ? 'bg-rose-400 text-white shadow-md shadow-rose-200'
                          : 'bg-white border-2 border-slate-200 text-slate-400'
                      }`}>
                        <Truck className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] md:text-xs font-bold text-slate-700 mt-2">En Viaje</span>
                    </div>

                    {/* Step 4: Entregado */}
                    <div className="flex flex-col items-center relative z-10 text-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        getStatusStepIndex(selectedOrder.status) >= 3
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-150'
                          : 'bg-white border-2 border-slate-200 text-slate-400'
                      }`}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] md:text-xs font-bold text-slate-700 mt-2">Entregado</span>
                    </div>
                  </div>

                  {/* Vertical Details Logs */}
                  <div className="bg-rose-50/20 rounded-3xl border border-rose-50 p-4 md:p-6 space-y-4">
                    {selectedOrder.trackingHistory.map((step, idx) => {
                      const isCompleted = getStatusStepIndex(selectedOrder.status) >= idx;
                      return (
                        <div key={idx} className="flex gap-4 items-start relative pb-4 last:pb-0" id={`tracking-log-${idx}`}>
                          {/* Line */}
                          {idx < selectedOrder.trackingHistory.length - 1 && (
                            <div className={`absolute left-[11px] top-6 bottom-0 w-0.5 ${isCompleted ? 'bg-rose-400/50' : 'bg-slate-200'}`} />
                          )}
                          {/* Indicator Circle */}
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 flex-shrink-0 relative z-10 ${
                            isCompleted ? 'bg-rose-50 border-rose-400 text-rose-500' : 'bg-white border-slate-200 text-slate-300'
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-rose-400' : 'bg-slate-200'}`} />
                          </div>
                          {/* Detail metadata */}
                          <div className="space-y-0.5">
                            <div className="flex flex-wrap items-baseline gap-2">
                              <h5 className={`text-xs md:text-sm font-bold capitalize ${isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                                {step.status}
                              </h5>
                              <span className="text-[10px] text-slate-400 font-medium">
                                {isCompleted && step.date === 'Pendiente' ? selectedOrder.date : step.date}
                              </span>
                            </div>
                            <p className={`text-xs font-medium ${isCompleted ? 'text-slate-600' : 'text-slate-400'}`}>
                              {step.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Shipping info and details box */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      Domicilio de Entrega
                    </h4>
                    <div className="bg-rose-50/20 border border-rose-50 p-5 rounded-3xl space-y-2 text-xs text-slate-600 font-medium">
                      <p><strong>Destinatario:</strong> {selectedOrder.shippingAddress.name}</p>
                      <p><strong>Dirección:</strong> {selectedOrder.shippingAddress.address}</p>
                      <p><strong>Localidad:</strong> {selectedOrder.shippingAddress.city} ({selectedOrder.shippingAddress.zipCode})</p>
                      <p><strong>Teléfono:</strong> {selectedOrder.shippingAddress.phone}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-rose-400" />
                      Método de Pago
                    </h4>
                    <div className="bg-rose-50/20 border border-rose-50 p-5 rounded-3xl space-y-2 text-xs text-slate-600 font-medium">
                      <p><strong>Tipo:</strong> {selectedOrder.paymentMethod.cardBrand}</p>
                      {selectedOrder.paymentMethod.last4 !== 'MP-Wallet' && (
                        <p><strong>Tarjeta terminada en:</strong> **** {selectedOrder.paymentMethod.last4}</p>
                      )}
                      <p><strong>Estado:</strong> <span className="text-emerald-600 font-bold">Aprobado</span></p>
                    </div>
                  </div>
                </div>

                {/* Items Purchase Summary */}
                <div className="space-y-3 border-t border-rose-100 pt-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Productos Comprados</h4>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item) => (
                      <div key={item.product.id} className="flex items-center gap-3 text-xs md:text-sm">
                        <div className="w-12 h-12 rounded-2xl border border-rose-50 bg-rose-50/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {item.product.image ? (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-12 h-12 object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-rose-300 stroke-[1.2]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-700 truncate">{item.product.name}</p>
                          <p className="text-slate-400 text-xs font-medium">{item.quantity} unidades x {formatPrice(item.product.price)}</p>
                        </div>
                        <span className="font-black text-slate-800">{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    ))}
                    <div className="pt-3.5 border-t border-rose-50 flex justify-between items-center text-sm font-bold text-slate-800">
                      <span>Total Abonado</span>
                      <span className="text-rose-500 text-lg font-black">{formatPrice(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-rose-50 rounded-3xl p-12 text-center text-slate-400 italic">
                Por favor seleccione un pedido del listado para ver su detalle de envío.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
