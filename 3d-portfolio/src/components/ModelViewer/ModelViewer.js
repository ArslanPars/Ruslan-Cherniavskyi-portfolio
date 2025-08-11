import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

const Model = ({ url }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
};

const ModelViewer = ({ modelUrl }) => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Suspense fallback={null}>
        {modelUrl ? <Model url={modelUrl} /> : <mesh><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="hotpink" /></mesh>}
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
};

export default ModelViewer;
