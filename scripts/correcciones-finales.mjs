import fs from 'fs';
import path from 'path';

// Correcciones finales: algunos municipios están mal asignados
const correccionesFinales = {
  "San Andrés de Tumaco": "Nariño",   // Estaba asignado a Chocó
  "Roberto Payán": "Nariño",           // Estaba asignado a Chocó  
  "Olaya Herrera": "Nariño",          // Estaba asignado a Chocó
  "Mosquera": "Nariño",               // Estaba asignado a Chocó
  "Francisco Pizarro": "Nariño"       // Estaba asignado a Chocó
};

function correccionesFinalesUbicaciones() {
  const jsonPath = path.join(process.cwd(), 'src/data/experiencias.json');
  
  // Leer el archivo JSON
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
  let correccionesRealizadas = 0;
  
  data.experiencias.forEach((exp) => {
    // Corregir municipios que están en departamento incorrecto
    if (correccionesFinales[exp.municipio]) {
      const departamentoCorrecto = correccionesFinales[exp.municipio];
      if (exp.departamento !== departamentoCorrecto) {
        console.log(`EXP-${exp.expNumber}: ${exp.municipio}, ${exp.departamento} → ${exp.municipio}, ${departamentoCorrecto}`);
        exp.departamento = departamentoCorrecto;
        correccionesRealizadas++;
      }
    }
  });
  
  // Guardar el archivo corregido
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
  
  console.log(`\n✅ Correcciones finales completadas: ${correccionesRealizadas} cambios realizados`);
  console.log(`📁 Archivo actualizado: ${jsonPath}`);
}

correccionesFinalesUbicaciones();