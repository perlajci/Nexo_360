# Contrato de datos (versión 1)

Cualquier cambio se hace por Pull Request y lo aprueban los cuatro integrantes.

## incidentes
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid | Se genera en el teléfono (evita duplicados al sincronizar) |
| folio | text | Lo asigna el servidor |
| codigo_verificacion | text | Para consultar el folio |
| tipo_emergencia | text | Valor de TIPOS_EMERGENCIA |
| descripcion | text | |
| personas_afectadas | int | > 0 |
| necesidades | text[] | Valores de NECESIDADES (antes "necesidad") |
| prioridad | text | Crítica / Alta / Media, calculada por reglas |
| latitud, longitud | float8 | Nulos si está pendiente de ubicación |
| referencia_ubicacion | text | Ubicación manual |
| telefono_contacto | text | Opcional |
| origen | text | en_linea / sincronizado / operador / sms |
| estado | text | Valor de ESTADOS |
| fecha_creacion | timestamptz | Hora del teléfono al crear el reporte |

## Pendiente de definir
checkins, alertas, lecturas_sensor, zonas_riesgo, brigadas.
