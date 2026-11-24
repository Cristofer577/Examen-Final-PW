import { Alimento } from '../models/alimento.model';

export const ALIMENTOS: Alimento[] = [
  { id: 1, nombre: 'Arroz extra costeño', cantidad: 45, unidad: 'kg', fechaIngreso: '2024-10-20', stockMinimo: 10 },
  { id: 2, nombre: 'Aceite vegetal', cantidad: 4, unidad: 'botellas (1L)', fechaIngreso: '2024-10-15', stockMinimo: 5 },
  { id: 3, nombre: 'Lentejas serranas', cantidad: 0, unidad: 'kg', fechaIngreso: '2024-10-05', stockMinimo: 5 },
  { id: 4, nombre: 'Papa amarilla Huancayo', cantidad: 60, unidad: 'kg', fechaIngreso: '2024-10-22', stockMinimo: 15 },
  { id: 5, nombre: 'Sal yodada', cantidad: 12, unidad: 'paquetes (1kg)', fechaIngreso: '2024-10-18', stockMinimo: 5 },
  { id: 6, nombre: 'Fideos tallarín', cantidad: 3, unidad: 'bolsas', fechaIngreso: '2024-10-12', stockMinimo: 5 },
  { id: 7, nombre: 'Avena precocida', cantidad: 25, unidad: 'kg', fechaIngreso: '2024-10-21', stockMinimo: 8 },
  { id: 8, nombre: 'Leche evaporada', cantidad: 18, unidad: 'latas', fechaIngreso: '2024-10-19', stockMinimo: 6 },
];