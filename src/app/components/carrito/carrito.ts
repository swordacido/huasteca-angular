import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth.service';
import { AppStateService } from '../../services/app-state';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.scss',
})
export class Carrito implements OnInit {
  cart = inject(CartService);
  api = inject(ApiService);
  auth = inject(AuthService);
  state = inject(AppStateService);

  loading = signal(false);
  message = signal('');
  showMessage = signal(false);

  ngOnInit() {}

  getItems(): CartItem[] {
    return this.cart.items();
  }

  getTotal(): number {
    return this.cart.totalPrice();
  }

  getTotalItems(): number {
    return this.cart.totalItems();
  }

  removeItem(productId: string) {
    this.cart.removeItem(productId);
  }

  updateCantidad(productId: string, delta: number) {
    const item = this.cart.items().find(i => i.product.id === productId);
    if (item) {
      const newCantidad = item.cantidad + delta;
      if (newCantidad > 0 && newCantidad <= item.product.stock) {
        this.cart.updateCantidad(productId, newCantidad);
      }
    }
  }

  async checkout() {
    this.loading.set(true);
    this.message.set('');
    this.showMessage.set(false);

    const items = this.cart.items();

    if (items.length === 0) {
      this.message.set('Tu carrito está vacío');
      this.showMessage.set(true);
      this.loading.set(false);
      return;
    }

    try {
      for (const item of items) {
        await this.api.createVenta(item.product.id, item.cantidad).toPromise();
      }

      this.cart.clearCart();
      this.message.set('¡Compra exitosa! Gracias por tu pedido');
      this.showMessage.set(true);
    } catch (error: any) {
      this.message.set(error?.error?.error || 'Error al procesar la compra');
      this.showMessage.set(true);
    }

    this.loading.set(false);
  }

  closeMessage() {
    this.showMessage.set(false);
    if (this.message().includes('éxito')) {
      this.state.navigateTo('inicio');
    }
  }
}