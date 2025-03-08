"use client";
import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
} from "@mui/material";
import { db } from "@/app/firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { jsPDF } from "jspdf";
import dayjs from "dayjs";
import Navbar from "@/components/Navbar";

export default function ReportPage() {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      const querySnapshot = await getDocs(collection(db, "appointments"));
      const appointmentsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort appointments by appointmentNumber (Ascending Order)
      const sortedAppointments = appointmentsList.sort(
        (a, b) => a.appointmentNumber - b.appointmentNumber
      );

      setAppointments(sortedAppointments);
    };
    fetchAppointments();
  }, []);

  // Filter appointments based on search input
  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.name.toLowerCase().includes(search.toLowerCase()) ||
      appointment.phone.includes(search)
  );

  const generateReportPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("InnoLab Management - Appointment Report", 50, 15);
    doc.setFont("helvetica", "normal");
    let yPos = 30;
    filteredAppointments.forEach((appointment) => {
      doc.text(`Appointment #${appointment.appointmentNumber}`, 20, yPos);
      doc.text(`Name: ${appointment.name}`, 20, yPos + 10);
      doc.text(`Email: ${appointment.email}`, 20, yPos + 20);
      doc.text(`Phone: ${appointment.phone}`, 20, yPos + 30);
      doc.text(`Test: ${appointment.test}`, 20, yPos + 40);
      doc.text(
        `Date: ${dayjs(appointment.date).format("MM/DD/YYYY hh:mm A")}`,
        20,
        yPos + 50
      );
      yPos += 70;
    });
    doc.save("appointment_report.pdf");
  };

  return (
    <div>
      <Navbar />
      <Container maxWidth="md" className="py-12">
        <Typography variant="h4" className="mb-4 pb-4 font-bold text-center">
          Appointment Report
        </Typography>

        {/* Search Input Field */}
        <TextField
          label="Search by Name or Phone"
          variant="outlined"
          fullWidth
          className="mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Test</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.appointmentNumber}</TableCell>
                    <TableCell>{appointment.name}</TableCell>
                    <TableCell>{appointment.email}</TableCell>
                    <TableCell>{appointment.phone}</TableCell>
                    <TableCell>{appointment.test}</TableCell>
                    <TableCell>{appointment.status}</TableCell>
                    <TableCell>
                      {dayjs(appointment.date).format("MM/DD/YYYY hh:mm A")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No matching appointments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

       <div className="mt-6">
       <Button
          variant="contained"
          color="primary"
          className="mt-4"
          onClick={generateReportPDF}
        >
          Download Report
        </Button>
       </div>
      </Container>
    </div>
  );
}
