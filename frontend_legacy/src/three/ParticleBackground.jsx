import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ParticleBackground Component - Antigravity Matrix-style field
 * - Green particles float upward (antigravity)
 * - Subtle mouse influence for sci-fi feel
 * - Lightweight and performant
 */
const ParticleBackground = ({
  particleCount = 260,
  color = 0x00ff41,
  intensity = 0.45,
  baseSpeed = 0.015,
  mouseInfluence = 0.12,
  size = 0.05,
}) => {
  const mountRef = useRef(null);
  const animationFrameRef = useRef(null);
  const particlesRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    camera.position.z = 6;

    // Particle system
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 16; // x
      positions[i3 + 1] = (Math.random() - 0.5) * 16; // y
      positions[i3 + 2] = (Math.random() - 0.5) * 16; // z

      velocities[i3] = (Math.random() - 0.5) * baseSpeed;
      velocities[i3 + 1] = baseSpeed + Math.random() * baseSpeed * 1.5; // upward bias
      velocities[i3 + 2] = (Math.random() - 0.5) * baseSpeed;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size,
      color,
      transparent: true,
      opacity: intensity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    particlesRef.current = { particles, velocities, geometry };

    // Mouse influence
    const onMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current = { x, y };
    };
    window.addEventListener('mousemove', onMouseMove);

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      const { particles, velocities, geometry } = particlesRef.current;
      const posArray = geometry.attributes.position.array;
      const { x: mx, y: my } = mouseRef.current;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Antigravity upward drift
        posArray[i3] += velocities[i3];
        posArray[i3 + 1] += velocities[i3 + 1];
        posArray[i3 + 2] += velocities[i3 + 2];

        // Gentle mouse influence
        posArray[i3] += mx * mouseInfluence * 0.03;
        posArray[i3 + 2] += my * mouseInfluence * 0.03;

        // Wrap vertically to keep continuous flow
        if (posArray[i3 + 1] > 10) {
          posArray[i3 + 1] = -10;
        }
        // Horizontal/Depth wrap
        if (Math.abs(posArray[i3]) > 10) posArray[i3] *= -1;
        if (Math.abs(posArray[i3 + 2]) > 10) posArray[i3 + 2] *= -1;
      }

      geometry.attributes.position.needsUpdate = true;
      particles.rotation.y += 0.0008;
      particles.rotation.x += 0.0003;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      geometry.dispose();
      material.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [particleCount, color, intensity, baseSpeed, mouseInfluence, size]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default ParticleBackground;

