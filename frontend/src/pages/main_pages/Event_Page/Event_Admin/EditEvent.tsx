// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import eventService from "../../../services/event.service";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../../../components/ui/card";
// import { Button } from "../../../components/ui/button";
// import { Input } from "../../../components/ui/input";
// import { Textarea } from "../../../components/ui/textarea";
// import { Event } from "../../../types/event";

// const EditEvent: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [dateTime, setDateTime] = useState("");
//   const [location, setLocation] = useState("");
//   const [image, setImage] = useState<File | null>(null);
//   const [existingImageUrl, setExistingImageUrl] = useState<string | undefined>(
//     ""
//   );

//   useEffect(() => {
//     const fetchEvent = async () => {
//       try {
//         if (id) {
//           const response = await eventService.fetchEvent(id);
//           if (response.success) {
//             const event = response.data;
//             setTitle(event.title);
//             setDescription(event.description);
//             setDateTime(new Date(event.date_time).toISOString().slice(0, 16));
//             setLocation(event.location);
//             setExistingImageUrl(event.image_url);
//           }
//         }
//       } catch (error) {
//         console.error("Failed to fetch event", error);
//       }
//     };

//     fetchEvent();
//   }, [id]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       if (id) {
//         const formData = new FormData();
//         formData.append("title", title);
//         formData.append("description", description);
//         formData.append("date_time", dateTime);
//         formData.append("location", location);
//         if (image) {
//           formData.append("image", image);
//         } else if (existingImageUrl) {
//           formData.append("image_url", existingImageUrl);
//         }
//         await eventService.updateEvent(id, formData);
//         navigate(`/events/${id}`);
//       }
//     } catch (error) {
//       console.error("Failed to update event", error);
//     }
//   };

//   return (
//     <div className="p-4">
//       <Card>
//         <CardHeader>
//           <CardTitle>Edit Event</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit}>
//             <div className="mb-4">
//               <label
//                 htmlFor="title"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Title
//               </label>
//               <Input
//                 id="title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label
//                 htmlFor="description"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Description
//               </label>
//               <Textarea
//                 id="description"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label
//                 htmlFor="dateTime"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Date and Time
//               </label>
//               <Input
//                 id="dateTime"
//                 type="datetime-local"
//                 value={dateTime}
//                 onChange={(e) => setDateTime(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label
//                 htmlFor="location"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Location
//               </label>
//               <Input
//                 id="location"
//                 value={location}
//                 onChange={(e) => setLocation(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label
//                 htmlFor="image"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Image
//               </label>
//               <Input
//                 id="image"
//                 type="file"
//                 onChange={(e) =>
//                   setImage(e.target.files ? e.target.files[0] : null)
//                 }
//               />
//               {existingImageUrl && !image && (
//                 <img
//                   src={`http://localhost:5001${existingImageUrl}`}
//                   alt="Existing event image"
//                   className="w-full h-48 object-cover mt-2"
//                 />
//               )}
//             </div>
//             <Button type="submit">Update Event</Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default EditEvent;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import eventService from "../../../../services/event.service";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../components/ui/dialog";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react"; // optional icon

const EditEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | undefined>(
    ""
  );
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (id) {
          const response = await eventService.fetchEvent(id);
          if (response.success) {
            const event = response.data;
            setTitle(event.title);
            setDescription(event.description);
            setDateTime(new Date(event.date_time).toISOString().slice(0, 16));
            setLocation(event.location);
            setExistingImageUrl(event.image_url);
          }
        }
      } catch (error) {
        console.error("Failed to fetch event", error);
      }
    };
    fetchEvent();
  }, [id]);

  const handleSubmit = async () => {
    try {
      if (id) {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("date_time", dateTime);
        formData.append("location", location);
        if (image) formData.append("image", image);
        else if (existingImageUrl)
          formData.append("image_url", existingImageUrl);

        await eventService.updateEvent(id, formData);
        navigate(`/events/${id}`);
      }
    } catch (error) {
      console.error("Failed to update event", error);
    }
  };

  const handleDelete = async () => {
    try {
      if (id) {
        await eventService.deleteEvent(id);
        navigate("/events");
      }
    } catch (error) {
      console.error("Failed to delete event", error);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
      {/* Top Buttons */}
      <div className="flex justify-end space-x-2 mb-4">
        <Button
          variant="outline"
          className="bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:opacity-90 shadow-md"
          onClick={() => setShowEditConfirm(true)}
        >
          Update Event
        </Button>
        <Button
          variant="destructive"
          className="bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:opacity-90 shadow-md"
          onClick={() => setShowDeleteConfirm(true)}
        >
          Delete Event
        </Button>
      </div>

      {/* Confirmation Modals */}
      <Dialog open={showEditConfirm} onOpenChange={setShowEditConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-800 dark:text-gray-200">
              Confirm Update
            </DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to update this event?</p>
          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button onClick={() => setShowEditConfirm(false)}>Cancel</Button>
            <Button
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:opacity-90"
              onClick={() => {
                setShowEditConfirm(false);
                handleSubmit();
              }}
            >
              Yes, Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-800 dark:text-gray-200">
              Confirm Delete
            </DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this event? This action cannot be
            undone.
          </p>
          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button
              variant="destructive"
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:opacity-90"
              onClick={() => {
                setShowDeleteConfirm(false);
                handleDelete();
              }}
            >
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Form */}
      <Card className="shadow-xl border rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            Edit Event
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-6">
          <form className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a catchy event title"
                className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-orange-500 dark:bg-gray-800"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the event..."
                className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-orange-500 dark:bg-gray-800"
                required
              />
            </div>

            <div>
              <label
                htmlFor="dateTime"
                className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Date and Time
              </label>
              <div className="relative">
                <DatePicker
                  selected={dateTime ? new Date(dateTime) : null}
                  onChange={(date: Date | null) =>
                    setDateTime(date ? date.toISOString() : "")
                  }
                  showTimeSelect
                  dateFormat="Pp"
                  placeholderText="Select date & time"
                  className="w-full rounded-xl border-gray-300 p-2 pl-10 focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 text-sm sm:text-base"
                />
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
              </div>
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Location
              </label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
                className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-orange-500 dark:bg-gray-800"
                required
              />
            </div>

            <div>
              <label
                htmlFor="image"
                className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Event Image
              </label>
              <Input
                id="image"
                type="file"
                onChange={(e) =>
                  setImage(e.target.files ? e.target.files[0] : null)
                }
                className="hidden"
              />
              <div
                className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-orange-400 transition"
                onClick={() => document.getElementById("image")?.click()}
              >
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="h-40 w-full object-cover rounded-xl shadow-md"
                  />
                ) : existingImageUrl ? (
                  <img
                    src={`http://localhost:5001${existingImageUrl}`}
                    alt="Existing event"
                    className="h-40 w-full object-cover rounded-xl shadow-md"
                  />
                ) : (
                  <p className="text-gray-500">Click to upload image</p>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditEvent;
