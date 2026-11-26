import { Routes } from '@angular/router';
import { Recipes } from './pages/recipes/recipes';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'recettes', pathMatch: 'full' },
  { path: 'recettes', component: Recipes },
  { path: 'recettes/:id', loadComponent: () => import('./pages/recipe-detail/recipe-detail').then((m) => m.RecipeDetail) },
  { path: 'connexion', loadComponent: () => import('./pages/login/login').then((m) => m.Login) },
  {
    path: 'compte',
    canActivateChild: [authGuard],
    loadComponent: () => import('./account/account-layout').then((m) => m.AccountLayout),
    children: [
      { path: '', redirectTo: 'favoris', pathMatch: 'full' },
      { path: 'favoris', loadComponent: () => import('./account/favorites').then((m) => m.Favorites) },
      { path: 'planning', loadComponent: () => import('./account/week-planning').then((m) => m.WeekPlanning) },
      { path: 'mes-recettes', loadComponent: () => import('./account/my-recipes').then((m) => m.MyRecipes) },
    ],
  },
  { path: 'admin', loadComponent: () => import('./admin/admin-stats').then((m) => m.AdminStats) },
  { path: 'proposer', loadComponent: () => import('./admin/recipe-form').then((m) => m.RecipeForm) },
  { path: '**', redirectTo: 'recettes' },
];
