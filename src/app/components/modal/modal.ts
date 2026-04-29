import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { AppStateService } from '../../services/app-state';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal {
  private state = inject(AppStateService);
  @Input() isOpen = false;
  @Input() title = '';
  @Input() message = '';
  @Input() price: number | null = null;
  @Output() cartAdded = new EventEmitter<void>();

  close() {
    this.state.closeModal();
  }

  addToCart() {
    this.cartAdded.emit();
    this.state.openModal(`✓ ${this.title} agregado al carrito`);
  }
}
