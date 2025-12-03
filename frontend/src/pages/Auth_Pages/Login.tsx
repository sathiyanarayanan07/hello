// React and library imports
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// Contexts & Hooks
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
// Types
import { UserRole } from "@/types/user";
import { LoginCredentials, LocationState } from "@/types/auth";
// Components
import { LoginForm } from "@/components/Auth_Component/LoginForm";
// Images
import { LoadingGif } from "@/components/ui/LoadingGif";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const { login, user, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const locationState = location.state as LocationState | undefined;
  const loading = isLoading || authLoading;
  const redirectPath = locationState?.from?.pathname ?? "/dashboard";

  // Redirect if already authenticated
  useEffect(() => {
    if (
      user?.isAuthenticated &&
      !isLoading &&
      location.pathname !== redirectPath
    ) {
      navigate(redirectPath, { replace: true });
    }
  }, [user, isLoading, location.pathname, navigate, redirectPath]);

  // Show session expired toast
  useEffect(() => {
    if (locationState?.error) {
      toast({
        title: "Session Expired",
        description: locationState.error,
        variant: "destructive",
      });
      navigate(location.pathname, { replace: true }); // clear state
    }
  }, [locationState, toast, navigate, location.pathname]);

  const handleLogin = async (credentials: LoginCredentials) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const success = await login(credentials);

      if (success) {
        // Role-based redirect
        let targetPath = redirectPath;

        if (user?.role === UserRole.ADMIN) {
          targetPath = "/admin"; // redirect admin/super admin
        }

        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate(redirectPath, { replace: true });
      } else {
        toast({
          title: "Login failed",
          description: "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      let errorMessage = "Invalid credentials";
      if (error instanceof Error) errorMessage = error.message;
      else if (typeof error === "string") errorMessage = error;

      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/30">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-foreground mb-8">
          Thirdvizion Labs
        </h1>

        {loading ? (
          <div className="min-h-screen flex items-center justify-center">
            <LoadingGif text="Authenticating..." />
          </div>
        ) : (
          <LoginForm onLogin={handleLogin} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}
