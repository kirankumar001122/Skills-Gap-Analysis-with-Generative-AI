'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useAppStore } from '@/store/useAppStore';

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

const DEPT_COLORS: Record<string, string> = {
    'Engineering': '#3b82f6', // blue-500
    'Product': '#10b981',     // emerald-500
    'Sales': '#f59e0b',       // amber-500
    'Marketing': '#ef4444',   // red-500
    'HR': '#8b5cf6',          // violet-500
};

export function ClusterVisualization() {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const { nodes, selectNode, selectedNodeId } = useAppStore();
    const [hoveredId, setHover] = useState<string | null>(null);

    // Use all nodes for now
    const visibleNodes = nodes;

    // Update instances
    useEffect(() => {
        if (!meshRef.current) return;

        visibleNodes.forEach((node, i) => {
            // Position
            tempObject.position.set(node.position[0], node.position[1], node.position[2]);

            // Scale: highlight selected or hovered
            const isSelected = selectedNodeId === node.id;
            const isHovered = hoveredId === node.id;
            const scale = isSelected ? 1.5 : (isHovered ? 1.2 : 1);
            tempObject.scale.set(scale, scale, scale);

            tempObject.updateMatrix();
            meshRef.current!.setMatrixAt(i, tempObject.matrix);

            // Color
            const colorHex = DEPT_COLORS[node.category] || '#cccccc';
            tempColor.set(colorHex);
            if (isSelected || isHovered) {
                tempColor.offsetHSL(0, 0, 0.2); // Lighten
            }
            meshRef.current!.setColorAt(i, tempColor);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    }, [visibleNodes, selectedNodeId, hoveredId]);

    return (
        <instancedMesh
            ref={meshRef}
            args={[undefined, undefined, visibleNodes.length]}
            onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                e.stopPropagation();
                if (e.instanceId !== undefined) {
                    setHover(visibleNodes[e.instanceId]?.id || null);
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
                    const node = visibleNodes[e.instanceId];
                    if (node) selectNode(node.id);
                }
            }}
        >
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial roughness={0.5} metalness={0.5} />
        </instancedMesh>
    );
}
