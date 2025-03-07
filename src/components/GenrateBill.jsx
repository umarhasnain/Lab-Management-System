'use client';

import { useState } from 'react';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { Button, TextField, Table, TableHead, TableRow, TableCell, TableBody, Card, CardContent, Typography, Box } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import dayjs from "dayjs";

export default function BillingInvoice() {
  const [items, setItems] = useState([{ description: '', price: '', quantity: 1 }]);
  const [customer, setCustomer] = useState({ name: '', contact: '' });
  const labName = "Advanced Medical Lab";

  const handleItemChange = (index, key, value) => {
    const newItems = [...items];
    newItems[index][key] = value;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { description: '', price: '', quantity: 1 }]);

  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const generatePDF = async () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 102, 204);
    doc.text(labName, 20, 20);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Customer: ${customer.name}`, 20, 40);
    doc.text(`Contact: ${customer.contact}`, 20, 50);
        const formattedDate = dayjs().format("MM/DD/YYYY hh:mm A");
    
    let y = 70;
    doc.setFontSize(10);
    doc.text('Description', 20, y);
    doc.text('Quantity', 100, y);
    doc.text('Price', 140, y);
    doc.text('Total', 180, y);

    items.forEach((item, i) => {
      y += 10;
      doc.text(item.description, 20, y);
      doc.text(item.quantity.toString(), 100, y);
      doc.text(`$${item.price}`, 140, y);
      doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 180, y);
    });

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    y += 20;
    doc.text(`Total Amount: $${total.toFixed(2)}`, 20, y);
    
    // const qrData = `Lab: ${labName}\nCustomer: ${customer.name}\nTotal: $${total.toFixed(2)}`;
    // try {
    //   const qrCodeUrl = await QRCode.toDataURL(qrData, { width: 50 });
    //   doc.addImage(qrCodeUrl, 'PNG', 150, 10, 40, 40);
    // } catch (error) {
    //   console.error('QR Code generation failed:', error);
    // }
    const qrData = `Name: ${labName}\nCustomer: ${customer.name}\nTotal: ${total.toFixed(2)}\nDate: ${formattedDate}\nAppointment No: "222"`;
        try {
          const qrDataURL = await QRCode.toDataURL(qrData, { errorCorrectionLevel: 'H' });
          doc.addImage(qrDataURL, "PNG", 150, 40, 50, 50);
        } catch (error) {
          console.error("QR Code generation failed", error);
        }
    doc.save('invoice.pdf');
    setCustomer({ name: '', contact: '' });
    setItems([{ description: '', price: '', quantity: 1 }]);
  };

  return (
    <Box className="p-6 w-full max-w-4xl mx-auto">
      <Typography variant="h4" className="text-center font-bold mb-6 text-blue-600">Billing & Invoices</Typography>
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardContent>
          <Box className="mb-4">
            <TextField label="Customer Name" fullWidth margin="dense" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
            <TextField label="Contact" fullWidth margin="dense" value={customer.contact} onChange={(e) => setCustomer({ ...customer, contact: e.target.value })} />
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>Quantity</strong></TableCell>
                <TableCell><strong>Price ($)</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField fullWidth value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} />
                  </TableCell>
                  <TableCell>
                    <TextField type="number" fullWidth value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)} />
                  </TableCell>
                  <TableCell>
                    <TextField type="number" fullWidth value={item.price} onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)} />
                  </TableCell>
                  <TableCell>
                    <Button color="secondary" onClick={() => removeItem(index)}><Delete /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box className="flex justify-between items-center mt-6">
            <Button variant="contained" color="primary" startIcon={<Add />} onClick={addItem}>Add Item</Button>
            <Button variant="contained" color="success" onClick={generatePDF}>Generate Invoice</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
