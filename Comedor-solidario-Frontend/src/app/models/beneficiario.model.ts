export type Categoria =
  'Grupo Familiar' | 'Atención Prioritaria' | 'Beneficiario Regular' | 'Apoyo Nutricional Escolar';

export interface Beneficiario {
  id: number;
  nombre: string;
  categoria: Categoria;
  dni: string;
  edad: number;
  telefono: string;
  raciones: number;
}

export type BeneficiarioForm = Omit<Beneficiario, 'id'>;
