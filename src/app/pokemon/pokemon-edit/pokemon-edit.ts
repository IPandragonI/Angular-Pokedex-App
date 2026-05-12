import { Component, computed, effect, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PokemonService } from '../../pokemon.service';
import { Pokemon, POKEMON_RULES } from '../../pokemon.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-pokemon-edit',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './pokemon-edit.html',
  styles: ``,
})
export class PokemonEdit {
  readonly #route = inject(ActivatedRoute);
  readonly #title = inject(Title);
  readonly pokemonService = inject(PokemonService);
  readonly router = inject(Router);

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
  readonly POKEMON_RULES = POKEMON_RULES;

  constructor() {
    effect(() => {
      const { value: pokemon, error } = this.#pokemonResponse() ?? {};
      if (pokemon) {
        this.#title.setTitle(`Pokedex - ${pokemon.name}`);

        this.form.patchValue({
          name: pokemon.name,
          life: pokemon.life,
          damage: pokemon.damage,
        });

        pokemon.types.forEach((type) => {
          this.pokemonTypeList.push(new FormControl(type));
        });
      } else if (error) {
        this.#title.setTitle('Pokémon non trouvé');
      }
    });
  }

  readonly form = new FormGroup({
    name: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(POKEMON_RULES.MIN_NAME),
      Validators.maxLength(POKEMON_RULES.MAX_NAME),
      Validators.pattern(POKEMON_RULES.NAME_PATTERN),
    ]),
    life: new FormControl<number | null>(0, [
      Validators.min(POKEMON_RULES.MIN_LIFE),
      Validators.max(POKEMON_RULES.MAX_LIFE),
    ]),
    damage: new FormControl<number | null>(0, [
      Validators.min(POKEMON_RULES.MIN_DAMAGE),
      Validators.max(POKEMON_RULES.MAX_DAMAGE),
    ]),
    types: new FormArray(
      [],
      [
        Validators.required,
        Validators.minLength(POKEMON_RULES.MIN_TYPES),
        Validators.maxLength(POKEMON_RULES.MAX_TYPES),
      ],
    ),
  });

  get pokemonName(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get pokemonLife(): FormControl {
    return this.form.get('life') as FormControl;
  }

  get pokemonDamage(): FormControl {
    return this.form.get('damage') as FormControl;
  }

  get pokemonTypeList(): FormArray {
    return this.form.get('types') as FormArray;
  }

  isPokemonTypeSelected(type: string): boolean {
    return this.pokemonTypeList.controls.some((control) => control.value === type);
  }

  onPokemonTypeChange(type: string, isChecked: boolean): void {
    if (isChecked) {
      this.pokemonTypeList.push(new FormControl(type));
    } else {
      const index = this.pokemonTypeList.controls.findIndex((control) => control.value === type);
      if (index !== -1) {
        this.pokemonTypeList.removeAt(index);
      }
    }

    this.pokemonTypeList.markAsDirty();
    this.pokemonTypeList.markAsTouched();
  }

  incrementLife(): void {
    this.pokemonLife.setValue(this.pokemonLife.value + 1);
  }

  decrementLife(): void {
    this.pokemonLife.setValue(this.pokemonLife.value - 1);
  }

  incrementDamage(): void {
    this.pokemonDamage.setValue(this.pokemonDamage.value + 1);
  }

  decrementDamage(): void {
    this.pokemonDamage.setValue(this.pokemonDamage.value - 1);
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid && this.pokemon()) {
      const updatedPokemon = { ...this.pokemon(), ...this.form.value } as Pokemon;
      this.pokemonService.updatePokemon(updatedPokemon).subscribe({
        next: (pokemon) => {
          this.router.navigate(['/pokemons', pokemon.id]);
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du Pokémon :', error);
        },
      });
    }
  }
}
