'use client'
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase/firebaseConfig";
import { Card, CardContent, CardHeader, Typography, CircularProgress, Grid, Box, Button } from "@mui/material";
import { FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "appointments"));
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

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="p-6">
      <Typography variant="h4" className="font-bold text-center mb-6">Lab Technician Dashboard</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card className="shadow-lg p-4">
            <CardHeader title="Total Appointments" />
            <CardContent className="flex flex-col items-center">
              <FiCheckCircle className="text-green-500 text-5xl mb-2" />
              <Typography variant="h5" className="font-bold">{appointments.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="shadow-lg p-4">
            <CardHeader title="Pending Reports" />
            <CardContent className="flex flex-col items-center">
              <FiClock className="text-yellow-500 text-5xl mb-2" />
              <Typography variant="h5" className="font-bold">{appointments.filter(a => a.status === "Pending").length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="shadow-lg p-4">
            <CardHeader title="Completed Tests" />
            <CardContent className="flex flex-col items-center">
              <FiCheckCircle className="text-blue-500 text-5xl mb-2" />
              <Typography variant="h5" className="font-bold">{appointments.filter(a => a.status === "Completed").length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <div className="mt-8 flex justify-center">
        <Button variant="contained" color="primary">View Reports</Button>
      </div>
    </div>
  );
};

export default Dashboard;