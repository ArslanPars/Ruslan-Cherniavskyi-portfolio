import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
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
  '&:hover': {
    transform: 'translateY(-4px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    '& .cover-image': {
      transform: 'scale(1.05)',
    },
  },
}));

const StyledCardMedia = styled(CardMedia)({
  height: 240,
  transition: 'transform 0.5s ease',
});

const GradientOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.1) 50%, transparent 100%)',
  pointerEvents: 'none',
});

const ContentOverlay = styled(CardContent)({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  color: 'white',
  padding: '16px 20px',
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
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.open(href, '_blank');
    }
  };

  return (
    <StyledCard onClick={handleClick}>
      <StyledCardMedia
        className="cover-image"
        image={coverImage}
        title={title}
      />
      <GradientOverlay />
      <ContentOverlay>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 600,
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            mb: 0.5,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.875rem',
          }}
        >
          {subtitle}
        </Typography>
      </ContentOverlay>
    </StyledCard>
  );
};

export default WorkPreview;