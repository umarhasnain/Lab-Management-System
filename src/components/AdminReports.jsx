'use client';

import { useState, useEffect } from 'react';
import { db } from '@/app/firebase/firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ReportsAnalytics() {
  const [tests, setTests] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeTests = onSnapshot(collection(db, 'tests'), (snapshot) => {
      setTests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    
    const unsubscribeAppointments = onSnapshot(collection(db, 'appointments'), (snapshot) => {
      setAppointments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    
    const unsubscribeEarnings = onSnapshot(collection(db, 'earnings'), (snapshot) => {
      setEarnings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    
    setTimeout(() => setLoading(false), 1000);
    
    return () => {
      unsubscribeTests();
      unsubscribeAppointments();
      unsubscribeEarnings();
    };
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><CircularProgress /></div>;
  }

  const testData = tests.map(test => ({ name: test.category, value: test.price }));
  const appointmentData = appointments.map(appointment => ({ name: appointment.date, value: 1 }));
  const earningsData = earnings.map(earning => ({ name: earning.month, value: earning.amount }));
  
  return (
    <div className="p-6 w-full max-w-6xl mx-auto">
      <Typography variant="h4" className="text-center font-bold mb-6 text-blue-600">
        Reports & Analytics
      </Typography>

      <Grid container spacing={4}>
        {/* Test Reports */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="mb-4">Test Categories</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={testData} dataKey="value" nameKey="name" outerRadius={100} fill="#8884d8" label>
                    {testData.map((_, index) => <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658'][index % 3]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Appointment Reports */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="mb-4">Appointments Over Time</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={appointmentData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Earnings Reports */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="mb-4">Monthly Earnings</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={earningsData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
