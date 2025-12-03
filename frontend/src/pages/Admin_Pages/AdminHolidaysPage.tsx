// React & React-Router
import React, { useState } from "react";
// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// Query & Utilities
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// Date Functions
import { format } from "date-fns";
// Icons
import { Plus, Trash2, Edit } from "lucide-react";
import { LoadingGif } from "@/components/ui/LoadingGif";
// Services
import { holidayService } from "@/services/holiday.service.ts";

// ----------------------------- Types ----------------------------------
type HolidayType = "public" | "company" | "optional";

export interface HolidayProps {
  id: number;
  name: string;
  date: string;
  type: HolidayType;
  created_by: number;
  created_at: string;
  updated_at: string;
}

// ------------------------ Main Component ------------------------------
const AdminHolidaysPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ------------------ State Management ------------------
  const [openDialog, setOpenDialog] = useState(false); // For Add/Edit
  const [editingHoliday, setEditingHoliday] = useState<HolidayProps | null>(
    null
  );

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // For Delete Confirmation
  const [holidayToDelete, setHolidayToDelete] = useState<HolidayProps | null>(
    null
  );

  const [formData, setFormData] = useState<
    Pick<HolidayProps, "name" | "date" | "type">
  >({
    name: "",
    date: "",
    type: "public",
  });

  // ------------------ Queries ------------------
  const { data: holidays = [], isLoading } = useQuery<HolidayProps[]>({
    queryKey: ["holidays"],
    queryFn: async () => {
      const data = await holidayService.getHolidays();
      return Array.isArray(data) ? data : [];
    },
  });

  // ------------------ Mutations ------------------

  // Create Holidays
  const createMutation = useMutation({
    mutationFn: (
      data: Omit<HolidayProps, "id" | "created_at" | "updated_at">
    ) => holidayService.createHoliday(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holidays"] });
      setOpenDialog(false);
      toast({ title: "Success", description: "Holiday created successfully" });
    },
    onError: (error) => {
      console.error("Error creating holiday:", error);
      toast({
        title: "Error",
        description: "Failed to create holiday",
        variant: "destructive",
      });
    },
  });

  // Update Holidays
  const updateMutation = useMutation({
    mutationFn: (data: HolidayProps) =>
      holidayService.updateHoliday(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holidays"] });
      setOpenDialog(false);
      toast({ title: "Success", description: "Holiday updated successfully" });
    },
    onError: (error) => {
      console.error("Error updating holiday:", error);
      toast({
        title: "Error",
        description: "Failed to update holiday",
        variant: "destructive",
      });
    },
  });
  // Delete Holidays
  const deleteMutation = useMutation({
    mutationFn: (id: number) => holidayService.deleteHoliday(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holidays"] });
      setDeleteDialogOpen(false);
      toast({ title: "Success", description: "Holiday deleted successfully" });
    },
    onError: (error) => {
      console.error("Error deleting holiday:", error);
      toast({
        title: "Error",
        description: "Failed to delete holiday",
        variant: "destructive",
      });
    },
  });

  // ------------------ Handlers ------------------
  const openAddEditDialog = (holiday: HolidayProps | null = null) => {
    if (holiday) {
      setEditingHoliday(holiday);
      setFormData({
        name: holiday.name,
        date: holiday.date,
        type: holiday.type,
      });
    } else {
      setEditingHoliday(null);
      setFormData({ name: "", date: "", type: "public" });
    }
    setOpenDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingHoliday) {
      updateMutation.mutate({
        ...formData,
        id: editingHoliday.id,
      } as HolidayProps);
    } else {
      createMutation.mutate(
        formData as Omit<HolidayProps, "id" | "created_at" | "updated_at">
      );
    }
  };

  const openDeleteDialog = (holiday: HolidayProps) => {
    setHolidayToDelete(holiday);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (holidayToDelete) deleteMutation.mutate(holidayToDelete.id);
  };

  // ------------------ Loading State ------------------
  if (isLoading) return <LoadingGif text="Loading holidays..." />;

  // ------------------ Render ------------------
  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Holiday Management</h2>
          <p>Manage Your Holidays</p>
        </div>
        <Button
          onClick={() => openAddEditDialog(null)}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Holiday
        </Button>
      </div>

      {/* Holidays Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holidays.map((holiday) => (
              <TableRow key={holiday.id}>
                <TableCell className="font-medium">{holiday.name}</TableCell>
                <TableCell>
                  {holiday.date
                    ? format(new Date(holiday.date), "MMM dd, yyyy")
                    : "N/A"}
                </TableCell>
                <TableCell className="capitalize">{holiday.type}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openAddEditDialog(holiday)}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                      onClick={() => openDeleteDialog(holiday)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingHoliday ? "Edit Holiday" : "Add New Holiday"}
            </DialogTitle>
            <DialogDescription>
              {editingHoliday
                ? "Update the holiday details"
                : "Fill in the details for the new holiday"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Holiday Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter holiday name"
                required
              />
            </div>
            {/* Date */}
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">
                Date
              </label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>
            {/* Type */}
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                Type
              </label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value as HolidayType })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public Holiday</SelectItem>
                  <SelectItem value="company">Company Holiday</SelectItem>
                  <SelectItem value="optional">Optional Holiday</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingHoliday ? "Update" : "Add"} Holiday
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the holiday{" "}
              <strong>{holidayToDelete?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { AdminHolidaysPage };
