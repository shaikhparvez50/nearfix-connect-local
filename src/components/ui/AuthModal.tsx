import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './button';
import { Input } from './input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { supabase } from '@/integrations/supabase/client';

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

  const handleSendOtp = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;
      
      setIsOtpSent(true);
      toast.success('OTP sent to your email');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
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
              <div className="grid gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isOtpSent}
                />
                {isOtpSent && (
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                )}
              </div>
              <Button
                onClick={isOtpSent ? handleVerifyOtp : handleSendOtp}
                disabled={isLoading || !email}
              >
                {isLoading ? 'Loading...' : isOtpSent ? 'Verify OTP' : 'Send OTP'}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="signup" className="mt-4">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isOtpSent}
                />
                {isOtpSent && (
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                )}
              </div>
              <Button
                onClick={isOtpSent ? handleVerifyOtp : handleSendOtp}
                disabled={isLoading || !email}
              >
                {isLoading ? 'Loading...' : isOtpSent ? 'Verify OTP' : 'Send OTP'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 