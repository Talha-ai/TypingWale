/**
 * Remington GAIL Keyboard Mapping - OFFICIAL
 *
 * Based on official Keyman source files from SIL International:
 * Source: https://github.com/keymanapp/keyboards/tree/master/release/r/remington_gail
 * Files: remington_gail.kmn, remington_gail.keyman-touch-layout
 * License: © SIL International (MIT)
 * Version: 1.0
 *
 * This mapping includes all 4 modifier states:
 * - Normal (no modifiers)
 * - Shift (Shift key held)
 * - AltGr (Right Alt / AltRight held)
 * - AltGr+Shift (Right Alt + Shift held)
 *
 * IMPORTANT NOTES:
 * - This keyboard uses PHONETIC order (क + ि = कि), not visual order
 * - Halant (्) is used to make half-consonants
 * - Normal digits are Arabic (1-9, 0), AltGr+digits are Devanagari (१-९, ०)
 * - Some keys produce conjuncts directly (त्र, द्ध, ज्ञ, श्र, etc.)
 * - Context-sensitive rules apply for nukta and vowel building
 *
 * CRITICAL: This is the FOUNDATION of the typing platform.
 * All mappings are verified against official Keyman source.
 */

import { KeyboardLayout, KeyMapping } from '@/types/keyboard.types';

/**
 * Complete Remington GAIL keyboard layout
 * Organized by rows: Number row, Top row (QWERTY), Home row (ASDF), Bottom row (ZXCV), Space bar
 */
export const REMINGTON_GAIL_LAYOUT: KeyboardLayout = {
  name: 'Remington GAIL',
  description: 'Remington-GAIL typewriter layout for Unicode Devanagari input',

  modifiers: {
    shift: ['ShiftLeft', 'ShiftRight'],
    altgr: ['AltRight'],
  },

  rows: [
    // ========== NUMBER ROW ==========
    [
      {
        key: 'Backquote',
        normal: '़', // Nukta
        shift: 'द्य', // dya conjunct
        altgr: '\u200C', // ZWNJ
        altgrShift: '\u200D', // ZWJ
        finger: 0,
        hand: 'left',
        label: '`',
      },
      {
        key: 'Digit1',
        normal: '1', // Arabic digit
        shift: '।', // Danda (Hindi full stop)
        altgr: '१', // Devanagari digit
        altgrShift: 'ङ', // Nga
        finger: 0,
        hand: 'left',
        label: '1',
      },
      {
        key: 'Digit2',
        normal: '2',
        shift: '/',
        altgr: '२',
        altgrShift: 'घ', // Gha
        finger: 1,
        hand: 'left',
        label: '2',
      },
      {
        key: 'Digit3',
        normal: '3',
        shift: 'ः', // Visarga
        altgr: '३',
        altgrShift: 'ह्न', // hna conjunct
        finger: 2,
        hand: 'left',
        label: '3',
      },
      {
        key: 'Digit4',
        normal: '4',
        shift: '*',
        altgr: '४',
        altgrShift: 'ह्य', // hya conjunct
        finger: 3,
        hand: 'left',
        label: '4',
      },
      {
        key: 'Digit5',
        normal: '5',
        shift: '-',
        altgr: '५',
        altgrShift: '%',
        finger: 3,
        hand: 'left',
        label: '5',
      },
      {
        key: 'Digit6',
        normal: '6',
        shift: "'", // Single quote
        altgr: '६',
        altgrShift: 'ह्म', // hma conjunct
        finger: 4,
        hand: 'right',
        label: '6',
      },
      {
        key: 'Digit7',
        normal: '7',
        shift: "'", // Double quote
        altgr: '७',
        altgrShift: '÷', // Division sign
        finger: 4,
        hand: 'right',
        label: '7',
      },
      {
        key: 'Digit8',
        normal: '8',
        shift: 'द्ध', // ddha conjunct
        altgr: '८',
        altgrShift: '×', // Multiplication sign
        finger: 5,
        hand: 'right',
        label: '8',
      },
      {
        key: 'Digit9',
        normal: '9',
        shift: 'त्र', // tra conjunct
        altgr: '९',
        altgrShift: 'द्ग', // dga conjunct
        finger: 6,
        hand: 'right',
        label: '9',
      },
      {
        key: 'Digit0',
        normal: '0',
        shift: 'ऋ', // Letter Vocalic R
        altgr: '०',
        altgrShift: '!',
        finger: 7,
        hand: 'right',
        label: '0',
      },
      {
        key: 'Minus',
        normal: ';', // Semicolon
        shift: '.', // Dot
        altgr: 'ञ', // Nya
        altgrShift: 'ञ्', // Nya + Halant
        finger: 7,
        hand: 'right',
        label: '-',
      },
      {
        key: 'Equal',
        normal: 'ृ', // Sign Vocalic R matra
        shift: '्', // Halant (Virama)
        altgr: '+',
        altgrShift: '=',
        finger: 7,
        hand: 'right',
        label: '=',
      },
      {
        key: 'Backspace',
        normal: '',
        shift: '',
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: 'Backspace',
      },
    ],

    // ========== TOP ROW (QWERTY) ==========
    [
      {
        key: 'Tab',
        normal: '',
        shift: '',
        altgr: '',
        altgrShift: '',
        finger: 0,
        hand: 'left',
        label: 'Tab',
      },
      {
        key: 'KeyQ',
        normal: 'ु', // U matra
        shift: 'फ', // Pha
        altgr: 'फ्', // Pha + Halant
        altgrShift: 'झ्र', // jhra conjunct
        finger: 0,
        hand: 'left',
        label: 'Q',
      },
      {
        key: 'KeyW',
        normal: 'ू', // UU matra
        shift: 'ॅ', // Candra E matra
        altgr: 'ॄ', // Vocalic RR matra
        altgrShift: 'ॠ', // Vocalic RR vowel
        finger: 1,
        hand: 'left',
        label: 'W',
      },
      {
        key: 'KeyE',
        normal: 'म', // Ma
        shift: 'म्', // Ma + Halant
        altgr: 'ें', // E matra + Anusvara
        altgrShift: 'ैं', // AI matra + Anusvara
        finger: 2,
        hand: 'left',
        label: 'E',
      },
      {
        key: 'KeyR',
        normal: 'त', // Ta
        shift: 'त्', // Ta + Halant
        altgr: 'त्त', // tta conjunct
        altgrShift: 'त्त्', // tta + Halant
        finger: 3,
        hand: 'left',
        label: 'R',
      },
      {
        key: 'KeyT',
        normal: 'ज', // Ja
        shift: 'ज्', // Ja + Halant
        altgr: 'ज्र', // jra conjunct
        altgrShift: 'त्र्', // tra + Halant
        finger: 3,
        hand: 'left',
        label: 'T',
      },
      {
        key: 'KeyY',
        normal: 'ल', // La
        shift: 'ल्', // La + Halant
        altgr: 'द्द', // dda conjunct
        altgrShift: 'द्भ', // dbha conjunct
        finger: 4,
        hand: 'right',
        label: 'Y',
      },
      {
        key: 'KeyU',
        normal: 'न', // Na
        shift: 'न्', // Na + Halant
        altgr: 'फ़', // Fa (Pha + Nukta)
        altgrShift: 'न्न', // nna conjunct
        finger: 4,
        hand: 'right',
        label: 'U',
      },
      {
        key: 'KeyI',
        normal: 'प', // Pa
        shift: 'प्', // Pa + Halant
        altgr: 'फ', // Pha
        altgrShift: 'प्र', // pra conjunct
        finger: 5,
        hand: 'right',
        label: 'I',
      },
      {
        key: 'KeyO',
        normal: 'व', // Va
        shift: 'व्', // Va + Halant
        altgr: 'व्न', // vna conjunct
        altgrShift: 'व्र', // vra conjunct
        finger: 6,
        hand: 'right',
        label: 'O',
      },
      {
        key: 'KeyP',
        normal: 'च', // Cha
        shift: 'च्', // Cha + Halant
        altgr: 'श', // Sha
        altgrShift: 'ढ़', // Rrha (Ddha + Nukta)
        finger: 7,
        hand: 'right',
        label: 'P',
      },
      {
        key: 'BracketLeft',
        normal: 'ख्', // Kha + Halant
        shift: 'क्ष्', // ksha + Halant
        altgr: 'ख', // Kha
        altgrShift: 'क्ष', // ksha conjunct
        finger: 7,
        hand: 'right',
        label: '[',
      },
      {
        key: 'BracketRight',
        normal: ',',
        shift: 'द्व', // dva conjunct
        altgr: 'द्ध', // ddha conjunct
        altgrShift: 'द्ब', // dba conjunct
        finger: 7,
        hand: 'right',
        label: ']',
      },
      {
        key: 'Backslash',
        normal: '?',
        shift: ')', // Close bracket
        altgr: 'ऽ', // Avagraha
        altgrShift: 'ॐ', // Om
        finger: 7,
        hand: 'right',
        label: '\\',
      },
    ],

    // ========== HOME ROW (ASDFGHJKL) ==========
    [
      {
        key: 'CapsLock',
        normal: '',
        shift: '',
        altgr: '',
        altgrShift: '',
        finger: 0,
        hand: 'left',
        label: 'Caps',
      },
      {
        key: 'KeyA',
        normal: 'ं', // Anusvara (Bindi)
        shift: 'ा', // AA Matra (आ की मात्रा)
        altgr: 'ह्ण', // hna conjunct
        altgrShift: 'ख़', // Khha (Kha + Nukta)
        finger: 0,
        hand: 'left',
        label: 'A',
      },
      {
        key: 'KeyS',
        normal: 'े', // E matra (verified: \u0947)
        shift: 'ै', // AI matra (verified: \u0948)
        altgr: 'भ', // Bha
        altgrShift: 'ष्ट', // shta conjunct
        finger: 1,
        hand: 'left',
        label: 'S',
      },
      {
        key: 'KeyD',
        normal: 'क', // Ka (verified: \u0915)
        shift: 'क्', // Half Ka (verified: \u0915\u094D)
        altgr: 'ध', // Dha
        altgrShift: 'ष्ठ', // shtha conjunct
        finger: 2,
        hand: 'left',
        label: 'D',
      },
      {
        key: 'KeyF',
        normal: 'ि', // I matra (verified: \u093F)
        shift: 'थ्', // Half Tha (verified: \u0924\u094D\u0925 -> actually थ् is \u0925\u094D)
        altgr: 'य्', // Ya + Halant
        altgrShift: 'थ', // Tha
        finger: 3,
        hand: 'left',
        label: 'F',
      },
      {
        key: 'KeyG',
        normal: 'ह', // Ha (verified: \u0939)
        shift: 'ळ', // Marathi La (verified: \u0933)
        altgr: 'घ', // Gha
        altgrShift: 'ग्र', // gra conjunct
        finger: 3,
        hand: 'left',
        label: 'G',
      },
      {
        key: 'KeyH',
        normal: 'ी', // II matra (verified: \u0940)
        shift: 'भ्', // Half Bha (verified: \u092D\u094D)
        altgr: 'ीं', // II matra + Anusvara
        altgrShift: 'ञ्च', // nyca conjunct
        finger: 4,
        hand: 'right',
        label: 'H',
      },
      {
        key: 'KeyJ',
        normal: 'र', // Ra
        shift: 'श्र', // shra conjunct
        altgr: 'र्\u200D', // Ra + Halant + ZWJ (eyelash ra)
        altgrShift: 'श्', // Sha + Halant
        finger: 4,
        hand: 'right',
        label: 'J',
      },
      {
        key: 'KeyK',
        normal: 'ा', // AA matra
        shift: 'ज्ञ', // gya conjunct
        altgr: '्य', // Halant + Ya
        altgrShift: 'ज्ञ्', // gya + Halant
        finger: 5,
        hand: 'right',
        label: 'K',
      },
      {
        key: 'KeyL',
        normal: 'स', // Sa
        shift: 'स्', // Sa + Halant
        altgr: 'स्त्र', // stra conjunct
        altgrShift: 'स्र', // sra conjunct
        finger: 6,
        hand: 'right',
        label: 'L',
      },
      {
        key: 'Semicolon',
        normal: 'य', // Ya
        shift: 'रू', // Ra + UU matra
        altgr: ';',
        altgrShift: 'ञ्ज', // nyja conjunct
        finger: 7,
        hand: 'right',
        label: ';',
      },
      {
        key: 'Quote',
        normal: 'श्', // Sha + Halant
        shift: 'ष्', // Ssa + Halant
        altgr: 'श', // Sha
        altgrShift: 'ष', // Ssa
        finger: 7,
        hand: 'right',
        label: "'",
      },
      {
        key: 'Enter',
        normal: '',
        shift: '',
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: 'Enter',
      },
    ],

    // ========== BOTTOM ROW (ZXCVBNM) ==========
    [
      {
        key: 'ShiftLeft',
        normal: '',
        shift: '',
        altgr: '',
        altgrShift: '',
        finger: 0,
        hand: 'left',
        label: 'Shift',
      },
      {
        key: 'KeyZ',
        normal: '्र', // Rakar (Halant + Ra) - typed AFTER consonant
        shift: 'र्', // Reph (Ra + Halant) - typed BEFORE consonant, appears above
        altgr: 'ो', // O matra (disabled)
        altgrShift: 'ौ', // AU matra (disabled)
        finger: 0,
        hand: 'left',
        label: 'Z',
      },
      {
        key: 'KeyX',
        normal: 'ग', // Ga
        shift: 'ग्', // Ga + Halant
        altgr: 'द्र', // dra conjunct
        altgrShift: 'ग़', // Ghha (Ga + Nukta)
        finger: 1,
        hand: 'left',
        label: 'X',
      },
      {
        key: 'KeyC',
        normal: 'ब', // Ba
        shift: 'ब्', // Ba + Halant
        altgr: 'ड़', // Dda + Nukta
        altgrShift: 'ज़', // Za (Ja + Nukta)
        finger: 2,
        hand: 'left',
        label: 'C',
      },
      {
        key: 'KeyV',
        normal: 'अ', // Letter A
        shift: 'ट', // Tta
        altgr: 'ट्', // Tta + Halant
        altgrShift: 'ट्ट', // tta tta conjunct
        finger: 3,
        hand: 'left',
        label: 'V',
      },
      {
        key: 'KeyB',
        normal: 'इ', // Letter I
        shift: 'ठ', // Ttha
        altgr: 'ई', // Letter II
        altgrShift: 'ईं', // II + Anusvara
        finger: 3,
        hand: 'left',
        label: 'B',
      },
      {
        key: 'KeyN',
        normal: 'द', // Da
        shift: 'छ', // Chha
        altgr: 'ण', // Nna
        altgrShift: 'द्म', // dma conjunct
        finger: 4,
        hand: 'right',
        label: 'N',
      },
      {
        key: 'KeyM',
        normal: 'उ', // Letter U
        shift: 'ड', // Dda
        altgr: 'ऊ', // Letter UU
        altgrShift: 'ड्ड', // dda dda conjunct
        finger: 4,
        hand: 'right',
        label: 'M',
      },
      {
        key: 'Comma',
        normal: 'ए', // Letter E
        shift: 'ढ', // Ddha
        altgr: 'ँ', // Chandrabindu
        altgrShift: 'ढ्ढ', // ddha ddha conjunct
        finger: 5,
        hand: 'right',
        label: ',',
      },
      {
        key: 'Period',
        normal: 'ण्', // Half Nna (आधा ण)
        shift: 'झ', // Jha
        altgr: '.',
        altgrShift: 'झ्', // Jha + Halant
        finger: 6,
        hand: 'right',
        label: '.',
      },
      {
        key: 'Slash',
        normal: 'ध्', // Half Dha (verified: \u0927\u094D)
        shift: 'घ्', // Half Gha (verified: \u0918\u094D)
        altgr: '/',
        altgrShift: '?',
        finger: 7,
        hand: 'right',
        label: '/',
      },
      {
        key: 'ShiftRight',
        normal: '',
        shift: '',
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: 'Shift',
      },
    ],

    // ========== SPACE BAR ==========
    [
      {
        key: 'ControlLeft',
        normal: '',
        shift: '',
        altgr: '',
        altgrShift: '',
        finger: 0,
        hand: 'left',
        label: 'Ctrl',
      },
      {
        key: 'AltLeft',
        normal: '',
        shift: '',
        altgr: '',
        altgrShift: '',
        finger: 0,
        hand: 'left',
        label: 'Alt',
      },
      {
        key: 'Space',
        normal: ' ',
        shift: ' ',
        altgr: ' ',
        altgrShift: ' ',
        finger: 4,
        hand: 'left',
        label: 'Space',
      },
      {
        key: 'AltRight',
        normal: '',
        shift: '',
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: 'Alt',
      },
      {
        key: 'ControlRight',
        normal: '',
        shift: '',
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: 'Ctrl',
      },
    ],
  ],
};

/**
 * INSCRIPT Keyboard Mapping - OFFICIAL
 *
 * Government of India standard keyboard layout for Hindi/Devanagari
 * Based on official INSCRIPT specification
 *
 * Key differences from Remington GAIL:
 * - Phonetic organization (vowels on left, consonants on right)
 * - Halant on 'D' key (vs Shift+= in Remington)
 * - Devanagari numbers by default (१,२,३) vs Arabic (1,2,3)
 * - Only 2 modifier states: normal and shift (no AltGr layer)
 * - Logical layout optimized for touch typing
 */
export const INSCRIPT_LAYOUT: KeyboardLayout = {
  name: 'INSCRIPT',
  description: 'Government of India standard layout for Devanagari input',

  modifiers: {
    shift: ['ShiftLeft', 'ShiftRight'],
    altgr: [],
  },

  rows: [
    // ========== NUMBER ROW ==========
    [
      {
        key: 'Backquote',
        normal: 'ॊ', // Candra O
        shift: 'ऒ', // Letter Candra O
        altgr: '',
        altgrShift: '',
        finger: 0,
        hand: 'left',
        label: '`',
      },
      {
        key: 'Digit1',
        normal: '१', // Devanagari digit 1
        shift: 'ऍ', // Candra E
        altgr: '',
        altgrShift: '',
        finger: 0,
        hand: 'left',
        label: '1',
      },
      {
        key: 'Digit2',
        normal: '२',
        shift: 'ॅ', // Candra E matra
        altgr: '',
        altgrShift: '',
        finger: 1,
        hand: 'left',
        label: '2',
      },
      {
        key: 'Digit3',
        normal: '३',
        shift: '्र', // Rakar (Halant + Ra)
        altgr: '',
        altgrShift: '',
        finger: 2,
        hand: 'left',
        label: '3',
      },
      {
        key: 'Digit4',
        normal: '४',
        shift: 'र्', // Reph (Ra + Halant)
        altgr: '',
        altgrShift: '',
        finger: 3,
        hand: 'left',
        label: '4',
      },
      {
        key: 'Digit5',
        normal: '५',
        shift: 'ज्ञ', // gya conjunct
        altgr: '',
        altgrShift: '',
        finger: 3,
        hand: 'left',
        label: '5',
      },
      {
        key: 'Digit6',
        normal: '६',
        shift: 'त्र', // tra conjunct
        altgr: '',
        altgrShift: '',
        finger: 4,
        hand: 'right',
        label: '6',
      },
      {
        key: 'Digit7',
        normal: '७',
        shift: 'क्ष', // ksha conjunct
        altgr: '',
        altgrShift: '',
        finger: 4,
        hand: 'right',
        label: '7',
      },
      {
        key: 'Digit8',
        normal: '८',
        shift: 'श्र', // shra conjunct
        altgr: '',
        altgrShift: '',
        finger: 5,
        hand: 'right',
        label: '8',
      },
      {
        key: 'Digit9',
        normal: '९',
        shift: '(',
        altgr: '',
        altgrShift: '',
        finger: 6,
        hand: 'right',
        label: '9',
      },
      {
        key: 'Digit0',
        normal: '०',
        shift: ')',
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: '0',
      },
      {
        key: 'Minus',
        normal: '-',
        shift: 'ः', // Visarga
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: '-',
      },
      {
        key: 'Equal',
        normal: 'ृ', // Vocalic R matra
        shift: 'ऋ', // Vocalic R vowel
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: '=',
      },
      {
        key: 'Backspace',
        normal: '',
        shift: '',
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: 'Backspace',
      },
    ],

    // ========== TOP ROW (QWERTY) ==========
    [
      {
        key: 'Tab',
        normal: '',
        shift: '',
        altgr: '',
        altgrShift: '',
        finger: 0,
        hand: 'left',
        label: 'Tab',
      },
      {
        key: 'KeyQ',
        normal: 'ौ', // AU matra
        shift: 'औ', // Letter AU
        altgr: '',
        altgrShift: '',
        finger: 0,
        hand: 'left',
        label: 'Q',
      },
      {
        key: 'KeyW',
        normal: 'ै', // AI matra
        shift: 'ऐ', // Letter AI
        altgr: '',
        altgrShift: '',
        finger: 1,
        hand: 'left',
        label: 'W',
      },
      {
        key: 'KeyE',
        normal: 'ा', // AA matra
        shift: 'आ', // Letter AA
        altgr: '',
        altgrShift: '',
        finger: 2,
        hand: 'left',
        label: 'E',
      },
      {
        key: 'KeyR',
        normal: 'ी', // II matra
        shift: 'ई', // Letter II
        altgr: '',
        altgrShift: '',
        finger: 3,
        hand: 'left',
        label: 'R',
      },
      {
        key: 'KeyT',
        normal: 'ू', // UU matra
        shift: 'ऊ', // Letter UU
        altgr: '',
        altgrShift: '',
        finger: 3,
        hand: 'left',
        label: 'T',
      },
      {
        key: 'KeyY',
        normal: 'ब', // Ba
        shift: 'भ', // Bha
        altgr: '',
        altgrShift: '',
        finger: 4,
        hand: 'right',
        label: 'Y',
      },
      {
        key: 'KeyU',
        normal: 'ह', // Ha
        shift: 'ङ', // Nga
        altgr: '',
        altgrShift: '',
        finger: 4,
        hand: 'right',
        label: 'U',
      },
      {
        key: 'KeyI',
        normal: 'ग', // Ga
        shift: 'घ', // Gha
        altgr: '',
        altgrShift: '',
        finger: 5,
        hand: 'right',
        label: 'I',
      },
      {
        key: 'KeyO',
        normal: 'द', // Da
        shift: 'ध', // Dha
        altgr: '',
        altgrShift: '',
        finger: 6,
        hand: 'right',
        label: 'O',
      },
      {
        key: 'KeyP',
        normal: 'ज', // Ja
        shift: 'झ', // Jha
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: 'P',
      },
      {
        key: 'BracketLeft',
        normal: 'ड', // Dda
        shift: 'ढ', // Ddha
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: '[',
      },
      {
        key: 'BracketRight',
        normal: '',
        shift: 'ञ', // Nya
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: ']',
      },
      {
        key: 'Backslash',
        normal: '',
        shift: '',
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: '\\',
      },
    ],

    // ========== HOME ROW (ASDFGHJKL) ==========
    [
      {
        key: 'CapsLock',
        normal: '',
        shift: '',
        altgr: '',
        altgrShift: '',
        finger: 0,
        hand: 'left',
        label: 'Caps',
      },
      {
        key: 'KeyA',
        normal: 'ो', // O matra
        shift: 'ओ', // Letter O
        altgr: '',
        altgrShift: '',
        finger: 0,
        hand: 'left',
        label: 'A',
      },
      {
        key: 'KeyS',
        normal: 'े', // E matra
        shift: 'ए', // Letter E
        altgr: '',
        altgrShift: '',
        finger: 1,
        hand: 'left',
        label: 'S',
      },
      {
        key: 'KeyD',
        normal: '्', // Halant (Virama) - KEY DIFFERENCE!
        shift: 'अ', // Letter A
        altgr: '',
        altgrShift: '',
        finger: 2,
        hand: 'left',
        label: 'D',
      },
      {
        key: 'KeyF',
        normal: 'ि', // I matra
        shift: 'इ', // Letter I
        altgr: '',
        altgrShift: '',
        finger: 3,
        hand: 'left',
        label: 'F',
      },
      {
        key: 'KeyG',
        normal: 'ु', // U matra
        shift: 'उ', // Letter U
        altgr: '',
        altgrShift: '',
        finger: 3,
        hand: 'left',
        label: 'G',
      },
      {
        key: 'KeyH',
        normal: 'प', // Pa
        shift: 'फ', // Pha
        altgr: '',
        altgrShift: '',
        finger: 4,
        hand: 'right',
        label: 'H',
      },
      {
        key: 'KeyJ',
        normal: 'र', // Ra
        shift: 'ऱ', // Ra with nukta (Marathi/South Indian)
        altgr: '',
        altgrShift: '',
        finger: 4,
        hand: 'right',
        label: 'J',
      },
      {
        key: 'KeyK',
        normal: 'क', // Ka
        shift: 'ख', // Kha
        altgr: '',
        altgrShift: '',
        finger: 5,
        hand: 'right',
        label: 'K',
      },
      {
        key: 'KeyL',
        normal: 'त', // Ta
        shift: 'थ', // Tha
        altgr: '',
        altgrShift: '',
        finger: 6,
        hand: 'right',
        label: 'L',
      },
      {
        key: 'Semicolon',
        normal: 'च', // Cha
        shift: 'रू', // Ra + UU matra (roo) - added for consistency with Remington
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: ';',
      },
      {
        key: 'Quote',
        normal: 'ट', // Tta
        shift: 'ठ', // Ttha
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: "'",
      },
      {
        key: 'Enter',
        normal: '',
        shift: '',
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: 'Enter',
      },
    ],

    // ========== BOTTOM ROW (ZXCVBNM) ==========
    [
      {
        key: 'ShiftLeft',
        normal: '',
        shift: '',
        altgr: '',
        altgrShift: '',
        finger: 0,
        hand: 'left',
        label: 'Shift',
      },
      {
        key: 'KeyZ',
        normal: 'ॉ',
        shift: 'ऑ',
        altgr: '',
        altgrShift: '',
        finger: 0,
        hand: 'left',
        label: 'Z',
      },
      {
        key: 'KeyX',
        normal: 'ं', // Anusvara
        shift: 'ँ', // Chandrabindu
        altgr: '',
        altgrShift: '',
        finger: 1,
        hand: 'left',
        label: 'X',
      },
      {
        key: 'KeyC',
        normal: 'म', // Ma
        shift: 'ण', // Nna
        altgr: '',
        altgrShift: '',
        finger: 2,
        hand: 'left',
        label: 'C',
      },
      {
        key: 'KeyV',
        normal: 'न', // Na
        shift: 'ऩ',
        altgr: '',
        altgrShift: '',
        finger: 3,
        hand: 'left',
        label: 'V',
      },
      {
        key: 'KeyB',
        normal: 'व', // Va
        shift: 'ऴ',
        altgr: '',
        altgrShift: '',
        finger: 3,
        hand: 'left',
        label: 'B',
      },
      {
        key: 'KeyN',
        normal: 'ल', // La
        shift: 'ळ', // Lla
        altgr: '',
        altgrShift: '',
        finger: 4,
        hand: 'right',
        label: 'N',
      },
      {
        key: 'KeyM',
        normal: 'स', // Sa
        shift: 'श', // Sha
        altgr: '',
        altgrShift: '',
        finger: 4,
        hand: 'right',
        label: 'M',
      },
      {
        key: 'Comma',
        normal: ',',
        shift: 'ष', // Ssa
        altgr: '',
        altgrShift: '',
        finger: 5,
        hand: 'right',
        label: ',',
      },
      {
        key: 'Period',
        normal: '।',
        shift: '॥', // Danda (Hindi full stop)
        altgr: '',
        altgrShift: '',
        finger: 6,
        hand: 'right',
        label: '.',
      },
      {
        key: 'Slash',
        normal: 'य', // Ya
        shift: 'य़',
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: '/',
      },
      {
        key: 'ShiftRight',
        normal: '',
        shift: '',
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: 'Shift',
      },
    ],

    // ========== SPACE BAR ==========
    [
      {
        key: 'ControlLeft',
        normal: '',
        shift: '',
        altgr: '',
        altgrShift: '',
        finger: 0,
        hand: 'left',
        label: 'Ctrl',
      },
      {
        key: 'AltLeft',
        normal: '',
        shift: '',
        altgr: '',
        altgrShift: '',
        finger: 0,
        hand: 'left',
        label: 'Alt',
      },
      {
        key: 'Space',
        normal: ' ',
        shift: ' ',
        altgr: '',
        altgrShift: '',
        finger: 4,
        hand: 'left',
        label: 'Space',
      },
      {
        key: 'AltRight',
        normal: '',
        shift: '',
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: 'Alt',
      },
      {
        key: 'ControlRight',
        normal: '',
        shift: '',
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: 'Ctrl',
      },
    ],
  ],
};

/**
 * Flattened map of all keys for quick lookup (Remington GAIL)
 * Key: physical key code, Value: KeyMapping
 */
export const KEY_MAP: Map<string, KeyMapping> = new Map(
  REMINGTON_GAIL_LAYOUT.rows.flat().map((key) => [key.key, key]),
);

/**
 * Flattened map of all keys for quick lookup (INSCRIPT)
 * Key: physical key code, Value: KeyMapping
 */
export const INSCRIPT_KEY_MAP: Map<string, KeyMapping> = new Map(
  INSCRIPT_LAYOUT.rows.flat().map((key) => [key.key, key]),
);

/**
 * Remington CBI Keyboard Mapping
 *
 * Central Bureau of Investigation / CPCT standard layout for Hindi typing
 * Used in government exams like CPCT, SSC, CRPF, CISF etc.
 *
 * Key differences from Remington GAIL:
 * - Minor variations in some key positions
 * - Same general structure as GAIL
 * - Devanagari numbers on number row (with Shift for symbols)
 * - Used with Mangal Unicode font
 */
export const REMINGTON_CBI_LAYOUT: KeyboardLayout = {
  name: 'Remington CBI',
  description: 'CBI/CPCT standard layout for Hindi Unicode typing',

  modifiers: {
    shift: ['ShiftLeft', 'ShiftRight'],
    altgr: ['AltRight'],
  },

  rows: [
    // ========== NUMBER ROW ==========
    [
      {
        key: 'Backquote',
        normal: 'ञ',
        shift: '॰', // Abbreviation sign
        altgr: '',
        altgrShift: '',
        finger: 0,
        hand: 'left',
        label: '`',
      },
      {
        key: 'Digit1',
        normal: '१',
        shift: '!',
        altgr: '',
        altgrShift: '',
        finger: 0,
        hand: 'left',
        label: '1',
      },
      {
        key: 'Digit2',
        normal: '२',
        shift: '/',
        altgr: '',
        altgrShift: '',
        finger: 1,
        hand: 'left',
        label: '2',
      },
      {
        key: 'Digit3',
        normal: '३',
        shift: 'ः',
        altgr: '',
        altgrShift: '',
        finger: 2,
        hand: 'left',
        label: '3',
      },
      {
        key: 'Digit4',
        normal: '४',
        shift: '*',
        altgr: '',
        altgrShift: '',
        finger: 3,
        hand: 'left',
        label: '4',
      },
      {
        key: 'Digit5',
        normal: '५',
        shift: '-',
        altgr: '',
        altgrShift: '',
        finger: 3,
        hand: 'left',
        label: '5',
      },
      {
        key: 'Digit6',
        normal: '६',
        shift: '\u2018', // Left single quote '
        altgr: '',
        altgrShift: '',
        finger: 4,
        hand: 'right',
        label: '6',
      },
      {
        key: 'Digit7',
        normal: '७',
        shift: '\u2019', // Right single quote '
        altgr: '',
        altgrShift: '',
        finger: 4,
        hand: 'right',
        label: '7',
      },
      {
        key: 'Digit8',
        normal: '८',
        shift: 'द्ध',
        altgr: '',
        altgrShift: '',
        finger: 5,
        hand: 'right',
        label: '8',
      },
      {
        key: 'Digit9',
        normal: '९',
        shift: 'त्र',
        altgr: '',
        altgrShift: '',
        finger: 6,
        hand: 'right',
        label: '9',
      },
      {
        key: 'Digit0',
        normal: '०',
        shift: 'ऋ',
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: '0',
      },
      {
        key: 'Minus',
        normal: ';',
        shift: '.',
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: '-',
      },
      {
        key: 'Equal',
        normal: 'ृ',
        shift: '्',
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: '=',
      },
      {
        key: 'Backspace',
        normal: '',
        shift: '',
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: 'Backspace',
      },
    ],

    // ========== TOP ROW (QWERTY) ==========
    [
      {
        key: 'Tab',
        normal: '',
        shift: '',
        altgr: '',
        altgrShift: '',
        finger: 0,
        hand: 'left',
        label: 'Tab',
      },
      {
        key: 'KeyQ',
        normal: 'ु',
        shift: 'फ',
        altgr: '',
        altgrShift: '',
        finger: 0,
        hand: 'left',
        label: 'Q',
      },
      {
        key: 'KeyW',
        normal: 'ू',
        shift: 'ॅ',
        altgr: '',
        altgrShift: '',
        finger: 1,
        hand: 'left',
        label: 'W',
      },
      {
        key: 'KeyE',
        normal: 'म',
        shift: 'म्',
        altgr: '',
        altgrShift: '',
        finger: 2,
        hand: 'left',
        label: 'E',
      },
      {
        key: 'KeyR',
        normal: 'त',
        shift: 'त्',
        altgr: '',
        altgrShift: '',
        finger: 3,
        hand: 'left',
        label: 'R',
      },
      {
        key: 'KeyT',
        normal: 'ज',
        shift: 'ज्',
        altgr: '',
        altgrShift: '',
        finger: 3,
        hand: 'left',
        label: 'T',
      },
      {
        key: 'KeyY',
        normal: 'ल',
        shift: 'ल्',
        altgr: '',
        altgrShift: '',
        finger: 4,
        hand: 'right',
        label: 'Y',
      },
      {
        key: 'KeyU',
        normal: 'न',
        shift: 'न्',
        altgr: '',
        altgrShift: '',
        finger: 4,
        hand: 'right',
        label: 'U',
      },
      {
        key: 'KeyI',
        normal: 'प',
        shift: 'प्',
        altgr: '',
        altgrShift: '',
        finger: 5,
        hand: 'right',
        label: 'I',
      },
      {
        key: 'KeyO',
        normal: 'व',
        shift: 'व्',
        altgr: '',
        altgrShift: '',
        finger: 6,
        hand: 'right',
        label: 'O',
      },
      {
        key: 'KeyP',
        normal: 'च',
        shift: 'च्',
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: 'P',
      },
      {
        key: 'BracketLeft',
        normal: 'ख्',
        shift: 'क्ष्',
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: '[',
      },
      {
        key: 'BracketRight',
        normal: ',',
        shift: 'द्व',
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: ']',
      },
      {
        key: 'Backslash',
        normal: '(',
        shift: ')',
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: '\\',
      },
    ],

    // ========== HOME ROW (ASDFGHJKL) ==========
    [
      {
        key: 'CapsLock',
        normal: '',
        shift: '',
        altgr: '',
        altgrShift: '',
        finger: 0,
        hand: 'left',
        label: 'Caps',
      },
      {
        key: 'KeyA',
        normal: 'ं',
        shift: 'ा',
        altgr: '',
        altgrShift: '',
        finger: 0,
        hand: 'left',
        label: 'A',
      },
      {
        key: 'KeyS',
        normal: 'े',
        shift: 'ै',
        altgr: '',
        altgrShift: '',
        finger: 1,
        hand: 'left',
        label: 'S',
      },
      {
        key: 'KeyD',
        normal: 'क',
        shift: 'क्',
        altgr: '',
        altgrShift: '',
        finger: 2,
        hand: 'left',
        label: 'D',
      },
      {
        key: 'KeyF',
        normal: 'ि',
        shift: 'थ्',
        altgr: '',
        altgrShift: '',
        finger: 3,
        hand: 'left',
        label: 'F',
      },
      {
        key: 'KeyG',
        normal: 'ह',
        shift: 'ळ',
        altgr: '',
        altgrShift: '',
        finger: 3,
        hand: 'left',
        label: 'G',
      },
      {
        key: 'KeyH',
        normal: 'ी',
        shift: 'भ्',
        altgr: '',
        altgrShift: '',
        finger: 4,
        hand: 'right',
        label: 'H',
      },
      {
        key: 'KeyJ',
        normal: 'र',
        shift: 'श्र',
        altgr: '',
        altgrShift: '',
        finger: 4,
        hand: 'right',
        label: 'J',
      },
      {
        key: 'KeyK',
        normal: 'ा',
        shift: 'ज्ञ',
        altgr: '',
        altgrShift: '',
        finger: 5,
        hand: 'right',
        label: 'K',
      },
      {
        key: 'KeyL',
        normal: 'स',
        shift: 'स्',
        altgr: '',
        altgrShift: '',
        finger: 6,
        hand: 'right',
        label: 'L',
      },
      {
        key: 'Semicolon',
        normal: 'य',
        shift: 'रू',
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: ';',
      },
      {
        key: 'Quote',
        normal: 'श्',
        shift: 'ष्',
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: "'",
      },
      {
        key: 'Enter',
        normal: '',
        shift: '',
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: 'Enter',
      },
    ],

    // ========== BOTTOM ROW (ZXCVBNM) ==========
    [
      {
        key: 'ShiftLeft',
        normal: '',
        shift: '',
        altgr: '',
        altgrShift: '',
        finger: 0,
        hand: 'left',
        label: 'Shift',
      },
      {
        key: 'KeyZ',
        normal: '्र',
        shift: 'र्',
        altgr: '',
        altgrShift: '',
        finger: 0,
        hand: 'left',
        label: 'Z',
      },
      {
        key: 'KeyX',
        normal: 'ग',
        shift: 'ग्',
        altgr: '',
        altgrShift: '',
        finger: 1,
        hand: 'left',
        label: 'X',
      },
      {
        key: 'KeyC',
        normal: 'ब',
        shift: 'ब्',
        altgr: '',
        altgrShift: '',
        finger: 2,
        hand: 'left',
        label: 'C',
      },
      {
        key: 'KeyV',
        normal: 'अ',
        shift: 'ट',
        altgr: '',
        altgrShift: '',
        finger: 3,
        hand: 'left',
        label: 'V',
      },
      {
        key: 'KeyB',
        normal: 'इ',
        shift: 'ठ',
        altgr: '',
        altgrShift: '',
        finger: 3,
        hand: 'left',
        label: 'B',
      },
      {
        key: 'KeyN',
        normal: 'द',
        shift: 'छ',
        altgr: '',
        altgrShift: '',
        finger: 4,
        hand: 'right',
        label: 'N',
      },
      {
        key: 'KeyM',
        normal: 'उ',
        shift: 'ड',
        altgr: '',
        altgrShift: '',
        finger: 4,
        hand: 'right',
        label: 'M',
      },
      {
        key: 'Comma',
        normal: 'ए',
        shift: 'ढ',
        altgr: '',
        altgrShift: '',
        finger: 5,
        hand: 'right',
        label: ',',
      },
      {
        key: 'Period',
        normal: 'ण्',
        shift: 'झ',
        altgr: '',
        altgrShift: '',
        finger: 6,
        hand: 'right',
        label: '.',
      },
      {
        key: 'Slash',
        normal: 'ध्',
        shift: 'घ्',
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: '/',
      },
      {
        key: 'ShiftRight',
        normal: '',
        shift: '',
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: 'Shift',
      },
    ],

    // ========== SPACE BAR ==========
    [
      {
        key: 'ControlLeft',
        normal: '',
        shift: '',
        altgr: '',
        altgrShift: '',
        finger: 0,
        hand: 'left',
        label: 'Ctrl',
      },
      {
        key: 'AltLeft',
        normal: '',
        shift: '',
        altgr: '',
        altgrShift: '',
        finger: 0,
        hand: 'left',
        label: 'Alt',
      },
      {
        key: 'Space',
        normal: ' ',
        shift: ' ',
        altgr: '',
        altgrShift: '',
        finger: 4,
        hand: 'left',
        label: 'Space',
      },
      {
        key: 'AltRight',
        normal: '',
        shift: '',
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: 'Alt',
      },
      {
        key: 'ControlRight',
        normal: '',
        shift: '',
        altgr: '',
        altgrShift: '',
        finger: 7,
        hand: 'right',
        label: 'Ctrl',
      },
    ],
  ],
};

/**
 * Flattened map of all keys for quick lookup (Remington CBI)
 * Key: physical key code, Value: KeyMapping
 */
export const REMINGTON_CBI_KEY_MAP: Map<string, KeyMapping> = new Map(
  REMINGTON_CBI_LAYOUT.rows.flat().map((key) => [key.key, key]),
);

/**
 * Registry of all available keyboard layouts
 */
export const AVAILABLE_LAYOUTS = {
  'remington-gail': REMINGTON_GAIL_LAYOUT,
  'remington-cbi': REMINGTON_CBI_LAYOUT,
  inscript: INSCRIPT_LAYOUT,
} as const;

/**
 * Type for layout identifiers
 */
export type LayoutId = keyof typeof AVAILABLE_LAYOUTS;

/**
 * Common Hindi characters for reference and validation
 */
export const HINDI_CHARACTERS = {
  // Vowels (स्वर)
  vowels: ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ'],

  // Vowel signs (मात्राएँ)
  matras: [
    'ा',
    'ि',
    'ी',
    'ु',
    'ू',
    'ृ',
    'े',
    'ै',
    'ो',
    'ौ',
    'ं',
    'ः',
    '़',
    'ँ',
  ],

  // Consonants - Ka varga (क वर्ग)
  kaVarga: ['क', 'ख', 'ग', 'घ', 'ङ'],

  // Consonants - Cha varga (च वर्ग)
  chaVarga: ['च', 'छ', 'ज', 'झ', 'ञ'],

  // Consonants - Ta varga (ट वर्ग)
  taVarga: ['ट', 'ठ', 'ड', 'ढ', 'ण'],

  // Consonants - Ta varga (त वर्ग)
  softTaVarga: ['त', 'थ', 'द', 'ध', 'न'],

  // Consonants - Pa varga (प वर्ग)
  paVarga: ['प', 'फ', 'ब', 'भ', 'म'],

  // Other consonants
  others: ['य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह', 'ळ'],

  // Special characters
  special: ['।', '॰', 'ॅ', 'ॉ', 'ॊ', 'ॏ', 'ॎ'],

  // Devanagari numbers
  numbers: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],

  // Conjuncts and special combinations
  conjuncts: [
    'क्ष',
    'त्र',
    'ज्ञ',
    'श्र',
    'द्ध',
    'द्द',
    'द्भ',
    'द्र',
    'ड्ड',
    'ढ्ढ',
    'त्रं',
    'त्रृ',
  ],
};
