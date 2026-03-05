// Script para exportar datos de WordPress a archivo JSON estático
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

// Configuración de WordPress API (copia de wordpress.ts)
const WORDPRESS_API_BASE = 'http://pacificolombia.local/wp-json';

async function fetchWordpressData(endpoint, params = {}) {
  try {
    const url = new URL(`${WORDPRESS_API_BASE}/wp/v2/${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error.message);
    throw error;
  }
}

async function getCustomPosts(postType, limit = 100) {
  return await fetchWordpressData(postType, {
    per_page: limit,
    _embed: 'wp:featuredmedia'
  });
}

async function main() {
  try {
    console.log('🔄 Exportando datos de WordPress...');
    
    // Obtener todas las experiencias
    const experiencias = await getCustomPosts('experiencia', 100);
    
    console.log(`📊 Encontradas ${experiencias.length} experiencias`);
    
    // Crear el objeto de datos exportados
    const exportedData = {
      experiencias: experiencias,
      exportDate: new Date().toISOString(),
      totalExperiencias: experiencias.length
    };
    
    // Escribir a archivo JSON
    const outputPath = path.resolve('src/data/wordpress-data.json');
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(exportedData, null, 2));
    
    console.log('✅ Datos exportados correctamente a:', outputPath);
    console.log('📋 Resumen:');
    
    // Mostrar resumen de las primeras experiencias
    experiencias.slice(0, 5).forEach(exp => {
      const expNumber = exp.title?.rendered?.match(/EXP-(\d+)/)?.[1];
      const municipio = exp.acf?.municipio || 'No definido';
      const departamento = exp.acf?.departamento || 'No definido';
      console.log(`   EXP-${expNumber}: ${municipio}, ${departamento}`);
    });
    
    if (experiencias.length > 5) {
      console.log(`   ... y ${experiencias.length - 5} más`);
    }
    
  } catch (error) {
    console.error('❌ Error exportando datos:', error);
    console.log('💡 Asegúrate de que WordPress esté ejecutándose en http://pacificolombia.local');
    process.exit(1);
  }
}

// Ejecutar el script
main();

async function exportWordPressData() {
  try {
    console.log('🔄 Exportando datos de WordPress...');
    
    // Obtener todas las experiencias
    const experiencias = await getCustomPosts('experiencia', 100);
    
    console.log(`📊 Encontradas ${experiencias.length} experiencias`);
    
    // Crear el objeto de datos exportados
    const exportedData = {
      experiencias: experiencias,
      exportDate: new Date().toISOString(),
      totalExperiencias: experiencias.length
    };
    
    // Escribir a archivo JSON
    const outputPath = path.resolve('src/data/wordpress-data.json');
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(exportedData, null, 2));
    
    console.log('✅ Datos exportados correctamente a:', outputPath);
    console.log('📋 Resumen:');
    
    // Mostrar resumen de las primeras experiencias
    experiencias.slice(0, 5).forEach(exp => {
      const expNumber = exp.title?.rendered?.match(/EXP-(\d+)/)?.[1];
      const municipio = exp.acf?.municipio || 'No definido';
      const departamento = exp.acf?.departamento || 'No definido';
      console.log(`   EXP-${expNumber}: ${municipio}, ${departamento}`);
    });
    
    if (experiencias.length > 5) {
      console.log(`   ... y ${experiencias.length - 5} más`);
    }
    
  } catch (error) {
    console.error('❌ Error exportando datos:', error);
    console.log('💡 Asegúrate de que WordPress esté ejecutándose en http://pacificolombia.local');
    process.exit(1);
  }
}

// Ejecutar el script
exportWordPressData();