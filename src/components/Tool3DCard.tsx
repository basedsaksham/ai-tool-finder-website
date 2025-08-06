import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ExternalLink, TrendingUp } from "lucide-react";

interface Tool3DCardProps {
  tool: {
    name: string;
    category: string;
    rating: number;
    pricing: string;
    isPopular?: boolean;
    isTrending?: boolean;
  };
  index: number;
}

const FloatingCube = ({ mouseX, mouseY, isHovered }: { 
  mouseX: number; 
  mouseY: number; 
  isHovered: boolean; 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Floating animation
      meshRef.current.position.y = Math.sin(time + mouseX) * 0.2;
      
      // Mouse-controlled rotation
      meshRef.current.rotation.x = mouseY * 0.3 + time * 0.1;
      meshRef.current.rotation.y = mouseX * 0.3 + time * 0.2;
      meshRef.current.rotation.z = Math.sin(time * 0.5) * 0.1;
      
      // Scale on hover
      const targetScale = isHovered ? 1.2 : 1;
      const targetVector = new THREE.Vector3(targetScale, targetScale, targetScale);
      meshRef.current.scale.lerp(targetVector, 0.1);
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial
        color={new THREE.Color().setHSL(0.73, 0.7, 0.5)}
        transparent
        opacity={0.8}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
};

const Tool3DCard = ({ tool, index }: Tool3DCardProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });
  };

  return (
    <div
      className="relative group cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered 
          ? `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg) translateZ(20px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
        transition: 'transform 0.2s ease-out',
      }}
    >
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <Canvas
          camera={{ position: [0, 0, 2] as [number, number, number], fov: 50 }}
          style={{ 
            background: 'linear-gradient(135deg, rgba(139, 69, 195, 0.1), rgba(59, 130, 246, 0.1))',
          }}
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[2, 2, 2]} intensity={0.8} />
          <FloatingCube 
            mouseX={mousePosition.x} 
            mouseY={mousePosition.y}
            isHovered={isHovered}
          />
        </Canvas>
      </div>

      {/* Card Content */}
      <div className="relative z-10 p-6 rounded-xl border border-border bg-card/80 backdrop-blur-sm h-full flex flex-col">
        {/* Badges */}
        <div className="absolute top-3 right-3 flex gap-1">
          {tool.isTrending && (
            <div className="bg-gradient-primary px-2 py-1 rounded-md flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-primary-foreground" />
              <span className="text-xs font-medium text-primary-foreground">Trending</span>
            </div>
          )}
          {tool.isPopular && !tool.isTrending && (
            <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
              Popular
            </Badge>
          )}
        </div>

        {/* Rank */}
        <div className="mb-4">
          <div 
            className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto flex items-center justify-center text-2xl font-bold text-primary-foreground shadow-glow"
            style={{
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.3s ease',
            }}
          >
            #{index + 1}
          </div>
        </div>

        {/* Tool Info */}
        <div className="text-center space-y-3 flex-1">
          <div>
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {tool.name}
            </h3>
            <p className="text-sm text-muted-foreground">{tool.category}</p>
          </div>

          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>{tool.rating}</span>
            </div>
            <Badge variant="outline" className="border-border">
              {tool.pricing}
            </Badge>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            className="w-full group-hover:bg-gradient-primary group-hover:text-primary-foreground transition-all duration-300"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Tool3DCard;