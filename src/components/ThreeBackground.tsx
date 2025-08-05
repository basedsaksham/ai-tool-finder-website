import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { BufferGeometry, BufferAttribute, Points as ThreePoints } from 'three';

interface ParticleFieldProps {
  count?: number;
}

function ParticleField({ count = 1000 }: ParticleFieldProps) {
  const ref = useRef<ThreePoints>(null);

  // Generate random positions for particles
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Spread particles in a sphere
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    return geometry;
  }, [count]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <points ref={ref} geometry={geometry}>
        <pointsMaterial
          transparent
          color="#E50914"
          size={0.015}
          sizeAttenuation={true}
        />
      </points>
    </group>
  );
}

const ThreeBackground = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{
          position: [0, 0, 1],
        }}
        style={{ background: 'transparent' }}
      >
        <ParticleField />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;
