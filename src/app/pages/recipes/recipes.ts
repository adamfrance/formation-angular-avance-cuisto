import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, map, startWith, Subject, switchMap, tap } from 'rxjs';
import { RecipeService } from '../../services/recipe-service';
import { RecipeCard } from './recipe-card';

@Component({
  selector: 'app-recipes',
  imports: [AsyncPipe, RecipeCard],
  templateUrl: './recipes.html',
})
export class Recipes {
  private readonly recipeService = inject(RecipeService);
  private readonly saisie = new Subject<string>();
  protected terme = '';

  protected readonly resultats$ = this.saisie.pipe(
    debounceTime(300),
    map((t) => t.trim()),
    startWith(''),
    distinctUntilChanged(),
    tap((t) => (this.terme = t)),
    switchMap((t) => (t ? this.recipeService.search(t) : this.recipeService.getAll())),
  );

  protected onRecherche(event: Event): void {
    this.saisie.next((event.target as HTMLInputElement).value);
  }
}
