'use client';

import { useAuth } from '@/contexts/AuthContext';

import { AuthenticatedNavbar } from './AuthenticatedNavbar';
import { PublicNavbar } from './PublicNavbar';

export function Navbar() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return isAuthenticated ? <AuthenticatedNavbar /> : <PublicNavbar />;
}
