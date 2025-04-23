import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapPin, Mail, User, Upload, UserPlus } from "lucide-react";
import { sendOTP, verifyOTP } from "@/utils/otp";

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    otp: "",
    role: "buyer", // Default role
    address: "",
    city: "",
    pincode: "",
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value,
    });
  };
  
  const handleOtpChange = (value: string) => {
    setFormData({
      ...formData,
      otp: value,
    });
  };
  
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      await sendOTP(formData.email);
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
  
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.otp || formData.otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    const isValid = await verifyOTP(formData.email, formData.otp);
    if (!isValid) {
      toast({
        title: "OTP Incorrect or Expired",
        description: "Please enter a correct and unexpired code.",
        variant: "destructive",
      });
      return;
    }

    setStep(3);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would submit the form data to a backend service
    toast({
      title: "Account created successfully!",
      description: "Welcome to NearFix. You can now use the platform.",
    });
    
    // Redirect based on role
    if (formData.role === "seller") {
      navigate("/become-seller");
    } else {
      navigate("/dashboard");
    }
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
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
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
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
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-nearfix-600 hover:bg-nearfix-700">
              Send OTP
            </Button>
            
            <div className="text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link to="/signin" className="text-nearfix-600 hover:underline">
                Sign In
              </Link>
            </div>
          </form>
        );
      
      case 2:
        return (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp">Enter Verification Code</Label>
              <p className="text-sm text-gray-500 mb-4">
                We've sent a 6-digit code to {formData.email}
              </p>
              
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={formData.otp} onChange={handleOtpChange}>
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
                onClick={(e) => {
                  e.preventDefault();
                  handleSendOTP(e);
                }}
              >
                Resend OTP
              </Button>
            </div>
          </form>
        );
      
      case 3:
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label>I want to join as</Label>
              <RadioGroup
                value={formData.role}
                onValueChange={handleRoleChange}
                className="grid grid-cols-3 gap-4"
              >
                <div>
                  <RadioGroupItem
                    value="buyer"
                    id="buyer"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="buyer"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <User className="mb-2 h-6 w-6" />
                    Buyer
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem
                    value="seller"
                    id="seller"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="seller"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <UserPlus className="mb-2 h-6 w-6" />
                    Seller
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem
                    value="both"
                    id="both"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="both"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="flex justify-center mb-2">
                      <User className="h-6 w-6 mr-1" />
                      <UserPlus className="h-6 w-6 ml-1" />
                    </div>
                    Both
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label>Location</Label>
              <div className="relative">
                <Input
                  id="address"
                  name="address"
                  placeholder="Address"
                  className="pl-10 mb-2"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Input
                  id="city"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  id="pincode"
                  name="pincode"
                  placeholder="PIN Code"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="flex items-center mt-2">
                <Button type="button" variant="ghost" className="text-nearfix-600 text-xs px-2 py-1 h-auto">
                  <MapPin className="h-3 w-3 mr-1" /> Detect my location
                </Button>
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-nearfix-600 hover:bg-nearfix-700">
              Create Account
            </Button>
          </form>
        );
      
      default:
        return null;
    }
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
            <CardTitle className="text-2xl font-heading">Join NearFix</CardTitle>
            <CardDescription>
              {step === 1 && "Create an account to get started"}
              {step === 2 && "Verify your email"}
              {step === 3 && "Tell us more about yourself"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
