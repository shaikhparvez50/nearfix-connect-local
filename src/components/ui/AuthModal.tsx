
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './button';
import { Input } from './input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { supabase } from '@/integrations/supabase/client';
import { sendOTP, verifyOTP } from '@/utils/otp';
import { Mail, Lock } from 'lucide-react';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Redirect if already logged in
  if (user) {
    navigate('/dashboard');
    return null;
  }

  const handleSendOtp = async () => {
    try {
      setIsLoading(true);
      
      await sendOTP(email);
      setIsOtpSent(true);
      toast.success('OTP sent to your email. Please check your inbox.');
    } catch (error) {
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setIsLoading(true);
      
      const isValid = await verifyOTP(email, otp);
      
      if (!isValid) {
        throw new Error('Invalid OTP or OTP expired');
      }
      
      // Sign in with Supabase using OTP verification result
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: activeTab === 'signup',
        },
      });

      if (error) throw error;
      
      toast.success('Successfully logged in');
      navigate('/dashboard');
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) throw error;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const resetForm = () => {
    setEmail('');
    setOtp('');
    setIsOtpSent(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to NearFix</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" onClick={resetForm}>Login</TabsTrigger>
            <TabsTrigger value="signup" onClick={resetForm}>Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-4">
            <div className="grid gap-4 py-4">
              {!isOtpSent ? (
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
                  <Button
                    onClick={handleSendOtp}
                    disabled={isLoading || !email}
                    className="w-full"
                  >
                    {isLoading ? 'Sending...' : 'Send OTP'}
                  </Button>
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-4 flex-shrink text-gray-500 text-sm">or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSignInWithGoogle}
                    className="w-full"
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                      <path d="M1 1h22v22H1z" fill="none" />
                    </svg>
                    Sign in with Google
                  </Button>
                </div>
              ) : (
                <div className="grid gap-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter OTP"
                      className="pl-10"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleVerifyOtp}
                    disabled={isLoading || !otp}
                    className="w-full"
                  >
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </Button>
                  <Button
                    variant="link"
                    onClick={() => setIsOtpSent(false)}
                    className="w-full mt-2"
                  >
                    Back to email
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="signup" className="mt-4">
            <div className="grid gap-4 py-4">
              {!isOtpSent ? (
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
                  <Button
                    onClick={handleSendOtp}
                    disabled={isLoading || !email}
                    className="w-full"
                  >
                    {isLoading ? 'Sending...' : 'Send OTP'}
                  </Button>
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-4 flex-shrink text-gray-500 text-sm">or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSignInWithGoogle}
                    className="w-full"
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                      <path d="M1 1h22v22H1z" fill="none" />
                    </svg>
                    Sign up with Google
                  </Button>
                </div>
              ) : (
                <div className="grid gap-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter OTP"
                      className="pl-10"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleVerifyOtp}
                    disabled={isLoading || !otp}
                    className="w-full"
                  >
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </Button>
                  <Button
                    variant="link"
                    onClick={() => setIsOtpSent(false)}
                    className="w-full mt-2"
                  >
                    Back to email
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
