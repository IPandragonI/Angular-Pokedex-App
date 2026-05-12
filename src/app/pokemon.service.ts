import { Pokemon, PokemonList, getPokemonColor, getPokemonTypes } from './pokemon.model';

import { Observable } from 'rxjs';

export abstract class PokemonService {
  abstract getPokemonList(): Observable<PokemonList>;
  abstract getPokemonById(id: number): Observable<Pokemon>;
  abstract updatePokemon(pokemon: Pokemon): Observable<Pokemon>;
  abstract deletePokemon(pokemonId: number): Observable<void>;
  abstract addPokemon(pokemon: Omit<Pokemon, 'id'>): Observable<Pokemon>;
  
  getPokemonTypeList() {
    return getPokemonTypes();
  }
  getPokemonColor(type: string) {
    return getPokemonColor(type);
  }
  getBadgeTextColor(type: string) {
    return type === "Electrik" ? 'text-black' : 'text-white';
  }
}