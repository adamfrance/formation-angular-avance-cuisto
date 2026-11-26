import { Component, computed, inject } from '@angular/core';
import { Jour, JOURS } from '@cuisto/models';
import { PlanningService } from '../services/planning-service';

@Component({
  selector: 'app-week-planning',
  templateUrl: './week-planning.html',
})
export class WeekPlanning {
  private readonly service = inject(PlanningService);
  protected readonly planning = this.service.planning;
  protected readonly nombreDeRepas = this.service.nombreDeRepas;
  protected readonly jours = JOURS;
  protected readonly listeDeCourses = computed(() => {
    const tous = JOURS.flatMap((j) => this.planning()[j].flatMap((r) => r.ingredients));
    return [...new Set(tous)].sort();
  });

  protected retirer(jour: Jour, index: number): void {
    this.service.retirer(jour, index);
  }
}
