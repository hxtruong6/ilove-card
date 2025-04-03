Below, You’ll design a **website routing structure**, **navigation system**, and **user flow** for iCard, focusing on the features you’ve outlined:

- Easy access to the user’s tree upon opening the website.
- Navigation to different trees (categorized by holidays, festivals, events).
- A screen to read all messages on a tree.
- A UI to write messages with decoration options (ball, flower, bell, etc.).
- An introductory screen to encourage login/signup.
- A sharing screen for trees.
- Navigation to a friend list and public trees for writing messages.

I’ll also ensure the structure aligns with the Next.js App Router (as per your project setup) and supports the UI/UX focus from the `iCard Implementation Tasks`.

---

## Website Routing Structure

### Routes Overview

The routing structure is designed to be intuitive, with clear paths for each feature. We’ll use Next.js’s App Router (`/app`) for file-based routing, ensuring each screen has a dedicated route. The routes are organized to prioritize user actions (e.g., viewing trees, writing messages) and social interactions (e.g., exploring public trees, friends).

| Route                 | Description                                     | Auth Required? |
| --------------------- | ----------------------------------------------- | -------------- |
| `/`                   | Landing page (intro, encourages login/signup)   | No             |
| `/login`              | Login page                                      | No             |
| `/signup`             | Signup page                                     | No             |
| `/dashboard`          | User’s dashboard (shows their trees)            | Yes            |
| `/tree/[id]`          | View a specific tree (messages, write message)  | No (public)    |
| `/tree/[id]/messages` | Full-screen view of all messages on a tree      | No (public)    |
| `/tree/[id]/write`    | Write a message for a tree (with decoration UI) | Yes            |
| `/tree/[id]/share`    | Share a tree (generate URL, social sharing)     | Yes            |
| `/explore`            | Explore public trees (categorized by event)     | No             |
| `/friends`            | View friends’ trees                             | Yes            |
| `/about`              | About page (product info, team)                 | No             |
| `/not-found`          | Custom 404 page                                 | No             |

### Route Details

- **Public Routes**: `/`, `/login`, `/signup`, `/tree/[id]`, `/tree/[id]/messages`, `/explore`, `/about`, `/not-found` are accessible without authentication. Public trees (`/tree/[id]`) can be viewed by anyone, but writing messages requires login.
- **Protected Routes**: `/dashboard`, `/tree/[id]/write`, `/tree/[id]/share`, `/friends` require authentication. Use the `withAuth` HOC (Task 17) to protect these routes.
- **Dynamic Routes**: `/tree/[id]` and its subroutes use the tree’s ID for specific tree access.

---

## Navigation System

### Navbar

The navigation bar (`/components/layout/Navbar.tsx`) provides quick access to key features and adapts based on the user’s authentication state.

#### Navbar Structure

- **Logo**: Links to `/` (unauthenticated) or `/dashboard` (authenticated).
- **Links (Unauthenticated)**:
  - Explore (`/explore`)
  - About (`/about`)
  - Login (`/login`)
  - Signup (`/signup`)
- **Links (Authenticated)**:
  - Dashboard (`/dashboard`)
  - Explore (`/explore`)
  - Friends (`/friends`)
  - About (`/about`)
  - Profile Dropdown: Logout, Settings
- **Theme Toggle**: Dark/light mode switch (Task 32).
- **Responsive Design**: Collapsible menu on mobile (Task 31).

#### Navbar Code Snippet

```tsx
import { useAuth } from '@/lib/auth';
import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useBreakpointValue,
} from '@chakra-ui/react';
import Link from 'next/link';

const Navbar = () => {
  const { user, logout } = useAuth();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex as="nav" p={4} bg="teal.500" color="white" justify="space-between" align="center">
      {/* Logo */}
      <Link href={user ? '/dashboard' : '/'}>
        <Box fontSize="xl" fontWeight="bold">
          iCard
        </Box>
      </Link>

      {/* Menu */}
      {isMobile ? (
        <Menu>
          <MenuButton as={IconButton} icon={<HamburgerIcon />} variant="outline" />
          <MenuList bg="teal.500" color="white">
            {user ? (
              <>
                <MenuItem as={Link} href="/dashboard">
                  Dashboard
                </MenuItem>
                <MenuItem as={Link} href="/explore">
                  Explore
                </MenuItem>
                <MenuItem as={Link} href="/friends">
                  Friends
                </MenuItem>
                <MenuItem as={Link} href="/about">
                  About
                </MenuItem>
                <MenuItem onClick={logout}>Logout</MenuItem>
              </>
            ) : (
              <>
                <MenuItem as={Link} href="/explore">
                  Explore
                </MenuItem>
                <MenuItem as={Link} href="/about">
                  About
                </MenuItem>
                <MenuItem as={Link} href="/login">
                  Login
                </MenuItem>
                <MenuItem as={Link} href="/signup">
                  Signup
                </MenuItem>
              </>
            )}
          </MenuList>
        </Menu>
      ) : (
        <Flex gap={4}>
          {user ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/explore">Explore</Link>
              <Link href="/friends">Friends</Link>
              <Link href="/about">About</Link>
              <Menu>
                <MenuButton as={Button} variant="link">
                  Profile
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <>
              <Link href="/explore">Explore</Link>
              <Link href="/about">About</Link>
              <Link href="/login">Login</Link>
              <Button as={Link} href="/signup" colorScheme="pink">
                Signup
              </Button>
            </>
          )}
        </Flex>
      )}
    </Flex>
  );
};
```

### Footer

The footer (`/components/layout/Footer.tsx`) provides secondary navigation and branding.

- Links: About, Privacy Policy, Terms of Service.
- Social Media: Links to share iCard on platforms (e.g., Twitter, Instagram).
- Copyright: “© 2025 iCard. All rights reserved.”

---

## User Flow and Screen Design

### 1. Landing Page (`/`)

**Purpose**: Introduce the product and encourage login/signup.

- **UI**:
  - Hero section with a festive background (e.g., falling snow, tree illustration).
  - Tagline: “Celebrate with Friends – Create Your Festive Tree!”
  - Call-to-Action (CTA): “Get Started” button linking to `/signup`.
  - Preview of a sample tree (e.g., Christmas tree with decorations).
  - “Explore Public Trees” button linking to `/explore`.
- **Flow**:
  - Unauthenticated user lands here → Clicks “Get Started” → Redirects to `/signup`.
  - Alternatively, clicks “Explore Public Trees” → Redirects to `/explore`.

### 2. Dashboard (`/dashboard`)

**Purpose**: Show the user’s trees upon login (easy access as requested).

- **UI**:
  - Header: “My Trees” with a “Create New Tree” button.
  - Grid of `TreeCard` components (Task 22) showing the user’s trees.
  - Each card links to `/tree/[id]`.
- **Flow**:
  - User logs in → Redirects to `/dashboard` → Sees their trees → Clicks a tree to view (`/tree/[id]`).
  - Clicks “Create New Tree” → Opens `TreeForm` modal (Task 22) → Submits → Redirects to new tree (`/tree/[id]`).

### 3. Tree View (`/tree/[id]`)

**Purpose**: Display a specific tree with messages and allow writing messages.

- **UI**:
  - Centered `TreeCanvas` component (Task 23) showing the tree and message decorations.
  - Buttons:
    - “View All Messages” → Links to `/tree/[id]/messages`.
    - “Write a Message” → Links to `/tree/[id]/write` (authenticated users only).
    - “Share Tree” → Links to `/tree/[id]/share` (tree owner only).
  - If unauthenticated and tree is public, show a “Login to Write a Message” prompt.
- **Flow**:
  - User navigates to `/tree/[id]` (via dashboard, explore, or shared link) → Sees tree → Clicks “Write a Message” → Redirects to `/tree/[id]/write`.
  - Clicks “View All Messages” → Redirects to `/tree/[id]/messages`.

### 4. Messages Screen (`/tree/[id]/messages`)

**Purpose**: Full-screen view of all messages on a tree.

- **UI**:
  - `MessageList` component (Task 27) showing messages in a scrollable list.
  - Each message shows author, content, and decoration style.
  - Back button to return to `/tree/[id]`.
- **Flow**:
  - User clicks “View All Messages” on `/tree/[id]` → Sees message list → Clicks back to return.

### 5. Write Message Screen (`/tree/[id]/write`)

**Purpose**: Allow users to write a message with decoration options.

- **UI**:

  - `MessageForm` component (Task 27) with:

    - Text input for message content (rich text via `@tiptap/react`, Task 28).
    - Decoration selector (ball, flower, bell, etc.) using a dropdown or icon grid:

      ```tsx
      <Select placeholder="Choose decoration">
        <option value="ball">Ball</option>
        <option value="flower">Flower</option>
        <option value="bell">Bell</option>
        <option value="snowman">Snowman</option>
        <option value="gingerbread">Gingerbread</option>
      </Select>
      ```

    - Preview of the selected decoration.
    - “Submit” button to post the message.

  - Back button to return to `/tree/[id]`.

- **Flow**:
  - User clicks “Write a Message” on `/tree/[id]` → Enters message → Selects decoration → Submits → Redirects back to `/tree/[id]` with new message on the tree.

### 6. Share Tree Screen (`/tree/[id]/share`)

**Purpose**: Allow users to share their tree.

- **UI**:
  - `ShareTreeModal` component (Task 24) with:
    - Generated share URL (e.g., `https://icard.com/tree/123`).
    - “Copy Link” button using clipboard API.
    - Social sharing buttons (e.g., Twitter, WhatsApp).
  - Back button to return to `/tree/[id]`.
- **Flow**:
  - User clicks “Share Tree” on `/tree/[id]` → Sees share options → Copies link or shares → Returns to `/tree/[id]`.

### 7. Explore Public Trees (`/explore`)

**Purpose**: Allow users to navigate trees by holiday, festival, or event.

- **UI**:
  - Tabs or filters for categories (e.g., Christmas, Birthday, New Year).
  - Grid of `TreeCard` components showing public trees.
  - Each card links to `/tree/[id]`.
  - Search bar to find trees by theme or owner.
- **Flow**:
  - User navigates to `/explore` → Filters by “Christmas” → Sees public Christmas trees → Clicks a tree → Redirects to `/tree/[id]`.

### 8. Friends’ Trees (`/friends`)

**Purpose**: View friends’ trees and write messages.

- **UI**:
  - List of friends (future feature, Task 56) with their trees.
  - Each tree links to `/tree/[id]`.
  - “Add Friend” button (placeholder for future implementation).
- **Flow**:
  - User navigates to `/friends` → Sees friends’ trees → Clicks a tree → Redirects to `/tree/[id]` → Writes a message.

---

## User Flow Summary

### Unauthenticated User

1. Lands on `/` → Sees intro → Clicks “Get Started” → Redirects to `/signup`.
2. Alternatively, clicks “Explore Public Trees” → Goes to `/explore` → Views a tree (`/tree/[id]`) → Prompted to login to write a message → Redirects to `/login`.

### Authenticated User

1. Logs in → Redirects to `/dashboard` → Sees their trees → Clicks a tree (`/tree/[id]`).
2. On `/tree/[id]`:
   - Views messages → Clicks “View All Messages” → Goes to `/tree/[id]/messages`.
   - Writes a message → Clicks “Write a Message” → Goes to `/tree/[id]/write` → Submits → Returns to `/tree/[id]`.
   - Shares the tree → Clicks “Share Tree” → Goes to `/tree/[id]/share` → Copies link → Returns.
3. Explores public trees → Navigates to `/explore` → Views a tree → Writes a message.
4. Views friends’ trees → Navigates to `/friends` → Views a tree → Writes a message.

---

## Implementation Checklist for Routing and Navigation

### Task: Implement Website Routing and Navigation

**File Locations**:

- Routes: `/app/*`
- Navbar: `/components/layout/Navbar.tsx`
- Footer: `/components/layout/Footer.tsx`

**Subtasks**:

#### 1. Set Up Routes

- [ ] **Create route files**
  - `/app/page.tsx` (Landing page)
  - `/app/login/page.tsx`
  - `/app/signup/page.tsx`
  - `/app/dashboard/page.tsx`
  - `/app/tree/[id]/page.tsx`
  - `/app/tree/[id]/messages/page.tsx`
  - `/app/tree/[id]/write/page.tsx`
  - `/app/tree/[id]/share/page.tsx`
  - `/app/explore/page.tsx`
  - `/app/friends/page.tsx`
  - `/app/about/page.tsx`
  - `/app/not-found.tsx`

#### 2. Implement Navbar and Footer

- [ ] **Update Navbar (Task 31)**
  - Add links based on auth state (see Navbar Structure above).
  - Ensure responsiveness with Chakra UI.
- [ ] **Create Footer**
  - Add secondary links and social sharing.

#### 3. Implement Route Protection

- [ ] **Protect routes (Task 17)**
  - Apply `withAuth` HOC to `/dashboard`, `/tree/[id]/write`, `/tree/[id]/share`, `/friends`.

#### 4. Test Navigation Flow

- [ ] **Add end-to-end tests (Task 42)**
  - Test: Unauthenticated user flow (landing → signup → dashboard).
  - Test: Authenticated user flow (dashboard → tree → write message → share).

---

## Why This Design?

- **Easy Access**: The `/dashboard` route ensures users see their trees immediately after login. Public trees are accessible via `/explore` without login, encouraging exploration.
- **Intuitive Navigation**: The Navbar provides quick access to core features (Dashboard, Explore, Friends). Subroutes under `/tree/[id]` (e.g., `/messages`, `/write`, `/share`) keep tree-related actions contextual.
- **Social Focus**: `/explore` and `/friends` make it easy to discover and interact with other trees, fostering community.
- **UI/UX Alignment**: Each screen is designed with clear CTAs (e.g., “Write a Message”, “Share Tree”) and festive visuals, matching the playful aesthetic of the `TreeCanvas`.
