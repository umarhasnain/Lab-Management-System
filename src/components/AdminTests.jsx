'use client';

import { useState, useEffect } from 'react';
import { db } from '@/app/firebase/firebaseConfig';
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableHead, TableRow, TableCell, TableBody, Card, CardContent, Typography, IconButton } from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';

export default function TestManagement() {
  const [tests, setTests] = useState([]);
  const [newTest, setNewTest] = useState({ category: '', description: '', price: '' });
  const [editingTest, setEditingTest] = useState({ id: '', category: '', description: '', price: '' });
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const unsubscribe = onSnapshot(collection(db, 'tests'), (snapshot) => {
      setTests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [isClient]);

  if (!isClient) return null;

  const handleAddTest = async () => {
    if (!newTest.category || !newTest.price) return;
    await addDoc(collection(db, 'tests'), newTest);
    setNewTest({ category: '', description: '', price: '' });
    setOpen(false);
  };

  const handleEditTest = async () => {
    if (!editingTest.id || !editingTest.category || !editingTest.price) return;
    await updateDoc(doc(db, 'tests', editingTest.id), {
      category: editingTest.category,
      description: editingTest.description,
      price: editingTest.price,
    });
    setEditingTest({ id: '', category: '', description: '', price: '' });
    setEditOpen(false);
  };

  const handleDeleteTest = async (id) => {
    await deleteDoc(doc(db, 'tests', id));
  };

  const filteredTests = tests.filter(test => 
    test.category?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-6 w-full max-w-6xl mx-auto">
      <Typography variant="h4" className="text-center font-bold mb-6 text-blue-600">
        Test Management
      </Typography>

      <div className="flex flex-wrap gap-4 mb-6 justify-between items-center">
        <TextField 
          label="Search Test Categories" 
          fullWidth 
          variant="outlined" 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)} 
          InputProps={{ endAdornment: <Search color="action" /> }}
        />
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => setOpen(true)}>
          Add Test
        </Button>
      </div>

      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Category</strong></TableCell>
                  <TableCell><strong>Description</strong></TableCell>
                  <TableCell><strong>Price (PKR)</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTests.map(test => (
                  <TableRow key={test.id}>
                    <TableCell>{test.category}</TableCell>
                    <TableCell>{test.description}</TableCell>
                    <TableCell>{test.price}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => { setEditingTest(test); setEditOpen(true); }}>
                        <Edit />
                      </IconButton>
                      <IconButton color="secondary" onClick={() => handleDeleteTest(test.id)}>
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

      {/* Add Test Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Test</DialogTitle>
        <DialogContent>
          <TextField label="Category" fullWidth margin="dense" value={newTest.category} onChange={(e) => setNewTest({ ...newTest, category: e.target.value })} />
          <TextField label="Description" fullWidth margin="dense" value={newTest.description} onChange={(e) => setNewTest({ ...newTest, description: e.target.value })} />
          <TextField label="Price (PKR)" type="number" fullWidth margin="dense" value={newTest.price} onChange={(e) => setNewTest({ ...newTest, price: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddTest} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Test Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Test</DialogTitle>
        <DialogContent>
          <TextField label="Category" fullWidth margin="dense" value={editingTest.category} onChange={(e) => setEditingTest({ ...editingTest, category: e.target.value })} />
          <TextField label="Description" fullWidth margin="dense" value={editingTest.description} onChange={(e) => setEditingTest({ ...editingTest, description: e.target.value })} />
          <TextField label="Price (PKR)" type="number" fullWidth margin="dense" value={editingTest.price} onChange={(e) => setEditingTest({ ...editingTest, price: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEditTest} color="primary">Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
