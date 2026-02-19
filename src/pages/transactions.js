// src/pages/Transactions.js
import React, { useState, useEffect } from 'react';
import {
  getAllInventory,
  getAllTransactions,
  stockIn,
  stockOut,
  recordWaste,
} from '../services/api';
import { TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import './transactions.css';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [activeTab, setActiveTab] = useState('view');
  const [transactionType, setTransactionType] = useState('stock_in');
  const [formData, setFormData] = useState({
    inventory_id: '',
    quantity: '',
    reason: '',
    reference_no: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [transRes, invRes] = await Promise.all([
        getAllTransactions(),
        getAllInventory(),
      ]);
      setTransactions(transRes.data.transactions);
      setInventory(invRes.data.items);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (transactionType === 'stock_in') {
        await stockIn(formData);
      } else if (transactionType === 'stock_out') {
        await stockOut(formData);
      } else if (transactionType === 'waste') {
        await recordWaste(formData);
      }

      setFormData({
        inventory_id: '',
        quantity: '',
        reason: '',
        reference_no: '',
      });
      loadData();
      alert('Transaction recorded successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to record transaction');
    }
  };

  return (
    <div className="transactions-page">
      <h1>💰 Transactions</h1>

      <div className="tabs">
        <button
          className={activeTab === 'view' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('view')}
        >
          View Transactions
        </button>
        <button
          className={activeTab === 'record' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('record')}
        >
          Record Transaction
        </button>
      </div>

      {activeTab === 'record' && (
        <div className="transaction-form-container">
          <div className="type-selector">
            <button
              className={transactionType === 'stock_in' ? 'type-btn active' : 'type-btn'}
              onClick={() => setTransactionType('stock_in')}
            >
              <TrendingUp size={20} />
              Stock IN
            </button>
            <button
              className={transactionType === 'stock_out' ? 'type-btn active' : 'type-btn'}
              onClick={() => setTransactionType('stock_out')}
            >
              <TrendingDown size={20} />
              Stock OUT
            </button>
            <button
              className={transactionType === 'waste' ? 'type-btn active' : 'type-btn'}
              onClick={() => setTransactionType('waste')}
            >
              <Trash2 size={20} />
              Waste
            </button>
          </div>

          <form onSubmit={handleSubmit} className="transaction-form">
            <select
              value={formData.inventory_id}
              onChange={(e) => setFormData({ ...formData, inventory_id: e.target.value })}
              required
            >
              <option value="">Select Item</option>
              {inventory.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.item_name} (Current: {item.quantity} {item.unit})
                </option>
              ))}
            </select>

            <input
              type="number"
              step="0.01"
              placeholder="Quantity *"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />

            <input
              type="text"
              placeholder="Reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            />

            <input
              type="text"
              placeholder="Reference Number"
              value={formData.reference_no}
              onChange={(e) => setFormData({ ...formData, reference_no: e.target.value })}
            />

            <button type="submit" className="submit-transaction-btn">
              Record Transaction
            </button>
          </form>
        </div>
      )}

      {activeTab === 'view' && (
        <div className="transactions-list">
          {transactions.map((trans) => (
            <div key={trans.id} className={`transaction-card ${trans.transaction_type}`}>
              <div className="trans-header">
                <span className={`trans-type ${trans.transaction_type}`}>
                  {trans.transaction_type.replace('_', ' ').toUpperCase()}
                </span>
                <span className="trans-date">{trans.timestamp}</span>
              </div>
              <div className="trans-body">
                <p><strong>{trans.item_name}</strong></p>
                <p>Quantity: {trans.quantity}</p>
                <p>Before: {trans.previous_quantity} → After: {trans.new_quantity}</p>
                {trans.reason && <p>Reason: {trans.reason}</p>}
                {trans.is_flagged && (
                  <span className="flagged-badge">⚠️ Flagged</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Transactions;