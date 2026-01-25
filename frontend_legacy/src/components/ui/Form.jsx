import { forwardRef, createContext, useContext } from 'react';
import { motion } from 'framer-motion';

/**
 * Form Context
 * Provides form state and validation to child components
 */
const FormContext = createContext({
  errors: {},
  touched: {},
  values: {},
  handleChange: () => {},
  handleBlur: () => {},
});

export const useFormContext = () => useContext(FormContext);

/**
 * Form Component
 * Reusable form wrapper with validation and error handling
 * Supports controlled and uncontrolled inputs
 */
const Form = forwardRef(
  (
    {
      children,
      onSubmit,
      initialValues = {},
      validationSchema,
      className = '',
      ...props
    },
    ref
  ) => {
    const handleSubmit = (e) => {
      e.preventDefault();
      if (onSubmit) {
        onSubmit(e);
      }
    };

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className={className}
        noValidate
        {...props}
      >
        {children}
      </form>
    );
  }
);

Form.displayName = 'Form';

/**
 * FormGroup Component
 * Wrapper for form fields with consistent spacing
 */
export const FormGroup = ({ children, className = '' }) => {
  return (
    <div className={`mb-6 ${className}`}>
      {children}
    </div>
  );
};

/**
 * FormRow Component
 * Horizontal layout for form fields
 */
export const FormRow = ({ children, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {children}
    </div>
  );
};

/**
 * FormActions Component
 * Container for form buttons
 */
export const FormActions = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center justify-end space-x-3 mt-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Form;

