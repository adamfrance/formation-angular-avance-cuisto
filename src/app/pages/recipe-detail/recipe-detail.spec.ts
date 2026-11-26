import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { Recipe } from '@cuisto/models';
import { RecipeService } from '../../services/recipe-service';
import { RecipeDetail } from './recipe-detail';

describe('RecipeDetail', () => {
  it('affiche le temps total : préparation et cuisson', async () => {
    const recette = { id: 1, name: 'Tajine', prepTimeMinutes: 30, cookTimeMinutes: 45, tags: ['Marocaine'], userId: 5 } as Recipe;
    const fauxService = {
      getById: () => of(recette),
      author: () => of({ firstName: 'Ana', lastName: 'Lima' }),
      byTag: () => of({ recipes: [], total: 0 }),
    };
    await TestBed.configureTestingModule({
      imports: [RecipeDetail],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } } },
        { provide: RecipeService, useValue: fauxService },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(RecipeDetail);
    await fixture.whenStable();
    const temps: string = fixture.nativeElement.querySelector('.detail-prix').textContent;
    expect(temps).toContain('1 h 15 min');
  });
});
