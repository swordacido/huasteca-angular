import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private router = inject(Router);

  currentSection = signal<string>('inicio');
  sidebarOpen = signal<boolean>(false);
  modalOpen = signal<boolean>(false);
  modalTitle = signal<string>('');
  modalMessage = signal<string>('');
  modalPrice = signal<number | null>(null);

  navigateTo(section: string) {
    this.currentSection.set(section);
    this.router.navigate([section]);
    this.closeSidebar();
    window.scrollTo(0, 0);
  }

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }

  openSidebar() {
    this.sidebarOpen.set(true);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }

  openModal(message: string) {
    this.modalTitle.set('Información');
    this.modalMessage.set(message);
    this.modalPrice.set(null);
    this.modalOpen.set(true);
  }

  openProductModal(title: string, description: string, price: number) {
    this.modalTitle.set(title);
    this.modalMessage.set(description);
    this.modalPrice.set(price);
    this.modalOpen.set(true);
  }

  closeModal() {
    this.modalOpen.set(false);
  }
}