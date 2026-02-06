/**
 * Hindi Input Composition Logic
 * Handles complex Devanagari typing rules including:
 * - Vowel + matra composition (अ + ा = आ)
 * - Half consonant + matra composition (म् + ा = मा)
 * - Pre-base vowel reordering (ि must be typed before consonant)
 */

const HALANT = '\u094D'; // ्
const CHOTI_I_MATRA = '\u093F'; // ि (pre-base vowel)
const AA_MATRA = '\u093E'; // ा
const E_MATRA = '\u0947'; // े
const O_MATRA = '\u094B'; // ो
const RA = '\u0930'; // र
const REPH = 'र्'; // र + halant (typed before consonant, appears on top)

// Vowel to vowel+matra mapping
const VOWEL_MATRA_MAP: { [key: string]: { [matra: string]: string } } = {
  'अ': {
    '\u093E': 'आ', // अ + ा = आ
    '\u093F': 'इ', // अ + ि = इ
    '\u0940': 'ई', // अ + ी = ई
    '\u0941': 'उ', // अ + ु = उ
    '\u0942': 'ऊ', // अ + ू = ऊ
    '\u0947': 'ए', // अ + े = ए
    '\u0948': 'ऐ', // अ + ै = ऐ
    '\u094B': 'ओ', // अ + ो = ओ
    '\u094C': 'औ', // अ + ौ = औ
  },
};

// Matra combination mapping (for non-AltGr layouts)
// When two matras are typed in sequence, they can combine into a different matra
const MATRA_COMBINATION_MAP: { [key: string]: { [secondMatra: string]: string } } = {
  '\u093E': { // ा (AA matra)
    '\u0947': '\u094B', // ा + े = ो (AA + E = O)
  },
};

/**
 * Check if a character is a vowel (स्वर)
 */
function isVowel(char: string): boolean {
  if (!char) return false;
  const code = char.charCodeAt(0);
  return code >= 0x0905 && code <= 0x0914; // अ to औ
}

/**
 * Check if a character is a consonant (व्यंजन)
 */
function isConsonant(char: string): boolean {
  if (!char) return false;
  const code = char.charCodeAt(0);
  return (code >= 0x0915 && code <= 0x0939) || // क to ह
         (code >= 0x0958 && code <= 0x095F) || // Nukta consonants
         char === 'ळ' || char === 'ऴ' || char === 'ऱ'; // Extended consonants
}

/**
 * Check if a character is a matra (vowel sign/मात्रा)
 */
function isMatra(char: string): boolean {
  if (!char) return false;
  const code = char.charCodeAt(0);
  return (code >= 0x093E && code <= 0x094C) || // Matras
         code === 0x093C || // Nukta
         code === 0x0901 || // Chandrabindu
         code === 0x0902 || // Anusvara
         code === 0x0903 || // Visarga
         code === 0x0943 || // Vocalic R matra
         code === 0x0944;   // Vocalic RR matra
}

/**
 * Check if the last character is a half consonant (consonant + halant)
 */
function endsWithHalfConsonant(text: string): boolean {
  if (text.length < 2) return false;
  return text[text.length - 1] === HALANT && isConsonant(text[text.length - 2]);
}

/**
 * Check if character is choti i matra (ि) - the pre-base vowel
 */
function isChotiIMatra(char: string): boolean {
  return char === CHOTI_I_MATRA;
}

/**
 * Compose Hindi input with proper rules
 * @param currentText - Current typed text
 * @param newChar - New character being typed
 * @param pendingPreBaseVowel - Pending pre-base vowel (ि) waiting for consonant
 * @returns {text: string, pendingPreBaseVowel: string | null}
 */
export function composeHindiInput(
  currentText: string,
  newChar: string,
  pendingPreBaseVowel: string | null = null
): { text: string; pendingPreBaseVowel: string | null } {
  // Handle pre-base vowel (ि) - must be typed BEFORE consonant
  if (isChotiIMatra(newChar)) {
    // Store ि as pending, don't add to text yet
    return {
      text: currentText,
      pendingPreBaseVowel: newChar,
    };
  }

  // If we have a pending pre-base vowel and now typing a consonant
  if (pendingPreBaseVowel && isConsonant(newChar)) {
    // Add consonant first, then the matra (it will display in correct order)
    return {
      text: currentText + newChar + pendingPreBaseVowel,
      pendingPreBaseVowel: null,
    };
  }

  // If we have pending pre-base vowel but typing something else, add it normally
  if (pendingPreBaseVowel) {
    return {
      text: currentText + pendingPreBaseVowel + newChar,
      pendingPreBaseVowel: null,
    };
  }

  // Get last character for composition checks
  const lastChar = currentText[currentText.length - 1] || '';
  const secondLastChar = currentText[currentText.length - 2] || '';

  // Rule 1: Vowel + Matra = Different Vowel
  // Example: अ + ा = आ
  if (isVowel(lastChar) && isMatra(newChar)) {
    const vowelMap = VOWEL_MATRA_MAP[lastChar];
    if (vowelMap && vowelMap[newChar]) {
      return {
        text: currentText.slice(0, -1) + vowelMap[newChar],
        pendingPreBaseVowel: null,
      };
    }
  }

  // Rule 2: Half Consonant + Matra = Full Consonant with Matra
  // Example: म् + ा = मा (remove halant, add matra)
  if (endsWithHalfConsonant(currentText) && isMatra(newChar)) {
    // Remove the halant and add the matra
    return {
      text: currentText.slice(0, -1) + newChar,
      pendingPreBaseVowel: null,
    };
  }

  // Rule 3: Consonant + Matra = Consonant with Matra (normal case)
  // Example: क + ा = का
  // This is the default Unicode behavior, just append

  // Default: Just append the character
  return {
    text: currentText + newChar,
    pendingPreBaseVowel: null,
  };
}

/**
 * Get expected character for comparison (handles pending pre-base vowel)
 * @param targetText - Target text to type
 * @param currentIndex - Current typing position
 * @param pendingPreBaseVowel - Pending pre-base vowel if any
 * @returns Expected character to type next
 */
export function getExpectedCharacter(
  targetText: string,
  currentIndex: number,
  pendingPreBaseVowel: string | null
): string {
  if (currentIndex >= targetText.length) return '';

  const expectedChar = targetText[currentIndex];

  // If we're expecting a consonant with ि matra
  // Check if the cluster is: consonant + ि
  const nextChar = targetText[currentIndex + 1];

  // If we have pending ि, expect the consonant
  if (pendingPreBaseVowel === CHOTI_I_MATRA) {
    // We should be expecting the consonant now
    // The expected char should be a consonant
    return expectedChar;
  }

  // If the current expected is a consonant and next is ि
  // We need to expect ि first (pre-base typing)
  if (isConsonant(expectedChar) && nextChar === CHOTI_I_MATRA) {
    // User should type ि first
    return CHOTI_I_MATRA;
  }

  return expectedChar;
}

/**
 * Get display character at position (handles pre-base vowel display)
 * When ि is pending, we need to show what will be typed next
 */
export function getDisplayCharacterAtPosition(
  targetText: string,
  position: number,
  pendingPreBaseVowel: string | null
): string {
  if (position >= targetText.length) return '';

  // If we have pending ि and are showing the consonant, skip the ि
  if (pendingPreBaseVowel === CHOTI_I_MATRA) {
    // Find the consonant (it should be at position-1 in target)
    // Because in target it's stored as consonant+ि but we type ि first
    return targetText[position];
  }

  return targetText[position];
}

/**
 * Recompose decomposed text back to normal Hindi display form
 * This is the inverse of decomposeTargetText
 *
 * Examples:
 * - अा → आ
 * - िक → कि (pre-base vowel reordering)
 * - अाे → ओ
 * - म् → म् (half forms kept as-is - browser renders them naturally)
 * - कर् → कर् (kept as-is - browser shows reph above क naturally)
 */
export function recomposeDecomposedText(decomposedText: string): string {
  let result = '';
  let i = 0;

  while (i < decomposedText.length) {
    const char = decomposedText[i];
    const nextChar = decomposedText[i + 1] || '';
    const charAfterNext = decomposedText[i + 2] || '';

    // Handle pre-base vowel reordering: ि + consonant → consonant + ि
    if (char === CHOTI_I_MATRA && isConsonant(nextChar)) {
      result += nextChar + char; // Swap back to normal order
      i += 2;
      continue;
    }

    // Handle consonant + र् → reorder to र् + consonant for proper reph display
    // User types: म + र् and wants to see reph on म (displayed as र्म)
    // We need to reorder so browser renders reph correctly on top
    // Examples:
    //   म + र् → र्म (reph on top of म)
    //   क + ा + र् → र्का (should keep ा after क, but put र् before)
    if (isConsonant(char) && nextChar === RA && charAfterNext === HALANT) {
      // Consonant followed by र् → reorder to र् + consonant
      result += RA + HALANT + char;
      i += 3; // Skip consonant, र, and ्
      continue;
    }

    // Handle consonant + matra(s) + र् → reorder to र् + consonant + matra(s)
    // Example: का + र् → र्का (type क, ा, र्, display as र्का)
    if (isConsonant(char)) {
      // Look ahead to find if there's a र् after optional matras
      let lookahead = i + 1;
      let matras = '';

      while (lookahead < decomposedText.length && isMatra(decomposedText[lookahead])) {
        matras += decomposedText[lookahead];
        lookahead++;
      }

      // Check if after matras we have र्
      if (decomposedText[lookahead] === RA && decomposedText[lookahead + 1] === HALANT) {
        // Reorder: consonant + matras + र् → र् + consonant + matras
        result += RA + HALANT + char + matras;
        i = lookahead + 2; // Skip past the र्
        continue;
      }

      // Handle consonant + halant + matra(s) + र् → reorder to र् + consonant + remaining matra(s)
      // Example: म् + ा + र् → र्म (type म्, ा, र्, display as र्म with reph on म)
      // Example: म् + ा + ा + र् → र्मा (first ा completes म, second ा stays, reph on top)
      // Input sequence: म + ् + ा + र + ्
      if (decomposedText[lookahead] === HALANT) {
        lookahead++; // Skip past the halant

        // Collect matras after the halant (the first matra completes the consonant, absorbed)
        while (lookahead < decomposedText.length && isMatra(decomposedText[lookahead])) {
          matras += decomposedText[lookahead];
          lookahead++;
        }

        // Check if after matras we have र्
        if (decomposedText[lookahead] === RA && decomposedText[lookahead + 1] === HALANT) {
          // Reorder: consonant + halant + matras + र् → र् + consonant + remaining matras
          // The first matra after halant completes the half-form (absorbed, not shown)
          // Any additional matras stay on the consonant
          const remainingMatras = matras.slice(1); // Skip first matra (it completes the consonant)
          result += RA + HALANT + char + remainingMatras;
          i = lookahead + 2; // Skip past the र्
          continue;
        }
      }
    }

    // Handle र् + consonant from target text: keep as-is for display
    // This is the already-reordered form that browser renders correctly
    if (char === RA && nextChar === HALANT && isConsonant(charAfterNext)) {
      // Keep as-is: र + ् + consonant (browser renders reph on top)
      result += char + nextChar + charAfterNext;
      i += 3;
      continue;
    }

    // Handle vowel composition: अ + matra → composed vowel
    if (char === 'अ' && isMatra(nextChar)) {
      const AI_MATRA = '\u0948'; // ै

      // Special case: अ + ा + े → ओ
      if (nextChar === AA_MATRA && charAfterNext === E_MATRA) {
        result += 'ओ';
        i += 3;
        continue;
      }

      // Special case: अ + ा + ै → औ
      if (nextChar === AA_MATRA && charAfterNext === AI_MATRA) {
        result += 'औ';
        i += 3;
        continue;
      }

      const vowelMap: { [key: string]: string } = {
        '\u093E': 'आ', // अ + ा = आ
        '\u093F': 'इ', // अ + ि = इ
        '\u0940': 'ई', // अ + ी = ई
        '\u0941': 'उ', // अ + ु = उ
        '\u0942': 'ऊ', // अ + ू = ऊ
        '\u0943': 'ऋ', // अ + ृ = ऋ
        '\u0947': 'ए', // अ + े = ए
        '\u0948': 'ऐ', // अ + ै = ऐ
        '\u094B': 'ओ', // अ + ो = ओ
        '\u094C': 'औ', // अ + ौ = औ
      };

      if (vowelMap[nextChar]) {
        result += vowelMap[nextChar];
        i += 2;
        continue;
      }
    }

    // Handle consonant + ा + े → consonant + ो
    if (isConsonant(char) && nextChar === AA_MATRA && charAfterNext === E_MATRA) {
      result += char + O_MATRA;
      i += 3;
      continue;
    }

    // Handle half-consonant + matra: consonant + halant + matra → consonant (just remove halant, discard matra)
    // Example: म् + ा → म (remove the halant to make full consonant, discard the matra)
    // This is because typing matra after half-form is just to complete the consonant
    if (char === HALANT && isMatra(nextChar)) {
      const prevChar = result[result.length - 1];
      if (prevChar && isConsonant(prevChar)) {
        // The previous character is a consonant, so we have: consonant + halant + matra
        // Just keep the consonant (remove halant, discard matra)
        // Result already has the consonant, so just skip halant and matra
        i += 2; // Skip halant and matra
        continue;
      }
    }

    // Handle इ + र् → ई (special combination)
    if (char === 'इ' && nextChar === RA && charAfterNext === HALANT) {
      result += 'ई';
      i += 3; // Skip इ, र, and ्
      continue;
    }

    // Handle ए + े → ऐ (E vowel + E matra = AI vowel)
    if (char === 'ए' && nextChar === E_MATRA) {
      result += 'ऐ';
      i += 2;
      continue;
    }

    // Handle ॅ + ं → ँ (Candra E + Anusvara = Chandrabindu)
    const CANDRA_E = '\u0945'; // ॅ
    const ANUSVARA = '\u0902'; // ं
    const CHANDRABINDU = '\u0901'; // ँ
    if (char === CANDRA_E && nextChar === ANUSVARA) {
      result += CHANDRABINDU;
      i += 2; // Skip both characters
      continue;
    }

    // Default: keep character as-is
    result += char;
    i++;
  }

  return result;
}

/**
 * Decompose target text into individual keystrokes needed to type it
 * This converts composed characters into their keystroke sequences
 *
 * Examples:
 * - आ → [अ, ा]
 * - को → [क, ो]
 * - कि → [ि, क] (pre-base vowel reordering)
 * - म् → [म, ्]
 * - रू → [र, ू] (but if it's the conjunct रू from shift+;, keep as is)
 */
export function decomposeTargetText(text: string): string {
  let result = '';

  // Direct key conjuncts: consonant + halant + consonant patterns that have single keys
  // These should NOT be decomposed - they're typed as single keystrokes
  const directKeyConjuncts: { [key: string]: string } = {
    'त्र': 'त्र',   // त + ् + र = Shift+9 (single keystroke)
    'द्ध': 'द्ध',   // द + ् + ध = Shift+8 (single keystroke)
    'द्य': 'द्य',   // द + ् + य = Shift+` (single keystroke)
    'श्र': 'श्र',   // श + ् + र = Shift+J (single keystroke)
    'ज्ञ': 'ज्ञ',   // ज + ् + ञ = Shift+K (single keystroke)
  };

  // Special conjuncts that need decomposition to half-form + ा
  const conjunctToHalfPlusAa: { [key: string]: string } = {
    'क्ष': 'क्ष्\u093E', // क + ् + ष = क्ष् (Shift+[) + ा (K)
  };

  // Consonants whose full form needs half + ा decomposition
  // Since AltGr is disabled, users type: half-consonant + ा → full consonant
  const halfPlusAaConsonants: { [key: string]: string } = {
    'भ': 'भ्\u093E', // भ = भ् (Shift+H) + ा (K)
    'ध': 'ध्\u093E', // ध = ध् (/) + ा (K)
    'घ': 'घ्\u093E', // घ = घ् (Shift+/) + ा (K)
    'थ': 'थ्\u093E', // थ = थ् (Shift+F) + ा (K)
    'श': 'श्\u093E', // श = श् (') + ा (K)
    'ष': 'ष्\u093E', // ष = ष् (Shift+') + ा (K)
    'ख': 'ख्\u093E', // ख = ख् ([) + ा (K)
    'ण': 'ण्\u093E', // ण = ण् (.) + ा (K)
  };

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1] || '';
    const charAfterNext = text[i + 2] || '';
    const code = char.charCodeAt(0);

    // Handle REPH pattern: र् + consonant (+ optional matras) → consonant (+ matras) + र्
    // Target text has: र्म (reph on म) stored as र + ् + म
    // User should type: म + र् (consonant first, then reph)
    // Example: र्मा → decompose to म + ा + र्
    if (char === RA && nextChar === HALANT && isConsonant(charAfterNext)) {
      // Collect the consonant and any following matras
      let consonant = charAfterNext;
      let matras = '';
      let j = i + 3;

      while (j < text.length && isMatra(text[j])) {
        matras += text[j];
        j++;
      }

      // Reorder: र् + consonant + matras → consonant + matras + र्
      result += consonant + matras + RA + HALANT;
      i = j - 1; // Move index to end of this cluster
      continue;
    }

    // Check for 3-character conjunct patterns: consonant + halant + consonant
    if (isConsonant(char) && nextChar === HALANT && isConsonant(charAfterNext)) {
      const threeCharPattern = char + nextChar + charAfterNext;

      // Check if this is a direct key conjunct (keep as-is, single keystroke)
      if (directKeyConjuncts[threeCharPattern]) {
        result += directKeyConjuncts[threeCharPattern];
        i += 2; // Skip the halant and second consonant
        continue;
      }

      // Check if this conjunct needs half-form + ा decomposition
      if (conjunctToHalfPlusAa[threeCharPattern]) {
        result += conjunctToHalfPlusAa[threeCharPattern];
        i += 2;
        continue;
      }

      // Check for rakar pattern: consonant + halant + र
      // User types: consonant + ्र (KeyZ)
      // Keep as consonant + halant + र (the ् + र will be matched as ्र)
      if (charAfterNext === RA) {
        result += char + HALANT + RA;
        i += 2;
        continue;
      }

      // Other consonant + halant + consonant patterns: keep as-is
      // They will be typed as: first consonant + halant, then second consonant
    }

    // Check for 2-character half-form patterns: consonant + halant
    // These are direct keys, keep as-is
    if (isConsonant(char) && nextChar === HALANT) {
      // Half-forms like भ्, घ्, थ्, etc. are direct keys - keep as-is
      result += char + HALANT;
      i++; // Skip the halant
      continue;
    }

    // Check if this consonant needs half + ा decomposition (full consonant form)
    if (halfPlusAaConsonants[char]) {
      result += halfPlusAaConsonants[char];
      continue;
    }

    // Check if it's a vowel that needs decomposition
    // NOTE: Only decompose vowels NOT directly available on normal/shift keys
    // Directly available: अ (KeyV), इ (KeyB), उ (KeyM), ए (Comma), ऋ (Shift+0)
    if (code >= 0x0906 && code <= 0x0914) {
      const decompositions: { [key: string]: string } = {
        'आ': 'अ\u093E', // आ = अ + ा
        // 'इ' - directly on KeyB, don't decompose
        'ई': 'इ\u0930\u094D', // ई = इ + र् (special: इ + र् = ई)
        // 'उ' - directly on KeyM, don't decompose
        'ऊ': 'अ\u0942', // ऊ = अ + ू
        // 'ऋ' - directly on Shift+0, don't decompose
        // 'ए' - directly on Comma, don't decompose
        'ऐ': 'ए\u0947', // ऐ = ए + े (Comma + S)
        // 'ओ' handled separately below
        'औ': 'अ\u093E\u0948', // औ = अ + ा + ै
      };

      // Special case: ओ decomposes to अ + ा + े (for non-AltGr typing)
      if (char === 'ओ') {
        result += 'अ\u093E\u0947'; // अ + ा + े
        continue;
      }

      if (decompositions[char]) {
        result += decompositions[char];
        continue;
      }
    }

    // Check if this is a consonant followed by choti i matra
    // In this case, we need to reorder: क + ि → ि + क
    if (i + 1 < text.length && isConsonant(char) && text[i + 1] === CHOTI_I_MATRA) {
      result += CHOTI_I_MATRA + char;
      i++;
      continue;
    }

    // Check if this is a consonant followed by O matra (ो)
    // In non-AltGr layout, ो is typed as ा + े
    if (i + 1 < text.length && isConsonant(char) && text[i + 1] === O_MATRA) {
      result += char + AA_MATRA + E_MATRA;
      i++;
      continue;
    }

    // Decompose chandrabindu: ँ → ॅ + ं (Shift+W + A)
    const CHANDRABINDU = '\u0901'; // ँ
    const CANDRA_E = '\u0945'; // ॅ
    const ANUSVARA = '\u0902'; // ं
    if (char === CHANDRABINDU) {
      result += CANDRA_E + ANUSVARA;
      continue;
    }

    // For all other characters, keep as-is
    result += char;
  }

  return result;
}
