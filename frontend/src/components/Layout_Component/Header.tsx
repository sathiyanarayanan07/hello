// React
import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
// Animation & Library
import { Menu, X, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// Auth Context
import { useAuth } from "@/contexts/AuthContext";
// Constants
import { NAV_LINKS } from "@/Constants/Constant.tsx";
// Types
import {
  HeaderProps,
  DesktopNavLinkProps,
  MobileNavLinkProps,
  DesktopNavProps,
  MobileNavProps,
} from "@/types/menu.ts";
// Components
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/Layout_Component/UserMenu";

/* -------------------- Desktop Navlink Component -------------------- */
function DesktopNavLink({
  to,
  children,
  currentPath,
  matchPrefix = false,
}: DesktopNavLinkProps) {
  const isActive = matchPrefix
    ? currentPath.startsWith(to)
    : currentPath === to;
  return (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors hover:text-primary ${
        isActive ? "text-primary" : "text-muted-foreground"
      }`}
    >
      {children}
    </Link>
  );
}
/* -------------------- Mobile NavLink Component -------------------- */
function MobileNavLink({
  to,
  children,
  currentPath,
  onClick,
  matchPrefix = false,
}: MobileNavLinkProps) {
  const isActive = matchPrefix
    ? currentPath.startsWith(to)
    : currentPath === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block px-4 py-2 text-sm rounded-md hover:bg-accent transition-colors ${
        isActive ? "text-primary font-medium" : ""
      } `}
    >
      {children}
    </Link>
  );
}

/* -------------------- Desktop Navigation -------------------- */
function DesktopNav({ filteredNavLinks, currentPath }: DesktopNavProps) {
  return (
    <nav className="ml-6 hidden md:flex items-center space-x-4">
      {filteredNavLinks.map((link) => (
        <DesktopNavLink key={link.to} to={link.to} currentPath={currentPath}>
          {link.label}
        </DesktopNavLink>
      ))}
    </nav>
  );
}
/* -------------------- Mobile Sidebar Component (Hamburger Menu) -------------------- */
function MobileNav({ isAdmin, user }: MobileNavProps) {
  const location = useLocation();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <>
      {/* Hamburger button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="md:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Drawer overlay and panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className=" fixed inset-0 z-40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={drawerRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-background shadow-xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-bold">Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* User Info */}
              <div className="p-4 border-b flex items-center gap-3">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-6 h-6 text-gray-500" />
                )}
                <div>
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 p-4 space-y-2">
                {NAV_LINKS.map((link) => (
                  <MobileNavLink
                    key={link.to}
                    to={link.to}
                    currentPath={location.pathname}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </MobileNavLink>
                ))}
                {isAdmin && (
                  <MobileNavLink
                    to="/admin"
                    currentPath={location.pathname}
                    matchPrefix
                    onClick={() => setOpen(false)}
                  >
                    Admin
                  </MobileNavLink>
                )}
              </nav>

              {/* Logout Button */}
              <div className="p-4 border-t">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                >
                  Logout
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* -------------------- Main Header Component -------------------- */
function Header({ filteredNavLinks, isAdmin, user, currentPath }: HeaderProps) {
  return (
    <header className="border-b bg-background sticky top-0 z-20">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left Section: Logo + Desktop Navigation */}
        <div className="flex items-center">
          <img className="w-8 h-8 mr-2" src="/logo.png" alt="Logo" />
          <h1 className="text-lg md:text-xl font-bold">Thirdvision Labs</h1>
          <DesktopNav
            filteredNavLinks={filteredNavLinks}
            isAdmin={isAdmin}
            currentPath={currentPath}
          />
        </div>

        {/* Right Section: Mobile Menu + User Menu */}
        <div className="flex items-center space-x-4">
          <UserMenu />
          <MobileNav isAdmin={isAdmin} user={user} />
        </div>
      </div>
    </header>
  );
}

export default Header;
