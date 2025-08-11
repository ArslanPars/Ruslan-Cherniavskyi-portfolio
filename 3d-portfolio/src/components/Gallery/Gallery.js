import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import GlassCard from '../GlassCard/GlassCard';
import { projects } from '../../projects';

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const Gallery = () => {
  return (
    <GalleryGrid>
      {projects.map(project => (
        <Link to={`/project/${project.id}`} key={project.id}>
          <GlassCard project={project} />
        </Link>
      ))}
    </GalleryGrid>
  );
};

export default Gallery;
