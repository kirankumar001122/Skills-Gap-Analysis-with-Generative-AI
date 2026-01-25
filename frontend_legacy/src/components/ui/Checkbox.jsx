import { forwardRef } from 'react';

/**
 * Checkbox Component
 * Reusable checkbox with label and error handling
 * Includes accessibility features
 */
const Checkbox = forwardRef(
  (
    {
      label,
      error,
      helperText,
      required = false,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substring(7)}`;
    const errorId = error ? `${checkboxId}-error` : undefined;
    const helperId = helperText ? `${checkboxId}-helper` : undefined;

    return (
      <div className="w-full">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              ref={ref}
              id={checkboxId}
              type="checkbox"
              className={`h-4 w-4 rounded border-dark-700 bg-dark-900 text-primary-600 focus:ring-primary-500 focus:ring-2 transition-colors ${error ? 'border-red-500' : ''} ${className}`}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? errorId : helperId}
              aria-required={required}
              {...props}
            />
          </div>
          {label && (
            <label
              htmlFor={checkboxId}
              className="ml-3 text-sm font-medium text-gray-300 cursor-pointer"
            >
              {label}
              {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
            </label>
          )}
        </div>
        {error && (
          <p
            id={errorId}
            className="mt-2 text-sm text-red-500"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={helperId}
            className="mt-2 text-sm text-gray-400"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;

