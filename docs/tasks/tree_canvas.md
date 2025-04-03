## Task Checklist: Implement TreeCanvas Component UI

### Task 23: Implement Tree Visualization (High Priority)

**Description**: Create the `TreeCanvas` component to display a festive tree where users can view, add, and interact with message cards as decorations. The tree should reflect the playful, elegant design from the provided image, with a focus on user-friendliness, responsiveness, and uniqueness.

**File Location**: `/components/tree/TreeCanvas.tsx`

**Dependencies**:

- Task 19 (Tree API endpoints) must be completed to fetch tree data.
- Task 27 (Message components) must be completed for `MessageCard` integration.

**Subtasks**:

#### 1. Set Up Component Structure

- [ ] **Create `TreeCanvas` component**

  - Initialize a functional component in `/components/tree/TreeCanvas.tsx`.
  - Define props using TypeScript:

    ```ts
    /**
     * Renders a festive tree with message cards as decorations.
     * @param tree - The tree object with theme and messages.
     */
    interface TreeCanvasProps {
      tree: Tree;
    }
    const TreeCanvas: React.FC<TreeCanvasProps> = ({ tree }) => {
      return <Box>{/* Tree implementation */}</Box>;
    };
    ```

  - Export the component for use in `/app/tree/[id]/page.tsx`.

#### 2. Design the Tree Base

- [ ] **Render the tree shape**

  - Use a layered approach with Chakra UI’s `Box` components to create a triangular tree shape.
  - Stack multiple `Box` elements with decreasing widths to form the tree tiers (similar to the image’s scalloped layers).
  - Example:

    ```tsx
    <Box position="relative" w="100%" maxW="600px" h="500px">
      {/* Tree tiers */}
      <Box bg="teal.500" w="100%" h="150px" borderRadius="md" position="absolute" bottom="50px" />
      <Box
        bg="teal.400"
        w="80%"
        h="120px"
        borderRadius="md"
        position="absolute"
        bottom="150px"
        left="10%"
      />
      <Box
        bg="teal.300"
        w="60%"
        h="90px"
        borderRadius="md"
        position="absolute"
        bottom="230px"
        left="20%"
      />
      <Box
        bg="teal.200"
        w="40%"
        h="60px"
        borderRadius="md"
        position="absolute"
        bottom="290px"
        left="30%"
      />
      {/* Tree trunk */}
      <Box
        bg="brown.600"
        w="50px"
        h="50px"
        position="absolute"
        bottom="0"
        left="calc(50% - 25px)"
      />
    </Box>
    ```

  - Apply a festive color palette (e.g., teal shades as in the image) defined in `/styles/theme.ts`.

- [ ] **Add a tree topper**

  - Place a decorative element (e.g., a bow like in the image) at the top.
  - Use an image from `/public/images/bow.png` or an SVG:

    ```tsx
    <Box position="absolute" top="-20px" left="calc(50% - 30px)">
      <Image src="/images/bow.png" alt="Tree topper" w="60px" h="60px" />
    </Box>
    ```

#### 3. Implement Message Cards as Decorations

- [ ] **Render messages as decorations**

  - Map over `tree.messages` to render each message as a `MessageCard` component.
  - Position messages on the tree using absolute positioning with random or user-defined coordinates.
  - Example:

    ```tsx
    {
      tree.messages.map(message => (
        <MessageCard
          key={message.id}
          message={message}
          position={{ top: `${Math.random() * 80}%`, left: `${Math.random() * 80}%` }}
        />
      ));
    }
    ```

  - Ensure `MessageCard` supports different decoration styles (e.g., snowman, gingerbread man) based on a `style` prop.

- [ ] **Style `MessageCard` to match the image**

  - Update `/components/tree/MessageCard.tsx` to support multiple decoration types:

    ```tsx
    /**
     * Displays a message as a festive decoration on the tree.
     * @param message - The message object.
     * @param position - The position on the tree (top, left).
     * @param style - The decoration style (e.g., snowman, gift).
     */
    interface MessageCardProps {
      message: Message;
      position: { top: string; left: string };
      style?: 'snowman' | 'gingerbread' | 'gift' | 'ornament' | 'bell';
    }
    const MessageCard: React.FC<MessageCardProps> = ({ message, position, style = 'ornament' }) => {
      const decorationMap = {
        snowman: '/images/snowman.png',
        gingerbread: '/images/gingerbread.png',
        gift: '/images/gift.png',
        ornament: '/images/ornament.png',
        bell: '/images/bell.png',
      };
      return (
        <Box position="absolute" {...position} w="50px" h="50px">
          <Image src={decorationMap[style]} alt={style} w="100%" h="100%" />
          <Tooltip label={message.content} placement="top">
            <Box position="absolute" top="0" left="0" w="100%" h="100%" />
          </Tooltip>
        </Box>
      );
    };
    ```

  - Randomly assign a `style` to each message for variety (e.g., 20% chance of each type).

#### 4. Add Interactivity

- [ ] **Enable drag-and-drop for messages**

  - Integrate `react-beautiful-dnd` to allow users to reposition messages on the tree.
  - Add a `position` field to the `Message` model in `/prisma/schema.prisma`:

    ```prisma
    model Message {
      position  Json?  // { top: string, left: string }
    }
    ```

  - Update `POST /api/trees/[id]/messages` to save position data.
  - Example:

    ```tsx
    import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

    const TreeCanvas: React.FC<TreeCanvasProps> = ({ tree }) => {
      const onDragEnd = async (result: any) => {
        if (!result.destination) return;
        const messageId = result.draggableId;
        const newPosition = { top: `${result.destination.y}%`, left: `${result.destination.x}%` };
        // Update position via API
        await fetch(`/api/trees/${tree.id}/messages/${messageId}`, {
          method: 'PATCH',
          body: JSON.stringify({ position: newPosition }),
        });
      };

      return (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tree">
            {provided => (
              <Box {...provided.droppableProps} ref={provided.innerRef}>
                {/* Tree base */}
                {tree.messages.map((message, index) => (
                  <Draggable key={message.id} draggableId={message.id} index={index}>
                    {provided => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <MessageCard
                          message={message}
                          position={message.position || { top: '50%', left: '50%' }}
                        />
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      );
    };
    ```

- [ ] **Add hover effects**

  - Show a tooltip with the message content on hover (already included in `MessageCard`).
  - Add a subtle scale animation on hover:

    ```tsx
    <Box transition="transform 0.2s" _hover={{ transform: 'scale(1.1)' }}>
      <Image src={decorationMap[style]} alt={style} />
    </Box>
    ```

#### 5. Enhance Visual Appeal

- [ ] **Add festive background effects**

  - Apply a gradient background to the tree container:

    ```tsx
    <Box bgGradient="linear(to-b, blue.900, black)" w="100%" h="100%">
      {/* Tree */}
    </Box>
    ```

  - Add subtle falling snow animation using `framer-motion`:

    ```tsx
    import { motion } from 'framer-motion';

    const SnowFlake = () => (
      <motion.div
        style={{ position: 'absolute', top: '-10px', left: `${Math.random() * 100}%` }}
        animate={{ y: '100vh', opacity: 0 }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        ❄️
      </motion.div>
    );

    const TreeCanvas: React.FC<TreeCanvasProps> = ({ tree }) => (
      <Box position="relative">
        {Array.from({ length: 20 }).map((_, i) => (
          <SnowFlake key={i} />
        ))}
        {/* Tree */}
      </Box>
    );
    ```

- [ ] **Support multiple themes**

  - Allow `tree.theme` to determine the tree’s appearance (e.g., Christmas, Birthday).
  - Map themes to different color schemes and decorations in `/styles/theme.ts`:

    ```ts
    const themeStyles = {
      christmas: { treeColor: 'teal', decorations: ['snowman', 'gingerbread', 'gift'] },
      birthday: { treeColor: 'pink', decorations: ['balloon', 'cake', 'gift'] },
    };
    ```

  - Update `TreeCanvas` to apply the theme dynamically:

    ```tsx
    const { treeColor, decorations } = themeStyles[tree.theme || 'christmas'];
    ```

#### 6. Ensure Responsiveness

- [ ] **Make the tree responsive**

  - Use Chakra UI’s responsive props to adjust tree size:

    ```tsx
    <Box w={{ base: '100%', md: '600px' }} h={{ base: '400px', md: '500px' }}>
      {/* Tree */}
    </Box>
    ```

  - Stack decorations vertically on mobile if space is limited:

    ```tsx
    const isMobile = useBreakpointValue({ base: true, md: false });
    const messagePosition = isMobile
      ? { top: `${index * 10}%`, left: '50%' }
      : message.position || { top: '50%', left: '50%' };
    ```

#### 7. Add Accessibility Features

- [ ] **Implement accessibility**

  - Add ARIA labels to decorations:

    ```tsx
    <Box role="img" aria-label={`Message from ${message.author || 'Anonymous'}`}>
      <Image src={decorationMap[style]} alt={style} />
    </Box>
    ```

  - Enable keyboard navigation to cycle through messages:

    ```tsx
    const messageRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          const currentIndex = messageRefs.current.findIndex(ref => ref === document.activeElement);
          const nextIndex = (currentIndex + 1) % tree.messages.length;
          messageRefs.current[nextIndex]?.focus();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [tree.messages]);

    {
      tree.messages.map((message, index) => (
        <Box ref={el => (messageRefs.current[index] = el)} tabIndex={0} key={message.id}>
          <MessageCard message={message} position={message.position} />
        </Box>
      ));
    }
    ```

#### 8. Add Empty State

- [ ] **Show empty state if no messages**

  - Display a friendly message if `tree.messages` is empty:

    ```tsx
    {
      tree.messages.length === 0 && (
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          textAlign="center"
        >
          <Text fontSize="lg" color="white">
            No messages yet! Add one to decorate your tree 🎄
          </Text>
        </Box>
      );
    }
    ```

#### 9. Test the Component

- [ ] **Write unit tests**

  - Test rendering with and without messages:

    ```ts
    import { render, screen } from '@testing-library/react';
    import TreeCanvas from './TreeCanvas';

    test('renders tree with messages', () => {
      const tree = { id: '1', theme: 'christmas', messages: [{ id: '1', content: 'Hello', author: 'User' }] };
      render(<TreeCanvas tree={tree} />);
      expect(screen.getByRole('img', { name: /Message from User/ })).toBeInTheDocument();
    });

    test('shows empty state', () => {
      const tree = { id: '1', theme: 'christmas', messages: [] };
      render(<TreeCanvas tree={tree} />);
      expect(screen.getByText(/No messages yet/)).toBeInTheDocument();
    });
    ```

#### 10. Document the Component

- [ ] **Add JSDoc and usage example**

  - Document props and usage in `/components/tree/TreeCanvas.tsx`:

    ```tsx
    /**
     * Renders a festive tree with message cards as decorations.
     * @example
     * const tree = { id: '1', theme: 'christmas', messages: [{ id: '1', content: 'Hello', author: 'User' }] };
     * <TreeCanvas tree={tree} />
     */
    ```

---

## Notes for Cursor AI

- **Uniqueness**: The tree design is inspired by the provided image, with a playful, layered look and diverse decorations (snowman, gingerbread man, gifts). This sets iCard apart from generic eCard platforms by offering a visually engaging, interactive experience.
- **Friendliness**: The empty state, tooltips, and drag-and-drop make the UI intuitive and welcoming.
- **Elegance**: Subtle animations (snow, hover effects) and a festive color palette create a polished, delightful feel.
- **Dependencies**: Ensure `react-beautiful-dnd`, `framer-motion`, and `@chakra-ui/tooltip` are installed (`npm install react-beautiful-dnd framer-motion @chakra-ui/tooltip`).
- **Assets**: Place decoration images (e.g., `snowman.png`, `gingerbread.png`) in `/public/images`.
