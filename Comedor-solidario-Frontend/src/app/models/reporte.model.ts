export interface RacionDia {
  fecha: string; // formato AAAA-MM-DD
  servidas: number;
}

export interface ReporteRaciones {
  desde: string;
  hasta: string;
  meta: number;
  total: number;
  promedio: number;
  dias: RacionDia[];
}
