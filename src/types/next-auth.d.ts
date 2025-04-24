import { AdditionalUserFields, UserSession } from './user.interfact';

/**
 * Extends NextAuth's User type to include custom fields required
 * for the application's user profile features.
 */
declare module 'next-auth' {
  interface Session {
    user: UserSession;
  }
  interface User extends AdditionalUserFields {}
}
