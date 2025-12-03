import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";
import { fetchWithAuth } from "@/lib/api";
import { RemoteRequest } from "@/types/remoteRequest";

export const RemoteRequestHistory = () => {
  const [history, setHistory] = useState<RemoteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await fetchWithAuth("/remote-attendance/history");
      const data = await res.json();
      if (res.ok) {
        setHistory(data);
      } else {
        throw new Error(data.message || "Failed to fetch history");
      }
    } catch (error) {
      console.error("Error fetching remote request history:", error);
      toast.error("Failed to load remote request history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return <Badge className={`${statusMap[status as keyof typeof statusMap]}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  if (loading) return <div>Loading history...</div>;

  return (
    <Card>
      <CardContent className="space-y-4 mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Request Date</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Requested On</TableHead>
              <TableHead>Approval / Rejection Message</TableHead>
              <TableHead>Processed By</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No historical requests found
                </TableCell>
              </TableRow>
            ) : (
              history.map(r => (
                <TableRow key={r.request_id}>
                  <TableCell>{r.user_name}</TableCell>
                  <TableCell>{format(new Date(r.request_date), "MMM dd, yyyy")}</TableCell>
                  <TableCell className="max-w-xs truncate" title={r.reason}>{r.reason}</TableCell>
                  <TableCell>{format(new Date(r.created_at), "MMM dd, yyyy HH:mm")}</TableCell>
                  <TableCell>
                    {r.status === "approved" && r.accept_reason
                      ? r.accept_reason
                      : r.status === "rejected" && r.rejection_reason
                      ? r.rejection_reason
                      : <span className="text-gray-400">-</span>
                    }
                  </TableCell>
                  <TableCell>
  {r.status === "approved"
    ? r.approved_by_name || "-"
    : r.status === "rejected"
    ? r.rejected_by_name || "-"
    : "-"}
</TableCell>

                  <TableCell>{getStatusBadge(r.status)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
