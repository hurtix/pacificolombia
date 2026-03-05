# Scripts de Extracción de Datos

## Scripts Útiles

### `extraer-experiencias-completo.mjs`
**Propósito:** Script principal para extraer y procesar las 100 experiencias de WordPress.

**Funcionalidad:**
- Extrae experiencias usando paginación de WordPress REST API
- Resuelve taxonomías (municipio, departamento, tipología) 
- Genera `src/data/experiencias.json` con datos completos y limpios
- Valida conteos exactos contra WordPress

**Uso:**
```bash
node scripts/extraer-experiencias-completo.mjs
```

**Output:** `src/data/experiencias.json` (100 experiencias con ubicaciones resueltas)

### `extraer-taxonomias.mjs`  
**Propósito:** Script de verificación para auditar taxonomías de WordPress.

**Funcionalidad:**
- Extrae todas las taxonomías con conteos de posts
- Útil para verificar consistencia de datos
- Debug y validación de municipios/departamentos

**Uso:**
```bash
node scripts/extraer-taxonomias.mjs
```

**Output:** Console log con estadísticas detalladas

## Archivos de Datos

### `src/data/experiencias.json`
Archivo principal con las 100 experiencias procesadas. Incluye:
- Títulos, descripciones y contenido
- Municipios y departamentos resueltos
- Tipologías de experiencia
- IDs de WordPress para referencias

## Notas
- Los scripts requieren conexión a WordPress local en `pacificolombia.local`
- Usar certificados HTTPS deshabilitados para desarrollo local
- Ejecutar `extraer-experiencias-completo.mjs` cuando se actualicen datos en WordPress