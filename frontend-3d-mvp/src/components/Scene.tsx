'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Stars, Sparkles, OrbitControls } from '@react-three/drei';
import { SkillGalaxy } from './SkillGalaxy';
import { Bloom, EffectComposer } from '@react-three/postprocessing';

export default function Scene() {
    return (
        <div className="w-full h-full bg-slate-950">
            <Canvas
                camera={{ position: [0, 20, 40], fov: 45 }}
                dpr={1} // Fixed DPR for stability
                gl={{
                    antialias: true,
                    powerPreference: "high-performance",
                    preserveDrawingBuffer: true
                }}
            >
                <color attach="background" args={['#020617']} />

                {/* Cinematic Lighting */}
                <ambientLight intensity={0.2} />
                <pointLight position={[100, 100, 100]} intensity={1} color="#4f46e5" />
                <pointLight position={[-100, -50, -100]} intensity={1} color="#ec4899" />

                {/* The Galaxy Data */}
                <SkillGalaxy />

                {/* Space Atmosphere */}
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Sparkles count={1000} scale={50} size={4} speed={0.4} opacity={0.5} noise={0.2} color="#a78bfa" />

                <Environment preset="city" />

                {/* Post Processing for Sci-Fi Glow */}
                {/* Post Processing Temporarily Disabled to fix WebGL crash */}
                {/* <EffectComposer enabled={true}>
                    <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} radius={0.6} />
                </EffectComposer> */}

                {/* Controls for interaction */}
                <OrbitControls makeDefault enableDamping dampingFactor={0.1} minDistance={10} maxDistance={100} />
            </Canvas>
        </div>
    );
}
