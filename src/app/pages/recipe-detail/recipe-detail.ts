import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Author, Recipe } from '@cuisto/models';
import { Jour, JOURS } from '@cuisto/models';
import { RecipeService } from '../../services/recipe-service';
import { PlanningService } from '../../services/planning-service';
import { CookingTimer } from './cooking-timer';
import { DureePipe } from '../recipes/duree-pipe';
import { SimilarRecipes } from './similar-recipes';

@Component({
  selector: 'app-recipe-detail',
  imports: [AsyncPipe, CookingTimer, DureePipe, RouterLink, SimilarRecipes],
  templateUrl: './recipe-detail.html',
})
export class RecipeDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly recipeService = inject(RecipeService);
  private readonly planning = inject(PlanningService);
  protected readonly jours = JOURS;
  protected jourChoisi: Jour = 'lundi';
  protected readonly recette$ = new BehaviorSubject<Recipe | null>(null);
  protected readonly auteur$ = new BehaviorSubject<Author | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.recipeService.getById(id).subscribe((recette) => {
      this.recette$.next(recette);
      this.recipeService.author(recette.userId).subscribe((auteur) => this.auteur$.next(auteur));
    });
  }

  protected planifier(r: Recipe, event: Event): void {
    this.jourChoisi = (event.target as HTMLSelectElement).value as Jour;
    this.planning.ajouter(this.jourChoisi, { id: r.id, name: r.name, ingredients: r.ingredients });
  }
}
