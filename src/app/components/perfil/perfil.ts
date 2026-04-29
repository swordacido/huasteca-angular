import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth.service';
import { AppStateService } from '../../services/app-state';
import { User } from '../../models/types';
import { signal, effect } from '@angular/core';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil implements OnInit {
  private api = inject(ApiService);
  auth = inject(AuthService);
  private state = inject(AppStateService);

  usuario = signal<User | null>(null);

  constructor() {
    effect(() => {
      const user = this.auth.currentUser();
      if (user) {
        this.usuario.set(user);
      } else {
        const token = localStorage.getItem('huasteca_token');
        if (token) {
          this.loadUserFromAPI();
        }
      }
    });
  }

  ngOnInit() {
    const currentUser = this.auth.currentUser();
    if (currentUser) {
      this.usuario.set(currentUser);
    } else {
      this.loadUserFromAPI();
    }
  }

  private loadUserFromAPI() {
    const token = localStorage.getItem('huasteca_token');
    if (token) {
      this.api.getPerfil().subscribe({
        next: (data: User) => this.usuario.set(data),
        error: (err: any) => {
          console.error('Error loading profile:', err);
          this.usuario.set(null);
        }
      });
    }
  }

  logout() {
    // Limpiar datos de sesión
    this.usuario.set(null);
    this.auth.logout(); // Esto limpia localStorage y señales
    // Redirigir a login
    this.state.navigateTo('login');
  }
}