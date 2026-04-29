import { Component, inject } from '@angular/core';
import { Header } from './components/header/header';
import { Sidebar } from './components/sidebar/sidebar';
import { NavSub } from './components/nav-sub/nav-sub';
import { Modal } from './components/modal/modal';
import { AppStateService } from './services/app-state';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, Sidebar, NavSub, Modal, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private state = inject(AppStateService);
  protected readonly sidebarOpen = this.state.sidebarOpen;
  protected readonly modalOpen = this.state.modalOpen;
  protected readonly modalTitle = this.state.modalTitle;
  protected readonly modalMessage = this.state.modalMessage;
  protected readonly modalPrice = this.state.modalPrice;
}