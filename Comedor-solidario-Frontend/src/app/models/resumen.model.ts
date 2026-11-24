export interface RacionesResumen {
  servidas: number;
  meta: number;
  pendientes: number;
}

export interface Poblacion {
  total: number;
  adultosMayores: number;
  ninos: number;
}

export interface InsumoCritico {
  nombre: string;
  cantidad: number;
  unidad: string;
  estado: 'Poco stock' | 'Agotado';
}

export interface ResumenInicio {
  fecha: string;
  raciones: RacionesResumen;
  poblacion: Poblacion;
  insumosCriticos: InsumoCritico[];
}
