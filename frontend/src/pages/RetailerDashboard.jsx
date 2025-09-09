import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";

export default function RetailerDashboard() {
  const [retailer, setRetailer] = useState(null);
  const [returns, setReturns] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Modal & form states
  const [showScan, setShowScan] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [otp, setOtp] = useState("");
  // Stats calculation
const approvedCount = history.filter(r => r.status?.toLowerCase() === "approved").length;
const rejectedCount = history.filter(r => r.status?.toLowerCase() === "rejected").length;


  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const res = await API.get("/api/returns/history");
      if (res.data.success) setHistory(res.data.data);
      else alert(res.data.message || "Failed to fetch history");
      setHistoryLoading(false);
    } catch (err) {
      console.error("Fetch history error:", err);
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "retailer") {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const profileRes = await API.get("/api/user/profile");
        setRetailer(profileRes.data);

        if (activeTab === "pending") {
          const returnsRes = await API.get(`/api/returns/${activeTab}/all`);
          const returnsData = Array.isArray(returnsRes.data)
            ? returnsRes.data
            : Array.isArray(returnsRes.data.data)
            ? returnsRes.data.data
            : [];
          setReturns(returnsData);
        } else fetchHistory();

        setLoading(false);
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate, activeTab]);

  const openScanForm = async (ret) => {
    try {
      const res = await API.post(`/api/returns/${ret.id}/send-otp`);
      setSelectedReturn(ret);
      setOtp("");
      setShowScan(true);

      if (res.data?.otp) alert(`Demo OTP: ${res.data.otp}`);
      else alert("OTP generated, please check console/logs.");
    } catch (err) {
      console.error(err);
      alert("Failed to generate OTP!");
    }
  };

  const handleReject = (id) => {
    if (!id) return alert("Invalid return ID!");
    if (window.confirm("Are you sure you want to reject this return? ❌")) {
      handleAction(id, "reject");
    }
  };

  const handleFinalApprove = async () => {
    try {
      const res = await API.post(`/api/returns/${selectedReturn.id}/verify-otp`, { otp });
      if (res.data.success) {
        alert(`Return approved successfully! ✅ Earned ${res.data.reward?.points || 0} points`);
        setShowScan(false);
        setSelectedReturn(null);
        setOtp("");

        const returnsRes = await API.get(`/api/returns/pending/all`);
        setReturns(Array.isArray(returnsRes.data.data) ? returnsRes.data.data : []);
        fetchHistory();
        const profileRes = await API.get("/api/user/profile");
        setRetailer(profileRes.data);
      } else alert(res.data.message || "OTP verification failed!");
    } catch (err) {
      console.error(err);
      alert("OTP verification failed!");
    }
  };

  const handleAction = async (id, action) => {
    try {
      const res = await API.patch(`/api/returns/${id}/${action}`);
      alert(`Return ${action}ed successfully!`);
      setReturns((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Action failed!");
    }
  };

  if (!retailer) {
    return (
      <div className="h-screen flex items-center justify-center px-4 bg-gradient-to-b from-[#e0f4e8] to-[#ffffff]">
        <p className="text-lg text-gray-600">Loading retailer profile...</p>
      </div>
    );
  }

  const profileImg = retailer.profilePhoto
    ? `http://localhost:5000/uploads/${retailer.profilePhoto}`
    : "https://placehold.co/100x100?text=Avatar";

  const membershipLevel =
    retailer.greenPoints >= 100
      ? "🌍 Green Champion"
      : retailer.greenPoints >= 50
      ? "🌱 Silver Partner"
      : "🌿 Bronze Partner";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e0f4e8] to-[#ffffff] px-4 sm:px-6 md:px-12 lg:px-24 xl:px-36 py-8 mx-auto">
      {/* Profile */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-xl p-6 shadow-xl gap-6 sm:gap-0">
        <div className="flex items-center gap-4">
          <img src={profileImg} alt="Profile" className="w-16 h-16 rounded-full border object-cover shadow-md" />
          <div>
            <h1 className="text-2xl font-bold text-green-700">Welcome, {retailer.name || "Retailer"}</h1>
            <p className="text-gray-500">
              Membership: <strong>{membershipLevel || "N/A"}</strong>
            </p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <p><strong>Email:</strong> {retailer.email || "N/A"}</p>
          <p><strong>Mobile:</strong> {retailer.retailer?.phone || retailer.userProfile?.mobile || "Not Provided"}</p>
          <p><strong>Green Points:</strong> {retailer.greenPoints || 0}</p>
          <p><strong>Store:</strong> {retailer.retailer?.storeName || "N/A"}</p>
          <p><strong>Category:</strong> {retailer.retailer?.category || "N/A"}</p>
          <p><strong>Accepted Items:</strong> {retailer.retailer?.acceptedItems?.join(", ") || "N/A"}</p>
          <p><strong>City:</strong> {retailer.retailer?.location?.city || "N/A"}</p>
          <p><strong>Address:</strong> {retailer.userProfile?.address || "N/A"}</p>
        </div>
      </div>
    


    
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
  <Card
    title="Total Approved"
    desc={`${approvedCount} returns approved`}
  />
  <Card
    title="Total Rejected"
    desc={`${rejectedCount} returns rejected`}
  />
  <Card
    title="Your Rank"
    desc={`#${retailer.rank || "N/A"} based on approvals`}
  />
  <Card
    title="Settings"
    desc="Manage account info"
    onClick={() => navigate("/retailer/settings")}
  />
</div>


      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["pending", "approved", "rejected"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded ${
              activeTab === tab ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Returns / History */}
      <div className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-xl p-6 rounded-xl">
        <h2 className="text-lg font-semibold mb-4 text-green-700">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} {activeTab === "pending" ? "Packaging Returns" : "History"}
        </h2>

        {activeTab === "pending" ? (
          loading ? (
            <p className="text-gray-500">Loading {activeTab} returns...</p>
          ) : returns.length === 0 ? (
            <p className="text-gray-500">No {activeTab} returns at the moment.</p>
          ) : (
            <ul className="space-y-3">
              {returns.map((ret) => (
                <li key={ret.id} className="border p-4 bg-white rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                  <div className="mb-2 w-full sm:w-auto">
                     <p className="font-medium">  Customer: {ret.user?.name || ret.userName || "Unknown"}</p>
                    <p>Package: {ret.packageName}</p>
                   
                    <p>Size: {ret.size}</p>
                    <p>Category: {ret.category}</p>
                    
                    <p className="text-sm text-gray-500">Initiated At: {new Date(ret.scannedAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openScanForm(ret)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                      Approve
                    </button>
                    <button onClick={() => handleReject(ret.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )
        ) : historyLoading ? (
          <p className="text-gray-500">Loading history...</p>
        ) : history.filter((r) => r.status?.toLowerCase() === activeTab).length === 0 ? (
          <p className="text-gray-500">No {activeTab} returns yet.</p>
        ) : (
          <ul className="space-y-3">
            {history
              .filter((r) => r.status?.toLowerCase() === activeTab)
              .map((ret) => (
                <li key={ret.id} className="border p-4 bg-white rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                  <div className="mb-2 w-full sm:w-auto">
                    <p className="font-medium">  Customer: {ret.user?.name || ret.userName || "Unknown"}</p>
                    <p>Package: {ret.packageName || "Unknown"}</p>
                    
                    <p>Size: {ret.size || "Unknown"}</p>
                    
                    <p>Category: {ret.category || "Unknown"}</p>
                    <p>Barcode: {ret.barcode || "N/A"}</p>
                    <p className="text-sm text-gray-500">
                      {ret.status === "approved" ? "Approved At" : "Rejected At"}: {ret.actionAt ? new Date(ret.actionAt).toLocaleString() : "N/A"}
                    </p>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* OTP Modal */}
      {showScan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Enter OTP for Approval</h2>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="border px-3 py-2 w-full mb-4 rounded"
            />
            <div className="flex justify-end gap-2 flex-wrap">
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowScan(false)}>Cancel</button>
              <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleFinalApprove} disabled={!otp}>
                Verify & Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ title, desc, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className="cursor-pointer w-full backdrop-blur-lg bg-white/80 border border-gray-200 rounded-xl p-6 shadow-xl hover:ring-2 ring-green-600 text-center flex flex-col justify-center h-full"
    >
      <h3 className="text-lg font-semibold mb-2 text-green-800">{title}</h3>
      <p className="text-gray-700">{desc}</p>
    </motion.div>
  );
}
