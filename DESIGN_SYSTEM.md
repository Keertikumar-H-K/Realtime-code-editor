# CodeSync Design System

## Color Palette

### Primary Colors
```
Primary Purple: #a855f7
Primary Blue: #3b82f6
Primary Pink: #ec4899
```

### Background Colors
```
Dark Base: #020617
Dark Surface: #0f172a
Dark Card: #1e293b
```

### Status Colors
```
Success: #10b981 (Green)
Error: #ef4444 (Red)
Warning: #f59e0b (Orange)
```

### Neutral Colors
```
Text Primary: #ffffff (White)
Text Secondary: #e2e8f0 (Slate-200)
Text Muted: #94a3b8 (Slate-400)
Text Subtle: #64748b (Slate-500)
Border: #334155 (Slate-700)
```

## Typography

### Font Families
```
Sans Serif: Inter, Segoe UI, system-ui
Monospace: JetBrains Mono, Fira Code, Consolas
```

### Font Sizes
```
XL: 1.875rem (30px) - Hero titles
LG: 1.5rem (24px) - Section titles
MD: 1.125rem (18px) - Subsection titles
SM: 0.875rem (14px) - Body text
XS: 0.75rem (12px) - Labels and captions
```

### Font Weights
```
Regular: 400
Medium: 500
Semibold: 600
Bold: 700
```

## Spacing System

```
2px: 0.125rem
4px: 0.25rem
6px: 0.375rem
8px: 0.5rem
12px: 0.75rem
16px: 1rem
20px: 1.25rem
24px: 1.5rem
32px: 2rem
40px: 2.5rem
48px: 3rem
```

## Border Radius

```
Small: 0.375rem (6px)
Medium: 0.5rem (8px)
Large: 0.75rem (12px)
XL: 1rem (16px)
Full: 9999px (Circles)
```

## Shadow System

### Glow Effects
```
glow: 0 0 20px rgba(168, 85, 247, 0.3)
glow-lg: 0 0 30px rgba(168, 85, 247, 0.5)
glow-blue: 0 0 20px rgba(59, 130, 246, 0.3)
glow-blue-lg: 0 0 40px rgba(59, 130, 246, 0.5)
```

### Card Shadows
```
card: 0 10px 40px rgba(0, 0, 0, 0.3)
card-hover: 0 20px 60px rgba(0, 0, 0, 0.5)
inner-glow: inset 0 0 20px rgba(168, 85, 247, 0.1)
```

## Components Guide

### Buttons

#### Primary Button
- Use for main CTAs (Create Room, Join, Run Code)
- Gradient background (purple to blue)
- Glow effect on hover
- 1.05 scale on hover

#### Secondary Button
- Use for alternative actions
- Dark background with border
- Text highlight on hover
- For less important actions

#### Success Button
- Use for positive actions (Join Room, Run Code)
- Green background with glow
- Clear affordance

#### Error Button
- Use for destructive actions
- Red background
- Use with caution

#### Ghost Button
- Use for subtle actions
- No background
- Text color changes on hover
- Used in navigation or secondary menus

### Cards

- **Base**: Dark background (#1e293b) with blur effect
- **Border**: Subtle border with hover effect
- **Hover**: Scale up 1.05, border becomes primary color
- **Shadows**: Glow effect and depth
- **Padding**: 24px (1.5rem)

### Avatars

- **Sizes**: xs (24px), sm (32px), md (40px), lg (48px), xl (64px)
- **Background**: Auto-generated gradient based on name
- **Online Indicator**: Green dot bottom-right
- **Border**: None (or 2px on group)

### Badges

- **Purpose**: Status indicators, labels, counts
- **Variants**: default, primary, success, error, warning, purple, blue
- **Sizes**: xs, sm, md, lg
- **Icon Support**: Optional icon with text

### Input Fields

```
Background: Dark (#0f172a)
Border: Subtle (#334155)
Focus: Border becomes primary color with ring
Text: White
Placeholder: Gray-500
Transition: All 200ms
```

## Animations

### Timing
```
Fast: 200ms
Normal: 300ms
Slow: 500ms
Very Slow: 2s
```

### Common Animations
```
Fade In: 0.5s ease-in-out
Slide In: 0.5s ease-out (from bottom)
Pulse Glow: 2s ease-in-out infinite
Float: 3s ease-in-out infinite
```

## Responsive Breakpoints

```
Mobile: < 640px
Tablet: 640px - 1024px
Desktop: > 1024px
```

### Component Visibility
```
hidden: Display none
sm:flex: Show on tablets and larger
md:block: Show on desktop and larger
lg:flex: Show on large screens
xl:flex: Show on extra-large screens
```

## Glass Morphism

### Backdrop Blur Properties
```
Blur Amount: 4px - 16px
Background Color: rgba(15, 23, 42, 0.7) - Semi-transparent dark
Border: 1px solid rgba(51, 65, 85, 0.5) - Subtle border
```

## Gradient System

### Primary Gradient
```
from-purple-400 to-blue-400
Direction: 135deg (diagonal)
```

### Card Gradient
```
from-brand-card/50 to-brand-card/30
Creates subtle depth
```

### Hero Gradient
```
from-purple-600/10 to-blue-600/10
Used for background orbs
```

## Spacing & Layout

### Container Widths
```
Full Width: 100%
Max Width: 1280px (max-w-7xl)
Padding X: 16px (px-4), 24px (px-6), 32px (px-8)
Padding Y: 16px (py-4), 24px (py-6), 32px (py-8)
```

### Grid System
```
Single Column: 1 column
Two Column: 2 columns on md screens
Three Column: 3 columns on lg screens
Four Column: 4 columns on lg screens
Gap: 16px (gap-4) or 24px (gap-6)
```

## Form Elements

### Input States
```
Default: Border #334155, text white
Focus: Border #4f46e5, ring 1px #4f46e5
Disabled: Opacity 50%, cursor not-allowed
Error: Border #ef4444, text #ef4444
Success: Border #10b981, text #10b981
```

## Interaction States

### Hover Effects
- **Scale**: 1.02 - 1.05 depending on component
- **Color Shift**: Lighter or more saturated
- **Shadow**: Increase shadow depth
- **Transition**: 200ms smooth transition

### Active/Pressed State
- **Scale**: 0.98 - 0.99
- **Shadow**: Reduce shadow depth
- **Transition**: 100ms

### Focus State
- **Ring**: 2px ring with primary color
- **Outline**: None (use ring instead)
- **Visible**: Important for accessibility

## Typography Hierarchy

### Page Title (Hero)
```
Font Size: 2.25rem - 3.5rem
Font Weight: 700
Letter Spacing: -0.02em
Line Height: 1.2
Color: White
```

### Section Title
```
Font Size: 1.5rem - 2rem
Font Weight: 700
Letter Spacing: -0.01em
Line Height: 1.3
Color: White
```

### Subsection Title
```
Font Size: 1.125rem
Font Weight: 600
Line Height: 1.4
Color: White
```

### Body Text
```
Font Size: 0.875rem - 1rem
Font Weight: 400
Line Height: 1.6
Color: Gray-400
```

### Small Text / Labels
```
Font Size: 0.75rem - 0.875rem
Font Weight: 500
Line Height: 1.5
Color: Gray-500
```

## Usage Patterns

### Hero Section
- Large gradient title
- Badge with status
- Hero image/illustration with glow
- Multiple CTA buttons
- Stats section below

### Feature Cards
- Icon or emoji
- Title
- Description
- Hover effect with glow
- Optional link/action

### Navbar
- Logo left
- Navigation center
- Actions right
- Sticky position
- Glass morphism background

### Modal/Overlay
- Dark background with opacity
- Centered card on screen
- Backdrop blur
- Close button
- Optional actions footer

## Animation Best Practices

1. **Use Sparingly**: Don't animate everything
2. **Purpose**: Animations should enhance UX, not distract
3. **Performance**: Prefer transform and opacity
4. **Duration**: Keep animations under 500ms for UI feedback
5. **Easing**: Use ease-out for incoming, ease-in for outgoing

## Accessibility Guidelines

1. **Color Contrast**: All text meets WCAG AA standards
2. **Focus States**: All interactive elements have visible focus
3. **Keyboard Navigation**: All features accessible via keyboard
4. **ARIA Labels**: Interactive elements have proper labels
5. **Motion**: Provide no-motion alternative if possible

## Dark Mode

- All colors are designed for dark mode first
- Light mode can be implemented by inverting colors
- Text should always have sufficient contrast (7:1 minimum)
- Avoid pure white (#ffffff) text on black - use gray

## File Organization

```
components/
├── Common/          # Reusable UI components
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Avatar.jsx
│   ├── Badge.jsx
│   └── Input.jsx
├── Layout/          # Layout components
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   └── Footer.jsx
├── Editor/          # Editor-specific components
├── Chat/            # Chat-specific components
└── (feature)/ (other organized by feature)
```

## Version Control

All component files are self-contained and follow the same structure:
- Import dependencies at top
- Component definition
- Prop documentation
- Export statement

---

## Quick Reference

### Common Classes

**Text Colors**
```jsx
className="text-white"              // Primary text
className="text-slate-400"          // Secondary text
className="text-primary-400"        // Accent text
className="text-status-success"     // Success text
```

**Background Colors**
```jsx
className="bg-brand-dark"           // Dark background
className="bg-brand-card"           // Card background
className="bg-gradient-purple"      // Purple gradient
```

**Spacing**
```jsx
className="p-4"                     // Padding 16px
className="gap-4"                   // Gap 16px
className="mx-auto"                 // Margin auto
className="space-y-4"               // Vertical spacing
```

**Typography**
```jsx
className="text-xl font-bold"       // Large bold text
className="text-sm font-medium"     // Small medium text
className="font-mono"               // Monospace font
```

**Responsive**
```jsx
className="hidden md:block"         // Hide mobile, show tablet+
className="grid grid-cols-1 md:grid-cols-2" // 1 col mobile, 2 col tablet+
```

---

**Last Updated**: April 2024
**Design System Version**: 1.0
**Compatible with**: Tailwind CSS v3+, React 18+
