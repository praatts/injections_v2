import { Injectable } from '@angular/core';
import { PokemonInterface } from './pokemon';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {

  private pokemons: PokemonInterface[] = [];
  private apiUrl = 'https://pokeapi.co/api/v2';

  constructor(private httpClient: HttpClient) {

  }

  demoSenseTransformar() { //Get simple, sense transformar dades per l'array de pokemons (seguint estructura de la interfície)
    this.httpClient.get<any>('https://pokeapi.co/api/v2/pokemon?limit=5').subscribe(response => {
      console.log('Dades originals de la pokeAPI:', response);
      console.log('Només l\'array results:', response.results);
      console.log('Primer pokemon', response.results[0])
    })
  }

  demoAmbTransformacions(): Observable<PokemonInterface[]> {
    console.log('Petició API:');
    return this.httpClient.get<any>('https://pokeapi.co/api/v2/pokemon?limit=5').pipe(
      map((response) => {
        console.log('PAS 1 - Rebem resposta: ', response);
        console.log('PAS 2 - Extreure els resultats', response.results)

        const pokemonsTransformats = response.results.map((p: any, index: number) => {
          console.log(`PAS 3.${index} - Transformació a : ${p.name}`);

          return {
            id: index,
            name: p.name,
            url: p.url,
            liked: false
          };
        });

        console.log('PAS 4 - Resultat FINAL: (array PokemonInterface[]', pokemonsTransformats);
        return pokemonsTransformats;
      })
    );
  }

  /*
  observable.pipe(
    operador1(),
    op2(),
    op3()
  )

  El pipe permet aplicar operadors Rxjs (Reactive extension JS) a l'observable, i el
  map() permet transformar les dades que arriben de l'API
  */
  updatePokemons(event: PokemonInterface) {
    let idx = this.pokemons.findIndex((value: PokemonInterface) => value.id === event.id);
    this.pokemons[idx] = event;
  }

  getPokemons(): PokemonInterface[] {
    return this.pokemons;
  }
}
