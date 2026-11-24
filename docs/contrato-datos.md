# Contrato de datos (versión 2 · propuesta)

Cualquier cambio se hace por Pull Request y lo aprueban los cuatro integrantes.

## Qué es esto y para qué sirve

El contrato de datos es el acuerdo de **qué información guardamos y con qué nombres**.
Gracias a él, cada integrante puede trabajar por su lado sin esperar a las demás:

- **Gris** crea las tablas en Supabase con estos nombres exactos.
- **Erandi** arma los formularios con estos campos y envía los datos con `enviarReporte()`.
- **Marlene** dibuja el centro de control sabiendo qué campos va a recibir, aunque al principio use datos falsos.
- **Perla** guarda en el teléfono (IndexedDB) los reportes con esta misma forma, para que al sincronizar no haya que transformarlos.

Si alguien necesita un campo nuevo, lo propone por Pull Request y no lo agrega por su cuenta.

## Reglas generales

| Regla | Ejemplo | Por qué |
|---|---|---|
| Nombres en español, minúsculas y con guion bajo | `personas_afectadas` | Así se escriben igual en SQL y en JavaScript |
| Sin acentos ni ñ en los **nombres de campo** | `poblacion_estimada` | Evita errores en SQL. Los **valores** sí llevan acentos: `'Inundación'` |
| Cada tabla tiene `id` | | Para identificar cada registro |
| Fechas en `timestamptz` | `2026-11-24T10:30:00Z` | Guarda la zona horaria; el navegador la muestra en hora de México |
| Coordenadas en grados decimales | `latitud 19.9195, longitud -97.5610` | Es lo que da el GPS del teléfono |
| Valores de lista salen de `src/shared/constants/catalogos.js` | `estado = 'Pendiente'` | Si alguien escribe `'pendiente'` en minúscula, deja de coincidir |
| Datos personales: los mínimos | Solo `telefono_contacto`, opcional | Protege a la comunidad; la demo usa datos ficticios |

## Mapa de tablas

```
zonas_riesgo ──┬── alertas            (una alerta puede ser para una zona o para todas)
               ├── sensores ── lecturas_sensor
               ├── incidentes ── brigadas   (un incidente se asigna a una brigada)
               └── checkins
```

---

## 1. incidentes

Una **solicitud de ayuda** enviada desde la pantalla Solicitud. Se muestra en la lista del centro de control.

| Campo | Tipo | Obligatorio | Quién lo llena | Notas |
|---|---|---|---|---|
| id | uuid | Sí | Teléfono | `crypto.randomUUID()`. Si el reporte se envía dos veces al sincronizar, no se duplica |
| folio | text | Sí | Servidor | Formato `NX-000123` |
| codigo_verificacion | text | Sí | Servidor | 4 dígitos. Con folio + código el ciudadano consulta su seguimiento |
| tipo_emergencia | text | Sí | Teléfono | Valor de `TIPOS_EMERGENCIA` |
| descripcion | text | No | Teléfono | Máximo 500 caracteres |
| personas_afectadas | int | Sí | Teléfono | Mayor que 0 |
| necesidades | text[] | Sí | Teléfono | Lista de valores de `NECESIDADES`, al menos uno |
| prioridad | text | Sí | Teléfono | Valor de `PRIORIDADES`. Ver reglas abajo |
| latitud, longitud | float8 | No | Teléfono | Nulos si no hubo GPS |
| referencia_ubicacion | text | No* | Teléfono | Ej. "Junto a la iglesia de San Miguel". *Obligatorio si no hay GPS |
| telefono_contacto | text | No | Teléfono | 10 dígitos. Solo lo ve el centro de control |
| zona_id | uuid | No | Servidor u operador | Zona de riesgo donde ocurrió, si se sabe |
| brigada_id | uuid | No | Operador | Brigada asignada. Nulo mientras esté Pendiente |
| origen | text | Sí | Teléfono / servidor | Valor de `ORIGENES` |
| estado | text | Sí | Servidor, luego operador | Empieza en `'Pendiente'`. Valor de `ESTADOS` |
| fecha_creacion | timestamptz | Sí | Teléfono | Cuándo la persona tocó "Enviar", aunque no hubiera señal |
| fecha_recepcion | timestamptz | Sí | Servidor | Cuándo llegó a Supabase (`now()`) |
| fecha_actualizacion | timestamptz | Sí | Servidor | Última vez que cambió el estado |

**Reglas de prioridad.** Se calculan en el teléfono para que funcionen sin conexión:

1. **Crítica**: las necesidades incluyen `Rescate` o `Atención médica`, o el tipo es `Emergencia médica`.
2. **Alta**: incluye `Evacuación`, o hay 5 o más personas afectadas.
3. **Media**: todo lo demás.

**Cambios de estado:**

```
Pendiente → Asignada → En atención → Atendida
    └──────────┴────────────┴──────→ Cancelada
```

## 2. checkins

El aviso **"Estoy bien / Necesito ayuda"** de la pantalla Check-in. El centro de control los cuenta en `CheckinSummary`.

| Campo | Tipo | Obligatorio | Quién lo llena | Notas |
|---|---|---|---|---|
| id | uuid | Sí | Teléfono | Igual que en incidentes |
| alerta_id | uuid | No | Teléfono | La alerta a la que responde, si había una activa |
| estado | text | Sí | Teléfono | Valor de `ESTADOS_CHECKIN` |
| personas | int | Sí | Teléfono | Cuántas personas incluye el aviso (la familia). Mínimo 1 |
| latitud, longitud | float8 | No | Teléfono | |
| referencia_ubicacion | text | No | Teléfono | |
| zona_id | uuid | No | Servidor | |
| origen | text | Sí | Teléfono / servidor | Valor de `ORIGENES` |
| fecha_creacion | timestamptz | Sí | Teléfono | |
| fecha_recepcion | timestamptz | Sí | Servidor | |

Si alguien marca **"Necesito ayuda"**, la app lo manda a la pantalla Solicitud para que llene un incidente. El check-in por sí solo no crea un incidente.

## 3. alertas

El aviso que aparece en la pantalla de **Inicio**. Lo emite el centro de control o se genera cuando un sensor pasa a Peligro.

| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| id | uuid | Sí | Servidor |
| titulo | text | Sí | Ej. "Crecida del río" |
| mensaje | text | Sí | Qué pasa y qué hacer. Lenguaje simple |
| tipo_emergencia | text | Sí | Valor de `TIPOS_EMERGENCIA` |
| nivel | text | Sí | Valor de `NIVELES_ALERTA` |
| zona_id | uuid | No | Nulo = alerta para toda la localidad |
| origen | text | Sí | `'operador'` o `'sensor'` |
| activa | boolean | Sí | Solo las activas se muestran en Inicio |
| fecha_emision | timestamptz | Sí | |
| fecha_fin | timestamptz | No | Cuándo se desactivó |

## 4. zonas_riesgo

Las áreas que se pintan en el **mapa de riesgo** (`RiskMap`). Para no complicarnos con polígonos, cada zona es un **círculo**: un centro y un radio.

| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| id | uuid | Sí | |
| nombre | text | Sí | Ej. "Ribera del río, barrio Bajo" |
| tipo_riesgo | text | Sí | Valor de `TIPOS_EMERGENCIA` |
| nivel_riesgo | text | Sí | Valor de `NIVELES_RIESGO` |
| latitud, longitud | float8 | Sí | Centro del círculo |
| radio_metros | int | Sí | |
| poblacion_estimada | int | No | Lo usa `estimacionRecursos.js` |
| descripcion | text | No | |

Se cargan una sola vez con datos de demo (`supabase/seed/datos_demo.sql`). La app no las modifica.

## 5. sensores (tabla nueva)

Cada aparato ESP32 instalado. Agregamos esta tabla para no repetir la ubicación y los umbrales en cada lectura.

| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| id | text | Sí | Nombre corto escrito a mano, ej. `'rio-01'`. Va también en `secrets.h` del ESP32 |
| nombre | text | Sí | Ej. "Puente principal" |
| zona_id | uuid | No | |
| latitud, longitud | float8 | Sí | |
| umbral_precaucion_cm | int | Sí | Nivel desde el que se muestra Precaución |
| umbral_peligro_cm | int | Sí | Nivel desde el que se muestra Peligro |

## 6. lecturas_sensor

Cada medición que envía el ESP32. `SensorCard` muestra la más reciente.

| Campo | Tipo | Obligatorio | Quién lo llena | Notas |
|---|---|---|---|---|
| id | bigint | Sí | Servidor | Número automático. El ESP32 no necesita generarlo |
| sensor_id | text | Sí | ESP32 | Debe existir en `sensores` |
| nivel_cm | numeric | Sí | ESP32 | Altura del agua en centímetros |
| fecha_lectura | timestamptz | Sí | Servidor | `now()`. El ESP32 no tiene reloj confiable |

El **estado** (Normal / Precaución / Peligro) **no se guarda**: se calcula al mostrarlo, comparando `nivel_cm` con los umbrales del sensor. Así, si cambian los umbrales, no hay que corregir lecturas viejas.

## 7. brigadas

Los equipos que se asignan desde `AssignPanel`.

| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| id | uuid | Sí | |
| nombre | text | Sí | Ej. "Brigada Protección Civil 1" |
| tipo | text | Sí | Valor de `TIPOS_BRIGADA` |
| integrantes | int | Sí | Cuántas personas tiene |
| estado | text | Sí | Valor de `ESTADOS_BRIGADA` |
| telefono | text | No | |
| latitud, longitud | float8 | No | Última ubicación conocida |

**Al asignar:** el incidente recibe `brigada_id` y pasa a `'Asignada'`, y la brigada pasa a `'Asignada'`.
**Al cerrar** (incidente `'Atendida'` o `'Cancelada'`), la brigada vuelve a `'Disponible'`.

---

## Quién puede hacer qué (para las políticas RLS)

| Tabla | Ciudadano (sin cuenta) | Operador (con sesión) | Sensor ESP32 |
|---|---|---|---|
| incidentes | Crear. Consultar el suyo con folio + código | Ver todos, cambiar estado y brigada | — |
| checkins | Crear | Ver todos | — |
| alertas | Ver las activas | Crear y desactivar | — |
| zonas_riesgo | Ver | Ver | — |
| sensores | Ver | Ver | — |
| lecturas_sensor | Ver | Ver | Crear |
| brigadas | — | Ver y cambiar estado | — |

El ciudadano **no puede ver la lista de incidentes**, solo el suyo. Para eso Gris hará una función en Supabase, `consultar_folio(folio, codigo)`, que devuelve únicamente: folio, tipo_emergencia, estado, fecha_creacion y fecha_actualizacion.

## Funciones acordadas entre módulos

```js
// src/services/reportService.js (Gris + Perla). Lo llama Erandi.
enviarReporte({
  id, tipo_emergencia, descripcion, personas_afectadas, necesidades,
  prioridad, latitud, longitud, referencia_ubicacion, telefono_contacto,
  fecha_creacion,
})
// → { estadoLocal, id, folio?, codigo? }
//   estadoLocal es un valor de ESTADOS_LOCALES.
//   folio y codigo solo vienen si hubo Internet; si no, llegan después al sincronizar.
```

## Pendiente de decidir

- **SMS** (`src/offline/sms.js`): definir un formato corto de mensaje y quién lo recibe. Si no da tiempo, en la demo se muestra el mensaje armado sin enviarlo.
- **Inicio de sesión del operador**: propuesta, un usuario de Supabase Auth creado a mano para la demo.
