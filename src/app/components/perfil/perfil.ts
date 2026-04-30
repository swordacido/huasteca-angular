import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { AuthService, User } from '../../services/auth.service';
import { AppStateService } from '../../services/app-state';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil implements OnInit {
  private api = inject(ApiService);
  auth = inject(AuthService);
  private state = inject(AppStateService);

  usuario = signal<User | null>(null);
  isEditing = signal(false);
  editName = '';
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);

  constructor() {
    effect(() => {
      const user = this.auth.currentUser();
      if (user) {
        this.usuario.set(user);
      } else {
        const token = localStorage.getItem('huasteca_token');
        if (token) {
          this.loadUserFromAPI();
        }
      }
    });
  }

  ngOnInit() {
    const currentUser = this.auth.currentUser();
    if (currentUser) {
      this.usuario.set(currentUser);
    } else {
      this.loadUserFromAPI();
    }
  }

  private loadUserFromAPI() {
    const token = localStorage.getItem('huasteca_token');
    if (token) {
      this.api.getPerfil().subscribe({
        next: (data: User) => this.usuario.set(data),
        error: (err: any) => {
          console.error('Error loading profile:', err);
          this.usuario.set(null);
        }
      });
    }
  }

  startEdit() {
    this.editName = this.usuario()?.name || '';
    this.isEditing.set(true);
  }

  cancelEdit() {
    this.isEditing.set(false);
    this.selectedFile.set(null);
    this.previewUrl.set(null);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile.set(file);
      
      const reader = new FileReader();
      reader.onload = () => this.previewUrl.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    const user = this.usuario();
    if (!user) return;

    let pictureUrl = user.picture_url || '';

    if (this.selectedFile()) {
      this.api.uploadImage(this.selectedFile()!).subscribe({
        next: (res) => {
          this.updateUserProfile(res.url);
        },
        error: (err) => console.error('Error uploading image:', err)
      });
    } else {
      this.updateUserProfile(pictureUrl);
    }
  }

  private updateUserProfile(pictureUrl: string) {
    this.api.updateProfile({
      name: this.editName,
      picture_url: pictureUrl
    }).subscribe({
      next: (res) => {
        this.usuario.set(res.user);
        if (res.user) {
          localStorage.setItem('huasteca_user', JSON.stringify(res.user));
        }
        this.isEditing.set(false);
        this.selectedFile.set(null);
        this.previewUrl.set(null);
      },
      error: (err) => console.error('Error updating profile:', err)
    });
  }

  logout() {
    this.usuario.set(null);
    this.auth.logout();
    this.state.navigateTo('login');
  }
}