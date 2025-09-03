import React, { useState, useRef } from "react";
import { QrReader } from "react-qr-scanner";
import axios from "axios";

export default function ReturnForm() {
  const [formData, setFormData] = useState({
    packageName: "",
    category: "",
    size: "",
    weight: "",
    photo: null,
    qrCode: "",
  });

  const [inputMethod, setInputMethod] = useState("upload"); // "upload", "camera", "qr"
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [qrScanResult, setQrScanResult] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Camera access denied!");
    }
  };

  const capturePhoto = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, 300, 200);
    const imageData = canvasRef.current.toDataURL("image/png");
    setCapturedPhoto(imageData);
    setFormData({ ...formData, photo: imageData });
    const stream = videoRef.current.srcObject;
    if (stream) stream.getTracks().forEach(track => track.stop());
  };

  const handleScan = (result) => {
    if (result) {
      setQrScanResult(result?.text || "");
      setFormData({ ...formData, qrCode: result?.text });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uniqueBarcode = `DG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const data = new FormData();
    data.append("packageName", formData.packageName);
    data.append("category", formData.category);
    data.append("size", formData.size);
    data.append("weight", formData.weight);
    data.append("qrCode", formData.qrCode);
    data.append("uniqueBarcode", uniqueBarcode);

    // If photo is File (upload) or Base64 (camera)
    if (formData.photo instanceof File) {
      data.append("photo", formData.photo);
    } else if (typeof formData.photo === "string") {
      // Convert Base64 to Blob
      const res = await fetch(formData.photo);
      const blob = await res.blob();
      data.append("photo", blob, "photo.png");
    }

    try {
      const token = localStorage.getItem("token"); // auth token
      const response = await axios.post(
        "http://localhost:5000/api/returns/submit",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(`Return submitted! Barcode: ${uniqueBarcode}`);
      console.log(response.data);
      // Clear form
      setFormData({
        packageName: "",
        category: "",
        size: "",
        weight: "",
        photo: null,
        qrCode: "",
      });
      setCapturedPhoto(null);
      setQrScanResult("");
    } catch (err) {
      console.error(err);
      alert("Failed to submit return.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">📦 Return Package Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="packageName" placeholder="Package Name" value={formData.packageName} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring focus:ring-green-300" required />
        <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring focus:ring-green-300" required>
          <option value="">Select Category</option>
          <option value="plastic">Plastic</option>
          <option value="paper">Paper</option>
          <option value="metal">Metal</option>
          <option value="other">Other</option>
        </select>
        <input type="text" name="size" placeholder="Size (e.g. Medium, Large)" value={formData.size} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring focus:ring-green-300" required />
        <input type="number" name="weight" placeholder="Weight (in kg)" value={formData.weight} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring focus:ring-green-300" required />

        <select className="w-full p-3 border rounded-lg focus:ring focus:ring-green-300" value={inputMethod} onChange={(e) => setInputMethod(e.target.value)}>
          <option value="upload">Upload Photo</option>
          <option value="camera">Capture via Camera</option>
          <option value="qr">Scan QR Code</option>
        </select>

        {inputMethod === "upload" && <input type="file" name="photo" accept="image/*" onChange={handleChange} className="w-full p-3 border rounded-lg" />}
        {inputMethod === "camera" && (
          <div className="space-y-2">
            <button type="button" onClick={startCamera} className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow">Start Camera</button>
            <video ref={videoRef} autoPlay className="w-full rounded-lg"></video>
            <canvas ref={canvasRef} width="300" height="200" className="hidden"></canvas>
            <button type="button" onClick={capturePhoto} className="px-4 py-2 bg-green-500 text-white rounded-lg shadow">Capture Photo</button>
            {capturedPhoto && <img src={capturedPhoto} alt="Captured" className="mt-3 rounded-lg" />}
          </div>
        )}

        {inputMethod === "qr" && (
          <div className="w-full">
            <QrReader onResult={(result, error) => { if (!!result) handleScan(result); if (!!error) console.warn(error); }} style={{ width: "100%" }} />
            {qrScanResult && <p className="mt-2 text-green-600">Scanned QR: {qrScanResult}</p>}
          </div>
        )}

        <button type="submit" className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700">Submit Return</button>
      </form>
    </div>
  );
}
