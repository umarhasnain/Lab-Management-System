'use client';

import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/app/firebase/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter email & password!');
      return;
    }

    setLoading(true);
    try {
      // Firebase login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role;

        // Redirect based on role
        if (userRole === 'admin') router.push('/dashboard/admin');
        else if (userRole === 'patient') router.push('/dashboard/patient');
        else if (userRole === 'lab-technician') router.push('/dashboard/lab-technician');
        else alert('❌ Unknown role!');

      } else {
        alert('❌ User data not found!');
      }

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
        height: '100vh', // Full screen height
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
          Login
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

        {/* Login Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </Box>
    </Container>
  );
}
