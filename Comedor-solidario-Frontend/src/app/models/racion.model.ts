export interface MovimientoRacion {
  id: number;
  icono: string;
  beneficiario: string;
  raciones: number;
  etiqueta?: string;
  detalle: string;
  hace: string;
  registradoPor: string;
}

export interface RegistroRacion {
  beneficiarioId: number;
  familia: string;
  etiqueta?: string | null;
  dni: string;
  codigo: string;
  raciones: number;
  entregado: boolean;
}

export interface DiaRaciones {
  fecha: string;
  meta: number;
  servidas: number;
  pendientes: number;
  registros: RegistroRacion[];
}

export interface RegistroRacionEntrada {
  beneficiarioId: number;
  entregado: boolean;
}

export interface GuardarDia {
  registros: RegistroRacionEntrada[];
}
