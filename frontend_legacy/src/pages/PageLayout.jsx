import { motion } from 'framer-motion';
import { Header, Footer } from '../components/ui';
import { ParticleBackground } from '../three';

/**
 * PageLayout Component
 * Reusable page wrapper with header, footer, and 3D background
 * Provides consistent layout across all pages
 */
const PageLayout = ({
  children,
  showBackground = false,
  backgroundIntensity = 0.4,
  className = '',
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-dark-950">
      {/* 3D Background - Disabled by default */}
      {showBackground && (
        <ParticleBackground
          particleCount={150}
          intensity={backgroundIntensity}
          speed={0.3}
        />
      )}

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 pt-20 md:pt-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={className}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PageLayout;

