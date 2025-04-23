
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, LogIn, Mail } from "lucide-react";
import { sendOTP, verifyOTP } from "@/utils/otp";

const SignIn = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await sendOTP(email);
      toast({
        title: "OTP Sent!",
        description: "A verification code has been sent to your email.",
      });
      setStep(2);
    } catch (err: any) {
      toast({
        title: "Failed to send OTP",
        description: err.message,
        variant: "destructive",
      });
    }
  };
  
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate OTP
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }
    
    // Actually verify the OTP against DB
    const isValid = await verifyOTP(email, otp);
    if (!isValid) {
      toast({
        title: "OTP Incorrect or Expired",
        description: "Please enter a correct and unexpired code.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Login successful!",
      description: "Welcome back to NearFix.",
    });
    
    navigate("/dashboard");
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-md">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <Link to="/">
                <img 
                  src="/placeholder.svg" 
                  alt="NearFix Logo" 
                  className="h-10 w-auto" 
                />
              </Link>
            </div>
            <CardTitle className="text-2xl font-heading">
              Welcome Back to NearFix
            </CardTitle>
            <CardDescription>
              Connect to trusted people near you
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {step === 1 ? (
              <form onSubmit={handleSendOTP} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <Button type="submit" className="w-full bg-nearfix-600 hover:bg-nearfix-700">
                  Send OTP <LogIn className="ml-2 h-4 w-4" />
                </Button>
                
                <div className="text-center text-sm">
                  <span className="text-gray-600">New here? </span>
                  <Link to="/signup" className="text-nearfix-600 hover:underline">
                    Sign Up
                  </Link>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter Verification Code</Label>
                  <p className="text-sm text-gray-500 mb-4">
                    We've sent a 6-digit code to {email}
                  </p>
                  
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Button type="submit" className="w-full bg-nearfix-600 hover:bg-nearfix-700">
                    Verify & Continue
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setStep(1)}
                  >
                    Change Email
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="link" 
                    className="w-full text-nearfix-600"
                    onClick={handleSendOTP}
                  >
                    Resend OTP
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
