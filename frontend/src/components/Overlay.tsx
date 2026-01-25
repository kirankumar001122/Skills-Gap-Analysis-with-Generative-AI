'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Upload, Activity, AlertCircle, FileText, CheckCircle, Cpu, Shield, Zap, Eye, EyeOff, MapPin, Brain, Award, ChevronRight, Users, MessageSquare, Video, Mic, Download, Briefcase, Building2, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';

// SET THIS TO FALSE WHEN CONNECTING TO REAL BACKEND
const USE_MOCK_DATA = false;
const API_BASE_URL = 'http://127.0.0.1:5000';

// Geolocation Helpers
const deg2rad = (deg: number) => deg * (Math.PI / 180);

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d.toFixed(1) + ' km';
};

const getMockAssessment = (role: string) => {
    return [
        {
            question: `In modern ${role} development, which concept is most critical for performance?`,
            options: ['Global Variables', 'Memoization & Caching', 'Synchronous Blocking', 'Inline Styling'],
            correct: 1
        },
        {
            question: "Which tool is best suited for managing complex state in large applications?",
            options: ['jQuery', 'Redux / Zustand', 'Local Storage', 'Cookies'],
            correct: 1
        },
        {
            question: "What is the standard approach for ensuring code reliability?",
            options: ['Manual Testing', 'Unit & Integration Testing', 'Console Logging', 'User Reports'],
            correct: 1
        },
        {
            question: "How should sensitive data be handled in a production environment?",
            options: ['Hardcoded Strings', 'Environment Variables', 'Text Files', 'Public Repositories'],
            correct: 1
        },
        {
            question: "Which architecture pattern promotes loose coupling?",
            options: ['Monolithic', 'Microservices', 'Spaghetti Code', 'Copy-Paste'],
            correct: 1
        }
    ];
};

// Dynamic Mock Generator
const getMockAnalysis = (role: string) => {
    const roleLower = role.toLowerCase();

    if (roleLower.includes('frontend') || roleLower.includes('react')) {
        return {
            common_skills: ['React', 'JavaScript', 'HTML/CSS', 'Git'],
            missing_skills: ['Three.js', 'WebGL', 'Performance Optimization', 'Jest'],
            llama_recommendations: `### AI Execution Plan for **${role}**

To bridge the gap to a Senior Frontend role, focus on 3D web technologies. The market for immersive web experiences is growing.

**Key Focus Areas:**
*   **Three.js & WebGL:** Essential for high-performance graphics.
*   **Performance:** Learn to profile and optimize heavy scenes.
*   **Testing:** Jest and Cypress are industry standards.`,
            roadmap: [
                {
                    week: 'WEEK 01-02',
                    title: 'Three.js Fundamentals',
                    description: 'Understand the scene graph, geometries, materials, and lights. Build your first 3D scene.',
                    resources: [
                        { title: 'Three.js Journey', type: 'Course', url: 'https://threejs-journey.com/' },
                        { title: 'React Three Fiber Docs', type: 'Doc', url: 'https://r3f.docs.pmnd.rs/getting-started/introduction' }
                    ]
                },
                {
                    week: 'WEEK 03-04',
                    title: 'Shaders & WebGL',
                    description: 'Dive deep into GLSL to create custom materials and post-processing effects.',
                    resources: [
                        { title: 'The Book of Shaders', type: 'Book', url: 'https://thebookofshaders.com/' },
                        { title: 'GLSL Sandbox', type: 'Tool', url: 'https://glslsandbox.com/' }
                    ]
                },
                {
                    week: 'WEEK 05-06',
                    title: 'Performance Optimization',
                    description: 'Learn instancing, texture compression, and standard performance profiling.',
                    resources: [
                        { title: 'Chrome DevTools Profiler', type: 'Tool', url: 'https://developer.chrome.com/docs/devtools/performance/' },
                        { title: 'R3F Performance Guide', type: 'Doc', url: 'https://r3f.docs.pmnd.rs/advanced/performance' }
                    ]
                }
            ],
            institutions: [
                { name: 'Creative Coding Lab', location: 'San Francisco, CA', distance: '2.4 km', rating: 4.9, cost: '$200/mo' },
                { name: 'Frontend Masters Bootcamp', location: 'Remote / NYC', distance: 'Online', rating: 4.8, cost: '$50/mo' },
                { name: 'WebGL Workshops', location: 'Austin, TX', distance: '15 km', rating: 4.7, cost: '$500' }
            ]
        };
    } else if (roleLower.includes('backend') || roleLower.includes('node') || roleLower.includes('java')) {
        return {
            common_skills: ['Node.js', 'API Design', 'SQL', 'Git'],
            missing_skills: ['Docker', 'Kubernetes', 'Microservices', 'GraphQL'],
            llama_recommendations: `### AI Execution Plan for **${role}**

Transitioning to cloud-native development requires mastering containerization and orchestration.

**Key Focus Areas:**
*   **Docker & Kubernetes:** The backbone of modern deployment.
*   **Microservices:** Move away from monolithic architectures.
*   **Scalability:** Understand caching, load balancing, and database shading.`,
            roadmap: [
                {
                    week: 'WEEK 01-02',
                    title: 'Containerization with Docker',
                    description: 'Learn to create Dockerfiles, docker-compose, and manage multi-container applications.',
                    resources: [
                        { title: 'Docker Official Docs', type: 'Doc', url: 'https://docs.docker.com/get-started/' },
                        { title: 'Container Ninja', type: 'Video', url: 'https://www.youtube.com/watch?v=fqMOX6JJhGo' }
                    ]
                },
                {
                    week: 'WEEK 03-04',
                    title: 'Orchestration with K8s',
                    description: 'Deploy, scale, and manage containerized applications using Kubernetes.',
                    resources: [
                        { title: 'Kubernetes The Hard Way', type: 'Tutorial', url: 'https://github.com/kelseyhightower/kubernetes-the-hard-way' },
                        { title: 'Helm Charts Guide', type: 'Doc', url: 'https://helm.sh/docs/intro/quickstart/' }
                    ]
                },
                {
                    week: 'WEEK 05-08',
                    title: 'Microservices Patterns',
                    description: 'Implement circuit breakers, service discovery, and event-driven architecture.',
                    resources: [
                        { title: 'Microservices.io', type: 'Site', url: 'https://microservices.io/' },
                        { title: 'RabbitMQ Patterns', type: 'Book', url: 'https://www.rabbitmq.com/tutorials/tutorial-one-python.html' }
                    ]
                }
            ],
            institutions: [
                { name: 'Cloud Native Computing Foundation', location: 'San Francisco, CA', distance: '5.1 km', rating: 5.0, cost: 'Free' },
                { name: 'Serverless City Hub', location: 'Seattle, WA', distance: '12 km', rating: 4.6, cost: '$1200' },
                { name: 'Backend Engineering Academy', location: 'London, UK', distance: 'Hybrid', rating: 4.8, cost: '£2000' }
            ]
        };
    } else if (roleLower.includes('test') || roleLower.includes('qa') || roleLower.includes('quality') || roleLower.includes('sdet')) {
        return {
            common_skills: ['Manual Testing', 'Test Planning', 'JIRA', 'Agile'],
            missing_skills: ['Selenium (Automation)', 'API Testing (Postman)', 'SQL', 'Performance Testing'],
            llama_recommendations: `### AI Execution Plan for **${role}**

To evolve from Manual Testing to a Test Automation Engineer or SDET, technical depth is required.

**Key Focus Areas:**
*   **Automation:** Selenium, Playwright, or Cypress.
*   **Backend Verification:** API Testing and Database Querying.
*   **CI/CD:** Integration with pipelines (Jenkins/GitHub Actions).`,
            roadmap: [
                {
                    week: 'WEEK 01-04',
                    title: 'Test Automation Frameworks',
                    description: 'Master Selenium WebDriver or Playwright. Build a robust page-object model framework.',
                    resources: [
                        { title: 'Selenium Java Course', type: 'Course', url: 'https://www.udemy.com/topic/selenium-webdriver/' },
                        { title: 'Playwright Docs', type: 'Doc', url: 'https://playwright.dev/' }
                    ]
                },
                {
                    week: 'WEEK 05-06',
                    title: 'API & Database Testing',
                    description: 'Validate data integrity using SQL and automate API calls.',
                    resources: [
                        { title: 'Postman Galaxy', type: 'Site', url: 'https://www.postman.com/galaxy/' },
                        { title: 'SQL for Testers', type: 'Course', url: 'https://www.guru99.com/sql-testing-tutorial.html' }
                    ]
                }
            ],
            institutions: [
                { name: 'Ministry of Testing', location: 'Remote', distance: 'Online', rating: 5.0, cost: '$250/yr' },
                { name: 'ISTQB Local Centre', location: 'City Center', distance: '5.0 km', rating: 4.5, cost: 'Exam Fee' }
            ]
        };
    } else {

        // Generic Fallback for Non-Tech / Other Roles
        return {
            common_skills: ['Core Domain Knowledge', 'Professional Standards', 'Communication', 'Analysis'],
            missing_skills: [`Advanced ${role} Certification`, 'Digital Transformation', 'Strategic Planning', 'Data Analytics'],
            llama_recommendations: `### AI Execution Plan for **${role}**

To reach the pinnacle of the **${role}** domain, you must integrate modern digital tools with advanced industry knowledge.

**Key Focus Areas:**
*   **Professional Certification:** Acquire the highest standard credential in your field.
*   **Digital Tools:** Master software and AI tools relevant to ${role}.
*   **Strategy:** Move from operational execution to strategic advisory.`,
            roadmap: [
                {
                    week: 'WEEK 01-04',
                    title: `Advanced ${role} Certification`,
                    description: 'Prepare for the leading industry certification or licensure exams.',
                    resources: [
                        { title: 'Industry Standard Review', type: 'Course', url: '#' },
                        { title: 'Certification Guide', type: 'Doc', url: '#' }
                    ]
                },
                {
                    week: 'WEEK 05-08',
                    title: 'Digital Transformation',
                    description: `Learn how AI and automation are reshaping the ${role} landscape.`,
                    resources: [
                        { title: 'Future of Work Report', type: 'Article', url: '#' },
                        { title: 'Digital Tools Mastery', type: 'Course', url: '#' }
                    ]
                }
            ],
            institutions: [
                { name: 'Professional Training Institute', location: 'City Center', distance: '5.0 km', rating: 4.8, cost: 'Variable' },
                { name: 'Online Learning Hub', location: 'Remote', distance: 'Online', rating: 4.7, cost: 'Subscription' }
            ]
        };
    }
}

const getMockExperts = (role: string) => {
    return [
        {
            name: "Dr. Elena Ray",
            title: `Senior ${role} Architect`,
            company: "TechGlobal",
            topics: ["System Design", "Scalability", "Career Growth"],
            rating: 4.9,
            status: "Online",
            cost: "$150/hr"
        },
        {
            name: "Marcus Chen",
            title: "Staff Engineer",
            company: "DataSystems",
            topics: ["Microservices", "Performance", "Interview Prep"],
            rating: 4.8,
            status: "Busy",
            cost: "$120/hr"
        },
        {
            name: "Sarah Williams",
            title: "Tech Lead",
            company: "Innovate Inc",
            topics: ["Frontend Architecture", "React Internals", "Mentorship"],
            rating: 5.0,
            status: "Online",
            cost: "$200/hr"
        }
    ];
};

const getMockInterviews = (role: string) => {
    return [
        {
            company: "Google",
            color: "text-red-500",
            bg: "bg-red-500/10",
            border: "border-red-500/20",
            questions: [
                `Design a scalable ${role} architecture for millions of users.`,
                "Explain how you handle critical rendering path optimization.",
                "Algorithm: Reverse a linked list in groups of K."
            ]
        },
        {
            company: "Meta",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
            questions: [
                "Implement a custom Promise.all functionality.",
                "How does React's reconciliation algorithm work under the hood?",
                "System Design: Design a real-time news feed."
            ]
        },
        {
            company: "Amazon",
            color: "text-yellow-500",
            bg: "bg-yellow-500/10",
            border: "border-yellow-500/20",
            questions: [
                "Leadership Principle: Tell me about a time you disagreed with a manager.",
                `How do you ensure security in your ${role} applications?`,
                "Object Oriented Design: Design a Parking Lot system."
            ]
        }
    ];
};

export function Overlay() {
    const {
        parsedResume,
        analysisResult,
        isUploading,
        isAnalyzing,
        setParsedResume,
        setAnalysisResult,
        setUploading,
        setAnalyzing,
        error,
        setError,
        isAuthenticated,
        userName
    } = useAppStore();

    const [targetRole, setTargetRole] = useState('Frontend Engineer');
    const [isVisible, setIsVisible] = useState(true);
    const [viewMode, setViewMode] = useState<'analysis' | 'roadmap' | 'institutions' | 'assessment' | 'experts' | 'interview'>('analysis');
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
    const [isLocating, setIsLocating] = useState(false);

    // Mentor State
    const [mentors, setMentors] = useState<any[]>([]);
    const [isLoadingMentors, setIsLoadingMentors] = useState(false);

    const handleFetchMentors = async () => {
        setIsLoadingMentors(true);
        try {
            const res = await fetch(`${API_BASE_URL}/find_mentors`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: targetRole })
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setMentors(data);
            }
        } catch (e) {
            console.error("Failed to fetch mentors", e);
        } finally {
            setIsLoadingMentors(false);
        }
    };

    // Quiz State
    const [quizData, setQuizData] = useState<any[]>([]);
    const [quizIndex, setQuizIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showQuizResult, setShowQuizResult] = useState(false);
    const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);

    const handleStartQuiz = async () => {
        setIsLoadingQuiz(true);
        setViewMode('assessment');
        setQuizData([]); // Clear previous data

        try {
            const missing = analysisResult?.missing_skills || [];

            const res = await fetch(`${API_BASE_URL}/generate_quiz`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    role: targetRole,
                    missing_skills: missing
                })
            });

            if (!res.ok) throw new Error("Failed to fetch quiz");

            const questions = await res.json();
            setQuizData(questions);
            setQuizIndex(0);
            setScore(0);
            setShowQuizResult(false);

        } catch (e) {
            console.error("Quiz Fetch Error:", e);
            // Fallback to mock if fetch fails
            setQuizData(getMockAssessment(targetRole));
        } finally {
            setIsLoadingQuiz(false);
        }
    };

    const handleAnswer = (optionIdx: number) => {
        if (optionIdx === quizData[quizIndex].correct) {
            setScore(prev => prev + 1);
        }

        if (quizIndex + 1 < quizData.length) {
            setQuizIndex(prev => prev + 1);
        } else {
            setShowQuizResult(true);
        }
    };

    // Interview Prep State
    const [interviewData, setInterviewData] = useState<any[]>([]);
    const [isLoadingInterview, setIsLoadingInterview] = useState(false);

    const handleFetchInterviews = async () => {
        setIsLoadingInterview(true);
        setViewMode('interview');

        try {
            const res = await fetch(`${API_BASE_URL}/interview_prep`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: targetRole })
            });

            if (!res.ok) throw new Error("Failed to fetch interview prep");
            const data = await res.json();
            setInterviewData(data);
        } catch (e) {
            console.error("Interview Fetch Error:", e);
            setInterviewData(getMockInterviews(targetRole));
        } finally {
            setIsLoadingInterview(false);
        }
    };

    const toggleStep = (idx: number) => {
        const newSet = new Set(completedSteps);
        if (newSet.has(idx)) {
            newSet.delete(idx);
        } else {
            newSet.add(idx);
        }
        setCompletedSteps(newSet);
    };

    // Calculate progress
    const totalSteps = analysisResult?.roadmap?.length || 1;
    const progress = Math.round((completedSteps.size / totalSteps) * 100);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError(null);
        setViewMode('analysis'); // Reset view on new upload
        setCompletedSteps(new Set()); // Reset progress

        // MOCK MODE: Simulate parsing delay
        if (USE_MOCK_DATA) {
            setTimeout(() => {
                setParsedResume({
                    skills: ['React', 'TypeScript', 'Node.js', 'CSS', 'Git', 'Python', 'SQL'],
                    experience: '3 Years',
                    education: 'B.Tech Computer Science'
                });
                setUploading(false);
            }, 1000);
            return;
        }

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const res = await fetch(`${API_BASE_URL}/parse_resume`, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Failed to parse resume');
            }

            const data = await res.json();
            setParsedResume(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleAnalyze = async () => {
        if (!parsedResume || !targetRole) return;

        setAnalyzing(true);
        setAnalysisResult(null);
        setError(null);
        setViewMode('analysis');
        setCompletedSteps(new Set());

        // MOCK MODE: Simulate analysis delay
        if (USE_MOCK_DATA) {
            setTimeout(() => {
                const mockResult = getMockAnalysis(targetRole);
                setAnalysisResult(mockResult);
                setAnalyzing(false);
            }, 1500);
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/analyze_skills`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    role: targetRole,
                    user_skills: parsedResume.skills || [],
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Failed to analyze skills');
            }

            const data = await res.json();
            setAnalysisResult(data);
        } catch (err: any) {
            console.error("Analysis Error:", err);
            if (err.message && err.message.includes("Failed to fetch")) {
                setError("Backend Unreachable: Please ensure the server is running (python app.py).");
            } else {
                setError(err.message || "An unexpected error occurred.");
            }
        } finally {
            setAnalyzing(false);
        }
    };

    const handleLocate = () => {
        setIsLocating(true);
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                // Query Overpass API for IT/Software Coaching Centers specifically
                const query = `[out:json];(node["name"~"Spiders|Training|Software|Academy|Institute|Technologies|Java|Testing|QSpiders|JSpiders",i](around:10000,${latitude},${longitude}););out;`;
                const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

                try {
                    const res = await fetch(url);
                    const data = await res.json();

                    if (data.elements && data.elements.length > 0) {
                        const realInstitutions = data.elements.slice(0, 10).map((el: any) => ({
                            name: el.tags.name || 'Local Education Center',
                            location: el.tags['addr:city'] || 'Detected Vicinity',
                            distance: calculateDistance(latitude, longitude, el.lat, el.lon),
                            rating: (4.0 + Math.random()).toFixed(1),
                            cost: '$' + (Math.floor(Math.random() * 400) + 100) + '/mo'
                        }));

                        if (analysisResult) {
                            setAnalysisResult({
                                ...analysisResult,
                                institutions: realInstitutions
                            });
                        }
                    }
                } catch (e) {
                    console.error("Location fetch failed", e);
                } finally {
                    setIsLocating(false);
                    setViewMode('institutions');
                }
            }, (error) => {
                console.error("Geolocation error", error);
                setIsLocating(false);
                setViewMode('institutions');
            });
        } else {
            setIsLocating(false);
            setViewMode('institutions');
        }
    };

    return (
        <div className="absolute inset-0 pointer-events-none flex justify-center items-center p-4">

            {/* Visibility Toggle (Always Visible) */}
            <button
                onClick={() => setIsVisible(!isVisible)}
                className="pointer-events-auto absolute top-6 right-6 z-50 bg-slate-900/50 backdrop-blur-md border border-slate-700 text-slate-300 p-3 rounded-full hover:bg-slate-800 hover:text-white transition-all shadow-lg group"
                title={isVisible ? "Hide UI" : "Show UI"}
            >
                {isVisible ? <EyeOff size={20} className="group-hover:text-red-400" /> : <Eye size={20} className="group-hover:text-emerald-400" />}
            </button>

            {/* Sci-Fi Container Card */}
            <div className={clsx(
                "relative bg-slate-950/80 backdrop-blur-2xl border border-slate-700/50 shadow-2xl rounded-2xl w-full max-w-6xl h-[85vh] pointer-events-auto flex overflow-hidden ring-1 ring-white/10 transition-all duration-500 origin-center",
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
            )}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 opacity-50"></div>

                {/* Left Side: Input & Controls */}
                <div className="w-1/3 bg-slate-900/60 p-8 flex flex-col border-r border-slate-800 overflow-y-auto relative">

                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-2">
                            <Cpu className="text-blue-400" size={24} />
                            <h1 className="text-2xl font-bold text-white tracking-tight">
                                {isAuthenticated && userName ? (
                                    <span className="text-blue-400">{userName}</span>
                                ) : (
                                    <>Nexus<span className="text-blue-400">Analysis</span></>
                                )}
                            </h1>
                        </div>
                        <p className="text-xs font-mono text-slate-400">
                            VECTOR: SKILL_GAP // SYSTEM: ONLINE
                        </p>
                        <div className="mt-2 inline-block bg-blue-500/10 border border-blue-500/20 rounded px-2 py-0.5">
                            <span className="text-[10px] font-bold text-blue-300">V2.0 SCI-FI CORE: ACTIVE</span>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* 1. Upload Resume */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span> 01 Initialize Data Source
                            </label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    accept=".pdf,.docx,.txt"
                                    onChange={handleFileUpload}
                                    disabled={isUploading}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                                />
                                <div className={clsx(
                                    "border border-dashed border-slate-600 rounded-lg p-8 flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden",
                                    isUploading ? "bg-blue-900/10 border-blue-500/50" : "group-hover:border-blue-400 group-hover:bg-slate-800/80 bg-slate-900/50"
                                )}>
                                    {isUploading ? (
                                        <Activity className="animate-spin text-blue-400 mb-2" size={32} />
                                    ) : (
                                        <div className="relative">
                                            <Upload className="text-slate-400 mb-2 group-hover:text-blue-400 transition-colors" size={32} />
                                            {parsedResume && <CheckCircle className="absolute -top-2 -right-2 text-emerald-500 bg-slate-900 rounded-full" size={16} />}
                                        </div>
                                    )}
                                    <div className="text-center">
                                        <span className="text-sm text-slate-300 font-medium block group-hover:text-white transition-colors">
                                            {isUploading ? 'DECRYPTING DATA...' : 'UPLOAD CREDENTIALS'}
                                        </span>
                                        <span className="text-[10px] text-slate-500 mt-1 block font-mono">PDF / DOCX / TXT</span>
                                    </div>

                                    {/* Hover Scan Effect */}
                                    <div className="absolute inset-0 bg-blue-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 pointer-events-none"></div>
                                </div>
                            </div>
                        </div>

                        {/* Resume Status */}
                        {parsedResume && (
                            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3 flex items-start gap-3 backdrop-blur-md">
                                <Shield className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                                <div>
                                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Identity Verified</p>
                                    <p className="text-xs text-slate-400 font-mono mt-1">
                                        {parsedResume.skills.length} SKILLS EXTRACTED
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* 2. Target Role */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span> 02 Calibration Target
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={targetRole}
                                    onChange={(e) => setTargetRole(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all font-mono text-sm placeholder:text-slate-600"
                                    placeholder="ENTER ROLE ID..."
                                />
                                <Zap className="absolute right-3 top-3 text-slate-600" size={18} />
                            </div>
                        </div>

                        {/* 3. Analyze Action */}
                        <button
                            onClick={handleAnalyze}
                            disabled={!parsedResume || isAnalyzing || !targetRole}
                            className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] border border-white/10"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            {isAnalyzing ? <Activity className="animate-spin" /> : <Activity />}
                            <span className="relative z-10 tracking-widest text-sm">
                                {isAnalyzing ? 'GENERATING SYNTHESIS...' : 'INITIATE ANALYSIS'}
                            </span>
                        </button>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-3">
                                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
                                <p className="text-xs text-red-200 font-mono">{error}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Results */}
                <div className="w-2/3 bg-slate-950/40 p-10 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent relative">
                    {/* Grid Background */}
                    <div className="absolute inset-0 pointer-events-none opacity-10"
                        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }}>
                    </div>

                    {!parsedResume && !analysisResult ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-6">
                            <div className="w-24 h-24 rounded-full bg-slate-800/30 border border-slate-700 flex items-center justify-center relative animate-pulse">
                                <div className="absolute inset-0 rounded-full border border-blue-500/30 text-blue-500/30 animate-[spin_10s_linear_infinite]"></div>
                                <FileText size={40} opacity={0.4} />
                            </div>
                            <p className="font-mono text-sm tracking-widest opacity-60">AWAITING CREDENTIALS...</p>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

                            {/* Parsed Resume Summary */}
                            {parsedResume && !analysisResult && viewMode === 'analysis' && (
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl opacity-20 blur group-hover:opacity-40 transition duration-1000"></div>
                                    <div className="relative bg-slate-900/80 rounded-xl p-6 border border-slate-700/50">
                                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                                            <FileText className="text-blue-400" size={20} />
                                            <span className="tracking-widest text-sm uppercase">Subject Profile</span>
                                        </h2>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="bg-slate-950/50 p-3 rounded">
                                                <div className="text-[10px] text-slate-500 uppercase">Experience</div>
                                                <div className="text-slate-200 font-mono">{parsedResume.experience}</div>
                                            </div>
                                            <div className="bg-slate-950/50 p-3 rounded">
                                                <div className="text-[10px] text-slate-500 uppercase">Education</div>
                                                <div className="text-slate-200 font-mono truncate">{parsedResume.education}</div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-3 text-right">Extracted Competencies</h3>
                                            <div className="flex flex-wrap gap-2 justify-end">
                                                {parsedResume.skills.map((skill, idx) => (
                                                    <span key={idx} className="bg-blue-500/10 text-blue-200 border border-blue-500/20 text-xs px-3 py-1 rounded md:rounded-tr-lg font-mono">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Analysis Results View */}
                            {analysisResult && viewMode === 'analysis' && (
                                <>
                                    <div className="grid grid-cols-2 gap-6">
                                        {/* Common Skills */}
                                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5 backdrop-blur-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-2 opacity-20">
                                                <CheckCircle className="text-emerald-500" size={64} />
                                            </div>
                                            <h3 className="text-xs font-bold text-emerald-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                                                Matched Vectors
                                            </h3>
                                            <div className="flex flex-wrap gap-2 relative z-10">
                                                {analysisResult.common_skills.map((skill: string, idx: number) => (
                                                    <span key={idx} className="bg-emerald-500/10 text-emerald-200 text-xs px-2 py-1 rounded border border-emerald-500/20">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Missing Skills */}
                                        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5 backdrop-blur-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-2 opacity-20">
                                                <AlertCircle className="text-red-500" size={64} />
                                            </div>
                                            <h3 className="text-xs font-bold text-red-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                                                Gap Vectors
                                            </h3>
                                            <div className="flex flex-wrap gap-2 relative z-10">
                                                {analysisResult.missing_skills.map((skill: string, idx: number) => (
                                                    <span key={idx} className="bg-red-500/10 text-red-200 text-xs px-2 py-1 rounded border border-red-500/20">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recommendations */}
                                    <div className="relative">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-20 blur"></div>
                                        <div className="relative bg-slate-900/90 border border-slate-700 rounded-xl p-8">
                                            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                                                <Activity className="text-indigo-400" />
                                                <span className="tracking-widest uppercase text-sm">Strategic Synthesis</span>
                                            </h2>
                                            <div className="prose prose-invert prose-sm max-w-none text-slate-300 font-sans leading-relaxed">
                                                {Array.isArray(analysisResult.llama_recommendations) ? (
                                                    <div className="space-y-3">
                                                        {analysisResult.llama_recommendations.map((rec: any, idx: number) => (
                                                            <div key={idx} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                                                                <span className="text-indigo-300 font-semibold">{rec.skill}</span>
                                                                <span className="text-slate-400 text-xs">
                                                                    Priority Score: <span className="text-emerald-400 font-mono">{(parseFloat(rec.probability) * 100).toFixed(0)}%</span>
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <ReactMarkdown>{analysisResult.llama_recommendations}</ReactMarkdown>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Next Button */}
                                    <button
                                        onClick={() => setViewMode('roadmap')}
                                        className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group"
                                    >
                                        <span>INITIATE LEARNING PROTOCOL</span>
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </button>
                                </>
                            )}

                            {/* Roadmap View */}
                            {analysisResult && viewMode === 'roadmap' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                                    <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                                        <div className="flex flex-col">
                                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                                <Zap className="text-yellow-400" size={24} />
                                                <span className="tracking-widest uppercase">Targeted Learning Path</span>
                                            </h2>
                                            <div className="flex items-center gap-3 mt-2">
                                                <div className="h-1.5 w-32 bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                                                </div>
                                                <span className="text-[10px] text-emerald-400 font-mono">{progress}% SYNCED</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setViewMode('analysis')}
                                            className="text-xs text-slate-400 hover:text-white uppercase tracking-widest border border-slate-700 px-3 py-1 rounded hover:bg-slate-800 transition-colors"
                                        >
                                            Back to Analysis
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {analysisResult.roadmap?.map((step: any, idx: number) => {
                                            const isDone = completedSteps.has(idx);
                                            return (
                                                <div key={idx} className={clsx(
                                                    "relative pl-8 border-l-2 transition-all duration-500 group",
                                                    isDone ? "border-emerald-500/50 opacity-60" : "border-slate-800 hover:border-blue-500"
                                                )}>
                                                    {/* Timeline Node */}
                                                    <div
                                                        onClick={() => toggleStep(idx)}
                                                        className={clsx(
                                                            "absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 cursor-pointer transition-all flex items-center justify-center z-10",
                                                            isDone ? "bg-emerald-500 border-emerald-500" : "bg-slate-900 border-slate-600 group-hover:border-blue-500 group-hover:scale-125"
                                                        )}
                                                    >
                                                        {isDone && <CheckCircle size={10} className="text-slate-900" />}
                                                    </div>

                                                    <div className={clsx(
                                                        "border p-5 rounded-lg transition-all relative overflow-hidden",
                                                        isDone ? "bg-emerald-900/10 border-emerald-500/20" : "bg-slate-900/50 border-slate-800 hover:bg-slate-800/80"
                                                    )}>
                                                        {/* Actions Toolbar */}
                                                        <div className="absolute top-4 right-4 flex gap-2">
                                                            {/* Start Learning Button (Direct Access) */}
                                                            {step.resources && step.resources.length > 0 && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        window.open(step.resources[0].url, '_blank');
                                                                    }}
                                                                    className="text-[10px] px-3 py-1.5 rounded border border-blue-500/50 bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white transition-all uppercase font-bold flex items-center gap-1 shadow-lg shadow-blue-500/10"
                                                                >
                                                                    <Video size={12} /> Start Learning
                                                                </button>
                                                            )}

                                                            {/* Mark Complete Button */}
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleStep(idx);
                                                                }}
                                                                className={clsx(
                                                                    "text-[10px] px-3 py-1.5 rounded border transition-all uppercase font-bold flex items-center gap-1",
                                                                    isDone
                                                                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                                                                        : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                                                                )}
                                                            >
                                                                {isDone ? <CheckCircle size={12} /> : null}
                                                                {isDone ? 'Completed' : 'Mark Done'}
                                                            </button>
                                                        </div>

                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className={clsx(
                                                                "text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider",
                                                                isDone ? "text-emerald-400 bg-emerald-500/10" : "text-blue-400 bg-blue-500/10"
                                                            )}>
                                                                {step.week}
                                                            </span>
                                                        </div>
                                                        <h3 className={clsx("text-lg font-bold mb-2", isDone ? "text-emerald-100 line-through decoration-emerald-500/50" : "text-white")}>{step.title}</h3>
                                                        <p className="text-sm text-slate-400 mb-4 leading-relaxed max-w-[80%]">
                                                            {step.description}
                                                        </p>

                                                        <div className="flex flex-wrap gap-2 mt-4">
                                                            {step.resources.map((res: any, rIdx: number) => (
                                                                <a
                                                                    key={rIdx}
                                                                    href={res.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className="flex items-center gap-2 bg-slate-950 border border-slate-700 hover:border-blue-500 text-xs text-slate-300 hover:text-white px-3 py-2 rounded transition-all cursor-pointer group/link"
                                                                >
                                                                    <span className={clsx("w-1.5 h-1.5 rounded-full", isDone ? "bg-emerald-500" : "bg-blue-500 group-hover/link:animate-pulse")}></span>
                                                                    {res.title}
                                                                    <div className="flex items-center ml-2 border-l border-slate-700 pl-2">
                                                                        <span className="text-[9px] opacity-50 uppercase">{res.type}</span>
                                                                        <ArrowRight size={10} className="-rotate-45 ml-1 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                                                    </div>
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-8 p-4 bg-emerald-900/10 border border-emerald-500/20 rounded-xl text-center flex flex-col items-center gap-2">
                                        <p className="text-emerald-400 text-sm font-mono">
                                            ESTIMATED COMPETENCY ACHIEVEMENT: 8 WEEKS
                                        </p>
                                        <div className="text-slate-500 text-xs font-mono mb-2">
                                            {completedSteps.size} / {analysisResult.roadmap?.length} MODULES COMPLETED
                                        </div>
                                        <button
                                            onClick={handleLocate}
                                            disabled={isLocating}
                                            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-wait text-white font-bold py-3 px-6 rounded-lg uppercase tracking-widest text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                                        >
                                            {isLocating ? <Activity className="animate-spin" size={16} /> : <MapPin size={16} />}
                                            {isLocating ? 'SCANNING SECTOR...' : 'Locate Nearest Training Hubs'}
                                        </button>

                                        <div className="w-full border-t border-slate-700/50 my-2"></div>

                                        <div className="grid grid-cols-2 gap-2 w-full">
                                            <button
                                                onClick={() => setViewMode('experts')}
                                                className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/50 hover:border-blue-400 font-bold py-3 px-4 rounded-lg uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all group"
                                            >
                                                <Users size={14} className="group-hover:text-white transition-colors" />
                                                <span className="group-hover:text-white transition-colors">Find Mentors</span>
                                            </button>
                                            <button
                                                onClick={handleFetchInterviews}
                                                className="bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/50 hover:border-amber-400 font-bold py-3 px-4 rounded-lg uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all group"
                                            >
                                                <Briefcase size={14} className="group-hover:text-white transition-colors" />
                                                <span className="group-hover:text-white transition-colors">Interview Prep</span>
                                            </button>
                                        </div>

                                        <button
                                            onClick={handleStartQuiz}
                                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-lg uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
                                        >
                                            <Brain size={16} /> Take Skill Assessment
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Institutions View */}
                            {analysisResult && viewMode === 'institutions' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500 h-full flex flex-col">
                                    <div className="flex items-center justify-between border-b border-slate-700 pb-4 shrink-0">
                                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                            <Shield className="text-blue-400" size={24} />
                                            <span className="tracking-widest uppercase">Detected Signals</span>
                                        </h2>
                                        <button
                                            onClick={() => setViewMode('roadmap')}
                                            className="text-xs text-slate-400 hover:text-white uppercase tracking-widest border border-slate-700 px-3 py-1 rounded hover:bg-slate-800 transition-colors"
                                        >
                                            Back to Plan
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                                        {analysisResult.institutions?.map((inst: any, idx: number) => (
                                            <div key={idx} className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group hover:border-blue-500/50 transition-all">

                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/30 text-blue-400 shrink-0">
                                                        <Activity size={24} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">{inst.name}</h3>
                                                        <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                                                            <Zap size={12} className="text-yellow-500" />
                                                            <span>{inst.rating} / 5.0</span>
                                                            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                                            <span>{inst.location}</span>
                                                        </div>
                                                        <div className="text-xs font-mono text-emerald-400 mt-2 bg-emerald-500/10 inline-block px-2 py-0.5 rounded border border-emerald-500/20">
                                                            {inst.cost}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                                                    <div className="text-right">
                                                        <div className="text-[10px] text-slate-500 uppercase tracking-widest">Proximity</div>
                                                        <div className="text-lg font-mono text-white">{inst.distance}</div>
                                                    </div>
                                                    <a
                                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(inst.name)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-full md:w-auto bg-slate-800 hover:bg-blue-600 text-white text-xs font-bold py-2 px-4 rounded border border-slate-600 hover:border-blue-500 transition-all inline-block text-center no-underline"
                                                    >
                                                        ESTABLISH UPLINK
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Assessment View */}
                            {analysisResult && viewMode === 'assessment' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500 h-full flex flex-col">
                                    <div className="flex items-center justify-between border-b border-slate-700 pb-4 shrink-0">
                                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                            <Brain className="text-purple-400" size={24} />
                                            <span className="tracking-widest uppercase">Competency Verification</span>
                                        </h2>
                                        <button
                                            onClick={() => setViewMode('roadmap')}
                                            className="text-xs text-slate-400 hover:text-white uppercase tracking-widest border border-slate-700 px-3 py-1 rounded hover:bg-slate-800 transition-colors"
                                        >
                                            Abort Test
                                        </button>
                                    </div>

                                    {!showQuizResult ? (
                                        isLoadingQuiz ? (
                                            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                                                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                                <p className="text-purple-400 font-mono text-sm animate-pulse">GENERATING TARGETED ASSESSMENT...</p>
                                            </div>
                                        ) : (
                                            <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
                                                <div className="mb-8">
                                                    <div className="flex justify-between items-end mb-2">
                                                        <span className="text-xs font-mono text-purple-400">QUERY {quizIndex + 1} OF {quizData.length}</span>
                                                        <span className="text-xs font-mono text-slate-500">DIFFICULTY: HIGH</span>
                                                    </div>
                                                    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-purple-500 transition-all duration-300"
                                                            style={{ width: `${((quizIndex + 1) / quizData.length) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-8 mb-6">
                                                    <h3 className="text-xl font-bold text-white mb-2">{quizData[quizIndex]?.question}</h3>
                                                </div>

                                                <div className="grid grid-cols-1 gap-4">
                                                    {quizData[quizIndex]?.options.map((opt: string, idx: number) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => handleAnswer(idx)}
                                                            className="bg-slate-800/50 hover:bg-purple-600/20 border border-slate-700 hover:border-purple-500 text-left p-4 rounded-lg transition-all flex items-center justify-between group"
                                                        >
                                                            <span className="text-slate-300 group-hover:text-white font-mono text-sm">{opt}</span>
                                                            <ChevronRight className="opacity-0 group-hover:opacity-100 text-purple-400 transition-opacity" size={16} />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in duration-500">
                                            <div className="w-32 h-32 rounded-full flex items-center justify-center relative">
                                                <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-pulse"></div>
                                                <div className="relative bg-slate-900 border-2 border-purple-500 rounded-full w-full h-full flex items-center justify-center">
                                                    <Award className="text-purple-400" size={64} />
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-3xl font-bold text-white mb-2">ASSESSMENT COMPLETE</h3>
                                                <p className="text-slate-400 font-mono">
                                                    SCORE: <span className="text-purple-400 text-xl font-bold">{score} / {quizData.length}</span>
                                                </p>
                                            </div>

                                            {score / quizData.length >= 0.8 ? (
                                                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-6 max-w-md">
                                                    <h4 className="text-emerald-400 font-bold mb-2 flex items-center justify-center gap-2">
                                                        <CheckCircle size={18} /> CERTIFICATION AUTHORIZED
                                                    </h4>
                                                    <p className="text-xs text-emerald-200/70">
                                                        Candidate has demonstrated sufficient proficiency in the target vectors. Resume enhancement protocols initiated.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 max-w-md">
                                                    <h4 className="text-yellow-400 font-bold mb-2 flex items-center justify-center gap-2">
                                                        <AlertCircle size={18} /> FURTHER TRAINING REQUIRED
                                                    </h4>
                                                    <p className="text-xs text-yellow-200/70">
                                                        Proficiency threshold not met. Recommend revisiting learning modules modules 01-04.
                                                    </p>
                                                </div>
                                            )}

                                            <div className="flex gap-4">
                                                <button
                                                    onClick={handleStartQuiz}
                                                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-lg uppercase tracking-widest text-xs transition-colors"
                                                >
                                                    Retry Exam
                                                </button>
                                                <button
                                                    onClick={() => setViewMode('roadmap')}
                                                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg uppercase tracking-widest text-xs transition-colors"
                                                >
                                                    Return to Plan
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Expert Talk View */}
                            {analysisResult && viewMode === 'experts' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500 h-full flex flex-col">
                                    <div className="flex items-center justify-between border-b border-slate-700 pb-4 shrink-0">
                                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                            <Users className="text-blue-400" size={24} />
                                            <span className="tracking-widest uppercase">Expert Uplink</span>
                                        </h2>
                                        <button
                                            onClick={() => setViewMode('roadmap')}
                                            className="text-xs text-slate-400 hover:text-white uppercase tracking-widest border border-slate-700 px-3 py-1 rounded hover:bg-slate-800 transition-colors"
                                        >
                                            Back to Plan
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                                        <p className="text-sm text-slate-400 font-mono mb-4 border-l-2 border-blue-500 pl-4 py-2 bg-blue-500/5">
                                            Connecting with senior operators can accelerate competency acquisition by 40%. Select a mentor to initiate a secure channel.
                                        </p>

                                        {!mentors.length && (
                                            <div className="text-center py-12">
                                                <button
                                                    onClick={handleFetchMentors}
                                                    disabled={isLoadingMentors}
                                                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg uppercase tracking-widest text-xs inline-flex items-center gap-2"
                                                >
                                                    {isLoadingMentors ? <Activity className="animate-spin" /> : <Users />}
                                                    {isLoadingMentors ? 'SCANNING LINKEDIN...' : 'INITIATE MENTOR SCAN'}
                                                </button>
                                            </div>
                                        )}

                                        {mentors.map((expert: any, idx: number) => (
                                            <div key={idx} className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 group hover:border-blue-500/50 transition-all">

                                                {/* Avatar */}
                                                <div className="relative">
                                                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-600 group-hover:border-blue-400 transition-colors">
                                                        <Users size={32} className="text-slate-400 group-hover:text-blue-400" />
                                                    </div>
                                                    <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-slate-900 ${expert.status === 'Online' ? 'bg-emerald-500' : 'bg-yellow-500'}`}></div>
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 text-center md:text-left">
                                                    <h3 className="text-lg font-bold text-white flex items-center justify-center md:justify-start gap-2">
                                                        {expert.name}
                                                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-600 uppercase tracking-wider">{expert.company}</span>
                                                    </h3>
                                                    <p className="text-blue-400 text-xs font-mono mb-2">{expert.title}</p>
                                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                                        {expert.topics.map((topic: string, tIdx: number) => (
                                                            <span key={tIdx} className="text-[10px] text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                                                                {topic}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex flex-col gap-2 w-full md:w-auto">
                                                    <div className="flex items-center justify-center gap-1 text-yellow-400 text-xs font-bold mb-1">
                                                        <Zap size={12} fill="currentColor" /> {expert.rating}
                                                    </div>

                                                    <a
                                                        href={expert.profile_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 px-6 rounded transition-all shadow-lg shadow-blue-600/20"
                                                    >
                                                        <Video size={14} /> CONNECT ON LINKEDIN
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}



                            {/* Interview Prep View */}
                            {analysisResult && viewMode === 'interview' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500 h-full flex flex-col">
                                    <div className="flex items-center justify-between border-b border-slate-700 pb-4 shrink-0">
                                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                            <Building2 className="text-amber-400" size={24} />
                                            <span className="tracking-widest uppercase">Target Corp. Protocol</span>
                                        </h2>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    // Download Logic
                                                    const element = document.createElement("a");
                                                    const questions = interviewData.map((c: any) =>
                                                        `[${c.company} - ${c.style}]\n${c.questions.map((q: string) => `- ${q}`).join('\n')}`
                                                    ).join('\n\n');
                                                    const file = new Blob([questions], { type: 'text/plain' });
                                                    element.href = URL.createObjectURL(file);
                                                    element.download = "interview_prep_pack.txt";
                                                    document.body.appendChild(element);
                                                    element.click();
                                                }}
                                                className="text-xs bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white uppercase tracking-widest border border-amber-600/50 px-3 py-1 rounded transition-colors flex items-center gap-2"
                                            >
                                                <Download size={14} /> Pack PDF
                                            </button>
                                            <button
                                                onClick={() => setViewMode('roadmap')}
                                                className="text-xs text-slate-400 hover:text-white uppercase tracking-widest border border-slate-700 px-3 py-1 rounded hover:bg-slate-800 transition-colors"
                                            >
                                                Back
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto pr-2 space-y-6">

                                        {isLoadingInterview ? (
                                            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                                                <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                                                <p className="text-amber-400 font-mono text-sm animate-pulse">DECRYPTING CORPORATE PROTOCOLS...</p>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-sm text-slate-400 font-mono mb-4 border-l-2 border-amber-500 pl-4 py-2 bg-amber-500/5">
                                                    Extracted high-frequency interrogation vectors from top-tier entities. Study these patterns to ensure successful infiltration.
                                                </p>
                                                {interviewData.length > 0 && interviewData.map((item, idx) => (
                                                    <div key={idx} className={`bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden group`}>
                                                        <div className={`bg-slate-800/50 p-4 border-b border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-2`}>
                                                            <div>
                                                                <h3 className={`text-lg font-bold text-white flex items-center gap-2`}>
                                                                    <span className={`w-2 h-2 rounded-full ${['bg-red-500', 'bg-blue-500', 'bg-yellow-500'][idx % 3]}`}></span>
                                                                    {item.company}
                                                                </h3>
                                                                {item.style && (
                                                                    <p className="text-xs text-amber-400 font-mono mt-1 opacity-80">{item.style}</p>
                                                                )}
                                                            </div>
                                                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider bg-slate-900 px-2 py-1 rounded">High Probability</span>
                                                        </div>
                                                        <div className="p-4 space-y-3">
                                                            {item.questions.map((q: string, qIdx: number) => (
                                                                <div key={qIdx} className="flex gap-4 items-start group/q hover:bg-slate-800/50 p-2 rounded transition-colors cursor-default">
                                                                    <div className="text-slate-600 font-mono text-xs pt-1">Q{qIdx + 1}</div>
                                                                    <p className="text-slate-300 text-sm font-medium leading-relaxed group-hover/q:text-white transition-colors">
                                                                        {q}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                                {interviewData.length === 0 && (
                                                    <div className="text-center text-slate-500">No interview data found.</div>
                                                )}
                                            </>
                                        )}

                                        <div className="p-4 rounded-xl border border-dashed border-slate-700 text-center">
                                            <p className="text-xs text-slate-500 font-mono mb-2">Need more data?</p>
                                            <button
                                                onClick={() => handleFetchInterviews()}
                                                className="text-xs text-blue-400 hover:text-blue-300 uppercase tracking-widest border-b border-blue-500/30 hover:border-blue-500 transition-all pb-0.5"
                                            >
                                                Refresh Protocols
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}

