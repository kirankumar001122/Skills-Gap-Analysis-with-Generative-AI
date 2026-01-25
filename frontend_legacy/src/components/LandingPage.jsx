import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './ui/Header';
import Footer from './ui/Footer';
import Button from './ui/Button';
import Card from './ui/Card';
import { ParticleBackground } from '../three';
import { ROUTES } from '../utils/constants';

/**
 * LandingPage Component
 * Modern, responsive landing page with Three.js background and animations
 * Features clean design, accessibility, and smooth transitions
 */
function LandingPage() {
  const navigate = useNavigate();

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-950 relative overflow-hidden">
      {/* Three.js Particle Background */}
      <ParticleBackground
        particleCount={150}
        color={0x00ff41}
        intensity={0.3}
        speed={0.2}
        size={0.04}
      />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 pt-20 md:pt-24 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-6xl mx-auto"
          >
            {/* Hero Section */}
            <div className="text-center mb-16 md:mb-20">
              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
              >
                <span className="block">Building</span>
                <span className="block text-gradient mt-2">Community.</span>
                <span className="block mt-4">Creating</span>
                <span className="block text-gradient mt-2">Connections.</span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed"
              >
                Bridge the gap between skills and opportunities through AI-powered analysis.
                Discover your path to success.
              </motion.p>
            </div>

            {/* CTA Cards Grid */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            >
              {/* Job Seeker Card */}
              <motion.div variants={cardVariants}>
                <Card
                  variant="elevated"
                  hover
                  onClick={() => navigate(ROUTES.JOB_SEEKER)}
                  className="cursor-pointer group h-full flex flex-col"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      navigate(ROUTES.JOB_SEEKER);
                    }
                  }}
                  aria-label="Navigate to Job Seeker page"
                >
                  <div className="text-center flex-1 flex flex-col">
                    <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-500/30 transition-all duration-300 group-hover:scale-110">
                      <svg
                        className="w-8 h-8 text-primary-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Job Seeker</h3>
                    <p className="text-gray-400 mb-6 flex-1">
                      Analyze your skills, find gaps, and discover personalized learning paths
                      to advance your career.
                    </p>
                    <Button variant="primary" className="w-full" aria-label="Get started as Job Seeker">
                      Get Started
                    </Button>
                  </div>
                </Card>
              </motion.div>

              {/* Educator Card */}
              <motion.div variants={cardVariants}>
                <Card
                  variant="elevated"
                  hover
                  onClick={() => navigate(ROUTES.EDUCATOR)}
                  className="cursor-pointer group h-full flex flex-col"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      navigate(ROUTES.EDUCATOR);
                    }
                  }}
                  aria-label="Navigate to Educator page"
                >
                  <div className="text-center flex-1 flex flex-col">
                    <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-500/30 transition-all duration-300 group-hover:scale-110">
                      <svg
                        className="w-8 h-8 text-primary-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Educator</h3>
                    <p className="text-gray-400 mb-6 flex-1">
                      Create curriculum, track student progress, and identify skill gaps
                      to improve learning outcomes.
                    </p>
                    <Button variant="primary" className="w-full" aria-label="Get started as Educator">
                      Get Started
                    </Button>
                  </div>
                </Card>
              </motion.div>

              {/* Employer Card */}
              <motion.div variants={cardVariants} className="md:col-span-2 lg:col-span-1">
                <Card
                  variant="elevated"
                  hover
                  onClick={() => navigate(ROUTES.EMPLOYER)}
                  className="cursor-pointer group h-full flex flex-col"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      navigate(ROUTES.EMPLOYER);
                    }
                  }}
                  aria-label="Navigate to Employer page"
                >
                  <div className="text-center flex-1 flex flex-col">
                    <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-500/30 transition-all duration-300 group-hover:scale-110">
                      <svg
                        className="w-8 h-8 text-primary-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Employer</h3>
                    <p className="text-gray-400 mb-6 flex-1">
                      Analyze job requirements, find qualified candidates, and bridge
                      the skills gap in your organization.
                    </p>
                    <Button variant="primary" className="w-full" aria-label="Get started as Employer">
                      Get Started
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </motion.div>

            {/* Features Section */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16"
            >
              <Card variant="outlined" className="text-center">
                <div className="text-4xl mb-4" role="img" aria-label="Target icon">🎯</div>
                <h4 className="text-lg font-semibold text-white mb-2">Skill Analysis</h4>
                <p className="text-gray-400 text-sm">
                  AI-powered analysis of your skills and career goals
                </p>
              </Card>

              <Card variant="outlined" className="text-center">
                <div className="text-4xl mb-4" role="img" aria-label="Book icon">📚</div>
                <h4 className="text-lg font-semibold text-white mb-2">Learning Paths</h4>
                <p className="text-gray-400 text-sm">
                  Personalized learning recommendations based on your profile
                </p>
              </Card>

              <Card variant="outlined" className="text-center">
                <div className="text-4xl mb-4" role="img" aria-label="Rocket icon">🚀</div>
                <h4 className="text-lg font-semibold text-white mb-2">Career Growth</h4>
                <p className="text-gray-400 text-sm">
                  Track progress and achieve your career objectives
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default LandingPage;
