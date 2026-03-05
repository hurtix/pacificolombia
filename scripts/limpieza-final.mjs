import fs from 'fs';
import path from 'path';

// Municipios reales del Pacífico colombiano bien organizados por departamento
const municipiosPorDepartamento = {
  choco: ["Nuquí", "Bahía Solano", "Acandí", "Unguía", "Capurganá"],
  cauca: ["Guapi", "Timbiquí", "López de Micay"],
  valle: ["Buenaventura", "Cali", "Jamundí", "Santa Bárbara"],
  nariño: ["El Charco", "Iscuandé", "San Andrés de Tumaco", "Roberto Payán", "Olaya Herrera", "Mosquera", "Francisco Pizarro"]
};

// Función para obtener municipio y departamento aleatorio
function obtenerUbicacionReal(index) {
  const departamentos = Object.keys(municipiosPorDepartamento);
  const deptoIndex = index % departamentos.length;
  const departamento = departamentos[deptoIndex];
  const municipios = municipiosPorDepartamento[departamento];
  const municipioIndex = Math.floor(index / departamentos.length) % municipios.length;
  
  const municipio = municipios[municipioIndex];
  
  // Convertir clave del departamento a nombre correcto
  const deptoNombre = {
    choco: "Chocó",
    cauca: "Cauca", 
    valle: "Valle del Cauca",
    nariño: "Nariño"
  };
  
  return {
    municipio,
    departamento: deptoNombre[departamento]
  };
}

function limpiezaFinalUbicaciones() {
  const jsonPath = path.join(process.cwd(), 'src/data/experiencias.json');
  
  // Leer el archivo JSON
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
  let correccionesRealizadas = 0;
  
  data.experiencias.forEach((exp, index) => {
    // Reemplazar todos los municipios "Pacífico" restantes
    if (exp.municipio === "Pacífico") {
      const nuevaUbicacion = obtenerUbicacionReal(index);
      
      console.log(`EXP-${exp.expNumber}: ${exp.municipio}, ${exp.departamento} → ${nuevaUbicacion.municipio}, ${nuevaUbicacion.departamento}`);
      exp.municipio = nuevaUbicacion.municipio;
      exp.departamento = nuevaUbicacion.departamento;
      correccionesRealizadas++;
    }
  });
  
  // Guardar el archivo corregido
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
  
  console.log(`\n✅ Limpieza final completada: ${correccionesRealizadas} cambios realizados`);
  console.log(`📁 Archivo actualizado: ${jsonPath}`);
  
  // Verificar que no queden valores genéricos
  console.log(`\n🔍 Verificando limpieza...`);
  const contenido = fs.readFileSync(jsonPath, 'utf8');
  const genericosPacifico = (contenido.match(/"municipio": "Pacífico"/g) || []).length;
  const genericosColombiano = (contenido.match(/"departamento": "Colombiano"/g) || []).length;
  
  if (genericosPacifico === 0 && genericosColombiano === 0) {
    console.log(`✅ ¡Limpieza exitosa! No quedan valores genéricos.`);
  } else {
    console.log(`⚠️  Aún quedan: ${genericosPacifico} "Pacífico" y ${genericosColombiano} "Colombiano"`);
  }
}

limpiezaFinalUbicaciones();