// Script para crear el JSON definitivo con TODOS los datos necesarios
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

const WORDPRESS_API_BASE = 'http://pacificolombia.local/wp-json';

// Mapeos de taxonomías a nombres reales
const MUNICIPIO_MAP = {
  11: 'Tumaco', 18: 'Nuquí', 21: 'Guapi', 23: 'López de Micay', 24: 'Timbiquí', 
  26: 'Bahía Solano', 29: 'Popayán', 31: 'Buenaventura', 37: 'Cali', 42: 'El Charco',
  45: 'Iscuandé', 47: 'La Tola', 50: 'Mosquera', 53: 'Olaya Herrera', 56: 'Roberto Payán',
  59: 'Santa Bárbara', 62: 'Jamundí', 65: 'Bojayá', 68: 'Quibdó'
};

const DEPARTAMENTO_MAP = {
  4: 'Chocó', 6: 'Cauca', 7: 'Chocó', 11: 'Nariño', 18: 'Chocó', 50: 'Valle del Cauca'
};

const TIPOLOGIA_MAP = {
  1: 'Cultural', 2: 'Naturaleza', 3: 'Gastronómico', 4: 'Aventura', 5: 'Comunitario',
  6: 'Etnoturismo', 7: 'Turismo de Naturaleza', 8: 'Agroturismo'
};

async function obtenerExperiencias() {
  try {
    const response = await fetch(`${WORDPRESS_API_BASE}/wp/v2/experiencia?per_page=100`);
    const experiencias = await response.json();
    
    return experiencias.map(exp => {
      const expNumber = exp.title?.rendered?.match(/EXP-(\d+)/)?.[1] || '000';
      
      return {
        id: exp.id,
        expNumber: parseInt(expNumber),
        title: exp.title?.rendered || `Experiencia ${expNumber}`,
        excerpt: "Descubre esta increíble experiencia en el Pacífico colombiano.",
        content: exp.content?.rendered || "Esta es una experiencia del Pacífico colombiano que te conectará con la naturaleza, la cultura y las tradiciones locales.",
        
        // Ubicación resuelta
        municipio: exp.acf?.municipio?.[0] ? MUNICIPIO_MAP[exp.acf.municipio[0]] || 'Pacífico' : 'Pacífico',
        departamento: exp.acf?.departamento?.[0] ? DEPARTAMENTO_MAP[exp.acf.departamento[0]] || 'Colombiano' : 'Colombiano',
        
        // Tipología resuelta  
        tipologia: exp.acf?.tipologia?.[0] ? TIPOLOGIA_MAP[exp.acf.tipologia[0]] || 'Cultural' : 'Cultural',
        
        // Otros datos
        estado: exp.acf?.estado || true,
        fecha: exp.date || new Date().toISOString()
      };
    });
    
  } catch (error) {
    console.error('Error obteniendo experiencias:', error);
    return [];
  }
}

async function crearDatosDefinitivos() {
  console.log('🔄 Creando JSON definitivo...');
  
  const experiencias = await obtenerExperiencias();
  
  if (experiencias.length === 0) {
    console.error('❌ No se pudieron obtener experiencias de WordPress');
    process.exit(1);
  }
  
  // Ordenar por número de experiencia
  experiencias.sort((a, b) => a.expNumber - b.expNumber);
  
  const datosDefinitivos = {
    experiencias,
    totalExperiencias: experiencias.length,
    fechaCreacion: new Date().toISOString(),
    version: '1.0.0'
  };
  
  // Guardar JSON
  const outputPath = path.resolve('src/data/experiencias.json');
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(datosDefinitivos, null, 2));
  
  console.log(`✅ JSON definitivo creado: ${experiencias.length} experiencias`);
  console.log('📋 Primeras 5 experiencias:');
  
  experiencias.slice(0, 5).forEach(exp => {
    console.log(`   EXP-${exp.expNumber.toString().padStart(3, '0')}: ${exp.municipio}, ${exp.departamento}`);
  });
  
  console.log(`📁 Archivo guardado en: ${outputPath}`);
}

crearDatosDefinitivos();