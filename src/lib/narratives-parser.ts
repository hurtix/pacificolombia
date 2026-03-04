/**
 * Parser for individual experience narratives from markdown file
 */
import fs from 'fs';
import path from 'path';

export interface ExperienceNarrative {
  expNumber: number;
  title: string;
  subtitle: string;
  content: string;
  contentEn?: string; // English content (available but unused for now)
}

/**
 * Parse the narrativas-individuales.md file and extract individual experiences
 * @param markdownContent Raw content of the markdown file
 * @returns Array of parsed experience narratives
 */
export function parseNarratives(markdownContent: string): ExperienceNarrative[] {
  const narratives: ExperienceNarrative[] = [];
  
  // Use regex to find all EXP sections with their complete content
  const expRegex = /\*\*EXP (\d+) - (.+?) - (.+?)\*\*([\s\S]*?)(?=\*\*EXP \d+|$)/g;
  let match;
  
  while ((match = expRegex.exec(markdownContent)) !== null) {
    try {
      const expNumber = parseInt(match[1]);
      const title = match[2].trim();
      const subtitle = match[3].trim();
      const fullContent = match[4].trim();
      
      // Split Spanish and English content by "EN." marker
      const enIndex = fullContent.indexOf('\nEN.\n');
      
      let content = '';
      let contentEn = '';
      
      if (enIndex !== -1) {
        // Spanish content is everything before "EN."
        content = fullContent.substring(0, enIndex).trim();
        // English content is everything after "EN."
        contentEn = fullContent.substring(enIndex + 4).trim();
      } else {
        // If no English section found, all content is Spanish
        content = fullContent.trim();
      }
      
      // Clean up content - remove excessive newlines and format properly
      content = content
        .replace(/\n{3,}/g, '\n\n') // Max 2 consecutive newlines
        .replace(/^\n+|\n+$/g, '')  // Remove leading/trailing newlines
        .trim();
      
      if (contentEn) {
        contentEn = contentEn
          .replace(/\n{3,}/g, '\n\n')
          .replace(/^\n+|\n+$/g, '')
          .trim();
      }
      
      narratives.push({
        expNumber,
        title,
        subtitle,
        content,
        contentEn: contentEn || undefined
      });
      
      console.log(`Parsed EXP-${expNumber.toString().padStart(3, '0')}: "${title}" (Spanish: ${content.length} chars, English: ${contentEn.length} chars)`);
      
    } catch (error) {
      console.error(`Error parsing EXP ${match[1]}:`, error);
    }
  }
  
  return narratives.sort((a, b) => a.expNumber - b.expNumber);
}

/**
 * Get narrative for a specific experience number
 * @param narratives Array of parsed narratives
 * @param expNumber Experience number (1-100)
 * @returns Experience narrative or null if not found
 */
export function getNarrativeByExpNumber(narratives: ExperienceNarrative[], expNumber: number): ExperienceNarrative | null {
  return narratives.find(n => n.expNumber === expNumber) || null;
}

/**
 * Load and parse narratives from the markdown file
 * This works in Astro by fetching from the public directory
 * @returns Promise<ExperienceNarrative[]>
 */
export async function loadNarratives(): Promise<ExperienceNarrative[]> {
  try {
    console.log('=== Loading narratives from file system ===');
    
    // Read from src/content directory (proper location for Astro content)
    const filePath = path.join(process.cwd(), 'src', 'content', 'narrativas-individuales.md');
    console.log('Reading from path:', filePath);
    
    if (!fs.existsSync(filePath)) {
      console.error('File not found:', filePath);
      return [];
    }
    
    const markdownContent = fs.readFileSync(filePath, 'utf-8');
    console.log('Markdown content loaded, length:', markdownContent.length);
    console.log('First 200 chars:', markdownContent.substring(0, 200));
    
    const parsed = parseNarratives(markdownContent);
    console.log('Parsed narratives count:', parsed.length);
    
    if (parsed.length > 0) {
      console.log('First narrative:', {
        expNumber: parsed[0].expNumber,
        title: parsed[0].title,
        contentLength: parsed[0].content.length
      });
    }
    
    return parsed;
  } catch (error) {
    console.error('Error loading narratives:', error);
    return [];
  }
}

/**
 * Load general narrative content
 * @returns Promise<string>
 */
export async function loadGeneralNarrative(): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), 'src', 'content', 'narrativa-general.md');
    
    if (!fs.existsSync(filePath)) {
      console.error('General narrative file not found:', filePath);
      return '';
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    // Clean up the markdown formatting
    return content.replace(/\*\*/g, '').trim();
  } catch (error) {
    console.error('Error loading general narrative:', error);
    return '';
  }
}

/**
 * Get image path for an experience number
 * @param expNumber Experience number (1-100)
 * @returns Path to the experience image
 */
export function getExperienceImagePath(expNumber: number): string {
  const paddedNumber = expNumber.toString().padStart(3, '0');
  return `/images/experiencias/${paddedNumber}.webp`;
}