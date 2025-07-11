import { useEffect, useState } from "react";
import { authAPI } from "../utils/api";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { 
  Crown, 
  Plus, 
  Globe, 
  Calendar, 
  BarChart3, 
  Settings, 
  LogOut, 
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  ExternalLink,
  Download,
  Copy,
  Star,
  TrendingUp
} from "lucide-react";

export const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authAPI.me();
        setUser(res.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleEditWebsite = (websiteId: string) => {
    // Navigate to builder with website ID for editing
    navigate(`/builder?edit=${websiteId}`);
  };

  const handleDeleteWebsite = async (websiteId: string) => {
    if (window.confirm('Are you sure you want to delete this website? This action cannot be undone.')) {
      try {
        // Add delete API call here when backend supports it
        console.log('Deleting website:', websiteId);
        // Refresh user data after deletion
        const res = await authAPI.me();
        setUser(res.data.user);
      } catch (error) {
        console.error('Error deleting website:', error);
      }
    }
  };

  const handleCopyUrl = (websiteId: string) => {
    const url = `http://localhost:3001/generated/${websiteId}/index.html`;
    navigator.clipboard.writeText(url);
    // You could add a toast notification here
    alert('Website URL copied to clipboard!');
  };

  const filteredWebsites = user?.websites?.filter((site: any) => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || site.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT": return "bg-amber-100 text-amber-800 border-amber-200";
      case "PUBLISHED": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "REVIEW": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getIndustryIcon = (industry: string) => {
    switch (industry.toLowerCase()) {
      case 'pharmacy': return '💊';
      case 'cosmetics': return '💄';
      case 'education': return '🎓';
      case 'restaurant': return '🍽️';
      case 'fitness': return '💪';
      default: return '🌐';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    WebsiteBoss
                  </h1>
                  <p className="text-xs text-gray-500">Dashboard</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/builder")}
                className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">New Website</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
            Welcome back, {user.name.split(' ')[0]}! 👋
          </h2>
          <p className="text-gray-600 text-lg">
            Manage your websites and track your online presence
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Websites</p>
                <p className="text-3xl font-bold text-gray-900">{user.websites?.length || 0}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +2 this month
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Globe className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Published</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {user.websites?.filter((site: any) => site.status === 'PUBLISHED').length || 0}
                </p>
                <p className="text-xs text-emerald-600 flex items-center mt-1">
                  <Star className="w-3 h-3 mr-1" />
                  Live websites
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">In Draft</p>
                <p className="text-3xl font-bold text-amber-600">
                  {user.websites?.filter((site: any) => site.status === 'DRAFT').length || 0}
                </p>
                <p className="text-xs text-amber-600 flex items-center mt-1">
                  <Edit className="w-3 h-3 mr-1" />
                  Work in progress
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Edit className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">This Month</p>
                <p className="text-3xl font-bold text-purple-600">
                  {user.websites?.filter((site: any) => 
                    moment(site.createdAt).isAfter(moment().startOf('month'))
                  ).length || 0}
                </p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <Calendar className="w-3 h-3 mr-1" />
                  New creations
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search websites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-72 bg-white/50 backdrop-blur-sm"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-11 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white/50 backdrop-blur-sm"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="review">Review</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-500">
                {filteredWebsites.length} of {user.websites?.length || 0} websites
              </p>
              <button className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 transition-colors">
                <Settings className="w-4 h-4" />
                <span className="text-sm font-medium">Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Websites Grid */}
        {filteredWebsites.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {searchTerm || filterStatus !== "all" ? "No websites found" : "No websites created yet"}
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {searchTerm || filterStatus !== "all" 
                ? "Try adjusting your search or filter criteria to find what you're looking for"
                : "Create your first website to get started with WebsiteBoss and establish your online presence"
              }
            </p>
            <button
              onClick={() => navigate("/builder")}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Website</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWebsites.map((site: any) => (
              <div
                key={site.id}
                className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">{getIndustryIcon(site.industry)}</span>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {site.name}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500 capitalize">
                        {site.industry} • Created {moment(site.createdAt).format("MMM D, YYYY")}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusColor(site.status)}`}>
                        {site.status}
                      </span>
                      <div className="relative">
                        <button 
                          onClick={() => setShowDropdown(showDropdown === site.id ? null : site.id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {showDropdown === site.id && (
                          <div className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10 min-w-[160px]">
                            <button
                              onClick={() => {
                                handleCopyUrl(site.id);
                                setShowDropdown(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                            >
                              <Copy className="w-4 h-4" />
                              <span>Copy URL</span>
                            </button>
                            <button
                              onClick={() => {
                                // Add download functionality
                                setShowDropdown(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                            >
                              <Download className="w-4 h-4" />
                              <span>Download</span>
                            </button>
                            <hr className="my-1" />
                            <button
                              onClick={() => {
                                handleDeleteWebsite(site.id);
                                setShowDropdown(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => window.open(`http://localhost:3001/generated/${site.id}/index.html`, "_blank")}
                        className="flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-700 transition-colors font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Preview</span>
                      </button>
                      
                      <button 
                        onClick={() => handleEditWebsite(site.id)}
                        className="flex items-center space-x-1 text-sm text-emerald-600 hover:text-emerald-700 transition-colors font-medium"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                    </div>
                    
                    <button
                      onClick={() => window.open(`http://localhost:3001/generated/${site.id}/index.html`, "_blank")}
                      className="text-gray-400 hover:text-indigo-600 transition-colors p-2 hover:bg-indigo-50 rounded-lg"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>Updated {moment(site.updatedAt).fromNow()}</span>
                    </span>
                    {site.domain && (
                      <span className="text-indigo-600 font-medium">{site.domain}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};