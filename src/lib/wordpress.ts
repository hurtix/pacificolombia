// WordPress API configuration
const WORDPRESS_URL = 'http://pacificolombia.local/'; // URL de tu instalación Local by Flywheel
const WP_API_BASE = `${WORDPRESS_URL}/wp-json/wp/v2`;

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
  try {
    const response = await fetch(`${WP_API_BASE}/${postType}?_embed&per_page=${limit}`);
    if (!response.ok) {
      console.error(`Error fetching ${postType}:`, response.statusText);
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error(`Error connecting to WordPress for ${postType}:`, error);
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