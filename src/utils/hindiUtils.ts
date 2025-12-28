/**
 * Hindi text processing utilities
 * Handles Unicode normalization and Hindi-specific text operations
 */

/**
 * Normalize Hindi text using Unicode NFC normalization
 * This ensures consistent representation of combining characters (matras, etc.)
 * @param text - Hindi text to normalize
 * @returns Normalized text
 */
export function normalizeHindiText(text: string): string {
  return text.normalize('NFC');
}

/**
 * Compare two Hindi characters correctly (handles combining characters)
 * @param char1 - First character
 * @param char2 - Second character
 * @returns True if characters are equivalent
 */
export function compareHindiChars(char1: string, char2: string): boolean {
  return normalizeHindiText(char1) === normalizeHindiText(char2);
}

/**
 * Check if a character is a Devanagari character
 * @param char - Character to check
 * @returns True if character is in Devanagari Unicode range
 */
export function isDevanagariCharacter(char: string): boolean {
  if (!char || char.length === 0) return false;
  const code = char.charCodeAt(0);
  // Devanagari Unicode range: U+0900 to U+097F
  // Devanagari Extended: U+A8E0 to U+A8FF
  return (code >= 0x0900 && code <= 0x097F) || (code >= 0xA8E0 && code <= 0xA8FF);
}

/**
 * Check if a character is a matra (vowel sign)
 * @param char - Character to check
 * @returns True if character is a matra
 */
export function isMatra(char: string): boolean {
  if (!char || char.length === 0) return false;
  const code = char.charCodeAt(0);
  // Matra range: U+093E to U+094C, plus nukta (U+093C) and other signs
  return (
    (code >= 0x093E && code <= 0x094C) ||
    code === 0x093C || // Nukta
    code === 0x0901 || // Chandrabindu
    code === 0x0902 || // Anusvara
    code === 0x0903    // Visarga
  );
}

/**
 * Check if a character is a consonant
 * @param char - Character to check
 * @returns True if character is a consonant
 */
export function isConsonant(char: string): boolean {
  if (!char || char.length === 0) return false;
  const code = char.charCodeAt(0);
  // Consonant range: U+0915 to U+0939
  return code >= 0x0915 && code <= 0x0939;
}

/**
 * Check if a character is a vowel
 * @param char - Character to check
 * @returns True if character is a vowel
 */
export function isVowel(char: string): boolean {
  if (!char || char.length === 0) return false;
  const code = char.charCodeAt(0);
  // Vowel range: U+0905 to U+0914
  return code >= 0x0905 && code <= 0x0914;
}

/**
 * Check if a character is the halant (virama)
 * The halant is used to create half-characters and conjuncts
 * @param char - Character to check
 * @returns True if character is halant
 */
export function isHalant(char: string): boolean {
  return char === '\u094D'; // Devanagari Halant
}

/**
 * Split Hindi text into grapheme clusters (user-perceived characters)
 * This correctly handles conjuncts and combining characters
 * @param text - Hindi text to split
 * @returns Array of grapheme clusters
 */
export function splitIntoGraphemes(text: string): string[] {
  // Use Intl.Segmenter for proper grapheme segmentation
  // @ts-ignore - Intl.Segmenter is not in all TypeScript versions
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    // @ts-ignore
    const segmenter = new Intl.Segmenter('hi', { granularity: 'grapheme' });
    const segments = segmenter.segment(text);
    // @ts-ignore
    return Array.from(segments, s => s.segment);
  }

  // Fallback: simple character split (may not handle all cases correctly)
  return Array.from(text);
}

/**
 * Count the number of user-perceived characters in Hindi text
 * (Accounts for conjuncts and combining characters)
 * @param text - Hindi text
 * @returns Number of grapheme clusters
 */
export function countGraphemes(text: string): number {
  return splitIntoGraphemes(text).length;
}

/**
 * Check if text contains only valid Hindi/Devanagari characters
 * (Allows spaces and basic punctuation)
 * @param text - Text to validate
 * @returns True if text is valid Hindi
 */
export function isValidHindiText(text: string): boolean {
  if (!text) return true; // Empty text is valid

  for (const char of text) {
    if (char === ' ') continue; // Allow spaces
    if (char === '।') continue; // Allow danda (Hindi full stop)
    if (char === '॰') continue; // Allow abbreviation sign
    if (!isDevanagariCharacter(char)) {
      return false;
    }
  }

  return true;
}

/**
 * Convert English digits to Devanagari digits
 * @param text - Text with English digits
 * @returns Text with Devanagari digits
 */
export function convertToDevanagariDigits(text: string): string {
  const digitMap: { [key: string]: string } = {
    '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
    '5': '५', '6': '६', '7': '७', '8': '८', '9': '९',
  };

  return text.replace(/[0-9]/g, digit => digitMap[digit] || digit);
}

/**
 * Convert Devanagari digits to English digits
 * @param text - Text with Devanagari digits
 * @returns Text with English digits
 */
export function convertToEnglishDigits(text: string): string {
  const digitMap: { [key: string]: string } = {
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
    '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
  };

  return text.replace(/[०-९]/g, digit => digitMap[digit] || digit);
}

/**
 * Remove all diacritics and matras from text (get base consonants only)
 * @param text - Hindi text
 * @returns Text with only base characters
 */
export function removeMatras(text: string): string {
  return text.replace(/[\u093E-\u094C\u093C\u0901-\u0903]/g, '');
}

/**
 * Get the base consonant from a character with matras
 * @param char - Character (possibly with matras)
 * @returns Base consonant
 */
export function getBaseConsonant(char: string): string {
  const normalized = normalizeHindiText(char);
  return removeMatras(normalized);
}
