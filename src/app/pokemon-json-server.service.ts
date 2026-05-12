import { inject } from '@angular/core';
import { Pokemon, PokemonList } from './pokemon.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PokemonService } from './pokemon.service';

export class PokemonJSONServerService extends PokemonService implements PokemonService {
  private readonly http = inject(HttpClient);
  private readonly POKEMON_API_URL = 'http://localhost:3000/pokemons';

  getPokemonList(): Observable<PokemonList> {
    return this.http.get<PokemonList>(this.POKEMON_API_URL);
  }

  getPokemonById(id: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.POKEMON_API_URL}/${id}`);
  }

  updatePokemon(pokemon: Pokemon): Observable<Pokemon> {
    return this.http.put<Pokemon>(
      `${this.POKEMON_API_URL}/${pokemon.id}`,
      pokemon
    );
  }

  deletePokemon(pokemonId: number): Observable<void> {
    return this.http.delete<void>(`${this.POKEMON_API_URL}/${pokemonId}`);
  }

  addPokemon(pokemon: Omit<Pokemon, 'id'>): Observable<Pokemon> {
    return this.http.post<Pokemon>(this.POKEMON_API_URL, pokemon);
  }
}