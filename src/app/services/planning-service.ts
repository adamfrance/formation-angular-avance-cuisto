import { computed, inject, PLATFORM_ID, Service, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Jour, JOURS, Planning, RecettePlanifiee } from '@cuisto/models';

const CLE = 'cuisto-planning';

function vide(): Planning {
  return Object.fromEntries(JOURS.map((j) => [j, []])) as unknown as Planning;
}

@Service()
export class PlanningService {
  private readonly navigateur = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly etat = signal<Planning>(this.navigateur ? this.lire() : vide());
  readonly planning = this.etat.asReadonly();
  readonly nombreDeRepas = computed(() => JOURS.reduce((n, j) => n + this.etat()[j].length, 0));

  ajouter(jour: Jour, recette: RecettePlanifiee): void {
    this.etat.update((p) => ({ ...p, [jour]: [...p[jour], recette] }));
    this.enregistrer();
  }

  retirer(jour: Jour, index: number): void {
    this.etat.update((p) => ({ ...p, [jour]: p[jour].filter((_, i) => i !== index) }));
    this.enregistrer();
  }

  private enregistrer(): void {
    localStorage.setItem(CLE, JSON.stringify(this.etat()));
  }

  private lire(): Planning {
    const brut = localStorage.getItem(CLE);
    return brut ? JSON.parse(brut) : vide();
  }
}
