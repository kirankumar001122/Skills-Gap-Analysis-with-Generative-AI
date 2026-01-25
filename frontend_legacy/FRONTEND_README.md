# Modern React Frontend - Complete Documentation

## 🎯 Overview

This is a modern, responsive, and visually appealing frontend built with React.js, Three.js, and Tailwind CSS. The project follows clean code best practices, includes comprehensive accessibility features, and is optimized for performance.

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable React components
│   │   ├── ui/           # UI component library
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Textarea.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Checkbox.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Form.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── index.js
│   │   └── Dashboard.jsx
│   ├── pages/            # Page components
│   │   ├── PageLayout.jsx
│   │   ├── ExamplePage.jsx
│   │   └── index.js
│   ├── three/             # Three.js scenes and animations
│   │   ├── Scene3D.jsx
│   │   ├── ParticleBackground.jsx
│   │   ├── AnimatedSphere.jsx
│   │   └── index.js
│   ├── hooks/             # Custom React hooks
│   │   ├── useThreeScene.js
│   │   ├── useDebounce.js
│   │   ├── useLocalStorage.js
│   │   ├── useMediaQuery.js
│   │   ├── useClickOutside.js
│   │   └── index.js
│   ├── utils/             # Utility functions
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── accessibility.js
│   ├── services/          # API services
│   │   └── api.js
│   ├── assets/            # Images, fonts, etc.
│   ├── App.js             # Main app component
│   ├── index.js           # Entry point
│   └── index.css          # Global styles
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
└── package.json           # Dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm start
```

The app will open at `http://localhost:3000`

### Build

```bash
npm run build
```

## 🎨 Design System

### Color Palette

- **Primary**: Green shades (`primary-50` to `primary-900`)
- **Dark**: Dark gray shades (`dark-50` to `dark-950`)
- **Accent**: Green accent (`accent-green`, `accent-green-dark`)
- **Alert**: Red (`accent-red`)

### Typography

- **Font Family**: Inter (Google Fonts)
- **Headings**: Semibold weight
- **Body**: Regular weight

### Spacing

- Consistent spacing scale using Tailwind's spacing utilities
- Responsive spacing for mobile, tablet, and desktop

## 🧩 Components

### UI Components

All components are located in `src/components/ui/` and can be imported from the barrel export:

```javascript
import { Button, Card, Input, Modal, Table } from './components/ui';
```

#### Button

```javascript
<Button 
  variant="primary" // primary | secondary | outline | accent | ghost | danger
  size="md"         // sm | md | lg
  isLoading={false}
  disabled={false}
  onClick={handleClick}
>
  Click Me
</Button>
```

#### Card

```javascript
<Card 
  variant="default"  // default | elevated | outlined | gradient
  hover={true}
  onClick={handleClick}
>
  Card content
</Card>
```

#### Input

```javascript
<Input
  label="Email"
  type="email"
  placeholder="Enter email"
  required
  error={errors.email}
  helperText="We'll never share your email"
/>
```

#### Modal

```javascript
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  size="md"  // sm | md | lg | xl | full
  footer={<Button>Close</Button>}
>
  Modal content
</Modal>
```

#### Table

```javascript
<Table
  columns={[
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
  ]}
  data={tableData}
  onRowClick={(row) => console.log(row)}
  selectable={true}
/>
```

### Three.js Components

#### ParticleBackground

```javascript
<ParticleBackground
  particleCount={200}
  color={0x00ff41}
  intensity={0.6}
  speed={0.5}
/>
```

#### AnimatedSphere

```javascript
<AnimatedSphere
  radius={2}
  color={0x00ff41}
  wireframe={true}
  opacity={0.3}
/>
```

## 🪝 Custom Hooks

### useDebounce

```javascript
const debouncedValue = useDebounce(searchTerm, 500);
```

### useLocalStorage

```javascript
const [value, setValue] = useLocalStorage('key', 'initialValue');
```

### useMediaQuery

```javascript
const isMobile = useMediaQuery('(max-width: 768px)');
```

### useClickOutside

```javascript
const ref = useClickOutside(() => setIsOpen(false));
```

## 🎭 Animations

Animations are powered by Framer Motion. Components include:

- Page transitions
- Hover effects
- Loading states
- Modal animations
- Staggered list animations

## ♿ Accessibility

### Features

- ARIA labels and roles
- Keyboard navigation
- Focus management
- Screen reader support
- High contrast mode support
- Reduced motion preferences

### Best Practices

- All interactive elements are keyboard accessible
- Focus indicators are visible
- Form inputs have proper labels
- Images have alt text
- Semantic HTML is used throughout

## 📱 Responsive Design

The frontend is fully responsive with breakpoints:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🎯 Performance Optimizations

- Code splitting with React.lazy
- Memoization with React.memo
- Optimized Three.js rendering
- Debounced search inputs
- Lazy loading images
- Reduced re-renders

## 🧪 Testing

```bash
npm test
```

## 📦 Build & Deploy

```bash
npm run build
```

The build folder contains the production-ready static files.

## 🔧 Configuration

### Tailwind Config

Custom colors, spacing, and animations are defined in `tailwind.config.js`.

### PostCSS Config

PostCSS is configured for Tailwind CSS and Autoprefixer.

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Three.js Documentation](https://threejs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion)

## 🤝 Contributing

1. Follow the existing code style
2. Add comments for complex logic
3. Ensure accessibility standards
4. Test on multiple devices
5. Optimize for performance

## 📝 License

This project is part of the Skills Gap Analysis application.

