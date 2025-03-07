
'use client'
import { useState, useEffect } from "react";
import { TextField, Button, Typography, Container, MenuItem, Stack, Card, CardContent } from "@mui/material";
import { FaCalendarCheck } from "react-icons/fa";
import { db } from "@/app/firebase/firebaseConfig";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import dayjs from "dayjs";


const testOptions = [
  "Complete Blood Count (CBC)",
  "Liver Function Test (LFT)",
  "Kidney Function Test (KFT)",
  "Lipid Profile",
  "Thyroid Panel",
];

export default function Appointment() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    test: "",
    date: "",
    appointmentNumber: 1,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLastAppointmentNumber = async () => {
      const q = query(collection(db, "appointments"), orderBy("appointmentNumber", "desc"));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setFormData((prev) => ({ ...prev, appointmentNumber: querySnapshot.docs[0].data().appointmentNumber + 1 }));
      }
    };
    fetchLastAppointmentNumber();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generatePDF = async (data) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#007BFF");
    doc.text("InnoLab Management System", 60, 15);
    doc.text("Appointment Invoice", 70, 25);
    doc.setFont("helvetica", "normal");
    doc.setTextColor("black");
    const formattedDate = dayjs(data.date).format("MM/DD/YYYY hh:mm A");
    doc.text(`Name: ${data.name}`, 20, 40);
    doc.text(`Email: ${data.email}`, 20, 50);
    doc.text(`Phone: ${data.phone}`, 20, 60);
    doc.text(`Test: ${data.test}`, 20, 70);
    doc.text(`Date: ${formattedDate}`, 20, 80);
    doc.text(`Appointment No: ${data.appointmentNumber}`, 20, 90);
    
    const qrData = `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nTest: ${data.test}\nDate: ${formattedDate}\nAppointment No: ${data.appointmentNumber}`;
    try {
      const qrDataURL = await QRCode.toDataURL(qrData, { errorCorrectionLevel: 'H' });
      doc.addImage(qrDataURL, "PNG", 150, 40, 50, 50);
    } catch (error) {
      console.error("QR Code generation failed", error);
    }
    
    doc.setFontSize(10);
    doc.text("Thank you for booking with our laboratory!", 20, 120);
    doc.text("Our team will be in touch for further details.", 20, 130);
    
    try {
      const img = new Image();
      img.src = "/logo.png";
      img.onload = () => doc.addImage(img, "PNG", 20, 140, 40, 40);
    } catch (error) {
      console.error("Logo not found or corrupt:", error);
    }
    
    doc.save("appointment_invoice.pdf");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const appointmentData = { ...formData };
      await addDoc(collection(db, "appointments"), appointmentData);
      await generatePDF(appointmentData);
      alert("Appointment booked successfully!");
      setFormData({ name: "", email: "", phone: "", test: "", date: "", appointmentNumber: formData.appointmentNumber + 1 });
    } catch (error) {
      alert("Error booking appointment: " + error.message);
    }
    setLoading(false);
  };

  return (
   <div>
  
    <Container maxWidth="sm" className="py-12">
      <Card className="shadow-lg p-6 rounded-xl border border-gray-200">
        <CardContent>
          <Typography variant="h4" className="text-[#00b4d8] font-bold mb-6 pb-6 flex items-center gap-3">
            <FaCalendarCheck className="text-3xl" /> Book an Appointment
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField fullWidth variant="outlined" label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
              <TextField fullWidth variant="outlined" label="Email" name="email" value={formData.email} onChange={handleChange} required />
              <TextField fullWidth variant="outlined" label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
              <TextField fullWidth select variant="outlined" label="Select Test" name="test" value={formData.test} onChange={handleChange} required>
                {testOptions.map((test, index) => (
                  <MenuItem key={index} value={test}>{test}</MenuItem>
                ))}
              </TextField>
              <TextField fullWidth type="datetime-local" variant="outlined" label="Appointment Date" name="date" value={formData.date} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
              <Button type="submit" variant="contained" color="primary" className="py-2 rounded-lg text-lg shadow-md" style={{ backgroundColor: "#00b4d8" }} disabled={loading}>
                {loading ? "Booking..." : "Confirm Appointment"}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Container>
   </div>
  );
}
