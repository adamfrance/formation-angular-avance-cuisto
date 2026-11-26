import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { RecipeService } from '../services/recipe-service';

/** Erreur « tempsNul » quand la préparation et la cuisson valent zéro toutes les deux. */
export function tempsTotalValidator(groupe: AbstractControl): ValidationErrors | null {
  const preparation = Number(groupe.get('prepTimeMinutes')?.value ?? 0);
  const cuisson = Number(groupe.get('cookTimeMinutes')?.value ?? 0);
  return preparation + cuisson > 0 ? null : { tempsNul: true };
}

@Component({
  selector: 'app-recipe-form',
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: './recipe-form.html',
  styles: `
    .ligne-ingredient { display: flex; gap: 0.5rem; }
  `,
})
export class RecipeForm {
  private readonly recipeService = inject(RecipeService);
  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly formulaire = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      cuisine: [''],
      difficulty: ['Easy'],
      prepTimeMinutes: [0],
      cookTimeMinutes: [0],
      servings: [1],
      ingredients: this.fb.array([this.ingredient(), this.ingredient()], Validators.minLength(2)),
      instructions: [''],
    },
    { validators: tempsTotalValidator },
  );
  protected readonly ingredients = this.formulaire.controls.ingredients;
  protected readonly message$ = new BehaviorSubject('');

  protected ajouterIngredient(): void {
    this.ingredients.push(this.ingredient());
  }

  protected retirerIngredient(index: number): void {
    this.ingredients.removeAt(index);
  }

  protected envoyer(): void {
    const recette = this.formulaire.getRawValue();
    const corps = { ...recette, instructions: recette.instructions.split('.') };
    this.recipeService.add(corps).subscribe((r) => this.message$.next(`Recette n° ${r.id} enregistrée : ${r.name}`));
  }

  private ingredient() {
    return this.fb.control('', Validators.required);
  }
}
