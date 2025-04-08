import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

// --- 1. Define Watercolor-Inspired Color Palette ---
// Aiming for softer, slightly muted tones commonly found in watercolor palettes.
// Keeping your primary green scale but adjusting some others.
const colors = {
  // Primary Green Scale (Kept from original, good base)
  primary: {
    '50': { value: '#f0fdf4' }, // Very light green wash
    '100': { value: '#dcfce7' },
    '200': { value: '#bbf7d0' }, // Soft pastel green
    '300': { value: '#86efac' },
    '400': { value: '#4ade80' }, // Mid-tone green
    '500': { value: '#109065' },
    '600': { value: '#059669' }, // Darker shade
    '700': { value: '#047857' },
    '800': { value: '#065f46' },
    '900': { value: '#064e3b' }, // Deepest green shadow
  },
  // Secondary / Accent Colors (Watercolor Inspired)
  skyBlue: {
    '100': { value: '#e0f2fe' }, // Lightest wash
    '300': { value: '#bae6fd' },
    '500': { value: '#38bdf8' }, // Muted sky blue
    '700': { value: '#0284c7' },
  },
  lavender: {
    '100': { value: '#f5f3ff' }, // Lightest wash
    '300': { value: '#ddd6fe' }, // Soft lavender
    '500': { value: '#a78bfa' }, // Muted purple
    '700': { value: '#7c3aed' },
  },
  sunflower: {
    // Keep for warmth, maybe slightly less saturated
    '100': { value: '#fefce8' },
    '300': { value: '#fef08a' },
    '500': { value: '#facc15' }, // Slightly softer yellow: '#f7c948' could be an option
    '700': { value: '#ca8a04' },
  },
  terracotta: {
    // Muted, earthy red/orange for danger/accents
    '100': { value: '#fef2f2' },
    '300': { value: '#fecaca' },
    '500': { value: '#f87171' }, // Muted red: '#e86c6c' or keep original '#AD3623' if a stronger tone is needed
    '700': { value: '#b91c1c' },
  },
  // Neutral Grays (Essential for UI)
  neutral: {
    '50': { value: '#f8fafc' }, // Near white, subtle background variation
    '100': { value: '#f1f5f9' }, // Light gray background
    '200': { value: '#e2e8f0' }, // Subtle borders, dividers
    '300': { value: '#cbd5e1' }, // Lighter text, disabled states
    '400': { value: '#94a3b8' }, // Muted text
    '500': { value: '#64748b' }, // Standard text (alternative to charcoal if too harsh)
    '600': { value: '#475569' },
    '700': { value: '#334155' }, // Darker elements
    '800': { value: '#1e293b' }, // Near black
    '900': { value: '#0f172a' }, // Deepest tone
  },
  charcoal: { value: '#22222a' }, // Keep for primary text if high contrast needed
  white: { value: '#ffffff' },
  black: { value: '#000000' },
};

// --- 2. Define Mobile-First Typography ---
const fonts = {
  body: {
    value:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
  }, // System fonts are performant and feel native
  heading: { value: 'Georgia, serif' }, // Or a friendly sans-serif like 'Poppins', 'Montserrat'
  // Add more font families if needed (e.g., mono for code)
};

// Start with mobile-friendly sizes, increase via breakpoints later if needed in components
const fontSizes = {
  xs: { value: '0.75rem' }, // 12px
  sm: { value: '0.875rem' }, // 14px
  md: { value: '1rem' }, // 16px (base body size)
  lg: { value: '1.125rem' }, // 18px
  xl: { value: '1.25rem' }, // 20px
  '2xl': { value: '1.5rem' }, // 24px
  '3xl': { value: '1.875rem' }, // 30px
  '4xl': { value: '2.25rem' }, // 36px
  // Add larger sizes for headings as needed
};

const fontWeights = {
  normal: { value: 400 },
  medium: { value: 500 },
  semibold: { value: 600 },
  bold: { value: 700 },
};

// Line heights for readability
const lineHeights = {
  normal: { value: 'normal' },
  none: { value: 1 },
  shorter: { value: 1.25 },
  short: { value: 1.375 },
  base: { value: 1.5 }, // Good base for body text
  tall: { value: 1.625 },
  taller: { value: 2 },
};

// --- 3. Spacing Scale (Mobile First) ---
// Based on a 4px grid (common practice)
const spacing = {
  '1': { value: '0.25rem' }, // 4px
  '2': { value: '0.5rem' }, // 8px
  '3': { value: '0.75rem' }, // 12px
  '4': { value: '1rem' }, // 16px (common base padding/margin)
  '5': { value: '1.25rem' }, // 20px
  '6': { value: '1.5rem' }, // 24px
  '8': { value: '2rem' }, // 32px
  '10': { value: '2.5rem' }, // 40px
  '12': { value: '3rem' }, // 48px
  '16': { value: '4rem' }, // 64px
  '20': { value: '5rem' }, // 80px
};

// --- 4. Radii and Shadows (Watercolor Feel) ---
const radii = {
  none: { value: '0' },
  sm: { value: '0.125rem' }, // 2px
  md: { value: '0.375rem' }, // 6px (Subtle rounding)
  lg: { value: '0.5rem' }, // 8px (More pronounced rounding)
  full: { value: '9999px' }, // Pill shape
};

// Soft shadows complement the watercolor style
const shadows = {
  sm: { value: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
  md: { value: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }, // Softer default shadow
  lg: { value: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' },
  // Add inner shadows or colored shadows if needed for specific effects
};

// --- 5. Breakpoints (Mobile First) ---
// Chakra's defaults are generally good mobile-first breakpoints
const breakpoints = {
  sm: { value: '30em' }, // ~480px
  md: { value: '48em' }, // ~768px
  lg: { value: '62em' }, // ~992px
  xl: { value: '80em' }, // ~1280px
  '2xl': { value: '96em' }, // ~1536px
};

// --- Define the Custom Configuration ---
const customConfig = defineConfig({
  cssVarsRoot: ':where(:root, :host)',
  cssVarsPrefix: 'ck', // Keep your prefix
  theme: {
    // Direct Tokens (Foundation)
    tokens: {
      colors,
      fonts,
      fontSizes,
      fontWeights,
      lineHeights,
      spacing,
      radii,
      shadows,
      breakpoints,
      // letterSpacings, zIndices etc. can be added if needed
    },
    // Semantic Tokens (Intent-Based)
    semanticTokens: {
      colors: {
        // Backgrounds
        'bg.default': { value: '{colors.white}' }, // Pure white default bg
        'bg.subtle': { value: '{colors.neutral.50}' }, // Very light gray for subtle contrast
        'bg.muted': { value: '{colors.neutral.100}' }, // Slightly darker gray bg
        'bg.canvas': { value: '{colors.neutral.50}' }, // For elements on top of default bg

        // Text
        'text.default': { value: '{colors.charcoal}' }, // High contrast text
        'text.muted': { value: '{colors.neutral.500}' }, // Lower contrast text
        'text.subtle': { value: '{colors.neutral.400}' }, // Even lower contrast
        'text.onPrimary': { value: '{colors.white}' }, // Text on primary color bg
        'text.placeholder': { value: '{colors.neutral.400}' },

        // Borders
        'border.default': { value: '{colors.neutral.200}' },
        'border.subtle': { value: '{colors.neutral.100}' },
        'border.outline': { value: '{colors.primary.500}' }, // For focus rings etc.

        // Primary Action Colors
        'primary.default': { value: '{colors.primary.500}' },
        'primary.hover': { value: '{colors.primary.600}' },
        'primary.active': { value: '{colors.primary.700}' },
        'primary.subtle': { value: '{colors.primary.100}' }, // Lighter primary variant
        'primary.text': { value: '{colors.primary.700}' }, // Primary color used for text

        // Secondary / Accent (Example using Sky Blue)
        'secondary.default': { value: '{colors.skyBlue.500}' },
        'secondary.hover': { value: '{colors.skyBlue.700}' },
        'secondary.subtle': { value: '{colors.skyBlue.100}' },
        'secondary.text': { value: '{colors.skyBlue.700}' },

        // Status Colors
        'success.default': { value: '{colors.primary.300}' }, // Using a lighter primary green for success
        'success.subtle': { value: '{colors.primary.100}' },
        'success.text': { value: '{colors.primary.700}' },

        'warning.default': { value: '{colors.sunflower.500}' },
        'warning.subtle': { value: '{colors.sunflower.100}' },
        'warning.text': { value: '{colors.sunflower.700}' },

        'danger.default': { value: '{colors.terracotta.500}' }, // Using the muted red
        'danger.subtle': { value: '{colors.terracotta.100}' },
        'danger.text': { value: '{colors.terracotta.700}' },

        // Links
        'link.default': { value: '{colors.primary.600}' },
        'link.hover': { value: '{colors.primary.700}' },

        // Focus Ring
        'focus.color': { value: '{colors.primary.500}' }, // Color for focus outlines
      },
      shadows: {
        focus: { value: '0 0 0 3px {colors.focus.color}' }, // Example focus shadow using semantic color
        card: { value: '{shadows.md}' }, // Default shadow for cards
      },
      // Add semantic tokens for spacing, radii etc. if needed for consistency
      // e.g., 'spacing.cardPadding': { value: '{space.4}' }
    },
    // --- 6. (Optional) Component Styles ---
    // You can define base styles or variants for specific components here
    // This helps ensure consistency with the watercolor/mobile-first theme
    // Example:
    // components: {
    //   Button: {
    //     baseStyle: {
    //       borderRadius: 'md', // Use token
    //       fontWeight: 'medium', // Use token
    //     },
    //     variants: {
    //       solid: (props) => ({ // Use semantic tokens for color mode compatibility
    //          bg: props.colorScheme === 'primary' ? 'primary.default' : undefined,
    //          color: props.colorScheme === 'primary' ? 'text.onPrimary' : undefined,
    //         _hover: {
    //           bg: props.colorScheme === 'primary' ? 'primary.hover' : undefined,
    //         }
    //       }),
    //       outline: {
    //         borderColor: 'border.default',
    //         color: 'text.muted',
    //         _hover: {
    //           bg: 'bg.subtle'
    //         }
    //       }
    //     },
    //     defaultProps: {
    //       colorScheme: 'primary', // Default button to use primary color scheme
    //     }
    //   },
    //   Card: { // Assuming you use a Card component
    //      baseStyle: {
    //         borderRadius: 'lg', // Softer edges
    //         boxShadow: 'card', // Use semantic shadow
    //         bg: 'bg.default',
    //         borderWidth: '1px',
    //         borderColor: 'border.subtle'
    //      }
    //   }
    // }
  },
});

// --- Create the System ---
export const theme = createSystem(defaultConfig, customConfig);
export default theme;
