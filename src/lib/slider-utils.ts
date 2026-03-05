// Utilidades específicas para el slider
import { getExperienciasMapping } from './experiencias-mapping';
import { getExperienceImagePath, loadNarratives } from './narratives-parser';
import { resolveTaxonomyTerms } from './wordpress';

// Función para decodificar entidades HTML
function decodeHtmlEntities(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&#8211;': '–', // em dash
    '&#8212;': '—', // en dash
    '&#8220;': '"', // left double quote
    '&#8221;': '"', // right double quote
    '&#038;': '&',  // ampersand
    '&amp;': '&',   // ampersand
    '&lt;': '<',    // less than
    '&gt;': '>',    // greater than
    '&quot;': '"',  // quote
    '&nbsp;': ' ',  // non-breaking space
  };
  
  let decoded = text;
  for (const [entity, char] of Object.entries(htmlEntities)) {
    decoded = decoded.replace(new RegExp(entity, 'g'), char);
  }
  return decoded;
}

// Función para limpiar HTML tags y extraer solo texto
function stripHtmlTags(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '') // Remover todos los HTML tags
    .replace(/\s+/g, ' ')    // Normalizar espacios en blanco
    .trim();                 // Remover espacios al inicio y final
}

// Función para limpiar y procesar texto completamente
export function cleanText(text: string): string {
  if (!text) return '';
  const decoded = decodeHtmlEntities(String(text));
  const stripped = stripHtmlTags(decoded);
  return stripped;
}

// Función para randomizar array
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Tipo para datos del slider
export interface SliderExperience {
  place: string;
  title: string;
  title2: string;
  description: string;
  image: string;
  expNumber: string;
  wpId: number;
}

// Función principal para procesar experiencias para el slider
export async function processExperiencesForSlider(count: number = 40): Promise<SliderExperience[]> {
  const { experienciasSorted } = await getExperienciasMapping();
  const narratives = await loadNarratives();

  // Solo usar las primeras experiencias que SÍ tienen imágenes disponibles
  const experiencesForRandom = experienciasSorted.slice(0, count);

  const sliderData = await Promise.all(
    experiencesForRandom.map(async (exp, index) => {
      const resolvedTaxonomy = exp.acf ? await resolveTaxonomyTerms(exp.acf) : {};
      const narrative = narratives.find(n => n.expNumber === exp.expNumber);
      
      // Formar la ubicación con validación robusta
      const municipio = cleanText(resolvedTaxonomy.municipio?.[0] || '');
      const departamento = cleanText(resolvedTaxonomy.departamento?.[0] || '');
      
      // Si la taxonomía no se resolvió correctamente, usar fallback
      let location = 'Pacífico Colombiano'; // Fallback por defecto
      if (municipio && departamento && municipio !== 'N' && departamento !== 'N' && municipio.length > 1 && departamento.length > 1) {
        location = `${municipio}, ${departamento}`;
      }
      
      // Usar narrative.title primero, luego title.rendered
      const rawMainTitle = narrative?.title || exp.title?.rendered || 'EXPERIENCIA';
      const rawSubTitle = narrative?.subtitle || municipio || 'PACÍFICO';
      
      // Limpiar completamente títulos y descripciones
      const mainTitle = cleanText(rawMainTitle);
      const subTitle = cleanText(rawSubTitle);
      const description = cleanText(exp.excerpt?.rendered || 'Descubre esta increíble experiencia en el Pacífico colombiano.');
      
      return {
        place: location,
        title: mainTitle.toUpperCase(),
        title2: subTitle.toUpperCase(),
        description: description,
        image: getExperienceImagePath(exp.expNumber || index + 1),
        expNumber: String(exp.expNumber || index + 1).padStart(3, '0'),
        wpId: exp.id
      };
    })
  );

  return sliderData;
}

// Función para generar datos randomizados del slider
export async function getRandomizedSliderData(totalCount: number = 40, finalCount: number = 6): Promise<SliderExperience[]> {
  const allExperiences = await processExperiencesForSlider(totalCount);
  return shuffleArray(allExperiences).slice(0, finalCount);
}