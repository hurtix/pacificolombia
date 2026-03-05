// WordPress Data - Usando JSON definitivo ÚNICAMENTE

// Importar los datos definitivos
import experienciasData from '../data/experiencias.json';

/**
 * Obtiene experiencias desde JSON definitivo - SIN conexiones externas
 * @param postType Tipo de post (solo 'experiencia' soportado)
 * @param limit Límite de resultados
 * @returns Promise<any[]>
 */
export async function getCustomPosts(postType: string, limit: number = 10): Promise<any[]> {
  if (postType !== 'experiencia') {
    console.log(`❌ PostType '${postType}' no soportado`);
    return [];
  }
  
  console.log(`✅ Usando datos definitivos (${experienciasData.experiencias.length} experiencias)`);
  
  // Transformar al formato que espera Astro
  const experienciasFormateadas = experienciasData.experiencias.slice(0, limit).map(exp => ({
    id: exp.id,
    title: { rendered: exp.title },
    excerpt: { rendered: `<p>${exp.excerpt}</p>` },
    content: { rendered: exp.content },
    acf: {
      municipio: exp.municipio,
      departamento: exp.departamento,
      tipologia: exp.tipologia,
      estado: exp.estado
    },
    expNumber: exp.expNumber,
    date: exp.fecha
  }));
  
  return experienciasFormateadas;
}

/**
 * Obtiene taxonomías - Datos ya resueltos en JSON
 * @param taxonomy Nombre de taxonomía  
 * @param limit Límite
 * @returns Promise<any[]>
 */
export async function getTaxonomyTerms(taxonomy: string, limit: number = 100): Promise<any[]> {
  console.log(`ℹ️ Taxonomías ya resueltas en datos definitivos`);
  return [];
}

/**
 * Resuelve términos de taxonomía - Ya resueltos en JSON
 * @param acfData Datos ACF
 * @returns Promise<any>
 */
export async function resolveTaxonomyTerms(acfData: any): Promise<any> {
  // Los datos ya están resueltos en el JSON definitivo
  console.log(`ℹ️ Taxonomías ya resueltas`);
  return {
    municipio: acfData?.municipio || 'Pacífico',
    departamento: acfData?.departamento || 'Colombiano', 
    tipologia: acfData?.tipologia || 'Cultural',
    estado: acfData?.estado !== undefined ? acfData.estado : true
  };
}