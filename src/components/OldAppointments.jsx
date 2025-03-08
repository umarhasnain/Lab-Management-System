'use client';
import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/app/firebase/firebaseConfig";
import { Card, CardContent, CardHeader, Typography, CircularProgress, Box, Select, MenuItem, TextField } from "@mui/material";

const AppointmentProcessing = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "old_appointments"));
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "old_appointments", id), { status: newStatus });
      setAppointments((prev) => prev.map(appt => appt.id === id ? { ...appt, status: newStatus } : appt));
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  const filteredAppointments = appointments.filter(appointment => 
    (appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.appointmentNumber.toString().includes(searchTerm)) &&
    (!selectedDate || appointment.date === selectedDate)
  );

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="p-6">
      <Typography variant="h4" className="font-bold text-center mb-6 pb-6 text-blue-600">Lab Technician Dashboard</Typography>
      <Box className="flex gap-4 mb-4 flex-wrap">
        <TextField 
          fullWidth 
          variant="outlined" 
          placeholder="Search by Name or Appointment No" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <TextField 
          fullWidth 
          type="date" 
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)} 
        />
      </Box>
      <Box className="flex flex-wrap justify-center gap-6">
        {filteredAppointments.map((appointment) => (
          <Card key={appointment.id} className="shadow-lg p-4 border-l-4 border-blue-500 w-full sm:w-5/6 md:w-1/2 lg:w-[250px]">
            <CardHeader 
              title={<Typography variant="h6" className="font-semibold text-gray-800">{appointment.name}</Typography>} 
              subheader={
                <div>
                  <Typography variant="body2" className="text-gray-500">Test: {appointment.test}</Typography>
                  <Typography variant="body2" className="text-gray-500">Phone: {appointment.phone}</Typography>
                  <Typography variant="body2" className="text-gray-500">Appointment Number: {appointment.appointmentNumber}</Typography>
                  <Typography variant="body2" className="text-gray-500">Date: {appointment.date}</Typography>
                  <Typography variant="body2" className="text-gray-500">Status: {appointment.status}</Typography>
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
            </CardContent>
          </Card>
        ))}
      </Box>
    </div>
  );
};

export default AppointmentProcessing;
