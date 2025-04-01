import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const customConfig = defineConfig({
  cssVarsRoot: ':where(:root, :host)',
  cssVarsPrefix: 'ck',
  theme: {
    tokens: {
      colors: {
        brand: {
          primary: { value: '#FF69B4' },
          secondary: { value: '#FFB6C1' },
          accent: { value: '#FFC0CB' },
        },
        gray: {
          50: { value: '#F7FAFC' },
          100: { value: '#EDF2F7' },
          200: { value: '#E2E8F0' },
          300: { value: '#CBD5E0' },
          400: { value: '#A0AEC0' },
          500: { value: '#718096' },
          600: { value: '#4A5568' },
          700: { value: '#2D3748' },
          800: { value: '#1A202C' },
          900: { value: '#171923' },
        },
      },
      fonts: {
        body: { value: 'system-ui, sans-serif' },
        heading: { value: 'Georgia, serif' },
        mono: { value: 'Menlo, monospace' },
      },
      fontSizes: {
        xs: { value: '0.75rem' },
        sm: { value: '0.875rem' },
        md: { value: '1rem' },
        lg: { value: '1.125rem' },
        xl: { value: '1.25rem' },
        '2xl': { value: '1.5rem' },
        '3xl': { value: '1.875rem' },
        '4xl': { value: '2.25rem' },
        '5xl': { value: '3rem' },
        '6xl': { value: '3.75rem' },
        '7xl': { value: '4.5rem' },
        '8xl': { value: '6rem' },
        '9xl': { value: '8rem' },
      },
    },
    semanticTokens: {
      colors: {
        background: {
          value: {
            base: '{colors.gray.50}',
            _dark: '{colors.gray.900}',
          },
        },
        text: {
          value: {
            base: '{colors.gray.900}',
            _dark: '{colors.gray.50}',
          },
        },
      },
    },
    breakpoints: {
      sm: '30em',
      md: '48em',
      lg: '62em',
      xl: '80em',
      '2xl': '96em',
    },
  },
});

export const theme = createSystem(defaultConfig, customConfig);
