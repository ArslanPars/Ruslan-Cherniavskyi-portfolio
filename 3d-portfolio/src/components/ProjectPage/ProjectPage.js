import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { projects } from '../../projects';
import ModelViewer from '../ModelViewer/ModelViewer';

const ProjectContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProjectGallery = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;

  img {
    max-width: 100%;
    height: auto;
    max-height: 400px;
  }
`;

const ModelContainer = styled.div`
  width: 80%;
  height: 500px;
  margin-top: 20px;
`;

const ProjectPage = () => {
  const { id } = useParams();
  const project = projects.find(p => p.id === parseInt(id));

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <ProjectContainer>
      <h2>{project.title}</h2>
      <ProjectGallery>
        {project.images.map((image, index) => (
          <img key={index} src={image} alt={`${project.title} screenshot ${index + 1}`} />
        ))}
      </ProjectGallery>
      <ModelContainer>
        <ModelViewer modelUrl={project.model} />
      </ModelContainer>
    </ProjectContainer>
  );
};

export default ProjectPage;
