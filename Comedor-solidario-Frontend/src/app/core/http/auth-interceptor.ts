import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Sesion } from '../sesion';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const sesion = inject(Sesion);
  const router = inject(Router);
  const token = sesion.token();
  const esApi = req.url.startsWith(environment.apiUrl);

  // Solo se envía el token a la API propia, nunca a dominios externos.
  const peticion =
    token && esApi ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(peticion).pipe(
    catchError((error: unknown) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        esApi &&
        !req.url.endsWith('/auth/login')
      ) {
        sesion.limpiar();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
  );
};
