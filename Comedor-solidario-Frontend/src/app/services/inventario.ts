import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { mensajeError } from '../core/http/errores';
import { Alimento, AlimentoForm } from '../models/alimento.model';

@Injectable({ providedIn: 'root' })
export class InventarioService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/inventario`;

  lista = signal<Alimento[]>([]);
  cargando = signal(false);
  error = signal<string | null>(null);

  cargar() {
    this.cargando.set(true);
    this.error.set(null);

    this.http.get<Alimento[]>(this.base).subscribe({
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

  agregar(datos: AlimentoForm): Observable<Alimento> {
    return this.http
      .post<Alimento>(this.base, datos)
      .pipe(tap((a) => this.lista.update((l) => [...l, a])));
  }

  actualizar(id: number, datos: AlimentoForm): Observable<Alimento> {
    return this.http
      .put<Alimento>(`${this.base}/${id}`, datos)
      .pipe(tap((a) => this.lista.update((l) => l.map((x) => (x.id === id ? a : x)))));
  }

  eliminar(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.base}/${id}`)
      .pipe(tap(() => this.lista.update((l) => l.filter((x) => x.id !== id))));
  }
}
