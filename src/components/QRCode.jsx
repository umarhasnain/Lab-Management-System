import { useState } from "react";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import QrScanner from "react-qr-scanner";

// Firebase Config (Replace with your actual credentials)
const firebaseConfig = {
    apiKey: "AIzaSyBX5zzADOTTzeo3xi5vBUydwKNfdV1SdOc",
    authDomain: "smit-batch-9-75dc8.firebaseapp.com",
    databaseURL: "https://smit-batch-9-75dc8-default-rtdb.firebaseio.com",
    projectId: "smit-batch-9-75dc8",
    storageBucket: "smit-batch-9-75dc8.appspot.com",
    messagingSenderId: "467611414345",
    appId: "1:467611414345:web:1d10ee360efaa158663498"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const QRCodeScanner = () => {
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async (data) => {
    if (data) {
      setLoading(true);
      try {
        // Fetch appointment details from Firestore
        const appointmentsRef = collection(db, "appointments");
        const q = query(appointmentsRef, where("appointmentId", "==", data.text)); // `data.text` contains the scanned QR data
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const appointment = querySnapshot.docs[0].data();
          setScannedData(appointment);
          setError(null);
        } else {
          setScannedData(null);
          setError("No appointment found for this QR Code.");
        }
      } catch (err) {
        setError("Error fetching data.");
      }
      setLoading(false);
    }
  };

  const handleError = (err) => {
    setError("QR Scan Error: " + err);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold text-center mb-4">Scan Patient QR Code</h2>
      
      <QrScanner
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: "100%" }}
      />

      {loading && <p className="text-center text-blue-500">Fetching details...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {scannedData && (
        <div className="mt-4 p-3 border border-gray-300 rounded-md">
          <h3 className="text-lg font-semibold text-gray-700">Appointment Details</h3>
          <p><strong>Name:</strong> {scannedData.patientName}</p>
          <p><strong>Date:</strong> {scannedData.date}</p>
          <p><strong>Time:</strong> {scannedData.time}</p>
          <p><strong>Status:</strong> {scannedData.status}</p>
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner;
