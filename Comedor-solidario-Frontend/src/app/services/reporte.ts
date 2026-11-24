import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { mensajeError } from '../core/http/errores';
import { ReporteRaciones } from '../models/reporte.model';

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/reportes/raciones`;

  reporte = signal<ReporteRaciones | null>(null);
  cargando = signal(false);
  error = signal<string | null>(null);

  cargar(desde: string, hasta: string) {
    this.cargando.set(true);
    this.error.set(null);

    this.http.get<ReporteRaciones>(this.base, { params: { desde, hasta } }).subscribe({
      next: (reporte) => {
        this.reporte.set(reporte);
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(mensajeError(e));
        this.cargando.set(false);
      },
    });
  }
}
