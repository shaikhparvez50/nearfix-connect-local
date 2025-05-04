import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function useAuthCheck() {
  const { user, isUserSignedUp } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const requireAuth = (callback: () => void) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    callback();
  };

  const isAuthenticated = !!user;
  const hasCompletedProfile = isUserSignedUp;

  return {
    showAuthModal,
    setShowAuthModal,
    requireAuth,
    isAuthenticated,
    hasCompletedProfile,
    user,
  };
} 