// UI Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Feature Components
import AdminRemoteRequest from "@/pages/Admin_Pages/Request_Components/AdminRemoteRequest.tsx";
import AdminLeaveRequest from "@/pages/Admin_Pages/Request_Components/AdminLeaveRequest.tsx";

export const AdminRequests = () => {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="remote" className="space-y-4">
        <TabsList>
          <TabsTrigger value="remote">Remote Work</TabsTrigger>
          <TabsTrigger value="leave">Leave Requests</TabsTrigger>
        </TabsList>

        {/* Remote Work Tab */}
        <TabsContent value="remote" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Remote Work Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminRemoteRequest />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leave Requests Tab */}
        <TabsContent value="leave">
          <Card>
            <CardHeader>
              <CardTitle>Leave Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminLeaveRequest />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminRequests;
