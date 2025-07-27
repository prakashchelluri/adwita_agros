'use client';

import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { AuthContextType, User } from '@/lib/types';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  // Fix user type to include fullName property if missing
  if (context.user && !('fullName' in context.user)) {
    context.user = {
      ...context.user,
      fullName: (context.user as User).username || '',
    } as User;
  }

  return context;
};
