import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const authGuard: CanActivateChildFn = (_route, state) => {
  const auth = inject(AuthService);
  return auth.token ? true : inject(Router).createUrlTree(['/connexion'], { queryParams: { retour: state.url } });
};
