'use client';

import React, { useState } from 'react';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, Typography, Box, Container } from '@mui/material';
import { auth, db } from '@/app/firebase/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      alert('Please fill all fields!');
      return;
    }

    setLoading(true);
    try {
      // Register user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user role in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email,
        role,
        createdAt: new Date(),
      });

      alert('✅ Registration Successful!');
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full screen height for perfect centering
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" gutterBottom>
          <span className="text-primary">InnoLab</span> Management 🧪🎯
        </Typography>
        <Typography variant="h6" gutterBottom>
          Register
        </Typography>

        {/* Email Field */}
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password Field */}
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Role Selection */}
        <FormControl fullWidth margin="normal" >
          <InputLabel>Role</InputLabel>
          <Select value={role} onChange={(e) => setRole(e.target.value)}>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="patient">Patient</MenuItem>
            <MenuItem value="lab-technician">Lab Technician</MenuItem>
          </Select>
        </FormControl>
        {/* Register Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </Box>
    </Container>
  );
}
