// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
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

// const CreateEvent: React.FC = () => {
//   const navigate = useNavigate();
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [dateTime, setDateTime] = useState("");
//   const [location, setLocation] = useState("");
//   const [image, setImage] = useState<File | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       formData.append("title", title);
//       formData.append("description", description);
//       formData.append("date_time", dateTime);
//       formData.append("location", location);
//       if (image) {
//         formData.append("image", image);
//       }
//       await eventService.createEvent(formData);
//       navigate("/events");
//     } catch (error) {
//       console.error("Failed to create event", error);
//     }
//   };

//   return (
//     <div className="p-4">
//       <Card>
//         <CardHeader>
//           <CardTitle>Create New Event</CardTitle>
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
//             </div>
//             <Button type="submit">Create Event</Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default CreateEvent;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import eventService from "../../../services/event.service";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { MapPin, Upload, Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState<Date | null>(null);
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!dateTime) throw new Error("Please select a valid date & time");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("date_time", dateTime.toISOString());
      formData.append("location", location);
      if (image) formData.append("image", image);

      await eventService.createEvent(formData);
      navigate("/events");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create event. Please try again.";
      alert(message);
      console.error("Failed to create event", error);
    }
  };

  const handleImageChange = (file: File | null) => {
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
      <Card className="shadow-xl border rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black w-full">
        <CardHeader className="relative flex justify-center items-between border-b pb-4">
          <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            Create New Event
          </CardTitle>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-2xl md:text-4xl font-bold w-full text-right absolute top-3 md:top-2 right-5"
          >
            ×
          </button>
        </CardHeader>
        <CardContent className="mt-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 sm:space-y-6 md:space-y-8"
          >
            {/* Title */}
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

            {/* Description */}
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
                placeholder="Tell people what this event is about..."
                className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-orange-500 dark:bg-gray-800"
                required
              />
            </div>

            {/* Date and Time Picker */}
            <div>
              <label
                htmlFor="dateTime"
                className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Date & Time
              </label>
              <div className="relative">
                <DatePicker
                  selected={dateTime}
                  onChange={(date: Date | null) => setDateTime(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  placeholderText="Select date & time"
                  className="w-full rounded-xl border-gray-300 p-2 pl-10 focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 text-sm sm:text-base"
                />
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
              </div>
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Location
              </label>
              <div className="relative">
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location"
                  className="w-full rounded-xl border-gray-300 pl-10 focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 text-sm sm:text-base"
                  required
                />
                <MapPin className="absolute left-3 top-2.5 h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label
                htmlFor="image"
                className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Event Image
              </label>
              <div
                className="border-2 border-dashed rounded-xl p-4 sm:p-6 md:p-8 text-center cursor-pointer hover:border-orange-400 transition"
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                {preview ? (
                  <div className="flex flex-col items-center space-y-2">
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-36 sm:h-40 md:h-52 w-full object-cover rounded-xl shadow-md"
                    />
                    <span className="text-xs sm:text-sm md:text-base text-gray-500">
                      Click to change image
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2">
                    <Upload className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-gray-400" />
                    <span className="text-xs sm:text-sm md:text-base text-gray-500">
                      Drag & drop or click to upload
                    </span>
                  </div>
                )}
                <Input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleImageChange(e.target.files ? e.target.files[0] : null)
                  }
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full py-2 sm:py-3 md:py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold shadow-lg hover:opacity-90 transition"
              >
                Create Event
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateEvent;
