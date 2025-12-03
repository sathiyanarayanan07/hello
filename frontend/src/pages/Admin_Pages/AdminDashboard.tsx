// React and Router
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// UI Components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Icons
import {
  Users,
  Settings,
  Activity,
  Clock,
  AlertCircle,
  Home,
  Calendar,
} from "lucide-react";

// Feature Components
import { UserManagement } from "./components/UserManagement";
import { ActivityLog } from "./components/ActivityLog";
import { AttendancePage } from "@/pages/Admin_Pages/AttendancePage";
import { AdminHolidaysPage } from "./AdminHolidaysPage";
import AdminRequests from "./Request_Components/AdminRequests";

// Types
import type { RemoteRequest } from "@/types/remoteRequest";

/* ------------------------  TAB DEFINITIONS  ---------------------------- */
export interface DashboardTab {
  id: string;
  label: string;
  path: string;
  description: string;
  icon: React.ElementType;
}

const DASHBOARD_TABS: DashboardTab[] = [
  {
    id: "users",
    label: "Users",
    path: "/admin",
    description: "Manage user accounts and permissions",
    icon: Users,
  },
  {
    id: "attendance",
    label: "Attendance",
    path: "/admin/attendance",
    description: "View and manage attendance records",
    icon: Clock,
  },
  {
    id: "activity",
    label: "Activity Log",
    path: "/admin/activity-logs",
    description: "Monitor system activities",
    icon: Activity,
  },
  {
    id: "requests",
    label: "Requests",
    path: "/admin/requests",
    description: "Manage pending requests",
    icon: AlertCircle,
  },
  {
    id: "holidays",
    label: "Holidays",
    path: "/admin/holidays",
    description: "Manage holidays",
    icon: Calendar,
  },
];

/* -----------------  MAIN DASHBOARD COMPONENT  --------------------- */
export const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<string>("users");
  const [requests] = useState<RemoteRequest[]>([]);

  const newRequestsCount = useMemo(
    () => requests.filter((r) => r.status === "pending").length,
    [requests]
  );

  /* ---------------------------- Sync tab with URL ---------------------------- */
  useEffect(() => {
    const matchedTab = DASHBOARD_TABS.find(
      (tab) =>
        location.pathname === tab.path ||
        (location.pathname.startsWith(tab.path) && tab.path !== "/admin")
    );

    if (matchedTab) {
      setActiveTab(matchedTab.id);
    } else {
      setActiveTab("users");
      navigate("/admin", { replace: true });
    }
  }, [location.pathname, navigate]);

  /* --------------------------- Tab Content Renderer -------------------------- */
  const renderContent = useMemo(() => {
    switch (activeTab) {
      case "attendance":
        return <AttendancePage />;
      case "activity":
        return <ActivityLog />;
      case "requests":
        return <AdminRequests />;
      case "holidays":
        return <AdminHolidaysPage />;
      case "users":
      default:
        return <UserManagement />;
    }
  }, [activeTab]);

  /* ------------------------------- Tab Handler ------------------------------- */
  const handleTabChange = (tabId: string) => {
    const tab = DASHBOARD_TABS.find((t) => t.id === tabId);
    if (tab) {
      setActiveTab(tabId);
      navigate(tab.path);
    }
  };

  /* --------------------   RENDER   ---------------------- */
  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground">
            Welcome back! Manage your team and system settings from one place.
          </p>
        </div>

        {/* Main Content */}
        <Card className="overflow-hidden shadow-sm">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            {/* Tabs Header */}
            <CardHeader className="border-b">
              <CardTitle className="text-xl">
                {DASHBOARD_TABS.find((tab) => tab.id === activeTab)?.label}{" "}
                Management
              </CardTitle>
              <CardDescription>
                {
                  DASHBOARD_TABS.find((tab) => tab.id === activeTab)
                    ?.description
                }
              </CardDescription>
            </CardHeader>

            {/* Tabs Navigation */}
            <TabsList className="h-auto flex flex-wrap justify-start px-6 bg-transparent">
              {DASHBOARD_TABS.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="relative py-4 px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  <div className="flex items-center gap-2">
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                    {tab.id === "requests" && newRequestsCount > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {newRequestsCount} new
                      </Badge>
                    )}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Tab Content */}
            <CardContent className="p-6">{renderContent}</CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
