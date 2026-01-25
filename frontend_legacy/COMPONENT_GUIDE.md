# Component Usage Guide

## Quick Start

### Importing Components

```javascript
// Import individual components
import { Button, Card, Input, Modal } from './components/ui';

// Import hooks
import { useDebounce, useLocalStorage, useMediaQuery } from './hooks';

// Import Three.js components
import { ParticleBackground, AnimatedSphere } from './three';

// Import pages
import { PageLayout, ExamplePage } from './pages';
```

## Component Examples

### 1. Button Component

```javascript
import { Button } from './components/ui';

function MyComponent() {
  return (
    <>
      <Button variant="primary" onClick={() => alert('Clicked!')}>
        Primary Button
      </Button>
      <Button variant="secondary" size="lg" isLoading>
        Loading...
      </Button>
      <Button variant="outline" disabled>
        Disabled
      </Button>
    </>
  );
}
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'accent' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean
- `disabled`: boolean
- `onClick`: function
- `type`: 'button' | 'submit' | 'reset'

### 2. Card Component

```javascript
import { Card } from './components/ui';

function MyComponent() {
  return (
    <Card variant="elevated" hover onClick={() => console.log('Card clicked')}>
      <h3>Card Title</h3>
      <p>Card content goes here</p>
    </Card>
  );
}
```

**Props:**
- `variant`: 'default' | 'elevated' | 'outlined' | 'gradient'
- `hover`: boolean (enables hover effects)
- `onClick`: function (makes card clickable)

### 3. Form Components

```javascript
import { Form, FormGroup, FormRow, FormActions, Input, Select, Textarea, Checkbox, Button } from './components/ui';

function MyForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    message: '',
    agree: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow>
        <FormGroup>
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </FormGroup>
        <FormGroup>
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </FormGroup>
      </FormRow>

      <FormGroup>
        <Select
          label="Role"
          options={[
            { value: 'dev', label: 'Developer' },
            { value: 'designer', label: 'Designer' },
          ]}
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        />
      </FormGroup>

      <FormGroup>
        <Textarea
          label="Message"
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
      </FormGroup>

      <FormGroup>
        <Checkbox
          label="I agree to terms"
          checked={formData.agree}
          onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
        />
      </FormGroup>

      <FormActions>
        <Button type="submit">Submit</Button>
      </FormActions>
    </Form>
  );
}
```

### 4. Modal Component

```javascript
import { Modal, Button } from './components/ui';
import { useState } from 'react';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Modal Title"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsOpen(false)}>Confirm</Button>
          </>
        }
      >
        <p>Modal content goes here</p>
      </Modal>
    </>
  );
}
```

**Props:**
- `isOpen`: boolean
- `onClose`: function
- `title`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `closeOnBackdropClick`: boolean (default: true)
- `closeOnEscape`: boolean (default: true)
- `footer`: React node

### 5. Table Component

```javascript
import { Table } from './components/ui';

function MyComponent() {
  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <span className={value === 'Active' ? 'text-green-500' : 'text-red-500'}>
          {value}
        </span>
      ),
    },
  ];

  const data = [
    { name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
  ];

  return (
    <Table
      columns={columns}
      data={data}
      onRowClick={(row) => console.log('Row clicked:', row)}
      selectable={true}
    />
  );
}
```

**Props:**
- `columns`: array of column objects with `key`, `header`, and optional `render`
- `data`: array of data objects
- `onRowClick`: function(row, index)
- `selectable`: boolean
- `selectedRows`: array of selected row indices
- `onSelectRow`: function(row, index)
- `emptyMessage`: string

### 6. Dashboard Component

```javascript
import Dashboard from './components/Dashboard';

function MyDashboard() {
  const stats = [
    {
      label: 'Total Users',
      value: '1,234',
      change: 12.5,
      icon: '👥',
    },
    {
      label: 'Revenue',
      value: '$12.5K',
      change: 8.7,
      icon: '💰',
    },
  ];

  const tableColumns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
  ];

  const tableData = [
    { name: 'John Doe', email: 'john@example.com' },
  ];

  return (
    <Dashboard
      title="My Dashboard"
      stats={stats}
      tableData={tableData}
      tableColumns={tableColumns}
      actions={[
        {
          label: 'Export',
          variant: 'secondary',
          onClick: () => console.log('Export'),
        },
      ]}
    />
  );
}
```

### 7. Three.js Components

#### ParticleBackground

```javascript
import { ParticleBackground } from './three';

function MyPage() {
  return (
    <div>
      <ParticleBackground
        particleCount={200}
        color={0x00ff41}
        intensity={0.6}
        speed={0.5}
        size={0.05}
      />
      {/* Your content */}
    </div>
  );
}
```

#### AnimatedSphere

```javascript
import { AnimatedSphere } from './three';

function MyComponent() {
  return (
    <div className="w-full h-96">
      <AnimatedSphere
        radius={2}
        color={0x00ff41}
        wireframe={true}
        opacity={0.3}
        rotationSpeed={{ x: 0.002, y: 0.003 }}
        position={{ x: 0, y: 0, z: 0 }}
      />
    </div>
  );
}
```

### 8. Custom Hooks

#### useDebounce

```javascript
import { useDebounce } from './hooks';
import { useState, useEffect } from 'react';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Perform search API call
      console.log('Searching for:', debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <Input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

#### useLocalStorage

```javascript
import { useLocalStorage } from './hooks';

function MyComponent() {
  const [theme, setTheme] = useLocalStorage('theme', 'dark');

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Current theme: {theme}
    </button>
  );
}
```

#### useMediaQuery

```javascript
import { useMediaQuery } from './hooks';

function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1024px)');

  return (
    <div>
      {isMobile ? (
        <MobileView />
      ) : (
        <DesktopView />
      )}
    </div>
  );
}
```

#### useClickOutside

```javascript
import { useClickOutside } from './hooks';
import { useState } from 'react';

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside(() => setIsOpen(false));

  return (
    <div ref={ref}>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && <div>Dropdown content</div>}
    </div>
  );
}
```

## Page Layout

```javascript
import PageLayout from './pages/PageLayout';

function MyPage() {
  return (
    <PageLayout showBackground={true} backgroundIntensity={0.4}>
      <div className="container mx-auto px-4 py-8">
        <h1>My Page Content</h1>
      </div>
    </PageLayout>
  );
}
```

## Best Practices

1. **Always use semantic HTML** - Use proper heading tags, sections, etc.
2. **Include accessibility attributes** - Add aria-labels, roles, etc.
3. **Handle loading states** - Show loading indicators for async operations
4. **Validate forms** - Use proper validation and error messages
5. **Optimize performance** - Use React.memo, useMemo, useCallback where appropriate
6. **Responsive design** - Test on multiple screen sizes
7. **Error handling** - Always handle errors gracefully

## Styling Guidelines

- Use Tailwind CSS utility classes
- Follow the design system colors and spacing
- Use the provided component variants
- Maintain consistency across components
- Ensure proper contrast ratios for accessibility

