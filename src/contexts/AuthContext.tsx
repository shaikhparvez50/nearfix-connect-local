
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Coordinates = {
  latitude: number;
  longitude: number;
  address?: string;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  userLocation: Coordinates | null;
  setUserLocation: (location: Coordinates | null) => void;
  requestLocationPermission: () => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata: { name: string; role?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  postJob: (formData: any) => Promise<{ success: boolean, error?: string }>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        // If user is logged in, redirect to dashboard
        if (session?.user && window.location.pathname === '/') {
          navigate('/dashboard');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      // If user is logged in and on the homepage, redirect to dashboard
      if (session?.user && window.location.pathname === '/') {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const requestLocationPermission = async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return false;
    }
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      const { latitude, longitude } = position.coords;
      
      // Get address from coordinates using reverse geocoding
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=pk.eyJ1IjoibG92YWJsZS1zYW1wbGUiLCJhIjoiY2x0Z3J3eHN0MDJ1aDJrcGR5ZXYwcHl1dyJ9.ZWFiJXJZfnFxXcUOgDsW-g`
        );
        const data = await response.json();
        const address = data.features?.[0]?.place_name || "Unknown location";
        
        // Store location in Supabase if user is logged in
        if (user?.id) {
          const { error } = await supabase
            .from('geo_locations')
            .upsert({
              user_id: user.id,
              latitude,
              longitude,
              address
            });

          if (error) throw error;
        }
        
        setUserLocation({ latitude, longitude, address });
        toast.success("Location detected successfully");
        return true;
      } catch (error) {
        // If geocoding fails, still set coordinates but without address
        setUserLocation({ latitude, longitude });
        toast.success("Location coordinates detected");
        return true;
      }
    } catch (error) {
      if ((error as GeolocationPositionError).code === 1) {
        toast.error("Location permission denied");
      } else {
        toast.error("Unable to get location");
      }
      return false;
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, metadata: { name: string; role?: string }) => {
    const redirectUrl = `${window.location.origin}/dashboard`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      throw error;
    }

    // If user was created successfully, they'll be auto-logged in
    // The onAuthStateChange listener will handle the redirect
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    navigate('/signin');
  };

  const postJob = async (formData: any) => {
    try {
      // Insert job details into Supabase
      const { error } = await supabase.from('job_postings').insert([
        {
          user_id: user?.id,
          title: formData.title,
          category: formData.serviceType,
          description: formData.description,
          location: `${formData.city}, ${formData.address}`,
          budget: formData.budgetRange,
          email: formData.email,
          Phone_Number: formData.phone,
        },
      ]);

      if (error) {
        throw error;
      }

      // Return success response
      return { success: true };
    } catch (error: any) {
      console.error("Error posting job:", error);
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{
      session,
      user,
      userLocation,
      setUserLocation,
      requestLocationPermission,
      signIn,
      signUp,
      signOut,
      postJob,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
