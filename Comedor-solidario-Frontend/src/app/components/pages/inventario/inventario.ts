import { Component, computed, inject, signal } from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header';
import { SearchBar } from '../../shared/search-bar/search-bar';
import { StatusBadge } from '../../shared/status-badge/status-badge';
import { EstadoPanel } from '../../shared/estado-panel/estado-panel';
import { AlimentoForm } from './alimento-form/alimento-form';
import { InventarioService } from '../../../services/inventario';
import {
  Alimento,
  AlimentoForm as Datos,
  estadoAlimento,
  formatearFecha,
} from '../../../models/alimento.model';
import { mensajeError } from '../../../core/http/errores';

@Component({
  selector: 'app-inventario',
  imports: [PageHeader, SearchBar, StatusBadge, AlimentoForm, EstadoPanel],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css',
})
export class Inventario {
  servicio = inject(InventarioService);

  termino = signal('');
  modalAbierto = signal(false);
  editando = signal<Alimento | null>(null);
  errorModal = signal<string | null>(null);
  errorAccion = signal<string | null>(null);

  estado = estadoAlimento;
  fecha = formatearFecha;

  filtrados = computed(() => {
    const t = this.termino().trim().toLowerCase();
    if (!t) return this.servicio.lista();
    return this.servicio.lista().filter((a) => a.nombre.toLowerCase().includes(t));
  });

  constructor() {
    this.servicio.cargar();
  }

  buscar(texto: string) {
    this.termino.set(texto);
  }

  abrirNuevo() {
    this.errorModal.set(null);
    this.editando.set(null);
    this.modalAbierto.set(true);
  }

  abrirEditar(a: Alimento) {
    this.errorModal.set(null);
    this.editando.set(a);
    this.modalAbierto.set(true);
  }

  cerrar() {
    this.modalAbierto.set(false);
    this.errorModal.set(null);
  }

  guardar(datos: Datos) {
    const actual = this.editando();
    this.errorModal.set(null);
    this.errorAccion.set(null);

    const peticion = actual
      ? this.servicio.actualizar(actual.id, datos)
      : this.servicio.agregar(datos);

    peticion.subscribe({
      next: () => this.cerrar(),
      error: (e) => this.errorModal.set(mensajeError(e)),
    });
  }

  eliminar(a: Alimento) {
    if (!confirm(`¿Eliminar "${a.nombre}" del inventario?`)) return;

    this.errorAccion.set(null);
    this.servicio.eliminar(a.id).subscribe({
      error: (e) => this.errorAccion.set(mensajeError(e)),
    });
  }
}
