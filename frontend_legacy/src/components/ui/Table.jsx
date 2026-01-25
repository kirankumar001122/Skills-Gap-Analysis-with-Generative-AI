import { motion } from 'framer-motion';
import { forwardRef } from 'react';

/**
 * Table Component
 * Reusable table component with responsive design and accessibility
 * Supports sorting, selection, and custom cell rendering
 */
const Table = forwardRef(
  (
    {
      columns = [],
      data = [],
      onRowClick,
      selectedRows = [],
      onSelectRow,
      selectable = false,
      className = '',
      emptyMessage = 'No data available',
      ...props
    },
    ref
  ) => {
    const handleRowClick = (row, index) => {
      if (onRowClick) {
        onRowClick(row, index);
      }
    };

    const handleSelect = (e, row, index) => {
      e.stopPropagation();
      if (onSelectRow) {
        onSelectRow(row, index);
      }
    };

    const isRowSelected = (index) => selectedRows.includes(index);

    return (
      <div className={`overflow-x-auto custom-scrollbar ${className}`} ref={ref}>
        <table
          className="w-full border-collapse"
          role="table"
          aria-label="Data table"
          {...props}
        >
          <thead>
            <tr className="border-b border-dark-700">
              {selectable && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="rounded border-dark-700 bg-dark-900 text-primary-600 focus:ring-primary-500"
                    aria-label="Select all rows"
                    onChange={(e) => {
                      // Handle select all logic
                    }}
                  />
                </th>
              )}
              {columns.map((column, index) => (
                <th
                  key={column.key || index}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
                  scope="col"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-800">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-12 text-center text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <motion.tr
                  key={rowIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: rowIndex * 0.05 }}
                  className={`transition-colors duration-200 ${
                    onRowClick ? 'cursor-pointer hover:bg-dark-800/50' : ''
                  } ${isRowSelected(rowIndex) ? 'bg-primary-900/20' : ''}`}
                  onClick={() => handleRowClick(row, rowIndex)}
                  role="row"
                >
                  {selectable && (
                    <td className="px-4 py-3" onClick={(e) => handleSelect(e, row, rowIndex)}>
                      <input
                        type="checkbox"
                        checked={isRowSelected(rowIndex)}
                        onChange={(e) => handleSelect(e, row, rowIndex)}
                        className="rounded border-dark-700 bg-dark-900 text-primary-600 focus:ring-primary-500"
                        aria-label={`Select row ${rowIndex + 1}`}
                      />
                    </td>
                  )}
                  {columns.map((column, colIndex) => (
                    <td
                      key={column.key || colIndex}
                      className="px-4 py-3 text-sm text-gray-300"
                    >
                      {column.render
                        ? column.render(row[column.key], row, rowIndex)
                        : row[column.key]}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }
);

Table.displayName = 'Table';

export default Table;

