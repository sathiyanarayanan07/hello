import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Users } from "lucide-react";

interface Project {
  id: number;
  name: string;
  description?: string;
  status: string;
  team: string[];
  startDate: string;
  endDate: string;
  tasks?: Record<string, string[]>; // Tasks for each team member
}

export const ProjectDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const project = (location.state as any)?.project as Project;

  if (!project) {
    return <div className="p-6 text-center">Project not found</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 text-orange-600">{project.name}</h1>

      {/* Project Info Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="border rounded-xl p-4 shadow-sm bg-orange-50">
          <p className="mb-2 font-semibold text-orange-700">Description</p>
          <p>{project.description || "-"}</p>
        </div>
        <div className="border rounded-xl p-4 shadow-sm bg-orange-50">
          <p className="mb-2 font-semibold text-orange-700">Status</p>
          <p>{project.status}</p>
        </div>
        <div className="border rounded-xl p-4 shadow-sm bg-orange-50">
          <p className="mb-2 font-semibold text-orange-700 flex items-center gap-2">
            <Users size={16} /> Team Members
          </p>
          <ul className="list-disc ml-5">
            {project.team.map((member) => (
              <li key={member}>{member}</li>
            ))}
          </ul>
        </div>
        <div className="border rounded-xl p-4 shadow-sm bg-orange-50">
          <p className="mb-2 font-semibold text-orange-700">Timeline</p>
          <p>
            <strong>Start:</strong> {project.startDate}
          </p>
          <p>
            <strong>End:</strong> {project.endDate}
          </p>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 text-orange-600">Tasks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {project.team.map((member) => (
            <div key={member} className="border rounded-xl p-4 shadow-sm bg-white">
              <h3 className="font-semibold mb-2 text-orange-700">{member}</h3>
              <ul className="list-disc ml-5 text-gray-700">
                {(project.tasks?.[member] || []).length > 0 ? (
                  project.tasks![member].map((task, idx) => <li key={idx}>{task}</li>)
                ) : (
                  <li>No tasks assigned</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mt-4 px-4 py-2 rounded-lg bg-orange-200 text-orange-800 hover:bg-orange-300"
      >
        Back
      </button>
    </div>
  );
};
