import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { mensajeError } from '../core/http/errores';
import { ResumenInicio } from '../models/resumen.model';

@Injectable({ providedIn: 'root' })
export class ResumenService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/resumen`;

  resumen = signal<ResumenInicio | null>(null);
  cargando = signal(false);
  error = signal<string | null>(null);

  cargar() {
    this.cargando.set(true);
    this.error.set(null);

    this.http.get<ResumenInicio>(this.base).subscribe({
      next: (resumen) => {
        this.resumen.set(resumen);
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(mensajeError(e));
        this.cargando.set(false);
      },
    });
  }
}
