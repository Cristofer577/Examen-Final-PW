import { Component, computed, effect, inject, signal } from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header';
import { SearchBar } from '../../shared/search-bar/search-bar';
import { StatusBadge } from '../../shared/status-badge/status-badge';
import { ProgressBar } from '../../shared/progress-bar/progress-bar';
import { EstadoPanel } from '../../shared/estado-panel/estado-panel';
import { RacionService } from '../../../services/racion';
import { RegistroRacion } from '../../../models/racion.model';
import { fechaISO } from '../../../core/fechas';
import { mensajeError } from '../../../core/http/errores';

type Filtro = 'todos' | 'entregados' | 'pendientes';

@Component({
  selector: 'app-raciones-diarias',
  imports: [PageHeader, SearchBar, StatusBadge, ProgressBar, EstadoPanel],
  templateUrl: './raciones-diarias.html',
  styleUrl: './raciones-diarias.css',
})
export class RacionesDiarias {
  servicio = inject(RacionService);

  fecha = signal(new Date());
  termino = signal('');
  filtro = signal<Filtro>('todos');
  guardado = signal(false);
  errorGuardar = signal<string | null>(null);

  // copia de trabajo: los cambios no se aplican hasta presionar "Guardar registro"
  borrador = signal<RegistroRacion[]>([]);

  meta = computed(() => this.servicio.dia()?.meta ?? 0);
  pendientes = computed(() => this.servicio.dia()?.pendientes ?? 0);

  servidas = computed(() =>
    this.borrador()
      .filter((r) => r.entregado)
      .reduce((suma, r) => suma + r.raciones, 0),
  );

  cantidadEntregados = computed(() => this.borrador().filter((r) => r.entregado).length);
  cantidadPendientes = computed(() => this.borrador().filter((r) => !r.entregado).length);

  fechaTexto = computed(() => {
    const t = this.fecha().toLocaleDateString('es-PE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return t.charAt(0).toUpperCase() + t.slice(1);
  });

  esHoy = computed(() => this.fecha().toDateString() === new Date().toDateString());

  visibles = computed(() => {
    const t = this.termino().trim().toLowerCase();
    return this.borrador().filter((r) => {
      const coincide =
        !t ||
        r.familia.toLowerCase().includes(t) ||
        r.dni.includes(t) ||
        r.codigo.toLowerCase().includes(t);
      const pasaFiltro =
        this.filtro() === 'todos' ||
        (this.filtro() === 'entregados' && r.entregado) ||
        (this.filtro() === 'pendientes' && !r.entregado);
      return coincide && pasaFiltro;
    });
  });

  constructor() {
    effect(() => {
      const dia = this.servicio.dia();
      if (dia) {
        this.borrador.set(dia.registros.map((r) => ({ ...r })));
      }
    });

    this.cargarDia();
  }

  cambiarDia(dias: number) {
    const nueva = new Date(this.fecha());
    nueva.setDate(nueva.getDate() + dias);
    this.fecha.set(nueva);
    this.cargarDia();
  }

  irAHoy() {
    this.fecha.set(new Date());
    this.cargarDia();
  }

  buscar(texto: string) {
    this.termino.set(texto);
  }

  recargar() {
    this.cargarDia();
  }

  alternar(beneficiarioId: number) {
    this.borrador.update((lista) =>
      lista.map((r) =>
        r.beneficiarioId === beneficiarioId ? { ...r, entregado: !r.entregado } : r,
      ),
    );
    this.guardado.set(false);
  }

  guardar() {
    this.errorGuardar.set(null);
    this.guardado.set(false);

    this.servicio.guardar(fechaISO(this.fecha()), this.borrador()).subscribe({
      next: () => {
        this.guardado.set(true);
        setTimeout(() => this.guardado.set(false), 3000);
      },
      error: (e) => this.errorGuardar.set(mensajeError(e)),
    });
  }

  private cargarDia() {
    this.guardado.set(false);
    this.errorGuardar.set(null);
    this.servicio.cargar(fechaISO(this.fecha()));
  }
}
