import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Sesion } from '../core/sesion';
import { LoginEntrada, TokenSalida } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private sesion = inject(Sesion);
  private router = inject(Router);

  login(datos: LoginEntrada): Observable<TokenSalida> {
    return this.http
      .post<TokenSalida>(`${environment.apiUrl}/auth/login`, datos)
      .pipe(tap((respuesta) => this.sesion.guardar(respuesta.token, respuesta.usuario)));
  }

  cerrarSesion() {
    this.sesion.limpiar();
    this.router.navigate(['/login']);
  }
}
