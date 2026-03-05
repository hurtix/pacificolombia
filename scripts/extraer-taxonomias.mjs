import https from 'https';
import fs from 'fs';

// Configuración de WordPress
const WORDPRESS_URL = 'https://pacificolombia.local';

// Función para hacer peticiones HTTPS ignorando certificados
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const agent = new https.Agent({
      rejectUnauthorized: false
    });
    
    const options = {
      agent: agent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    };
    
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(new Error(`Error parsing JSON from ${url}: ${error.message}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Función para obtener taxonomías
async function obtenerTaxonomias() {
  try {
    console.log('🔍 Extrayendo taxonomías de WordPress...\n');
    
    // Obtener municipios  
    console.log('📍 Obteniendo municipios...');
    const urlMunicipios = `${WORDPRESS_URL}/wp-json/wp/v2/municipio?per_page=100`;
    const municipios = await makeRequest(urlMunicipios);
    
    // Obtener departamentos
    console.log('🏛️ Obteniendo departamentos...');  
    const urlDepartamentos = `${WORDPRESS_URL}/wp-json/wp/v2/departamento?per_page=100`;
    const departamentos = await makeRequest(urlDepartamentos);
    
    // Formatear datos
    const taxonomias = {
      municipios: municipios.map(m => ({
        term_id: m.id,
        term_name: m.name,
        slug: m.slug,
        count: m.count
      })).sort((a, b) => a.term_name.localeCompare(b.term_name)),
      
      departamentos: departamentos.map(d => ({
        term_id: d.id, 
        term_name: d.name,
        slug: d.slug,
        count: d.count
      })).sort((a, b) => a.term_name.localeCompare(b.term_name)),
      
      metadata: {
        fecha_extraccion: new Date().toISOString(),
        total_municipios: municipios.length,
        total_departamentos: departamentos.length,
        wordpress_url: WORDPRESS_URL
      }
    };
    
    // Guardar en archivo JSON
    const outputFile = 'src/data/taxonomias-wordpress.json';
    fs.writeFileSync(outputFile, JSON.stringify(taxonomias, null, 2));
    
    // Mostrar resumen
    console.log('\n✅ Extracción completada!');
    console.log(`📁 Archivo guardado: ${outputFile}`);
    console.log(`📍 Municipios encontrados: ${taxonomias.municipios.length}`);
    console.log(`🏛️ Departamentos encontrados: ${taxonomias.departamentos.length}\n`);
    
    // Mostrar listas
    console.log('📍 MUNICIPIOS:');
    taxonomias.municipios.forEach(m => {
      console.log(`   ID: ${m.term_id} | ${m.term_name} (${m.count} experiencias)`);
    });
    
    console.log('\n🏛️ DEPARTAMENTOS:');
    taxonomias.departamentos.forEach(d => {
      console.log(`   ID: ${d.term_id} | ${d.term_name} (${d.count} experiencias)`);
    });
    
    return taxonomias;
    
  } catch (error) {
    console.error('❌ Error al extraer taxonomías:', error.message);
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Sugerencias:');
      console.log('   - Verifica que WordPress esté funcionando en: ' + WORDPRESS_URL);
      console.log('   - Asegúrate de que Local by Flywheel esté ejecutándose');
      console.log('   - Confirma que la REST API esté habilitada');
    }
    
    throw error;
  }
}

obtenerTaxonomias();