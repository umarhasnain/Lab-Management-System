'use client';
import { useEffect, useState } from "react";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "@/app/firebase/firebaseConfig";
import { Card, CardContent, CardHeader, Typography, CircularProgress, Grid, Box, Select, MenuItem, TextField, Button } from "@mui/material";
import { FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";

const LabTestMan = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testResults, setTestResults] = useState({});

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "appointments"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAppointments(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching appointments:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "appointments", id), { status: newStatus });
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  const handleResultChange = (id, result) => {
    setTestResults((prev) => ({ ...prev, [id]: result }));
  };

  const handleSaveResult = async (id) => {
    try {
      await updateDoc(doc(db, "appointments", id), { testResult: testResults[id] || "" });
    } catch (error) {
      console.error("Error saving test result:", error);
    }
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="p-6">
      <Typography variant="h4" className="font-bold text-center mb-6 text-blue-600">Lab Technician Dashboard</Typography>
      <Grid container spacing={4}>
        {appointments.map((appointment) => (
          <Grid item xs={12} md={6} lg={10} key={appointment.id}>
            <Card className="shadow-lg p-4 border-l-4 border-blue-500 rounded-xl overflow-hidden">
              <CardHeader 
                title={<Typography variant="h6" className="font-semibold text-gray-800">{appointment.name}</Typography>} 
                subheader={
                  <div>
                    <Typography variant="body2" className="text-gray-500">Test: {appointment.test}</Typography>
                    <Typography variant="body2" className="text-gray-500">Phone: {appointment.phone}</Typography>
                    <Typography variant="body2" className="text-gray-500">Appointment Number: {appointment.appointmentNumber}</Typography>
                  </div>
                }
              />
              <CardContent className="flex flex-col gap-4">
                <Typography variant="body1" className="font-medium">Status:</Typography>
                <Select
                  value={appointment.status}
                  onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                  fullWidth
                  className="bg-white shadow-md rounded-md"
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Processing">Processing</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Canceled">Canceled</MenuItem>
                </Select>
                <Typography variant="body1" className="font-medium">Test Result:</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter test result"
                  value={testResults[appointment.id] || appointment.testResult || ""}
                  onChange={(e) => handleResultChange(appointment.id, e.target.value)}
                  className="bg-white shadow-md rounded-md"
                />
                <Button 
                  variant="contained" 
                  color="primary" 
                  className="w-full" 
                  onClick={() => handleSaveResult(appointment.id)}
                >
                  Save Result
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default LabTestMan;
