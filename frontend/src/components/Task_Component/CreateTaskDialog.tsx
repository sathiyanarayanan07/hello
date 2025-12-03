// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import taskService, { Task } from "../../services/task.service";
// import { userService, User } from "../../services/user.service"; // Import userService and User interface

// interface CreateTaskDialogProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onTaskCreated: (task: Task) => void;
// }

// const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({
//   isOpen,
//   onClose,
//   onTaskCreated,
// }) => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [dueDate, setDueDate] = useState("");
//   const [status, setStatus] = useState<Task["status"]>("todo");
//   const [priority, setPriority] = useState<Task["priority"]>("medium");
//   const [tags, setTags] = useState(""); // Comma-separated tags
//   const [assignedTo, setAssignedTo] = useState<number | null>(null);
//   const [assignedBy, setAssignedBy] = useState<number | null>(null);
//   const [users, setUsers] = useState<User[]>([]); // State to store fetched users
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const fetchedUsers = await userService.getAllUsers();
//         setUsers(fetchedUsers);
//         // Optionally set a default assignedBy to the current user if available
//         const currentUserData = localStorage.getItem("user");
//         if (currentUserData) {
//           const currentUser = JSON.parse(currentUserData);
//           setAssignedBy(currentUser.id);
//         }
//       } catch (err) {
//         console.error("Error fetching users:", err);
//         setError("Failed to load users for assignment.");
//       }
//     };

//     if (isOpen) {
//       // Fetch users only when the dialog is open
//       fetchUsers();
//     }
//   }, [isOpen]);

//   const handleSubmit = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const newTask: Omit<Task, "id" | "tags" | "subtasks"> = {
//         title,
//         description,
//         dueDate,
//         status,
//         priority,
//         assignedTo: assignedTo || null, // Pass null if not selected
//         assignedBy: assignedBy || null, // Pass null if not selected
//       };

//       const createdTask = await taskService.createTask(newTask);

//       // Handle tags separately if needed, or assume backend handles creation/association
//       // For now, we'll just pass the tag names as a string and let the backend parse it
//       // If the backend expects an array of Tag objects, this needs adjustment.
//       // Assuming backend handles tags from a comma-separated string for simplicity.
//       if (tags) {
//         // This part would ideally involve creating tags if they don't exist
//         // and then associating them with the task. For this example, we'll
//         // assume the backend processes the 'tags' string from the description or a separate field.
//         // Since our task service doesn't have a direct way to add tags during creation
//         // (it has addTagToTask which requires a tagId), we'll omit this for now
//         // or assume the backend handles it if the 'tags' field is part of the task object.
//         // For now, the `Task` interface in `task.service.ts` has `tags?: Tag[];`
//         // and `createTask` takes `Omit<Task, 'id' | 'tags' | 'subtasks'>`.
//         // This means tags are not directly created with the task via this service method.
//         // If tags are to be created/associated, a separate API call or a modified createTask
//         // method in the service would be needed.
//       }

//       onTaskCreated(createdTask);
//       onClose();
//       // Reset form fields
//       setTitle("");
//       setDescription("");
//       setDueDate("");
//       setStatus("todo");
//       setPriority("medium");
//       setTags("");
//       setAssignedTo(null);
//       setAssignedBy(null);
//     } catch (err: any) {
//       setError(err.message || "Failed to create task.");
//       console.error("Error creating task:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[650px] rounded-lg shadow-lg">
//         <DialogHeader>
//           <DialogTitle>Create New Task</DialogTitle>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="title" className="text-right">
//               Title
//             </Label>
//             <Input
//               id="title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="col-span-3"
//             />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="description" className="text-right">
//               Description
//             </Label>
//             <Textarea
//               id="description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="col-span-3"
//             />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="dueDate" className="text-right">
//               Due Date
//             </Label>
//             <Input
//               id="dueDate"
//               type="date"
//               value={dueDate}
//               onChange={(e) => setDueDate(e.target.value)}
//               className="col-span-3"
//             />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="status" className="text-right">
//               Status
//             </Label>
//             <Select
//               value={status}
//               onValueChange={(value: Task["status"]) => setStatus(value)}
//             >
//               <SelectTrigger className="col-span-3">
//                 <SelectValue placeholder="Select status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="todo">To Do</SelectItem>
//                 <SelectItem value="in-progress">In Progress</SelectItem>
//                 <SelectItem value="completed">Completed</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="priority" className="text-right">
//               Priority
//             </Label>
//             <Select
//               value={priority}
//               onValueChange={(value: Task["priority"]) => setPriority(value)}
//             >
//               <SelectTrigger className="col-span-3">
//                 <SelectValue placeholder="Select priority" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="low">Low</SelectItem>
//                 <SelectItem value="medium">Medium</SelectItem>
//                 <SelectItem value="high">High</SelectItem>
//                 <SelectItem value="urgent">Urgent</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="assignedTo" className="text-right">
//               Assigned To
//             </Label>
//             <Select
//               value={assignedTo !== null ? String(assignedTo) : ""}
//               onValueChange={(value) => setAssignedTo(Number(value))}
//             >
//               <SelectTrigger className="col-span-3">
//                 <SelectValue placeholder="Select user" />
//               </SelectTrigger>
//               <SelectContent>
//                 {users.map((user) => (
//                   <SelectItem key={user.id} value={String(user.id)}>
//                     {user.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="assignedBy" className="text-right">
//               Assigned By
//             </Label>
//             <Select
//               value={assignedBy !== null ? String(assignedBy) : ""}
//               onValueChange={(value) => setAssignedBy(Number(value))}
//             >
//               <SelectTrigger className="col-span-3">
//                 <SelectValue placeholder="Select user" />
//               </SelectTrigger>
//               <SelectContent>
//                 {users.map((user) => (
//                   <SelectItem key={user.id} value={String(user.id)}>
//                     {user.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="tags" className="text-right">
//               Tags (comma-separated)
//             </Label>
//             <Input
//               id="tags"
//               value={tags}
//               onChange={(e) => setTags(e.target.value)}
//               className="col-span-3"
//             />
//           </div>
//         </div>
//         {error && <p className="text-red-500 text-sm text-center">{error}</p>}
//         <DialogFooter>
//           <Button variant="outline" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button type="submit" onClick={handleSubmit} disabled={loading}>
//             {loading ? "Creating..." : "Create Task"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CreateTaskDialog;

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import taskService, { Task } from "../../services/task.service";
import { userService, User } from "../../services/user.service";

interface CreateTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (task: Task) => void;
}

const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({
  isOpen,
  onClose,
  onTaskCreated,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<Task["status"]>("todo");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [tags, setTags] = useState("");
  const [assignedTo, setAssignedTo] = useState<number | null>(null);
  const [assignedBy, setAssignedBy] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await userService.getAllUsers();
        setUsers(fetchedUsers);
        const currentUserData = localStorage.getItem("user");
        if (currentUserData) {
          const currentUser = JSON.parse(currentUserData);
          setAssignedBy(currentUser.id);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users for assignment.");
      }
    };

    if (isOpen) fetchUsers();
  }, [isOpen]);

  const handleSubmit = async () => {
    if (
      !title ||
      !description ||
      !dueDate ||
      !status ||
      !priority ||
      !assignedTo ||
      !assignedBy ||
      !tags
    ) {
      setError("Please fill in all required fields before submitting.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const newTask: Omit<Task, "id" | "tags" | "subtasks"> = {
        title,
        description,
        dueDate,
        status,
        priority,
        assignedTo: assignedTo || null,
        assignedBy: assignedBy || null,
      };

      const createdTask = await taskService.createTask(newTask);
      onTaskCreated(createdTask);
      onClose();

      setTitle("");
      setDescription("");
      setDueDate("");
      setStatus("todo");
      setPriority("medium");
      setTags("");
      setAssignedTo(null);
      setAssignedBy(null);
    } catch (err: any) {
      setError(err.message || "Failed to create task.");
      console.error("Error creating task:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[950px] overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 via-orange-100 to-white p-0 shadow-2xl border border-orange-200">
        <DialogHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 shadow-sm">
          <DialogTitle className="text-xl font-semibold tracking-wide">
            Create New Task
          </DialogTitle>
        </DialogHeader>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-5">
            <div>
              <Label htmlFor="title" className="font-medium text-orange-800">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border-orange-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-400"
                placeholder="Enter task title"
              />
            </div>

            <div>
              <Label
                htmlFor="description"
                className="font-medium text-orange-800"
              >
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full rounded-lg border-orange-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-400"
                placeholder="Describe the task..."
              />
            </div>

            <div>
              <Label htmlFor="dueDate" className="font-medium text-orange-800">
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 w-full rounded-lg border-orange-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-400"
              />
            </div>

            <div>
              <Label htmlFor="tags" className="font-medium text-orange-800">
                Tags (comma-separated)
              </Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="mt-1 w-full rounded-lg border-orange-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-400"
                placeholder="e.g. design, frontend"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            <div>
              <Label htmlFor="status" className="font-medium text-orange-800">
                Status
              </Label>
              <Select
                value={status}
                onValueChange={(value: Task["status"]) => setStatus(value)}
              >
                <SelectTrigger className="mt-1 w-full rounded-lg border-orange-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-400">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority" className="font-medium text-orange-800">
                Priority
              </Label>
              <Select
                value={priority}
                onValueChange={(value: Task["priority"]) => setPriority(value)}
              >
                <SelectTrigger className="mt-1 w-full rounded-lg border-orange-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-400">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label
                htmlFor="assignedTo"
                className="font-medium text-orange-800"
              >
                Assigned To
              </Label>
              <Select
                value={assignedTo !== null ? String(assignedTo) : ""}
                onValueChange={(value) => setAssignedTo(Number(value))}
              >
                <SelectTrigger className="mt-1 w-full rounded-lg border-orange-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-400">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={String(user.id)}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label
                htmlFor="assignedBy"
                className="font-medium text-orange-800"
              >
                Assigned By
              </Label>
              <Select
                value={assignedBy !== null ? String(assignedBy) : ""}
                onValueChange={(value) => setAssignedBy(Number(value))}
              >
                <SelectTrigger className="mt-1 w-full rounded-lg border-orange-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-400">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={String(user.id)}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter className="px-6 py-4 bg-gradient-to-r from-orange-50 to-orange-100 border-t border-orange-200 rounded-b-2xl flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-orange-300 text-orange-700 hover:bg-orange-100 hover:text-orange-900"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:opacity-90 shadow-md"
          >
            {loading ? "Creating..." : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
