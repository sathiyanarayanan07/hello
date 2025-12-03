// User types
import { User } from "@/types/user.ts";
// Constants
import { NAV_LINKS } from "@/Constants/Constant.tsx";

// Function MainLayout from MainLayout.tsx
export interface MainLayoutProps {
  children?: React.ReactNode;
}

// Function Header from Header.tsx
export interface HeaderProps {
  filteredNavLinks: typeof NAV_LINKS; // Or you can use: NavLinkItem[]
  isAdmin: boolean;
  user: User | null; // Use proper User type instead of `any`
  currentPath: string;
}
// Function NavLink from Header.tsx
export interface DesktopNavLinkProps {
  to: string;
  children: React.ReactNode;
  currentPath: string;
  matchPrefix?: boolean;
}
// function MobileNavLink from Header.tsx
export interface MobileNavLinkProps {
  to: string;
  children: React.ReactNode;
  currentPath: string;
  onClick: () => void;
  matchPrefix?: boolean;
}
// Function DesktopNav from Header.tsx
export interface DesktopNavProps {
  filteredNavLinks: typeof NAV_LINKS; // Array of NavLinkItem
  isAdmin: boolean;
  currentPath: string;
}
// Function MobileNav from Header.tsx
export interface MobileNavProps {
  isAdmin: boolean;
  user: User | null;
}
