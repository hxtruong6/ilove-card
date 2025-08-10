# UserMessage Component

A beautiful message card component with watercolor-style design and festive decorations, perfect for displaying user messages on a tree. This component matches the iCard application's aesthetic with soft gradients and holiday-themed decorations.

## Features

- **Watercolor Background**: Soft gradient background with decorative elements
- **Multiple Decorations**: Holly, Pine, Berries, and Ribbon decorations
- **Author Tag**: Prominent author identification with "by [Name]" format
- **Interactive Elements**: Menu button and clickable message area
- **Selection State**: Visual feedback with dashed border when selected
- **Responsive Design**: Adapts to different screen sizes
- **Dark Mode Support**: Compatible with light and dark themes
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Usage

### Basic Usage

```tsx
import UserMessage from '@/components/common/UserMessage';

function MessageDisplay() {
  return (
    <UserMessage
      message="Hi, you're the best person I've ever known in this world"
      author="Alex"
      timestamp="12:03 - Sep 28, 2025"
    />
  );
}
```

### With Custom Decoration

```tsx
<UserMessage
  message="Wishing you joy and happiness this holiday season!"
  author="Sarah"
  timestamp="14:22 - Dec 15, 2024"
  decoration={{ type: 'pine' }}
/>
```

### With Interactive Features

```tsx
import { useRouter } from 'next/navigation';

function InteractiveMessage() {
  const router = useRouter();

  const handleMessageClick = () => {
    router.push('/message-details');
  };

  const handleMenuClick = () => {
    // Show message options menu
    console.log('Show menu');
  };

  return (
    <UserMessage
      message="Thank you for being such an amazing friend"
      author="Mike"
      timestamp="09:45 - Dec 20, 2024"
      decoration={{ type: 'berries' }}
      onMessageClick={handleMessageClick}
      onMenuClick={handleMenuClick}
      isSelected={true}
    />
  );
}
```

### Multiple Messages

```tsx
const messages = [
  {
    message: "Hi, you're the best person I've ever known in this world",
    author: 'Alex',
    timestamp: '12:03 - Sep 28, 2025',
    decoration: { type: 'holly' },
  },
  {
    message: 'Wishing you joy and happiness this holiday season!',
    author: 'Sarah',
    timestamp: '14:22 - Dec 15, 2024',
    decoration: { type: 'pine' },
  },
];

function MessageList() {
  return (
    <VStack gap={4}>
      {messages.map((msg, index) => (
        <UserMessage
          key={index}
          message={msg.message}
          author={msg.author}
          timestamp={msg.timestamp}
          decoration={msg.decoration}
        />
      ))}
    </VStack>
  );
}
```

## Props

| Prop             | Type             | Default             | Description                            |
| ---------------- | ---------------- | ------------------- | -------------------------------------- |
| `message`        | `string`         | **Required**        | The message text to display            |
| `author`         | `string`         | **Required**        | The author's name                      |
| `timestamp`      | `string`         | **Required**        | The timestamp to display               |
| `decoration`     | `DecorationType` | `{ type: 'holly' }` | The decoration type and optional color |
| `isSelected`     | `boolean`        | `false`             | Whether the message is selected        |
| `onMenuClick`    | `() => void`     | `undefined`         | Callback for menu button clicks        |
| `onMessageClick` | `() => void`     | `undefined`         | Callback for message area clicks       |

## Decoration Types

### Holly

- Green holly leaves with red berries
- Traditional Christmas decoration
- Multiple leaf layers with varying shades

### Pine

- Pine needle clusters
- Triangular shapes using CSS clip-path
- Dark green gradient for depth

### Berries

- Red berry clusters
- Multiple berry sizes for variety
- Different shades of red for realism

### Ribbon

- Red ribbon bow design
- Layered elements for 3D effect
- Bow loops and center knot

## Design Features

### Watercolor Background

- Soft gradient using green, yellow, and cream colors
- Radial gradient overlays for texture
- Subtle opacity for background effect

### Message Card

- White background with teal border
- Rounded corners for soft appearance
- Box shadow for depth
- Proper spacing and typography

### Author Tag

- Reddish-brown background
- White text for contrast
- Positioned above the message card
- Rounded corners for consistency

### Menu Button

- Three-dot icon (ellipsis)
- Gray background with hover effects
- Positioned in top-right corner
- Prevents event propagation when clicked

### Selection State

- Dashed blue border when selected
- Visual feedback for user interaction
- Maintains existing styling

## Styling

### Colors

- **Primary**: Teal shades for text and borders
- **Background**: White card with watercolor background
- **Accent**: Red for author tag and berry decorations
- **Neutral**: Gray for timestamps and menu icons

### Typography

- **Message**: Medium weight, italic style
- **Timestamp**: Small, light gray
- **Author**: Medium weight, white on colored background

### Spacing

- Consistent padding and margins
- Proper gap between elements
- Responsive sizing for different screen sizes

## Accessibility

- **ARIA Labels**: Menu button has proper aria-label
- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Focus Indicators**: Clear focus states for interactive elements
- **Screen Reader Support**: Proper semantic structure

## Testing

The component includes comprehensive tests covering:

- Default rendering with all required props
- Custom decoration types
- Selection state functionality
- Click handlers and event propagation
- Different author names and timestamps
- Cursor styles for interactive states

Run tests with:

```bash
npm test UserMessage.test.tsx
```

## Demo

See `UserMessageDemo.tsx` for a complete example showcasing:

- Different decoration types
- Interactive controls
- Sample messages
- Feature overview

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- CSS clip-path for pine decoration
- CSS gradients and transforms
- Mobile responsive design

## Performance

- Optimized rendering with React.memo (if needed)
- Efficient CSS-in-JS with Chakra UI
- Minimal re-renders with proper prop handling
- Lightweight decorative elements using CSS only
