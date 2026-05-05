# Component Usage Guide

## Quick Start

Import and use components in your pages:

```jsx
import { Button } from '../components/Common/Button';
import { Card } from '../components/Common/Card';
import { Avatar, AvatarGroup } from '../components/Common/Avatar';
import { Badge, Spinner, LoadingSpinner, Tooltip } from '../components/Common/Badge';
import { Navbar } from '../components/Layout/Navbar';
```

---

## Button Component

### Basic Usage

```jsx
import { Button } from '../components/Common/Button';

// Primary Button
<Button variant="primary" size="md">
  Create Room
</Button>

// With Icon
<Button variant="primary" size="lg" icon={PlusIcon}>
  Add New
</Button>

// Loading State
<Button disabled={isLoading}>
  {isLoading ? 'Loading...' : 'Submit'}
</Button>
```

### Variants

```jsx
// Primary (Main CTA)
<Button variant="primary">Primary Button</Button>

// Secondary (Alternative action)
<Button variant="secondary">Secondary Button</Button>

// Outline (Less prominent)
<Button variant="outline">Outline Button</Button>

// Ghost (Subtle)
<Button variant="ghost">Ghost Button</Button>

// Success (Positive action)
<Button variant="success">Success Button</Button>

// Error (Destructive)
<Button variant="error">Error Button</Button>
```

### Sizes

```jsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
```

### With Icons

```jsx
import { Button } from '../components/Common/Button';

const CreateIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

<Button 
  icon={CreateIcon} 
  iconPosition="left"
>
  Create
</Button>

<Button 
  icon={CreateIcon} 
  iconPosition="right"
>
  Next
</Button>
```

### Props

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}
```

---

## Card Component

### Basic Usage

```jsx
import { Card, CardHeader, CardBody, CardFooter } from '../components/Common/Card';

<Card>
  <h3 className="text-lg font-semibold">Card Title</h3>
  <p className="text-slate-400">Card content goes here</p>
</Card>
```

### With Sub-Components

```jsx
<Card hover glow>
  <CardHeader>
    <h3 className="text-lg font-semibold text-white">Card Title</h3>
  </CardHeader>
  <CardBody>
    <p className="text-slate-400">Card body content</p>
  </CardBody>
  <CardFooter>
    <Button variant="primary" size="sm">Action</Button>
  </CardFooter>
</Card>
```

### With Hover & Glow Effects

```jsx
// Hover effect (scales on hover)
<Card hover>
  <p>Hovers and scales</p>
</Card>

// Glow effect (glowing border)
<Card glow>
  <p>Has glow effect</p>
</Card>

// Both effects
<Card hover glow>
  <p>Hovers and glows</p>
</Card>
```

### Props

```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}
```

---

## Avatar Component

### Basic Usage

```jsx
import { Avatar, AvatarGroup } from '../components/Common/Avatar';

// With name (generates initials)
<Avatar name="John Doe" size="md" />

// With custom initials
<Avatar initials="JD" size="md" />

// With image
<Avatar src="/path/to/image.jpg" alt="John" size="md" />

// With online status
<Avatar name="Alice" size="md" online={true} />
```

### Different Sizes

```jsx
<Avatar name="User" size="xs" />  {/* 24px */}
<Avatar name="User" size="sm" />  {/* 32px */}
<Avatar name="User" size="md" />  {/* 40px */}
<Avatar name="User" size="lg" />  {/* 48px */}
<Avatar name="User" size="xl" />  {/* 64px */}
```

### Avatar Group (Multiple Users)

```jsx
const users = [
  { name: 'Alice' },
  { name: 'Bob' },
  { name: 'Charlie' },
  { name: 'Diana' },
];

// Show first 3, +1 more
<AvatarGroup avatars={users} max={3} size="md" />

// Show all
<AvatarGroup avatars={users} max={999} />

// With CSS class
<AvatarGroup avatars={users} className="justify-center" />
```

### Props

```typescript
interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  online?: boolean;
  className?: string;
  initials?: string;
}

interface AvatarGroupProps {
  avatars: AvatarProps[];
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}
```

---

## Badge Component

### Basic Usage

```jsx
import { Badge, Spinner, LoadingSpinner, Tooltip } from '../components/Common/Badge';

// Default badge
<Badge>Default Badge</Badge>

// With variant
<Badge variant="success">Active</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="warning">Warning</Badge>
```

### Variants

```jsx
<Badge variant="default">Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="purple">Purple</Badge>
<Badge variant="blue">Blue</Badge>
```

### Sizes

```jsx
<Badge size="xs">Extra Small</Badge>
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
```

### With Icons

```jsx
const CheckIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="..." clipRule="evenodd" />
  </svg>
);

<Badge variant="success" icon={CheckIcon}>
  Verified
</Badge>
```

### Spinner Component

```jsx
// Small spinner
<Spinner size="sm" />

// Medium spinner
<Spinner size="md" />

// Large spinner
<Spinner size="lg" />

// Custom class
<Spinner size="md" className="border-primary-500" />
```

### Loading Spinner

```jsx
// Inline loading
<LoadingSpinner />

// Fullscreen loading
<LoadingSpinner fullscreen />
```

### Tooltip Component

```jsx
<Tooltip text="Click to copy" position="top">
  <button>Copy</button>
</Tooltip>

// Different positions
<Tooltip text="Help text" position="top">...</Tooltip>
<Tooltip text="Help text" position="bottom">...</Tooltip>
<Tooltip text="Help text" position="left">...</Tooltip>
<Tooltip text="Help text" position="right">...</Tooltip>
```

### Props

```typescript
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'error' | 'warning' | 'purple' | 'blue';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
}

interface TooltipProps {
  children: React.ReactNode;
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}
```

---

## Navbar Component

### Basic Usage

```jsx
import { Navbar } from '../components/Layout/Navbar';

export const MyPage = () => {
  return (
    <div>
      <Navbar />
      {/* Page content */}
    </div>
  );
};
```

### With User Menu Disabled

```jsx
// For public pages (no user context)
<Navbar showUserMenu={false} />
```

### Props

```typescript
interface NavbarProps {
  showUserMenu?: boolean; // Show/hide user avatar & menu
}
```

---

## Navbar Navigation Links

The navbar automatically highlights active routes:

```
/ → Home (active)
/features → Features
/docs → Docs
```

To add more links, edit the `navLinks` array in `Navbar.jsx`:

```jsx
const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/features', label: 'Features' },
  { path: '/docs', label: 'Docs' },
  { path: '/pricing', label: 'Pricing' }, // Add new link
];
```

---

## Editor Components

### EditorHeader Usage

```jsx
import { EditorHeader } from '../components/Editor/EditorHeader';

<EditorHeader
  roomId={roomId}
  language={language}
  onLanguageChange={handleLanguageChange}
  onRunCode={handleRunCode}
  isRunning={isRunning}
  users={users}
/>
```

### OutputPanel Usage

```jsx
import { OutputPanel } from '../components/Editor/OutputPanelUpgraded';

<OutputPanel
  output={output}
  error={error}
  isRunning={isRunning}
  onClear={handleClearOutput}
/>
```

### ChatPanel Usage

```jsx
import { ChatPanel } from '../components/Chat/ChatPanelUpgraded';

<ChatPanel
  messages={messages}
  users={users}
  onSendMessage={handleSendMessage}
  currentUser={user}
/>
```

### UsersSidebar Usage

```jsx
import { UsersSidebar } from '../components/Editor/UsersSidebarUpgraded';

<UsersSidebar 
  users={users} 
  currentUser={user} 
/>
```

---

## Common Patterns

### Loading State

```jsx
const [isLoading, setIsLoading] = useState(false);

return (
  <>
    <Button 
      disabled={isLoading}
      onClick={async () => {
        setIsLoading(true);
        await someLongTask();
        setIsLoading(false);
      }}
    >
      {isLoading ? 'Loading...' : 'Submit'}
    </Button>
  </>
);
```

### Modal/Overlay

```jsx
import { Card } from '../components/Common/Card';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        {children}
      </Card>
    </div>
  );
};
```

### Form with Validation

```jsx
const [formData, setFormData] = useState({});
const [errors, setErrors] = useState({});

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validate
  const newErrors = validate(formData);
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }
  
  // Submit
  await submitForm(formData);
};

return (
  <Card>
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <Button type="submit" variant="primary">
        Submit
      </Button>
    </form>
  </Card>
);
```

### Status Display

```jsx
const getStatusBadge = (status) => {
  switch (status) {
    case 'active':
      return <Badge variant="success">Active</Badge>;
    case 'pending':
      return <Badge variant="warning">Pending</Badge>;
    case 'error':
      return <Badge variant="error">Error</Badge>;
    default:
      return <Badge variant="default">Unknown</Badge>;
  }
};

return (
  <div>
    {getStatusBadge(currentStatus)}
  </div>
);
```

### Responsive Layout

```jsx
// Mobile: 1 column
// Tablet+: 2 columns
// Desktop+: 4 columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
  <Card>Item 4</Card>
</div>
```

### Hover Animations

```jsx
// Simple hover effect
<div className="hover:scale-105 transition-transform duration-200">
  Hover me
</div>

// With shadow
<div className="hover:shadow-card-hover hover:shadow-glow transition-all duration-300">
  Hover me
</div>

// Using Card component (built-in)
<Card hover glow>
  Hover me
</Card>
```

---

## Best Practices

### ✅ DO

- Use semantic HTML elements
- Keep components single-responsibility
- Use props for configuration
- Handle loading and error states
- Provide visual feedback for interactions
- Use consistent spacing and colors
- Make components responsive

### ❌ DON'T

- Hard-code colors (use Tailwind classes)
- Make components too large (extract sub-components)
- Ignore accessibility
- Forget to handle edge cases
- Make animations too long
- Use inconsistent naming

---

## Troubleshooting

### Component doesn't show

**Problem**: Component imported but not visible

**Solution**:
- Check import path is correct
- Verify component file exists
- Check component is exported as default or named export
- Check parent component has proper CSS classes

### Styling looks wrong

**Problem**: Component styling is off

**Solution**:
- Verify Tailwind CSS is loaded in your index.css
- Check Tailwind config is in root directory
- Clear browser cache and rebuild
- Check conflicting CSS or class names

### Animation not working

**Problem**: Animation not playing

**Solution**:
- Verify animation class exists in tailwind.config.js
- Check animation-duration property
- Verify element has animation class applied
- Check browser DevTools for CSS issues

### Component won't update

**Problem**: State changes not reflected

**Solution**:
- Check React DevTools for state
- Verify state setter is being called
- Check for missing dependencies in useEffect
- Verify parent component re-renders

---

## Examples by Use Case

### Create a Dashboard Card

```jsx
<Card hover glow className="space-y-4">
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-lg bg-gradient-purple flex items-center justify-center">
      📊
    </div>
    <h3 className="text-lg font-semibold text-white">Analytics</h3>
  </div>
  <p className="text-slate-400">View your stats</p>
  <Button variant="secondary" size="sm" className="w-full">
    View Details
  </Button>
</Card>
```

### Create a Feature List

```jsx
<div className="space-y-3">
  {features.map((feature, idx) => (
    <div key={idx} className="flex items-start gap-3">
      <Badge variant="success" size="xs">✓</Badge>
      <div>
        <p className="text-white font-medium">{feature.title}</p>
        <p className="text-slate-400 text-sm">{feature.description}</p>
      </div>
    </div>
  ))}
</div>
```

### Create a User List

```jsx
<div className="space-y-2">
  {users.map((user) => (
    <div key={user.id} className="p-3 rounded-lg hover:bg-brand-card/50 transition-colors flex items-center gap-3">
      <Avatar name={user.name} size="sm" online={user.online} />
      <div className="flex-1">
        <p className="text-white font-medium">{user.name}</p>
        <p className="text-xs text-slate-500">
          {user.online ? '🟢 Online' : '🔴 Offline'}
        </p>
      </div>
    </div>
  ))}
</div>
```

---

**Happy building! 🚀**
