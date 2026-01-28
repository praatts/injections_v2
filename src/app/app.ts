import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Pokemon } from './pokemon/pokemon';
import { PokemonService } from './pokemon-service';
import { PokemonInterface } from './pokemon';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Pokemon, ReactiveFormsModule],
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
  searching = false;

  constructor(private pokemonService : PokemonService, private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      searchTerm: ['', [Validators.minLength(2)]]
    });
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

    //Cerca reactiva amb rxjs
    this.searchForm.get('searchTerm')!.valueChanges.pipe(
      debounceTime(500), //espera 500ms segons sense canvis abans d'executar
      distinctUntilChanged() // només emet si el valor es diferent a l'anterior
    ).subscribe({
      next: (term : string | null) =>{
        if (!term || term.length < 2) {
          this.searching = false;
          this.searchResult = null;
          return;
        }

        this.searching = true;

        //Cerca LOCAL (sincrona)
        this.searchResult = this.pokemonService.searchPokemon(term);

        //desactivar indicador
        this.searching = false;

        console.log('Cercant: ', term);
        console.log('Resultat: ', this.searchResult)
      }
    });
  }

  get searchTermControl(){
    return this.searchForm.get('searchTerm');
  }

  get isSearchValid(){
    return this.searchTermControl?.valid;
  }

  updatePokemon(event: PokemonInterface) {
    this.pokemonService.updatePokemons(event);
  }
}
