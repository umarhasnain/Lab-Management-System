import { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app,db } from "@/app/firebase/firebaseConfig";



const PatientHistory = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reportsRef = collection(db, "test_reports");
        const querySnapshot = await getDocs(reportsRef);
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setReports(data);
      } catch (err) {
        setError("Failed to fetch reports.");
      }
      setLoading(false);
    };

    fetchReports();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Lab Technician Dashboard</h2>

      {loading && <p className="text-blue-500 text-center">Loading patient history...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {reports.length === 0 && !loading ? (
        <p className="text-gray-600 text-center">No patient history found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Patient Name</th>
                <th className="p-2 border">Test Type</th>
                <th className="p-2 border">Result</th>
                <th className="p-2 border">Doctor</th>
                <th className="p-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="text-center border-t">
                  <td className="p-2 border">{report.patientName}</td>
                  <td className="p-2 border">{report.testType}</td>
                  <td className="p-2 border">{report.result}</td>
                  <td className="p-2 border">{report.doctorName}</td>
                  <td className="p-2 border">{new Date(report.date.toDate()).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PatientHistory;
