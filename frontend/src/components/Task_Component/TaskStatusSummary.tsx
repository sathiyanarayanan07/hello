// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// interface TaskStatusSummaryProps {
//   todo: number;
//   inProgress: number;
//   review: number;
//   completed: number;
//   totalTasks: number;
// }

// export default function TaskStatusSummary({
//   todo,
//   inProgress,
//   review,
//   completed,
//   totalTasks,
// }: TaskStatusSummaryProps) {
//   const completionRate =
//     totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

//   // Calculate percentages for progress bars
//   const todoPercent = totalTasks > 0 ? (todo / totalTasks) * 100 : 0;
//   const inProgressPercent =
//     totalTasks > 0 ? (inProgress / totalTasks) * 100 : 0;
//   const reviewPercent = totalTasks > 0 ? (review / totalTasks) * 100 : 0;
//   const completedPercent = totalTasks > 0 ? (completed / totalTasks) * 100 : 0;

//   return (
//     <Card className="shadow-medium sticky top-20">
//       <CardHeader>
//         <CardTitle className="text-lg">Task Status</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-5">
//         {/* Completion Rate */}
//         <div className="text-center p-4 bg-muted/10 rounded-lg">
//           <div
//             className={`text-2xl font-bold ${
//               completionRate === 100
//                 ? "text-status-excellent"
//                 : completionRate >= 70
//                 ? "text-status-warning"
//                 : "text-status-critical"
//             }`}
//           >
//             {completionRate}%
//           </div>
//           <div className="text-sm text-muted-foreground">Completion Rate</div>
//         </div>

//         {/* Status Grid */}
//         <div className="space-y-3">
//           {/* Todo */}
//           <div className="space-y-1">
//             <div className="flex justify-between text-sm">
//               <span className="font-medium">To Do</span>
//               <span className="text-muted-foreground">{todo} tasks</span>
//             </div>
//             <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-status-critical/70"
//                 style={{ width: `${todoPercent}%` }}
//               />
//             </div>
//           </div>

//           {/* In Progress */}
//           <div className="space-y-1">
//             <div className="flex justify-between text-sm">
//               <span className="font-medium">In Progress</span>
//               <span className="text-muted-foreground">{inProgress} tasks</span>
//             </div>
//             <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-status-warning/70"
//                 style={{ width: `${inProgressPercent}%` }}
//               />
//             </div>
//           </div>

//           {/* Review */}
//           <div className="space-y-1">
//             <div className="flex justify-between text-sm">
//               <span className="font-medium">In Review</span>
//               <span className="text-muted-foreground">{review} tasks</span>
//             </div>
//             <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-status-warning/70"
//                 style={{ width: `${reviewPercent}%` }}
//               />
//             </div>
//           </div>

//           {/* Completed */}
//           <div className="space-y-1">
//             <div className="flex justify-between text-sm">
//               <span className="font-medium">Completed</span>
//               <span className="text-muted-foreground">{completed} tasks</span>
//             </div>
//             <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-status-excellent/70"
//                 style={{ width: `${completedPercent}%` }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Summary Grid */}
//         <div className="grid grid-cols-2 gap-3 pt-2">
//           <div className="text-center p-3 bg-status-critical/10 rounded-lg">
//             <div className="text-lg font-bold text-status-critical">{todo}</div>
//             <div className="text-xs text-muted-foreground">To Do</div>
//           </div>
//           <div className="text-center p-3 bg-status-warning/10 rounded-lg">
//             <div className="text-lg font-bold text-status-warning">
//               {inProgress}
//             </div>
//             <div className="text-xs text-muted-foreground">In Progress</div>
//           </div>
//           <div className="text-center p-3 bg-status-warning/10 rounded-lg">
//             <div className="text-lg font-bold text-status-warning">
//               {review}
//             </div>
//             <div className="text-xs text-muted-foreground">In Review</div>
//           </div>
//           <div className="text-center p-3 bg-status-excellent/10 rounded-lg">
//             <div className="text-lg font-bold text-status-excellent">
//               {completed}
//             </div>
//             <div className="text-xs text-muted-foreground">Completed</div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }




import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface TaskStatusSummaryProps {
  todo: number;
  inProgress: number;
  review: number;
  completed: number;
  totalTasks: number;
}

export default function TaskStatusSummary({
  todo,
  inProgress,
  review,
  completed,
  totalTasks,
}: TaskStatusSummaryProps) {
  const completionRate =
    totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

  const todoPercent = totalTasks > 0 ? (todo / totalTasks) * 100 : 0;
  const inProgressPercent =
    totalTasks > 0 ? (inProgress / totalTasks) * 100 : 0;
  const reviewPercent = totalTasks > 0 ? (review / totalTasks) * 100 : 0;
  const completedPercent =
    totalTasks > 0 ? (completed / totalTasks) * 100 : 0;

  const getColor = (rate: number) => {
    if (rate === 100) return "text-orange-600";
    if (rate >= 70) return "text-orange-500";
    return "text-orange-400";
  };

  return (
    <Card className="shadow-lg border border-orange-200 bg-gradient-to-br from-orange-50 via-orange-100 to-white rounded-2xl sticky top-20 transition-all duration-300 hover:shadow-xl">
      <CardHeader className="border-b border-orange-200 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-2xl py-3">
        <CardTitle className="text-lg font-semibold tracking-wide">
          Task Overview
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {/* Completion Rate */}
        <div className="text-center p-5 bg-gradient-to-r from-orange-100 to-orange-50 rounded-xl shadow-sm">
          <div
            className={`text-4xl font-bold drop-shadow-sm ${getColor(
              completionRate
            )}`}
          >
            {completionRate}%
          </div>
          <div className="text-sm text-orange-700 font-medium mt-1">
            Completion Rate
          </div>
        </div>

        {/* Status Progress Bars */}
        <div className="space-y-4">
          {/* To Do */}
          <div>
            <div className="flex justify-between text-sm font-medium text-orange-800">
              <span>To Do</span>
              <span>{todo} tasks</span>
            </div>
            <div className="h-2 w-full bg-orange-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${todoPercent}%` }}
                transition={{ duration: 0.6 }}
                className="h-full bg-orange-400"
              />
            </div>
          </div>

          {/* In Progress */}
          <div>
            <div className="flex justify-between text-sm font-medium text-orange-800">
              <span>In Progress</span>
              <span>{inProgress} tasks</span>
            </div>
            <div className="h-2 w-full bg-orange-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${inProgressPercent}%` }}
                transition={{ duration: 0.6 }}
                className="h-full bg-gradient-to-r from-orange-400 to-orange-500"
              />
            </div>
          </div>

          {/* In Review */}
          <div>
            <div className="flex justify-between text-sm font-medium text-orange-800">
              <span>In Review</span>
              <span>{review} tasks</span>
            </div>
            <div className="h-2 w-full bg-orange-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${reviewPercent}%` }}
                transition={{ duration: 0.6 }}
                className="h-full bg-gradient-to-r from-orange-400 to-orange-600"
              />
            </div>
          </div>

          {/* Completed */}
          <div>
            <div className="flex justify-between text-sm font-medium text-orange-800">
              <span>Completed</span>
              <span>{completed} tasks</span>
            </div>
            <div className="h-2 w-full bg-orange-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completedPercent}%` }}
                transition={{ duration: 0.6 }}
                className="h-full bg-gradient-to-r from-orange-500 to-orange-700"
              />
            </div>
          </div>
        </div>

        {/* Summary Grid */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <div className="text-center p-3 bg-orange-100 rounded-lg hover:scale-105 transition-transform">
            <div className="text-lg font-bold text-orange-600">{todo}</div>
            <div className="text-xs text-orange-700">To Do</div>
          </div>

          <div className="text-center p-3 bg-orange-100 rounded-lg hover:scale-105 transition-transform">
            <div className="text-lg font-bold text-orange-500">
              {inProgress}
            </div>
            <div className="text-xs text-orange-700">In Progress</div>
          </div>

          <div className="text-center p-3 bg-orange-100 rounded-lg hover:scale-105 transition-transform">
            <div className="text-lg font-bold text-orange-500">{review}</div>
            <div className="text-xs text-orange-700">In Review</div>
          </div>

          <div className="text-center p-3 bg-orange-100 rounded-lg hover:scale-105 transition-transform">
            <div className="text-lg font-bold text-orange-700">
              {completed}
            </div>
            <div className="text-xs text-orange-700">Completed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
