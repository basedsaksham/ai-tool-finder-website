import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Mesh, Vector3, Color, BufferGeometry, BufferAttribute, Points as ThreePoints } from 'three';
import { AITool } from '@/types/tool';

// Simplified particle background
function ParticleBackground() {
  const pointsRef = useRef<ThreePoints>(null);
  const particleCount = 800;
  
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 25;
      positions[i3 + 1] = (Math.random() - 0.5) * 25;
      positions[i3 + 2] = (Math.random() - 0.5) * 25;
      
      // Simplified color scheme
      colors[i3] = 1; // Red
      colors[i3 + 1] = 0.2 + Math.random() * 0.3;
      colors[i3 + 2] = 0.2 + Math.random() * 0.3;
    }
    
    return { positions, colors };
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x += 0.001;
      pointsRef.current.rotation.y += 0.002;
    }
  });

  const geometry = useMemo(() => {
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.setAttribute('color', new BufferAttribute(colors, 3));
    return geometry;
  }, [positions, colors]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.015}
        vertexColors
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

// Stable camera controls
function StableCamera() {
  const { camera, mouse } = useThree();
  
  useFrame((state) => {
    // Gentle, predictable camera movement
    const targetX = mouse.x * 2;
    const targetY = mouse.y * 1;
    
    camera.position.x += (targetX - camera.position.x) * 0.02;
    camera.position.y += (targetY - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

interface ToolCard3DProps {
  tool: AITool;
  position: [number, number, number];
  onClick?: () => void;
  index: number;
  isHighlighted?: boolean;
}

function ToolCard3D({ tool, position, onClick, index, isHighlighted }: ToolCard3DProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Simple, stable rotation
      meshRef.current.rotation.y += delta * 0.2;
      
      // Gentle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + index * 2) * 0.1;
      
      // Simple scaling for highlights
      const targetScale = (hovered || isHighlighted) ? 1.1 : 1;
      meshRef.current.scale.lerp(new Vector3(targetScale, targetScale, targetScale), 0.1);
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
      {/* Main card */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <boxGeometry args={[2.2, 2.8, 0.3]} />
        <meshStandardMaterial
          color={hovered || isHighlighted ? '#E50914' : '#1a1a1a'}
          metalness={0.2}
          roughness={0.3}
        />
      </mesh>
      
      {/* Pricing indicator */}
      <mesh position={[0, -1, 0.16]}>
        <boxGeometry args={[2, 0.4, 0.1]} />
        <meshStandardMaterial
          color={getPricingColor()}
          emissive={getPricingColor()}
          emissiveIntensity={(hovered || isHighlighted) ? 0.3 : 0.1}
        />
      </mesh>
      
      {/* Glow effect */}
      {(hovered || isHighlighted) && (
        <mesh position={[0, 0, -0.1]}>
          <boxGeometry args={[2.4, 3, 0.1]} />
          <meshStandardMaterial
            color="#E50914"
            transparent
            opacity={0.3}
            emissive="#E50914"
            emissiveIntensity={0.5}
          />
        </mesh>
      )}
    </group>
  );
}

interface ToolCards3DProps {
  tools: AITool[];
  onToolClick?: (tool: AITool) => void;
}

const ToolCards3D = ({ tools, onToolClick }: ToolCards3DProps) => {
  const visibleTools = tools.slice(0, 6);
  const [highlightedTool, setHighlightedTool] = useState<number | null>(null);

  // Fixed card positions in a circle
  const cardPositions = useMemo(() => {
    return visibleTools.map((_, index) => {
      const angle = (index / visibleTools.length) * Math.PI * 2;
      const radius = 4;
      return [
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ] as [number, number, number];
    });
  }, [visibleTools.length]);

  // Get tool icon
  const getToolIcon = (toolName: string) => {
    const iconMap: { [key: string]: string } = {
      'ChatGPT': '🤖',
      'MidJourney': '🎨',
      'GitHub Copilot': '👨‍💻',
      'Runway ML': '🎬',
      'Notion AI': '📝',
      'Claude': '🧠'
    };
    return iconMap[toolName] || '⭐';
  };

  return (
    <div className="h-96 w-full relative overflow-hidden rounded-xl">
      {/* 3D Canvas */}
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #2a1a1a 100%)' }}
      >
        <ParticleBackground />
        
        {/* Stable lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.4} color="#E50914" />
        
        <StableCamera />
        
        {/* Tool cards */}
        {visibleTools.map((tool, index) => (
          <ToolCard3D
            key={tool.id}
            tool={tool}
            position={cardPositions[index]}
            onClick={() => onToolClick?.(tool)}
            index={index}
            isHighlighted={highlightedTool === index}
          />
        ))}
      </Canvas>
      
      {/* Card Labels and Logos - Positioned directly on 3D cards */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Instructions */}
        <div className="absolute top-4 left-4 text-white/80">
          <p className="text-sm font-medium">🖱️ Move mouse to explore</p>
        </div>

        {/* Tool labels projected onto 3D cards */}
        {visibleTools.map((tool, index) => {
          const position = cardPositions[index];

          // Calculate screen position based on 3D card position
          const screenX = 50 + (position[0] / 8) * 40; // Convert 3D X to screen percentage
          const screenY = 50 - (position[2] / 8) * 40; // Convert 3D Z to screen percentage
          const scale = 1 - Math.abs(position[2]) / 12; // Scale based on depth
          const opacity = Math.max(0.7, 1 - Math.abs(position[2]) / 10);

          return (
            <div
              key={`label-${tool.id}`}
              className={`absolute pointer-events-auto transition-all duration-300 ${
                highlightedTool === index ? 'z-30' : 'z-20'
              }`}
              style={{
                left: `${screenX}%`,
                top: `${screenY}%`,
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity: opacity,
              }}
              onMouseEnter={() => setHighlightedTool(index)}
              onMouseLeave={() => setHighlightedTool(null)}
              onClick={() => onToolClick?.(tool)}
            >
              {/* Card content directly on the 3D card */}
              <div className={`relative w-32 h-40 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                highlightedTool === index ? 'scale-110' : ''
              }`}>

                {/* Tool Logo/Icon */}
                <div className={`text-4xl mb-2 transition-all duration-300 ${
                  highlightedTool === index ? 'scale-125 animate-bounce' : ''
                }`}>
                  {getToolIcon(tool.name)}
                </div>

                {/* Tool Name */}
                <h3 className={`font-bold text-sm mb-1 transition-all duration-300 ${
                  highlightedTool === index
                    ? 'text-red-300 text-base'
                    : 'text-white'
                }`}>
                  {tool.name}
                </h3>

                {/* Category */}
                <p className={`text-xs mb-2 transition-colors duration-300 ${
                  highlightedTool === index ? 'text-red-200' : 'text-white/60'
                }`}>
                  {tool.category}
                </p>

                {/* Pricing Badge */}
                <div className={`px-2 py-1 rounded text-xs font-medium transition-all duration-300 ${
                  tool.pricing.type === 'free'
                    ? 'bg-green-500/40 text-green-200 border border-green-400/30' :
                  tool.pricing.type === 'freemium'
                    ? 'bg-blue-500/40 text-blue-200 border border-blue-400/30' :
                    'bg-orange-500/40 text-orange-200 border border-orange-400/30'
                } ${highlightedTool === index ? 'scale-110 shadow-lg' : ''}`}>
                  {tool.pricing.type === 'free' ? 'FREE' :
                   tool.pricing.type === 'freemium' ? 'FREEMIUM' :
                   `$${tool.pricing.startingPrice}/mo`}
                </div>

                {/* Rating */}
                <div className={`flex items-center gap-1 mt-1 text-xs transition-all duration-300 ${
                  highlightedTool === index ? 'text-yellow-300 scale-110' : 'text-yellow-400'
                }`}>
                  <span>★</span>
                  <span className="text-white/80">{tool.rating}</span>
                </div>

                {/* Highlight overlay */}
                {highlightedTool === index && (
                  <div className="absolute inset-0 border-2 border-red-500/60 rounded-lg bg-red-500/10 backdrop-blur-sm animate-pulse" />
                )}
              </div>
            </div>
          );
        })}
        
        {/* Bottom tool list for reference */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex gap-2 flex-wrap justify-center max-w-lg">
            {visibleTools.map((tool, index) => (
              <span
                key={`ref-${tool.id}`}
                className={`text-xs px-2 py-1 rounded-full transition-all duration-300 cursor-pointer ${
                  highlightedTool === index
                    ? 'bg-red-500/40 text-white border border-red-500/60'
                    : 'bg-black/40 text-white/70 border border-white/20'
                }`}
                onMouseEnter={() => setHighlightedTool(index)}
                onMouseLeave={() => setHighlightedTool(null)}
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
