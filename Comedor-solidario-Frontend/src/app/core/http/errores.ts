import { HttpErrorResponse } from '@angular/common/http';

export const SIN_CONEXION =
  'No se pudo conectar con el servidor. Revisa que el backend esté encendido.';

export function mensajeError(
  error: unknown,
  porDefecto = 'Ocurrió un error inesperado. Inténtalo nuevamente.',
): string {
  if (!(error instanceof HttpErrorResponse)) return porDefecto;
  if (error.status === 0) return SIN_CONEXION;

  const detalle: unknown = error.error?.detail;
  if (typeof detalle === 'string' && detalle.trim()) return detalle;

  if (Array.isArray(detalle) && detalle.length) {
    const primero = detalle[0] as { msg?: unknown };
    if (typeof primero?.msg === 'string') return primero.msg;
  }

  if (error.status === 401) return 'Usuario o contraseña incorrectos';
  return porDefecto;
}
