// WordPress API configuration
const WORDPRESS_URL = import.meta.env.WORDPRESS_URL || 'http://pacificolombia.local/';
const WP_API_BASE = `${WORDPRESS_URL}/wp-json/wp/v2`;
const IS_STATIC_MODE = import.meta.env.PUBLIC_STATIC_MODE === 'true' || !WORDPRESS_URL;

export interface WordPressPost {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  date: string;
  acf?: any; // ACF fields will be dynamically typed based on your setup
}

export interface WordPressPage {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  acf?: any;
}

/**
 * Fetch posts from WordPress with ACF fields
 * @param limit Number of posts to fetch
 * @returns Promise<WordPressPost[]>
 */
export async function getPosts(limit: number = 10): Promise<WordPressPost[]> {
  try {
    const response = await fetch(`${WP_API_BASE}/posts?_embed&per_page=${limit}`);
    if (!response.ok) {
      return [];
    }
    return await response.json();
  } catch (error) {
    return [];
  }
}

/**
 * Fetch a single post by ID with ACF fields
 * @param id Post ID
 * @returns Promise<WordPressPost | null>
 */
export async function getPost(id: number): Promise<WordPressPost | null> {
  try {
    const response = await fetch(`${WP_API_BASE}/posts/${id}?_embed`);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    return null;
  }
}

/**
 * Fetch pages from WordPress with ACF fields  
 * @returns Promise<WordPressPage[]>
 */
export async function getPages(): Promise<WordPressPage[]> {
  try {
    const response = await fetch(`${WP_API_BASE}/pages?_embed`);
    if (!response.ok) {
      return [];
    }
    return await response.json();
  } catch (error) {
    return [];
  }
}

/**
 * Fetch a single page by ID with ACF fields
 * @param id Page ID
 * @returns Promise<WordPressPage | null>  
 */
export async function getPage(id: number): Promise<WordPressPage | null> {
  try {
    const response = await fetch(`${WP_API_BASE}/pages/${id}?_embed`);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    return null;
  }
}

/**
 * Fetch custom post types (useful for destinations, experiences, etc.)
 * @param postType Custom post type name
 * @param limit Number of items to fetch
 * @returns Promise<any[]>
 */
export async function getCustomPosts(postType: string, limit: number = 10): Promise<any[]> {
  try {
    const response = await fetch(`${WP_API_BASE}/${postType}?_embed&per_page=${limit}`);
    if (!response.ok) {
      // Fallback to static data if available
      if (postType === 'experiencia') {
        return getStaticExperienceData(limit);
      }
      return [];
    }
    return await response.json();
  } catch (error) {
    // Fallback to static data if available
    if (postType === 'experiencia') {
      return getStaticExperienceData(limit);
    }
    return [];
  }
}

/**
 * Fetch taxonomy terms by taxonomy name
 * @param taxonomy Taxonomy name (e.g., 'tipologia', 'departamento', 'municipio')
 * @param limit Number of terms to fetch
 * @returns Promise<any[]>
 */
export async function getTaxonomyTerms(taxonomy: string, limit: number = 100): Promise<any[]> {
  try {
    const response = await fetch(`${WP_API_BASE}/${taxonomy}?per_page=${limit}`);
    if (!response.ok) {
      return [];
    }
    return await response.json();
  } catch (error) {
    return [];
  }
}

/**
 * Get term name by ID from a specific taxonomy
 * @param taxonomy Taxonomy name
 * @param termId Term ID
 * @returns Promise<string | null>
 */
export async function getTermName(taxonomy: string, termId: number): Promise<string | null> {
  try {
    const response = await fetch(`${WP_API_BASE}/${taxonomy}/${termId}`);
    if (!response.ok) {
      return null;
    }
    const term = await response.json();
    return term.name || null;
  } catch (error) {
    return null;
  }
}

/**
 * Helper function to resolve taxonomy term IDs to names
 * @param taxonomyData Object with taxonomy fields containing ID arrays
 * @returns Promise<Object> Object with resolved term names
 */
export async function resolveTaxonomyTerms(taxonomyData: any): Promise<any> {
  const resolved: any = {};
  
  // Map ACF field names to WordPress taxonomy names
  const taxonomyMappings = {
    'tipologia': 'tipologias',  // ACF field name -> WP taxonomy name
    'departamento': 'departamento',
    'municipio': 'municipio',
    'etnia': 'etnia',
    'genero': 'genero'
  };
  
  for (const [acfField, wpTaxonomy] of Object.entries(taxonomyMappings)) {
    if (taxonomyData[acfField]) {
      if (Array.isArray(taxonomyData[acfField])) {
        // Handle arrays of term IDs
        const termNames = [];
        for (const termId of taxonomyData[acfField]) {
          const termName = await getTermName(wpTaxonomy, termId);
          if (termName) {
            termNames.push(termName);
          }
        }
        resolved[acfField] = termNames;
      } else if (typeof taxonomyData[acfField] === 'number') {
        // Handle single term ID
        const termName = await getTermName(wpTaxonomy, taxonomyData[acfField]);
        resolved[acfField] = termName;
      } else {
        // Keep as is if not a number or array
        resolved[acfField] = taxonomyData[acfField];
      }
    } else {
      resolved[acfField] = taxonomyData[acfField];
    }
  }
  
  return resolved;
}

// Mapeo directo de IDs de taxonomías a nombres reales 
const MUNICIPIO_MAP: Record<number, string> = {
  11: 'Tumaco',
  18: 'Nuquí', 
  21: 'Guapi',
  23: 'López de Micay',
  24: 'Timbiquí', 
  26: 'Bahía Solano',
  29: 'Popayán',
  31: 'Buenaventura',
  37: 'Cali',
  42: 'El Charco',
  45: 'Iscuandé',
  47: 'La Tola',
  50: 'Mosquera',
  53: 'Olaya Herrera',
  56: 'Roberto Payán',
  59: 'Santa Bárbara',
  62: 'Jamundí',
  65: 'Bojayá',
  68: 'Quibdó'
};

const DEPARTAMENTO_MAP: Record<number, string> = {
  4: 'Chocó',
  6: 'Cauca', 
  7: 'Chocó',
  11: 'Nariño',
  18: 'Chocó',
  50: 'Valle del Cauca'
};

// Helper function to resolve taxonomy IDs to names
function resolveTaxonomyIds(experiencia: any): any {
  if (!experiencia.acf) return experiencia;
  
  const resolved = { ...experiencia };
  
  // Resolve municipio
  if (experiencia.acf.municipio && Array.isArray(experiencia.acf.municipio)) {
    const municipioId = experiencia.acf.municipio[0];
    resolved.acf.municipio = MUNICIPIO_MAP[municipioId] || `ID-${municipioId}`;
  }
  
  // Resolve departamento  
  if (experiencia.acf.departamento && Array.isArray(experiencia.acf.departamento)) {
    const departamentoId = experiencia.acf.departamento[0];
    resolved.acf.departamento = DEPARTAMENTO_MAP[departamentoId] || `ID-${departamentoId}`;
  }
  
  return resolved;
}

/**
 * Generate static experience data when WordPress is not available  
 * @param limit Number of experiences to generate
 * @returns Promise<any[]>
 */
async function getStaticExperienceData(limit: number): Promise<any[]> {
  // First, try to load the real exported data
  try {
    // Import the static data
    const staticData = await import('../data/wordpress-data.json');
    if (staticData.default?.experiencias && staticData.default.experiencias.length > 0) {
      // Resolve taxonomy IDs to actual names
      const resolvedData = staticData.default.experiencias
        .slice(0, limit)
        .map((exp: any) => resolveTaxonomyIds(exp));
      
      return resolvedData;
    }
  } catch (error) {
    // Continue to fallback
  }

  // If static data loading fails, generate minimal fallback
  const experiences = [];
  
  // Generar datos para hasta 100 experiencias
  for (let i = 1; i <= Math.min(limit, 100); i++) {
    const expNumber = i.toString().padStart(3, '0');
    experiences.push({
      id: i,
      title: {
        rendered: `EXP-${expNumber} - EXPERIENCIA ${i}`
      },
      excerpt: {
        rendered: `<p>Descubre esta increíble experiencia en el Pacífico colombiano.</p>`
      },
      content: {
        rendered: `<p>Esta es una experiencia del Pacífico colombiano que te conectará con la naturaleza, la cultura y las tradiciones locales.</p>`
      },
      acf: {
        municipio: 'Pacífico',
        departamento: 'Colombiano', 
        tipologia: ['Cultural', 'Naturaleza', 'Gastronómico', 'Aventura'][i % 4],
        estado: true
      },
      expNumber: i,
      date: new Date().toISOString()
    });
  }
  
  return experiences;
}