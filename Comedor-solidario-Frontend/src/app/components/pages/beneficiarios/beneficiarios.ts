import { Component, computed, inject, signal } from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header';
import { SearchBar } from '../../shared/search-bar/search-bar';
import { EstadoPanel } from '../../shared/estado-panel/estado-panel';
import { BeneficiarioForm } from './beneficiario-form/beneficiario-form';
import { BeneficiarioService } from '../../../services/beneficiario';
import { Beneficiario, BeneficiarioForm as Datos } from '../../../models/beneficiario.model';
import { mensajeError } from '../../../core/http/errores';

@Component({
  selector: 'app-beneficiarios',
  imports: [PageHeader, SearchBar, BeneficiarioForm, EstadoPanel],
  templateUrl: './beneficiarios.html',
  styleUrl: './beneficiarios.css',
})
export class Beneficiarios {
  servicio = inject(BeneficiarioService);

  termino = signal('');
  modalAbierto = signal(false);
  editando = signal<Beneficiario | null>(null);
  errorModal = signal<string | null>(null);
  errorAccion = signal<string | null>(null);

  total = computed(() => this.servicio.lista().length);

  filtrados = computed(() => {
    const t = this.termino().trim().toLowerCase();
    if (!t) return this.servicio.lista();
    return this.servicio
      .lista()
      .filter((b) => b.nombre.toLowerCase().includes(t) || b.dni.includes(t));
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

  abrirEditar(b: Beneficiario) {
    this.errorModal.set(null);
    this.editando.set(b);
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

  eliminar(b: Beneficiario) {
    if (!confirm(`¿Eliminar a ${b.nombre}?`)) return;

    this.errorAccion.set(null);
    this.servicio.eliminar(b.id).subscribe({
      error: (e) => this.errorAccion.set(mensajeError(e)),
    });
  }

  etiquetaEdad(edad: number): string {
    if (edad >= 60) return 'Adulto Mayor';
    if (edad <= 12) return 'Escolar';
    return '';
  }
}
