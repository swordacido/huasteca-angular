export interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen_url: string;
  vendedor_id: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  picture_url?: string;
  role: 'ADMIN' | 'VENDEDOR' | 'CLIENTE';
}

export interface ProductDTO {
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  imagen_url?: string;
}

export interface Venta {
  id: string;
  producto_id: string;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
  total: number;
  comprador_id: string;
  vendedor_id: string;
  fecha: string;
}

export interface CarritoItem {
  product: Product;
  cantidad: number;
}

export interface LoginResponse {
  token: string;
  user: User;
}