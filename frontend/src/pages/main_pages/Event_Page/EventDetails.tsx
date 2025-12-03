// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import eventService from "../../../services/event.service";
// import { Event } from "../../../types/event";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../../../components/ui/card";
// import { Button } from "../../../components/ui/button";
// import { format } from "date-fns";
// import { useAuth } from "../../../contexts/AuthContext";
// import { UserRole } from "../../../types/user";

// const EventDetails: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const [event, setEvent] = useState<Event | null>(null);
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   useEffect(() => {
//     const fetchEvent = async () => {
//       try {
//         if (id) {
//           const response = await eventService.fetchEvent(id);
//           if (response.success) {
//             setEvent(response.data);
//           }
//         }
//       } catch (error) {
//         console.error("Failed to fetch event", error);
//       }
//     };

//     fetchEvent();
//   }, [id]);

//   const handleRsvp = async (status: "going" | "interested") => {
//     try {
//       if (id) {
//         await eventService.rsvpEvent(id, status);
//         // Optionally, refresh the event data to show the new RSVP
//         const response = await eventService.fetchEvent(id);
//         if (response.success) {
//           setEvent(response.data);
//         }
//       }
//     } catch (error) {
//       console.error("Failed to RSVP", error);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       if (id) {
//         await eventService.deleteEvent(id);
//         navigate("/events");
//       }
//     } catch (error) {
//       console.error("Failed to delete event", error);
//     }
//   };

//   if (!event) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="p-4">
//       <Button onClick={() => navigate(-1)} className="mb-4">
//         Go Back
//       </Button>
//       <Card>
//         {event.image_url && (
//           <img
//             src={`http://localhost:5001${event.image_url}`}
//             alt={event.title}
//             className="w-full h-96 object-cover"
//           />
//         )}
//         <CardHeader>
//           <CardTitle>{event.title}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p>{event.description}</p>
//           <p className="text-sm text-gray-500 mt-2">
//             {format(new Date(event.date_time), "PPP p")}
//           </p>
//           <p className="text-sm text-gray-500">{event.location}</p>
//           <div className="mt-4">
//             <Button onClick={() => handleRsvp("going")} className="mr-2">
//               Going
//             </Button>
//             <Button onClick={() => handleRsvp("interested")} variant="outline">
//               Interested
//             </Button>
//           </div>
//           {user?.role === UserRole.SUPER_ADMIN && (
//             <div className="mt-4">
//               <Button asChild className="mr-2">
//                 <Link to={`/events/edit/${id}`}>Edit</Link>
//               </Button>
//               <Button onClick={handleDelete} variant="destructive">
//                 Delete
//               </Button>
//             </div>
//           )}
//           <div className="mt-4">
//             <h3 className="font-bold">RSVPs</h3>
//             <ul>
//               {event.rsvps.map((rsvp, index) => (
//                 <li key={index}>
//                   {rsvp.name} ({rsvp.email}) - {rsvp.status}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default EventDetails;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import eventService from "../../../services/event.service";
import { Event } from "../../../types/event";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { format } from "date-fns";
import { useAuth } from "../../../contexts/AuthContext";
import { UserRole } from "../../../types/user";

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (id) {
          const response = await eventService.fetchEvent(id);
          if (response.success) {
            setEvent(response.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch event", error);
      }
    };

    fetchEvent();
  }, [id]);

  const handleRsvp = async (status: "going" | "interested") => {
    try {
      if (id) {
        await eventService.rsvpEvent(id, status);
        const response = await eventService.fetchEvent(id);
        if (response.success) {
          setEvent(response.data);
        }
      }
    } catch (error) {
      console.error("Failed to RSVP", error);
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

  if (!event) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
      {/* Back Button */}
      <Button
        onClick={() => navigate("/events")}
        className="mb-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:opacity-90 shadow-md"
      >
        &larr; Go Back
      </Button>

      {/* Event Card */}
      <Card className="shadow-xl rounded-2xl overflow-hidden">
        {event.image_url && (
          <div className="relative">
            <img
              src={`http://localhost:5001${event.image_url}`}
              alt={event.title}
              className="w-full h-64 sm:h-72 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
                {event.title}
              </h2>
              <p className="text-sm sm:text-base">
                {format(new Date(event.date_time), "PPP p")}
              </p>
              <p className="text-sm sm:text-base">{event.location}</p>
            </div>
          </div>
        )}

        <CardContent className="p-4 sm:p-6">
          {!event.image_url && (
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
            </CardHeader>
          )}

          <p className="mt-2 sm:mt-4 text-gray-700 dark:text-gray-300">
            {event.description}
          </p>

          {/* RSVP Buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              onClick={() => handleRsvp("going")}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:opacity-90 shadow-md"
            >
              Going
            </Button>
            <Button
              onClick={() => handleRsvp("interested")}
              variant="outline"
              className="border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-gray-700"
            >
              Interested
            </Button>
          </div>

          {/* Admin Actions */}
          {user?.role === UserRole.ADMIN && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                asChild
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md"
              >
                <Link to={`/events/edit/${id}`}>Edit</Link>
              </Button>
              <Button
                onClick={() => setShowDeleteConfirm(true)}
                variant="destructive"
                className="shadow-md"
              >
                Delete
              </Button>
            </div>
          )}

          <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Delete</DialogTitle>
              </DialogHeader>
              <p>
                Are you sure you want to delete this event? This action cannot
                be undone.
              </p>
              <DialogFooter className="flex justify-end space-x-2 mt-4">
                <Button onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    handleDelete();
                  }}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md"
                >
                  Yes, Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* RSVP List */}
          {event.rsvps.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg sm:text-xl font-bold mb-2">
                Total Response ({event.rsvps.length})
              </h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                {event.rsvps.map((rsvp, index) => (
                  <li key={index}>
                    {rsvp.name} ({rsvp.email}) - {rsvp.status}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventDetails;
