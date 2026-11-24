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

// De dónde llegó un registro
export const ORIGENES = ['en_linea', 'sincronizado', 'operador', 'sms', 'sensor'];

export const ESTADOS_CHECKIN = ['A salvo', 'En refugio', 'Necesito ayuda'];

export const NIVELES_ALERTA = ['Preventiva', 'Alerta', 'Evacuación'];

export const NIVELES_RIESGO = ['Alto', 'Medio', 'Bajo'];

export const TIPOS_BRIGADA = ['Rescate', 'Médica', 'Protección Civil', 'Voluntarios'];

export const ESTADOS_BRIGADA = ['Disponible', 'Asignada', 'Fuera de servicio'];

// Se calcula al mostrar una lectura; no se guarda en la base de datos
export const ESTADOS_SENSOR = ['Normal', 'Precaución', 'Peligro'];

// Estados locales (solo existen en el teléfono, nunca en la base de datos)
export const ESTADOS_LOCALES = {
  GUARDADO: 'Guardado en el teléfono',
  PENDIENTE_ENVIO: 'Pendiente de envío',
  RECIBIDO: 'Recibido por el centro de control',
};
