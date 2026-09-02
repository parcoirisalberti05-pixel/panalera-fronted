import React, { useState } from 'react';
import { X, Lock, CreditCard, CheckCircle2, ShieldAlert, ShoppingBag, Truck, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, ShippingAddress, PaymentInfo, Order, TrackingStep } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderCompleted: (order: Order) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onOrderCompleted
}: CheckoutModalProps) {
  // Shipping Form State
  const [shipping, setShipping] = useState<ShippingAddress>({
    name: '',
    address: '',
    city: '',
    phone: '',
    zipCode: ''
  });
  const [email, setEmail] = useState('');

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mercadopago' | 'transfer'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  // Checkout Stages
  // 'form' -> 'processing' -> 'success'
  const [stage, setStage] = useState<'form' | 'processing' | 'success'>('form');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Computed values
  const total = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Simple card brand detector
  const getCardBrand = (num: string) => {
    const cleanNum = num.replace(/\D/g, '');
    if (cleanNum.startsWith('4')) return 'Visa';
    if (cleanNum.startsWith('5')) return 'Mastercard';
    if (cleanNum.startsWith('3')) return 'American Express';
    return 'Tarjeta';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const validateForm = () => {
    if (!shipping.name || !shipping.address || !shipping.city || !shipping.phone || !shipping.zipCode || !email) {
      alert('Por favor complete todos los datos de envío y contacto.');
      return false;
    }
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardName || !expiry || !cvc) {
        alert('Por favor complete todos los datos de su tarjeta.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Transition to processing loader
    setStage('processing');

    // Simulate SSL verified secure payment processing
    setTimeout(() => {
      const orderId = 'PP-' + Math.floor(100000 + Math.random() * 900000);
      const trackingNumber = 'ENV-' + Math.floor(1000000 + Math.random() * 9000000) + '-AR';
      
      const cardBrand = getCardBrand(cardNumber);
      const last4 = cardNumber.replace(/\D/g, '').slice(-4) || '8249';

      const initialHistory: TrackingStep[] = [
        {
          date: new Date().toLocaleDateString('es-AR', { hour: '2-digit', minute: '2-digit' }),
          status: 'pendiente',
          description: '¡Pago aprobado! Tu pedido ha sido recibido y está pendiente de validación.',
          completed: true
        },
        {
          date: 'Pendiente',
          status: 'preparando',
          description: 'Estamos embalando y preparando con mucho amor tus artículos para el envío.',
          completed: false
        },
        {
          date: 'Pendiente',
          status: 'en_camino',
          description: 'Tu pedido es entregado a la empresa de correo para su reparto.',
          completed: false
        },
        {
          date: 'Pendiente',
          status: 'entregado',
          description: '¡El pedido ya está en tus manos!',
          completed: false
        }
      ];

      const newOrder: Order = {
        id: orderId,
        date: new Date().toLocaleDateString('es-AR'),
        items: [...cartItems],
        total: total,
        status: 'pendiente',
        shippingAddress: shipping,
        paymentMethod: {
          cardBrand: paymentMethod === 'card' ? cardBrand : paymentMethod === 'mercadopago' ? 'Mercado Pago' : 'Transferencia Bancaria',
          last4: paymentMethod === 'card' ? last4 : 'MP-Wallet'
        },
        trackingNumber: trackingNumber,
        trackingHistory: initialHistory
      };

      setCreatedOrder(newOrder);
      onOrderCompleted(newOrder);
      setStage('success');
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900 cursor-pointer"
            id="checkout-backdrop"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl z-50 max-h-[90vh] flex flex-col"
            id="checkout-modal-container"
          >
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-rose-50 flex items-center justify-between bg-rose-50/10">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  Pago Seguro SSL
                </span>
              </div>
              {stage !== 'processing' && (
                <button
                  onClick={onClose}
                  className="cursor-pointer p-1.5 hover:bg-rose-50 rounded-full text-slate-500 transition"
                  id="checkout-close-btn"
                >
                  <X className="w-5 h-5 text-rose-450" />
                </button>
              )}
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              {stage === 'form' && (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Left Column: Form Fields (8 cols) */}
                  <div className="md:col-span-7 space-y-6">
                    {/* Contact details */}
                    <div>
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-3">1. Datos de Contacto</h3>
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Correo Electrónico</label>
                          <input
                            type="email"
                            required
                            placeholder="nombre@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-11 px-4 text-xs md:text-sm bg-white border border-rose-100 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all text-slate-700 shadow-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-3">2. Dirección de Entrega</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-500 mb-1">Nombre Completo del Destinatario</label>
                          <input
                            type="text"
                            required
                            placeholder="Juan Pérez"
                            value={shipping.name}
                            onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
                            className="w-full h-11 px-4 text-xs md:text-sm bg-white border border-rose-100 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all text-slate-700 shadow-xs"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-500 mb-1">Dirección de Envío</label>
                          <input
                            type="text"
                            required
                            placeholder="Av. Rivadavia 1234, Piso 2 Depto B"
                            value={shipping.address}
                            onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                            className="w-full h-11 px-4 text-xs md:text-sm bg-white border border-rose-100 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all text-slate-700 shadow-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Ciudad / Localidad</label>
                          <input
                            type="text"
                            required
                            placeholder="Ciudad Autónoma de Buenos Aires"
                            value={shipping.city}
                            onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                            className="w-full h-11 px-4 text-xs md:text-sm bg-white border border-rose-100 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all text-slate-700 shadow-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Código Postal</label>
                          <input
                            type="text"
                            required
                            placeholder="C1033AA"
                            value={shipping.zipCode}
                            onChange={(e) => setShipping({ ...shipping, zipCode: e.target.value })}
                            className="w-full h-11 px-4 text-xs md:text-sm bg-white border border-rose-100 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all text-slate-700 shadow-xs"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-500 mb-1">Teléfono de Contacto</label>
                          <input
                            type="tel"
                            required
                            placeholder="11 5555 4444"
                            value={shipping.phone}
                            onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                            className="w-full h-11 px-4 text-xs md:text-sm bg-white border border-rose-100 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all text-slate-700 shadow-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Payment Gateways Selection */}
                    <div>
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-3">3. Pasarela de Pago Segura</h3>
                      <div className="grid grid-cols-3 gap-2.5 mb-4">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('card')}
                          className={`cursor-pointer p-3.5 border rounded-2xl flex flex-col items-center gap-1.5 transition-all ${
                            paymentMethod === 'card'
                              ? 'border-rose-400 bg-rose-50/50 text-rose-500 font-bold shadow-xs'
                              : 'border-rose-50 bg-white text-slate-500 hover:border-rose-200'
                          }`}
                        >
                          <CreditCard className="w-4 h-4 text-rose-400" />
                          <span className="text-[10px] font-bold">Tarjeta</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('mercadopago')}
                          className={`cursor-pointer p-3.5 border rounded-2xl flex flex-col items-center gap-1.5 transition-all ${
                            paymentMethod === 'mercadopago'
                              ? 'border-rose-400 bg-rose-50/50 text-rose-500 font-bold shadow-xs'
                              : 'border-rose-50 bg-white text-slate-500 hover:border-rose-200'
                          }`}
                        >
                          <span className="text-sm font-black tracking-tight text-sky-500">MP</span>
                          <span className="text-[10px] font-bold">Mercado Pago</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('transfer')}
                          className={`cursor-pointer p-3.5 border rounded-2xl flex flex-col items-center gap-1.5 transition-all ${
                            paymentMethod === 'transfer'
                              ? 'border-rose-400 bg-rose-50/50 text-rose-500 font-bold shadow-xs'
                              : 'border-rose-50 bg-white text-slate-500 hover:border-rose-200'
                          }`}
                        >
                          <span className="text-xs font-black text-slate-750">CBU</span>
                          <span className="text-[10px] font-bold">Transferencia</span>
                        </button>
                      </div>

                      {/* Card Details form */}
                      {paymentMethod === 'card' && (
                        <div className="space-y-3.5 bg-rose-50/20 p-4 md:p-5 rounded-3xl border border-rose-50">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-500">Datos de la Tarjeta</span>
                            <span className="text-[10px] bg-rose-100 text-rose-600 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                              {getCardBrand(cardNumber)}
                            </span>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Número de Tarjeta</label>
                            <input
                              type="text"
                              required={paymentMethod === 'card'}
                              placeholder="4000 1234 5678 9010"
                              value={cardNumber}
                              maxLength={19}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                                setCardNumber(val);
                              }}
                              className="w-full h-11 px-4 text-xs md:text-sm bg-white border border-rose-100 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition shadow-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Nombre en la Tarjeta</label>
                            <input
                              type="text"
                              required={paymentMethod === 'card'}
                              placeholder="JUAN PEREZ"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value.toUpperCase())}
                              className="w-full h-11 px-4 text-xs md:text-sm bg-white border border-rose-100 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition shadow-xs"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Vencimiento</label>
                              <input
                                type="text"
                                required={paymentMethod === 'card'}
                                placeholder="MM/AA"
                                maxLength={5}
                                value={expiry}
                                onChange={(e) => {
                                  let val = e.target.value;
                                  if (val.length === 2 && !val.includes('/')) {
                                    val += '/';
                                  }
                                  setExpiry(val);
                                }}
                                className="w-full h-11 px-4 text-xs md:text-sm bg-white border border-rose-100 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition shadow-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 mb-0.5">CVV (Clave)</label>
                              <input
                                type="password"
                                required={paymentMethod === 'card'}
                                placeholder="***"
                                maxLength={4}
                                value={cvc}
                                onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                                className="w-full h-11 px-4 text-xs md:text-sm bg-white border border-rose-100 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition shadow-xs"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Mercado Pago Mock info */}
                      {paymentMethod === 'mercadopago' && (
                        <div className="p-4 bg-sky-50/50 border border-sky-100 rounded-2xl text-xs space-y-2 text-slate-650 font-medium">
                          <p className="font-bold text-sky-700">Integración Oficial de Mercado Pago</p>
                          <p>Al hacer clic en pagar, se abrirá la pasarela segura integrada para abonar con saldo, tarjeta o dinero en cuenta.</p>
                        </div>
                      )}

                      {/* Bank Transfer info */}
                      {paymentMethod === 'transfer' && (
                        <div className="p-4 bg-rose-50/30 border border-rose-100 rounded-2xl text-xs space-y-2 text-slate-650 font-medium">
                          <p className="font-bold text-rose-500">Instrucciones para Transferencia</p>
                          <p><strong>CBU:</strong> 0000003100012345678901</p>
                          <p><strong>Alias:</strong> panalera.arcoiris</p>
                          <p>Por favor, envíe el comprobante de transferencia junto con su número de orden a <strong className="text-slate-800">ayuda@arcoiris.com</strong> para validar la entrega.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Order Summary (5 cols) */}
                  <div className="md:col-span-5 space-y-6">
                    <div className="bg-rose-50/20 border border-rose-50 rounded-3xl p-5.5 space-y-4 shadow-xs">
                      <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b border-rose-50 pb-2 flex items-center gap-1.5">
                        <ShoppingBag className="w-4 h-4 text-rose-400" />
                        Resumen del Pedido
                      </h4>

                      {/* List Items in miniature */}
                      <div className="max-h-48 overflow-y-auto space-y-3 pr-1">
                        {cartItems.map((item) => (
                          <div key={item.product.id} className="flex items-center gap-2.5 text-xs font-medium">
                            <div className="w-10 h-10 rounded-xl border border-rose-50/85 bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {item.product.image ? (
                                <img
                                  src={item.product.image}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <Package className="w-5 h-5 text-rose-300 stroke-[1.2]" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-slate-700 truncate">{item.product.name}</p>
                              <p className="text-slate-400 text-[10px]">{item.quantity} un. x {formatPrice(item.product.price)}</p>
                            </div>
                            <span className="font-black text-slate-800">{formatPrice(item.product.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Total Calculations */}
                      <div className="pt-3 border-t border-rose-50 space-y-1.5 text-xs text-slate-600 font-medium">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>{formatPrice(total)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Envío a Domicilio</span>
                          <span className="text-teal-600 font-bold">Gratis</span>
                        </div>
                        <div className="flex justify-between font-bold text-slate-800 text-sm pt-2 border-t border-rose-100">
                          <span>Total</span>
                          <span className="text-rose-500 text-base font-black">{formatPrice(total)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Security Trust badge */}
                    <div className="border border-emerald-100 bg-emerald-50/30 rounded-3xl p-5 text-xs space-y-2">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                        <ShieldAlert className="w-4 h-4 text-emerald-600" />
                        <span>Compra Certificada PCI-DSS</span>
                      </div>
                      <p className="text-slate-500 leading-relaxed font-medium">
                        Nuestras pasarelas de pago cuentan con encriptación avanzada AES-256 de extremo a extremo, resguardando tu privacidad y seguridad bancaria.
                      </p>
                    </div>

                    {/* Submit Pay Button */}
                    <button
                      type="submit"
                      className="cursor-pointer w-full h-12 bg-rose-400 hover:bg-rose-500 active:scale-[0.98] text-white font-black text-sm rounded-full flex items-center justify-center gap-2 transition duration-200 shadow-md shadow-rose-200"
                      id="pay-submit-btn"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Confirmar y Pagar {formatPrice(total)}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Processing Spinner State */}
              {stage === 'processing' && (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-6" id="payment-processing-loader">
                  <div className="relative flex items-center justify-center">
                    {/* Ring */}
                    <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-rose-400 animate-spin"></div>
                    <Lock className="w-6 h-6 text-rose-400 absolute" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-800">Procesando Pago Seguro...</h3>
                    <p className="text-xs text-slate-400 max-w-sm font-medium">
                      Estamos contactando a la pasarela de pago para validar la transacción de forma encriptada SSL. Por favor no cierres esta ventana.
                    </p>
                  </div>
                </div>
              )}

              {/* Success Screen State */}
              {stage === 'success' && createdOrder && (
                <div className="py-12 flex flex-col items-center text-center max-w-lg mx-auto space-y-6" id="checkout-success-view">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                    <CheckCircle2 className="w-12 h-12 animate-bounce" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-black text-slate-800">¡Compra Realizada con Éxito!</h2>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      Te enviamos un correo electrónico a <strong>{email}</strong> con el comprobante de pago y los detalles del envío.
                    </p>
                  </div>

                  {/* Summary Box */}
                  <div className="w-full bg-rose-50/20 border border-rose-50 p-5 rounded-3xl text-left space-y-3.5 text-xs md:text-sm text-slate-650 font-medium shadow-xs">
                    <div className="flex justify-between border-b border-rose-50 pb-2">
                      <span className="font-bold text-slate-700">ID de Pedido:</span>
                      <strong className="font-black text-slate-900">{createdOrder.id}</strong>
                    </div>
                    <div className="flex justify-between border-b border-rose-50 pb-2">
                      <span className="font-bold text-slate-700">Número de Seguimiento:</span>
                      <strong className="font-black text-rose-400 flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-rose-50">
                        <Truck className="w-4 h-4 text-sky-400" />
                        {createdOrder.trackingNumber}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-700">Entregar a:</span>
                      <span className="text-slate-900 font-bold">{createdOrder.shippingAddress.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-700">Dirección:</span>
                      <span className="text-slate-900 text-right">{createdOrder.shippingAddress.address}, {createdOrder.shippingAddress.city}</span>
                    </div>
                  </div>

                  <div className="w-full pt-4 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={onClose}
                      className="cursor-pointer flex-1 h-11 border border-rose-200 bg-white hover:bg-rose-50 text-rose-500 font-bold text-xs rounded-full transition flex items-center justify-center gap-2"
                      id="back-to-store-btn"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Volver a la Tienda</span>
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        window.dispatchEvent(new CustomEvent('nav-tracking', { detail: createdOrder.id }));
                      }}
                      className="cursor-pointer flex-1 h-11 bg-rose-400 hover:bg-rose-500 text-white font-black text-xs rounded-full transition flex items-center justify-center gap-2 shadow-md shadow-rose-200"
                      id="view-tracking-btn"
                    >
                      <Truck className="w-4 h-4" />
                      <span>Seguimiento de Envío</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
