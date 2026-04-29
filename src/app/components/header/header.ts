import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { AppStateService } from '../../services/app-state';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  auth = inject(AuthService);
  cart = inject(CartService);
  private state = inject(AppStateService);

  searchQuery = '';

  onSearch() {
    console.log('Buscar:', this.searchQuery);
  }

  navigate(section: string) {
    this.state.navigateTo(section);
  }
}