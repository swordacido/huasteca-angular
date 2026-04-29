import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { AuthService, User } from '../../services/auth.service';
import { Product, ProductDTO, Venta } from '../../models/types';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin implements OnInit {
  private api = inject(ApiService);
  auth = inject(AuthService);

  productos = signal<Product[]>([]);
  ventas = signal<Venta[]>([]);
  loading = signal(true);
  activeTab = signal<'products' | 'ventas' | 'usuarios'>('products');

  // Modal states
  showModal = signal(false);
  isEditing = signal(false);
  selectedProduct = signal<Product | null>(null);

  // Form data
  productForm: ProductDTO = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    imagen_url: ''
  };

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    this.api.getProducts().subscribe({
      next: (res) => {
        this.productos.set(res.products);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });

    if (this.auth.currentUser()?.role === 'ADMIN') {
      this.api.getVentas().subscribe({
        next: (res) => this.ventas.set(res.ventas),
        error: () => {}
      });
    }
  }

  openAddProduct() {
    this.isEditing.set(false);
    this.selectedProduct.set(null);
    this.resetForm();
    this.showModal.set(true);
  }

  openEditProduct(product: Product) {
    this.isEditing.set(true);
    this.selectedProduct.set(product);
    this.productForm = {
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      stock: product.stock,
      imagen_url: product.imagen_url
    };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.resetForm();
  }

  resetForm() {
    this.productForm = {
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      imagen_url: ''
    };
  }

  saveProduct() {
    if (this.isEditing()) {
      const product = this.selectedProduct();
      if (product) {
        this.api.updateProduct(product.id, this.productForm).subscribe({
          next: () => {
            this.closeModal();
            this.loadData();
          },
          error: (err) => console.error('Error updating product:', err)
        });
      }
    } else {
      this.api.createProduct(this.productForm).subscribe({
        next: () => {
          this.closeModal();
          this.loadData();
        },
        error: (err) => console.error('Error creating product:', err)
      });
    }
  }

  deleteProduct(product: Product) {
    if (confirm(`¿Estás seguro de eliminar "${product.nombre}"?`)) {
      this.api.deleteProduct(product.id).subscribe({
        next: () => this.loadData(),
        error: (err) => console.error('Error deleting product:', err)
      });
    }
  }

  getTotalStock(): number {
    return this.productos().reduce((sum, p) => sum + p.stock, 0);
  }

  getInventoryValue(): number {
    return this.productos().reduce((sum, p) => sum + (p.precio * p.stock), 0);
  }

  getTotalVentas(): number {
    return this.ventas().reduce((sum, v) => sum + v.total, 0);
  }

  getMonthlyVentas(): number {
    const now = new Date();
    return this.ventas()
      .filter(v => {
        const fecha = new Date(v.fecha);
        return fecha.getMonth() === now.getMonth() && fecha.getFullYear() === now.getFullYear();
      })
      .reduce((sum, v) => sum + v.total, 0);
  }
}