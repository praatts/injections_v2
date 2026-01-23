import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Pokemon } from './pokemon/pokemon';
import { PokemonService } from './pokemon-service';
import { PokemonInterface } from './pokemon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Pokemon],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('injections_v2');

  pokemons : PokemonInterface[] = [];
  pokemonsProva: PokemonInterface[] = [];

  constructor(private pokemonService : PokemonService) {
    this.pokemons = this.pokemonService.getPokemons();
  }

  updatePokemon(event: PokemonInterface) {
    this.pokemonService.updatePokemons(event);
  }

  demoSenseTransformar() {
    this.pokemonService.demoSenseTransformar();
  }

  demoAmbTransformar() {
    this.pokemonService.demoAmbTransformacions().subscribe(
      pokemons => {
        console.log('PAS 5 - El component rep: ', pokemons);
        this.pokemons = pokemons;
      });
  }
}
