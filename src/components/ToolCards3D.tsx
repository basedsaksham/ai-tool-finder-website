import { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Mesh, BoxGeometry, MeshStandardMaterial } from 'three';
import { AITool } from '@/types/tool';

interface CameraControlsProps {}

function CameraControls({}: CameraControlsProps) {
  useFrame((state) => {
    state.camera.position.x = Math.cos(state.clock.elapsedTime * 0.2) * 8;
    state.camera.position.z = Math.sin(state.clock.elapsedTime * 0.2) * 8;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

interface ToolCard3DProps {
  tool: AITool;
  position: [number, number, number];
  onClick?: () => void;
}

function ToolCard3D({ tool, position, onClick }: ToolCard3DProps) {
  const meshRef = useRef<Mesh>(null);
  const pricingRef = useRef<Mesh>(null);
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
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <boxGeometry args={[2, 2.5, 0.2]} />
        <meshStandardMaterial color={hovered ? '#E50914' : '#1a1a1a'} />
      </mesh>

      <mesh ref={pricingRef} position={[0, -0.8, 0.11]}>
        <boxGeometry args={[1.6, 0.3, 0.05]} />
        <meshStandardMaterial color={getPricingColor()} />
      </mesh>
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
    <div className="h-96 w-full relative">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <CameraControls />
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} color="#E50914" intensity={0.4} />
        <pointLight position={[0, 10, -10]} color="#3b82f6" intensity={0.3} />

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

      {/* Overlay with tool names */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 text-sm mb-2">Click and drag to explore</p>
          <div className="flex flex-wrap justify-center gap-2 max-w-md">
            {visibleTools.map((tool) => (
              <span
                key={tool.id}
                className="text-xs bg-black/30 text-white/80 px-2 py-1 rounded"
              >
                {tool.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolCards3D;
