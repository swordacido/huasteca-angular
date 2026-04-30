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
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);

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
    this.api.getVentas().subscribe({
      next: (res) => {
        const userId = this.auth.currentUser()?.id;
        const misVentas = res.ventas.filter(v => v.vendedor_id === userId);
        this.ventas.set(misVentas);
      },
      error: (err) => console.error('Error loading sales:', err)
    });
  }

  openCreateModal() {
    this.isEditing.set(false);
    this.productForm = { id: '', nombre: '', descripcion: '', precio: 0, stock: 0, imagen_url: '' };
    this.selectedFile.set(null);
    this.previewUrl.set(null);
    this.showModal.set(true);
  }

  openEditModal(product: Product) {
    this.isEditing.set(true);
    this.productForm = { ...product };
    this.selectedFile.set(null);
    this.previewUrl.set(null);
    this.showModal.set(true);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile.set(file);
      
      const reader = new FileReader();
      reader.onload = () => this.previewUrl.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedFile.set(null);
    this.previewUrl.set(null);
    if (!this.isEditing()) {
      this.productForm.imagen_url = '';
    }
  }

  saveProduct() {
    if (this.selectedFile()) {
      this.api.uploadImage(this.selectedFile()!).subscribe({
        next: (res) => {
          this.productForm.imagen_url = res.url;
          this.saveProductToAPI();
        },
        error: (err) => console.error('Error uploading image:', err)
      });
    } else {
      this.saveProductToAPI();
    }
  }

  private saveProductToAPI() {
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
