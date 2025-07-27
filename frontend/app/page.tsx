'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const { user, isLoading, isAuthenticated, isHydrated, redirectToRoleDashboard } = useAuth();

  useEffect(() => {
    // Only proceed after hydration is complete to avoid SSR mismatch
    if (!isHydrated) {
      return;
    }

    // Wait for loading to complete
    if (isLoading) {
      return;
    }

    if (isAuthenticated && user) {
      console.log('User authenticated, redirecting to role dashboard:', user.role);
      redirectToRoleDashboard(user.role);
    } else {
      console.log('User not authenticated, redirecting to login');
      // Use window.location.href for consistent redirect behavior
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }, [user, isLoading, isAuthenticated, isHydrated, redirectToRoleDashboard]);

  // Show loading state during hydration and authentication check
  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
          <p className="mt-2 text-sm text-gray-500">
            {!isHydrated ? 'Initializing application...' : 'Checking authentication...'}
          </p>
        </div>
      </div>
    );
  }

  // Show redirecting state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">Redirecting...</p>
        <p className="mt-2 text-sm text-gray-500">
          {isAuthenticated && user 
            ? `Taking you to your ${user.role.toLowerCase()} dashboard...`
            : 'Taking you to the login page...'
          }
        </p>
      </div>
    </div>
  );
}