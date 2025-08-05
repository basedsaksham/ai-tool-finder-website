import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Mesh, Vector3, Color, BufferGeometry, BufferAttribute, Points as ThreePoints } from 'three';
import { AITool } from '@/types/tool';

// Animated particle background
function ParticleBackground() {
  const pointsRef = useRef<ThreePoints>(null);
  const particleCount = 1500;
  
  const { positions, colors, scales } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      // Create a more dynamic distribution
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 30;
      positions[i3 + 1] = (Math.random() - 0.5) * 30;
      positions[i3 + 2] = (Math.random() - 0.5) * 30;
      
      // Netflix-inspired color palette
      const colorChoice = Math.random();
      if (colorChoice < 0.6) {
        colors[i3] = 1; // Red
        colors[i3 + 1] = 0.1 + Math.random() * 0.2;
        colors[i3 + 2] = 0.1 + Math.random() * 0.2;
      } else if (colorChoice < 0.8) {
        colors[i3] = 0.2 + Math.random() * 0.3; // Blue tint
        colors[i3 + 1] = 0.4 + Math.random() * 0.3;
        colors[i3 + 2] = 1;
      } else {
        colors[i3] = 1; // White
        colors[i3 + 1] = 1;
        colors[i3 + 2] = 1;
      }
      
      scales[i] = Math.random() * 0.5 + 0.5;
    }
    
    return { positions, colors, scales };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x += 0.001;
      pointsRef.current.rotation.y += 0.002;
      
      // Animate particle movement
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(state.clock.elapsedTime + i * 0.01) * 0.01;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
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
        size={0.02}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Interactive mouse-controlled camera with position tracking
function InteractiveCamera({ onCameraUpdate }: { onCameraUpdate?: (position: Vector3, rotation: any) => void }) {
  const { camera, mouse, viewport } = useThree();
  const [targetPosition] = useState(new Vector3(0, 0, 8));
  const [currentPosition] = useState(new Vector3(0, 0, 8));

  useFrame((state) => {
    // Smooth mouse-based camera movement
    const mouseInfluence = 1.5;
    targetPosition.x = (mouse.x * viewport.width * mouseInfluence) / 6;
    targetPosition.y = (mouse.y * viewport.height * mouseInfluence) / 6;
    targetPosition.z = 8 + Math.sin(state.clock.elapsedTime * 0.1) * 0.5; // Subtle breathing effect

    // Smooth interpolation
    currentPosition.lerp(targetPosition, 0.08);
    camera.position.copy(currentPosition);
    camera.lookAt(0, 0, 0);

    // Notify parent component of camera changes
    onCameraUpdate?.(currentPosition, camera.rotation);
  });

  return null;
}

// Enhanced floating shapes in background
function FloatingShapes() {
  const shapesRef = useRef<Mesh[]>([]);
  const shapeCount = 20;
  
  const shapes = useMemo(() => {
    return Array.from({ length: shapeCount }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20 - 5
      ] as [number, number, number],
      scale: Math.random() * 0.5 + 0.3,
      speed: Math.random() * 0.02 + 0.01,
      color: Math.random() > 0.5 ? '#E50914' : '#3b82f6'
    }));
  }, []);

  useFrame((state) => {
    shapesRef.current.forEach((mesh, i) => {
      if (mesh) {
        mesh.rotation.x += shapes[i].speed;
        mesh.rotation.y += shapes[i].speed * 0.7;
        mesh.position.y += Math.sin(state.clock.elapsedTime + i) * 0.01;
      }
    });
  });

  return (
    <group>
      {shapes.map((shape, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) shapesRef.current[i] = el;
          }}
          position={shape.position}
          scale={shape.scale}
        >
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial
            color={shape.color}
            transparent
            opacity={0.1}
            wireframe
          />
        </mesh>
      ))}
    </group>
  );
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
  const pricingRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Individual rotation with slight variation
      meshRef.current.rotation.y += delta * (0.3 + index * 0.1);
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime + index) * 0.1;

      // Dynamic scaling with highlight effect
      const baseScale = isHighlighted ? 1.15 : 1;
      const scale = hovered ? baseScale * 1.1 : clicked ? baseScale * 0.9 : baseScale;
      meshRef.current.scale.lerp(new Vector3(scale, scale, scale), 0.1);

      // Floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + index * 0.5) * 0.2;
    }

    if (pricingRef.current) {
      pricingRef.current.rotation.y = meshRef.current?.rotation.y || 0;
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

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 200);
    onClick?.();
  };

  return (
    <group position={position}>
      {/* Main card */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <boxGeometry args={[2, 2.5, 0.3]} />
        <meshStandardMaterial
          color={hovered || isHighlighted ? '#E50914' : '#1a1a1a'}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Pricing indicator */}
      <mesh ref={pricingRef} position={[0, -0.8, 0.16]}>
        <boxGeometry args={[1.8, 0.4, 0.1]} />
        <meshStandardMaterial
          color={getPricingColor()}
          emissive={getPricingColor()}
          emissiveIntensity={hovered || isHighlighted ? 0.4 : 0.1}
        />
      </mesh>

      {/* Enhanced glow effect */}
      {(hovered || isHighlighted) && (
        <mesh position={[0, 0, -0.1]}>
          <boxGeometry args={[2.2, 2.7, 0.1]} />
          <meshStandardMaterial
            color="#E50914"
            transparent
            opacity={isHighlighted ? 0.5 : 0.3}
            emissive="#E50914"
            emissiveIntensity={isHighlighted ? 0.7 : 0.5}
          />
        </mesh>
      )}

      {/* Tool category indicator */}
      <mesh position={[0, 0.8, 0.16]}>
        <boxGeometry args={[1.6, 0.2, 0.05]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={hovered ? 0.2 : 0.05}
        />
      </mesh>
    </group>
  );
}

interface ToolCards3DProps {
  tools: AITool[];
  onToolClick?: (tool: AITool) => void;
}

const ToolCards3D = ({ tools, onToolClick }: ToolCards3DProps) => {
  const visibleTools = tools.slice(0, 6);
  const [isDragging, setIsDragging] = useState(false);
  const [highlightedTool, setHighlightedTool] = useState<number | null>(null);
  const [cameraPosition, setCameraPosition] = useState(new Vector3(0, 0, 8));
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleCameraUpdate = (position: Vector3, rotation: any) => {
    setCameraPosition(position.clone());
  };

  // Function to get tool icon/logo
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
    <div
      ref={canvasRef}
      className="h-96 w-full relative overflow-hidden rounded-xl"
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #2a1a1a 100%)' }}
      >
        {/* Background elements */}
        <ParticleBackground />
        <FloatingShapes />

        {/* Lighting setup */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.6} color="#E50914" />
        <pointLight position={[0, 10, -10]} intensity={0.4} color="#3b82f6" />
        <pointLight position={[5, -5, 5]} intensity={0.3} color="#22c55e" />

        {/* Interactive camera */}
        <InteractiveCamera onCameraUpdate={handleCameraUpdate} />

        {/* Tool cards in a dynamic arrangement */}
        {visibleTools.map((tool, index) => {
          const angle = (index / visibleTools.length) * Math.PI * 2;
          const radius = 4.5;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const y = Math.sin(index * 0.5) * 0.5; // Varied heights

          return (
            <ToolCard3D
              key={tool.id}
              tool={tool}
              position={[x, y, z]}
              onClick={() => onToolClick?.(tool)}
              index={index}
              isHighlighted={highlightedTool === index}
            />
          );
        })}
      </Canvas>

      {/* 3D Card Text Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        {visibleTools.map((tool, index) => {
          const angle = (index / visibleTools.length) * Math.PI * 2;
          const radius = 4.5;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const y = Math.sin(index * 0.5) * 0.5;

          // Convert 3D position to 2D screen position (simplified)
          const screenX = 50 + (x / 8) * 30; // Center at 50% + offset
          const screenY = 50 - (y / 4) * 20; // Center at 50% + offset
          const screenZ = z; // Use for depth-based scaling

          const scale = Math.max(0.6, 1 - Math.abs(screenZ) / 10);
          const opacity = Math.max(0.4, 1 - Math.abs(screenZ) / 8);

          return (
            <div
              key={`overlay-${tool.id}`}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                highlightedTool === index ? 'z-20' : 'z-10'
              }`}
              style={{
                left: `${screenX}%`,
                top: `${screenY}%`,
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity: opacity,
              }}
            >
              {/* Tool Card Content */}
              <div className={`text-center p-3 rounded-lg backdrop-blur-sm border transition-all duration-300 ${
                highlightedTool === index
                  ? 'bg-red-500/30 border-red-500/60 shadow-lg shadow-red-500/20 scale-110'
                  : 'bg-black/40 border-white/20'
              }`}>
                {/* Logo/Icon */}
                <div className="text-2xl mb-2">
                  {getToolIcon(tool.name)}
                </div>

                {/* Tool Name */}
                <h3 className={`font-semibold text-sm mb-1 transition-colors duration-300 ${
                  highlightedTool === index ? 'text-white' : 'text-white/90'
                }`}>
                  {tool.name}
                </h3>

                {/* Category */}
                <p className="text-xs text-white/60 mb-2">
                  {tool.category}
                </p>

                {/* Pricing Badge */}
                <div className={`inline-block px-2 py-1 rounded text-xs font-medium transition-all duration-300 ${
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
      </div>

      {/* Enhanced overlay with synchronized highlighting */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top gradient overlay */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/20 to-transparent" />

        {/* Interactive instructions */}
        <div className="absolute top-4 left-4 text-white/80">
          <p className="text-sm font-medium">
            {isDragging ? '🎯 Exploring...' : '🖱️ Move mouse to explore'}
          </p>
        </div>

        {/* Tool details overlay */}
        <div className="absolute top-4 right-4 text-right text-white/80">
          {highlightedTool !== null && (
            <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-white/10">
              <h3 className="font-semibold text-white">{visibleTools[highlightedTool].name}</h3>
              <p className="text-sm text-white/60">{visibleTools[highlightedTool].category}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2 py-1 rounded bg-white/20">
                  {visibleTools[highlightedTool].pricing.type}
                </span>
                <span className="text-xs text-yellow-400">★ {visibleTools[highlightedTool].rating}</span>
              </div>
            </div>
          )}
        </div>

        {/* Tool names with synchronized highlighting */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
            {visibleTools.map((tool, index) => (
              <div
                key={tool.id}
                className={`group relative transition-all duration-300 cursor-pointer pointer-events-auto ${
                  highlightedTool === index ? 'scale-110' : ''
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
                onMouseEnter={() => setHighlightedTool(index)}
                onMouseLeave={() => setHighlightedTool(null)}
                onClick={() => onToolClick?.(tool)}
              >
                <span className={`text-xs px-3 py-2 rounded-full border backdrop-blur-sm transition-all duration-300 ${
                  highlightedTool === index
                    ? 'bg-red-500/40 text-white border-red-500/60 shadow-lg shadow-red-500/20'
                    : 'bg-gradient-to-r from-black/60 to-black/40 text-white/90 border-white/10 hover:bg-white/20'
                }`}>
                  {tool.name}
                </span>
                <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full transition-all duration-300 ${
                  highlightedTool === index
                    ? 'bg-red-500 animate-ping'
                    : 'bg-gradient-to-r from-red-500 to-orange-500 opacity-60 animate-pulse'
                }`} />

                {/* Category badge */}
                <div className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs px-2 py-1 rounded bg-black/60 text-white/70 border border-white/10 transition-all duration-300 ${
                  highlightedTool === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}>
                  {tool.category}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Corner accent */}
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-radial from-red-500/20 to-transparent rounded-full" />
      </div>
    </div>
  );
};

export default ToolCards3D;
