/**
 * Extracts the brand name from a trading card set name
 * @param setName - The full name of the trading card set
 * @returns The brand name (e.g., "Panini Prizm", "Donruss Optic")
 */
export function getBrand(setName: string): string {
  // Common brand patterns in trading card sets
  const brandPatterns = [
    // Panini brands
    /^(Panini\s+(?:NBA\s+)?Hoops)/i,
    /^(Panini\s+Prizm)/i,
    /^(Panini\s+Select)/i,
    /^(Panini\s+Contenders)/i,
    /^(Panini\s+Chronicles)/i,
    /^(Panini\s+Mosaic)/i,
    /^(Panini\s+Immaculate)/i,
    /^(Panini\s+National\s+Treasures)/i,
    /^(Panini\s+Flawless)/i,
    
    // Topps brands
    /^(Topps\s+Chrome)/i,
    /^(Topps\s+Stadium\s+Club)/i,
    /^(Topps\s+Finest)/i,
    /^(Topps\s+Heritage)/i,
    /^(Topps\s+Bowman)/i,
    /^(Topps)/i,
    
    // Donruss brands
    /^(Donruss\s+Optic)/i,
    /^(Donruss\s+Elite)/i,
    /^(Donruss\s+Rated\s+Rookies)/i,
    /^(Donruss)/i,
    
    // Upper Deck brands
    /^(Upper\s+Deck\s+SP\s+Authentic)/i,
    /^(Upper\s+Deck\s+Artifacts)/i,
    /^(Upper\s+Deck\s+Black\s+Diamond)/i,
    /^(Upper\s+Deck)/i,
    
    // Leaf brands
    /^(Leaf\s+Metal)/i,
    /^(Leaf\s+Trinity)/i,
    /^(Leaf)/i,
    
    // Score brands
    /^(Score)/i,
    
    // Bowman brands (standalone)
    /^(Bowman\s+Chrome)/i,
    /^(Bowman\s+Sterling)/i,
    /^(Bowman)/i,
  ];

  // Try to match against known brand patterns
  for (const pattern of brandPatterns) {
    const match = setName.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  // If no pattern matches, try to extract the first few words as brand
  // This handles cases like "Fleer Ultra" or other brands not in our patterns
  const words = setName.split(/\s+/);
  
  // If it starts with a year pattern, skip it
  if (words[0] && /^\d{4}(-\d{2})?$/.test(words[0])) {
    words.shift();
  }
  
  // Take first 1-3 words as potential brand name
  if (words.length >= 2) {
    // Check if second word looks like a sub-brand or common card terms
    const secondWord = words[1].toLowerCase();
    if (['chrome', 'optic', 'prizm', 'select', 'hoops', 'mosaic', 'contenders', 'ultra', 'finest', 'heritage'].includes(secondWord)) {
      return `${words[0]} ${words[1]}`;
    }
    
    // For other cases, check if it's likely a two-word brand
    // Skip common non-brand words
    const nonBrandWords = ['basketball', 'football', 'baseball', 'hockey', 'cards', 'trading', 'collection'];
    if (!nonBrandWords.includes(secondWord)) {
      return `${words[0]} ${words[1]}`;
    }
  }
  
  // Default to first word
  return words[0] || setName;
}

/**
 * Normalizes brand name for consistent grouping
 * @param brand - The brand name to normalize
 * @returns Normalized brand name
 */
export function normalizeBrand(brand: string): string {
  return brand
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
