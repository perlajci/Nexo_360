// Compartido · CONTRATO DE DATOS. Cambiar solo por Pull Request revisado por todo el equipo.

export const ESTADOS = ['Pendiente', 'Asignada', 'En atención', 'Atendida', 'Cancelada'];

export const TIPOS_EMERGENCIA = [
  'Inundación',
  'Deslave',
  'Sismo',
  'Incendio',
  'Actividad volcánica',
  'Emergencia médica',
  'Otro',
];

export const NECESIDADES = [
  'Rescate',
  'Atención médica',
  'Agua potable',
  'Alimentos',
  'Refugio',
  'Evacuación',
  'Otro',
];

export const PRIORIDADES = ['Crítica', 'Alta', 'Media'];

// Estados locales (solo existen en el teléfono, nunca en la base de datos)
export const ESTADOS_LOCALES = {
  GUARDADO: 'Guardado en el teléfono',
  PENDIENTE_ENVIO: 'Pendiente de envío',
  RECIBIDO: 'Recibido por el centro de control',
};
