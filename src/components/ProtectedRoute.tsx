
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isUserSignedUp } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const checkUserRegistration = async () => {
      if (!user) {
        setIsChecking(false);
        return;
      }

      try {
        // Check if the user has a profile in the database
        const { data, error } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('id', user.id)
          .single();

        if (error || !data) {
          console.error("Error checking user registration:", error);
          setIsRegistered(false);
        } else {
          setIsRegistered(true);
        }
      } catch (err) {
        console.error("Error during registration check:", err);
        setIsRegistered(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkUserRegistration();
  }, [user]);

  // If still checking, show loading indicator
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Verifying account...</span>
      </div>
    );
  }

  // If no user is logged in, redirect to signin
  if (!user) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  // If user is logged in but not properly registered in database
  if (!isRegistered && !isUserSignedUp) {
    return <Navigate to="/signup" state={{ from: location.pathname, needsCompletion: true }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
