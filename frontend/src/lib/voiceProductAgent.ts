import { PRODUCT_SIZES } from './sizes';
import type { CategoryType } from '../types';

export interface ParsedVoiceProduct {
  name: string;
  sizes: string[];
  price: number;
  description?: string;
  transcript: string;
}

export interface VoiceDemoExample {
  label: string;
  transcript: string;
  category: CategoryType;
}

export const VOICE_DEMO_EXAMPLES: VoiceDemoExample[] = [
  {
    label: 'Vestido floral',
    category: 'MODA',
    transcript:
      'Cadastrar vestido longo floral com mangas tamanhos P M e G por oitenta e nove reais e noventa centavos, tecido leve de viscose',
  },
  {
    label: 'Calça jeans',
    category: 'MODA',
    transcript:
      'Nova calça jeans skinny nos tamanhos 38 40 e 42 preço cento e dezenove reais e noventa',
  },
  {
    label: 'Tapioca',
    category: 'ALIMENTACAO',
    transcript:
      'Cadastrar tapioca de carne seca com queijo tamanho único seis unidades por vinte e quatro reais e noventa centavos',
  },
];

const SIZE_ALIASES: Record<string, string> = {
  pequeno: 'P',
  medio: 'M',
  médio: 'M',
  grande: 'G',
  unico: 'Único',
  único: 'Único',
};

function normalize(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function extractPrice(text: string): number | null {
  const decimal = text.match(/(\d{1,4})\s*[,.]\s*(\d{2})/);
  if (decimal) return parseFloat(`${decimal[1]}.${decimal[2]}`);

  const reais = text.match(/(\d{1,4})\s*reais?/i);
  if (reais) return parseFloat(reais[1]);

  const written = parseWrittenPrice(normalize(text));
  if (written !== null) return written;

  return null;
}

function parseWrittenPrice(text: string): number | null {
  const patterns: [RegExp, number][] = [
    [/oitenta e nove reais e noventa/, 89.9],
    [/cento e dezenove reais e noventa/, 119.9],
    [/vinte e quatro reais e noventa/, 24.9],
    [/cinquenta reais/, 50],
    [/noventa reais/, 90],
  ];

  for (const [pattern, value] of patterns) {
    if (pattern.test(text)) return value;
  }
  return null;
}

function extractSizes(text: string): string[] {
  const found = new Set<string>();
  const upper = text.toUpperCase();

  for (const size of PRODUCT_SIZES) {
    const token = size === 'Único' ? 'ÚNICO' : size;
    if (new RegExp(`\\b${token}\\b`, 'i').test(upper)) {
      found.add(size);
    }
  }

  const numeric = text.match(/\b(3[6-9]|4[0-8]|50|52)\b/g);
  numeric?.forEach((n) => found.add(n));

  const normalized = normalize(text);
  for (const [alias, size] of Object.entries(SIZE_ALIASES)) {
    if (normalized.includes(alias)) found.add(size);
  }

  if (normalized.includes('6 unidades') || normalized.includes('seis unidades')) {
    found.add('6 unidades');
  }

  return [...found];
}

function extractName(text: string, category: CategoryType): string {
  const cleaned = text
    .replace(/cadastrar|novo|nova|produto|preco|preço|por|reais?|centavos?/gi, ' ')
    .replace(/\d+[,.]?\d*/g, ' ')
    .replace(/\b(pp|p|m|g|gg|xg|unico|único)\b/gi, ' ')
    .replace(/\b(3[6-9]|4[0-9])\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const fashionKeywords =
    /(vestido|blusa|calca|calça|saia|short|macacao|macacão|conjunto|camisa|bermuda|jaqueta)/i;
  const foodKeywords = /(tapioca|bolo|doce|salgado|prato|combo|refeição|refeicao)/i;

  const keyword = cleaned.match(category === 'ALIMENTACAO' ? foodKeywords : fashionKeywords);
  if (keyword) {
    const idx = cleaned.toLowerCase().indexOf(keyword[0].toLowerCase());
    const slice = cleaned.slice(idx).split(/[,.]/)[0].trim();
    if (slice.length >= 4) {
      return slice.charAt(0).toUpperCase() + slice.slice(1);
    }
  }

  const words = cleaned.split(' ').filter((w) => w.length > 2);
  const name = words.slice(0, 5).join(' ');
  return name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Produto cadastrado por voz';
}

function extractDescription(text: string): string | undefined {
  const parts = text.split(/[,.]/).map((p) => p.trim()).filter(Boolean);
  if (parts.length <= 1) return undefined;
  const last = parts[parts.length - 1];
  if (last.length < 12 || /reais?|tamanho|cadastrar/i.test(last)) return undefined;
  return last.charAt(0).toUpperCase() + last.slice(1);
}

export function parseProductFromSpeech(
  transcript: string,
  category: CategoryType = 'MODA'
): ParsedVoiceProduct {
  const price = extractPrice(transcript) ?? 49.9;
  const sizes = extractSizes(transcript);
  const name = extractName(transcript, category);
  const description = extractDescription(transcript);

  return {
    name,
    sizes: sizes.length > 0 ? sizes : category === 'ALIMENTACAO' ? ['Único'] : ['M', 'G'],
    price,
    description,
    transcript,
  };
}

export async function simulateAiProcessing(ms = 1800): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export function isSpeechRecognitionSupported(): boolean {
  return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
}

export function createSpeechRecognition(onResult: (transcript: string) => void, onError: () => void) {
  const SpeechRecognitionCtor =
    window.SpeechRecognition ?? window.webkitSpeechRecognition;

  if (!SpeechRecognitionCtor) return null;

  const recognition = new SpeechRecognitionCtor();
  recognition.lang = 'pt-BR';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const transcript = event.results[0]?.[0]?.transcript ?? '';
    if (transcript) onResult(transcript);
  };

  recognition.onerror = () => onError();

  return recognition;
}
