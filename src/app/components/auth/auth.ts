import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AppStateService } from '../../services/app-state';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth implements OnInit {
  auth = inject(AuthService);
  private state = inject(AppStateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isLogin = signal(true);
  googleToken = '';
  error = signal('');
  loading = signal(false);

  ngOnInit() {
    // Google OAuth returns tokens in URL fragment (#), not query params (?)
    const fragment = window.location.hash.substring(1);
    if (fragment) {
      const params = new URLSearchParams(fragment);
      const accessToken = params.get('access_token');
      const state = params.get('state');
      if (accessToken && state) {
        this.handleGoogleCallback(accessToken, state);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }

  toggleAuth() {
    this.isLogin.update(v => !v);
    this.error.set('');
  }

  loginWithGoogle() {
    this.auth.loginWithGoogle();
  }

  navigateToInicio() {
    this.state.navigateTo('inicio');
  }

  logout() {
    this.auth.logout();
    this.state.navigateTo('login');
  }

  private handleGoogleCallback(accessToken: string, state: string) {
    this.loading.set(true);
    this.auth.handleGoogleCallback(accessToken, state).subscribe({
      next: () => {
        this.loading.set(false);
        this.state.navigateTo('inicio');
      },
      error: (err: any) => {
        this.loading.set(false);
        this.error.set('Error en autenticación con Google');
      }
    });
  }
}