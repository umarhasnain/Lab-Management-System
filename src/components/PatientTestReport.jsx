'use client';
import { useState } from "react";
import { jsPDF } from "jspdf";
import { TextField, Button, Grid, Card, CardContent, Typography, InputLabel } from "@mui/material";
import { FiDownload } from "react-icons/fi";

const PatientReportGenerator = () => {
  const [patient, setPatient] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
    testName: "",
    testDate: "",
    findings: "",
    remarks: ""
  });

  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 102, 204);
    doc.text("InnoLab Management", 70, 20);
    doc.text("Laboratory Test Report", 20, 30);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    
    doc.text(`Patient Name: ${patient.name}`, 20, 40);
    doc.text(`Age: ${patient.age}`, 20, 50);
    doc.text(`Gender: ${patient.gender}`, 20, 60);
    doc.text(`Phone: ${patient.phone}`, 20, 70);
    doc.text(`Address: ${patient.address}`, 20, 80);
    
    doc.text("---------------------------------------------------", 20, 90);
    doc.text(`Test Name: ${patient.testName}`, 20, 100);
    doc.text(`Test Date: ${patient.testDate}`, 20, 110);
    doc.text("Findings:", 20, 120);
    doc.text(patient.findings, 20, 130, { maxWidth: 170 });
    doc.text("Remarks:", 20, 160);
    doc.text(patient.remarks, 20, 170, { maxWidth: 170 });
    
    doc.text("---------------------------------------------------", 20, 190);
    doc.text("Authorized By: __Umar Hasnain__", 20, 200);
    
    doc.save(`${patient.name}_Test_Report.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Typography variant="h4" className="text-center text-blue-600 font-bold mb-6">Generate Patient Test Report</Typography>
      <Card className="shadow-lg p-6 rounded-lg">
        <CardContent>
          <Grid container spacing={3}>
            {Object.keys(patient).map((key) => (
              <Grid item xs={12} sm={6} key={key}>
                <InputLabel className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}</InputLabel>
                <TextField
                  fullWidth
                  name={key}
                  value={patient[key]}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
            ))}
          </Grid>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FiDownload />}
            className="mt-4"
            onClick={generatePDF}
          >
            Generate PDF Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientReportGenerator;
