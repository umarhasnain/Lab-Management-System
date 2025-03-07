'use client'
import { useState, useEffect } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import { db } from "@/app/firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { jsPDF } from "jspdf";
import dayjs from "dayjs";

export default function ReportPage() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const querySnapshot = await getDocs(collection(db, "appointments"));
      const appointmentsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAppointments(appointmentsList);
    };
    fetchAppointments();
  }, []);

  const generateReportPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("InnoLab Management - Appointment Report", 50, 15);
    doc.setFont("helvetica", "normal");
    let yPos = 30;
    appointments.forEach((appointment, index) => {
      doc.text(`Appointment #${appointment.appointmentNumber}`, 20, yPos);
      doc.text(`Name: ${appointment.name}`, 20, yPos + 10);
      doc.text(`Email: ${appointment.email}`, 20, yPos + 20);
      doc.text(`Phone: ${appointment.phone}`, 20, yPos + 30);
      doc.text(`Test: ${appointment.test}`, 20, yPos + 40);
      doc.text(`Date: ${dayjs(appointment.date).format("MM/DD/YYYY hh:mm A")}`, 20, yPos + 50);
      yPos += 70;
    });
    doc.save("appointment_report.pdf");
  };

  return (
    <Container maxWidth="md" className="py-12">
      <Typography variant="h4" className="mb-4 font-bold text-center">Appointment Report</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Test</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment, index) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.appointmentNumber}</TableCell>
                <TableCell>{appointment.name}</TableCell>
                <TableCell>{appointment.email}</TableCell>
                <TableCell>{appointment.phone}</TableCell>
                <TableCell>{appointment.test}</TableCell>
                <TableCell>{dayjs(appointment.date).format("MM/DD/YYYY hh:mm A")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" color="primary" className="mt-4" onClick={generateReportPDF}>
        Download Report
      </Button>
    </Container>
  );
}
