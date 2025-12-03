// import React from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { LeaveRequestForm } from "@/components/leaves/LeaveRequestForm";
// import { LeaveBalanceDisplay } from "@/components/leaves/LeaveBalanceDisplay";
// import { LeaveHistoryTable } from "@/components/leaves/LeaveHistoryTable";

// export const LeaveRequestPage: React.FC = () => {
//   const [refreshKey, setRefreshKey] = React.useState(0);

//   const handleLeaveRequestSuccess = () => {
//     setRefreshKey((prev) => prev + 1);
//   };
//   return (
//     <div className="space-y-6">
//       <h2 className="text-3xl font-bold tracking-tight">Leave Management</h2>
//       <p className="text-muted-foreground">
//         Manage your leave requests and view your leave balances and history.
//       </p>

//       <Tabs defaultValue="request" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="request">Leave Request</TabsTrigger>
//           <TabsTrigger value="history">Leave History</TabsTrigger>
//         </TabsList>

//         <TabsContent value="request" className="space-y-4">
//           <div className="flex flex-col lg:flex-row gap-6 ">
//             <div className="flex-1 hover:border-orange-500 hover:border-2 ">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Submit New Leave Request</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <LeaveRequestForm onSuccess={handleLeaveRequestSuccess} />
//                 </CardContent>
//               </Card>
//             </div>

//             <div className="w-full lg:w-80 flex-shrink-0 space-y-4 hover:border-orange-500 hover:border-2">
//               <Card className="lg:sticky lg:top-20">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-lg">Your Leave Balance</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <LeaveBalanceDisplay refreshKey={refreshKey} />
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </TabsContent>

//         <TabsContent value="history" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Your Leave History</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <LeaveHistoryTable />
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };




import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeaveRequestForm } from "@/components/Leave_Component/LeaveRequestForm";
import { LeaveBalanceDisplay } from "@/components/Leave_Component/LeaveBalanceDisplay";
import { LeaveHistoryTable } from "@/components/Leave_Component/LeaveHistoryTable";

export const LeaveRequestPage: React.FC = () => {
  const [refreshKey, setRefreshKey] = React.useState(0);

  const handleLeaveRequestSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8  min-h-screen rounded-2xl">
      {/* Page Header */}
      <div className="text-center lg:text-left">
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 to-pink-500 bg-clip-text text-transparent">
          Leave Management
        </h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Manage your leave requests and view your leave balances and history.
        </p>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="request" className="space-y-6">
        <TabsList className="flex flex-wrap justify-center lg:justify-start gap-2 rounded-xl p-2 h-[8vh]">
          <TabsTrigger
            value="request"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-300"
          >
            Leave Request
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-300"
          >
            Leave History
          </TabsTrigger>
        </TabsList>

        {/* Leave Request Tab */}
        <TabsContent value="request" className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Form Section */}
            <div className="flex-1 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <Card className="rounded-2xl shadow-md border-0 hover:ring-2 hover:ring-orange-400">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Submit New Leave Request
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LeaveRequestForm onSuccess={handleLeaveRequestSuccess} />
                </CardContent>
              </Card>
            </div>

            {/* Balance Section */}
            <div className="w-full lg:w-80 flex-shrink-0 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
              <Card className="rounded-2xl shadow-md border-0 hover:ring-2 hover:ring-orange-400 lg:sticky lg:top-20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">
                    Your Leave Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LeaveBalanceDisplay refreshKey={refreshKey} />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Leave History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card className="rounded-2xl shadow-md border-0 hover:ring-2 hover:ring-orange-400 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Your Leave History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LeaveHistoryTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
