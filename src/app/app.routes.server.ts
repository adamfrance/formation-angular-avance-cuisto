import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'recettes', renderMode: RenderMode.Prerender },
  { path: 'recettes/:id', renderMode: RenderMode.Server },
  { path: 'connexion', renderMode: RenderMode.Client },
  { path: 'compte/**', renderMode: RenderMode.Client },
  { path: 'proposer', renderMode: RenderMode.Client },
  { path: 'admin', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Server },
];
