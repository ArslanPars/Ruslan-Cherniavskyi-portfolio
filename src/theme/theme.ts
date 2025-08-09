import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5eead4',
      light: '#7df3e1',
      dark: '#4dd4bd',
      contrastText: '#0e0f12',
    },
    secondary: {
      main: '#60a5fa',
      light: '#93c5fd',
      dark: '#3b82f6',
      contrastText: '#0e0f12',
    },
    background: {
      default: '#0e0f12',
      paper: '#15171c',
    },
    text: {
      primary: '#e6e7eb',
      secondary: '#a0a3b0',
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    common: {
      black: '#000000',
      white: '#ffffff',
    },
    divider: 'rgba(255, 255, 255, 0.1)',
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: {
      fontFamily: 'Space Grotesk, sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: 'Space Grotesk, sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: 'Space Grotesk, sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: 'Space Grotesk, sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: 'Space Grotesk, sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: 'Space Grotesk, sans-serif',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
});

export default theme;