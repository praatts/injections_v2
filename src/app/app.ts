import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Pokemon } from './pokemon/pokemon';
import { PokemonService } from './pokemon-service';
import { PokemonInterface } from './pokemon';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [Pokemon, ReactiveFormsModule, AsyncPipe, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('injections_v2');

  pokemons: PokemonInterface[] = [];
  pokemonsProva: PokemonInterface[] = [];
  loading = false;
  error = '';

  //Declarar el formGroup
  searchForm;
  searchResult: PokemonInterface | null = null;
  searching = false;

  favorites$;

  constructor(private pokemonService: PokemonService, private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      searchTerm: ['', [Validators.minLength(2)]]
    });
    this.favorites$ = this.pokemonService.favorites$;
  }

  ngOnInit() {
    this.loading = true;
    this.pokemonService.getPokemons().subscribe({
      next: (data: PokemonInterface[]) => {
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
      distinctUntilChanged(), // només emet si el valor es diferent a l'anterior
      switchMap(term => {
        //Si es cur o buit retornar observable amb null
        if (!term || term.length < 2) {
          this.searching = false;
          return of(null);
        }
        this.searching = true;

        return this.pokemonService.searchPokemon(term);
      })
    ).subscribe({
      next: (result) => {
        this.searchResult = result;
        this.searching = false;
        console.log('Resultat final', result);
      },
        error: (err) => {
        console.log('Error: ', err);
        this.searching = false;
        this.searchResult = null;
      }
    });
  }

  get searchTermControl() {
    return this.searchForm.get('searchTerm');
  }

  get isSearchValid() {
    return this.searchTermControl?.valid;
  }

  updatePokemon(event: PokemonInterface) {
    console.log ('update pokemon cridant, liked', event.liked)

    if (event.liked) {
      //si té liked l'afegirem
      this.pokemonService.addToFavourites(event);
    } else {
      this.pokemonService.removeFromFavourites(event.id);
    }
  }
}
