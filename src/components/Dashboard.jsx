'use client'
import { useEffect, useState } from "react";
import { db } from "@/app/firebase/firebaseConfig";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { Container, Typography, Grid, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { FaUsers, FaCalendarCheck, FaFileInvoiceDollar, FaFlask } from "react-icons/fa";

export default function AdminDashboard() {
  const [patients, setPatients] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const patientsSnap = await getDocs(collection(db, "patients"));
      setPatients(patientsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      const techniciansSnap = await getDocs(collection(db, "technicians"));
      setTechnicians(techniciansSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      const appointmentsSnap = await getDocs(collection(db, "appointments"));
      setAppointments(appointmentsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      // Calculate earnings (Example: Assuming each test costs $50)
      setEarnings(appointmentsSnap.docs.length * 50);
    };
    fetchData();
  }, []);

  return (
    <Container maxWidth="lg" className="py-12">
      <Typography variant="h4" className="font-bold mb-6 pb-6 text-[#00b4d8]">Admin Dashboard</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="shadow-lg p-4 border border-gray-200">
            <CardContent className="flex items-center gap-4">
              <FaUsers className="text-3xl text-blue-600" />
              <div>
                <Typography variant="h6">Patients</Typography>
                <Typography variant="h5" className="font-bold">{patients.length}</Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="shadow-lg p-4 border border-gray-200">
            <CardContent className="flex items-center gap-4">
              <FaFlask className="text-3xl text-green-600" />
              <div>
                <Typography variant="h6">Lab Technicians</Typography>
                <Typography variant="h5" className="font-bold">{technicians.length}</Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="shadow-lg p-4 border border-gray-200">
            <CardContent className="flex items-center gap-4">
              <FaCalendarCheck className="text-3xl text-orange-600" />
              <div>
                <Typography variant="h6">Appointments</Typography>
                <Typography variant="h5" className="font-bold">{appointments.length}</Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="shadow-lg p-4 border border-gray-200">
            <CardContent className="flex items-center gap-4">
              <FaFileInvoiceDollar className="text-3xl text-red-600" />
              <div>
                <Typography variant="h6">Earnings</Typography>
                <Typography variant="h5" className="font-bold">${earnings}</Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Appointment Table */}
      <Typography variant="h5" className="mt-20 py-16 mb-4">Recent Appointments</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Test</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.slice(0, 5).map((appt) => (
              <TableRow key={appt.id}>
                <TableCell>{appt.name}</TableCell>
                <TableCell>{appt.email}</TableCell>
                <TableCell>{appt.phone}</TableCell>
                <TableCell>{appt.test}</TableCell>
                <TableCell>{appt.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

