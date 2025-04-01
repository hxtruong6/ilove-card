import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface UseAuthenticationOptions {
  redirectTo?: string;
  redirectIfFound?: boolean;
}

export function useAuthentication(options: UseAuthenticationOptions = {}) {
  const { redirectTo = '/login', redirectIfFound = false } = options;
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (
        // If redirectTo is set, redirect if the user was not found.
        (redirectTo && !redirectIfFound && !isAuthenticated) ||
        // If redirectIfFound is also set, redirect if the user was found
        (redirectIfFound && isAuthenticated)
      ) {
        router.push(redirectTo);
      }
    }
  }, [isLoading, redirectIfFound, redirectTo, isAuthenticated, router]);

  return { user, isLoading, isAuthenticated };
}

export function useRequireAuth(redirectTo = '/login') {
  return useAuthentication({ redirectTo });
}

export function useRequireGuest(redirectTo = '/dashboard') {
  return useAuthentication({ redirectTo, redirectIfFound: true });
}
