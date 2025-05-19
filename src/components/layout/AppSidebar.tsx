
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { 
  Search, 
  MapPin,
  Plus, 
  UserPlus, 
  LayoutDashboard, 
  Compass, 
  DatabaseBackup,
  Smartphone,
  Store,
  Handshake
} from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Check if a path is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b pb-2">
        <div className="flex items-center justify-between px-4 pt-2">
          <div className="flex items-center">
            <span className="font-bold text-lg text-nearfix-600">NearFix</span>
          </div>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive('/')}
                  tooltip="Home"
                >
                  <button onClick={() => navigate('/')}>
                    <Compass />
                    <span>Home</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive('/search')}
                  tooltip="Search"
                >
                  <button onClick={() => navigate('/search')}>
                    <Search />
                    <span>Find Services</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive('/services')}
                  tooltip="Services"
                >
                  <button onClick={() => navigate('/services')}>
                    <MapPin />
                    <span>Services</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {user && (
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive('/dashboard')}
                    tooltip="Dashboard"
                  >
                    <button onClick={() => navigate('/dashboard')}>
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive('/post-job')}
                  tooltip="Post a Job"
                >
                  <button onClick={() => navigate('/post-job')}>
                    <Plus />
                    <span>Post a Job</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive('/become-seller')}
                  tooltip="Become a Seller"
                >
                  <button onClick={() => navigate('/become-seller')}>
                    <UserPlus />
                    <span>Become a Seller</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive('/create-shop')}
                  tooltip="Offer Your Service"
                >
                  <button onClick={() => navigate('/become-seller')}>
                    <Store />
                    <span>Offer Your Service</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Information</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive('/how-it-works')}
                  tooltip="How It Works"
                >
                  <button onClick={() => navigate('/how-it-works')}>
                    <DatabaseBackup />
                    <span>How It Works</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive('/about')}
                  tooltip="About Us"
                >
                  <button onClick={() => navigate('/about')}>
                    <Smartphone />
                    <span>About Us</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t">
        <div className="p-4 flex flex-col gap-2">
          {!user ? (
            <>
              <Button 
                className="w-full justify-start" 
                onClick={() => navigate('/signin')}
                variant="outline"
              >
                Sign In
              </Button>
              <Button 
                className="w-full justify-start bg-nearfix-600" 
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              My Account
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
