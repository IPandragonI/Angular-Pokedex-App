import { Injectable, signal } from '@angular/core';
import { delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #storageKey = 'pokedex_isLoggedIn';
  readonly #isLoggedIn = signal(false);
  readonly isLoggedIn = this.#isLoggedIn.asReadonly();

  constructor() {
    this.#isLoggedIn.set(this.#readStoredAuthState());
  }

  login(name: string, password: string) {
    const isLoggedIn = name === 'user' && password === 'user';
    this.#isLoggedIn.set(isLoggedIn);
    localStorage.setItem(this.#storageKey, String(isLoggedIn));
    return of(isLoggedIn).pipe(delay(1000));
  }

  readonly #readStoredAuthState = () => localStorage.getItem(this.#storageKey) === 'true';
}
