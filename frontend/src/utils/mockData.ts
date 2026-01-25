export interface NodeData {
    id: string;
    name: string;
    role: string;
    category: string;
    skillGapScore: number;
    position: [number, number, number];
    color: string;
}

const CATEGORIES = [
    { name: 'Frontend', color: '#60a5fa' }, // blue-400
    { name: 'Backend', color: '#34d399' },  // emerald-400
    { name: 'AI/ML', color: '#a78bfa' },    // violet-400
    { name: 'DevOps', color: '#f59e0b' },   // amber-400
    { name: 'Design', color: '#f472b6' },   // pink-400
    { name: 'Security', color: '#ef4444' }, // red-400
];

export const generateGalaxyData = (count: number = 8000): NodeData[] => {
    return Array.from({ length: count }).map((_, i) => {
        const category = CATEGORIES[i % CATEGORIES.length];

        // Create multiple spiral arms (6 arms for maximum density)
        const armIndex = i % 6;
        const spread = Math.random();
        const angleOffset = (Math.PI * 2 / 6) * armIndex;

        // Condensed Galaxy Formula
        const distance = Math.pow(Math.random(), 0.6) * 45; // slightly wider but denser core

        const angle = distance * 0.7 + angleOffset;

        // Tight spiral
        const x = Math.cos(angle) * distance + (Math.random() - 0.5) * spread * 2.5;
        const z = Math.sin(angle) * distance + (Math.random() - 0.5) * spread * 2.5;

        // Disk thickness
        const y = (Math.random() - 0.5) * (8 / (distance * 0.1 + 1));

        return {
            id: `node-${i}`,
            name: `Skill Node ${i}`,
            role: `Specialist ${i}`,
            category: category.name,
            skillGapScore: Math.floor(Math.random() * 100),
            position: [x, y, z],
            color: category.color
        };
    });
};
