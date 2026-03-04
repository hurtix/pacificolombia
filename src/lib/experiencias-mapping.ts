import { getCustomPosts } from './wordpress.ts';

// Function to extract experience number from title (EXP-XXX)
const getExperienceNumber = (title: string): number | null => {
  const match = title.match(/EXP-(\d+)/i);
  return match ? parseInt(match[1]) : null;
};

/**
 * Fetches and sorts all experiencias, creating a mapping between EXP numbers and WordPress IDs
 * @returns Sorted experiencias array and mapping object
 */
export async function getExperienciasMapping() {
  try {
    const experiencias = await getCustomPosts('experiencia', 100);
    
    // Sort experiencias by their EXP number
    const experienciasSorted = experiencias
      .map(exp => ({
        ...exp,
        expNumber: getExperienceNumber(exp.title?.rendered || '')
      }))
      .filter(exp => exp.expNumber !== null)
      .sort((a, b) => (a.expNumber || 0) - (b.expNumber || 0));

    // Create mapping object for easy lookup
    const experienciasMapping: Record<number, number> = {};
    experienciasSorted.forEach(exp => {
      if (exp.expNumber) {
        experienciasMapping[exp.expNumber] = exp.id;
      }
    });

    return {
      experienciasSorted,
      experienciasMapping,
      getExperienciaId: (expNumber: number) => experienciasMapping[expNumber]
    };
  } catch (error) {
    console.log('Error fetching experiencias mapping:', error);
    return {
      experienciasSorted: [],
      experienciasMapping: {},
      getExperienciaId: () => null
    };
  }
}

/**
 * Get WordPress ID for a specific experience number
 * @param expNumber Experience number (1-100)
 * @returns WordPress ID or null if not found
 */
export async function getIdByExpNumber(expNumber: number): Promise<number | null> {
  const { getExperienciaId } = await getExperienciasMapping();
  return getExperienciaId(expNumber);
}