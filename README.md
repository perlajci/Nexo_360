# NEXO 360 · Alerta y Respuesta Comunitaria

Plataforma de alerta y atención de emergencias para comunidades con conectividad limitada.
Proyecto para el HackaTec 2026 (reto SECIHTI Puebla). Todos los datos de la demo son ficticios.

## Estructura
```
src/
  shared/        Compartido (contrato, cliente Supabase, componentes base, estilos)
  services/      Integrante 2 · acceso a Supabase
  offline/       Integrante 4 · IndexedDB, cola, sincronización, SMS
  features/
    ciudadano/   Integrante 1 · app ciudadana
    control/     Integrante 3 · centro de control
supabase/        Integrante 2 · migraciones SQL y datos de demo
firmware/        Integrante 4 · sensor ESP32
public/          manifest, íconos y service worker
docs/            contrato de datos, arquitectura, costos, pruebas, guion de demo
design/          enlace al maquetado
```

## Instalación
```bash
npm install
cp .env.example .env   # y llena los valores
npm run dev
```

## Reglas del equipo
1. Nadie trabaja directo en `main`. Ramas: `feature/<modulo>-<tarea>`, por ejemplo `feature/ciudadano-formulario`.
2. Todo entra por Pull Request a `develop`; `develop` pasa a `main` solo en cada integración (horas 14, 24 y 32).
3. `src/shared/` y `docs/contrato-datos.md` se cambian solo con acuerdo de los cuatro.
4. Los componentes no llaman a Supabase directamente: usan `src/services/`.
5. Para enviar un reporte se usa solo `enviarReporte()` de `src/services/reportService.js`.
