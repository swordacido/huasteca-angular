import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
import { AppStateService } from '../../services/app-state';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/types';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productos.html',
  styleUrl: './productos.scss',
})
export class Productos implements OnInit {
  private api = inject(ApiService);
  private state = inject(AppStateService);
  private cart = inject(CartService);

  productos = signal<Product[]>([]);
  loading = signal(true);
  selectedProduct = signal<Product | null>(null);
  quantity = signal(1);

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading.set(true);
    this.api.getProducts().subscribe({
      next: (response) => {
        this.productos.set(response.products);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  openProductModal(product: Product) {
    this.selectedProduct.set(product);
    this.quantity.set(1);
  }

  closeModal() {
    this.selectedProduct.set(null);
  }

  addToCartWithQuantity() {
    const product = this.selectedProduct();
    if (product) {
      this.cart.addItem(product, this.quantity());
      this.closeModal();
      setTimeout(() => {
        this.state.openModal(`✓ ${product.nombre} (${this.quantity()} unidades) agregado al carrito`);
      }, 100);
    }
  }

  increaseQuantity() {
    const current = this.quantity();
    const maxStock = this.selectedProduct()?.stock || 1;
    if (current < maxStock) {
      this.quantity.set(current + 1);
    }
  }

  decreaseQuantity() {
    const current = this.quantity();
    if (current > 1) {
      this.quantity.set(current - 1);
    }
  }
}