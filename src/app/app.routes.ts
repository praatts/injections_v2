import { Routes } from '@angular/router';
import { PokemonList } from './pokemon-list/pokemon-list';
import { Favorites } from './favorites/favorites';

export const routes: Routes = [
    {
        path: '', component: PokemonList
    },
    {
        path: 'favorites', component: Favorites
    },
    {
        path: '**', redirectTo: ''
    }
];
