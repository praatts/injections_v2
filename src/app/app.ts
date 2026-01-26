import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Pokemon } from './pokemon/pokemon';
import { PokemonService } from './pokemon-service';
import { PokemonInterface } from './pokemon';
import { FormBuilder, Validators } from '@angular/forms';

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
  loading = false;
  error = '';

  //Declarar el formGroup
  searchForm;
  searchResult: PokemonInterface | null = null;
  searching = true;

  constructor(private pokemonService : PokemonService, private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      searchTerm: ['', [Validators.minLength(2)]]
    })
  }

  ngOnInit() {
    this.loading = true;
    this.pokemonService.getPokemons().subscribe({
      next: (data: PokemonInterface []) => {
        console.log("Component rep: ", data);
        this.pokemons = data;
        this.pokemonService.setPokemons(data);
        this.loading = false;
      },
      error: () => {
        console.error('Error carregant pokemons');
        this.error = 'Error carregant pokemons';
        this.loading = false;
      }
    })

  }

  updatePokemon(event: PokemonInterface) {
    this.pokemonService.updatePokemons(event);
  }

  demoSenseTransformar() {
    this.pokemonService.demoSenseTransformar();
  }

  /*demoAmbTransformar() {
    this.pokemonService.demoAmbTransformacions().subscribe(
      pokemons => {
        console.log('PAS 5 - El component rep: ', pokemons);
        this.pokemons = pokemons;
      });
  }*/
}
