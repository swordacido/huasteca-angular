import { Component, inject, Input } from '@angular/core';
import { AppStateService } from '../../services/app-state';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private state = inject(AppStateService);
  auth = inject(AuthService);
  @Input() isOpen = false;

  get userRole(): string {
    return this.auth.currentUser()?.role || 'CLIENTE';
  }

  get isAdmin(): boolean {
    return this.auth.currentUser()?.role === 'ADMIN';
  }

  get isSeller(): boolean {
    return this.auth.currentUser()?.role === 'VENDEDOR';
  }

  get isClient(): boolean {
    return this.auth.currentUser()?.role === 'CLIENTE';
  }

  navigate(section: string) {
    this.state.navigateTo(section);
  }

  close() {
    this.state.closeSidebar();
  }
}