/**
 * CPCT-Style Test Mode Page
 * Matches the official CPCT Hindi typing test interface
 */

import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useKeyboardLayout } from '@/contexts/KeyboardLayoutContext';
import { useKeyPress } from '@/hooks/useKeyPress';
import { useTypingEngine } from '@/hooks/useTypingEngine';
import { useTimer } from '@/hooks/useTimer';
import {
  decomposeTargetText,
  recomposeDecomposedText,
} from '@/utils/hindiComposition';
import { normalizeHindiText, splitIntoGraphemes } from '@/utils/hindiUtils';

// CPCT test text sample
// const CPCT_TEST_TEXT = `सामाजिक सामाजिक विकास के कार्यक्रमों में सम्मिलित प्रयासों का लाभ अत्यधिक हमें यही बताता है कि समूह के माध्यम से लोग को विकास प्रक्रियाओं को संचालित करने की उसकी निपुणता में रूढ़ने की समूहों को आयोजित रूढ़ने वाली होती है। इस धारणा का तमाम संगठन व्यापक जाता है। समाज विकास में जुड़े कार्यकर्त्ताओं के अनुभवों ने भी पुष्ट किया है। आज अधिकांश सामाजिक विकास की गतिविधियाँ व कार्यक्रम समूहों के माध्यम से ही किया जाता है। किसी भी तरह के सामाजिक परिवर्तन के लिए बनाए गए कार्यक्रम को प्रारंभ करने के पहले चाहे वह ग्रामीण इलाका हो या शहरी, समुदाय के साथ संबंध और उनके संगठन को बनाने का कार्य किया जाता है। समूह के आकार चाहे जो हो मात्र दो से लेकर दस तक की संख्या वाले छोटे समूहों को या सेकड़ो लोगों के समुदाय या समितियों तक निपुणता के एकदम साथ निपुण कामकाज की क्षमता में एक परिवर्तन आती है।`;
const CPCT_TEST_TEXT = `भारत एक विशाल देश है जहाँ विविध भाषा, संस्कृति और परंपराएँ पाई जाती हैं। प्राचीन काल से यहाँ शिक्षा, धर्म, कर्म, ज्ञान और विज्ञान का विशेष महत्व रहा है। शर्मा, वर्मा और गुप्ता जैसे नाम सामान्य रूप से प्रयोग में आते हैं। छात्र कक्षा में प्रश्न, उत्तर, अभ्यास और मूल्यांकन पर ध्यान देते हैं। कृषि, उद्योग, व्यापार और तकनीक देश की अर्थव्यवस्था को सशक्त बनाते हैं। पर्यावरण संरक्षण, स्वास्थ्य सेवा और सामाजिक न्याय आज की प्रमुख आवश्यकता हैं। कठिन परिश्रम, आत्मविश्वास और अनुशासन से व्यक्ति लक्ष्य प्राप्त करता है। कंप्यूटर, मोबाइल, इंटरनेट और कृत्रिम बुद्धिमत्ता ने कार्य प्रणाली को सरल बनाया है। हमें समय का सदुपयोग करते हुए सत्य, अहिंसा और सहयोग के मार्ग पर चलना चाहिए।  

र्मा र्वा र्ना र्ला र्या र्का र्गा र्चा र्जा र्टा र्णा र्ता र्था र्दा र्पा र्बा र्भा र्म्य र्व्य।
क्शा ज्ञा त्र्य श्रा ग्र्य प्ला क्ला द्वा स्त्रा प्र्या ब्र्या।
फिंका गुँत्रा कैल्पो चौर्मा स्यौत्री दैर्कु भोत्रा।
क्षौरा त्रिंगा ज्ञोत्रा श्रैंपा ग्रौत्रा।
डांत्रा ढौर्पा ण्यौत्रा त्ऱिंपा।
हृत्रा कृपौ शृत्रा वृंपा।
ज़्यौत्रा फ़्रिंपा क़ौत्रा ख़्यिंपा ग़्रौत्रा।
क्त्रा ण्ड्रा स्त्य्रा म्प्य्रा ल्क्त्रा।
`;

const TEST_DURATION = 10 * 60; // 10 minutes in seconds

export function TestModePage() {
  const navigate = useNavigate();
  const { currentLayoutId } = useKeyboardLayout();
  const keyPress = useKeyPress({ enabled: true });
  const [backspaceCount, setBackspaceCount] = useState(0);

  const {
    currentIndex,
    typedText,
    errors,
    currentStats,
    isCompleted: isComplete,
    needsDummyBackspace,
  } = useTypingEngine({
    targetText: CPCT_TEST_TEXT,
    mode: 'practice',
    keyPress,
  });

  const { elapsed, remaining, isRunning, start } = useTimer({
    duration: TEST_DURATION,
    onComplete: () => {
      // Test time over
    },
  });

  // Auto-start timer on first keystroke
  useEffect(() => {
    if (currentIndex > 0 && !isRunning) {
      start();
    }
  }, [currentIndex, isRunning, start]);

  // Track backspace count
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        setBackspaceCount((c) => c + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Decompose target text for index mapping (same as typing engine does)
  const decomposedText = useMemo(
    () => decomposeTargetText(normalizeHindiText(CPCT_TEST_TEXT)),
    [],
  );

  // Pre-calculate grapheme to decomposed index mapping for MASSIVE performance improvement
  // This prevents recalculating decomposeTargetText for every grapheme on every render
  const graphemeToDecomposedIndex = useMemo(() => {
    const graphemes = splitIntoGraphemes(CPCT_TEST_TEXT);
    const mapping: number[] = [];

    for (let i = 0; i < graphemes.length; i++) {
      const prefixGraphemes = graphemes.slice(0, i);
      const prefixComposed = prefixGraphemes.join('');
      const prefixDecomposed = decomposeTargetText(
        normalizeHindiText(prefixComposed),
      );
      mapping.push(prefixDecomposed.length);
    }

    return mapping;
  }, []);

  // Recompose the typed text for display (fixes आ and कि not combining)
  const composedTypedText = useMemo(() => {
    return recomposeDecomposedText(typedText);
  }, [typedText]);

  // Check if we need to show explicit halant visualization
  const showExplicitHalant = useMemo(() => {
    if (needsDummyBackspace || composedTypedText.length < 2) return false;
    const HALANT = '\u094D';
    return composedTypedText[composedTypedText.length - 1] === HALANT;
  }, [composedTypedText, needsDummyBackspace]);

  // Map decomposed index to composed text position for highlighting in target passage
  const composedPassageHighlight = useMemo(() => {
    if (currentIndex === 0) return '';

    // Find the shortest prefix of CPCT_TEST_TEXT whose decomposition matches currentIndex
    let left = 0;
    let right = CPCT_TEST_TEXT.length;
    let result = '';

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const prefix = CPCT_TEST_TEXT.substring(0, mid);
      const decomposed = decomposeTargetText(normalizeHindiText(prefix));

      if (decomposed.length === currentIndex) {
        result = prefix;
        break;
      } else if (decomposed.length < currentIndex) {
        left = mid + 1;
      } else {
        result = prefix;
        right = mid - 1;
      }
    }

    return result;
  }, [currentIndex]);

  // Calculate word counts
  const totalWords = CPCT_TEST_TEXT.split(/\s+/).length;
  const typedWords = composedPassageHighlight
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
  const pendingWords = totalWords - typedWords;
  const keystrokeCount = currentIndex;

  // Format time as MM:SS
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm shrink-0">
        <div className="px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-semibold">Hindi Typing Actual Test</h1>
              <p className="text-xs text-muted-foreground">
                Question Type: Typing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span className="font-mono font-bold">
              Time Left: {formatTime(remaining)}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content - CPCT Style Split Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Side - Typing Area */}
        <div className="flex-1 flex flex-col p-6 overflow-hidden">
          {/* Target Text Box */}
          <Card className="flex-1 overflow-hidden mb-4">
            <CardContent className="p-6 h-full overflow-y-auto">
              <div className="text-lg leading-relaxed font-hindi relative">
                {/* Display ORIGINAL passage text using grapheme clusters, color based on typing correctness */}
                {splitIntoGraphemes(CPCT_TEST_TEXT).map(
                  (grapheme, graphemeIdx) => {
                    // Use pre-calculated mapping for MASSIVE performance improvement
                    const decompIdx = graphemeToDecomposedIndex[graphemeIdx];

                    if (decompIdx >= currentIndex) {
                      // Not typed yet - default color
                      return <span key={graphemeIdx}>{grapheme}</span>;
                    }

                    // Check if ANY character in this grapheme has an error
                    // A grapheme can span multiple decomposed characters (e.g., न + े = ने)
                    const nextDecompIdx =
                      graphemeToDecomposedIndex[graphemeIdx + 1] ||
                      decomposedText.length;
                    const graphemeLength = nextDecompIdx - decompIdx;

                    let hasError = false;
                    for (let i = 0; i < graphemeLength; i++) {
                      if (errors.includes(decompIdx + i)) {
                        hasError = true;
                        break;
                      }
                    }

                    return (
                      <span
                        key={graphemeIdx}
                        className={
                          hasError
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-green-600 dark:text-green-400'
                        }
                      >
                        {grapheme}
                      </span>
                    );
                  },
                )}
              </div>
            </CardContent>
          </Card>

          {/* Typing Input Display */}
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground mb-2">
                Your Typed Text:
              </div>
              <div
                className="p-3 bg-muted/50 rounded-lg min-h-[100px] font-hindi text-lg break-words whitespace-pre-wrap"
                style={
                  showExplicitHalant
                    ? {
                        fontFeatureSettings:
                          '"half" 0, "pres" 0, "abvs" 0, "blws" 0',
                      }
                    : undefined
                }
              >
                {composedTypedText || (
                  <span className="text-muted-foreground">Start typing...</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Analytics & Instructions */}
        <div className="w-80 border-l bg-muted/30 p-6 flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Test Statistics</h2>

          {/* Stats Grid */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center p-3 bg-background rounded-lg">
              <span className="text-sm text-muted-foreground">
                Keystroke Count
              </span>
              <span className="font-bold text-lg">{keystrokeCount}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-background rounded-lg">
              <span className="text-sm text-muted-foreground">Error Count</span>
              <span className="font-bold text-lg text-red-600 dark:text-red-400">
                {errors.length}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-background rounded-lg">
              <span className="text-sm text-muted-foreground">
                Backspace Count
              </span>
              <span className="font-bold text-lg text-orange-600 dark:text-orange-400">
                {backspaceCount}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-background rounded-lg">
              <span className="text-sm text-muted-foreground">
                Total Word Count
              </span>
              <span className="font-bold text-lg">{totalWords}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-background rounded-lg">
              <span className="text-sm text-muted-foreground">
                Typed Word Count
              </span>
              <span className="font-bold text-lg text-green-600 dark:text-green-400">
                {typedWords}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-background rounded-lg">
              <span className="text-sm text-muted-foreground">
                Pending Word Count
              </span>
              <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                {pendingWords}
              </span>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-auto">
            <h3 className="text-sm font-semibold mb-2">Instructions</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Type the highlighted word to proceed further</li>
              <li>• You can edit the text contents you have typed</li>
              <li>• Correct/Wrong words turn Green/Red respectively</li>
              <li>
                • It is mandatory to type the entire text contents to submit
              </li>
              <li>
                • Upon timeout, the system will automatically save all your
                responses
              </li>
            </ul>

            <div className="mt-4 p-3 bg-background rounded-lg">
              <p className="text-xs">
                <span className="font-semibold">Layout:</span> {currentLayoutId}
              </p>
              <p className="text-xs mt-1">
                <span className="font-semibold">Accuracy:</span>{' '}
                {currentStats.accuracy.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Test Complete Dialog would go here */}
    </div>
  );
}
