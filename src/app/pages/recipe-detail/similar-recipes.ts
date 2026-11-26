import { Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { RecipeService } from '../../services/recipe-service';

@Component({
  selector: 'app-similar-recipes',
  imports: [RouterLink],
  template: `
    <h2>Recettes similaires</h2>
    <ul class="liste-simple">
      @for (s of similaires(); track s.id) {
        <li><a [routerLink]="['/recettes', s.id]">{{ s.name }}</a></li>
      }
    </ul>
  `,
})
export class SimilarRecipes {
  readonly tag = input.required<string>();
  readonly exclure = input.required<number>();
  private readonly recipeService = inject(RecipeService);
  private readonly page = toSignal(
    toObservable(this.tag).pipe(switchMap((tag) => this.recipeService.byTag(tag))),
  );
  protected readonly similaires = computed(() =>
    (this.page()?.recipes ?? []).filter((s) => s.id !== this.exclure()),
  );
}
