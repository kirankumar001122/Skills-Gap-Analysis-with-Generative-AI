import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES } from '../../utils/constants';

/**
 * Footer Component
 * Responsive footer with links and information
 * Includes accessibility features
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { path: ROUTES.JOB_SEEKER, label: 'Job Seeker' },
      { path: ROUTES.EDUCATOR, label: 'Educator' },
      { path: ROUTES.EMPLOYER, label: 'Employer' },
      { path: ROUTES.LEARNING_PATHS, label: 'Learning Paths' },
    ],
    resources: [
      { path: ROUTES.LEARNING_RESOURCES, label: 'Resources' },
      { path: ROUTES.CURRICULUM, label: 'Curriculum' },
      { path: '#', label: 'Documentation' },
      { path: '#', label: 'Support' },
    ],
    company: [
      { path: '#', label: 'About' },
      { path: '#', label: 'Blog' },
      { path: '#', label: 'Careers' },
      { path: '#', label: 'Contact' },
    ],
  };

  return (
    <footer className="bg-dark-900 border-t border-dark-800 mt-auto" role="contentinfo">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to={ROUTES.HOME}
              className="flex items-center space-x-2 mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg p-2 -m-2"
              aria-label="Home"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-green rounded-lg flex items-center justify-center">
                <span className="text-dark-950 font-bold text-xl">SG</span>
              </div>
              <span className="text-xl font-bold text-gradient">Skills Gap</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Bridging the gap between skills and opportunities through AI-powered analysis.
            </p>
          </motion.div>

          {/* Product Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-primary-500 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-primary-500 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-primary-500 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-dark-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Skills Gap Analysis. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a
              href="#"
              className="text-gray-400 hover:text-primary-500 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-1"
              aria-label="Privacy Policy"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-primary-500 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-1"
              aria-label="Terms of Service"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

