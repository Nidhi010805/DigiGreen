import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useState, useEffect, useCallback } from "react";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [photo, setPhoto] = useState(null);
  const [address, setAddress] = useState("");
  const [storeName, setStoreName] = useState("");
  const [category, setCategory] = useState("");
  const [acceptedItems, setAcceptedItems] = useState("");

  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const role = localStorage.getItem("role"); // "user" or "retailer"

  const fetchProfile = useCallback(() => {
    API.get("/api/user/profile")
      .then((res) => {
        setUser(res.data);
        setName(res.data.name);
        setMobile(res.data.mobile || "");
        setEmail(res.data.email);
        setAddress(res.data.address || "");

        if (role === "retailer" && res.data.retailer) {
          setStoreName(res.data.retailer.storeName || "");
          setCategory(res.data.retailer.category || "");
          setAcceptedItems(res.data.retailer.acceptedItems?.join(", ") || "");
        }
      })
      .catch(() => navigate("/login"));
  }, [navigate, role]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleProfileUpdate = () => {
    if (!name || !email) return alert("Name and Email are required");

    const payload = { name, mobile, email, address };

    if (role === "retailer") {
      payload.storeName = storeName;
      payload.category = category;
      payload.acceptedItems = acceptedItems.split(",").map((i) => i.trim());
    }

    API.put("/api/user/update", payload)
      .then((res) => {
        alert("Profile updated successfully!");
        setUser(res.data.user);
        navigate(role === "retailer" ? "/retailer/dashboard" : "/user/dashboard");
      })
      .catch(() => alert("Failed to update profile"));
  };

  const handlePasswordChange = () => {
    if (!passwords.currentPassword || !passwords.newPassword) {
      return alert("Please fill both password fields");
    }

    API.post("/api/user/change-password", passwords)
      .then(() => {
        alert("Password changed successfully!");
        setPasswords({ currentPassword: "", newPassword: "" });
      })
      .catch((err) => {
        alert(err.response?.data?.error || "Failed to change password");
      });
  };

  const handlePhotoUpload = () => {
    if (!photo) return alert("Please select a photo");

    const formData = new FormData();
    formData.append("photo", photo);

    API.post("/api/user/upload-photo", formData)
      .then(() => {
        alert("Profile photo updated!");
        setPhoto(null);
        fetchProfile();
      })
      .catch(() => alert("Photo upload failed"));
  };

  const handleRemovePhoto = () => {
    if (!window.confirm("Are you sure you want to remove your profile photo?")) return;

    API.delete("/api/user/remove-photo")
      .then(() => {
        alert("Profile photo removed!");
        fetchProfile();
      })
      .catch(() => alert("Failed to remove photo"));
  };

  const handleDeleteAccount = () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;

    API.delete("/api/user/delete-account")
      .then(() => {
        alert("Your account has been deleted.");
        localStorage.removeItem("token");
        navigate("/signup");
      })
      .catch(() => alert("Failed to delete account"));
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading your settings...</p>
      </div>
    );
  }

  const profilePhotoURL = user.profilePhoto ? `${BASE_URL}/uploads/${user.profilePhoto}` : null;

  return (
    <div className={`max-w-xl mx-auto mt-24 p-6 rounded-lg shadow mb-20
      ${role === "retailer" ? "bg-green-200/80" : "bg-green-100/80"}`}>
      <h2 className="text-2xl font-bold mb-6">
        {role === "retailer" ? "Retailer Settings" : "Account Settings"}
      </h2>

      {/* Basic Info */}
      <div className="mb-4">
        <label className="block mb-1">Name</label>
        <input className="w-full border px-4 py-2 rounded" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Email</label>
        <input className="w-full border px-4 py-2 rounded" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Mobile</label>
        <input className="w-full border px-4 py-2 rounded" value={mobile} onChange={(e) => setMobile(e.target.value)} />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Address</label>
        <input className="w-full border px-4 py-2 rounded" value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>

      {/* Retailer Specific */}
      {role === "retailer" && (
        <>
          <div className="mb-4">
            <label className="block mb-1">Store Name</label>
            <input className="w-full border px-4 py-2 rounded" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Category</label>
            <input className="w-full border px-4 py-2 rounded" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Accepted Items (comma separated)</label>
            <input className="w-full border px-4 py-2 rounded" value={acceptedItems} onChange={(e) => setAcceptedItems(e.target.value)} />
          </div>
        </>
      )}

      <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-6" onClick={handleProfileUpdate}>
        Save Changes
      </button>

      <hr className="my-6" />

      {/* Password */}
      <h3 className="text-lg font-semibold mb-4">Change Password</h3>
      <div className="mb-4">
        <label className="block mb-1">Current Password</label>
        <input type="password" className="w-full border px-4 py-2 rounded" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} />
      </div>
      <div className="mb-4">
        <label className="block mb-1">New Password</label>
        <input type="password" className="w-full border px-4 py-2 rounded" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} />
      </div>
      <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-6" onClick={handlePasswordChange}>
        Change Password
      </button>

      <hr className="my-6" />

      {/* Photo */}
      <h3 className="text-lg font-semibold mb-4">Profile Photo</h3>
      {profilePhotoURL && (
        <div className="mb-4 flex items-center gap-4">
          <img src={profilePhotoURL} alt="Profile" className="w-16 h-16 rounded-full border" />
          <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onClick={handleRemovePhoto}>
            Remove Photo
          </button>
        </div>
      )}
      <input type="file" accept="image/*" className="mb-4" onChange={(e) => setPhoto(e.target.files[0])} />
      <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-6" onClick={handlePhotoUpload}>
        Upload Photo
      </button>

      <hr className="my-6" />

      {/* Danger Zone */}
      <h3 className="text-lg font-semibold mb-4 text-red-600">Danger Zone</h3>
      <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700" onClick={handleDeleteAccount}>
        Delete My Account
      </button>
    </div>
  );
}
