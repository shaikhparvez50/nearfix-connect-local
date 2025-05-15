
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
  isUserSignedUp: boolean;
  userRole: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [isUserSignedUp, setIsUserSignedUp] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check if user has role info
          const { data: profileData } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          if (profileData?.role) {
            setUserRole(profileData.role);
            setIsUserSignedUp(true);
          } else {
            setIsUserSignedUp(false);
          }
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Check if user has role info
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (profileData?.role) {
          setUserRole(profileData.role);
          setIsUserSignedUp(true);
        } else {
          setIsUserSignedUp(false);
        }
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
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (error) {
      throw error;
    }
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
      // Insert job details into Supabase (using job_postings table)
      const { error } = await supabase.from('job_postings').insert({
        title: formData.title,
        category: formData.serviceType, // Map service_type to category
        description: formData.description,
        location: `${formData.address}, ${formData.city}, ${formData.pincode}`,
        budget: formData.budgetRange ? parseFloat(formData.budgetRange) : null,
        Phone_Number: formData.phone ? parseInt(formData.phone) : null,
        email: formData.email,
        user_id: user?.id || ''
      });

      if (error) {
        throw error;
      }

      // Return success response
      return { success: true };
    } catch (error) {
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
      isUserSignedUp,
      userRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
