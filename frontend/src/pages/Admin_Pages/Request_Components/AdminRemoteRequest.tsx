// import { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Badge } from '@/components/ui/badge';
// import { format } from 'date-fns';
// import { toast } from 'sonner';
// import { fetchWithAuth } from '@/lib/api';

// import { RemoteRequest } from '@/types/remoteRequest';

// const AdminRemoteRequest = () => {
//   const [requests, setRequests] = useState<RemoteRequest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState<number | null>(null);

//   const fetchRequests = async () => {
//     try {
//       const response = await fetchWithAuth('/remote-attendance/pending');
//       const data = await response.json();
//       if (response.ok) {
//         setRequests(data);
//       } else {
//         throw new Error(data.message || 'Failed to fetch requests');
//       }
//     } catch (error) {
//       console.error('Error fetching remote requests:', error);
//       toast.error('Failed to load remote work requests');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const handleApprove = async (requestId: number) => {
//     try {
//       setUpdating(requestId);
//       const response = await fetchWithAuth(`/remote-attendance/${requestId}/approve`, {
//         method: 'PUT',
//         body: JSON.stringify({
//           comments: 'Approved by admin'
//         })
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.message || 'Failed to approve request');
//       }

//       await fetchRequests();
//       toast.success('Request approved successfully');
//     } catch (error) {
//       console.error('Error approving request:', error);
//       toast.error(error.message || 'Failed to approve request');
//     } finally {
//       setUpdating(null);
//     }
//   };

//   const handleReject = async (requestId: number) => {
//     const reason = prompt('Please enter the reason for rejection:');
//     if (!reason) return;

//     try {
//       setUpdating(requestId);
//       const response = await fetchWithAuth(`/remote-attendance/${requestId}/reject`, {
//         method: 'PUT',
//         body: JSON.stringify({
//           comments: reason
//         })
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.message || 'Failed to reject request');
//       }

//       await fetchRequests();
//       toast.success('Request rejected successfully');
//     } catch (error) {
//       console.error('Error rejecting request:', error);
//       toast.error(error.message || 'Failed to reject request');
//     } finally {
//       setUpdating(null);
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     const statusMap = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       approved: 'bg-green-100 text-green-800',
//       rejected: 'bg-red-100 text-red-800',
//     };

//     return (
//       <Badge className={`${statusMap[status as keyof typeof statusMap]}`}>
//         {status.charAt(0).toUpperCase() + status.slice(1)}
//       </Badge>
//     );
//   };

//   if (loading) {
//     return <div>Loading remote work requests...</div>;
//   }

//   return (
//     <Card>

//       <CardContent>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Employee</TableHead>
//               <TableHead>Request Date</TableHead>
//               <TableHead>Reason</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Requested On</TableHead>
//               <TableHead>Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {requests.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={6} className="text-center py-4">
//                   No pending requests found
//                 </TableCell>
//               </TableRow>
//             ) : (
//               requests.map((request) => (
//                 <TableRow key={request.request_id}>
//                   <TableCell>{request.user_name}</TableCell>
//                   <TableCell>
//                     {format(new Date(request.request_date), 'MMM dd, yyyy')}
//                   </TableCell>
//                   <TableCell className="max-w-xs truncate">
//                     <div className="truncate" title={request.reason}>
//                       {request.reason}
//                     </div>
//                   </TableCell>
//                   <TableCell>{getStatusBadge(request.status)}</TableCell>
//                   <TableCell>
//                     {format(new Date(request.created_at), 'MMM dd, yyyy HH:mm')}
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex space-x-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleApprove(request.request_id)}
//                         disabled={request.status !== 'pending' || updating === request.request_id}
//                       >
//                         {updating === request.request_id ? 'Approving...' : 'Approve'}
//                       </Button>
//                       <Button
//                         variant="destructive"
//                         size="sm"
//                         onClick={() => handleReject(request.request_id)}
//                         disabled={request.status !== 'pending' || updating === request.request_id}
//                       >
//                         {updating === request.request_id ? 'Rejecting...' : 'Reject'}
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   );
// };

// export default AdminRemoteRequest;

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { format } from "date-fns";
// import { toast } from "sonner";
// import { fetchWithAuth } from "@/lib/api";
// import { RemoteRequest } from "@/types/remoteRequest";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// const AdminRemoteRequest = () => {
//   const [requests, setRequests] = useState<RemoteRequest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState<number | null>(null);
//   const [activeTab, setActiveTab] = useState<"new" | "history">("new");

//   const fetchRequests = async () => {
//     try {
//       const response = await fetchWithAuth("/remote-attendance/pending");
//       const data = await response.json();
//       if (response.ok) {
//         setRequests(data);
//       } else {
//         throw new Error(data.message || "Failed to fetch requests");
//       }
//     } catch (error) {
//       console.error("Error fetching remote requests:", error);
//       toast.error("Failed to load remote work requests");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const handleApprove = async (requestId: number) => {
//     try {
//       setUpdating(requestId);
//       const response = await fetchWithAuth(
//         `/remote-attendance/${requestId}/approve`,
//         {
//           method: "PUT",
//           body: JSON.stringify({ comments: "Approved by admin" }),
//         }
//       );

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.message || "Failed to approve request");
//       }

//       await fetchRequests();
//       toast.success("Request approved successfully");
//     } catch (error: any) {
//       console.error("Error approving request:", error);
//       toast.error(error.message || "Failed to approve request");
//     } finally {
//       setUpdating(null);
//     }
//   };

//   const handleReject = async (requestId: number) => {
//     const reason = prompt("Please enter the reason for rejection:");
//     if (!reason) return;

//     try {
//       setUpdating(requestId);
//       const response = await fetchWithAuth(
//         `/remote-attendance/${requestId}/reject`,
//         {
//           method: "PUT",
//           body: JSON.stringify({ comments: reason }),
//         }
//       );

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.message || "Failed to reject request");
//       }

//       await fetchRequests();
//       toast.success("Request rejected successfully");
//     } catch (error: any) {
//       console.error("Error rejecting request:", error);
//       toast.error(error.message || "Failed to reject request");
//     } finally {
//       setUpdating(null);
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     const statusMap = {
//       pending: "bg-yellow-100 text-yellow-800",
//       approved: "bg-green-100 text-green-800",
//       rejected: "bg-red-100 text-red-800",
//     };
//     return (
//       <Badge className={`${statusMap[status as keyof typeof statusMap]}`}>
//         {status.charAt(0).toUpperCase() + status.slice(1)}
//       </Badge>
//     );
//   };

//   const filteredRequests = (tab: "new" | "history") => {
//     if (tab === "new") return requests.filter((r) => r.status === "pending");
//     return requests.filter((r) => r.status !== "pending");
//   };

//   const handleTabChange = (value: string) => {
//     if (value === "new" || value === "history") {
//       setActiveTab(value);
//     }
//   };

//   if (loading) return <div>Loading remote work requests...</div>;

//   return (
//     <Card>
//       <CardContent className="space-y-4 mt-4">
//         {/* Tabs */}
//         <Tabs
//           value={activeTab}
//           onValueChange={handleTabChange}
//           className="flex flex-col"
//         >
//           <TabsList
//             className="mb-4 ml-[64vw] pr-2 w-auto flex justify-end
//         items-end"
//           >
//             <TabsTrigger value="new">New Requests</TabsTrigger>
//             <TabsTrigger value="history">History</TabsTrigger>
//           </TabsList>

//           {["new", "history"].map((tab) => (
//             <TabsContent key={tab} value={tab}>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Employee</TableHead>
//                     <TableHead>Request Date</TableHead>
//                     <TableHead>Reason</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Requested On</TableHead>
//                     {tab === "new" && <TableHead>Actions</TableHead>}
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredRequests(tab as "new" | "history").length === 0 ? (
//                     <TableRow>
//                       <TableCell
//                         colSpan={tab === "new" ? 6 : 5}
//                         className="text-center py-4"
//                       >
//                         No {tab === "new" ? "new" : "historical"} requests found
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     filteredRequests(tab as "new" | "history").map(
//                       (request) => (
//                         <TableRow key={request.request_id}>
//                           <TableCell>{request.user_name}</TableCell>
//                           <TableCell>
//                             {format(
//                               new Date(request.request_date),
//                               "MMM dd, yyyy"
//                             )}
//                           </TableCell>
//                           <TableCell
//                             className="max-w-xs truncate"
//                             title={request.reason}
//                           >
//                             {request.reason}
//                           </TableCell>
//                           <TableCell>
//                             {getStatusBadge(request.status)}
//                           </TableCell>
//                           <TableCell>
//                             {format(
//                               new Date(request.created_at),
//                               "MMM dd, yyyy HH:mm"
//                             )}
//                           </TableCell>
//                           {tab === "new" && (
//                             <TableCell>
//                               <div className="flex space-x-2">
//                                 <Button
//                                   variant="outline"
//                                   size="sm"
//                                   onClick={() =>
//                                     handleApprove(request.request_id)
//                                   }
//                                   disabled={updating === request.request_id}
//                                 >
//                                   {updating === request.request_id
//                                     ? "Approving..."
//                                     : "Approve"}
//                                 </Button>
//                                 <Button
//                                   variant="destructive"
//                                   size="sm"
//                                   onClick={() =>
//                                     handleReject(request.request_id)
//                                   }
//                                   disabled={updating === request.request_id}
//                                 >
//                                   {updating === request.request_id
//                                     ? "Rejecting..."
//                                     : "Reject"}
//                                 </Button>
//                               </div>
//                             </TableCell>
//                           )}
//                         </TableRow>
//                       )
//                     )
//                   )}
//                 </TableBody>
//               </Table>
//             </TabsContent>
//           ))}
//         </Tabs>
//       </CardContent>
//     </Card>
//   );
// };

// export default AdminRemoteRequest;

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { RemoteRequestHistory } from "@/pages/Admin_Pages/Request_Components/RemoteHistory.tsx";

type ActionType = "approve" | "reject" | null;

const AdminRemoteRequest = () => {
  const [requests, setRequests] = useState<RemoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"new" | "history">("new");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RemoteRequest | null>(
    null
  );
  const [actionType, setActionType] = useState<ActionType>(null);
  const [reason, setReason] = useState("");

  const fetchRequests = async () => {
    try {
      const response = await fetchWithAuth("/remote-attendance/pending");
      const data = await response.json();
      if (response.ok) {
        setRequests(data);
      } else {
        throw new Error(data.message || "Failed to fetch requests");
      }
    } catch (error) {
      console.error("Error fetching remote requests:", error);
      toast.error("Failed to load remote work requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleTabChange = (value: string) => {
    if (value === "new" || value === "history") setActiveTab(value);
  };

  const openModal = (request: RemoteRequest, type: ActionType) => {
    setSelectedRequest(request);
    setActionType(type);
    setReason(type === "approve" ? "Approved by admin" : "");
    setModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedRequest || !actionType) return;

    try {
      setUpdating(selectedRequest.request_id);
      const endpoint =
        actionType === "approve"
          ? `/remote-attendance/${selectedRequest.request_id}/approve`
          : `/remote-attendance/${selectedRequest.request_id}/reject`;

      console.log("Sending to backend:", { comments: reason });

      const response = await fetchWithAuth(endpoint, {
        method: "PUT",
        body: JSON.stringify({ comments: reason }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to ${actionType} request`);
      }

      await fetchRequests();
      toast.success(
        `Request ${
          actionType === "approve" ? "approved" : "rejected"
        } successfully`
      );
    } catch (error: any) {
      console.error(`Error ${actionType} request:`, error);
      toast.error(error.message || `Failed to ${actionType} request`);
    } finally {
      setUpdating(null);
      setModalOpen(false);
      setSelectedRequest(null);
      setActionType(null);
      setReason("");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return (
      <Badge className={`${statusMap[status as keyof typeof statusMap]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredRequests = (tab: "new" | "history") =>
    tab === "new"
      ? requests.filter((r) => r.status === "pending")
      : requests.filter((r) => r.status !== "pending");

  if (loading) return <div>Loading remote work requests...</div>;

  return (
    <>
      <Card>
        <CardContent className="space-y-4 mt-4">
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="flex flex-col"
          >
            <TabsList className="mb-4 ml-[64vw] pr-2 w-auto flex justify-end items-end">
              <TabsTrigger value="new">New Requests</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            {/* New Requests Tab */}
            <TabsContent value="new">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested On</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests("new").length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No new requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests("new").map((request) => (
                      <TableRow key={request.request_id}>
                        <TableCell>{request.user_name}</TableCell>
                        <TableCell>
                          {format(
                            new Date(request.request_date),
                            "MMM dd, yyyy"
                          )}
                        </TableCell>
                        <TableCell
                          className="max-w-xs truncate"
                          title={request.reason}
                        >
                          {request.reason}
                        </TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          {format(
                            new Date(request.created_at),
                            "MMM dd, yyyy HH:mm"
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openModal(request, "approve")}
                              disabled={updating === request.request_id}
                            >
                              {updating === request.request_id &&
                              actionType === "approve"
                                ? "Approving..."
                                : "Approve"}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => openModal(request, "reject")}
                              disabled={updating === request.request_id}
                            >
                              {updating === request.request_id &&
                              actionType === "reject"
                                ? "Rejecting..."
                                : "Reject"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              <RemoteRequestHistory />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Approve Request" : "Reject Request"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "Confirm approval and optionally add a message."
                : "Provide a reason for rejecting this request."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <label className="block text-sm font-medium">
              Message / Reason
            </label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                actionType === "approve"
                  ? "Optional approval message"
                  : "Enter rejection reason"
              }
              required={actionType === "reject"}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmAction}>
              {actionType === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminRemoteRequest;
