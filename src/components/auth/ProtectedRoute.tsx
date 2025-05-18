
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ allowUnauthenticated = false }) => {
  const { user, isLoading } = useAuth();

  // If explicitly allowing unauthenticated users, render the children
  if (allowUnauthenticated) {
    return <Outlet />;
  }

  // If still checking authentication status, render nothing or a loading indicator
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // If user is not authenticated and route is protected, redirect to sign in
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // User is authenticated, render the children
  return <Outlet />;
};

export default ProtectedRoute;
