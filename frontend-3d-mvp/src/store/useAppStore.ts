import { create } from 'zustand';
import { NodeData, generateGalaxyData } from '@/utils/mockData';

// Data shapes matching the backend
export interface ParsedResume {
    name?: string;
    email?: string;
    skills: string[];
    experience: string;
    education?: string;
    certifications?: string[];
}

export interface AnalysisResult {
    common_skills: string[];
    missing_skills: string[];
    llama_recommendations: string;
    roadmap?: any[];
    institutions?: any[];
}

interface AppState {
    // 3D Visualization State
    nodes: NodeData[];
    selectedNodeId: string | null;

    // Auth State
    isAuthenticated: boolean;
    userName: string | null;
    login: (name: string) => void;
    logout: () => void;

    // Analysis State
    parsedResume: ParsedResume | null;
    analysisResult: AnalysisResult | null;
    isUploading: boolean;
    isAnalyzing: boolean;

    // Actions
    setNodes: (nodes: NodeData[]) => void;
    selectNode: (id: string | null) => void;
    setParsedResume: (data: ParsedResume | null) => void;
    setAnalysisResult: (data: AnalysisResult | null) => void;
    setUploading: (loading: boolean) => void;
    setAnalyzing: (loading: boolean) => void;

    // Error handling
    error: string | null;
    setError: (err: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
    // Initialize with Galaxy Data immediately for visual effect
    nodes: generateGalaxyData(2500),
    selectedNodeId: null,

    isAuthenticated: false,
    userName: null,
    login: (name) => set({ isAuthenticated: true, userName: name }),
    logout: () => set({ isAuthenticated: false, userName: null, analysisResult: null, parsedResume: null }),

    parsedResume: null,
    analysisResult: null,
    isUploading: false,
    isAnalyzing: false,
    error: null,

    setNodes: (nodes) => set({ nodes }),
    selectNode: (id) => set({ selectedNodeId: id }),
    setParsedResume: (data) => set({ parsedResume: data, error: null }),
    setAnalysisResult: (data) => set({ analysisResult: data, error: null }),
    setUploading: (loading) => set({ isUploading: loading }),
    setAnalyzing: (loading) => set({ isAnalyzing: loading }),
    setError: (err) => set({ error: err })
}));
