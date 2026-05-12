import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { PokemonService } from '../../pokemon.service';
import { PokemonBorderDirective } from '../../pokemon-border.directive';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Pokemon } from '../../pokemon.model';

@Component({
  selector: 'app-pokemon-list',
  imports: [PokemonBorderDirective, RouterLink],
  templateUrl: './pokemon-list.html',
  styles: ``,
})
export class PokemonList {
  readonly pokemonService = inject(PokemonService);
  readonly searchTerm = signal('');
  readonly typeFilter = signal<string | null>(null);
  readonly pokemonList = toSignal(this.pokemonService.getPokemonList(), { initialValue: [] });
  readonly loading = computed(() => this.pokemonList().length === 0);

  readonly typeList = computed(() => {
    const allTypes = this.pokemonList().flatMap((pokemon) => pokemon.types);
    return Array.from(new Set(allTypes)).sort();
  });

  readonly typeSelected = linkedSignal<string[], string | null>({
    source: this.typeList,
    computation: (newTypeList, previous) => {
      const isTypeListEmpty = newTypeList.length === 0;
      if (isTypeListEmpty) {
        return null;
      }

      if (!previous?.value) {
        return null;
      }

      const isPreviousTypeSelectedValid = !!newTypeList.find((type) => type === previous.value);

      if (isPreviousTypeSelectedValid) {
        return previous.value;
      }

      return newTypeList[0];
    },
  });

  readonly pokemonListFiltered = computed(() => {
    const searchTerm = this.searchTerm().toLowerCase().trim();
    const pokemonList = this.pokemonList();

    return pokemonList
    .filter((pokemon) => pokemon.name.toLowerCase().includes(searchTerm))
    .filter((pokemon) => {
      const typeSelected = this.typeSelected();
      if (!typeSelected) {
        return true;
      }
      return pokemon.types.includes(typeSelected);
    });
  });

  filterByType(type: string | null): void {
    const newType = this.typeSelected() === type ? null : type;
    this.typeSelected.set(newType);
  }
}
