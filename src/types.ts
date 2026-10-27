export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'pañales' | 'higiene' | 'ropa' | 'calzado' | 'rodados' | 'alimentacion' | 'accesorios';
  subCategory?: 'Oleo' | 'Shampoo' | 'Acondicionador' | 'Algodón' | 'Toallitas Humedas' | 'Jabon' | 'Perfume' | 'Talco' | 'Protección' | 'Crema' | 'Aceite' | 'Nutrilon' | 'Sancor Advance' | 'Vital' | 'Otros' | 'Avent' | 'Nuk' | 'Loopi' | 'Natelle' | 'Dispita' | 'Vaita' | 'Varias Marcas' | 'No caminantes' | 'Primeros pasos' | 'Kids';
  image: string;
  rating: number;
  reviews: number;
  stock: number;
  featured: boolean;
  brand?: 'Estrella' | 'Huggies' | 'Pampers' | 'Baby Sec' | 'Nutrilon' | 'Sancor Advance' | 'Vital' | 'Otros' | 'Avent' | 'Nuk' | 'Loopi' | 'Natelle' | 'Dispita' | 'Vaita' | 'Varias Marcas' | 'Chapatitos';
  // Solo calzado: todos los talles de un mismo modelo y color comparten modelKey
  modelKey?: string;
  size?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  phone: string;
  zipCode: string;
}

export interface PaymentInfo {
  cardBrand: string;
  last4: string;
}

export interface TrackingStep {
  date: string;
  status: string;
  description: string;
  completed: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'pendiente' | 'preparando' | 'en_camino' | 'entregado';
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentInfo;
  trackingNumber: string;
  trackingHistory: TrackingStep[];
}
