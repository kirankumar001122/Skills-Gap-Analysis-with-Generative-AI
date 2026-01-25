'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useAppStore } from '@/store/useAppStore';

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

export function SkillGalaxy() {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const { nodes, selectNode, selectedNodeId } = useAppStore();
    const [hoveredId, setHover] = useState<string | null>(null);

    // Animation constants for "breathing" effect
    const particles = useMemo(() => {
        return nodes.map(() => ({
            speed: 0.01 + Math.random() * 0.02,
            offset: Math.random() * 100
        }));
    }, [nodes]);

    useFrame((state) => {
        if (!meshRef.current) return;
        const time = state.clock.getElapsedTime();

        nodes.forEach((node, i) => {
            const { speed, offset } = particles[i];

            // Base Position
            const [x, y, z] = node.position;

            // Floating Calculation (Antigravity)
            const floatY = Math.sin(time * speed + offset) * 0.5;
            const floatX = Math.cos(time * speed * 0.5 + offset) * 0.2;

            tempObject.position.set(x + floatX, y + floatY, z);

            // Scale Logic
            const isSelected = selectedNodeId === node.id;
            const isHovered = hoveredId === node.id;
            const baseScale = isSelected ? 2.0 : (isHovered ? 1.5 : 0.8);
            // Pulse scale slightly
            const pulse = 1 + Math.sin(time * 2 + offset) * 0.1;
            const finalScale = baseScale * pulse;

            tempObject.scale.set(finalScale, finalScale, finalScale);

            // Rotation (slow spin)
            tempObject.rotation.set(time * 0.1, time * 0.1, 0);

            tempObject.updateMatrix();
            meshRef.current!.setMatrixAt(i, tempObject.matrix);

            // Color Logic (Highlight selection)
            const colorHex = isSelected ? '#ffffff' : (isHovered ? '#fbbf24' : node.color);
            tempColor.set(colorHex);
            meshRef.current!.setColorAt(i, tempColor);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;

        // Slowly rotate the entire galaxy
        meshRef.current.rotation.y = time * 0.05;
    });

    return (
        <instancedMesh
            ref={meshRef}
            args={[undefined, undefined, nodes.length]}
            onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                e.stopPropagation();
                if (e.instanceId !== undefined) {
                    setHover(nodes[e.instanceId]?.id || null);
                }
                document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
                setHover(null);
                document.body.style.cursor = 'auto';
            }}
            onClick={(e: ThreeEvent<MouseEvent>) => {
                e.stopPropagation();
                if (e.instanceId !== undefined) {
                    const node = nodes[e.instanceId];
                    if (node) selectNode(node.id);
                }
            }}
        >
            <icosahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial
                roughness={0.2}
                metalness={0.8}
                emissive="#ffffff"
                emissiveIntensity={0.1}
            />
        </instancedMesh>
    );
}
