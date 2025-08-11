import React from 'react';

const ArtStationIcon = ({ width = '24', height = '24' }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="currentColor">
      <rect width="24" height="24" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2"/>
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="14" fill="currentColor">A</text>
    </svg>
  );
};

export default ArtStationIcon;
