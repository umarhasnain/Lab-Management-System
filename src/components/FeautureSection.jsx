'use client';
import { Box, Button, Container, Grid, Typography, Card, CardContent, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SecurityIcon from "@mui/icons-material/Security";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import { FaCalendarCheck } from 'react-icons/fa';
import Link from "next/link";

const HomePage = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      {/* Hero Section */}
      <Box textAlign="center" py={6}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography variant="h2" fontWeight="bold" color="primary" gutterBottom>
            Advanced Laboratory Management
          </Typography>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Efficient, Secure, and Streamlined Appointment Processing
          </Typography>
         <Link href="/appointment">
         <Button variant="contained" color="primary" size="large" sx={{ mt: 3 }}>
         <FaCalendarCheck className="mr-2"/> Book an Appointment
          </Button>
         </Link>
        </motion.div>
      </Box>

      {/* Features Section */}
      <Grid container spacing={4} justifyContent="center" alignItems="center">
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card elevation={6} sx={{ textAlign: "center", p: 3, height: "100%" }}>
                <feature.icon fontSize="large" color="primary" sx={{ mb: 2 }} />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* CTA Section */}
      <Box textAlign="center" py={6}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            Ready to Streamline Your Lab Operations?
          </Typography>
          <Button variant="contained" color="primary" size="large">
            Contact Us
          </Button>
        </motion.div>
      </Box>

      {/* Footer Section */}
      <Box component="footer" sx={{ bgcolor: "#2c3e50", color: "white", py: 4, textAlign: "center" }}>
        <Typography variant="h6" gutterBottom>
        InnoLab Management System
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          &copy; {new Date().getFullYear()} All Rights Reserved.
        </Typography>
        <Box>
          <IconButton color="inherit" href="#">
            <FacebookIcon />
          </IconButton>
          <IconButton color="inherit" href="#">
            <TwitterIcon />
          </IconButton>
          <IconButton color="inherit" href="#">
            <InstagramIcon />
          </IconButton>
        </Box>
      </Box>
    </Container>
  );
};

const features = [
  {
    title: "Fast Processing",
    description: "Quick and efficient appointment management for labs.",
    icon: AccessTimeIcon,
  },
  {
    title: "Secure & Reliable",
    description: "Ensuring data privacy and security at all times.",
    icon: SecurityIcon,
  },
  {
    title: "Advanced Technology",
    description: "AI-driven solutions for enhanced lab efficiency.",
    icon: MedicalServicesIcon,
  },
];

export default HomePage;
