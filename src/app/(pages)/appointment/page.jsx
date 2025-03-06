'use client'
import { useState, useEffect } from "react";
import { TextField, Button, Typography, Container, MenuItem, Grid, Card, CardContent } from "@mui/material";
import { FaCalendarCheck } from "react-icons/fa";
import { db } from "@/app/firebase/firebaseConfig";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { jsPDF } from "jspdf";
// import QRCode from "qrcode.react";

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

  const generatePDF = (data) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#007BFF");
    doc.text("Appointment Invoice", 80, 20);
    doc.setFont("helvetica", "normal");
    doc.setTextColor("black");
    doc.text(`Name: ${data.name}`, 20, 40);
    doc.text(`Email: ${data.email}`, 20, 50);
    doc.text(`Phone: ${data.phone}`, 20, 60);
    doc.text(`Test: ${data.test}`, 20, 70);
    doc.text(`Date: ${data.date}`, 20, 80);
    doc.text(`Appointment No: ${data.appointmentNumber}`, 20, 90);
    
    // const qrData = `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nTest: ${data.test}\nDate: ${data.date}\nAppointment No: ${data.appointmentNumber}`;
    // const qrCanvas = document.createElement("canvas");
    // // QRCode.toCanvas(qrCanvas, qrData);
    // const qrDataURL = qrCanvas.toDataURL("image/png");
    // // doc.addImage(qrDataURL, "PNG", 150, 40, 50, 50);
    
    doc.setFontSize(10);
    doc.text("Thank you for booking with our laboratory!", 20, 120);
    doc.text("Our team will be in touch for further details.", 20, 130);
    // doc.addImage("/logo.png", "PNG", 20, 140, 40, 40); // Adding a company logo
    doc.save("appointment_invoice.pdf");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const appointmentData = { ...formData };
      await addDoc(collection(db, "appointments"), appointmentData);
      generatePDF(appointmentData);
      alert("Appointment booked successfully!");
      setFormData({ name: "", email: "", phone: "", test: "", date: "", appointmentNumber: formData.appointmentNumber + 1 });
    } catch (error) {
      alert("Error booking appointment: " + error.message);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" className="py-12">
      <Card className="shadow-lg p-6 rounded-xl border border-gray-200">
        <CardContent>
          <Typography variant="h4" className="text-[#00b4d8] font-bold mb-6 pb-6 flex items-center gap-3">
            <FaCalendarCheck className="text-3xl" /> Book an Appointment
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField fullWidth variant="outlined" label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth variant="outlined" label="Email" name="email" value={formData.email} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth variant="outlined" label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth select variant="outlined" label="Select Test" name="test" value={formData.test} onChange={handleChange} required>
                  {testOptions.map((test, index) => (
                    <MenuItem key={index} value={test}>{test}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth type="date" variant="outlined" label="Appointment Date" name="date" value={formData.date} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
              </Grid>
              <Grid item xs={12} className="text-center">
                <Button type="submit" variant="contained" color="primary" className="py-2 rounded-lg text-lg shadow-md" style={{ backgroundColor: "#00b4d8" }} disabled={loading}>
                  {loading ? "Booking..." : "Confirm Appointment"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
