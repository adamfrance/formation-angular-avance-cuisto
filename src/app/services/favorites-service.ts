import { inject, PLATFORM_ID, Service } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, map } from 'rxjs';

const CLE = 'cuisto-favoris';

@Service()
export class FavoritesService {
  private readonly navigateur = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly ids = new BehaviorSubject<number[]>(this.navigateur ? this.lire() : []);
  readonly ids$ = this.ids.asObservable();
  readonly count$ = this.ids$.pipe(map((ids) => ids.length));

  estFavori(id: number): boolean {
    return this.ids.value.includes(id);
  }

  basculer(id: number): void {
    const suivants = this.estFavori(id) ? this.ids.value.filter((i) => i !== id) : [...this.ids.value, id];
    this.ids.next(suivants);
    localStorage.setItem(CLE, JSON.stringify(suivants));
  }

  private lire(): number[] {
    const brut = localStorage.getItem(CLE);
    return brut ? JSON.parse(brut) : [];
  }
}
