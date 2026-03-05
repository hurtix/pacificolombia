// WordPress API configuration
const WORDPRESS_URL = import.meta.env.WORDPRESS_URL || 'http://pacificolombia.local/';
const WP_API_BASE = `${WORDPRESS_URL}/wp-json/wp/v2`;
const IS_STATIC_MODE = import.meta.env.PUBLIC_STATIC_MODE === 'true' || !WORDPRESS_URL;

console.log('WordPress config:', { WORDPRESS_URL, IS_STATIC_MODE });

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
      console.error('Error fetching posts:', response.statusText);
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error('Error connecting to WordPress:', error);
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
    console.error('Error fetching post:', error);
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
      console.error('Error fetching pages:', response.statusText);
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error('Error connecting to WordPress:', error);
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
    console.error('Error fetching page:', error);
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
  // First priority: Try to load static exported data
  if (postType === 'experiencia') {
    try {
      const staticDataPath = new URL('../../data/wordpress-data.json', import.meta.url);
      const staticDataResponse = await fetch(staticDataPath);
      if (staticDataResponse.ok) {
        const staticData = await staticDataResponse.json();
        if (staticData.experiencias && staticData.experiencias.length > 0) {
          console.log(`✅ Using static WordPress data (${staticData.experiencias.length} experiencias)`);
          return staticData.experiencias.slice(0, limit);
        }
      }
    } catch (error) {
      console.log('ℹ️ Static data not available, trying WordPress API...');
    }
  }

  // Second priority: Try WordPress API (when local development)
  if (!IS_STATIC_MODE) {
    try {
      const response = await fetch(`${WP_API_BASE}/${postType}?_embed&per_page=${limit}`);
      if (response.ok) {
        const posts = await response.json();
        console.log(`✅ Using WordPress API data (${posts.length} ${postType}s)`);
        return posts;
      }
    } catch (error) {
      console.log(`⚠️ WordPress API not available for ${postType}:`, error.message);
    }
  }

  // Last resort: Empty array (no fake data)
  console.log(`❌ No data available for ${postType}, returning empty array`);
  return [];
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
      console.error(`Error fetching taxonomy ${taxonomy}:`, response.statusText);
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error(`Error connecting to WordPress for taxonomy ${taxonomy}:`, error);
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
    console.error(`Error fetching term ${termId} from ${taxonomy}:`, error);
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

/**
 * DEPRECATED: Generate static experience data when WordPress is not available
 * This function is no longer used - we now use exported real data from wordpress-data.json
 * @param limit Number of experiences to generate
 * @returns Promise<any[]>
 */
/*
async function getStaticExperienceData(limit: number): Promise<any[]> {
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
*/