import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PokemonService } from '../../pokemon.service';
import { Title } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-pokemon-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './pokemon-profile.html',
  styles: ``,
})
export class PokemonProfile {
  readonly #route = inject(ActivatedRoute);
  readonly #title = inject(Title);
  readonly pokemonService = inject(PokemonService);
  readonly #router = inject(Router);

  readonly #pokemonId = Number(this.#route.snapshot.paramMap.get('id'));
  readonly #pokemonResponse = toSignal(
    this.pokemonService.getPokemonById(this.#pokemonId).pipe(
      map((pokemon) => ({ value: pokemon, error: undefined })),
      catchError((error) => of({ value: undefined, error })),
    ),
  );

  readonly loading = computed(() => this.#pokemonResponse() === undefined);
  readonly error = computed(() => this.#pokemonResponse()?.error);
  readonly pokemon = computed(() => this.#pokemonResponse()?.value);

  constructor() {
    effect(() => {
      const { value: pokemon, error } = this.#pokemonResponse() ?? {};
      if (pokemon) {
        this.#title.setTitle(pokemon.name);
      } else if (error) {
        this.#title.setTitle('Pokémon non trouvé');
      }
    });
  }

  deletePokemon(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce Pokémon ?')) {
      this.pokemonService.deletePokemon(this.#pokemonId).subscribe({
        next: () => {
          this.#router.navigate(['/pokemons']);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du Pokémon :', err);
          alert('Une erreur est survenue lors de la suppression du Pokémon.');
        },
      });
    }
  }
}
