import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Pokemon } from './pokemon/pokemon';
import { PokemonService } from './pokemon-service';
import { PokemonInterface } from './pokemon';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [Pokemon, ReactiveFormsModule, AsyncPipe, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('injections_v2');

 


 
}
