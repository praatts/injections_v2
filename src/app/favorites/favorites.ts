import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Pokemon } from '../pokemon/pokemon';
import { PokemonService } from '../pokemon-service';
import { PokemonInterface } from '../pokemon';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-favorites',
  imports: [AsyncPipe, Pokemon, RouterLink],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites {
  favorites$;

  constructor(private pokemonService: PokemonService) {
    this.favorites$ = this.pokemonService.favorites$;
  }

  updatePokemon(event: any) {
    this.pokemonService.removeFromFavourites(event.id);
  }
}
