import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { BufferGeometry, BufferAttribute, Points as ThreePoints, Color } from 'three';

interface WaveFieldProps {
  count?: number;
}

function WaveField({ count = 2000 }: WaveFieldProps) {
  const pointsRef = useRef<ThreePoints>(null);
  
  const { positions, colors, originalPositions } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const originalPositions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Create a more structured distribution
      const x = (Math.random() - 0.5) * 40;
      const y = (Math.random() - 0.5) * 40;
      const z = (Math.random() - 0.5) * 40;
      
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      
      // Store original positions for wave animation
      originalPositions[i3] = x;
      originalPositions[i3 + 1] = y;
      originalPositions[i3 + 2] = z;
      
      // Create a gradient color scheme
      const distance = Math.sqrt(x * x + y * y + z * z);
      const normalizedDistance = Math.min(distance / 20, 1);
      
      if (normalizedDistance < 0.3) {
        // Core - Netflix red
        colors[i3] = 1;
        colors[i3 + 1] = 0.1;
        colors[i3 + 2] = 0.1;
      } else if (normalizedDistance < 0.6) {
        // Middle - Orange to blue gradient
        const t = (normalizedDistance - 0.3) / 0.3;
        colors[i3] = 1 - t * 0.5;
        colors[i3 + 1] = 0.3 + t * 0.4;
        colors[i3 + 2] = t;
      } else {
        // Outer - Blue to purple
        const t = (normalizedDistance - 0.6) / 0.4;
        colors[i3] = 0.5 + t * 0.3;
        colors[i3 + 1] = 0.3 - t * 0.2;
        colors[i3 + 2] = 1;
      }
    }
    
    return { positions, colors, originalPositions };
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.elapsedTime;
      
      // Slow rotation
      pointsRef.current.rotation.x = time * 0.05;
      pointsRef.current.rotation.y = time * 0.03;
      
      // Wave animation
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        
        // Create flowing wave effect
        const waveX = Math.sin(time * 0.5 + originalPositions[i3] * 0.02) * 0.5;
        const waveY = Math.cos(time * 0.3 + originalPositions[i3 + 2] * 0.02) * 0.3;
        const waveZ = Math.sin(time * 0.4 + originalPositions[i3 + 1] * 0.02) * 0.4;
        
        positions[i3] = originalPositions[i3] + waveX;
        positions[i3 + 1] = originalPositions[i3 + 1] + waveY;
        positions[i3 + 2] = originalPositions[i3 + 2] + waveZ;
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
        size={0.03}
        vertexColors
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

// Floating geometric shapes
function FloatingGeometry() {
  const meshRefs = useRef<any[]>([]);
  
  const shapes = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30
      ] as [number, number, number],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
      scale: Math.random() * 2 + 1,
      speed: Math.random() * 0.02 + 0.005,
      type: Math.floor(Math.random() * 3) // 0: box, 1: sphere, 2: torus
    }));
  }, []);

  useFrame((state) => {
    meshRefs.current.forEach((mesh, i) => {
      if (mesh) {
        const shape = shapes[i];
        mesh.rotation.x += shape.speed;
        mesh.rotation.y += shape.speed * 1.2;
        mesh.rotation.z += shape.speed * 0.8;
        
        // Floating motion
        mesh.position.y += Math.sin(state.clock.elapsedTime + i * 0.3) * 0.02;
      }
    });
  });

  return (
    <group>
      {shapes.map((shape, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) meshRefs.current[i] = el;
          }}
          position={shape.position}
          rotation={shape.rotation}
          scale={shape.scale}
        >
          {shape.type === 0 && <boxGeometry args={[0.5, 0.5, 0.5]} />}
          {shape.type === 1 && <sphereGeometry args={[0.3, 8, 8]} />}
          {shape.type === 2 && <torusGeometry args={[0.3, 0.1, 8, 16]} />}
          <meshStandardMaterial
            color={new Color().setHSL((i * 0.1) % 1, 0.6, 0.5)}
            transparent
            opacity={0.15}
            wireframe
          />
        </mesh>
      ))}
    </group>
  );
}

const ThreeBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <Canvas
        camera={{
          position: [0, 0, 10],
          fov: 75,
        }}
        style={{ 
          background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0f0f0f 100%)'
        }}
      >
        {/* Ambient lighting */}
        <ambientLight intensity={0.3} />
        
        {/* Dynamic colored lights */}
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#E50914" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#3b82f6" />
        <pointLight position={[0, 15, -5]} intensity={0.4} color="#22c55e" />
        
        {/* Main wave field */}
        <WaveField count={1500} />
        
        {/* Floating geometric shapes */}
        <FloatingGeometry />
      </Canvas>
      
      {/* Additional gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-blue-500/5 pointer-events-none" />
    </div>
  );
};

export default ThreeBackground;
