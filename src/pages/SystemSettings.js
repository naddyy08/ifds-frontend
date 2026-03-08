import React, { useEffect, useState } from 'react';
import { getSettings, updateSettings, exportBackup } from '../services/settingsApi';
import './admin.css';

function SystemSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await getSettings();
      setSettings(res.data);
      setError('');
    } catch (e) {
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      await updateSettings(settings);
      setSuccess('Settings updated!');
    } catch (e) {
      setError('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleBackup = async () => {
    setError('');
    setSuccess('');
    try {
      const res = await exportBackup();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ifds-backup.db');
      document.body.appendChild(link);
      link.click();
      link.remove();
      setSuccess('Backup downloaded!');
    } catch (e) {
      setError('Failed to export backup');
    }
  };

  if (loading) return <div className="admin-panel"><h2>Loading settings...</h2></div>;
  if (error) return <div className="admin-panel"><h2>Error</h2><p>{error}</p></div>;

  return (
    <div className="admin-panel">
      <h1>System Settings</h1>
      <form onSubmit={handleSave} className="user-form" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 24 }}>
        <div>
          <h3>Fraud Detection Thresholds</h3>
          <label>
            Waste Percent Threshold:
            <input
              type="number"
              min="0"
              max="100"
              value={settings.fraud_thresholds.waste_percent}
              onChange={e => handleChange('fraud_thresholds', 'waste_percent', Number(e.target.value))}
              style={{ marginLeft: 8 }}
            />
            %
          </label>
          <label style={{ marginLeft: 24 }}>
            High Risk Score:
            <input
              type="number"
              min="0"
              max="100"
              value={settings.fraud_thresholds.high_risk_score}
              onChange={e => handleChange('fraud_thresholds', 'high_risk_score', Number(e.target.value))}
              style={{ marginLeft: 8 }}
            />
          </label>
        </div>
        <div>
          <h3>Notification Preferences</h3>
          <label>
            <input
              type="checkbox"
              checked={settings.notification.email_enabled}
              onChange={e => handleChange('notification', 'email_enabled', e.target.checked)}
            /> Email Notifications
          </label>
          <label style={{ marginLeft: 24 }}>
            <input
              type="checkbox"
              checked={settings.notification.sms_enabled}
              onChange={e => handleChange('notification', 'sms_enabled', e.target.checked)}
            /> SMS Notifications
          </label>
        </div>
        <div>
          <h3>Database Export Backup</h3>
          <button type="button" onClick={handleBackup} style={{ background: '#10b981', color: 'white', padding: '8px 18px', borderRadius: 4, border: 'none', fontWeight: 600 }}>
            Download Backup
          </button>
        </div>
        <div style={{ marginTop: 16 }}>
          <button type="submit" disabled={saving} style={{ background: '#667eea', color: 'white', padding: '8px 18px', borderRadius: 4, border: 'none', fontWeight: 600 }}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
        {success && <div style={{ color: '#10b981', marginTop: 8 }}>{success}</div>}
        {error && <div style={{ color: '#ef4444', marginTop: 8 }}>{error}</div>}
      </form>
    </div>
  );
}

export default SystemSettings;
