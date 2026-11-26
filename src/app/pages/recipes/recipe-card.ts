import { Component, inject, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Recipe } from '@cuisto/models';
import { DureePipe } from './duree-pipe';
import { FavoritesService } from '../../services/favorites-service';

@Component({
  selector: 'app-recipe-card',
  imports: [DecimalPipe, DureePipe],
  templateUrl: './recipe-card.html',
})
export class RecipeCard {
  readonly recette = input.required<Recipe>();
  private readonly favoris = inject(FavoritesService);
  private readonly router = inject(Router);

  protected libelleDifficulte(): string {
    switch (this.recette().difficulty) {
      case 'Easy':
        return 'Facile';
      case 'Medium':
        return 'Moyenne';
      default:
        return 'Difficile';
    }
  }

  protected estFavori(): boolean {
    return this.favoris.estFavori(this.recette().id);
  }

  protected ouvrir(): void {
    this.router.navigate(['/recettes', this.recette().id]);
  }

  protected basculer(event: Event): void {
    event.stopPropagation();
    this.favoris.basculer(this.recette().id);
  }
}
