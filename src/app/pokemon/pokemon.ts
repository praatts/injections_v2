import { Component, input, output } from '@angular/core';
import { PokemonInterface } from '../pokemon';


@Component({
  selector: 'app-pokemon',
  imports: [],
  templateUrl: './pokemon.html',
  styleUrl: './pokemon.css'
})
export class Pokemon {
 // Input requerit que rep l'objecte Pokemon des del component pare
  pokemon = input.required<PokemonInterface>();
  
  // Output que emet el Pokemon modificat cap al component pare
  pokemonChanged = output<PokemonInterface>();

  // Mètode que s'executa quan es clica el botó Like/Dislike
  onToggleLike() {
    // Creem un nou objecte Pokemon amb l'estat 'liked' invertit
    const updatedPokemon: PokemonInterface = {
      id: this.pokemon().id,
      name: this.pokemon().name,
      url: this.pokemon().url,
      liked: !this.pokemon().liked  // Canviem l'estat de liked
    };
    
    // Emetem el Pokemon modificat al component pare
    this.pokemonChanged.emit(updatedPokemon);
  }
}
