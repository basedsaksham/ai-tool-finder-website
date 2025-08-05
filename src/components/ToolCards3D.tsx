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

// Stable camera controls with position tracking
function StableCamera({ onCameraUpdate }: { onCameraUpdate?: (position: Vector3) => void }) {
  const { camera, mouse } = useThree();

  useFrame((state) => {
    // Gentle, predictable camera movement
    const targetX = mouse.x * 1.5;
    const targetY = mouse.y * 0.8;

    camera.position.x += (targetX - camera.position.x) * 0.03;
    camera.position.y += (targetY - camera.position.y) * 0.03;
    camera.position.z = 8; // Keep camera at fixed distance
    camera.lookAt(0, 0, 0);

    // Update parent with camera position
    onCameraUpdate?.(camera.position);
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
  const [cameraPos, setCameraPos] = useState(new Vector3(0, 0, 8));

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

  // Get tool logo component
  const getToolLogo = (toolName: string) => {
    const logoComponents: { [key: string]: JSX.Element } = {
      'ChatGPT': (
        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-white fill-current">
            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
          </svg>
        </div>
      ),
      'MidJourney': (
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-xl flex items-center justify-center">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-blue-600 rounded-md"></div>
          </div>
        </div>
      ),
      'GitHub Copilot': (
        <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-white fill-current">
            <path d="M12 0c6.63 0 12 5.37 12 12 0 5.31-3.44 9.82-8.2 11.4-.6-.55-.93-1.33-.93-2.2v-1.96c0-.67-.23-1.14-.69-1.4 2.24-.25 4.6-1.1 4.6-4.97 0-1.1-.39-2-.73-2.62.1-.25.32-1.29-.09-2.69 0 0-.84-.27-2.75 1.02-.8-.22-1.65-.33-2.5-.33-.85 0-1.7.11-2.5.33C8.82 8.43 7.98 8.7 7.98 8.7c-.41 1.4-.19 2.44-.09 2.69-.73.62-.73 1.52-.73 2.62 0 3.86 2.35 4.72 4.58 4.97-.29.25-.54.69-.63 1.34-.57.26-2.01.69-2.91-.83 0 0-.53-.96-1.53-1.03 0 0-.98-.01-.07.61 0 0 .65.31 1.1 1.46 0 0 .59 1.78 3.36 1.18v1.85c0 .87-.33 1.65-.93 2.2C3.44 21.82 0 17.31 0 12 0 5.37 5.37 0 12 0z"/>
          </svg>
        </div>
      ),
      'Runway ML': (
        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
          <div className="text-white font-bold text-lg">R</div>
        </div>
      ),
      'Notion AI': (
        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
          <div className="text-gray-800 font-bold text-lg">N</div>
        </div>
      ),
      'Claude': (
        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
          <div className="text-white font-bold text-lg">C</div>
        </div>
      )
    };

    return logoComponents[toolName] || (
      <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl flex items-center justify-center">
        <div className="text-white font-bold text-lg">?</div>
      </div>
    );
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
        
        <StableCamera onCameraUpdate={setCameraPos} />

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

          // Calculate screen position relative to camera for better tracking
          const relativeX = position[0] - cameraPos.x;
          const relativeZ = position[2] - cameraPos.z;

          // Project to screen coordinates
          const screenX = 50 + (relativeX / 6) * 30;
          const screenY = 50 + (relativeZ / 6) * 30;

          // Calculate depth and scale
          const depth = Math.sqrt(relativeX * relativeX + relativeZ * relativeZ);
          const scale = Math.max(0.6, Math.min(1.2, 8 / (depth + 4)));
          const opacity = Math.max(0.6, Math.min(1, 8 / (depth + 2)));

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
