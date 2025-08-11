import React from 'react';

const LinkedInIcon = ({ width = '24', height = '24' }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 34 34" fill="currentColor">
      <g>
        <path d="M34,2.5v29A2.5,2.5,0,0,1,31.5,34H2.5A2.5,2.5,0,0,1,0,31.5V2.5A2.5,2.5,0,0,1,2.5,0h29A2.5,2.5,0,0,1,34,2.5ZM10,13H5V29h5Zm-2.5-6.2A2.8,2.8,0,1,0,4.7,4,2.8,2.8,0,0,0,7.5,6.8ZM29,19.28c0-4.81-3.06-6.68-6.1-6.68a5.7,5.7,0,0,0-5.07,2.58H17.7V13H13V29h5V20.49a3.32,3.32,0,0,1,3-3.58h.19c1.59,0,2.77,1,2.77,3.52V29h5Z" />
      </g>
    </svg>
  );
};

export default LinkedInIcon;
