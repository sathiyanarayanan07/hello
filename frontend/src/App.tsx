import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// UI Components
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RouteTransitionLoader } from "@/components/ui/RouteTransitionLoader";

// Contexts
import { AuthProvider } from "@/contexts/AuthContext";

// Layout
import { MainLayout } from "@/components/Layout_Component/MainLayout";
import { ProtectedRoute } from "@/components/Auth_Component/ProtectedRoute";

// Types
import { UserRole } from "@/types/user";

// Auth Pages
import Login from "@/pages/Auth_Pages/Login.tsx";

// Main Pages
import Dashboard from "@/pages/main_pages/Dashboard";
import Calendar from "@/pages/main_pages/Calender_Page/Calendar";
import Requests from "@/pages/main_pages/Request_Page/RequestPage";
import Profile from "@/pages/main_pages/Profile.js";

// Event pages
import Events from "@/pages/main_pages/Event_Page/EventPage";
import EventDetails from "@/pages/main_pages/Event_Page/EventDetails";
import CreateEvent from "@/pages/main_pages/Event_Page/CreateEvent";
import EventHistory from "@/pages/main_pages/Event_Page/EventHistory";
import EditEvent from "@/pages/main_pages/Event_Page/Event_Admin/EditEvent";

// Task pages
import Tasks from "@/pages/main_pages/Task_Page/Tasks";
import TaskDetailPage from "@/pages/main_pages/Task_Page/TaskDetailPage.tsx";

// Admin Pages
import { AdminDashboard } from "@/pages/Admin_Pages/AdminDashboard";
import { AttendanceRecordsPage } from "@/pages/Admin_Pages/AttendanceRecordsPage";
import AdminLeaveRequestsPage from "@/pages/Admin_Pages/Request_Components/AdminLeaveRequest";

// import { AttendancePage } from "@/pages/admin/AttendancePage";
// import { ActivityLog } from "./pages/admin/components";

// Other
import NotFound from "@/pages/404_Page/NotFound.tsx";
import { ProjectManagement } from "./pages/main_pages/Project_Page/ProjectPage";
import { ProjectDetail } from "./pages/main_pages/Project_Page/ProjectDetail";

const queryClient = new QueryClient();

const App = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <RouteTransitionLoader key="route-loader" />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Login />} />


              {/* MainLayout Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  {/* Normal user accessible routes */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/tasks/:taskId" element={<TaskDetailPage />} />
                  <Route path="/requests" element={<Requests />} />
                  <Route path="/projects" element={<ProjectManagement />} />
                  <Route path="/projects/:id" element={<ProjectDetail />} />
                  <Route path="/profile" element={<Profile />} />
                  

                  {/* Event routes */}
                  <Route path="/events" element={<Events />} />
                  <Route path="/events/new" element={<CreateEvent />} />
                  <Route path="/events/:id" element={<EventDetails />} />
                  <Route path="/events/history" element={<EventHistory />} />
                  <Route path="/events/edit/:id" element={<EditEvent />} />

                  {/* Admin-only routes inside MainLayout */}
                  <Route
                    path="/admin/attendance/records"
                    element={
                      <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                        <AttendanceRecordsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/leave-requests"
                    element={
                      <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                        <AdminLeaveRequestsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/*"
                    element={
                      <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                </Route>
              </Route>

              {/* Fallback Route */}
              <Route
                path="*"
                element={
                  <div className="flex items-center justify-center min-h-screen">
                    <NotFound />
                  </div>
                }
              />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
