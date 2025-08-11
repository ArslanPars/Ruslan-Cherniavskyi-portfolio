import React from 'react';
import styled from 'styled-components';
import UpworkIcon from '../Icons/UpworkIcon';
import LinkedInIcon from '../Icons/LinkedInIcon';
import XIcon from '../Icons/XIcon';
import ArtStationIcon from '../Icons/ArtStationIcon';

const FooterContainer = styled.footer`
  padding: 20px;
  text-align: center;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;

  a {
    color: white;
    transition: color 0.2s ease-in-out;

    &:hover {
      color: #6fda44; // A highlight color
    }
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <SocialLinks>
        <a href="https://upwork.com/freelancers/ruslanchernianskiy" target="_blank" rel="noopener noreferrer">
          <UpworkIcon />
        </a>
        <a href="https://www.linkedin.com/in/ruslan-chernianskiy-6b772022a" target="_blank" rel="noopener noreferrer">
          <LinkedInIcon />
        </a>
        <a href="https://x.com/Chernianskiy" target="_blank" rel="noopener noreferrer">
          <XIcon />
        </a>
        <a href="https://www.artstation.com/chernianskiy" target="_blank" rel="noopener noreferrer">
          <ArtStationIcon />
        </a>
      </SocialLinks>
    </FooterContainer>
  );
};

export default Footer;
