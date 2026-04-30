import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductDTO, User, Venta } from '../models/types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;

  getProducts(): Observable<{ products: Product[] }> {
    return this.http.get<{ products: Product[] }>(`${this.API_URL}/products`);
  }

  getProduct(id: string): Observable<{ product: Product }> {
    return this.http.get<{ product: Product }>(`${this.API_URL}/products/${id}`);
  }

  createProduct(product: ProductDTO): Observable<{ product: Product }> {
    return this.http.post<{ product: Product }>(`${this.API_URL}/products`, product);
  }

  updateProduct(id: string, product: Partial<ProductDTO>): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.API_URL}/products/${id}`, product);
  }

  deleteProduct(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/products/${id}`);
  }

  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<{ url: string }>(`${this.API_URL}/products/upload`, formData);
  }

  getPerfil(): Observable<User> {
    const token = localStorage.getItem('huasteca_token');
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    return this.http.get<User>(`${this.API_URL}/me`, { headers });
  }

  createVenta(productoId: string, cantidad: number): Observable<any> {
    return this.http.post(`${this.API_URL}/ventas`, { producto_id: productoId, cantidad });
  }

  getVentas(): Observable<{ ventas: Venta[] }> {
    return this.http.get<{ ventas: Venta[] }>(`${this.API_URL}/admin/ventas`);
  }

  getUsers(): Observable<{ users: User[] }> {
    return this.http.get<{ users: User[] }>(`${this.API_URL}/admin/users`);
  }

  updateProfile(data: { name: string; picture_url: string }): Observable<{ user: User }> {
    return this.http.put<{ user: User }>(`${this.API_URL}/me`, data);
  }
}