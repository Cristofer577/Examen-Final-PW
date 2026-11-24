import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { mensajeError } from '../core/http/errores';
import { Beneficiario, BeneficiarioForm } from '../models/beneficiario.model';

@Injectable({ providedIn: 'root' })
export class BeneficiarioService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/beneficiarios`;

  lista = signal<Beneficiario[]>([]);
  cargando = signal(false);
  error = signal<string | null>(null);

  cargar() {
    this.cargando.set(true);
    this.error.set(null);

    this.http.get<Beneficiario[]>(this.base).subscribe({
      next: (lista) => {
        this.lista.set(lista);
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(mensajeError(e));
        this.cargando.set(false);
      },
    });
  }

  agregar(datos: BeneficiarioForm): Observable<Beneficiario> {
    return this.http
      .post<Beneficiario>(this.base, datos)
      .pipe(tap((b) => this.lista.update((l) => [...l, b])));
  }

  actualizar(id: number, datos: BeneficiarioForm): Observable<Beneficiario> {
    return this.http
      .put<Beneficiario>(`${this.base}/${id}`, datos)
      .pipe(tap((b) => this.lista.update((l) => l.map((x) => (x.id === id ? b : x)))));
  }

  eliminar(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.base}/${id}`)
      .pipe(tap(() => this.lista.update((l) => l.filter((x) => x.id !== id))));
  }
}
