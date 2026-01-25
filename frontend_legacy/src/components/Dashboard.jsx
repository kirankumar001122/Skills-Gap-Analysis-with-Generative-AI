import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Button, Table, Loading } from './ui';
import { useMediaQuery } from '../hooks';

/**
 * Dashboard Component
 * Comprehensive dashboard layout with stats, charts, and data tables
 * Fully responsive and accessible
 */
const Dashboard = ({
  title = 'Dashboard',
  stats = [],
  charts = [],
  tableData = null,
  tableColumns = [],
  actions = [],
  loading = false,
  className = '',
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [selectedView, setSelectedView] = useState('overview');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading fullScreen text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white">{title}</h1>
          {actions.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'primary'}
                  size={isMobile ? 'sm' : 'md'}
                  onClick={action.onClick}
                  isLoading={action.loading}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      {stats.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card variant="elevated" hover>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                    <p className="text-2xl md:text-3xl font-bold text-white">
                      {stat.value}
                    </p>
                    {stat.change && (
                      <p
                        className={`text-sm mt-2 ${
                          stat.change > 0 ? 'text-primary-500' : 'text-red-500'
                        }`}
                      >
                        {stat.change > 0 ? '↑' : '↓'} {Math.abs(stat.change)}%
                      </p>
                    )}
                  </div>
                  {stat.icon && (
                    <div className="text-primary-500 text-3xl">{stat.icon}</div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Charts Section */}
      {charts.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {charts.map((chart, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card variant="elevated" className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {chart.title}
                </h3>
                <div className="h-64 flex items-center justify-center">
                  {chart.component || (
                    <div className="text-gray-400">Chart placeholder</div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Table Section */}
      {tableData && tableColumns.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="elevated" className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Data Table</h3>
              {tableData.length > 0 && (
                <p className="text-sm text-gray-400">
                  {tableData.length} {tableData.length === 1 ? 'item' : 'items'}
                </p>
              )}
            </div>
            <Table
              columns={tableColumns}
              data={tableData}
              emptyMessage="No data available"
            />
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;

