import { Injectable } from '@angular/core';
import { PokemonInterface } from './pokemon';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {

  private pokemons: PokemonInterface[] = [];
  private apiUrl = 'https://pokeapi.co/api/v2';

  private favoritesSubject = new BehaviorSubject<PokemonInterface[]>([]);
  public favorites$;

  constructor(private httpClient: HttpClient) {
    this.favorites$ = this.favoritesSubject.asObservable();
  }

  addToFavourites(pokemon: PokemonInterface): void {
    console.log('Intentant afegir als favorits: ', pokemon.name);

    //obtenir la llista de pokemons actuals de liked
    const currentFavorites = this.favoritesSubject.value;

    //comprovem si ja existeix
    const exists = currentFavorites.find(p => p.id === pokemon.id);
    if (exists) {
      console.log('Ja està als favorits!!!!!');
      return;
    }

    pokemon.liked = true;
    this.updatePokemons(pokemon);

    //crear el nou array amb el pokemon afegit
    const updatedFavorites = [...currentFavorites, pokemon];
    this.favoritesSubject.next(updatedFavorites);
    console.log('Afegit als favorits!!!!! TOTAL:', updatedFavorites.length);
  }

  removeFromFavourites(pokemonId: number): void {
    console.log('Eliminant: ', pokemonId);

    //obtenir la llista de pokemons actuals de liked
    const currentFavorites = this.favoritesSubject.value;

    //filtrar(crear un array sense aquest pokemon)
    const updatedFavorites = currentFavorites.filter(p => p.id === pokemonId);

    //marquem no liked
    const pokemon = this.pokemons.find(p => p.id === pokemonId);
    if (pokemon) {
      pokemon.liked = false;
    }

    //emetem el nou array
    this.favoritesSubject.next(updatedFavorites);

    console.log('Eliminat dels favorits, total: ', updatedFavorites.length);


  }

  getFavoritesCount(): number {
    return this.favoritesSubject.value.length;
  }

  getPokemons(): Observable<PokemonInterface[]> {
    console.log('Petició API:');
    return this.httpClient.get<any>('https://pokeapi.co/api/v2/pokemon?limit=20').pipe(
      map((response) => {
        const pokemonsTransformats = response.results.map((p: any, index: number) => {
          return {
            id: index,
            name: p.name,
            url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
            liked: false
          };
        });
        return pokemonsTransformats;
      })
    );
  }


  updatePokemons(event: PokemonInterface) {
    let idx = this.pokemons.findIndex((value: PokemonInterface) => value.id === event.id);
    this.pokemons[idx] = event;
  }

  setPokemons(pokemons: PokemonInterface[]): void {
    this.pokemons = pokemons;
  }

  searchPokemon(name: string): Observable<PokemonInterface | null> {
    if (name.length < 2) {
      return of(null);
    }
    console.log('Cercant a la PokeAPI: ', name)

    return this.httpClient.get<any>(`${this.apiUrl}/pokemon/${name.toLowerCase()}`).pipe(
      map(p => {
        console.log('Pokemon trobat a l\'API', p.name);
        return {
          id: p.id,
          name: p.name,
          url: p.sprites.front_default,
          liked: false
        };
      }),
      catchError(error => {
        console.log('Pokemon NO trobat');
        return of(null);
      })
    )
  }


}

/*
injecció de dependencies
service
observable
operadors rxjs (map, observable)
.pipe() de rxjs
el .map() rxjs vs .map d'array
HttpClient(get)

observable.pipe(
  operador1(),
  op2(),
  op3()
)

El pipe permet aplicar operadors Rxjs (Reactive extension JS) a l'observable, i el
map() permet transformar les dades que arriben de l'API
*/
