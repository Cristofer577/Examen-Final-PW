import { Injectable, computed, signal } from '@angular/core';
import { Usuario } from '../models/usuario.model';

const CLAVE_TOKEN = 'comedor.token';
const CLAVE_USUARIO = 'comedor.usuario';

@Injectable({ providedIn: 'root' })
export class Sesion {
  readonly token = signal<string | null>(localStorage.getItem(CLAVE_TOKEN));
  readonly usuario = signal<Usuario | null>(leerUsuario());

  readonly estaAutenticado = computed(() => this.token() !== null);

  guardar(token: string, usuario: Usuario) {
    this.token.set(token);
    this.usuario.set(usuario);
    localStorage.setItem(CLAVE_TOKEN, token);
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
  }

  limpiar() {
    this.token.set(null);
    this.usuario.set(null);
    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_USUARIO);
  }
}

function leerUsuario(): Usuario | null {
  const guardado = localStorage.getItem(CLAVE_USUARIO);
  if (!guardado) return null;
  try {
    return JSON.parse(guardado) as Usuario;
  } catch {
    return null;
  }
}
