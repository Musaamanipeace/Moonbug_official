/**
 * Data Import and Grammar Check for Moonbug
 * Handles large data imports, grammar/spell checking, and AI organization
 */

// Grammar check using a simple dictionary-based approach
// For production, consider using a library like grammar-checker or integrating with an API
const commonMisspellings: Record<string, string> = {
  'teh': 'the',
  'recieve': 'receive',
  'occured': 'occurred',
  'seperate': 'separate',
  'definately': 'definitely',
  'occassion': 'occasion',
  'untill': 'until',
  'beleive': 'believe',
  'freind': 'friend',
  'existance': 'existence',
  'knowlege': 'knowledge',
  'sucessful': 'successful',
  'wierd': 'weird',
  'calender': 'calendar',
  'enviroment': 'environment',
};

export interface ImportResult {
  notes: Array<{
    content: string;
    type: 'note' | 'todo' | 'idea' | 'event' | 'reminder' | 'deadline';
    scopeId: string;
  }>;
  errors: string[];
  suggestions: string[];
}

export function checkGrammar(text: string): { corrected: string; suggestions: string[] } {
  let corrected = text;
  const suggestions: string[] = [];

  // Check for common misspellings
  Object.entries(commonMisspellings).forEach(([misspelled, correct]) => {
    const regex = new RegExp(`\\b${misspelled}\\b`, 'gi');
    if (regex.test(corrected)) {
      corrected = corrected.replace(regex, correct);
      suggestions.push(`Changed "${misspelled}" to "${correct}"`);
    }
  });

  // Check for double spaces
  if (corrected.includes('  ')) {
    corrected = corrected.replace(/  +/g, ' ');
    suggestions.push('Fixed double spaces');
  }

  // Check for missing capitalization at start of sentences
  const sentences = corrected.split('. ');
  const capitalizedSentences = sentences.map((s, i) => {
    if (i === 0) return s.charAt(0).toUpperCase() + s.slice(1);
    if (s.length > 0) return s.charAt(0).toUpperCase() + s.slice(1);
    return s;
  });
  corrected = capitalizedSentences.join('. ');

  return { corrected, suggestions };
}

export function parseImportData(text: string): ImportResult {
  const lines = text.split('\n').filter(line => line.trim());
  const notes: ImportResult['notes'] = [];
  const errors: string[] = [];
  const suggestions: string[] = [];

  let currentScope = 'general';
  let currentType: 'note' | 'todo' | 'idea' | 'event' | 'reminder' | 'deadline' = 'note';

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    // Check for scope markers
    if (trimmed.toLowerCase().startsWith('scope:')) {
      currentScope = trimmed.substring(6).trim();
      return;
    }
    
    // Check for type markers
    if (trimmed.toLowerCase().startsWith('type:')) {
      const type = trimmed.substring(5).trim().toLowerCase();
      if (['note', 'todo', 'idea', 'event', 'reminder', 'deadline'].includes(type)) {
        currentType = type as any;
      }
      return;
    }
    
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) return;
    
    // Check grammar
    const { corrected, suggestions: grammarSuggestions } = checkGrammar(trimmed);
    suggestions.push(...grammarSuggestions);
    
    notes.push({
      content: corrected,
      type: currentType,
      scopeId: currentScope,
    });
  });

  return { notes, errors, suggestions };
}

// AI-powered organization (placeholder for future integration)
export async function organizeNotesWithAI(notes: string[]): Promise<Record<string, string[]>> {
  // This would integrate with a local LLM or Genkit flow
  // For now, return a simple organization
  const organized: Record<string, string[]> = {
    ideas: [],
    tasks: [],
    events: [],
    general: [],
  };

  notes.forEach(note => {
    const lowerNote = note.toLowerCase();
    if (lowerNote.includes('idea') || lowerNote.includes('think') || lowerNote.includes('maybe')) {
      organized.ideas.push(note);
    } else if (lowerNote.includes('todo') || lowerNote.includes('need to') || lowerNote.includes('should')) {
      organized.tasks.push(note);
    } else if (lowerNote.includes('meeting') || lowerNote.includes('on') || lowerNote.includes('at')) {
      organized.events.push(note);
    } else {
      organized.general.push(note);
    }
  });

  return organized;
}

// File import handler
export async function handleFileImport(file: File): Promise<ImportResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        const result = parseImportData(text);
        resolve(result);
      } else {
        reject(new Error('Could not read file'));
      }
    };
    
    reader.onerror = () => reject(new Error('File read error'));
    reader.readAsText(file);
  });
}