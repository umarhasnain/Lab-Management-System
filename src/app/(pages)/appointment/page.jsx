'use client';
import { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, MenuItem, Stack, Card, CardContent } from '@mui/material';
import { FaCalendarCheck } from 'react-icons/fa';
import { db } from '@/app/firebase/firebaseConfig';
import { collection, addDoc, getDocs, query, orderBy, where, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import dayjs from 'dayjs';
import Navbar from '@/components/Navbar';

export default function Appointment() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    test: '',
    date: '',
    timeSlot: '',
    appointmentNumber: 1,
  });
  const [loading, setLoading] = useState(false);
  const [testOptions, setTestOptions] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  useEffect(() => {
    fetchLastAppointmentNumber();
    fetchTests();
    generateTimeSlots();
    resetAppointmentsDaily();
  }, []);

  // ✅ Fetch last appointment number with error handling
  const fetchLastAppointmentNumber = async () => {
    try {
      const q = query(collection(db, 'appointments'), orderBy('appointmentNumber', 'desc'));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setFormData((prev) => ({ ...prev, appointmentNumber: querySnapshot.docs[0].data().appointmentNumber + 1 }));
      }
    } catch (error) {
      console.error('Error fetching last appointment number:', error);
    }
  };

  // ✅ Fetch available tests
  const fetchTests = async () => {
    try {
      const testCollection = collection(db, 'tests');
      const testSnapshot = await getDocs(testCollection);
      setTestOptions(testSnapshot.docs.map(doc => doc.data().category));
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  };

  // ✅ Generate time slots dynamically
  const generateTimeSlots = () => {
    let startTime = dayjs().hour(9).minute(0);
    let endTime = dayjs().hour(17).minute(0);
    let slots = [];
    while (startTime.isBefore(endTime)) {
      slots.push(startTime.format('hh:mm A'));
      startTime = startTime.add(15, 'minute');
    }
    setAvailableTimeSlots(slots);
  };

  // ✅ Reset appointments daily at midnight
  const resetAppointmentsDaily = async () => {
    try {
      const today = dayjs().format('YYYY-MM-DD');
      const resetCheckDoc = doc(db, 'system', 'lastReset');
      const resetCheckSnapshot = await getDocs(query(collection(db, 'system'), where('date', '==', today)));

      if (resetCheckSnapshot.empty) {
        const q = query(collection(db, 'appointments'));
        const querySnapshot = await getDocs(q);
        for (const docSnap of querySnapshot.docs) {
          const appointmentData = docSnap.data();
          await setDoc(doc(db, 'old_appointments', docSnap.id), appointmentData);
          await deleteDoc(doc(db, 'appointments', docSnap.id));
        }

        await setDoc(resetCheckDoc, { date: today });
      }
    } catch (error) {
      console.error('Error resetting appointments:', error);
    }
  };

  // ✅ Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Check if an appointment slot is available
  const checkAppointmentAvailability = async (date, timeSlot) => {
    try {
      const q = query(collection(db, 'appointments'), where('date', '==', date), where('timeSlot', '==', timeSlot));
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty; 
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  };

  // ✅ Generate and download appointment invoice
  const generatePDF = async (data) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#007BFF");
    doc.text("InnoLab Management System", 60, 15);
    doc.text("Appointment Invoice", 70, 25);
    doc.setFont("helvetica", "normal");
    doc.setTextColor("black");
    doc.text(`Name: ${data.name}`, 20, 40);
    doc.text(`Email: ${data.email}`, 20, 50);
    doc.text(`Phone: ${data.phone}`, 20, 60);
    doc.text(`Test: ${data.test}`, 20, 70);
    doc.text(`Date: ${data.date}`, 20, 80);
    doc.text(`Time Slot: ${data.timeSlot}`, 20, 90);
    doc.text(`Appointment No: ${data.appointmentNumber}`, 20, 100);
    
    const qrData = `Name: ${data.name}\nEmail: ${data.email}\nTest: ${data.test}\nDate: ${data.date}\nTime Slot: ${data.timeSlot}`;
    const qrDataURL = await QRCode.toDataURL(qrData);
    doc.addImage(qrDataURL, 'PNG', 150, 40, 50, 50);
    
    doc.setFontSize(10);
    doc.text("Thank you for booking with our laboratory!", 20, 120);
    doc.text("Our team will be in touch for further details.", 20, 130);

    doc.save('appointment_invoice.pdf');
  };

  // ✅ Handle appointment submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const isAvailable = await checkAppointmentAvailability(formData.date, formData.timeSlot);
    if (!isAvailable) {
      alert('This time slot is already booked. Please choose another.');
      setLoading(false);
      return;
    }

    try {
      const appointmentData = { ...formData };
      await addDoc(collection(db, 'appointments'), appointmentData);
      await generatePDF(appointmentData);
      alert('Appointment booked successfully!');
      setFormData({ name: '', email: '', phone: '', test: '', date: '', timeSlot: '', appointmentNumber: formData.appointmentNumber + 1 });
    } catch (error) {
      alert('Error booking appointment: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <Navbar />
      <Container maxWidth="sm" className="py-12">
        <Card className="shadow-lg p-6 rounded-xl border border-gray-200">
          <CardContent>
            <Typography variant="h4" className="text-[#00b4d8] font-bold mb-6 pb-6 flex items-center gap-3">
              <FaCalendarCheck className="text-3xl" /> Book an Appointment
            </Typography>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField fullWidth label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} required />
                <TextField fullWidth label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
                <TextField fullWidth select label="Select Test" name="test" value={formData.test} onChange={handleChange} required>
                  {testOptions.map((test, index) => (
                    <MenuItem key={index} value={test}>{test}</MenuItem>
                  ))}
                </TextField>
                <TextField fullWidth type="date" name="date" value={formData.date} onChange={handleChange} required />
                <TextField fullWidth select label="Select Time Slot" name="timeSlot" value={formData.timeSlot} onChange={handleChange} required>
                  {availableTimeSlots.map((slot, index) => (
                    <MenuItem key={index} value={slot}>{slot}</MenuItem>
                  ))}
                </TextField>
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                  {loading ? 'Booking...' : 'Confirm Appointment'}
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
