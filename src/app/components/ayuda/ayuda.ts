import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ayuda',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ayuda.html',
  styleUrl: './ayuda.scss',
})
export class Ayuda {
  expandedFaq = signal<number | null>(null);

  toggleFaq(index: number) {
    this.expandedFaq.set(this.expandedFaq() === index ? null : index);
  }
}