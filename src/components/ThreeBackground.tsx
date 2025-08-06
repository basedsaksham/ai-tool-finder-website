import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';

const Particles = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  // Create particle geometry
  const particlesData = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    const colors = new Float32Array(2000 * 3);
    
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
      
      // Purple gradient colors
      const color = new THREE.Color();
      color.setHSL(0.73 + Math.random() * 0.1, 0.7, 0.5 + Math.random() * 0.3);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return { positions, colors };
  }, []);

  // Mouse movement handler
  const handleMouseMove = (event: MouseEvent) => {
    mousePosition.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    mousePosition.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };

  // Animation loop
  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Rotate based on mouse position
      pointsRef.current.rotation.x = time * 0.1 + mousePosition.current.y * 0.1;
      pointsRef.current.rotation.y = time * 0.05 + mousePosition.current.x * 0.1;
      
      // Pulsing effect
      const scale = 1 + Math.sin(time * 0.5) * 0.1;
      pointsRef.current.scale.setScalar(scale);
    }
  });

  // Add event listener for mouse movement
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={particlesData.positions}
          count={2000}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={particlesData.colors}
          count={2000}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.8}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const FloatingShapes = () => {
  const shapesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (shapesRef.current) {
      const time = state.clock.getElapsedTime();
      shapesRef.current.rotation.x = time * 0.02;
      shapesRef.current.rotation.y = time * 0.01;
    }
  });

  return (
    <group ref={shapesRef}>
      {/* Floating geometric shapes */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 80,
          ] as [number, number, number]}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
        >
          {Math.random() > 0.5 ? (
            <boxGeometry args={[2, 2, 2]} />
          ) : (
            <octahedronGeometry args={[1.5]} />
          )}
          <meshBasicMaterial
            color={new THREE.Color().setHSL(0.73, 0.7, 0.3)}
            transparent
            opacity={0.1}
            wireframe
          />
        </mesh>
      ))}
    </group>
  );
};

interface ThreeBackgroundProps {
  className?: string;
}

const ThreeBackground = ({ className = "" }: ThreeBackgroundProps) => {
  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 30] as [number, number, number], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <Particles />
        <FloatingShapes />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;