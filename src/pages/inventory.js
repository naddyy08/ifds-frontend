// src/pages/Inventory.js
import React, { useState, useEffect } from 'react';
import { getAllInventory, addInventory, deleteInventory } from '../services/api';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
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

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const response = await getAllInventory();
      setItems(response.data.items);
    } catch (error) {
      console.error('Failed to load inventory:', error);
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

      <div className="inventory-grid">
        {items.map((item) => (
          <div key={item.id} className="inventory-card">
            <div className="card-header">
              <h3>{item.item_name}</h3>
              <button className="delete-icon" onClick={() => handleDelete(item.id)}>
                <Trash2 size={18} />
              </button>
            </div>
            <div className="card-body">
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Quantity:</strong> {item.quantity} {item.unit}</p>
              <p><strong>Reorder Level:</strong> {item.reorder_level} {item.unit}</p>
              <p><strong>Unit Price:</strong> ${item.unit_price}</p>
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
    </div>
  );
}

export default Inventory;