import {
  createSystem,
  defaultBaseConfig,
  defaultConfig,
  defineConfig,
} from '@chakra-ui/react';

const customConfig = defineConfig({
  strictTokens: true,
  cssVarsRoot: ':where(:root, :host)',
  cssVarsPrefix: 'ck',
  theme: {
    tokens: {
      sizes: {
        4: { value: '1rem' },
        8: { value: '2rem' },
        12: { value: '3rem' },
        16: { value: '4rem' },
      },
      colors: {
        brand: {
          50: { value: '#f0f9ff' },
          100: { value: '#e0f2fe' },
          200: { value: '#bae6fd' },
          300: { value: '#7dd3fc' },
          400: { value: '#38bdf8' },
          500: { value: '#0ea5e9' },
          600: { value: '#0284c7' },
          700: { value: '#0369a1' },
          800: { value: '#075985' },
          900: { value: '#0c4a6e' },
        },
        gray: {
          50: { value: '#f9fafb' },
          800: { value: '#1f2937' },
        },
      },
      fonts: {
        body: { value: 'system-ui, sans-serif' },
        heading: { value: 'system-ui, sans-serif' },
      },
      fontSizes: {
        sm: { value: '0.875rem' },
        md: { value: '1rem' },
        lg: { value: '1.125rem' },
        xl: { value: '1.25rem' },
        '2xl': { value: '1.5rem' },
      },
    },
    semanticTokens: {
      colors: {
        primary: { value: '{colors.brand.500}' },
        secondary: { value: '{colors.brand.600}' },
      },
    },
    breakpoints: {
      sm: '320px',
      md: '768px',
      lg: '960px',
      xl: '1200px',
    },
  },
  globalCss: {
    'html, body': {
      margin: 0,
      padding: 0,
      backgroundColor: '{colors.gray.50}',
      color: '{colors.gray.800}',
    },
  },
});

// export const system = createSystem(customConfig);
// export const system = createSystem(defaultBaseConfig, customConfig);
export const system = createSystem(defaultConfig, customConfig);
