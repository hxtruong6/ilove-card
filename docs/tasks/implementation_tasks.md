# iCard Implementation Tasks

This document breaks down the implementation tasks for the iCard project based on the `technical_design_document.md`. Tasks are organized by feature area and phase, with enhanced focus on UI/UX to deliver a delightful user experience.

## Project Setup & Infrastructure

### Initial Setup

- [x] **Task 1: Initialize Next.js project with TypeScript (Completed)**
- [x] **Task 2: Set up Chakra UI v3 and theme configuration (Completed)**
  - [x] Configure theme with `defineConfig` and `createSystem` in `/styles/theme.ts`
  - [x] Define color tokens (e.g., festive green, red) and semantic tokens (e.g., `primary`, `accent`)
  - [x] Create basic UI components (e.g., `Button`, `Input`) in `/components/common`
- [x] **Task 3: Configure Prisma with MongoDB (Completed)**
  - [x] Set up Prisma client in `/lib/prisma.ts`
  - [x] Connect to MongoDB Atlas via `.env`
- [x] **Task 4: Set up ESLint and Prettier (Completed)**
  - [x] Configure linting rules in `.eslintrc.json`
  - [x] Set up Prettier in `.prettierrc`
- [x] **Task 5: Configure Git hooks with Husky (Completed)**
  - [x] Add pre-commit hook for linting and formatting
  - [x] Add commit-msg hook for Conventional Commits
- [ ] **Task 6: Set up CI/CD pipeline with Vercel**
  - [ ] Configure Vercel deployment in `vercel.json`
  - [ ] Set up auto-deploy on push to `main`
  - _Note_: Replaced GitHub Actions with Vercel for Next.js optimization

### Database & Schema

- [x] **Task 7: Create initial Prisma schema (Completed)**
  - [x] Define `User` model in `/prisma/schema.prisma`
  - [x] Define `Tree` model with `theme` and `isPublic`
  - [x] Define `Message` model with `content` limit (280 chars)
  - [x] Set up relations (e.g., `User` → `Tree`, `Tree` → `Message`)
- [x] **Task 8: Create database migrations (Completed)**
  - [x] Sync MongoDB schema with Prisma (`npx prisma db push`)
  - [x] Add indexes on `Tree.ownerId` and `Message.treeId`
- [x] **Task 9: Set up database backup system (Completed)**
  - [x] Create backup script using MongoDB Atlas tools
  - [x] Store backups in compressed format (e.g., `.gz`)
- [x] **Task 10: Implement database seeding for development (Completed)**
  - [x] Create `seed.ts` with sample users, trees, and messages
  - [x] Add `seed` script to `package.json` (`npx prisma db seed`)

## Authentication System

### Backend Authentication

- [x] **Task 11: Implement JWT authentication system (Completed)**
  - [x] Create JWT utils in `/lib/auth.ts` (sign, verify)
  - [x] Add JWT middleware for protected routes
  - [x] Implement refresh token in cookies
- [x] **Task 12: Create authentication API endpoints (Completed)**
  - [x] `POST /api/auth/register` in `/app/api/auth/register/route.ts`
  - [x] `POST /api/auth/login` in `/app/api/auth/login/route.ts`
  - [x] `POST /api/auth/logout` in `/app/api/auth/logout/route.ts`
  - [x] `GET /api/auth/me` for user data
- [x] **Task 13: Implement password hashing with bcrypt (Completed)**
  - [x] Add hashing utils in `/lib/auth.ts`
  - [x] Verify passwords on login
  - [x] Enforce minimum password strength (8 chars, mixed case)
- [ ] **Task 14: Set up rate limiting** (Skipped for MVP)
  - [ ] Install `redis` and `@upstash/redis` (Vercel-friendly)
  - [ ] Add rate limiter to auth endpoints (e.g., 10 req/min)
  - [ ] Configure middleware in `/lib/api.ts`
  - _Note_: Simplified Redis setup for MVP

### Frontend Authentication

- [x] **Task 15: Create authentication components (Completed)**
  - [x] `LoginForm` in `/components/auth/LoginForm.tsx`
  - [x] `RegisterForm` in `/components/auth/RegisterForm.tsx`
  - [x] `AuthLayout` in `/components/auth/AuthLayout.tsx`
- [x] **Task 16: Implement authentication state management (Completed)**
  - [x] Set up `AuthContext` in `/lib/auth.ts`
  - [x] Create `useAuth` hook for components
- [x] **Task 17: Add protected route middleware (Completed)**
  - [x] Create `withAuth` HOC in `/lib/auth.ts`
  - [x] Protect `/dashboard` and `/tree/[id]` routes
- [x] **Task 18: Implement authentication error handling (Completed)**
  - [x] Add error states to `LoginForm` and `RegisterForm`
  - [x] Display toast notifications for errors (e.g., "Invalid credentials")

## Tree Management System

### Backend Tree API

- [x] **Task 19: Create tree API endpoints (Completed)**
  - [x] `GET /api/trees` - List user's trees with proper auth and error handling
  - [x] `POST /api/trees` - Create tree with Zod validation
  - [x] `GET /api/trees/[id]` - Fetch tree details with access control
  - [x] `PATCH /api/trees/[id]` - Update tree with validation
  - [x] `DELETE /api/trees/[id]` - Delete tree with ownership check
- [x] **Task 20: Implement tree sharing functionality (Completed)**
  - [x] Generate unique `shareUrl` in `/lib/utils.ts` using nanoid
  - [x] `POST /api/trees/[id]/share` - Enable sharing and return URL
  - [x] Update tree to be public when shared
- [x] **Task 21: Add tree access control middleware (Completed)**
  - [x] Restrict edits to tree owner in `/app/api/trees/[id]/route.ts`
  - [x] Allow public read access if `isPublic`
  - [x] Add middleware for protected and share paths

### Frontend Tree Components

- [ ] **Task 22: Create tree management components (Completed)**
  - [ ] `TreeList` in `/components/tree/TreeList.tsx` - Display user's trees
  - [ ] `TreeForm` in `/components/tree/TreeForm.tsx` - Create/edit tree
  - [ ] `TreeCard` in `/components/tree/TreeCard.tsx` - Tree preview card
- [ ] **Task 23: Implement tree visualization (High Priority)** [See TreeCanvas.md](tree_canvas.md)
  - [ ] `TreeCanvas` in `/components/tree/TreeCanvas.tsx` - SVG/CSS tree
  - [ ] Support themes (e.g., Christmas, Birthday) with `/public/images`
  - [ ] Add subtle animations (e.g., hover effects) via Framer Motion
- [ ] **Task 24: Add tree sharing UI**
  - [ ] `ShareTreeModal` in `/components/tree/ShareTreeModal.tsx`
  - [ ] Add "Copy Link" button with clipboard API

## Message System

### Backend Message API

- [ ] **Task 25: Create message API endpoints (High Priority)**
  - [ ] `GET /api/trees/[id]/messages` - List messages
  - [ ] `POST /api/trees/[id]/messages` - Add message
  - [ ] `PATCH /api/trees/[id]/messages/[messageId]` - Edit message
  - [ ] `DELETE /api/trees/[id]/messages/[messageId]` - Delete message
- [ ] **Task 26: Implement real-time message updates**
  - [ ] Set up WebSocket in `/lib/websocket.ts` (e.g., `ws`)
  - [ ] Broadcast new messages to connected clients

### Frontend Message Components

- [ ] **Task 27: Create message components**
  - [ ] `MessageList` in `/components/tree/MessageList.tsx` - Display messages
  - [ ] `MessageForm` in `/components/tree/MessageForm.tsx` - Input form
  - [ ] `MessageCard` in `/components/tree/MessageCard.tsx` - Message ornament
- [ ] **Task 28: Add rich text editor for messages**
  - [ ] Integrate `@tiptap/react` in `MessageForm`
  - [ ] Support bold, italic, and emojis
- [ ] **Task 29: Implement message positioning system**
  - [ ] Add drag-and-drop with `react-beautiful-dnd`
  - [ ] Validate positions within tree bounds

## UI/UX Implementation (Enhanced)

### Core UI Components

- [ ] **Task 30: Create shared UI components**
  - [ ] `Button` in `/components/common/Button.tsx` - Variants (solid, outline)
  - [ ] `Input` in `/components/common/Input.tsx` - With validation states
  - [ ] `Modal` in `/components/common/Modal.tsx` - Reusable dialog
  - [ ] `Toast` in `/components/common/Toast.tsx` - Success/error notifications
- [ ] **Task 31: Implement responsive layout (High Priority)**
  - [ ] `Navbar` in `/components/layout/Navbar.tsx` - Collapsible on mobile
  - [ ] `Footer` in `/components/layout/Footer.tsx` - Minimal footer
  - [ ] Optimize tree view for mobile (e.g., stacked messages)
- [ ] **Task 32: Add dark/light mode support**
  - [ ] Add theme toggle in `Navbar`
  - [ ] Persist theme in localStorage
  - [ ] Define dark mode colors in `/styles/theme.ts`

### UI/UX Design

- [ ] **Task 33: Create festive design system**
  - [ ] Define typography (e.g., playful fonts like "Comic Sans" for headers)
  - [ ] Add festive icons (e.g., ornaments, stars) in `/public/images`
  - [ ] Implement micro-animations (e.g., message "drop" effect)
- [ ] **Task 34: Enhance tree visualization UX**
  - [ ] Add zoom/pan controls for large trees
  - [ ] Implement hover tooltips for messages
  - [ ] Add "empty state" UI (e.g., "No messages yet!")
- [ ] **Task 35: Design onboarding flow**
  - [ ] Create `OnboardingModal` in `/components/common`
  - [ ] Guide users to create first tree (3-step wizard)

### Accessibility

- [ ] **Task 36: Implement accessibility features**
  - [ ] Add ARIA labels to `TreeCanvas`, `MessageCard`
  - [ ] Enable keyboard navigation (e.g., Tab to messages)
  - [ ] Test with screen readers (e.g., VoiceOver)
- [ ] **Task 37: Add accessibility testing**
  - [ ] Integrate `@axe-core/react` for automated checks
  - [ ] Run manual audits with Lighthouse

## Testing & Quality Assurance

### Unit Testing

- [ ] **Task 38: Set up testing environment**
  - [ ] Configure Jest in `jest.config.js`
  - [ ] Set up React Testing Library
- [ ] **Task 39: Implement component tests**
  - [ ] Test `LoginForm`, `RegisterForm`
  - [ ] Test `TreeCanvas`, `MessageCard`
- [ ] **Task 40: Add API endpoint tests**
  - [ ] Test auth endpoints in `/app/api/auth/*`
  - [ ] Test tree endpoints in `/app/api/trees/*`

### Integration Testing

- [ ] **Task 41: Set up Cypress**
  - [ ] Configure `cypress.config.ts`
  - [ ] Add Cypress commands for auth
- [ ] **Task 42: Create end-to-end tests**
  - [ ] Test login → tree creation → message posting flow

### Performance Testing

- [ ] **Task 43: Set up performance monitoring**
  - [ ] Run Lighthouse audits in CI
  - [ ] Track tree render time (<2s goal)

## Deployment & DevOps

### Infrastructure Setup

- [ ] **Task 44: Set up Vercel deployment**
  - [ ] Deploy to production domain
  - [ ] Set up preview deploys for PRs
- [ ] **Task 45: Configure MongoDB**
  - [ ] Use MongoDB Atlas production cluster
  - [ ] Enable automated backups

### Monitoring & Maintenance

- [ ] **Task 46: Implement error tracking**
  - [ ] Integrate Sentry in `/lib/sentry.ts`
  - [ ] Capture API and UI errors

## Documentation

### Technical Documentation

- [ ] **Task 47: Create API documentation**
  - [ ] Use Swagger/OpenAPI in `/docs/api.md`
  - [ ] Document endpoints with examples
- [ ] **Task 48: Write component documentation**
  - [ ] Add JSDoc to all components

### User Documentation

- [ ] **Task 49: Create user guide**
  - [ ] Write "Getting Started" in `/docs/user-guide.md`
  - [ ] Add screenshots of tree creation

## Progress Tracking

- [x] **Phase 1: Project Setup & Infrastructure** (90% complete)
- [ ] **Phase 2: Authentication System** (80% complete)
- [ ] **Phase 3: Tree Management System**
- [ ] **Phase 4: Message System**
- [ ] **Phase 5: UI/UX Implementation**
- [ ] **Phase 6: Testing & Quality Assurance**
- [ ] **Phase 7: Deployment & DevOps**
- [ ] **Phase 8: Documentation**
