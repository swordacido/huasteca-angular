import { Component, inject } from '@angular/core';
import { AppStateService } from '../../services/app-state';

@Component({
  selector: 'app-nav-sub',
  standalone: true,
  templateUrl: './nav-sub.html',
  styleUrl: './nav-sub.scss',
})
export class NavSub {
  private state = inject(AppStateService);

  navigate(section: string) {
    this.state.navigateTo(section);
  }

  openMenu() {
    this.state.openSidebar();
  }
}