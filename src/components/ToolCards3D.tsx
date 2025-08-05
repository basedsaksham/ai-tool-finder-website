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

// Interactive mouse-controlled camera
function InteractiveCamera() {
  const { camera, mouse, viewport } = useThree();
  const [targetPosition] = useState(new Vector3(0, 0, 8));
  const [currentPosition] = useState(new Vector3(0, 0, 8));
  
  useFrame((state) => {
    // Smooth mouse-based camera movement
    const mouseInfluence = 2;
    targetPosition.x = (mouse.x * viewport.width * mouseInfluence) / 4;
    targetPosition.y = (mouse.y * viewport.height * mouseInfluence) / 4;
    
    // Smooth interpolation
    currentPosition.lerp(targetPosition, 0.05);
    camera.position.copy(currentPosition);
    camera.lookAt(0, 0, 0);
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
}

function ToolCard3D({ tool, position, onClick, index }: ToolCard3DProps) {
  const meshRef = useRef<Mesh>(null);
  const pricingRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Individual rotation with slight variation
      meshRef.current.rotation.y += delta * (0.3 + index * 0.1);
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime + index) * 0.1;
      
      // Dynamic scaling
      const scale = hovered ? 1.2 : clicked ? 0.9 : 1;
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
          color={hovered ? '#E50914' : '#1a1a1a'}
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
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
      </mesh>
      
      {/* Hover glow effect */}
      {hovered && (
        <mesh position={[0, 0, -0.1]}>
          <boxGeometry args={[2.2, 2.7, 0.1]} />
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
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div 
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
        <InteractiveCamera />
        
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
            />
          );
        })}
      </Canvas>
      
      {/* Enhanced overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top gradient overlay */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/20 to-transparent" />
        
        {/* Interactive instructions */}
        <div className="absolute top-4 left-4 text-white/80">
          <p className="text-sm font-medium">
            {isDragging ? '🎯 Exploring...' : '🖱️ Move mouse to explore'}
          </p>
        </div>
        
        {/* Tool names with dynamic visibility */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-wrap justify-center gap-2 max-w-md">
            {visibleTools.map((tool, index) => (
              <div
                key={tool.id}
                className="group relative"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <span className="text-xs bg-gradient-to-r from-black/60 to-black/40 text-white/90 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/20">
                  {tool.name}
                </span>
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 opacity-60 animate-pulse" />
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
