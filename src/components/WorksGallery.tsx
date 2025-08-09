import React from 'react';
import { Container, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import WorkPreview from './WorkPreview';

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: '4rem 2rem',
  maxWidth: '1200px',
}));

const GalleryGrid = styled(Stack)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '1.5rem',
  marginTop: '2rem',
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
  },
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontFamily: 'Space Grotesk, sans-serif',
  fontSize: '2rem',
  fontWeight: 700,
  color: '#e6e7eb',
  marginBottom: '1.5rem',
}));

interface Work {
  id: string;
  title: string;
  subtitle: string;
  coverImage: string;
  href: string;
}

const worksData: Work[] = [
  {
    id: 'perfume',
    title: 'Pure Dreamer',
    subtitle: 'Product visualisation · Blender · CAD',
    coverImage: '/assets/works/perfume/cover.jpg',
    href: '/assets/works/perfume.html',
  },
  {
    id: 'loreal',
    title: "L'Oréal Paris Visualization",
    subtitle: 'Product visualisation · Blender · CAD',
    coverImage: '/assets/works/loreal/cover.png',
    href: '/assets/works/loreal.html',
  },
];

const WorksGallery: React.FC = () => {
  return (
    <StyledContainer id="works">
      <SectionTitle variant="h2" component="h2">
        Works
      </SectionTitle>
      
      <GalleryGrid>
        {worksData.map((work) => (
          <WorkPreview
            key={work.id}
            title={work.title}
            subtitle={work.subtitle}
            coverImage={work.coverImage}
            href={work.href}
          />
        ))}
      </GalleryGrid>
    </StyledContainer>
  );
};

export default WorksGallery;