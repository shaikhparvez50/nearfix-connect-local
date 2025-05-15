
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './button';
import { Input } from './input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Mail, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  
  // Redirect if already logged in
  if (user) {
    navigate('/dashboard');
    return null;
  }

  const handleSignIn = async () => {
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Check if the email exists
      const { data: profileData } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .limit(1);
        
      if (!profileData || profileData.length === 0) {
        toast.error('Email not found. Please sign up first.');
        setActiveTab('signup');
        setIsLoading(false);
        return;
      }
      
      await signIn(email, password);
      toast.success('Successfully logged in');
      navigate('/dashboard');
      onClose();
    } catch (error: any) {
      if (error.message.includes("Invalid login")) {
        toast.error('Invalid email or password');
      } else {
        toast.error(error.message || 'Failed to sign in');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Check if user already exists
      const { data: existingUsers } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .limit(1);
      
      if (existingUsers && existingUsers.length > 0) {
        toast.error("This email is already registered. Please sign in instead.");
        setActiveTab('login');
        setIsLoading(false);
        return;
      }
      
      // Direct the user to the full sign up page for a better experience
      navigate('/signup', { state: { email, password } });
      onClose();
      return;
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to NearFix</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="login" value={activeTab} onValueChange={(val) => {
          setActiveTab(val);
          resetForm();
        }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-4">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
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
                  />
                </div>
                <Button
                  onClick={handleSignIn}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="signup" className="mt-4">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleSignUp}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Continue to Sign Up' : 'Continue to Sign Up'}
                </Button>
                <div className="text-center text-xs text-gray-500 mt-2">
                  For a complete profile, you'll be redirected to our sign-up page
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
