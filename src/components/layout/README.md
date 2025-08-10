# SideBar Component

A beautiful sidebar component with a watercolor-style banner and navigation menu, designed to match the iCard application's aesthetic.

## Features

- **Watercolor Banner**: Soft gradient background with decorative elements and "Save your Memories" text
- **Navigation Menu**: Clean menu items with icons for My Tree, Friends, and Settings
- **User Profile**: Personalized greeting with user avatar
- **Responsive Design**: Collapsible sidebar with smooth animations
- **Dark Mode Support**: Compatible with light and dark themes
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Usage

### Basic Usage

```tsx
import SideBar from '@/components/layout/SideBar';

function App() {
  return (
    <SideBar
      userName="Aidan"
      onNavigate={route => console.log(`Navigating to: ${route}`)}
      isOpen={true}
    />
  );
}
```

### With Navigation Handler

```tsx
import SideBar from '@/components/layout/SideBar';
import { useRouter } from 'next/navigation';

function App() {
  const router = useRouter();

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  return <SideBar userName="Aidan" onNavigate={handleNavigation} isOpen={true} />;
}
```

### Collapsible Sidebar

```tsx
import SideBar from '@/components/layout/SideBar';
import { useState } from 'react';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div style={{ display: 'flex' }}>
      <SideBar userName="Aidan" onNavigate={route => console.log(route)} isOpen={isSidebarOpen} />
      <main style={{ marginLeft: isSidebarOpen ? '280px' : '0' }}>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>Toggle Sidebar</button>
        {/* Your main content */}
      </main>
    </div>
  );
}
```

## Props

| Prop         | Type                      | Default     | Description                                                |
| ------------ | ------------------------- | ----------- | ---------------------------------------------------------- |
| `userName`   | `string`                  | `'Aidan'`   | The user's name to display in the profile section          |
| `onNavigate` | `(route: string) => void` | `undefined` | Callback function called when navigation items are clicked |
| `isOpen`     | `boolean`                 | `true`      | Controls whether the sidebar is visible or collapsed       |

## Navigation Routes

The component includes the following navigation routes:

- `/trees` - My Tree section
- `/friends` - Friends section
- `/settings` - Settings section
- `/profile` - User profile section
- `/next` - Next action (arrow button)

## Design Features

### Watercolor Banner

- Soft gradient background using green, yellow, and cream colors
- Decorative tree branch elements
- Handwritten-style typography for "Save your Memories"
- Blue border frame

### Menu Items

- **My Tree**: Green tree icon with red ornaments
- **Friends**: Blue users icon with green checkmark
- **Settings**: Blue gear icon
- **User Profile**: Gradient avatar with user icon and personalized greeting
- **Navigation Arrow**: Small gray button with arrow icon

### Styling

- Uses Chakra UI v3 components
- Responsive design with mobile-first approach
- Smooth transitions and hover effects
- Consistent spacing and typography
- Color mode support (light/dark theme)

## Testing

The component includes comprehensive tests covering:

- Default rendering
- Custom user name display
- Navigation callback functionality
- Sidebar open/close states
- Error handling when no navigation callback is provided

Run tests with:

```bash
npm test SideBar.test.tsx
```

## Demo

See `SideBarDemo.tsx` for a complete example of how to integrate the SideBar component with navigation state management and content display.

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Mobile responsive design
- Touch-friendly navigation

## Accessibility

- Proper ARIA labels for screen readers
- Keyboard navigation support
- High contrast text for readability
- Focus indicators for interactive elements
