// Integrantes 2 y 4 · PUNTO DE ENTRADA ÚNICO para enviar un reporte.
// La pantalla ciudadana solo llama a enviarReporte(); aquí se decide:
//   - con Internet  -> incidentService (Supabase)
//   - sin Internet  -> offline/queue (IndexedDB) y luego offline/sync lo envía
// Así no existen dos mecanismos de guardado distintos.
//
// Firma acordada:
//   enviarReporte(datos) -> { estadoLocal, id, folio?, codigo? }
