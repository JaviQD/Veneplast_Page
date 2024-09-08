import { CanActivateFn, Router } from '@angular/router';
import {AuthService} from './main/services/auth.service';
import { inject } from '@angular/core';

export const rolesGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.ObtenerToken();
  const EsExpirado = authService.EsTokenValido(token ?? '');

  const queryParams = window.location.search;
  console.log('Query parameters:', queryParams);

  if (token != null && EsExpirado) {
    authService.ObtenerClaims(token, 'Role');

    return route.data['Role'] === authService.StringRole(token);

  }
  
  await router.navigateByUrl('/main/home');
  return false;
};
