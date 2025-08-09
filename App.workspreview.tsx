import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import theme from './src/theme/theme';
import WorksGallery from './src/components/WorksGallery';

const createEmotionCache = () => {
  return createCache({
    key: 'mui',
    prepend: true,
  });
};

const emotionCache = createEmotionCache();

const App: React.FC = () => {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0e0f12 0%, #15171c 100%)',
          }}
        >
          <WorksGallery />
        </Box>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;