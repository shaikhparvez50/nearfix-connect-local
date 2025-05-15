
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
