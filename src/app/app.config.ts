import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { PokemonList } from './pokemon/pokemon-list/pokemon-list';
import { PokemonProfile } from './pokemon/pokemon-profile/pokemon-profile';
import { PageNotFound } from './page-not-found/page-not-found/page-not-found';
import { PokemonEdit } from './pokemon/pokemon-edit/pokemon-edit';
import { provideHttpClient } from '@angular/common/http';
import { AuthGuard } from './core/auth/auth.guard';
import { Login } from './login/login';
import { PokemonAdd } from './pokemon/pokemon-add/pokemon-add';
import { PokemonService } from './pokemon.service';
import { PokemonJSONServerService } from './pokemon-json-server.service';
import { PokemonLocalStorageService } from './pokemon-local-storage.service';
import { environment } from '../environments/environment';


export function pokemonServiceFactory(): PokemonService {
  return environment.production
    ? new PokemonLocalStorageService()
    : new PokemonJSONServerService();
}

const routes: Routes = [
  {
    path: 'login',
    component: Login,
    title: 'Connexion',
  },
  {
    path: 'pokemons',
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'add',
        component: PokemonAdd,
      },
      {
        path: 'edit/:id',
        component: PokemonEdit,
      },
      {
        path: ':id',
        component: PokemonProfile,
      },
      {
        path: '',
        component: PokemonList,
        title: 'Pokedex',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'pokemons',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: PageNotFound,
    title: 'Page Not Found',
  },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    { provide: PokemonService, useFactory: pokemonServiceFactory },
  ],
};
