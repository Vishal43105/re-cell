import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Inbox,
  FileText,
  LogOut,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  ChevronLeft,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LOGO_URL = "https://customer-assets.emergentagent.com/job_96a9ec26-fc2d-4460-b209-fe063f10fbb5/artifacts/q3o60yd9_Color%20logo%20-%20no%20background.png";

// Auth helper
const getAuthHeader = (username, password) => {
  return {
    Authorization: `Basic ${btoa(`${username}:${password}`)}`
  };
};

// Login Component
const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Test credentials by fetching stats
      await axios.get(`${API}/admin/stats`, {
        headers: getAuthHeader(username, password)
      });
      onLogin(username, password);
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="glass-card rounded-2xl p-8">
          <div className="text-center mb-8">
            <img src={LOGO_URL} alt="Re-Cell Logo" className="h-12 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-zinc-500 text-sm mt-2">Sign in to manage enquiries</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Username</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                className="bg-black/50 border-white/10 focus:border-[#D5A528] text-white"
                data-testid="admin-username"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-black/50 border-white/10 focus:border-[#D5A528] text-white"
                data-testid="admin-password"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#D5A528] hover:bg-[#E7C873] text-black font-semibold py-3 rounded-full"
              data-testid="admin-login-btn"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-xs text-zinc-600 text-center mt-6">
            Default: admin / recell2024!
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const styles = {
    new: "badge-new",
    contacted: "badge-contacted",
    closed: "badge-closed"
  };

  const icons = {
    new: <AlertCircle size={12} />,
    contacted: <Clock size={12} />,
    closed: <CheckCircle size={12} />
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || styles.new}`}>
      {icons[status] || icons.new}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Stats Cards
const StatsCards = ({ stats }) => {
  const cards = [
    { label: "Total Enquiries", value: stats.total, icon: Inbox, color: "text-white" },
    { label: "New", value: stats.new, icon: AlertCircle, color: "text-[#D5A528]" },
    { label: "Contacted", value: stats.contacted, icon: Clock, color: "text-blue-400" },
    { label: "Closed", value: stats.closed, icon: CheckCircle, color: "text-green-400" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          className="bg-[#09090b] border border-white/5 rounded-xl p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-zinc-500 uppercase tracking-wider">{card.label}</span>
            <card.icon size={18} className={card.color} />
          </div>
          <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
        </motion.div>
      ))}
    </div>
  );
};

// Enquiry Detail Modal
const EnquiryDetail = ({ enquiry, onClose, onUpdateStatus, onDelete }) => {
  if (!enquiry) return null;

  return (
    <DialogContent className="bg-[#09090b] border-white/10 text-white max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <span>Enquiry Details</span>
          <StatusBadge status={enquiry.status} />
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6 mt-4">
        {/* Contact Info */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#D5A528]/10 flex items-center justify-center">
                <Mail size={14} className="text-[#D5A528]" />
              </div>
              <div>
                <p className="text-xs text-zinc-500">Name</p>
                <p className="text-white font-medium">{enquiry.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#D5A528]/10 flex items-center justify-center">
                <Package size={14} className="text-[#D5A528]" />
              </div>
              <div>
                <p className="text-xs text-zinc-500">Company</p>
                <p className="text-white font-medium">{enquiry.company}</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#D5A528]/10 flex items-center justify-center">
                <Mail size={14} className="text-[#D5A528]" />
              </div>
              <div>
                <p className="text-xs text-zinc-500">Email</p>
                <a href={`mailto:${enquiry.email}`} className="text-[#D5A528] hover:underline">{enquiry.email}</a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#D5A528]/10 flex items-center justify-center">
                <Phone size={14} className="text-[#D5A528]" />
              </div>
              <div>
                <p className="text-xs text-zinc-500">Phone</p>
                <p className="text-white">{enquiry.phone || "Not provided"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="grid sm:grid-cols-4 gap-3">
          {[
            { label: "Region", value: enquiry.region },
            { label: "Volume", value: enquiry.volume },
            { label: "Products", value: enquiry.products },
            { label: "Grade", value: enquiry.grade },
          ].map((item, i) => (
            <div key={i} className="bg-black/40 rounded-lg p-3">
              <p className="text-xs text-zinc-500 mb-1">{item.label}</p>
              <p className="text-white text-sm font-medium">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Message */}
        <div className="bg-black/40 rounded-lg p-4">
          <p className="text-xs text-zinc-500 mb-2">Message</p>
          <p className="text-white whitespace-pre-wrap">{enquiry.message}</p>
        </div>

        {/* Timestamp */}
        <p className="text-xs text-zinc-500">
          Submitted: {new Date(enquiry.created_at).toLocaleString()}
        </p>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
          <Select
            value={enquiry.status}
            onValueChange={(v) => onUpdateStatus(enquiry.id, v)}
          >
            <SelectTrigger className="w-40 bg-black/50 border-white/10 text-white">
              <SelectValue placeholder="Update status" />
            </SelectTrigger>
            <SelectContent className="bg-[#09090b] border-white/10">
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <a href={`mailto:${enquiry.email}`}>
            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
              <Mail size={16} className="mr-2" />
              Send Email
            </Button>
          </a>

          <Button
            variant="outline"
            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            onClick={() => onDelete(enquiry.id)}
          >
            <Trash2 size={16} className="mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

// Main Dashboard Component
const Dashboard = ({ auth, onLogout }) => {
  const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0, closed: 0 });
  const [enquiries, setEnquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const headers = getAuthHeader(auth.username, auth.password);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [statsRes, enquiriesRes] = await Promise.all([
        axios.get(`${API}/admin/stats`, { headers }),
        axios.get(`${API}/admin/enquiries`, { headers })
      ]);
      setStats(statsRes.data);
      setEnquiries(enquiriesRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    fetchData();
    // Seed FAQ on first load
    axios.post(`${API}/admin/seed-faq`, {}, { headers }).catch(() => {});
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/admin/enquiries/${id}`, { status }, { headers });
      toast.success("Status updated");
      fetchData();
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry(prev => ({ ...prev, status }));
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/admin/enquiries/${id}`, { headers });
      toast.success("Enquiry deleted");
      setDeleteId(null);
      setSelectedEnquiry(null);
      fetchData();
    } catch (error) {
      toast.error("Failed to delete enquiry");
    }
  };

  const handleExport = () => {
    window.open(`${API}/admin/enquiries/export/csv?Authorization=${btoa(`${auth.username}:${auth.password}`)}`, '_blank');
  };

  // Filter enquiries
  const filteredEnquiries = enquiries.filter(e => {
    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    const matchesSearch = searchQuery === "" || 
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-[#09090b] border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-3">
              <img src={LOGO_URL} alt="Re-Cell Logo" className="h-8" />
              <span className="text-white font-semibold hidden sm:block">Admin Dashboard</span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 text-white hover:bg-white/5"
              onClick={fetchData}
              data-testid="refresh-btn"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 text-white hover:bg-white/5"
              onClick={onLogout}
              data-testid="logout-btn"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Stats */}
          <StatsCards stats={stats} />

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, company, or email..."
                className="pl-10 bg-[#09090b] border-white/10 focus:border-[#D5A528] text-white"
                data-testid="search-input"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-[#09090b] border-white/10 text-white" data-testid="status-filter">
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent className="bg-[#09090b] border-white/10">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="border-[#D5A528]/30 text-[#D5A528] hover:bg-[#D5A528]/10"
              onClick={handleExport}
              data-testid="export-btn"
            >
              <Download size={16} className="mr-2" />
              Export CSV
            </Button>
          </div>

          {/* Table */}
          <div className="bg-[#09090b] border border-white/5 rounded-xl overflow-hidden">
            <Table className="data-table">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-zinc-400 font-medium">Company</TableHead>
                  <TableHead className="text-zinc-400 font-medium">Contact</TableHead>
                  <TableHead className="text-zinc-400 font-medium">Region</TableHead>
                  <TableHead className="text-zinc-400 font-medium">Products</TableHead>
                  <TableHead className="text-zinc-400 font-medium">Volume</TableHead>
                  <TableHead className="text-zinc-400 font-medium">Status</TableHead>
                  <TableHead className="text-zinc-400 font-medium">Date</TableHead>
                  <TableHead className="text-zinc-400 font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-zinc-500">
                      <RefreshCw size={24} className="animate-spin mx-auto mb-2" />
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredEnquiries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-zinc-500">
                      <Inbox size={32} className="mx-auto mb-2 opacity-50" />
                      No enquiries found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEnquiries.map((enquiry) => (
                    <TableRow
                      key={enquiry.id}
                      className="cursor-pointer"
                      onClick={() => setSelectedEnquiry(enquiry)}
                      data-testid={`enquiry-row-${enquiry.id}`}
                    >
                      <TableCell>
                        <div>
                          <p className="text-white font-medium">{enquiry.company}</p>
                          <p className="text-xs text-zinc-500">{enquiry.name}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-zinc-300 text-sm">{enquiry.email}</p>
                      </TableCell>
                      <TableCell className="text-zinc-400">{enquiry.region}</TableCell>
                      <TableCell className="text-zinc-400">{enquiry.products}</TableCell>
                      <TableCell className="text-zinc-400">{enquiry.volume}</TableCell>
                      <TableCell>
                        <StatusBadge status={enquiry.status} />
                      </TableCell>
                      <TableCell className="text-zinc-500 text-sm">
                        {new Date(enquiry.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-zinc-400 hover:text-[#D5A528]"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEnquiry(enquiry);
                          }}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-zinc-400 hover:text-red-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteId(enquiry.id);
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </main>

      {/* Enquiry Detail Modal */}
      <Dialog open={!!selectedEnquiry} onOpenChange={() => setSelectedEnquiry(null)}>
        <EnquiryDetail
          enquiry={selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          onUpdateStatus={handleUpdateStatus}
          onDelete={(id) => {
            setSelectedEnquiry(null);
            setDeleteId(id);
          }}
        />
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-[#09090b] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Enquiry?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              This action cannot be undone. The enquiry will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/5">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => handleDelete(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Main Admin Dashboard
const AdminDashboard = () => {
  const [auth, setAuth] = useState(null);

  const handleLogin = (username, password) => {
    setAuth({ username, password });
  };

  const handleLogout = () => {
    setAuth(null);
  };

  if (!auth) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return <Dashboard auth={auth} onLogout={handleLogout} />;
};

export default AdminDashboard;
