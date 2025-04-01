# Technical Design Document: Festive Tree Messaging Platform

## 1. Overview

### 1.1 Purpose

This document defines the technical architecture and implementation details for an MVP of a web-based platform where users can:

- Create customizable "trees" tied to holidays or personal events.
- Invite friends to leave messages that appear as decorations on the tree.
- Share and visit trees socially.

### 1.2 Goals

- Deliver a functional MVP within 4-6 weeks.
- Ensure scalability and ease of iteration.
- Provide a delightful, responsive user experience.

### 1.3 Scope

The MVP focuses on core features: user accounts, tree creation/management, messaging, and basic social sharing. Advanced features (e.g., animations, notifications) are deferred to post-MVP iterations.

---

## 2. System Architecture

### 2.1 High-Level Architecture

- **Frontend**: Next.js (React) with Chakra UI v3 for responsive, component-based UI.
- **Backend**: Next.js API Routes for serverless endpoints, integrated with Prisma ORM.
- **Database**: MongoDB for flexible, document-based storage.
- **Deployment**: Vercel for hosting (optimized for Next.js).

```
[Client Browser] <--> [Next.js (Frontend + API Routes)] <--> [MongoDB via Prisma]
```

### 2.2 Why This Stack?

- **Next.js**: Unified full-stack framework; supports SSR, static generation, and API routes, reducing complexity for an MVP.
- **Chakra UI v3**: Simplifies responsive design and theming; accelerates UI development.
- **Prisma**: Intuitive ORM for MongoDB, easing data modeling and queries.
- **MongoDB**: Schema flexibility suits evolving features (e.g., tree themes, message types).

---

## 3. Data Model

### 3.1 Entities

#### User

- `id`: String (MongoDB ObjectId)
- `email`: String (unique)
- `name`: String
- `createdAt`: DateTime
- `trees`: Relation to Tree[]

#### Tree

- `id`: String (MongoDB ObjectId)
- `ownerId`: String (references User.id)
- `theme`: String (e.g., "christmas", default: "christmas")
- `isPublic`: Boolean (default: false)
- `messages`: Relation to Message[]
- `createdAt`: DateTime

#### Message

- `id`: String- `treeId`: String (references Tree.id)
- `author`: String (name of sender, nullable for anonymous messages)
- `content`: String (max 280 characters)
- `imageUrls`: String[] (array of image URLs)
- `createdAt`: DateTime

### 3.2 Prisma Schema

```prisma
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  name      String
  trees     Tree[]
  createdAt DateTime @default(now())
}

model Tree {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  ownerId   String   @db.ObjectId
  owner     User     @relation(fields: [ownerId], references: [id])
  theme     String   @default("christmas")
  isPublic  Boolean  @default(false)
  messages  Message[]
  createdAt DateTime @default(now())
}

model Message {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  treeId    String   @db.ObjectId
  tree      Tree     @relation(fields: [treeId], references: [id])
  author    String?
  content   String   @db.String(280)
  imageUrls String[]
  createdAt DateTime @default(now())
}
```

### Next.js Project Structure: Festive Tree Messaging Platform

```txt
festive-tree-app/
├── /app                  # Next.js App Router (primary structure)
│   ├── /api              # API routes for backend logic
│   │   ├── /auth         # Authentication endpoints
│   │   │   ├── signup    # POST: User registration
│   │   │   │   └── route.ts
│   │   │   ├── login     # POST: User login
│   │   │   │   └── route.ts
│   │   ├── /trees        # Tree-related endpoints
│   │   │   ├── route.ts  # POST: Create tree, GET: List user’s trees
│   │   │   ├── /[id]     # Tree-specific endpoints
│   │   │   │   ├── route.ts  # GET: Fetch tree, PATCH: Update tree
│   │   │   │   ├── /messages
│   │   │   │   │   └── route.ts  # POST: Add message to tree
│   ├── /dashboard        # User dashboard page
│   │   └── page.tsx
│   ├── /tree             # Tree view page
│   │   ├── /[id]         # Dynamic route for specific tree
│   │   │   └── page.tsx
│   ├── /signup           # Signup page
│   │   └── page.tsx
│   ├── /login            # Login page
│   │   └── page.tsx
│   ├── /layout.tsx       # Root layout (shared UI, e.g., navbar)
│   ├── /page.tsx         # Home/landing page
│   └── /not-found.tsx    # Custom 404 page
├── /components           # Reusable UI components (Chakra UI)
│   ├── /auth             # Auth-related components
│   │   ├── AuthForm.tsx  # Reusable form for signup/login
│   ├── /tree             # Tree-related components
│   │   ├── TreeCanvas.tsx  # Tree visualization
│   │   ├── MessageCard.tsx # Single message display
│   │   ├── TreeForm.tsx    # Form for creating/updating trees
│   │   └── MessageForm.tsx # Form for adding messages
│   ├── /layout           # Layout components
│   │   ├── Navbar.tsx    # Navigation bar
│   │   └── Footer.tsx    # Footer
│   └── /common           # General-purpose components
│       └── LoadingSpinner.tsx  # Loading indicator
├── /lib                  # Utility functions and shared logic
│   ├── /prisma.ts        # Prisma client initialization
│   ├── /auth.ts          # Authentication helpers (e.g., JWT, bcrypt)
│   ├── /api.ts           # API fetch wrappers
│   └── /utils.ts         # General utilities (e.g., sanitize input)
├── /prisma               # Prisma ORM configuration
│   └── /schema.prisma    # Data model definitions
├── /public               # Static assets
│   ├── /images           # Tree theme images (e.g., christmas-tree.png)
│   └── /favicon.ico      # App favicon
├── /styles              # Global styles and Chakra UI theme
│   ├── /theme.ts        # Custom Chakra UI theme
│   └── /globals.css     # Global CSS (if needed)
├── /types                # TypeScript type definitions
│   ├── /user.ts          # User-related types
│   ├── /tree.ts          # Tree-related types
│   └── /message.ts       # Message-related types
├── .env                  # Environment variables (e.g., MongoDB URI)
├── .env.example          # Template for env vars
├── .gitignore            # Git ignore file
├── next.config.js        # Next.js configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

---

## 4. API Design

### 4.1 Endpoints (Next.js API Routes)

#### Authentication

- **POST /api/auth/signup**
  - Input: `{ email: string, name: string, password: string }`
  - Output: `{ user: { id, email, name }, token: string }`
  - Description: Registers a new user.

- **POST /api/auth/login**
  - Input: `{ email: string, password: string }`
  - Output: `{ user: { id, email, name }, token: string }`
  - Description: Authenticates a user and returns a JWT.

#### Tree Management

- **POST /api/trees**
  - Input: `{ theme: string, isPublic: boolean }`
  - Output: `{ id, ownerId, theme, isPublic, messages: [] }`
  - Description: Creates a new tree for the authenticated user.

- **GET /api/trees/[id]**
  - Input: URL param `id`
  - Output: `{ id, owner: { name }, theme, isPublic, messages: [{ id, author, content, createdAt }] }`
  - Description: Fetches a tree by ID (public or owned by user).

- **PATCH /api/trees/[id]**
  - Input: `{ theme?: string, isPublic?: boolean }`
  - Output: Updated tree object
  - Description: Updates tree settings (authenticated user only).

#### Messaging

- **POST /api/trees/[id]/messages**
  - Input: `{ author: string | null, content: string }`
  - Output: `{ id, treeId, author, content, createdAt }`
  - Description: Adds a message to a tree (public or private with access).

### 4.2 Authentication

- Use JWT (JSON Web Tokens) stored in cookies for session management.
- Middleware to protect routes (e.g., `/api/trees/*`).

---

## 5. Frontend Design

### 5.1 Pages

- **/signup**: Registration form.
- **/login**: Login form.
- **/dashboard**: List of user’s trees with "Create New Tree" button.
- **/tree/[id]**: Displays a tree with messages and a form to add new messages.
- **/404**: Custom error page for invalid tree URLs.

### 5.2 Components (Chakra UI)

- **TreeCanvas**: Renders the tree visualization (SVG or CSS-based).
  - Props: `theme`, `messages` (to position decorations).
- **MessageCard**: Displays a single message as an ornament/leaf.
- **TreeForm**: Form for creating/updating trees (theme selector, toggle for public/private).
- **MessageForm**: Input for adding a message (author field optional).

### 5.3 Visualization Approach

- Use CSS Grid or SVG for tree layout.
- Messages as positioned elements (e.g., ornaments) with random or user-defined placement.
- Default theme: Simple Christmas tree with ornaments; expandable later.

---

## 6. Development Considerations

### 6.1 Security

- Sanitize message content to prevent XSS (e.g., use `sanitize-html`).
- Rate-limit API endpoints to prevent abuse (Next.js middleware).
- Store passwords hashed (e.g., bcrypt).

### 6.2 Performance

- Use Next.js static generation for public trees where possible.
- Optimize MongoDB queries with indexes on `treeId` and `ownerId`.
- Lazy-load tree visualizations on scroll.

### 6.3 Scalability

- MongoDB scales horizontally; start with a single instance on a cloud provider (e.g., MongoDB Atlas).
- Next.js API routes are serverless and auto-scale with Vercel.

---

## 7. Deployment

- **Hosting**: Vercel (free tier for MVP).
- **Database**: MongoDB Atlas (free tier for initial users).
- **CI/CD**: GitHub + Vercel integration for auto-deploys on push.

---

## 8. Milestones & Timeline

### Week 1-2: Setup & Core

- Project setup (Next.js, Prisma, MongoDB).
- Authentication (signup/login).
- Basic tree creation and listing.

### Week 3-4: Features

- Tree visualization with messages.
- Social sharing (public/private trees).
- Message posting.

### Week 5: Polish

- Responsive design with Chakra UI.
- Error handling and UX improvements.
- Testing (manual + basic unit tests).

### Week 6: Launch

- Deploy to Vercel.
- Seed with sample data.
- Gather feedback.

---

## 9. Risks & Mitigations

- **Risk**: Slow tree rendering with many messages.
  - **Mitigation**: Cap messages at 50 per tree for MVP; paginate later.
- **Risk**: Low user adoption.
  - **Mitigation**: Launch before a major holiday (e.g., Christmas 2025) with a referral system.
- **Risk**: Tech complexity overwhelming solo dev.
  - **Mitigation**: Stick to Next.js full-stack simplicity; avoid over-engineering.

---

## 10. Future Enhancements

- Real-time updates (WebSockets or Server-Sent Events).
- Custom themes and animations.
- Social media export (tree as image/video).
