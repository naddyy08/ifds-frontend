import React, { useState, useEffect } from 'react';
import { getAllUsers, createUser, updateUser, deleteUser, deactivateUser } from '../services/api';
import './admin.css';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({
    username: '',
    email: '',
    role: 'Staff',
    password: '',
    is_active: true,
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setUsers(res.data.users);
    } catch (e) {
      alert('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddUser = async e => {
    e.preventDefault();
    try {
      await createUser(form);
      setShowAddForm(false);
      setForm({ username: '', email: '', role: 'Staff', password: '', is_active: true });
      loadUsers();
      alert('User created!');
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to create user');
    }
  };

  const handleEditUser = user => {
    setEditUser(user);
    setForm({ ...user, password: '' });
    setShowAddForm(false);
  };

  const handleUpdateUser = async e => {
    e.preventDefault();
    try {
      await updateUser(editUser.id, form);
      setEditUser(null);
      setForm({ username: '', email: '', role: 'Staff', password: '', is_active: true });
      loadUsers();
      alert('User updated!');
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to update user');
    }
  };

  const handleDeactivate = async id => {
    if (window.confirm('Deactivate this user?')) {
      await deactivateUser(id);
      loadUsers();
    }
  };

  const handleDelete = async id => {
    if (window.confirm('Delete this user?')) {
      await deleteUser(id);
      loadUsers();
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel - User Management</h1>
      <button onClick={() => { setShowAddForm(true); setEditUser(null); }}>Add User</button>
      {(showAddForm || editUser) && (
        <form onSubmit={editUser ? handleUpdateUser : handleAddUser} className="user-form">
          <input name="username" value={form.username} onChange={handleFormChange} placeholder="Username" required />
          <input name="email" value={form.email} onChange={handleFormChange} placeholder="Email" required />
          <select name="role" value={form.role} onChange={handleFormChange} required>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Staff">Staff</option>
          </select>
          <input name="password" value={form.password} onChange={handleFormChange} placeholder="Password" type="password" required={!editUser} />
          <label>
            <input type="checkbox" name="is_active" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} /> Active
          </label>
          <button type="submit">{editUser ? 'Update' : 'Create'} User</button>
          <button type="button" onClick={() => { setShowAddForm(false); setEditUser(null); }}>Cancel</button>
        </form>
      )}
      <table className="user-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.is_active ? 'Active' : 'Inactive'}</td>
              <td>
                <button onClick={() => handleEditUser(user)}>Edit</button>
                <button onClick={() => handleDeactivate(user.id)} disabled={!user.is_active}>Deactivate</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;
