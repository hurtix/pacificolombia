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

// Función para obtener TODAS las experiencias de WordPress
async function extraerTodasLasExperiencias() {
  try {
    console.log('🔥 EXTRAYENDO TODAS LAS EXPERIENCIAS DE WORDPRESS\n');
    
    // 1. Obtener taxonomías primero
    console.log('📍 Obteniendo taxonomías...');
    const municipios = await makeRequest(`${WORDPRESS_URL}/wp-json/wp/v2/municipio?per_page=100`);
    const departamentos = await makeRequest(`${WORDPRESS_URL}/wp-json/wp/v2/departamento?per_page=100`);
    
    let tipologias = [];
    try {
      tipologias = await makeRequest(`${WORDPRESS_URL}/wp-json/wp/v2/tipologia?per_page=100`);
    } catch (error) {
      console.log('⚠️ No se pudieron obtener tipologías, usando valores por defecto');
      tipologias = [];
    }
    
    console.log(`✅ ${municipios.length} municipios, ${departamentos.length} departamentos, ${Array.isArray(tipologias) ? tipologias.length : 0} tipologías`);
    
    // Crear mapeos para búsqueda rápida
    const municipiosMap = new Map(municipios.map(m => [m.id, m.name]));
    const departamentosMap = new Map(departamentos.map(d => [d.id, d.name]));
    const tipologiasMap = new Map(Array.isArray(tipologias) ? tipologias.map(t => [t.id, t.name]) : []);
    
    // 2. Obtener TODAS las experiencias (posts)
    console.log('\n🎯 Obteniendo TODAS las experiencias...');
    let todasLasExperiencias = [];
    let pagina = 1;
    let hayMasPaginas = true;
    
    while (hayMasPaginas) {
      const url = `${WORDPRESS_URL}/wp-json/wp/v2/experiencia?per_page=100&page=${pagina}`;
      console.log(`   Página ${pagina}...`);
      
      try {
        const experiencias = await makeRequest(url);
        if (experiencias.length > 0) {
          todasLasExperiencias = todasLasExperiencias.concat(experiencias);
          pagina++;
        } else {
          hayMasPaginas = false;
        }
      } catch (error) {
        if (error.message.includes('400')) {
          // No más páginas
          hayMasPaginas = false;
        } else {
          throw error;
        }
      }
    }
    
    console.log(`✅ ${todasLasExperiencias.length} experiencias encontradas`);
    
    // 3. Procesar y formatear experiencias
    console.log('\n📊 Procesando experiencias...');
    const experienciasProcesadas = [];
    const conteosPorMunicipio = new Map();
    
    for (let i = 0; i < todasLasExperiencias.length; i++) {
      const exp = todasLasExperiencias[i];
      
      // Obtener taxonomías asociadas
      const municipioIds = exp.municipio || [];
      const departamentoIds = exp.departamento || [];
      const tipologiaIds = exp.tipologia || [];
      
      // Usar la primera taxonomía encontrada (en WordPress puede haber múltiples)
      const municipio = municipioIds.length > 0 ? municipiosMap.get(municipioIds[0]) : 'Sin municipio';
      const departamento = departamentoIds.length > 0 ? departamentosMap.get(departamentoIds[0]) : 'Sin departamento';
      const tipologia = (tipologiaIds.length > 0 && tipologiasMap.has(tipologiaIds[0])) ? tipologiasMap.get(tipologiaIds[0]) : 'Cultural';
      
      // Contar por municipio
      if (municipio !== 'Sin municipio') {
        conteosPorMunicipio.set(municipio, (conteosPorMunicipio.get(municipio) || 0) + 1);
      }
      
      const experienciaProcesada = {
        id: exp.id,
        expNumber: i + 1,
        title: (exp.title?.rendered || `EXP-${i + 1} : Experiencia ${i + 1}`).replace(/&#\d+;/g, ''),
        excerpt: (exp.excerpt?.rendered || "Descubre esta increíble experiencia en el Pacífico colombiano.").replace(/<[^>]*>/g, '').trim(),
        content: (exp.content?.rendered || "Esta es una experiencia del Pacífico colombiano que te conectará con la naturaleza, la cultura y las tradiciones locales.").replace(/<[^>]*>/g, '').trim(),
        municipio: municipio,
        departamento: departamento,
        tipologia: tipologia,
        estado: exp.status === 'publish',
        fecha: exp.date || new Date().toISOString()
      };
      
      experienciasProcesadas.push(experienciaProcesada);
    }
    
    // 4. Verificar conteos contra taxonomías
    console.log('\n🔍 VERIFICANDO CONTEOS...');
    console.log('\nConteos desde posts vs taxonomías:');
    
    let erroresConteo = 0;
    for (const municipio of municipios) {
      const conteoTaxonomia = municipio.count;
      const conteoExtraido = conteosPorMunicipio.get(municipio.name) || 0;
      
      if (conteoTaxonomia !== conteoExtraido) {
        console.log(`❌ ${municipio.name}: Taxonomía=${conteoTaxonomia}, Extraído=${conteoExtraido}`);
        erroresConteo++;
      } else {
        console.log(`✅ ${municipio.name}: ${conteoTaxonomia} experiencias`);
      }
    }
    
    // 5. Generar JSON final
    const jsonFinal = {
      experiencias: experienciasProcesadas,
      totalExperiencias: experienciasProcesadas.length,
      fechaCreacion: new Date().toISOString(),
      version: "2.0.0 - Extraído directamente de WordPress",
      verificacion: {
        erroresConteo: erroresConteo,
        conteosPorMunicipio: Object.fromEntries(conteosPorMunicipio)
      }
    };
    
    // Guardar archivo
    const outputFile = 'src/data/experiencias.json';
    fs.writeFileSync(outputFile, JSON.stringify(jsonFinal, null, 2));
    
    console.log(`\n✅ EXTRACCIÓN COMPLETADA:`);
    console.log(`📁 Archivo: ${outputFile}`);
    console.log(`📊 ${jsonFinal.totalExperiencias} experiencias procesadas`);
    console.log(`⚠️ ${erroresConteo} errores de conteo encontrados`);
    
    if (erroresConteo === 0) {
      console.log('\n🎉 ¡TODOS LOS CONTEOS COINCIDEN PERFECTAMENTE!');
    }
    
    return jsonFinal;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

extraerTodasLasExperiencias();