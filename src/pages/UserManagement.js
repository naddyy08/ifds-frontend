// src/pages/UserManagement.js
import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUser, deleteUser, deactivateUser } from '../services/api';
import { Users, Shield, UserCircle, Pencil, Trash2, UserX, UserCheck } from 'lucide-react';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setUsers(res.data.users || res.data);
      setError('');
    } catch (e) {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditOpen = (user) => {
    setEditUser({ ...user });
    setShowEditModal(true);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      await updateUser(editUser.id, {
        username: editUser.username,
        email: editUser.email,
        role: editUser.role,
      });
      setShowEditModal(false);
      setEditUser(null);
      loadUsers();
      alert('User updated successfully!');
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to update user');
    }
  };

  const handleDeactivate = async (user) => {
    const action = user.is_active ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} "${user.username}"?`)) return;
    try {
      await deactivateUser(user.id);
      loadUsers();
      alert(`User ${action}d successfully!`);
    } catch (e) {
      alert(e.response?.data?.error || `Failed to ${action} user`);
    }
  };

  const handleDelete = async (user) => {
    if (user.id === currentUser?.id) {
      alert('You cannot delete your own account!');
      return;
    }
    if (!window.confirm(`Are you sure you want to permanently delete "${user.username}"? This cannot be undone.`)) return;
    try {
      await deleteUser(user.id);
      loadUsers();
      alert('User deleted successfully!');
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to delete user');
    }
  };

  const getRoleStyle = (role) => {
    switch (role) {
      case 'admin': return { color: '#ef4444', bg: '#fee2e2', icon: Shield };
      case 'manager': return { color: '#3b82f6', bg: '#dbeafe', icon: Users };
      default: return { color: '#10b981', bg: '#d1fae5', icon: UserCircle };
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '9px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '4px',
  };

  if (loading) return (
    <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
      Loading users...
    </div>
  );

  return (
    <div style={{ padding: '32px', maxWidth: '1100px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
            👥 User Management
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '6px' }}>
            Manage user accounts, roles and access permissions
          </p>
        </div>
        <div style={{
          backgroundColor: '#f3f4f6',
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#374151',
          fontWeight: '600',
        }}>
          {users.length} Total Users
        </div>
      </div>

      {error && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#dc2626' }}>
          {error}
        </div>
      )}

      {/* Users Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '40px 1fr 1fr 120px 100px 180px',
          padding: '12px 20px',
          backgroundColor: '#f9fafb',
          borderBottom: '1px solid #e5e7eb',
          fontSize: '12px',
          fontWeight: '700',
          color: '#6b7280',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          <div>#</div>
          <div>User</div>
          <div>Email</div>
          <div>Role</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {/* Table Rows */}
        {users.map((user, index) => {
          const roleStyle = getRoleStyle(user.role);
          const RoleIcon = roleStyle.icon;
          const isSelf = user.id === currentUser?.id;

          return (
            <div
              key={user.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr 1fr 120px 100px 180px',
                padding: '16px 20px',
                borderBottom: '1px solid #f3f4f6',
                alignItems: 'center',
                backgroundColor: isSelf ? '#fafff4' : '#fff',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!isSelf) e.currentTarget.style.backgroundColor = '#f9fafb'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = isSelf ? '#fafff4' : '#fff'; }}
            >
              {/* Index */}
              <div style={{ fontSize: '13px', color: '#9ca3af' }}>{index + 1}</div>

              {/* Username */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  backgroundColor: roleStyle.bg, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <RoleIcon size={18} color={roleStyle.color} />
                </div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#1f2937' }}>
                    {user.username}
                    {isSelf && <span style={{ fontSize: '11px', color: '#10b981', marginLeft: '6px', fontWeight: '400' }}>(you)</span>}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>ID: {user.id}</div>
                </div>
              </div>

              {/* Email */}
              <div style={{ fontSize: '13px', color: '#6b7280' }}>{user.email}</div>

              {/* Role Badge */}
              <div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  padding: '4px 10px', borderRadius: '20px',
                  backgroundColor: roleStyle.bg, color: roleStyle.color,
                  fontSize: '12px', fontWeight: '600',
                }}>
                  <RoleIcon size={12} />
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>

              {/* Status */}
              <div>
                <span style={{
                  display: 'inline-block', padding: '4px 10px', borderRadius: '20px',
                  backgroundColor: user.is_active ? '#d1fae5' : '#fee2e2',
                  color: user.is_active ? '#065f46' : '#991b1b',
                  fontSize: '12px', fontWeight: '600',
                }}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {/* Edit */}
                <button
                  onClick={() => handleEditOpen(user)}
                  title="Edit user"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    padding: '6px 10px', backgroundColor: '#3b82f6',
                    color: 'white', border: 'none', borderRadius: '6px',
                    fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                  }}
                >
                  <Pencil size={13} /> Edit
                </button>

                {/* Activate/Deactivate — can't do to self */}
                {!isSelf && (
                  <button
                    onClick={() => handleDeactivate(user)}
                    title={user.is_active ? 'Deactivate user' : 'Activate user'}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      padding: '6px 10px',
                      backgroundColor: user.is_active ? '#f59e0b' : '#10b981',
                      color: 'white', border: 'none', borderRadius: '6px',
                      fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                    }}
                  >
                    {user.is_active ? <><UserX size={13} /> Deactivate</> : <><UserCheck size={13} /> Activate</>}
                  </button>
                )}

                {/* Delete — can't delete self */}
                {!isSelf && (
                  <button
                    onClick={() => handleDelete(user)}
                    title="Delete user"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      padding: '6px 10px', backgroundColor: '#ef4444',
                      color: 'white', border: 'none', borderRadius: '6px',
                      fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {showEditModal && editUser && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#fff', borderRadius: '12px',
            padding: '32px', width: '100%', maxWidth: '460px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <h3 style={{ margin: '0 0 24px', fontSize: '20px', color: '#1f2937' }}>
              ✏️ Edit User
            </h3>
            <form onSubmit={handleEditSave}>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Username</label>
                <input
                  type="text"
                  value={editUser.username}
                  onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                  required
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  required
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Role</label>
                <select
                  value={editUser.role}
                  onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                  style={inputStyle}
                >
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
                <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                  ⚠️ Changing role affects what this user can access in the system.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1, padding: '10px', backgroundColor: '#3b82f6',
                    color: 'white', border: 'none', borderRadius: '8px',
                    fontSize: '15px', fontWeight: '600', cursor: 'pointer',
                  }}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setEditUser(null); }}
                  style={{
                    flex: 1, padding: '10px', backgroundColor: '#f3f4f6',
                    color: '#374151', border: '1px solid #d1d5db', borderRadius: '8px',
                    fontSize: '15px', fontWeight: '600', cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;