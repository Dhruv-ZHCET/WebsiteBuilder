import { useEffect, useState } from "react";
import { authAPI } from "../utils/api";
import { useNavigate } from "react-router-dom";
import moment from "moment";

export const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authAPI.me();
        setUser(res.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  if (!user) {
    return (
      <div className="p-10 text-center text-gray-500">Loading dashboard...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome, {user.name}
            </h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <button
            onClick={() => navigate("/builder")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition"
          >
            + Create New Website
          </button>
        </div>

        {/* Websites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.websites.map((site: any) => (
            <div
              key={site.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-all border border-gray-200 cursor-pointer"
              onClick={() =>
                window.open(
                  `http://localhost:3001/generated/${site.id}/index.html`,
                  "_blank"
                )
              }
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                {site.name}
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                Industry: <span className="capitalize">{site.industry}</span>
              </p>

              <div className="flex items-center justify-between mt-2">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    site.status === "DRAFT"
                      ? "bg-yellow-100 text-yellow-700"
                      : site.status === "PUBLISHED"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {site.status}
                </span>

                <span className="text-xs text-gray-400">
                  {moment(site.createdAt).format("MMM D, YYYY")}
                </span>
              </div>
            </div>
          ))}
        </div>

        {user.websites.length === 0 && (
          <p className="text-center text-gray-500 mt-20">
            No websites created yet.
          </p>
        )}
      </div>
    </div>
  );
};
