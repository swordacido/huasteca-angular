import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const expectedRoles = route.data['roles'] as string[];

  const user = auth.currentUser();

  if (!auth.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (expectedRoles && user) {
    const hasRole = expectedRoles.includes(user.role);
    if (!hasRole) {
      router.navigate(['/inicio']);
      return false;
    }
  }

  return true;
};
