
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { User, Mail, Lock, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'buyer' | 'seller';
}

interface LocationState {
  from?: string;
  needsCompletion?: boolean;
}

const SignUp = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "buyer"
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, checkUserRegistration } = useAuth();
  const state = location.state as LocationState;
  
  // Check if the user was redirected here to complete registration
  const needsCompletion = state?.needsCompletion;
  
  // If user is already logged in and redirected to complete registration
  useEffect(() => {
    if (user && needsCompletion) {
      toast.info("Please complete your registration to continue");
      // Pre-fill email if user already exists
      setFormData(prev => ({
        ...prev,
        email: user.email || "",
      }));
    } else if (user && !needsCompletion) {
      // Redirect to dashboard if user is already logged in and registration is complete
      navigate("/dashboard");
    }
  }, [user, needsCompletion, navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleRoleChange = (value: 'buyer' | 'seller') => {
    setFormData(prev => ({
      ...prev,
      role: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }
    
    try {
      // If user exists but needs to complete registration
      if (user && needsCompletion) {
        // Insert or update the profile - use upsert to avoid RLS issues
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            name: formData.name,
            email: user.email || formData.email,
            role: formData.role
          }, {
            onConflict: 'id'
          });
          
        if (profileError) {
          console.error("Profile error:", profileError);
          throw profileError;
        }
        
        // Re-check user registration to update context
        await checkUserRegistration();
        
        toast.success(`Profile completed successfully!`);
        // Redirect to the original page the user was trying to access
        navigate(state?.from || "/dashboard");
        return;
      }
      
      // Regular sign up flow for new users
      // First, check if user already exists
      const { data: existingUsers } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', formData.email)
        .limit(1);
      
      if (existingUsers && existingUsers.length > 0) {
        toast.error("This email is already registered. Please sign in instead.");
        setIsLoading(false);
        setTimeout(() => navigate('/signin'), 2000);
        return;
      }
      
      // 1. Register the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: formData.role
          }
        }
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          toast.error("This email is already registered. Please sign in instead.");
          setTimeout(() => navigate('/signin'), 2000);
        } else {
          throw authError;
        }
        return;
      }
      
      // 2. Create a profile record with additional information
      if (authData.user) {
        // Use upsert instead of insert to handle potential RLS issues
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            name: formData.name,
            email: formData.email,
            role: formData.role
          }, {
            onConflict: 'id'
          });
          
        if (profileError) {
          console.error("Profile creation error:", profileError);
          throw profileError;
        }
      }
      
      toast.success(`Account created successfully! You can now sign in as a ${formData.role}.`);
      navigate("/signin");
    } catch (err: any) {
      console.error("Error during signup:", err);
      
      // Handle the case where the user is already registered
      if (err.message && err.message.includes("already registered")) {
        toast.error("This email is already registered. Please sign in instead.");
        setTimeout(() => navigate('/signin'), 2000);
      } else {
        toast.error(err.message || "Registration failed");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="border-0 shadow-md rounded-lg bg-white p-6">
          <div className="text-center space-y-2 mb-6">
            <div className="flex justify-center mb-2">
              <Link to="/">
                <img 
                  src="/placeholder.svg" 
                  alt="NearFix Logo" 
                  className="h-10 w-auto" 
                />
              </Link>
            </div>
            <h2 className="text-2xl font-bold">Join NearFix</h2>
            <p className="text-gray-600">
              Create an account to get started
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="relative">
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  className="pl-10"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="pl-10"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  className="pl-10"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className="pl-10"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">I want to join NearFix as:</label>
              <div className="pt-2">
                <div className="flex items-center space-x-2 mb-3">
                  <input
                    type="radio"
                    id="signup-buyer"
                    name="role"
                    value="buyer"
                    checked={formData.role === "buyer"}
                    onChange={(e) => handleRoleChange(e.target.value as 'buyer' | 'seller')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="signup-buyer" className="text-sm text-gray-700">Service Buyer (hire professionals)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="signup-seller"
                    name="role"
                    value="seller"
                    checked={formData.role === "seller"}
                    onChange={(e) => handleRoleChange(e.target.value as 'buyer' | 'seller')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="signup-seller" className="text-sm text-gray-700">Service Provider (offer services)</label>
                </div>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'} <UserPlus className="ml-2 h-4 w-4" />
            </Button>
            
            <div className="text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link to="/signin" className="text-blue-600 hover:underline">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
