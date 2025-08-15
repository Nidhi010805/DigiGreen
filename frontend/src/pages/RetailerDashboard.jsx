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
  const [material, setMaterial] = useState("");
  const [size, setSize] = useState("");

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
        const profileRes = await API.get("/api/user/profile");
        setRetailer(profileRes.data);

        const returnsRes = await API.get(
          `/api/returnpackaging/all?status=${activeTab}`
        );
        setReturns(returnsRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate, activeTab]);

  const openScanForm = (ret) => {
    setSelectedReturn(ret);
    setMaterial("");
    setSize("");
    setShowScan(true);
  };

  const handleFinalApprove = async () => {
    if (!material || !size) {
      alert("Please select both material and size.");
      return;
    }
    try {
      await API.put(`/api/returnpackaging/approve/${selectedReturn.id}`, {
        material,
        size,
        productId: selectedReturn.order.product.id,
      });
      alert("Return approved and points added!");
      setReturns((prev) => prev.filter((r) => r.id !== selectedReturn.id));
      setShowScan(false);
      setSelectedReturn(null);
      setMaterial("");
      setSize("");
    } catch (err) {
      console.error(err.response?.data || err.message || err);
      alert("Approval failed!");
    }
  };

  const handleAction = async (id, action) => {
    try {
      await API.put(`/api/returnpackaging/${action}/${id}`);
      alert(`Return ${action}ed successfully!`);
      setReturns((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      alert("Action failed");
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
            <strong>Mobile:</strong> {retailer.mobile || "Not Provided"}
          </p>
          <p>
            <strong>Green Points:</strong> {retailer.greenPoints}
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
                  <p>Material: {ret.order?.product?.material}</p>
                  <p>Size: {ret.order?.product?.size}</p>
                  <p className="text-sm text-gray-500">
                    Initiated At: {new Date(ret.createdAt).toLocaleString()}
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
                      onClick={() => handleAction(ret.id, "reject")}
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

      {/* Modal for size & material selection */}
      {showScan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">
              Select Material & Size
            </h2>

            <label className="block mb-2">Material:</label>
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="border px-3 py-2 w-full mb-4"
            >
              <option value="">Select Material</option>
              <option value="Plastic">Plastic</option>
              <option value="Paper">Paper</option>
              <option value="Cardboard">Cardboard</option>
            </select>

            <label className="block mb-2">Size:</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="border px-3 py-2 w-full mb-4"
            >
              <option value="">Select Size</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>

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
                disabled={!material || !size}
              >
                Approve & Add Points
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
