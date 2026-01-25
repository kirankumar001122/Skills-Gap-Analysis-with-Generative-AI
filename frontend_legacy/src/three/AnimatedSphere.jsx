import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * AnimatedSphere Component
 * Interactive 3D sphere with wireframe and glow effects
 * Optimized for performance
 */
const AnimatedSphere = ({
  radius = 2,
  color = 0x00ff41,
  wireframe = true,
  opacity = 0.3,
  rotationSpeed = { x: 0.002, y: 0.003 },
  position = { x: 0, y: 0, z: 0 },
}) => {
  const mountRef = useRef(null);
  const animationFrameRef = useRef(null);
  const sphereRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });

    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    camera.position.z = 5;
    camera.position.x = position.x;
    camera.position.y = position.y;

    // Create sphere
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color,
      wireframe,
      transparent: true,
      opacity,
    });

    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(position.x, position.y, position.z);
    scene.add(sphere);
    sphereRef.current = sphere;

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      sphere.rotation.x += rotationSpeed.x;
      sphere.rotation.y += rotationSpeed.y;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
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
  }, [radius, color, wireframe, opacity, rotationSpeed, position]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default AnimatedSphere;

