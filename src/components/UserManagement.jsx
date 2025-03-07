'use client';

import { useState, useEffect } from 'react';
import { db } from '@/app/firebase/firebaseConfig';
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableHead, TableRow, TableCell, TableBody, Select, MenuItem, Card, CardContent, Typography, IconButton } from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Technician' });
  const [editingUser, setEditingUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [isClient]);

  if (!isClient) return null;

  const handleAddUser = async () => {
    await addDoc(collection(db, 'users'), newUser);
    setNewUser({ name: '', email: '', role: 'Technician' });
    setOpen(false);
  };

  const handleEditUser = async () => {
    if (editingUser) {
      await updateDoc(doc(db, 'users', editingUser.id), editingUser);
      setEditingUser(null);
      setEditOpen(false);
    }
  };

  const handleDeleteUser = async (id) => {
    await deleteDoc(doc(db, 'users', id));
  };

  const filteredUsers = (users || []).filter(user =>
    (user.name?.toLowerCase().includes(filter?.toLowerCase()) ||
     user.email?.toLowerCase().includes(filter?.toLowerCase()) ||
     user.role?.toLowerCase().includes(filter?.toLowerCase())) &&
    (roleFilter === '' || user.role === roleFilter)
  );

  return (
    <div className="p-6 w-full max-w-6xl mx-auto">
      <Typography variant="h4" className="text-center font-bold mb-6 pb-6 text-blue-600">
        User Management
      </Typography>

      <div className="flex flex-wrap gap-4 mb-6 justify-between items-center">
        <TextField 
          label="Search Users" 
          fullWidth 
          variant="outlined" 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)} 
          InputProps={{
            endAdornment: <Search color="action" />
          }}
        />
        <Select 
          fullWidth 
          variant="outlined"
          value={roleFilter} 
          onChange={(e) => setRoleFilter(e.target.value)} 
          displayEmpty
        >
          <MenuItem value="">All Roles</MenuItem>
          <MenuItem value="Technician">Technician</MenuItem>
          <MenuItem value="Patient">Patient</MenuItem>
        </Select>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => setOpen(true)}>
          Add User
        </Button>
      </div>

      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Role</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => { setEditingUser(user); setEditOpen(true); }}>
                        <Edit />
                      </IconButton>
                      <IconButton color="secondary" onClick={() => handleDeleteUser(user.id)}>
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

      {/* Add User Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth margin="dense" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
          <TextField label="Email" fullWidth margin="dense" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
          <Select fullWidth margin="dense" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
            <MenuItem value="Technician">Technician</MenuItem>
            <MenuItem value="Patient">Patient</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddUser} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth margin="dense" value={editingUser?.name || ''} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} />
          <TextField label="Email" fullWidth margin="dense" value={editingUser?.email || ''} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} />
          <Select fullWidth margin="dense" value={editingUser?.role || ''} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}>
            <MenuItem value="Technician">Technician</MenuItem>
            <MenuItem value="Patient">Patient</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEditUser} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
