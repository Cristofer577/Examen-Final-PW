import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Sesion } from '../../sesion';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private auth = inject(AuthService);
  private sesion = inject(Sesion);

  usuario = this.sesion.usuario;
  nombre = computed(() => this.usuario()?.nombre ?? 'Sin sesión');
  rol = computed(() => this.usuario()?.rol ?? 'Sin rol');
  inicial = computed(() => this.nombre().charAt(0).toUpperCase() || '?');

  menu = [
    { texto: 'Inicio', ruta: '/inicio', icono: '🏠' },
    { texto: 'Beneficiarios', ruta: '/beneficiarios', icono: '👥' },
    { texto: 'Raciones diarias', ruta: '/raciones', icono: '🍽️' },
    { texto: 'Inventario', ruta: '/inventario', icono: '📦' },
    { texto: 'Reportes', ruta: '/reportes', icono: '📊' },
  ];

  cerrarSesion() {
    this.auth.cerrarSesion();
  }
}
