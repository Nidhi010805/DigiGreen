import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";

export default function RetailerDashboard() {
  const [retailer, setRetailer] = useState(null);
  const [returns, setReturns] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(false);

  // Modal & form states
  const [showScan, setShowScan] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

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

        // Fetch retailer profile
        const profileRes = await API.get("/api/user/profile");
        setRetailer(profileRes.data);

        // Fetch returns
        const returnsRes = await API.get(`/api/returns/${activeTab}/all`);
        const returnsData = Array.isArray(returnsRes.data)
          ? returnsRes.data
          : Array.isArray(returnsRes.data.data)
          ? returnsRes.data.data
          : [];
        setReturns(returnsData);

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
    // 🔹 Yaha declare karna zaroori hai
    const res = await API.post(`/api/returns/${ret.id}/send-otp`);

    setSelectedReturn(ret);
    setOtp("");
    setShowScan(true);

    if (res.data?.otp) {
      alert(`Demo OTP: ${res.data.otp}`);
    } else {
      alert("OTP generated, please check console/logs.");
    }
  } catch (err) {
    console.error(err);
    alert("Failed to generate OTP!");
  }
};
const handleReject = (id) => {
  console.log("Rejecting return id:", id); // ✅ debug
  if (!id) {
    alert("Invalid return ID!");
    return;
  }
  if (window.confirm("Are you sure you want to reject this return? ❌")) {
    handleAction(id, "reject");
  }
};




  const handleFinalApprove = async () => {
  try {
    const res = await API.post(`/api/returns/${selectedReturn.id}/verify-otp`, {
      otp,
    });

    if (res.data.success) {
      alert(`Return approved successfully! ✅ Earned ${res.data.reward?.points} points`);
      setReturns((prev) => prev.filter((r) => r.id !== selectedReturn.id));
      setShowScan(false);
      setSelectedReturn(null);
      setOtp("");
    } else {
      alert(res.data.message || "OTP verification failed!");
    }
  } catch (err) {
    console.error(err);
    alert("OTP verification failed!");
  }
};


  const handleAction = async (id, action) => {
  try {
    const res = await API.patch(`/api/returns/${id}/${action}`);
    console.log("Action response:", res.data);
    alert(`Return ${action}ed successfully!`);
    setReturns((prev) => prev.filter((r) => r.id !== id));
  } catch (err) {
    
    alert(
      err.response?.data?.message || "Action failed due to server/network error!"
    );
  }
};


  if (!retailer) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading retailer profile...</p>
      </div>
    );
  }

  const profileImg = retailer.profilePhoto
    ? `http://localhost:5000/uploads/${retailer.profilePhoto}`
    : "https://via.placeholder.com/100?text=Avatar";

  const membershipLevel =
    retailer.greenPoints >= 100
      ? "🌍 Green Champion"
      : retailer.greenPoints >= 50
      ? "🌱 Silver Partner"
      : "🌿 Bronze Partner";

  return (
    <div className="max-w-7xl mx-auto mt-0 bg-green-300/30 py-10 px-24">
      {/* Profile Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 bg-white shadow p-6 rounded-lg">
        <div className="flex items-center gap-4">
          <img
            src={profileImg}
            alt="Profile"
            className="w-16 h-16 rounded-full border object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-green-700">
              Welcome, {retailer.name}
            </h1>
            <p className="text-gray-500">
              Membership: <strong>{membershipLevel}</strong>
            </p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 text-gray-700">
          <p>
            <strong>Email:</strong> {retailer.email}
          </p>
          <p>
            <strong>Mobile:</strong>{" "}
            {retailer.retailer?.phone ||
              retailer.userProfile?.mobile ||
              "Not Provided"}
          </p>
          <p>
            <strong>Green Points:</strong> {retailer.greenPoints || 0}
          </p>
          <p>
            <strong>Store:</strong> {retailer.retailer?.storeName || "N/A"}
          </p>
          <p>
            <strong>Category:</strong> {retailer.retailer?.category || "N/A"}
          </p>
          <p>
            <strong>Accepted Items:</strong>{" "}
            {retailer.retailer?.acceptedItems?.join(", ") || "N/A"}
          </p>
          <p>
            <strong>City:</strong> {retailer.retailer?.location?.city || "N/A"}
          </p>
          <p>
            <strong>Address:</strong> {retailer.userProfile?.address || "N/A"}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Card
          title="Total Approved"
          desc={`${retailer.totalApproved || 0} returns approved`}
        />
        <Card
          title="Total Rejected"
          desc={`${retailer.totalRejected || 0} returns rejected`}
        />
        <Card
          title="Your Rank"
          desc={`#${retailer.rank || "N/A"} based on approvals`}
        />
        <Card
          title="Settings"
          desc="Manage account info"
          onClick={() => navigate("/user/settings")}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {["pending", "approved", "rejected"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded ${
              activeTab === tab
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Return List */}
      <div className="bg-green-500/40 shadow p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Packaging
          Returns
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading {activeTab} returns...</p>
        ) : returns.length === 0 ? (
          <p className="text-gray-500">No {activeTab} returns at the moment.</p>
        ) : (
          <ul className="space-y-3">
            {returns.map((ret) => (
              <li
                key={ret.id}
                className="border p-4 bg-white rounded flex justify-between items-center flex-wrap"
              >
                <div className="mb-2">
                  <p className="font-medium">User: {ret.user?.name}</p>
                  <p>Material: {ret.package?.material || "Unknown"}</p>
                  <p>Size: {ret.package?.size || ret.size || "Unknown"}</p>
                  <p>Weight: {ret.weight} kg</p>
                  <p>Category: {ret.category}</p>
                  <p>Barcode: {ret.uniqueBarcode}</p>
                  <p className="text-sm text-gray-500">
                    Initiated At: {new Date(ret.scannedAt).toLocaleString()}
                  </p>
                </div>
                {activeTab === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => openScanForm(ret)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                   <button
          onClick={() => handleReject(ret.id)}
        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
           Reject
       </button>

                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal for OTP verification */}
      {showScan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">
              Enter OTP for Approval
            </h2>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="border px-3 py-2 w-full mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowScan(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={handleFinalApprove}
                disabled={!otp}
              >
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
      className={`cursor-pointer bg-white shadow p-6 rounded-lg hover:ring-2 ring-green-300 text-center`}
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-500">{desc}</p>
    </motion.div>
  );
}
