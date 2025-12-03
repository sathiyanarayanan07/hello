import React, { useState, useMemo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, Users, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Project {
  id: number;
  name: string;
  description?: string;
  status: string;
  team: string[];
  startDate: string;
  endDate: string;
}

const statusOptions = ["Not Started", "In Progress", "Completed"];
let nextId = 4; // dummy id increment

export const ProjectManagement: React.FC = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "Website Redesign",
      description: "Redesign homepage & landing page",
      status: "In Progress",
      team: ["Alice", "Bob"],
      startDate: "2025-10-01",
      endDate: "2025-10-20",
    },
    {
      id: 3,
      name: "Mobile App",
      description: "iOS & Android app",
      status: "Not Started",
      team: ["Charlie"],
      startDate: "2025-10-05",
      endDate: "2025-11-05",
    },
    {
      id: 4,
      name: "Mobile App",
      description: "iOS & Android app",
      status: "Completed",
      team: ["Charlie"],
      startDate: "2025-10-05",
      endDate: "2025-11-05",
    },
    {
      id: 2,
      name: "Mobile App",
      description: "iOS & Android app",
      status: "Not Started",
      team: ["Charlie"],
      startDate: "2025-10-05",
      endDate: "2025-11-05",
    },
  ]);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>(""); // empty means all
  const [filterUser, setFilterUser] = useState<string>(""); // empty means all
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "Not Started",
    team: [] as string[],
    startDate: "",
    endDate: "",
  });

  // Get unique users from projects for filter dropdown
  const allUsers = Array.from(new Set(projects.flatMap((p) => p.team)));

  const openModal = (project?: Project) => {
    if (project) {
      setSelectedProject(project);
      setForm({ ...project });
    } else {
      setSelectedProject(null);
      setForm({
        name: "",
        description: "",
        status: "Not Started",
        team: [],
        startDate: "",
        endDate: "",
      });
    }
    setModalOpen(true);
  };

  const handleSave = () => {
    if (selectedProject) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === selectedProject.id ? { ...form, id: p.id } : p
        )
      );
    } else {
      setProjects((prev) => [...prev, { ...form, id: nextId++ }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  // Multi-factor filtering
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description &&
          p.description.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = filterStatus ? p.status === filterStatus : true;

      const matchesUser = filterUser ? p.team.includes(filterUser) : true;

      return matchesSearch && matchesStatus && matchesUser;
    });
  }, [projects, search, filterStatus, filterUser]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Not Started":
        return "bg-gray-300";
      case "In Progress":
        return "bg-yellow-400";
      case "Completed":
        return "bg-green-400";
      default:
        return "bg-gray-300";
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${d.getFullYear()}`;
  };

  return (
    <div className="p-6 w-full max-w-full mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Project Management
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search projects..."
          className="border p-3 rounded-lg shadow-sm w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-3 rounded-lg w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          className="border p-3 rounded-lg w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
        >
          <option value="">All Users</option>
          {allUsers.map((user) => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </select>

        <Button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
        >
          <Plus size={18} /> Add Project
        </Button>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full border-collapse border border-gray-200 text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3">Name</th>
              <th className="border p-3">Description</th>
              <th className="border p-3">Status</th>
              <th className="border p-3">Team</th>
              <th className="border p-3">Start Date</th>
              <th className="border p-3">End Date</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    navigate(`/projects/${project.id}`, { state: { project } })
                  }
                >
                  <td className="border p-3 font-medium">{project.name}</td>
                  <td className="border p-3">{project.description}</td>
                  <td className="border p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="border p-3 flex justify-center items-center gap-1">
                    <Users size={16} /> {project.team.join(", ")}
                  </td>
                  <td className="border p-3">
                    {formatDate(project.startDate)}
                  </td>
                  <td className="border p-3">{formatDate(project.endDate)}</td>
                  <td className="border p-3 flex justify-center gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(project);
                      }}
                      className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Edit2 size={16} /> Edit
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(project.id);
                      }}
                      className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white"
                    >
                      <Trash2 size={16} /> Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="border p-4 text-gray-500">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 w-96 max-w-full bg-white rounded-xl p-6 shadow-xl -translate-x-1/2 -translate-y-1/2">
            <Dialog.Title className="text-xl font-bold mb-4 text-center">
              {selectedProject ? "Edit Project" : "Add Project"}
            </Dialog.Title>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Project Name"
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <textarea
                placeholder="Description"
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
              <select
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Team members (comma separated)"
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.team.join(", ")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    team: e.target.value.split(",").map((t) => t.trim()),
                  })
                }
              />
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm mb-1">Start Date</label>
                  <input
                    type="date"
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.startDate}
                    onChange={(e) =>
                      setForm({ ...form, startDate: e.target.value })
                    }
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm mb-1">End Date</label>
                  <input
                    type="date"
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.endDate}
                    onChange={(e) =>
                      setForm({ ...form, endDate: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <CheckCircle size={16} /> Save
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};
