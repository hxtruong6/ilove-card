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

## UI/UX Framework

### Chakra UI v3

- Using Chakra UI v3 for component library
- Theme configuration in `/styles/theme.ts`
- Custom components in `/components/common`
- Responsive design patterns
- Dark/light mode support

### Toast Notifications

- Using Sonner for toast notifications
- Import from 'sonner' package
- Available methods:
  - `toast.success(message)`
  - `toast.error(message)`
  - `toast.info(message)`
  - `toast.warning(message)`
- Example usage:

  ```typescript
  import { toast } from 'sonner';

  // Success toast
  toast.success('Operation completed successfully');

  // Error toast
  toast.error('Something went wrong');
  ```

## State Management

### React Query

- Using TanStack Query (React Query) for server state
- Query keys follow pattern: `[resource, id]`
- Example:

  ```typescript
  const { data, isLoading } = useQuery({
    queryKey: ['trees'],
    queryFn: fetchTrees,
  });
  ```

### Local State

- React's useState for component state
- Context API for global state (e.g., auth)

## API Design

### RESTful Endpoints

- Base URL: `/api`
- Authentication: JWT with refresh tokens
- Rate limiting on API routes
- Error responses follow format:

  ```typescript
  {
    error: string;
    details?: unknown;
  }
  ```

### WebSocket

- Real-time updates for messages
- Connection management in `/lib/websocket.ts`

## Database

### MongoDB with Prisma

- Schema defined in `/prisma/schema.prisma`
- Client in `/lib/prisma.ts`
- Indexes on frequently queried fields
- Relations:
  - User → Tree (one-to-many)
  - Tree → Message (one-to-many)

## Authentication

### JWT Implementation

- Access token (15 min)
- Refresh token (7 days)
- Stored in HTTP-only cookies
- Middleware for protected routes

### Password Security

- Bcrypt for hashing
- Minimum 8 characters
- Mixed case required

## Performance

### Optimization Techniques

- Server-side rendering where possible
- Image optimization with next/image
- Code splitting with dynamic imports
- Caching strategies:
  - React Query cache
  - Static page generation
  - API response caching

### Monitoring

- Error tracking with Sentry
- Performance metrics in Vercel
- Custom logging for debugging

## Testing

### Unit Tests

- Jest for testing
- React Testing Library for components
- Mock service worker for API

### E2E Tests

- Cypress for critical paths
- Custom commands for auth flow

## Deployment

### Vercel

- Automatic deployments
- Preview deployments for PRs
- Environment variables management
- Edge functions for API routes

### MongoDB Atlas

- Production cluster
- Automated backups
- Connection pooling

## Development Workflow

### Code Quality

- ESLint for linting
- Prettier for formatting
- Husky for git hooks
- Conventional commits

### Documentation

- JSDoc for functions
- README for setup
- API documentation
- Component documentation

## Security

### Best Practices

- Input validation with Zod
- XSS prevention
- CSRF protection
- Rate limiting
- Secure headers

### Environment Variables

- Stored in `.env`
- Different values for dev/prod
- Secrets in Vercel
