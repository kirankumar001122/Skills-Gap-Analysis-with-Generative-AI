import { useState } from 'react';
import { motion } from 'framer-motion';
import PageLayout from './PageLayout';
import {
  Card,
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  Modal,
  Table,
  Form,
  FormGroup,
  FormRow,
  FormActions,
  Loading,
} from '../components/ui';
import Dashboard from '../components/Dashboard';

/**
 * ExamplePage Component
 * Comprehensive example demonstrating all UI components and features
 * This serves as a reference implementation
 */
const ExamplePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    message: '',
    agree: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Example table data
  const tableColumns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            value === 'Active'
              ? 'bg-primary-500/20 text-primary-400'
              : 'bg-gray-500/20 text-gray-400'
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Inactive' },
  ];

  // Example dashboard stats
  const dashboardStats = [
    {
      label: 'Total Users',
      value: '1,234',
      change: 12.5,
      icon: '👥',
    },
    {
      label: 'Active Sessions',
      value: '456',
      change: -3.2,
      icon: '🔄',
    },
    {
      label: 'Revenue',
      value: '$12.5K',
      change: 8.7,
      icon: '💰',
    },
    {
      label: 'Growth',
      value: '24%',
      change: 5.3,
      icon: '📈',
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsModalOpen(false);
      alert('Form submitted successfully!');
    }, 2000);
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Skip to main content link for accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <div id="main-content">
          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Modern React Frontend
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Built with React.js, Three.js, Tailwind CSS, and Framer Motion
            </p>
          </motion.section>

          {/* Dashboard Example */}
          <section className="mb-12" aria-labelledby="dashboard-heading">
            <h2 id="dashboard-heading" className="text-2xl font-bold text-white mb-6">
              Dashboard Component
            </h2>
            <Dashboard
              title="Example Dashboard"
              stats={dashboardStats}
              tableData={tableData}
              tableColumns={tableColumns}
              actions={[
                {
                  label: 'Export Data',
                  variant: 'secondary',
                  onClick: () => alert('Export clicked'),
                },
                {
                  label: 'Add New',
                  variant: 'primary',
                  onClick: () => setIsModalOpen(true),
                },
              ]}
            />
          </section>

          {/* Cards Section */}
          <section className="mb-12" aria-labelledby="cards-heading">
            <h2 id="cards-heading" className="text-2xl font-bold text-white mb-6">
              Card Components
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card variant="default" hover>
                <h3 className="text-xl font-semibold text-white mb-2">Default Card</h3>
                <p className="text-gray-400">
                  This is a default card with hover effects.
                </p>
              </Card>
              <Card variant="elevated" hover>
                <h3 className="text-xl font-semibold text-white mb-2">Elevated Card</h3>
                <p className="text-gray-400">
                  This card has a more prominent shadow.
                </p>
              </Card>
              <Card variant="gradient" hover>
                <h3 className="text-xl font-semibold text-white mb-2">Gradient Card</h3>
                <p className="text-gray-400">
                  This card features a gradient background.
                </p>
              </Card>
            </div>
          </section>

          {/* Form Section */}
          <section className="mb-12" aria-labelledby="form-heading">
            <h2 id="form-heading" className="text-2xl font-bold text-white mb-6">
              Form Components
            </h2>
            <Card variant="elevated" className="max-w-2xl mx-auto">
              <Form onSubmit={handleSubmit}>
                <FormRow>
                  <FormGroup>
                    <Input
                      label="Name"
                      type="text"
                      placeholder="Enter your name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </FormGroup>
                  <FormGroup>
                    <Input
                      label="Email"
                      type="email"
                      placeholder="Enter your email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </FormGroup>
                </FormRow>

                <FormGroup>
                  <Select
                    label="Role"
                    placeholder="Select a role"
                    options={[
                      { value: 'developer', label: 'Developer' },
                      { value: 'designer', label: 'Designer' },
                      { value: 'manager', label: 'Manager' },
                    ]}
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  />
                </FormGroup>

                <FormGroup>
                  <Textarea
                    label="Message"
                    placeholder="Enter your message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                </FormGroup>

                <FormGroup>
                  <Checkbox
                    label="I agree to the terms and conditions"
                    checked={formData.agree}
                    onChange={(e) =>
                      setFormData({ ...formData, agree: e.target.checked })
                    }
                  />
                </FormGroup>

                <FormActions>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setFormData({ name: '', email: '', role: '', message: '', agree: false })}
                  >
                    Reset
                  </Button>
                  <Button type="submit" isLoading={isLoading}>
                    Submit
                  </Button>
                </FormActions>
              </Form>
            </Card>
          </section>

          {/* Buttons Section */}
          <section className="mb-12" aria-labelledby="buttons-heading">
            <h2 id="buttons-heading" className="text-2xl font-bold text-white mb-6">
              Button Variants
            </h2>
            <Card variant="elevated">
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="accent">Accent</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="primary" isLoading>
                  Loading
                </Button>
                <Button variant="primary" disabled>
                  Disabled
                </Button>
              </div>
            </Card>
          </section>

          {/* Modal Example */}
          <section className="mb-12" aria-labelledby="modal-heading">
            <h2 id="modal-heading" className="text-2xl font-bold text-white mb-6">
              Modal Component
            </h2>
            <div className="flex justify-center">
              <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
            </div>
          </section>
        </div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Example Modal"
          size="md"
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>Confirm</Button>
            </>
          }
        >
          <p className="text-gray-300">
            This is an example modal with backdrop blur, animations, and keyboard
            navigation support. Press ESC to close.
          </p>
        </Modal>
      </div>
    </PageLayout>
  );
};

export default ExamplePage;

