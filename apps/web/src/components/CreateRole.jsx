'use client';
import React, { useState } from 'react';

export default function CreateRole() {
  // ১. ইনপুট ডেটা ধরে রাখার জন্য স্টেট (State)
  const [formData, setFormData] = useState({
    role_name: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // ২. ফর্ম সাবমিট হ্যান্ডলার (API কল)
  const handleSubmit = async (e) => {
    e.preventDefault(); // পেজ রিলোড বন্ধ রাখা
    setLoading(true);
    setMessage('');

    try {
      // ব্যাকএন্ড API-তে POST রিকোয়েস্ট পাঠানো
      const response = await fetch('http://127.0.0.1:8000/api/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Role successfully created!');
        // ফর্ম ফিল্ড ফাঁকা করা
        setFormData({ role_name: '', description: '' });
      } else {
        setMessage('❌ Error: ' + (data.message || 'Failed to create role'));
      }
    } catch (error) {
      console.error('API Error:', error);
      setMessage('❌ Server connection failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '40px auto', padding: '25px', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.05)', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create New Role</h2>

      {message && (
        <div style={{ padding: '10px', marginBottom: '15px', borderRadius: '5px', backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da' }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Role Name Field */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold' }}>Role Name:</label><br />
          <input
            type="text"
            placeholder="e.g. Admin, Volunteer, Donor"
            value={formData.role_name}
            onChange={(e) => setFormData({ ...formData, role_name: e.target.value })}
            required
            style={{ width: '100%', padding: '10px', marginTop: '6px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Description Field */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold' }}>Description (Optional):</label><br />
          <textarea
            rows="4"
            placeholder="Write role responsibilities..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            style={{ width: '100%', padding: '10px', marginTop: '6px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '12px', backgroundColor: loading ? '#6c757d' : '#007bff', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' }}
        >
          {loading ? 'Creating...' : 'Create Role'}
        </button>
      </form>
    </div>
  );
}