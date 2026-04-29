import { Routes } from '@angular/router';
import { Productos } from './components/productos/productos';
import { Auth } from './components/auth/auth';
import { Perfil } from './components/perfil/perfil';
import { Ayuda } from './components/ayuda/ayuda';
import { Venta } from './components/venta/venta';
import { Admin } from './components/admin/admin';
import { Carrito } from './components/carrito/carrito';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: Productos },
  { path: 'login', component: Auth },
  { path: 'auth/callback', component: Auth },
  { path: 'perfil', component: Perfil },
  { path: 'ayuda', component: Ayuda },
  { path: 'venta', component: Venta },
  { path: 'admin', component: Admin },
  { path: 'carrito', component: Carrito },
];