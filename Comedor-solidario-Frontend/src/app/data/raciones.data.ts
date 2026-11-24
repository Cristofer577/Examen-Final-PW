import { MovimientoRacion } from '../models/racion.model';

export const META_DIARIA = 180;

export const MOVIMIENTOS_HOY: MovimientoRacion[] = [
  {
    id: 1,
    icono: '👨‍👩‍👧',
    beneficiario: 'Familia Quispe Hilario',
    raciones: 4,
    detalle: 'Menú: Lentejas con arroz criollo y ensalada de betarraga',
    hace: 'Hace 15 min',
    registradoPor: 'Bertha Mayta',
  },
  {
    id: 2,
    icono: '👴',
    beneficiario: 'Don Manuel Córdova',
    raciones: 2,
    etiqueta: 'Adulto Mayor',
    detalle: 'Ración sin sal agregada • Servido en recipiente térmico',
    hace: 'Hace 35 min',
    registradoPor: 'Yolanda Quispe',
  },
  {
    id: 3,
    icono: '👨‍👩‍👦',
    beneficiario: 'Familia Huamán Pérez',
    raciones: 3,
    detalle: 'Comedor en salón • Niños con raciones completas y fruta',
    hace: 'Hace 2 horas',
    registradoPor: 'Bertha Mayta',
  },
];
