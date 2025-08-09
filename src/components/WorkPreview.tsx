import React, { useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '16px',
  backgroundColor: 'rgba(21, 23, 28, 0.8)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  width: '500px',
  height: '500px',
  flexShrink: 0,
  '&:hover': {
    transform: 'translateY(-4px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    '& .cover-image': {
      transform: 'scale(1.05)',
    },
  },
}));

const ImageContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '380px',
  overflow: 'hidden',
  backgroundColor: '#1a1a1a',
});

const StyledImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.5s ease',
  display: 'block',
});

const PlaceholderBox = styled(Box)({
  width: '100%',
  height: '100%',
  backgroundColor: '#2a2a2a',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#666',
  fontSize: '14px',
});

const GradientOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 100%)',
  pointerEvents: 'none',
});

const ContentOverlay = styled(CardContent)({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  color: 'white',
  padding: '24px 28px',
  zIndex: 2,
  height: '120px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
});

interface WorkPreviewProps {
  title: string;
  subtitle: string;
  coverImage: string;
  href: string;
  onClick?: () => void;
}

const WorkPreview: React.FC<WorkPreviewProps> = ({
  title,
  subtitle,
  coverImage,
  href,
  onClick,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // For GitHub Pages, use relative path navigation
      const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/');
      const fullUrl = href.startsWith('http') ? href : baseUrl + href;
      window.open(fullUrl, '_blank');
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  // Get attribution based on the image
  const getAttribution = (imageUrl: string) => {
    if (imageUrl.includes('photo-1610300011228')) {
      return 'Product visualization by Tamara Harhai on Unsplash';
    } else if (imageUrl.includes('photo-1739961530627')) {
      return 'Product visualization by Aleksandrs Karevs on Unsplash';
    }
    return title;
  };

  return (
    <StyledCard onClick={handleClick}>
      <ImageContainer>
        {!imageError ? (
          <StyledImage
            src={coverImage}
            alt={getAttribution(coverImage)}
            className="cover-image"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          />
        ) : (
          <PlaceholderBox>
            <Typography variant="body2" color="inherit">
              {title}
            </Typography>
          </PlaceholderBox>
        )}
        
        {!imageLoaded && !imageError && (
          <PlaceholderBox>
            <Typography variant="body2" color="inherit">
              Loading...
            </Typography>
          </PlaceholderBox>
        )}
      </ImageContainer>
      
      <GradientOverlay />
      <ContentOverlay>
        <Typography
          variant="h5"
          component="h3"
          sx={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 600,
            fontSize: '1.5rem',
            mb: 1,
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1rem',
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </Typography>
      </ContentOverlay>
    </StyledCard>
  );
};

export default WorkPreview;