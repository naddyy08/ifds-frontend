// src/pages/Inventory.js
import React, { useState, useEffect } from 'react';
import { getAllInventory, addInventory, deleteInventory, updateInventory } from '../services/api';
import { Plus, AlertCircle, Pencil } from 'lucide-react';
import RoleBasedAccess from '../components/RoleBasedAccess';
import './inventory.css';

function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    item_name: '',
    category: '',
    quantity: '',
    unit: '',
    reorder_level: '',
    unit_price: '',
    supplier_name: '',
  });

  // Edit state
  const [editItem, setEditItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadInventory();
    // eslint-disable-next-line
  }, [category]);

  useEffect(() => {
    if (items.length > 0) {
      const unique = Array.from(new Set(items.map(i => i.category)));
      setCategories(unique);
    }
  }, [items]);

  const loadInventory = async () => {
    setLoading(true);
    try {
      let response;
      if (category) {
        response = await getAllInventory({ params: { category } });
      } else {
        response = await getAllInventory();
      }
      setItems(response.data.items);
    } catch (error) {
      console.error('Failed to load inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!search) {
        loadInventory();
        return;
      }
      const response = await import('../services/api').then(api => api.searchInventory(search));
      setItems(response.data.items);
    } catch (error) {
      alert('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await addInventory(newItem);
      setShowAddForm(false);
      setNewItem({
        item_name: '',
        category: '',
        quantity: '',
        unit: '',
        reorder_level: '',
        unit_price: '',
        supplier_name: '',
      });
      loadInventory();
      alert('Item added successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add item');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteInventory(id);
        loadInventory();
        alert('Item deleted successfully!');
      } catch (error) {
        alert(error.response?.data?.error || 'Failed to delete item');
      }
    }
  };

  // Open edit modal pre-filled with item data
  const handleEditOpen = (item) => {
    setEditItem({
      id: item.id,
      item_name: item.item_name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      reorder_level: item.reorder_level,
      unit_price: item.unit_price,
      supplier_name: item.supplier_name || '',
    });
    setShowEditModal(true);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      await updateInventory(editItem.id, editItem);
      setShowEditModal(false);
      setEditItem(null);
      loadInventory();
      alert('Item updated successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update item');
    }
  };

  const handleEditClose = () => {
    setShowEditModal(false);
    setEditItem(null);
  };

  if (loading) {
    return <div className="loading">Loading inventory...</div>;
  }

  return (
    <div className="inventory-page">
      <div className="page-header">
        <h1>📦 Inventory Management</h1>
        <button className="add-btn" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={20} />
          Add New Item
        </button>
      </div>

      {/* Search and Category Filter */}
      <form className="search-filter-row" onSubmit={handleSearch} style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Search by item name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 2, padding: 10, borderRadius: 5, border: '1px solid #ddd' }}
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={{ flex: 1, padding: 10, borderRadius: 5, border: '1px solid #ddd' }}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button type="submit" className="add-btn" style={{ padding: '10px 20px' }}>Search</button>
      </form>

      {/* Add New Item Form */}
      {showAddForm && (
        <div className="add-form-container">
          <form onSubmit={handleAddItem} className="add-form">
            <h3>Add New Item</h3>
            <div className="form-row">
              <input
                type="text"
                placeholder="Item Name *"
                value={newItem.item_name}
                onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Category *"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                required
              />
            </div>
            <div className="form-row">
              <input
                type="number"
                placeholder="Quantity *"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Unit (kg, pcs, liters) *"
                value={newItem.unit}
                onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                required
              />
            </div>
            <div className="form-row">
              <input
                type="number"
                placeholder="Reorder Level"
                value={newItem.reorder_level}
                onChange={(e) => setNewItem({ ...newItem, reorder_level: e.target.value })}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Unit Price"
                value={newItem.unit_price}
                onChange={(e) => setNewItem({ ...newItem, unit_price: e.target.value })}
              />
            </div>
            <input
              type="text"
              placeholder="Supplier Name"
              value={newItem.supplier_name}
              onChange={(e) => setNewItem({ ...newItem, supplier_name: e.target.value })}
            />
            <div className="form-buttons">
              <button type="submit" className="submit-btn">Add Item</button>
              <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Inventory Grid */}
      <div className="inventory-grid">
        {items.map((item) => (
          <div key={item.id} className="inventory-card">
            <div className="card-header">
              <h3>{item.item_name}</h3>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {/* Edit button — visible to admin and manager */}
                <RoleBasedAccess allowedRoles={['admin', 'manager']}>
                  <button
                    onClick={() => handleEditOpen(item)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 12px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                </RoleBasedAccess>
                {/* Delete button — admin only */}
                <RoleBasedAccess allowedRoles={['admin']}>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="delete-button"
                  >
                    🗑️ Delete
                  </button>
                </RoleBasedAccess>
              </div>
            </div>
            <div className="card-body">
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Quantity:</strong> {item.quantity} {item.unit}</p>
              <p><strong>Reorder Level:</strong> {item.reorder_level} {item.unit}</p>
              <p><strong>Unit Price:</strong> RM{Number(item.unit_price).toFixed(2)}</p>
              {item.supplier_name && (
                <p><strong>Supplier:</strong> {item.supplier_name}</p>
              )}
              {item.quantity <= item.reorder_level && (
                <div className="low-stock-badge">
                  <AlertCircle size={16} />
                  Low Stock
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showEditModal && editItem && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '32px',
            width: '100%',
            maxWidth: '520px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <h3 style={{ margin: '0 0 24px', fontSize: '20px', color: '#1f2937' }}>
              ✏️ Edit Item
            </h3>
            <form onSubmit={handleEditSave}>
              <div className="form-row">
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Item Name *</label>
                  <input
                    type="text"
                    value={editItem.item_name}
                    onChange={(e) => setEditItem({ ...editItem, item_name: e.target.value })}
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Category *</label>
                  <input
                    type="text"
                    value={editItem.category}
                    onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
              <div className="form-row" style={{ marginTop: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Quantity *</label>
                  <input
                    type="number"
                    value={editItem.quantity}
                    onChange={(e) => setEditItem({ ...editItem, quantity: e.target.value })}
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Unit *</label>
                  <input
                    type="text"
                    value={editItem.unit}
                    onChange={(e) => setEditItem({ ...editItem, unit: e.target.value })}
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
              <div className="form-row" style={{ marginTop: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Reorder Level</label>
                  <input
                    type="number"
                    value={editItem.reorder_level}
                    onChange={(e) => setEditItem({ ...editItem, reorder_level: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Unit Price (RM)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editItem.unit_price}
                    onChange={(e) => setEditItem({ ...editItem, unit_price: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
              <div style={{ marginTop: '12px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Supplier Name</label>
                <input
                  type="text"
                  value={editItem.supplier_name}
                  onChange={(e) => setEditItem({ ...editItem, supplier_name: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
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
                  onClick={handleEditClose}
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

export default Inventory;