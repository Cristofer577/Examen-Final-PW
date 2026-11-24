export interface Alimento {
  id: number;
  nombre: string;
  cantidad: number;
  unidad: string;
  fechaIngreso: string; // formato AAAA-MM-DD
  stockMinimo: number;
}

export type AlimentoForm = Omit<Alimento, 'id'>;

export interface EstadoAlimento {
  texto: string;
  tipo: 'verde' | 'naranja' | 'rojo';
}

export function estadoAlimento(a: Alimento): EstadoAlimento {
  if (a.cantidad <= 0) return { texto: 'Agotado', tipo: 'rojo' };
  if (a.cantidad <= a.stockMinimo) return { texto: 'Poco stock', tipo: 'naranja' };
  return { texto: 'Suficiente', tipo: 'verde' };
}

export function formatearFecha(iso: string): string {
  const [anio, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${anio}`;
}
