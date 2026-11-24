import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgressBar } from '../../shared/progress-bar/progress-bar';
import { EstadoPanel } from '../../shared/estado-panel/estado-panel';
import { ResumenService } from '../../../services/resumen';
import { Sesion } from '../../../core/sesion';
import { MOVIMIENTOS_HOY } from '../../../data/raciones.data';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, ProgressBar, EstadoPanel],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  servicio = inject(ResumenService);
  private sesion = inject(Sesion);

  resumen = computed(() => this.servicio.resumen());
  servidas = computed(() => this.resumen()?.raciones.servidas ?? 0);
  faltan = computed(() => this.resumen()?.raciones.pendientes ?? 0);

  // TODO: el backend aún no expone una ruta de movimientos recientes.
  movimientos = MOVIMIENTOS_HOY;

  fecha = this.formatearFecha(new Date());
  saludo = this.obtenerSaludo(new Date().getHours());
  bienvenida = computed(() => {
    const nombre = this.sesion.usuario()?.nombre;
    return nombre ? `¡${this.saludo}, ${nombre}!` : `¡${this.saludo}!`;
  });

  constructor() {
    this.servicio.cargar();
  }

  private formatearFecha(d: Date): string {
    const texto = d.toLocaleDateString('es-PE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  private obtenerSaludo(hora: number): string {
    if (hora < 12) return 'Buen día';
    if (hora < 19) return 'Buenas tardes';
    return 'Buenas noches';
  }
}
