// React
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
// Types
import { UserRole } from "@/types/user";
import { MainLayoutProps } from "@/types/menu.ts";
// Auth Context
import { useAuth } from "@/contexts/AuthContext";
// Constants
import { NAV_LINKS, ADMIN_NAV_LINKS } from "@/Constants/Constant.tsx";
// Components
import Header from "@/components/Layout_Component/Header.tsx";
import Footer from "@/components/Layout_Component/Footer.js";

/* -------------------- Main Layout -------------------- */
export function MainLayout({ children }: MainLayoutProps) {
  const { user } = useAuth();
  const location = useLocation();
  // Admin Role
  const isAdmin = user?.role === UserRole.ADMIN;
  // Filter navigation based on user role
  const filteredNavLinks = isAdmin ? ADMIN_NAV_LINKS : NAV_LINKS;

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user?.isAuthenticated) {
      window.location.href = "/login";
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* -------------------- Header Section -------------------- */}
      <Header
        filteredNavLinks={filteredNavLinks}
        isAdmin={isAdmin}
        user={user}
        currentPath={location.pathname}
      />

      {/* -------------------- Main Content Section -------------------- */}
      <main className="flex-1 p-4 md:p-6">{children || <Outlet />}</main>

      {/* -------------------- Footer Section -------------------- */}
      <Footer />
    </div>
  );
}
