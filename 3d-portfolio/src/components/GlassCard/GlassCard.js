import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 20px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

const GlassCard = ({ project }) => {
  return (
    <Card>
      <h3>{project.title}</h3>
      <img src={project.thumbnail} alt={project.title} style={{ width: '100%' }} />
    </Card>
  );
};

export default GlassCard;
