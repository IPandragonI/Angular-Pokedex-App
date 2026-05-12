import { Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PokemonService } from '../../pokemon.service';
import { Router } from '@angular/router';
import { Pokemon, POKEMON_RULES } from '../../pokemon.model';

@Component({
  selector: 'app-pokemon-add',
  imports: [ReactiveFormsModule],
  templateUrl: './pokemon-add.html',
  styles: ``,
})
export class PokemonAdd {
  readonly pokemonService = inject(PokemonService);
  readonly router = inject(Router);

  readonly POKEMON_RULES = POKEMON_RULES;
  readonly form = new FormGroup({
    name: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(POKEMON_RULES.MIN_NAME),
      Validators.maxLength(POKEMON_RULES.MAX_NAME),
      Validators.pattern(POKEMON_RULES.NAME_PATTERN),
    ]),
    life: new FormControl<number>(10, [
      Validators.required,
      Validators.min(POKEMON_RULES.MIN_LIFE),
      Validators.max(POKEMON_RULES.MAX_LIFE),
    ]),
    damage: new FormControl<number>(1, [
      Validators.required,
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
    picture: new FormControl<string>('', [Validators.required]),
  });

  get pokemonName() {
    return this.form.get('name') as FormControl<string>;
  }

  get pokemonLife() {
    return this.form.get('life') as FormControl<number>;
  }

  get pokemonDamage() {
    return this.form.get('damage') as FormControl<number>;
  }

  get pokemonTypeList() {
    return this.form.get('types') as FormArray;
  }

  get pokemonPicture() {
    return this.form.get('picture') as FormControl<string>;
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
    if (this.form.valid) {
      const newPokemon: Omit<Pokemon, 'id'> = {
        name: this.pokemonName.value,
        life: this.pokemonLife.value,
        damage: this.pokemonDamage.value,
        types: this.pokemonTypeList.value,
        picture: this.pokemonPicture.value,
        created: new Date(),
      };
      this.pokemonService.addPokemon(newPokemon).subscribe((pokemonAdded) => {
        this.router.navigate(['/pokemons', pokemonAdded.id]);
      });
    }
  }

  onCancel(): void {
    this.form.reset();
    this.router.navigate(['/pokemons']);
  }
}
