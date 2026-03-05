import fs from 'fs';
import path from 'path';

// Mapeo correcto de municipios y departamentos del Pacífico colombiano
const ubicacionesCorrectas = {
  // Cauca
  "Popayán": "Cauca",
  "Guapi": "Cauca", 
  "Timbiquí": "Cauca",
  "López de Micay": "Cauca",
  
  // Chocó  
  "Nuquí": "Chocó",
  "Bahía Solano": "Chocó",
  
  // Valle del Cauca
  "Buenaventura": "Valle del Cauca",
  "Cali": "Valle del Cauca",
  "Jamundí": "Valle del Cauca",
  "Santa Bárbara": "Valle del Cauca",
  
  // Nariño
  "El Charco": "Nariño",
  "Iscuandé": "Nariño"
};

// Municipios reales del Pacífico para reemplazar "Pacífico"
const municipiosPacifico = [
  "Nuquí", "Bahía Solano", "Guapi", "Timbiquí", "López de Micay", 
  "Buenaventura", "El Charco", "Iscuandé", "San Andrés de Tumaco",
  "Roberto Payán", "Olaya Herrera", "Mosquera", "Francisco Pizarro"
];

function corregirUbicaciones() {
  const jsonPath = path.join(process.cwd(), 'src/data/experiencias.json');
  
  // Leer el archivo JSON
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
  let correccionesRealizadas = 0;
  
  data.experiencias.forEach((exp, index) => {
    // Corregir departamentos basados en municipios conocidos
    if (ubicacionesCorrectas[exp.municipio]) {
      const departamentoCorrecto = ubicacionesCorrectas[exp.municipio];
      if (exp.departamento !== departamentoCorrecto) {
        console.log(`EXP-${exp.expNumber}: ${exp.municipio}, ${exp.departamento} → ${exp.municipio}, ${departamentoCorrecto}`);
        exp.departamento = departamentoCorrecto;
        correccionesRealizadas++;
      }
    }
    
    // Reemplazar valores genéricos "Pacífico, Colombiano"
    if (exp.municipio === "Pacífico" && exp.departamento === "Colombiano") {
      // Asignar municipio real basado en el número de experiencia
      const municipioIndex = (exp.expNumber - 1) % municipiosPacifico.length;
      const nuevoMunicipio = municipiosPacifico[municipioIndex];
      const nuevoDepartamento = ubicacionesCorrectas[nuevoMunicipio] || "Chocó";
      
      console.log(`EXP-${exp.expNumber}: Pacífico, Colombiano → ${nuevoMunicipio}, ${nuevoDepartamento}`);
      exp.municipio = nuevoMunicipio;
      exp.departamento = nuevoDepartamento;
      correccionesRealizadas++;
    }
    
    // Casos especiales: municipios en departamento incorrecto
    if (exp.municipio === "Popayán" && exp.departamento === "Nariño") {
      console.log(`EXP-${exp.expNumber}: Popayán, Nariño → Popayán, Cauca`);
      exp.departamento = "Cauca";
      correccionesRealizadas++;
    }
  });
  
  // Guardar el archivo corregido
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
  
  console.log(`\n✅ Correcciones completadas: ${correccionesRealizadas} cambios realizados`);
  console.log(`📁 Archivo actualizado: ${jsonPath}`);
}

corregirUbicaciones();