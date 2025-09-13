import { GoogleGenerativeAI } from '@google/generative-ai';

export interface RefineRequest {
  raw: string;
  preset: 'concise' | 'developer' | 'teacher' | 'analyst' | 'product';
  maxWords: number;
}

export interface RefineResponse {
  refined: string;
}

// Initialize Gemini AI
let genAI: GoogleGenerativeAI | null = null;

function initializeGenAI() {
  if (!genAI && process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  }
  return genAI;
}

// Local refinement functions
export function normalize(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/([.!?])\s*([A-Z])/g, '$1 $2')
    .replace(/\n\s*\n/g, '\n\n');
}

export function structure(text: string): string {
  // Basic structuring - add clear sections if missing
  if (text.length > 100 && !text.includes('\n')) {
    // Try to break into logical parts
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    if (sentences.length > 2) {
      return sentences.map(s => s.trim()).join('.\n\n') + '.';
    }
  }
  return text;
}

export function enrich(text: string, preset: string): string {
  // Add context based on preset
  const presetContext = {
    concise: 'Be specific and direct.',
    developer: 'Include technical details and clear requirements.',
    teacher: 'Make it educational and step-by-step.',
    analyst: 'Focus on data-driven insights and analysis.',
    product: 'Consider user needs and business value.'
  };

  const context = presetContext[preset as keyof typeof presetContext] || '';
  return text + (context ? `\n\nContext: ${context}` : '');
}

export async function refinePrompt(request: RefineRequest): Promise<RefineResponse> {
  const { raw, preset, maxWords } = request;
  
  // First apply local refinement
  let refined = normalize(raw);
  refined = structure(refined);
  
  // Get model from env or default
  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const ai = initializeGenAI();
  
  if (!ai) {
    throw new Error('Google AI API key not configured');
  }

  try {
    const model = ai.getGenerativeModel({ model: modelName });

    // Create preset-specific instructions
    const presetInstructions = {
      concise: 'Make this prompt clear, direct, and concise. Remove unnecessary words.',
      developer: 'Structure this for technical/coding tasks. Include clear requirements and constraints.',
      teacher: 'Format this for educational purposes. Make it step-by-step and easy to understand.',
      analyst: 'Organize this for data analysis tasks. Focus on clarity and methodology.',
      product: 'Refine this for product management context. Consider user needs and business value.'
    };

    const systemPrompt = `You are a prompt refining assistant. Take the user's rough prompt and turn it into a clear, structured, effective prompt.

Instructions:
- ${presetInstructions[preset]}
- Keep it under ${maxWords} words
- Make it actionable and specific
- Return ONLY the refined prompt, no explanation or additional text
- Do not include code unless specifically requested
- Maintain the original intent and meaning

Original prompt: "${refined}"

Refined prompt:`;

    const result = await model.generateContent(systemPrompt);
    const response = result.response;
    const aiRefined = response.text().trim();

    // Remove quotes if AI added them
    // Group alternation explicitly to make operator precedence clear:
    const cleanedRefined = aiRefined.replace(/^(["'])|(["'])$/g, '');

    return { refined: cleanedRefined };
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // Fallback to local refinement if AI fails
    const fallbackRefined = enrich(refined, preset);
    
    // Truncate to maxWords if needed
    const words = fallbackRefined.split(/\s+/);
    if (words.length > maxWords) {
      return { refined: words.slice(0, maxWords).join(' ') + '...' };
    }
    
    return { refined: fallbackRefined };
  }
}