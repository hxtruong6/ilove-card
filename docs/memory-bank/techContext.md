# iCard Tech Context

## Technology Stack

1. **Frontend**

   - Next.js 14
   - TypeScript
   - Chakra UI
   - React Query
   - Zustand

2. **Backend**

   - Node.js
   - Express
   - Next.js API Routes
   - Prisma
   - MongoDB

3. **Authentication**

   - NextAuth.js
   - JWT
   - OAuth providers

4. **Development Tools**
   - ESLint
   - Prettier
   - TypeScript
   - Jest
   - React Testing Library

## Development Setup

1. **Environment Requirements**

   - Node.js 18+
   - npm 9+
   - MongoDB 6+
   - Git

2. **Development Environment**

   - VS Code
   - ESLint extension
   - Prettier extension
   - TypeScript extension

3. **Dependencies**
   - See package.json for detailed dependencies
   - Regular updates required
   - Security patches monitored

## Technical Constraints

1. **Performance**

   - Server-side rendering for initial load
   - Client-side navigation for subsequent pages
   - Optimized image loading
   - Efficient database queries

2. **Security**

   - HTTPS required
   - Secure authentication
   - Data encryption
   - Input validation

3. **Scalability**
   - Horizontal scaling support
   - Database optimization
   - Caching strategies
   - Load balancing

## API Documentation

1. **Authentication API**

   - POST /api/auth/signin
   - POST /api/auth/signup
   - GET /api/auth/session

2. **Tree API**

   - GET /api/trees
   - POST /api/trees
   - PUT /api/trees/:id
   - DELETE /api/trees/:id

3. **Message API**
   - GET /api/messages
   - POST /api/messages
   - PUT /api/messages/:id
   - DELETE /api/messages/:id

## Testing Strategy

1. **Unit Tests**

   - Component tests
   - Utility function tests
   - API handler tests

2. **Integration Tests**

   - API integration tests
   - Database integration tests
   - Authentication flow tests

3. **Performance Tests**
   - Load testing
   - Response time monitoring
   - Database query optimization
