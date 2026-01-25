'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Overlay } from '@/components/Overlay';
import { AuthOverlay } from '@/components/AuthOverlay';
import { useAppStore } from '@/store/useAppStore';

// Dynamically import the Scene component to avoid server-side rendering issues with Three.js
const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-500">
      Loading 3D Engine...
    </div>
  )
});

export default function Home() {
  const { isAuthenticated } = useAppStore();
  return (
    <main className="w-screen h-screen overflow-hidden relative bg-slate-950 text-slate-100">
      {/* 3D Context */}
      <div className="absolute inset-0 z-0">
        <Scene />
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {isAuthenticated ? <Overlay /> : <AuthOverlay />}
      </div>
    </main>
  );
}
