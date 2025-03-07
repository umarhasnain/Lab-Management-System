
'use client';

import { useState } from 'react';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { Button, TextField, Table, TableHead, TableRow, TableCell, TableBody, Card, CardContent, Typography } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

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

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 102, 204);
    doc.text(labName, 20, 20);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Customer: ${customer.name}`, 20, 40);
    doc.text(`Contact: ${customer.contact}`, 20, 50);
    
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
    
    const qrData = `Lab: ${labName}\nCustomer: ${customer.name}\nTotal: $${total.toFixed(2)}`;
    const qrCanvas = document.createElement('canvas');
    QRCode.toCanvas(qrCanvas, qrData, { width: 50 });
    doc.addImage(qrCanvas.toDataURL('image/png'), 'PNG', 150, 10, 40, 40);

    doc.save('invoice.pdf');
  };

  return (
    <div className="p-6 w-full max-w-4xl mx-auto">
      <Typography variant="h4" className="text-center font-bold mb-6 text-blue-600">Billing & Invoices</Typography>
      <Card>
        <CardContent>
          <TextField label="Customer Name" fullWidth margin="dense" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
          <TextField label="Contact" fullWidth margin="dense" value={customer.contact} onChange={(e) => setCustomer({ ...customer, contact: e.target.value })} />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price ($)</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} />
                  </TableCell>
                  <TableCell>
                    <TextField type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)} />
                  </TableCell>
                  <TableCell>
                    <TextField type="number" value={item.price} onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)} />
                  </TableCell>
                  <TableCell>
                    <Button color="secondary" onClick={() => removeItem(index)}><Delete /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={addItem} className="mt-4 m-2">Add Item</Button>
          <Button variant="contained" color="success" onClick={generatePDF} className="mt-4 ml-4 mr-4 p-4">Generate Invoice</Button>
        </CardContent>
      </Card>
    </div>
  );
}
