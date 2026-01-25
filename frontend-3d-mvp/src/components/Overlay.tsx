'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Upload, Activity, AlertCircle, FileText, CheckCircle, Cpu, Shield, Zap, Eye, EyeOff, MapPin, Brain, Award, ChevronRight, Users, MessageSquare, Video, Mic, Download, Briefcase, Building2, ArrowRight, FileUp } from 'lucide-react';
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
    const [jdFile, setJdFile] = useState<File | null>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [viewMode, setViewMode] = useState<'analysis' | 'roadmap' | 'institutions' | 'assessment' | 'experts' | 'interview' | 'verification' | 'vault'>('analysis');

    // Vault State
    const [vaultExperiences, setVaultExperiences] = useState<any[]>([]);
    const [isSavingExp, setIsSavingExp] = useState(false);
    const [showVaultForm, setShowVaultForm] = useState(false);
    const [newExperience, setNewExperience] = useState({ company: '', role: '', experience: '', questions: '' });

    const fetchVault = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/interview_experiences`);
            const data = await res.json();
            setVaultExperiences(data);
            setViewMode('vault');
        } catch (e) {
            console.error("Failed to load vault", e);
        }
    };

    const handleSaveExperience = async () => {
        if (!newExperience.company || !newExperience.role) return;
        setIsSavingExp(true);
        try {
            const res = await fetch(`${API_BASE_URL}/interview_experiences`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newExperience)
            });
            if (res.ok) {
                // simple reload
                fetchVault();
                setShowVaultForm(false);
                setNewExperience({ company: '', role: '', experience: '', questions: '' });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSavingExp(false);
        }
    };
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
    const [isLocating, setIsLocating] = useState(false);

    // Mentor State
    const [mentors, setMentors] = useState<any[]>([]);
    const [isLoadingMentors, setIsLoadingMentors] = useState(false);

    const handleFetchMentors = async () => {
        setIsLoadingMentors(true);
        setMentors([]); // Clear previous results

        if (USE_MOCK_DATA) {
            // Mock fallback with dynamic role names
            setTimeout(() => {
                setMentors([
                    {
                        name: `Senior ${targetRole} Lead`,
                        title: `Staff ${targetRole}`,
                        company: "Top Tech Co",
                        topics: ["Mentorship", targetRole, "Architecture"],
                        rating: 4.9,
                        status: "Online",
                        cost: "$150/hr",
                        profile_url: "#"
                    },
                    {
                        name: `${targetRole} Specialist`,
                        title: "Principal Engineer",
                        company: "Global Systems",
                        topics: ["Scaling", "Interviews"],
                        rating: 4.8,
                        status: "Busy",
                        cost: "$200/hr",
                        profile_url: "#"
                    }
                ]);
                setIsLoadingMentors(false);
            }, 1500);
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/find_mentors`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: targetRole })
            });

            if (!res.ok) throw new Error("Backend error");

            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                setMentors(data);
            } else {
                throw new Error("No mentors found");
            }
        } catch (e) {
            console.error("Failed to fetch mentors", e);
            // Fallback to manual link if API fails or returns empty
            setMentors([{
                name: "Search on LinkedIn",
                title: `Find ${targetRole} Experts`,
                company: "LinkedIn Network",
                topics: ["Networking", "Direct Search", targetRole],
                rating: "5.0",
                status: "Online",
                cost: "Free",
                profile_url: `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(targetRole)}`
            }]);
        } finally {
            setIsLoadingMentors(false);
        }
    };

    // Quiz State
    const [quizData, setQuizData] = useState<any[]>([]);
    const [quizIndex, setQuizIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showQuizResult, setShowQuizResult] = useState(false);

    // Verification Quiz State
    const [verificationQuizData, setVerificationQuizData] = useState<any[]>([]);
    const [verificationIndex, setVerificationIndex] = useState(0);
    const [verificationScore, setVerificationScore] = useState(0);
    const [showVerificationResult, setShowVerificationResult] = useState(false);
    const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

    const handleVerifySkills = async () => {
        if (!analysisResult?.common_skills || !targetRole) return;

        setViewMode('verification');
        setIsGeneratingQuiz(true);
        setVerificationQuizData([]);
        setVerificationIndex(0);
        setVerificationScore(0);
        setShowVerificationResult(false);

        if (USE_MOCK_DATA) {
            setTimeout(() => {
                setVerificationQuizData(getMockAssessment(targetRole)); // Reuse mock for now
                setIsGeneratingQuiz(false);
            }, 1000);
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/verify_skills`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    role: targetRole,
                    matched_skills: analysisResult.common_skills
                })
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setVerificationQuizData(data);
            }
        } catch (e) {
            console.error("Failed to fetch verification quiz", e);
            // Fallback to mock
            setVerificationQuizData(getMockAssessment(targetRole));
        } finally {
            setIsGeneratingQuiz(false);
        }
    };

    const handleVerificationAnswer = (optionIdx: number) => {
        if (optionIdx === verificationQuizData[verificationIndex].correct) {
            setVerificationScore(prev => prev + 1);
        }

        if (verificationIndex + 1 < verificationQuizData.length) {
            setVerificationIndex(prev => prev + 1);
        } else {
            setShowVerificationResult(true);
        }
    };

    const handleStartQuiz = () => {
        setQuizData(getMockAssessment(targetRole));
        setQuizIndex(0);
        setScore(0);
        setShowQuizResult(false);
        setViewMode('assessment');
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

    const handleJdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setJdFile(file);
            setTargetRole('Custom Job Description'); // Placeholder for UI
        }
    };

    const handleAnalyze = async () => {
        if (!parsedResume) return;
        if (!targetRole && !jdFile) return;

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
            let res;
            if (jdFile) {
                // JD File based analysis
                const formData = new FormData();
                formData.append('jd_file', jdFile);
                formData.append('user_skills', JSON.stringify(parsedResume.skills || []));

                res = await fetch(`${API_BASE_URL}/analyze_with_jd`, {
                    method: 'POST',
                    body: formData, // No Content-Type header needed for FormData here, browser sets it
                });

            } else {
                // Legacy Target Role based analysis
                res = await fetch(`${API_BASE_URL}/analyze_skills`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        role: targetRole,
                        user_skills: parsedResume.skills || [],
                    }),
                });
            }

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

                        {/* 2. Upload Job Description */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span> 02 Calibration Target
                            </label>

                            <div className="relative group">
                                <input
                                    type="file"
                                    accept=".pdf,.docx,.txt"
                                    onChange={handleJdUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className={clsx(
                                    "border border-dashed border-slate-600 rounded-lg p-6 flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden",
                                    jdFile ? "bg-indigo-900/10 border-indigo-500/50" : "group-hover:border-indigo-400 group-hover:bg-slate-800/80 bg-slate-900/50"
                                )}>
                                    <div className="relative">
                                        <FileUp className={clsx("mb-2 transition-colors", jdFile ? "text-indigo-400" : "text-slate-400 group-hover:text-indigo-400")} size={28} />
                                        {jdFile && <CheckCircle className="absolute -top-1 -right-1 text-emerald-500 bg-slate-900 rounded-full" size={14} />}
                                    </div>
                                    <div className="text-center">
                                        <span className={clsx("text-sm font-medium block transition-colors", jdFile ? "text-indigo-300" : "text-slate-300 group-hover:text-white")}>
                                            {jdFile ? jdFile.name : 'UPLOAD JOB DESCRIPTION'}
                                        </span>
                                        <span className="text-[10px] text-slate-500 mt-1 block font-mono">PDF / DOCX / TXT</span>
                                    </div>
                                </div>
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
                                {isAnalyzing ? 'ANALYZING...' : 'ANALYZE SKILLS'}
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
                                                <div className="text-slate-200 font-mono truncate" title={parsedResume.education}>{parsedResume.education}</div>
                                            </div>
                                            {parsedResume.certifications && parsedResume.certifications.length > 0 && (
                                                <div className="col-span-2 bg-slate-950/50 p-3 rounded">
                                                    <div className="text-[10px] text-slate-500 uppercase mb-1">Certifications</div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {parsedResume.certifications.map((cert: string, idx: number) => (
                                                            <span key={idx} className="text-[10px] font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 px-2 py-0.5 rounded">
                                                                {cert}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
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
                                            <div className="absolute top-0 right-0 p-2 opacity-20 pointer-events-none">
                                                <CheckCircle className="text-emerald-500" size={64} />
                                            </div>

                                            <div className="flex justify-between items-center mb-4 relative z-10">
                                                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                                    Matched Vectors
                                                </h3>
                                                <button
                                                    onClick={handleVerifySkills}
                                                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-[10px] px-3 py-1.5 rounded shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 select-none"
                                                    title="Verify these skills with a test"
                                                >
                                                    <Brain size={14} /> VERIFY MATCH
                                                </button>
                                            </div>

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

                                                        <div className="flex flex-col gap-4 mt-4">
                                                            {/* 1. Main Resources */}
                                                            <div className="flex flex-wrap gap-2">
                                                                {step.resources?.map((res: any, rIdx: number) => (
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

                                                            {/* 2. Certification Path (Separate Footer) */}
                                                            {step.certifications && step.certifications.length > 0 && (
                                                                <div className="mt-2 border-t border-slate-800 pt-3">
                                                                    <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                                        <Award size={12} /> Path to Complete Certification
                                                                    </h4>
                                                                    <div className="grid grid-cols-1 gap-2">
                                                                        {step.certifications.map((cert: any, cIdx: number) => (
                                                                            <a
                                                                                key={cIdx}
                                                                                href={cert.link || cert.url}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                onClick={(e) => e.stopPropagation()}
                                                                                className="flex items-center justify-between bg-indigo-950/20 border border-indigo-500/20 hover:border-indigo-400 hover:bg-indigo-900/40 px-4 py-3 rounded-lg transition-all group/cert"
                                                                            >
                                                                                <div className="flex flex-col">
                                                                                    <span className="text-white text-xs font-bold group-hover/cert:text-indigo-200 transition-colors">{cert.title}</span>
                                                                                    <span className="text-[10px] text-indigo-400/70 font-mono mt-0.5 uppercase">{cert.provider}</span>
                                                                                </div>
                                                                                <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 border border-indigo-500/30 px-2 py-1 rounded bg-indigo-500/10">
                                                                                    GET CERTIFIED <ArrowRight size={10} />
                                                                                </div>
                                                                            </a>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-8 p-4 bg-emerald-900/10 border border-emerald-500/20 rounded-xl text-center flex flex-col items-center gap-2">
                                        <p className="text-emerald-400 text-sm font-mono">
                                            ESTIMATED COMPETENCY ACHIEVEMENT: {analysisResult.roadmap?.length || 0} WEEKS
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
                                                onClick={() => setViewMode('interview')}
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
                                                        <Video size={14} /> VIEW PROFILE
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
                                                    // Mock Download
                                                    const element = document.createElement("a");
                                                    const questions = getMockInterviews(targetRole).map(c =>
                                                        `[${c.company}]\n${c.questions.map(q => `- ${q}`).join('\n')}`
                                                    ).join('\n\n');
                                                    const file = new Blob([questions], { type: 'text/plain' });
                                                    element.href = URL.createObjectURL(file);
                                                    element.download = "interview_prep_pack_v1.txt";
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
                                        <p className="text-sm text-slate-400 font-mono mb-4 border-l-2 border-amber-500 pl-4 py-2 bg-amber-500/5">
                                            Extracted high-frequency interrogation vectors from top-tier entities. Study these patterns to ensure successful infiltration.
                                        </p>

                                        {getMockInterviews(targetRole).map((item, idx) => (
                                            <div key={idx} className={`bg-slate-900/50 border ${item.border} rounded-xl overflow-hidden group`}>
                                                <div className={`${item.bg} p-4 border-b ${item.border} flex items-center justify-between`}>
                                                    <h3 className={`text-lg font-bold ${item.company === 'Google' ? 'text-white' : 'text-white'} flex items-center gap-2`}>
                                                        <span className={`w-2 h-2 rounded-full ${item.company === 'Google' ? 'bg-red-500' : item.company === 'Meta' ? 'bg-blue-500' : 'bg-yellow-500'}`}></span>
                                                        {item.company}
                                                    </h3>
                                                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">High Probability</span>
                                                </div>
                                                <div className="p-4 space-y-3">
                                                    {item.questions.map((q, qIdx) => (
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

                                        <div className="p-4 rounded-xl border border-dashed border-slate-700 text-center">
                                            <p className="text-xs text-slate-500 font-mono mb-2">Need more data?</p>
                                            <button
                                                onClick={() => alert('Accessing deep web archives...')}
                                                className="text-xs text-blue-400 hover:text-blue-300 uppercase tracking-widest border-b border-blue-500/30 hover:border-blue-500 transition-all pb-0.5"
                                            >
                                                Load Archived Sets
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Verification Quiz View */}
                            {analysisResult && viewMode === 'verification' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500 h-full flex flex-col">
                                    <div className="flex items-center justify-between border-b border-slate-700 pb-4 shrink-0">
                                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                            <Brain className="text-emerald-400" size={24} />
                                            <span className="tracking-widest uppercase">Skill Verification</span>
                                        </h2>
                                        <button
                                            onClick={() => setViewMode('analysis')}
                                            className="text-xs text-slate-400 hover:text-white uppercase tracking-widest border border-slate-700 px-3 py-1 rounded hover:bg-slate-800 transition-colors"
                                        >
                                            Return to Analysis
                                        </button>
                                    </div>

                                    {isGeneratingQuiz ? (
                                        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                                            <Activity className="text-emerald-500 animate-spin" size={48} />
                                            <p className="text-slate-400 font-mono animate-pulse">GENERATING VERIFICATION VECTORS...</p>
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex flex-col">
                                            {!showVerificationResult && verificationQuizData.length > 0 ? (
                                                <div className="space-y-8">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <span className="text-xs font-mono text-emerald-400">
                                                            QUESTION {verificationIndex + 1} / {verificationQuizData.length}
                                                        </span>
                                                        <div className="h-1 bg-slate-800 rounded-full w-32 overflow-hidden">
                                                            <div
                                                                className="h-full bg-emerald-500 transition-all duration-300"
                                                                style={{ width: `${((verificationIndex + 1) / verificationQuizData.length) * 100}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-8 mb-6 relative overflow-hidden">
                                                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                                                        <h3 className="text-xl font-bold text-white mb-2">{verificationQuizData[verificationIndex]?.question}</h3>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-4">
                                                        {verificationQuizData[verificationIndex]?.options.map((opt: string, idx: number) => (
                                                            <button
                                                                key={idx}
                                                                onClick={() => handleVerificationAnswer(idx)}
                                                                className="bg-slate-800/50 hover:bg-emerald-600/20 border border-slate-700 hover:border-emerald-500 text-left p-4 rounded-lg transition-all flex items-center justify-between group"
                                                            >
                                                                <span className="text-slate-300 group-hover:text-white font-mono text-sm">{opt}</span>
                                                                <div className="w-4 h-4 rounded-full border border-slate-500 group-hover:border-emerald-400 flex items-center justify-center">
                                                                    <div className="w-2 h-2 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in duration-500">

                                                    {/* Percentage Visualization */}
                                                    <div className="relative w-48 h-48 flex items-center justify-center">
                                                        {/* SVG Progress Circle */}
                                                        <svg className="absolute inset-0 w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
                                                            <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
                                                            <circle
                                                                cx="50" cy="50" r="45"
                                                                fill="none"
                                                                stroke={verificationScore / verificationQuizData.length >= 0.7 ? "#10b981" : "#f59e0b"}
                                                                strokeWidth="8"
                                                                strokeDasharray={`${(verificationScore / verificationQuizData.length) * 283} 283`}
                                                                strokeLinecap="round"
                                                                className="transition-all duration-1000 ease-out"
                                                            />
                                                        </svg>

                                                        <div className="text-center z-10">
                                                            <span className={`text-4xl font-bold ${verificationScore / verificationQuizData.length >= 0.7 ? "text-emerald-400" : "text-amber-400"}`}>
                                                                {Math.round((verificationScore / verificationQuizData.length) * 100)}%
                                                            </span>
                                                            <span className="block text-[10px] text-slate-400 tracking-widest mt-1">PROFICIENCY</span>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h3 className="text-3xl font-bold text-white mb-2">VERIFICATION COMPLETE</h3>
                                                        <p className="text-slate-400 font-mono">
                                                            Validating matched skills against domain requirements.
                                                        </p>
                                                    </div>

                                                    {verificationScore / verificationQuizData.length >= 0.7 ? (
                                                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-6 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
                                                            <h4 className="text-emerald-400 font-bold mb-2 flex items-center justify-center gap-2">
                                                                <Shield size={18} /> SKILLS VERIFIED
                                                            </h4>
                                                            <p className="text-xs text-emerald-200/70">
                                                                Candidate has successfully demonstrated proficiency in the claimed skills. Profile credibility increased.
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-4">
                                                            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-center">
                                                                <h4 className="text-amber-400 font-bold mb-1 flex items-center justify-center gap-2">
                                                                    <AlertCircle size={18} /> SKILL GAP DETECTED
                                                                </h4>
                                                                <p className="text-xs text-amber-200/70">
                                                                    Your proficiency ({(verificationScore / verificationQuizData.length * 100).toFixed(0)}%) is below the industry standard (70%). Recommended refresher resources:
                                                                </p>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                                                                {analysisResult.common_skills.slice(0, 4).map((skill: string, idx: number) => (
                                                                    <a
                                                                        key={idx}
                                                                        href={`https://www.youtube.com/results?search_query=${skill.replace(' ', '+')}+crash+course`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="flex items-center gap-3 bg-slate-900 border border-slate-700 hover:border-red-500 p-3 rounded-lg group transition-all hover:bg-slate-800"
                                                                    >
                                                                        <div className="w-8 h-8 rounded bg-red-600/20 text-red-500 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                                                                            <Video size={16} />
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-sm font-bold text-slate-200 group-hover:text-white">{skill}</div>
                                                                            <div className="text-[10px] text-slate-500 group-hover:text-red-300">View Tutorials</div>
                                                                        </div>
                                                                        <ChevronRight size={14} className="ml-auto text-slate-600 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all" />
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <button
                                                        onClick={() => setViewMode('analysis')}
                                                        className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-lg uppercase tracking-widest text-xs transition-colors"
                                                    >
                                                        Return to Analysis
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                    {/* Interview Vault View */}
                    {viewMode === 'vault' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <MessageSquare className="text-pink-400" size={24} />
                                    <span className="tracking-widest uppercase">Interview Experience Vault</span>
                                </h2>
                                <button
                                    onClick={() => setShowVaultForm(!showVaultForm)}
                                    className="bg-pink-500 hover:bg-pink-400 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                >
                                    {showVaultForm ? 'Close Form' : '+ Share Experience'}
                                </button>
                            </div>

                            {/* Add Form */}
                            {showVaultForm && (
                                <div className="bg-slate-900/50 p-6 rounded-xl border border-pink-500/30 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Company Name (e.g. Google)"
                                            className="bg-slate-950 border border-slate-700 p-3 rounded-lg text-white w-full"
                                            value={newExperience.company}
                                            onChange={e => setNewExperience({ ...newExperience, company: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Role (e.g. SDE-1)"
                                            className="bg-slate-950 border border-slate-700 p-3 rounded-lg text-white w-full"
                                            value={newExperience.role}
                                            onChange={e => setNewExperience({ ...newExperience, role: e.target.value })}
                                        />
                                    </div>
                                    <textarea
                                        placeholder="Describe your overall experience, difficulty, rounds..."
                                        className="bg-slate-950 border border-slate-700 p-3 rounded-lg text-white w-full h-24"
                                        value={newExperience.experience}
                                        onChange={e => setNewExperience({ ...newExperience, experience: e.target.value })}
                                    />
                                    <textarea
                                        placeholder="Questions asked (one per line)..."
                                        className="bg-slate-950 border border-slate-700 p-3 rounded-lg text-white w-full h-24 font-mono text-sm"
                                        value={newExperience.questions}
                                        onChange={e => setNewExperience({ ...newExperience, questions: e.target.value })}
                                    />
                                    <button
                                        onClick={handleSaveExperience}
                                        disabled={isSavingExp}
                                        className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {isSavingExp ? 'Saving...' : 'Submit Experience'}
                                    </button>
                                </div>
                            )}

                            {/* List */}
                            <div className="grid grid-cols-1 gap-4">
                                {vaultExperiences.length === 0 ? (
                                    <div className="text-center text-slate-500 py-10 italic">No experiences shared yet. Be the first!</div>
                                ) : (
                                    vaultExperiences.map((exp: any, idx: number) => (
                                        <div key={idx} className="bg-slate-900/30 border border-slate-800 rounded-xl p-6 hover:border-pink-500/30 transition-colors">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-lg font-bold text-white">{exp.company}</h3>
                                                    <p className="text-sm text-pink-400 font-mono">{exp.role}</p>
                                                </div>
                                                <span className="text-xs text-slate-500">{exp.date}</span>
                                            </div>

                                            {exp.experience && (
                                                <div className="mb-4">
                                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Experience</h4>
                                                    <p className="text-slate-300 text-sm leading-relaxed">{exp.experience}</p>
                                                </div>
                                            )}

                                            {exp.questions && (
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Questions Asked</h4>
                                                    <div className="bg-black/30 p-3 rounded text-sm font-mono text-emerald-300 whitespace-pre-wrap">
                                                        {exp.questions}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            <button
                                onClick={() => setViewMode('analysis')}
                                className="w-full mt-4 text-xs text-slate-500 hover:text-white uppercase tracking-widest"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    )}

                    {viewMode === 'analysis' && analysisResult && (
                        <div className="mt-8 border-t border-slate-800 pt-6">
                            <button
                                onClick={fetchVault}
                                className="w-full bg-slate-800 hover:bg-slate-700 text-pink-300 border border-pink-500/20 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all group"
                            >
                                <MessageSquare size={18} />
                                <span>OPEN INTERVIEW EXPERIENCE VAULT</span>
                                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
