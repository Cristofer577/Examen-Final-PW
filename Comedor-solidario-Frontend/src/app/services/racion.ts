import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { mensajeError } from '../core/http/errores';
import { DiaRaciones, GuardarDia, RegistroRacion } from '../models/racion.model';

@Injectable({ providedIn: 'root' })
export class RacionService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/raciones`;

  dia = signal<DiaRaciones | null>(null);
  cargando = signal(false);
  error = signal<string | null>(null);

  cargar(fecha: string) {
    this.cargando.set(true);
    this.error.set(null);

    this.http.get<DiaRaciones>(`${this.base}/${fecha}`).subscribe({
      next: (dia) => {
        this.dia.set(dia);
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(mensajeError(e));
        this.cargando.set(false);
      },
    });
  }

  guardar(fecha: string, registros: RegistroRacion[]): Observable<DiaRaciones> {
    const cuerpo: GuardarDia = {
      registros: registros.map((r) => ({
        beneficiarioId: r.beneficiarioId,
        entregado: r.entregado,
      })),
    };

    return this.http
      .put<DiaRaciones>(`${this.base}/${fecha}`, cuerpo)
      .pipe(tap((dia) => this.dia.set(dia)));
  }
}
