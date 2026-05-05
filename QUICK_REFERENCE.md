# CodeSync - Quick Reference Card

## 🎨 Color Scheme

```
Primary:        #a855f7 (Purple)
Secondary:      #3b82f6 (Blue)
Accent:         #ec4899 (Pink)
Success:        #10b981 (Green)
Error:          #ef4444 (Red)
Background:     #020617 (Dark)
Card:           #1e293b (Semi-transparent)
Border:         #334155 (Slate)
Text:           #ffffff (White)
Text Secondary: #e2e8f0 (Light Slate)
```

## 📦 Component Quick Start

### Button
```jsx
<Button variant="primary" size="md" icon={Icon}>
  Click Me
</Button>
// Variants: primary, secondary, outline, ghost, success, error
// Sizes: sm, md, lg, xl
```

### Card
```jsx
<Card hover glow>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
  <CardFooter>Actions</CardFooter>
</Card>
```

### Avatar
```jsx
<Avatar name="John" size="md" online={true} />
<AvatarGroup avatars={users} max={4} />
// Sizes: xs, sm, md, lg, xl
```

### Badge
```jsx
<Badge variant="success" size="md" icon={Icon}>
  Label
</Badge>
// Variants: default, primary, success, error, warning, purple, blue
// Sizes: xs, sm, md, lg
```

### Navbar
```jsx
<Navbar showUserMenu={true} />
// Includes: Logo, Nav Links, Theme Toggle, User Menu
```

## 🚦 States & Indicators

### Colors
- Primary: Purple (#a855f7)
- Secondary: Blue (#3b82f6)
- Success: Green (#10b981)
- Error: Red (#ef4444)
- Warning: Orange (#f59e0b)

### Status Badges
```
🟢 Online     → <Badge variant="success">Online</Badge>
🔴 Offline    → <Badge variant="default">Offline</Badge>
⚠️ Warning    → <Badge variant="warning">Warning</Badge>
❌ Error      → <Badge variant="error">Error</Badge>
✓ Complete    → <Badge variant="success">Complete</Badge>
```

### Loading
```jsx
<Spinner size="md" />                    // Inline
<LoadingSpinner fullscreen />            // Fullscreen
<Button disabled={isLoading}>
  {isLoading ? 'Loading...' : 'Submit'}
</Button>
```

## 🎯 Layout Classes

### Spacing
```
p-4   = padding 16px
m-4   = margin 16px
gap-4 = gap 16px
space-y-4 = vertical spacing
```

### Responsive
```
hidden          = display: none
sm:flex         = flex on tablets+
md:block        = block on desktops+
lg:flex         = flex on large screens+
xl:hidden       = hidden on extra-large+
```

### Grid
```
grid grid-cols-1           = 1 column
md:grid-cols-2             = 2 columns on tablets+
lg:grid-cols-3             = 3 columns on desktops+
gap-4                      = 16px gap
```

## 🎨 Styling Patterns

### Text Colors
```
text-white              = White text
text-slate-400          = Gray text
text-primary-400        = Purple text
text-status-success     = Green text
text-status-error       = Red text
```

### Backgrounds
```
bg-brand-dark           = Dark background
bg-brand-card           = Card background
bg-gradient-purple      = Purple gradient
bg-gradient-blue        = Blue gradient
bg-black/50             = Semi-transparent black
```

### Hover Effects
```
hover:scale-105         = Scale up 5%
hover:shadow-glow       = Glow shadow
hover:bg-brand-card     = Background change
hover:border-primary-500 = Border color change
transition-all          = Smooth transition
```

## 🎭 Animation Classes

```
animate-fade-in         = Fade in (0.5s)
animate-slide-in        = Slide in (0.5s)
animate-pulse-glow      = Glow pulse (2s)
animate-float           = Float effect (3s)
animate-spin            = Spin (built-in)
```

## 🔗 Routes

```
/                   → Landing Page
/login              → Login
/signup             → Signup
/dashboard          → Dashboard (Protected)
/room/:roomId       → Editor (Protected)
```

## 📱 Responsive Breakpoints

```
Mobile:    < 640px
Tablet:    640px - 1024px
Desktop:   > 1024px
Large:     > 1280px
```

## 🎯 Common Props

### All Components
```jsx
className      = Additional CSS classes
```

### Button
```jsx
variant        = "primary" | "secondary" | "outline" | "ghost" | "success" | "error"
size          = "sm" | "md" | "lg" | "xl"
disabled      = boolean
onClick       = function
icon          = React component
iconPosition  = "left" | "right"
```

### Card
```jsx
hover         = boolean (scale on hover)
glow          = boolean (glow shadow)
className     = string
```

### Avatar
```jsx
name          = string (for initials)
src           = string (image URL)
size          = "xs" | "sm" | "md" | "lg" | "xl"
online        = boolean
initials      = string
```

### Badge
```jsx
variant       = "default" | "primary" | "success" | "error" | "warning" | "purple" | "blue"
size          = "xs" | "sm" | "md" | "lg"
icon          = React component
```

## 💾 File Locations

```
Components:
  Button          src/components/Common/Button.jsx
  Card            src/components/Common/Card.jsx
  Avatar          src/components/Common/Avatar.jsx
  Badge           src/components/Common/Badge.jsx
  Navbar          src/components/Layout/Navbar.jsx
  EditorHeader    src/components/Editor/EditorHeader.jsx
  ChatPanel       src/components/Chat/ChatPanelUpgraded.jsx
  OutputPanel     src/components/Editor/OutputPanelUpgraded.jsx
  UsersSidebar    src/components/Editor/UsersSidebarUpgraded.jsx

Pages:
  Home            src/pages/Home.jsx
  Dashboard       src/pages/Dashboard.jsx
  Editor          src/pages/Editor.jsx

Config:
  Tailwind        client/tailwind.config.js
  App Routes      src/App.jsx
```

## 🔍 Import Statements

```jsx
// Common Components
import { Button } from '../components/Common/Button';
import { Card, CardHeader, CardBody, CardFooter } from '../components/Common/Card';
import { Avatar, AvatarGroup } from '../components/Common/Avatar';
import { Badge, Spinner, LoadingSpinner, Tooltip } from '../components/Common/Badge';

// Layout
import { Navbar } from '../components/Layout/Navbar';

// Editor
import { EditorHeader } from '../components/Editor/EditorHeader';
import { OutputPanel } from '../components/Editor/OutputPanelUpgraded';
import { ChatPanel } from '../components/Chat/ChatPanelUpgraded';
import { UsersSidebar } from '../components/Editor/UsersSidebarUpgraded';

// Contexts
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useSocket } from '../contexts/SocketContext';
```

## 🚀 Start Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🧪 Testing Components in Isolation

```jsx
// Create a test file component
export const ButtonShowcase = () => (
  <div className="p-8 space-y-4">
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="success">Success</Button>
    <Button variant="error">Error</Button>
  </div>
);
```

## 📋 Common Patterns

### Form with Error
```jsx
const [email, setEmail] = useState('');
const [error, setError] = useState('');

const handleSubmit = (e) => {
  e.preventDefault();
  if (!email.includes('@')) {
    setError('Invalid email');
    return;
  }
  // Submit...
};

return (
  <form onSubmit={handleSubmit}>
    <input
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className={error ? 'border-red-500' : ''}
    />
    {error && <span className="text-red-500">{error}</span>}
    <Button type="submit">Submit</Button>
  </form>
);
```

### Loading with Button
```jsx
const [isLoading, setIsLoading] = useState(false);

const handleClick = async () => {
  setIsLoading(true);
  try {
    await apiCall();
  } catch (err) {
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};

return (
  <Button onClick={handleClick} disabled={isLoading}>
    {isLoading ? 'Loading...' : 'Click Me'}
  </Button>
);
```

### Modal/Dialog
```jsx
const [isOpen, setIsOpen] = useState(false);

return (
  <>
    <Button onClick={() => setIsOpen(true)}>Open</Button>
    {isOpen && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <Card className="max-w-md">
          <h3 className="text-lg font-bold">Modal Title</h3>
          <p>Content</p>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </Card>
      </div>
    )}
  </>
);
```

## 🎓 Best Practices

✅ Use Tailwind classes for styling
✅ Keep components small and focused
✅ Use semantic HTML
✅ Handle loading and error states
✅ Provide visual feedback
✅ Test on mobile devices
✅ Use consistent spacing (multiples of 4px)
✅ Maintain color consistency

❌ Don't hard-code colors
❌ Don't make components too large
❌ Don't forget accessibility
❌ Don't use inline styles
❌ Don't ignore loading states
❌ Don't animate everything

## 📞 Quick Debugging

```
Issue: Styles not applying
→ Check Tailwind config is loaded
→ Verify CSS file imported
→ Clear browser cache

Issue: Component not visible
→ Check import path
→ Verify component exported
→ Check parent has proper layout

Issue: Animation not playing
→ Check animation in tailwind.config.js
→ Verify animation class applied
→ Check animation-duration

Issue: Layout broken on mobile
→ Check responsive breakpoints
→ Test with different viewport sizes
→ Use DevTools responsive mode
```

## 🎯 Key Metrics

- **Performance**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Accessibility**: WCAG AA standard
- **Browser Support**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile**: 100% responsive from 320px to 2560px

---

**Last Updated**: April 2024
**Version**: 1.0
**Status**: Production Ready ✅
