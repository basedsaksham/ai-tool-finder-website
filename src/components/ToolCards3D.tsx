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
      
      {/* Fixed position overlays */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Instructions */}
        <div className="absolute top-4 left-4 text-white/80">
          <p className="text-sm font-medium">🖱️ Move mouse to explore</p>
        </div>
        
        {/* Tool information cards - Fixed positions */}
        {visibleTools.map((tool, index) => {
          // Simple fixed positioning based on index
          const cols = 3;
          const rows = 2;
          const col = index % cols;
          const row = Math.floor(index / cols);
          
          const x = 20 + (col * 60 / cols);
          const y = 20 + (row * 60 / rows);
          
          return (
            <div
              key={`info-${tool.id}`}
              className={`absolute pointer-events-auto transition-all duration-300 ${
                highlightedTool === index ? 'scale-110 z-20' : 'z-10'
              }`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onMouseEnter={() => setHighlightedTool(index)}
              onMouseLeave={() => setHighlightedTool(null)}
              onClick={() => onToolClick?.(tool)}
            >
              <div className={`p-3 rounded-lg backdrop-blur-sm border cursor-pointer transition-all duration-300 ${
                highlightedTool === index 
                  ? 'bg-red-500/40 border-red-500/80 shadow-xl shadow-red-500/30' 
                  : 'bg-black/60 border-white/30 hover:bg-black/80'
              }`}>
                {/* Tool icon */}
                <div className="text-center text-2xl mb-2">
                  {getToolIcon(tool.name)}
                </div>
                
                {/* Tool name */}
                <h3 className="text-white font-semibold text-sm text-center mb-1">
                  {tool.name}
                </h3>
                
                {/* Category */}
                <p className="text-white/60 text-xs text-center mb-2">
                  {tool.category}
                </p>
                
                {/* Pricing */}
                <div className={`text-center text-xs px-2 py-1 rounded ${
                  tool.pricing.type === 'free' ? 'bg-green-500/30 text-green-300' :
                  tool.pricing.type === 'freemium' ? 'bg-blue-500/30 text-blue-300' :
                  'bg-orange-500/30 text-orange-300'
                }`}>
                  {tool.pricing.type === 'free' ? 'FREE' : 
                   tool.pricing.type === 'freemium' ? 'FREEMIUM' :
                   `$${tool.pricing.startingPrice}/mo`}
                </div>
                
                {/* Rating */}
                <div className="flex items-center justify-center gap-1 mt-2 text-xs">
                  <span className="text-yellow-400">★</span>
                  <span className="text-white/80">{tool.rating}</span>
                </div>
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
