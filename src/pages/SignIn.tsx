
import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Lock, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn, isUserSignedUp, checkUserRegistration } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Get the path to redirect to after login (if provided)
  const from = location.state?.from || '/dashboard';

  useEffect(() => {
    const handleUserStatus = async () => {
      if (user) {
        // Check if the user is fully registered
        const isRegistered = await checkUserRegistration();
        
        if (isRegistered) {
          // If registered, proceed to the requested page
          navigate(from, { replace: true });
        } else {
          // If not registered, redirect to complete registration
          navigate('/signup', { state: { from, needsCompletion: true } });
          toast.warning("Please complete your registration to continue");
        }
      }
    };
    
    handleUserStatus();
  }, [user, navigate, from, checkUserRegistration, isUserSignedUp]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Check if the email exists in the database
      const { data: profileData } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .limit(1);
        
      if (!profileData || profileData.length === 0) {
        toast.error('Email not found. Please sign up first.');
        setIsLoading(false);
        setTimeout(() => navigate('/signup'), 1500);
        return;
      }
      
      await signIn(email, password);
      toast.success('Successfully logged in');
      
      // After signing in, check registration status before navigating
      const isRegistered = await checkUserRegistration();
      
      if (isRegistered) {
        navigate(from, { replace: true });
      } else {
        navigate('/signup', { state: { from, needsCompletion: true } });
        toast.warning("Please complete your registration to continue");
      }
    } catch (error: any) {
      console.error("Sign-in error:", error);
      
      if (error.message.includes("Invalid login")) {
        toast.error('Invalid email or password');
      } else {
        toast.error(error.message || 'Failed to sign in');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg space-y-2">
          <div className="flex justify-center mb-2">
            <Link to="/">
              <img 
                src="/placeholder.svg" 
                alt="NearFix Logo" 
                className="h-12 w-auto" 
              />
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-blue-100 text-center">
            Sign in to access your account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? 
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </span> : 
                <span className="flex items-center gap-2">
                  Sign In <LogIn className="h-4 w-4" />
                </span>
              }
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="justify-center border-t p-4">
          <div className="text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link to="/signup" className="text-blue-600 hover:underline font-medium">
              Sign Up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
