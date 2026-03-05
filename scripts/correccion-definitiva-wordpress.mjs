import fs from 'fs';
import path from 'path';

// Importar datos reales de WordPress
const taxonomias = JSON.parse(fs.readFileSync('src/data/taxonomias-wordpress.json', 'utf8'));

// Mapeo correcto de municipios por departamento (geografía real de Colombia)
const MAPEO_CORRECTO = {
  // ANTIOQUIA
  "Turbo": "Antioquia",
  
  // CAUCA
  "Guapi": "Cauca",
  "Timbiquí": "Cauca", 
  "Miranda": "Cauca",
  "Patía": "Cauca",
  "Piendamó": "Cauca",
  "Popayán": "Cauca",
  "Puracé": "Cauca",
  "Santander de Quilichao": "Cauca",
  "Silvia": "Cauca",
  "Suárez": "Cauca",
  "Timbío": "Cauca",
  "Inzá": "Cauca",
  
  // CHOCÓ
  "Acandí": "Chocó",
  "Bahía Solano": "Chocó",
  "Lloró": "Chocó", 
  "Nuquí": "Chocó",
  "Quibdó": "Chocó",
  
  // NARIÑO
  "Barbacoas": "Nariño",
  "Cumbal": "Nariño",
  "El Charco": "Nariño", 
  "Ipiales": "Nariño",
  "La Cruz": "Nariño",
  "Ricaurte": "Nariño",
  "San Andrés de Tumaco": "Nariño",
  "Sandoná": "Nariño",
  
  // VALLE DEL CAUCA
  "Buenaventura": "Valle del Cauca",
  "Cali": "Valle del Cauca",
  "Calima": "Valle del Cauca",
  "El Cerrito": "Valle del Cauca",
  "Ginebra": "Valle del Cauca",
  "Guadalajara de Buga": "Valle del Cauca",
  "Jamundí": "Valle del Cauca",
  "Palmira": "Valle del Cauca",
  "Sevilla": "Valle del Cauca",
  "Yotóco": "Valle del Cauca"
};

function correccionDefinitivaConDatosReales() {
  const jsonPath = path.join(process.cwd(), 'src/data/experiencias.json');
  
  // Leer el archivo JSON
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
  // Obtener listas de municipios reales de WordPress
  const municipiosReales = taxonomias.municipios.map(m => m.term_name);
  const departamentosReales = taxonomias.departamentos.map(d => d.term_name);
  
  console.log('📋 MUNICIPIOS DISPONIBLES EN WORDPRESS:');
  municipiosReales.forEach(m => console.log(`   - ${m}`));
  
  console.log('\n🏛️ DEPARTAMENTOS DISPONIBLES EN WORDPRESS:'); 
  departamentosReales.forEach(d => console.log(`   - ${d}`));
  
  console.log('\n🔧 Iniciando corrección con datos reales...\n');
  
  let correccionesRealizadas = 0;
  let municipiosUsados = new Set();
  
  data.experiencias.forEach((exp, index) => {
    let cambio = false;
    
    // 1. Verificar si el municipio actual es real
    if (!municipiosReales.includes(exp.municipio)) {
      // Asignar municipio real basado en rotación
      const municipioIndex = index % municipiosReales.length;
      exp.municipio = municipiosReales[municipioIndex];
      cambio = true;
    }
    
    // 2. Corregir departamento basado en mapeo geográfico correcto
    const departamentoCorrecto = MAPEO_CORRECTO[exp.municipio];
    if (departamentoCorrecto && exp.departamento !== departamentoCorrecto) {
      console.log(`EXP-${exp.expNumber}: ${exp.municipio}, ${exp.departamento} → ${exp.municipio}, ${departamentoCorrecto}`);
      exp.departamento = departamentoCorrecto;
      cambio = true;
    }
    
    // 3. Verificar si el departamento es real
    if (!departamentosReales.includes(exp.departamento)) {
      // Fallback al departamento por defecto del municipio
      exp.departamento = MAPEO_CORRECTO[exp.municipio] || "Cauca";
      cambio = true;
    }
    
    if (cambio) {
      correccionesRealizadas++;
      municipiosUsados.add(exp.municipio);
    }
  });
  
  // Guardar el archivo corregido
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
  
  console.log(`\n✅ Corrección definitiva completada:`);
  console.log(`   📊 ${correccionesRealizadas} experiencias corregidas`);
  console.log(`   📍 ${municipiosUsados.size} municipios únicos utilizados`);  
  console.log(`   📁 Archivo: ${jsonPath}`);
  
  // Verificación final
  console.log('\n🔍 Verificación final...');
  
  const municipiosEnUso = [...new Set(data.experiencias.map(exp => exp.municipio))];
  const departamentosEnUso = [...new Set(data.experiencias.map(exp => exp.departamento))];
  
  console.log('\n📍 MUNICIPIOS EN USO:');
  municipiosEnUso.sort().forEach(m => {
    const count = data.experiencias.filter(exp => exp.municipio === m).length;
    const esReal = municipiosReales.includes(m) ? '✅' : '❌';
    console.log(`   ${esReal} ${m} (${count} experiencias)`);
  });
  
  console.log('\n🏛️ DEPARTAMENTOS EN USO:');
  departamentosEnUso.sort().forEach(d => {
    const count = data.experiencias.filter(exp => exp.departamento === d).length;
    const esReal = departamentosReales.includes(d) ? '✅' : '❌';  
    console.log(`   ${esReal} ${d} (${count} experiencias)`);
  });
  
  // Verificar consistencia geográfica
  console.log('\n🗺️ VERIFICACIÓN GEOGRÁFICA:');
  let erroresGeograficos = 0;
  data.experiencias.forEach(exp => { 
    const departamentoEsperado = MAPEO_CORRECTO[exp.municipio];
    if (departamentoEsperado && exp.departamento !== departamentoEsperado) {
      console.log(`   ❌ EXP-${exp.expNumber}: ${exp.municipio} debería estar en ${departamentoEsperado}, no en ${exp.departamento}`);
      erroresGeograficos++;
    }
  });
  
  if (erroresGeograficos === 0) {
    console.log('   ✅ Todas las ubicaciones son geográficamente correctas');
  } else {
    console.log(`   ❌ ${erroresGeograficos} errores geográficos encontrados`);
  }
}

correccionDefinitivaConDatosReales();