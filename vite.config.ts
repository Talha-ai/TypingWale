import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import obfuscator from 'vite-plugin-javascript-obfuscator';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // Only obfuscate in production builds
    mode === 'production' &&
      obfuscator({
        include: [
          'src/data/keyboardMappings.ts', // Obfuscate keyboard mappings
          'src/utils/**/*.ts',
          'src/hooks/**/*.ts',
        ],
        exclude: [/node_modules/],
        apply: 'build',
        options: {
          compact: true,
          controlFlowFlattening: true,
          controlFlowFlatteningThreshold: 0.75,
          deadCodeInjection: true,
          deadCodeInjectionThreshold: 0.4,
          debugProtection: false, // Don't break debugging completely
          debugProtectionInterval: 0,
          disableConsoleOutput: false,
          identifierNamesGenerator: 'hexadecimal',
          log: false,
          numbersToExpressions: true,
          renameGlobals: false,
          selfDefending: true, // Makes code harder to format/beautify
          simplify: true,
          splitStrings: true,
          splitStringsChunkLength: 10,
          stringArray: true,
          stringArrayCallsTransform: true,
          stringArrayEncoding: ['base64'],
          stringArrayIndexShift: true,
          stringArrayRotate: true,
          stringArrayShuffle: true,
          stringArrayWrappersCount: 2,
          stringArrayWrappersChainedCalls: true,
          stringArrayWrappersParametersMaxCount: 4,
          stringArrayWrappersType: 'function',
          stringArrayThreshold: 0.75,
          transformObjectKeys: true,
          unicodeEscapeSequence: false,
        },
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: './', // Use relative paths for Electron
  build: {
    target: 'chrome120', // Match Electron 28's Chromium version
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          'typing-engine': [
            './src/hooks/useTypingEngine',
            './src/utils/hindiUtils',
            './src/utils/statsCalculator',
          ],
        },
      },
    },
  },
  server: {
    port: 1233, // Changed from 3000 to match Electron configuration
  },
}));
