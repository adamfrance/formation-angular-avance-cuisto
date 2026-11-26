import { Pipe, PipeTransform } from '@angular/core';
import { Recipe } from '@cuisto/models';

@Pipe({ name: 'duree' })
export class DureePipe implements PipeTransform {
  transform(recette: Recipe): string {
    const total = recette.prepTimeMinutes + recette.cookTimeMinutes;
    return total >= 60 ? `${Math.floor(total / 60)} h ${total % 60} min` : `${total} min`;
  }
}
