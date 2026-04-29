import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/types';

@Component({
  selector: 'app-seller',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seller.html',
  styleUrl: './seller.scss',
})
export class Seller implements OnInit {
  private api = inject(ApiService);
  auth = inject(AuthService);

  misProductos = signal<Product[]>([]);
  loading = signal(true);
  showModal = signal(false);
  isEditing = signal(false);
  ventas = signal<any[]>([]);

  productForm = {
    id: '',
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    imagen_url: ''
  };

  ngOnInit() {
    this.loadMyProducts();
    this.loadMySales();
  }

  loadMyProducts() {
    this.loading.set(true);
    const userId = this.auth.currentUser()?.id;

    this.api.getProducts().subscribe({
      next: (response) => {
        const misProd = response.products.filter(p => p.vendedor_id === userId);
        this.misProductos.set(misProd);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadMySales() {
    this.ventas.set([
      { id: '1', producto: 'Mi Producto A', cantidad: 3, total: 300, fecha: '2026-04-27' },
      { id: '2', producto: 'Mi Producto B', cantidad: 2, total: 200, fecha: '2026-04-25' },
    ]);
  }

  openCreateModal() {
    this.isEditing.set(false);
    this.productForm = { id: '', nombre: '', descripcion: '', precio: 0, stock: 0, imagen_url: '' };
    this.showModal.set(true);
  }

  openEditModal(product: Product) {
    this.isEditing.set(true);
    this.productForm = { ...product };
    this.showModal.set(true);
  }

  saveProduct() {
    if (this.isEditing()) {
      this.api.updateProduct(this.productForm.id, this.productForm).subscribe({
        next: () => {
          this.loadMyProducts();
          this.showModal.set(false);
        }
      });
    } else {
      this.api.createProduct(this.productForm).subscribe({
        next: () => {
          this.loadMyProducts();
          this.showModal.set(false);
        }
      });
    }
  }

  deleteProduct(id: string) {
    if (confirm('¿Estás seguro de eliminar tu producto?')) {
      this.api.deleteProduct(id).subscribe({
        next: () => this.loadMyProducts()
      });
    }
  }

  closeModal() {
    this.showModal.set(false);
  }
}
