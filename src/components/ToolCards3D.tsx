import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import { Mesh } from 'three';
import { AITool } from '@/types/tool';

interface ToolCard3DProps {
  tool: AITool;
  position: [number, number, number];
  onClick?: () => void;
}

function ToolCard3D({ tool, position, onClick }: ToolCard3DProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.scale.set(
        hovered ? 1.1 : 1,
        hovered ? 1.1 : 1,
        hovered ? 1.1 : 1
      );
    }
  });

  const getPricingColor = () => {
    switch (tool.pricing.type) {
      case 'free': return '#22c55e';
      case 'freemium': return '#3b82f6';
      case 'paid': return '#f97316';
      default: return '#a855f7';
    }
  };

  return (
    <group position={position}>
      <Box
        ref={meshRef}
        args={[2, 2.5, 0.2]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <meshStandardMaterial color={hovered ? '#E50914' : '#1a1a1a'} />
      </Box>

      <Box args={[1.6, 0.3, 0.05]} position={[0, -0.8, 0.11]}>
        <meshStandardMaterial color={getPricingColor()} />
      </Box>
    </group>
  );
}

interface ToolCards3DProps {
  tools: AITool[];
  onToolClick?: (tool: AITool) => void;
}

const ToolCards3D = ({ tools, onToolClick }: ToolCards3DProps) => {
  const visibleTools = tools.slice(0, 6); // Show first 6 tools

  return (
    <div className="h-96 w-full">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <pointLight position={[-10, -10, -10]} color="#E50914" intensity={0.5} />
        
        {visibleTools.map((tool, index) => {
          const angle = (index / visibleTools.length) * Math.PI * 2;
          const radius = 4;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          
          return (
            <ToolCard3D
              key={tool.id}
              tool={tool}
              position={[x, 0, z]}
              onClick={() => onToolClick?.(tool)}
            />
          );
        })}
      </Canvas>
    </div>
  );
};

export default ToolCards3D;
