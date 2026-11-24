import { Component, computed, inject, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { PageHeader } from '../../shared/page-header/page-header';
import { EstadoPanel } from '../../shared/estado-panel/estado-panel';
import { ReporteService } from '../../../services/reporte';
import { fechaISO } from '../../../core/fechas';

@Component({
  selector: 'app-reportes',
  imports: [PageHeader, EstadoPanel, FormField],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css',
})
export class Reportes {
  servicio = inject(ReporteService);

  // lo que el usuario escribe en los campos
  modelo = signal({ desde: hoyMenos(6), hasta: fechaISO(new Date()) });

  formulario = form(this.modelo, (campo) => {
    required(campo.desde, { message: 'Elige la fecha inicial' });
    required(campo.hasta, { message: 'Elige la fecha final' });
  });

  // lo que se aplica al presionar "Ver reporte"
  desde = signal(this.modelo().desde);
  hasta = signal(this.modelo().hasta);

  datos = computed(() => this.servicio.reporte()?.dias ?? []);
  meta = computed(() => this.servicio.reporte()?.meta ?? 0);
  total = computed(() => this.servicio.reporte()?.total ?? 0);
  promedio = computed(() => this.servicio.reporte()?.promedio ?? 0);

  // altura máxima del gráfico, con margen sobre el valor más alto
  maximo = computed(() => {
    const mayor = Math.max(0, ...this.datos().map((d) => d.servidas), this.meta());
    return Math.max(200, Math.ceil((mayor + 1) / 50) * 50);
  });

  marcas = computed(() => {
    const paso = this.maximo() / 4;
    return [0, 1, 2, 3, 4].map((i) => i * paso);
  });

  constructor() {
    this.servicio.cargar(this.desde(), this.hasta());
  }

  verReporte() {
    submit(this.formulario, async () => {
      const { desde, hasta } = this.modelo();
      this.desde.set(desde);
      this.hasta.set(hasta);
      this.servicio.cargar(desde, hasta);
    });
  }

  recargar() {
    this.servicio.cargar(this.desde(), this.hasta());
  }

  diaSemana(iso: string): string {
    const [a, m, d] = iso.split('-').map(Number);
    const t = new Date(a, m - 1, d)
      .toLocaleDateString('es-PE', { weekday: 'short' })
      .replace('.', '');
    return t.charAt(0).toUpperCase() + t.slice(1);
  }

  diaMes(iso: string): string {
    const [a, m, d] = iso.split('-').map(Number);
    const mes = new Date(a, m - 1, d)
      .toLocaleDateString('es-PE', { month: 'short' })
      .replace('.', '');
    return `${d} ${mes.charAt(0).toUpperCase() + mes.slice(1)}`;
  }

  descargar() {
    const filas = [
      'Fecha,Raciones servidas,Meta diaria',
      ...this.datos().map((d) => `${d.fecha},${d.servidas},${this.meta()}`),
    ];
    const blob = new Blob([filas.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = 'reporte-raciones.csv';
    enlace.click();
    URL.revokeObjectURL(url);
  }
}

function hoyMenos(dias: number): string {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - dias);
  return fechaISO(fecha);
}
