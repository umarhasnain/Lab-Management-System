'use client';

import { useState, useEffect } from 'react';
import { db } from '@/app/firebase/firebaseConfig';
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableHead, TableRow, TableCell, TableBody, Select, MenuItem, Card, CardContent, Typography, IconButton } from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';

export default function BillingInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [newInvoice, setNewInvoice] = useState({ customer: '', amount: '', status: 'Pending' });
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'invoices'), (snapshot) => {
      setInvoices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleAddInvoice = async () => {
    await addDoc(collection(db, 'invoices'), newInvoice);
    setNewInvoice({ customer: '', amount: '', status: 'Pending' });
    setOpen(false);
  };

  const handleEditInvoice = async () => {
    if (editingInvoice) {
      await updateDoc(doc(db, 'invoices', editingInvoice.id), editingInvoice);
      setEditingInvoice(null);
      setEditOpen(false);
    }
  };

  const handleDeleteInvoice = async (id) => {
    await deleteDoc(doc(db, 'invoices', id));
  };

  const filteredInvoices = invoices.filter(invoice => 
    invoice.customer.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-6 w-full max-w-6xl mx-auto">
      <Typography variant="h4" className="text-center font-bold mb-6 pb-6 text-blue-600">
        Billing & Invoices
      </Typography>

      <div className="flex flex-wrap gap-4 mb-6 justify-between items-center">
        <TextField 
          label="Search Customers" 
          fullWidth 
          variant="outlined" 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)} 
          InputProps={{ endAdornment: <Search color="action" /> }}
        />
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => setOpen(true)}>
          Add Invoice
        </Button>
      </div>

      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Customer</strong></TableCell>
                  <TableCell><strong>Test Type</strong></TableCell>
                  <TableCell><strong>Result</strong></TableCell>
                  <TableCell><strong>Phone</strong></TableCell>
                  <TableCell><strong>Amount (PKR)</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInvoices.map(invoice => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.customer}</TableCell>
                    <TableCell>{invoice.testType}</TableCell>
                    <TableCell>{invoice.result}</TableCell>
                    <TableCell>{invoice.phone}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell>{invoice.status}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => { setEditingInvoice(invoice); setEditOpen(true); }}>
                        <Edit />
                      </IconButton>
                      <IconButton color="secondary" onClick={() => handleDeleteInvoice(invoice.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Invoice Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Invoice</DialogTitle>
        <DialogContent>
          <TextField label="Customer" fullWidth margin="dense" value={newInvoice.customer} onChange={(e) => setNewInvoice({ ...newInvoice, customer: e.target.value })} />
          <TextField label="Test Type" fullWidth margin="dense" value={newInvoice.testType} onChange={(e) => setNewInvoice({ ...newInvoice, testType: e.target.value })} />
          <TextField label="Result" fullWidth margin="dense" value={newInvoice.result} onChange={(e) => setNewInvoice({ ...newInvoice, result: e.target.value })} />
          <TextField label="Phone" type="number" fullWidth margin="dense" value={newInvoice.phone} onChange={(e) => setNewInvoice({ ...newInvoice, phone: e.target.value })} />
          <TextField label="Amount (PKR)" type="number" fullWidth margin="dense" value={newInvoice.amount} onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })} />
          <Select fullWidth margin="dense" value={newInvoice.status} onChange={(e) => setNewInvoice({ ...newInvoice, status: e.target.value })}>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddInvoice} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Invoice Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Invoice</DialogTitle>
        <DialogContent>
          <TextField label="Customer" fullWidth margin="dense" value={editingInvoice?.customer || ''} onChange={(e) => setEditingInvoice({ ...editingInvoice, customer: e.target.value })} />
          <TextField label="Phone" type="number" fullWidth margin="dense" value={newInvoice.phone} onChange={(e) => setNewInvoice({ ...newInvoice, phone: e.target.value })} />
          <TextField label="Test Type" fullWidth margin="dense" value={editingInvoice?.testType || ''} onChange={(e) => setEditingInvoice({ ...editingInvoice, testType: e.target.value })} />
          <TextField label="Result" fullWidth margin="dense" value={editingInvoice?.result || ''} onChange={(e) => setEditingInvoice({ ...editingInvoice, result: e.target.value })} />
          <TextField label="Amount (PKR)" type="number" fullWidth margin="dense" value={editingInvoice?.amount || ''} onChange={(e) => setEditingInvoice({ ...editingInvoice, amount: e.target.value })} />
          <Select fullWidth margin="dense" value={editingInvoice?.status || ''} onChange={(e) => setEditingInvoice({ ...editingInvoice, status: e.target.value })}>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEditInvoice} color="primary">Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
