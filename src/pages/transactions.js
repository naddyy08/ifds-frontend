// src/pages/Transactions.js
import React, { useState, useEffect } from 'react';
import {
  getAllInventory,
  getAllTransactions,
  stockIn,
  stockOut,
  recordWaste,
} from '../services/api';
import { TrendingUp, TrendingDown, Trash2, AlertTriangle, Shield } from 'lucide-react';
import './transactions.css';

const CATEGORIES = [
  'Flours & Baking Basics',
  'Nuts, Seeds & Dried Fruits',
  'Proteins',
  'Vegetables & Fruits',
  'Dairy & Chilled Fats',
  'Condiments, Spreads & Oils',
  'Beverages',
];

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [activeTab, setActiveTab] = useState('view');
  const [transactionType, setTransactionType] = useState('stock_in');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [itemSearch, setItemSearch] = useState('');
  const [formData, setFormData] = useState({
    inventory_id: '',
    quantity: '',
    reason: '',
    reference_no: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [transRes, invRes] = await Promise.all([
        getAllTransactions(),
        getAllInventory(),
      ]);
      setTransactions(transRes.data.transactions);
      setInventory(invRes.data.items);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter inventory by category AND item name search
  const filteredInventory = inventory.filter((item) => {
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    const matchesSearch = itemSearch
      ? item.item_name.toLowerCase().includes(itemSearch.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  const handleCategorySelect = (category) => {
    setSelectedCategory((prev) => (prev === category ? '' : category));
    setFormData((prev) => ({ ...prev, inventory_id: '' }));
  };

  const handleItemSearchChange = (e) => {
    setItemSearch(e.target.value);
    // Reset selected item when search changes
    setFormData((prev) => ({ ...prev, inventory_id: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;

      if (transactionType === 'stock_in') {
        response = await stockIn(formData);
      } else if (transactionType === 'stock_out') {
        response = await stockOut(formData);
      } else if (transactionType === 'waste') {
        response = await recordWaste(formData);
      }

      const data = response.data;

      if (data.fraud_warning) {
        const alertCount = data.fraud_warning.message;
        const mlDetected = data.fraud_warning.ml_detection?.detected;
        const riskScore = data.ai_analysis?.ml_risk_score || 0;

        let alertMessage = `⚠️ FRAUD ALERT!\n\n${alertCount}\n\n`;

        if (mlDetected) {
          alertMessage += `🤖 AI Risk Score: ${riskScore}/100\n`;
          alertMessage += `Risk Level: ${data.ai_analysis.risk_level.toUpperCase()}\n\n`;
        }

        if (data.fraud_warning.rule_based_alerts?.length > 0) {
          alertMessage += 'Detected Issues:\n';
          data.fraud_warning.rule_based_alerts.forEach((alert, index) => {
            alertMessage += `${index + 1}. ${alert.alert_type.replace(/_/g, ' ')}\n`;
          });
        }

        alertMessage += '\n⚠️ This transaction has been flagged for review.';
        alert(alertMessage);
      } else {
        alert('✅ Transaction recorded successfully!');
      }

      // Reset all fields
      setFormData({ inventory_id: '', quantity: '', reason: '', reference_no: '' });
      setSelectedCategory('');
      setItemSearch('');
      loadData();

    } catch (error) {
      console.error('Transaction error:', error);
      if (error.response?.data?.fraud_warning) {
        alert(`Transaction recorded but flagged: ${error.response.data.fraud_warning.message}`);
      } else {
        alert(error.response?.data?.error || 'Failed to record transaction');
      }
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="transactions-page">
      <div className="page-header">
        <h1>💰 Transactions</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>
          Record and monitor all inventory transactions with AI-powered fraud detection
        </p>
      </div>

      <div className="tabs">
        <button
          className={activeTab === 'view' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('view')}
        >
          📋 View Transactions
        </button>
        <button
          className={activeTab === 'record' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('record')}
        >
          ➕ Record Transaction
        </button>
      </div>

      {activeTab === 'record' && (
        <div className="transaction-form-container">
          <div className="type-selector">
            <button
              className={transactionType === 'stock_in' ? 'type-btn active in' : 'type-btn in'}
              onClick={() => setTransactionType('stock_in')}
            >
              <TrendingUp size={20} /> Stock IN
            </button>
            <button
              className={transactionType === 'stock_out' ? 'type-btn active out' : 'type-btn out'}
              onClick={() => setTransactionType('stock_out')}
            >
              <TrendingDown size={20} /> Stock OUT
            </button>
            <button
              className={transactionType === 'waste' ? 'type-btn active waste' : 'type-btn waste'}
              onClick={() => setTransactionType('waste')}
            >
              <Trash2 size={20} /> Waste
            </button>
          </div>

          {/* AI Protection Notice */}
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Shield size={20} color="#0284c7" />
            <span style={{ fontSize: '14px', color: '#0369a1' }}>
              🤖 AI fraud detection is active. Suspicious transactions will be automatically flagged.
            </span>
          </div>

          <form onSubmit={handleSubmit} className="transaction-form">

            {/* Step 1: Category Filter */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Item Category <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional — filter by category)</span>
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    disabled={loading}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      border: selectedCategory === cat ? '2px solid #667eea' : '2px solid #e5e7eb',
                      backgroundColor: selectedCategory === cat ? '#667eea' : '#ffffff',
                      color: selectedCategory === cat ? '#ffffff' : '#374151',
                      fontSize: '13px',
                      fontWeight: selectedCategory === cat ? '600' : '400',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Item Name Search */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Item Name <span style={{ color: '#9ca3af', fontWeight: 400 }}>(type to search)</span>
              </label>
              <input
                type="text"
                placeholder="Type item name to search..."
                value={itemSearch}
                onChange={handleItemSearchChange}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {(selectedCategory || itemSearch) && (
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  {filteredInventory.length} item{filteredInventory.length !== 1 ? 's' : ''} found
                  {selectedCategory && <> in <strong>{selectedCategory}</strong></>}
                  {itemSearch && <> matching "<strong>{itemSearch}</strong>"</>}
                  {' — '}
                  <span
                    style={{ color: '#667eea', cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => { setSelectedCategory(''); setItemSearch(''); setFormData(p => ({ ...p, inventory_id: '' })); }}
                  >
                    Clear all filters
                  </span>
                </p>
              )}
            </div>

            {/* Step 3: Select Item Dropdown (filtered) */}
            <select
              value={formData.inventory_id}
              onChange={(e) => setFormData({ ...formData, inventory_id: e.target.value })}
              required
              disabled={loading}
            >
              <option value="">
                {filteredInventory.length === 0
                  ? 'No items found — try different filters'
                  : `Select Item (${filteredInventory.length} available)`}
              </option>
              {filteredInventory.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.item_name} (Stock: {item.quantity} {item.unit})
                </option>
              ))}
            </select>

            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="Quantity *"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
              disabled={loading}
            />

            <input
              type="text"
              placeholder={transactionType === 'waste' ? 'Reason (Required for waste) *' : 'Reason'}
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required={transactionType === 'waste'}
              disabled={loading}
            />

            <input
              type="text"
              placeholder="Reference Number (Optional)"
              value={formData.reference_no}
              onChange={(e) => setFormData({ ...formData, reference_no: e.target.value })}
              disabled={loading}
            />

            <button
              type="submit"
              className="submit-transaction-btn"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Record Transaction'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'view' && (
        <div className="transactions-list">
          {loading ? (
            <div className="loading">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="no-transactions">
              <p>No transactions recorded yet.</p>
            </div>
          ) : (
            transactions.map((trans) => (
              <div key={trans.id} className={`transaction-card ${trans.transaction_type}`}>
                <div className="trans-header">
                  <div className="trans-header-left">
                    <span className={`trans-type ${trans.transaction_type}`}>
                      {trans.transaction_type === 'stock_in' && '📥 STOCK IN'}
                      {trans.transaction_type === 'stock_out' && '📤 STOCK OUT'}
                      {trans.transaction_type === 'waste' && '🗑️ WASTE'}
                    </span>
                    {trans.is_flagged && (
                      <div className="fraud-indicators">
                        <span className="flagged-badge">
                          <AlertTriangle size={14} /> FLAGGED
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="trans-date">
                    {new Date(trans.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="trans-body">
                  <div className="trans-main-info">
                    <p className="item-name"><strong>{trans.item_name}</strong></p>
                    <p className="quantity-info">
                      <span className="label">Quantity:</span>
                      <span className={`value ${trans.transaction_type}`}>
                        {trans.transaction_type === 'stock_in' ? '+' : '-'}
                        {trans.quantity} {trans.inventory_item?.unit || ''}
                      </span>
                    </p>
                    <p className="stock-change">
                      <span className="label">Stock:</span>
                      {trans.previous_quantity}
                      <span style={{ margin: '0 8px', color: '#9ca3af' }}>→</span>
                      {trans.new_quantity}
                    </p>
                  </div>
                  {trans.reason && (
                    <p className="trans-reason"><span className="label">Reason:</span> {trans.reason}</p>
                  )}
                  {trans.reference_no && (
                    <p className="trans-ref"><span className="label">Ref:</span> {trans.reference_no}</p>
                  )}
                  {trans.username && (
                    <p className="trans-user"><span className="label">By:</span> {trans.username}</p>
                  )}
                  {trans.is_flagged && (
                    <div style={{
                      marginTop: '12px', padding: '12px',
                      backgroundColor: '#fef2f2',
                      borderLeft: `4px solid ${getRiskColor(trans.ai_analysis?.risk_level || 'high')}`,
                      borderRadius: '6px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Shield size={16} color={getRiskColor(trans.ai_analysis?.risk_level || 'high')} />
                        <strong style={{ color: getRiskColor(trans.ai_analysis?.risk_level || 'high'), fontSize: '14px' }}>
                          AI Fraud Alert
                        </strong>
                        {trans.ai_analysis?.ml_risk_score !== undefined && (
                          <span style={{
                            marginLeft: 'auto', padding: '3px 10px',
                            backgroundColor: getRiskColor(trans.ai_analysis.risk_level),
                            color: 'white', borderRadius: '12px', fontSize: '11px', fontWeight: '700'
                          }}>
                            Risk: {trans.ai_analysis.ml_risk_score}/100
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '12px', color: '#991b1b', margin: '0 0 8px 0', lineHeight: '1.5' }}>
                        This transaction has been flagged for potential fraud. Review required by manager or administrator.
                      </p>
                      {trans.ai_analysis?.risk_level && (
                        <div style={{
                          display: 'inline-block', padding: '4px 8px',
                          backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '4px',
                          fontSize: '11px', fontWeight: '600',
                          color: getRiskColor(trans.ai_analysis.risk_level)
                        }}>
                          Risk Level: {trans.ai_analysis.risk_level.toUpperCase()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Transactions;