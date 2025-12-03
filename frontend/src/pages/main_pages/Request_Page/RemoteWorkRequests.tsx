import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { toast } from "sonner";
import { Plus, Calendar } from "lucide-react";
import {
  remoteAttendanceService,
  CreateRemoteRequestData,
} from "@/services/remoteAttendance.service";
import { RemoteRequest } from "@/types/remoteRequest";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export function RemoteWorkRequests() {
  const [requests, setRequests] = useState<RemoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateRemoteRequestData>({
    request_date: "",
    reason: "",
  });

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await remoteAttendanceService.getMyRequests();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to load remote work requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.request_date || !formData.reason.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    // ✅ Check if a request already exists for the same date
    const duplicateRequest = requests.find(
      (r) => r.request_date === formData.request_date && r.status === "pending"
    );

    if (duplicateRequest) {
      toast.error(
        "A request for this date already exists. Please wait until it’s approved or rejected."
      );
      return;
    }

    try {
      setCreating(true);
      await remoteAttendanceService.createRequest(formData);
      toast.success("Remote work request submitted successfully");
      setIsDialogOpen(false);
      setFormData({ request_date: "", reason: "" });
      await fetchRequests();
    } catch (error) {
      console.error("Error creating request:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create request"
      );
    } finally {
      setCreating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      approved: "bg-green-100 text-green-800 border-green-300",
      rejected: "bg-red-100 text-red-800 border-red-300",
    };

    return (
      <Badge
        variant="outline"
        className={`${
          statusMap[status as keyof typeof statusMap]
        } text-xs px-2 py-1`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getStatusStats = () => {
    const pending = requests.filter((r) => r.status === "pending").length;
    const approved = requests.filter((r) => r.status === "approved").length;
    const rejected = requests.filter((r) => r.status === "rejected").length;
    return { pending, approved, rejected, total: requests.length };
  };

  const stats = getStatusStats();

  return (
    <div className="space-y-6">
      {/* Header + New Request */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-orange-500" />
          <h2 className="text-xl font-semibold text-gray-800">
            Remote Work Requests
          </h2>
          <Badge variant="outline">{stats.total} Total</Badge>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Request Remote Work</DialogTitle>
            </DialogHeader>
            {requests.some(
              (r) =>
                r.request_date === formData.request_date &&
                r.status === "pending"
            ) && (
              <p className="text-sm text-red-500 mt-1">
                A request for this date already exists. Please wait for admin
                approval.
              </p>
            )}
            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="request_date">Request Date</Label>
                <Input
                  id="request_date"
                  type="date"
                  value={formData.request_date}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      request_date: e.target.value,
                    }))
                  }
                  min={new Date().toISOString().split("T")[0]}
                  className="focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Remote Work</Label>
                <Textarea
                  id="reason"
                  placeholder="Please provide a reason..."
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  rows={4}
                  required
                  className="focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={creating}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:opacity-90"
                >
                  {creating ? <LoadingSpinner /> : "Submit Request"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Requests",
            value: stats.total,
            color: "text-orange-600",
          },
          { title: "Pending", value: stats.pending, color: "text-yellow-600" },
          { title: "Approved", value: stats.approved, color: "text-green-600" },
          { title: "Rejected", value: stats.rejected, color: "text-red-600" },
        ].map((stat, i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Requests Table */}
      <Card className="overflow-x-auto shadow-md rounded-xl">
        <CardHeader>
          <CardTitle>My Remote Work Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <LoadingSpinner />
              <p className="mt-2">Loading requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-10 h-10 mx-auto mb-2" />
              No requests yet — create one above.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted On</TableHead>
                  <TableHead>Reviewed On</TableHead>
                  <TableHead>Reason/Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((r) => (
                  <TableRow key={r.request_id}>
                    <TableCell>
                      {format(new Date(r.request_date), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {r.reason}
                    </TableCell>
                    <TableCell>{getStatusBadge(r.status)}</TableCell>
                    <TableCell>
                      {format(new Date(r.created_at), "MMM dd, yyyy HH:mm")}
                    </TableCell>
                    <TableCell>
                      {r.approved_at || r.rejected_at ? (
                        format(
                          new Date(r.approved_at || r.rejected_at!),
                          "MMM dd, yyyy HH:mm"
                        )
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {r.status === "approved" && r.accept_reason ? (
                        r.accept_reason
                      ) : r.status === "rejected" && r.rejection_reason ? (
                        r.rejection_reason
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
