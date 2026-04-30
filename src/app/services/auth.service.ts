import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  email: string;
  name: string;
  picture_url?: string;
  role: 'ADMIN' | 'VENDEDOR' | 'CLIENTE';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private readonly GOOGLE_CLIENT_ID = '115265766797-ui4mvgcbub7cj61oo5s1js6ijhj6vlna.apps.googleusercontent.com';
  private readonly REDIRECT_URI = `${window.location.origin}/auth/callback`;

  private _currentUser = signal<User | null>(null);
  private _isAuthenticated = signal(false);
  showAccountMenu = false;

  get currentUser() {
    return this._currentUser.asReadonly();
  }

  get isAuthenticated() {
    return this._isAuthenticated.asReadonly();
  }

  constructor(private http: HttpClient) {
    this.checkStoredAuth();
  }

  private checkStoredAuth() {
    const stored = localStorage.getItem('huasteca_user');
    const token = localStorage.getItem('huasteca_token');
    if (stored && token) {
      this._currentUser.set(JSON.parse(stored));
      this._isAuthenticated.set(true);
    }
  }

  loginWithGoogle(): void {
    const state = Math.random().toString(36).substring(7);
    sessionStorage.setItem('oauth_state', state);

    const params = new URLSearchParams({
      client_id: this.GOOGLE_CLIENT_ID,
      redirect_uri: this.REDIRECT_URI,
      response_type: 'token',
      scope: 'email profile openid',
      state: state,
      prompt: 'select_account'
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  handleGoogleCallback(accessToken: string, state: string): Observable<any> {
    const savedState = sessionStorage.getItem('oauth_state');
    if (state !== savedState) {
      return throwError(() => new Error('Invalid state parameter'));
    }

    return this.googleAuth(accessToken).pipe(
      tap(() => {
        sessionStorage.removeItem('oauth_state');
      }),
      catchError(err => {
        sessionStorage.removeItem('oauth_state');
        return throwError(() => err);
      })
    );
  }

  googleAuth(accessToken: string): Observable<any> {
    return this.http.post<{ token: string; user: User }>(`${this.API_URL}/auth/google`, { access_token: accessToken }).pipe(
      tap((response) => {
        this.saveAuth(response.token, response.user);
      }),
      catchError(err => {
        console.error('Google auth error:', err);
        return throwError(() => err);
      })
    );
  }

  private saveAuth(token: string, user: User) {
    this._currentUser.set(user);
    this._isAuthenticated.set(true);
    localStorage.setItem('huasteca_user', JSON.stringify(user));
    localStorage.setItem('huasteca_token', token);
  }

  getCurrentUser(): Observable<User> {
    const token = this.getToken();
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    return this.http.get<User>(`${this.API_URL}/me`, { headers });
  }

  logout(): void {
    // Limpiar señales
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
    // Limpiar localStorage
    localStorage.removeItem('huasteca_user');
    localStorage.removeItem('huasteca_token');
    // Notificar cambio
    console.log('Sesión cerrada');
  }

  getToken(): string | null {
    return localStorage.getItem('huasteca_token');
  }

  getAuthHeaders(): { headers: { Authorization: string } } {
    const token = this.getToken();
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    };
  }
}