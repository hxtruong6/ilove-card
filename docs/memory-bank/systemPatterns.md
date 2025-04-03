# iCard System Patterns

## Architecture Overview

iCard follows a modern full-stack architecture with the following layers:

- Frontend: Next.js with TypeScript
- Backend: Node.js with Express
- Database: MongoDB with Prisma
- Authentication: NextAuth.js
- UI Framework: Chakra UI

## Design Patterns

1. **MVC Pattern**

   - Models: Prisma schema definitions
   - Views: Next.js pages and components
   - Controllers: API routes and handlers

2. **Repository Pattern**

   - Centralized database access through Prisma
   - Abstracted data operations
   - Consistent data access patterns

3. **Service Layer Pattern**

   - Business logic separation
   - Reusable service functions
   - Clear separation of concerns

4. **Component-Based Architecture**
   - Reusable UI components
   - Clear component hierarchy
   - Props-based communication

## Key Technical Decisions

1. **Next.js App Router**

   - Server-side rendering capabilities
   - API route integration
   - Improved performance

2. **Prisma with MongoDB**

   - Type-safe database operations
   - Schema validation
   - Efficient querying

3. **NextAuth.js**

   - Secure authentication
   - Multiple provider support
   - Session management

4. **Chakra UI**
   - Consistent design system
   - Responsive components
   - Theme customization

## Component Relationships

1. **Tree Components**

   - TreeCanvas: Main tree rendering
   - TreeControls: Tree customization
   - TreeMessages: Message management

2. **User Components**

   - AuthForm: Authentication forms
   - UserProfile: User information
   - UserSettings: User preferences

3. **Shared Components**
   - Layout: Page structure
   - Navigation: Site navigation
   - UI Elements: Reusable UI components

## Data Flow

1. **Authentication Flow**

   - User authentication
   - Session management
   - Protected routes

2. **Tree Creation Flow**

   - Tree initialization
   - Customization
   - Message addition

3. **Message Flow**
   - Message creation
   - Real-time updates
   - Message retrieval
