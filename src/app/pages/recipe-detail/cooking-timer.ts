import { Component, computed, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, map, Subject, switchMap, takeWhile } from 'rxjs';

@Component({
  selector: 'app-cooking-timer',
  template: `
    <div class="panneau">
      <h2>Minuteur de cuisson</h2>
      <p class="minuteur">{{ affichage() }}</p>
      <button class="bouton" type="button" (click)="demarrer()">Démarrer ({{ minutes() }} min)</button>
    </div>
  `,
})
export class CookingTimer {
  readonly minutes = input.required<number>();
  private readonly restant = signal(0);
  protected readonly affichage = computed(() => {
    const m = Math.floor(this.restant() / 60);
    const s = this.restant() % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  });
  private readonly departs = new Subject<number>();

  constructor() {
    this.departs
      .pipe(
        switchMap((total) =>
          interval(1000).pipe(
            map((n) => total - n - 1),
            takeWhile((reste) => reste >= 0),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((reste) => this.restant.set(reste));
  }

  protected demarrer(): void {
    const total = this.minutes() * 60;
    this.restant.set(total);
    this.departs.next(total);
  }
}
