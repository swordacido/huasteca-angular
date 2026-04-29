import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/types';

export interface CartItem {
  product: Product;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'huasteca_cart';

  private _items = signal<CartItem[]>([]);

  items = this._items.asReadonly();

  totalItems = computed(() => 
    this._items().reduce((sum, item) => sum + item.cantidad, 0)
  );

  totalPrice = computed(() => 
    this._items().reduce((sum, item) => sum + (item.product.precio * item.cantidad), 0)
  );

  constructor() {
    this.loadFromStorage();
  }

  addItem(product: Product, cantidad: number = 1) {
    const items = this._items();
    const existingIndex = items.findIndex(item => item.product.id === product.id);

    if (existingIndex >= 0) {
      const newItems = [...items];
      newItems[existingIndex] = {
        ...newItems[existingIndex],
        cantidad: newItems[existingIndex].cantidad + cantidad
      };
      this._items.set(newItems);
    } else {
      this._items.set([...items, { product, cantidad }]);
    }

    this.saveToStorage();
  }

  removeItem(productId: string) {
    this._items.set(this._items().filter(item => item.product.id !== productId));
    this.saveToStorage();
  }

  updateCantidad(productId: string, cantidad: number) {
    if (cantidad <= 0) {
      this.removeItem(productId);
      return;
    }

    const items = this._items();
    const index = items.findIndex(item => item.product.id === productId);

    if (index >= 0) {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], cantidad };
      this._items.set(newItems);
      this.saveToStorage();
    }
  }

  clearCart() {
    this._items.set([]);
    this.saveToStorage();
  }

  private saveToStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._items()));
  }

  private loadFromStorage() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this._items.set(JSON.parse(stored));
      } catch {
        this._items.set([]);
      }
    }
  }

  getItems(): CartItem[] {
    return this._items();
  }
}