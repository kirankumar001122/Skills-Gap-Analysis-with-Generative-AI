import { motion } from 'framer-motion';
import { forwardRef } from 'react';

/**
 * Card Component
 * Reusable card component with hover effects and animations
 * Supports various variants and sizes
 */
const Card = forwardRef(
  (
    {
      children,
      className = '',
      variant = 'default',
      hover = true,
      onClick,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'card';
    const variantClasses = {
      default: 'bg-dark-900/70 border-dark-700/50',
      elevated: 'bg-dark-900 border-dark-700 shadow-2xl',
      outlined: 'bg-transparent border-2 border-dark-700',
      gradient: 'bg-gradient-to-br from-dark-900 to-dark-950 border-primary-500/30',
    };

    const cardClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

    const cardContent = (
      <div
        ref={ref}
        className={cardClasses}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={(e) => {
          if (onClick && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick(e);
          }
        }}
        {...props}
      >
        {children}
      </div>
    );

    if (hover && onClick) {
      return (
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          {cardContent}
        </motion.div>
      );
    }

    if (hover) {
      return (
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          {cardContent}
        </motion.div>
      );
    }

    return cardContent;
  }
);

Card.displayName = 'Card';

export default Card;

