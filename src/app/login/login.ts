import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styles: ``,
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly name = signal('');
  readonly password = signal('');
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  onSubmit(event: Event) {
    event.preventDefault();
    
    if (!this.name().trim() || !this.password().trim()) {
      this.error.set('Veuillez remplir tous les champs');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.authService.login(this.name(), this.password()).subscribe((isLoggedIn) => {
      this.loading.set(false);
      if (isLoggedIn) {
        this.router.navigate(['/pokemons']);
      } else {
        this.name.set('');
        this.password.set('');
        this.error.set('Identifiants invalides');
      }
    });
  }
}
