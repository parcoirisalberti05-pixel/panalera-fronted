import React, { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, Sparkles, FilterX } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS as BASE_PRODUCTS } from '../data/products';
import { CALZADO } from '../data/calzado';
import ProductCard from './ProductCard';
import ShoeCard from './ShoeCard';

// Catálogo completo: productos generales + calzado (un producto por talle)
const PRODUCTS: Product[] = [...BASE_PRODUCTS, ...CALZADO];

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
const API_URL = 'https://panalera-backend-production.up.railway.app/api/productos-web';

export default function ProductGrid({
  activeCategory,
  onSelectCategory,
  onAddToCart,
  searchQuery,
