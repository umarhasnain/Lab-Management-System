'use client'
import { useState } from "react";
import { TextField, Button, Typography, Container, MenuItem, Grid, Card, CardContent } from "@mui/material";
import { FaCalendarCheck, FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import { db } from "@/app/firebase/firebaseConfig"
import { collection, addDoc } from "firebase/firestore";
import Navbar from "@/components/Navbar";

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
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "appointments"), formData);
      alert("Appointment booked successfully!");
      setFormData({ name: "", email: "", phone: "", test: "", date: "" });
    } catch (error) {
      alert("Error booking appointment: " + error.message);
    }
    setLoading(false);
  };

  return (
   <div>
    <Navbar/>
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
   </div>
  );
}
