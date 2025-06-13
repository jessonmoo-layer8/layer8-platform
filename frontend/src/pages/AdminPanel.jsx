import React, { useEffect, useState } from 'react';

const AdminPanel = () => {
  const [models, setModels] = useState('');
  const fetchModels = () => {
    fetch('/api/admin/models')
      .then((res) => res.json())
      .then((data) => setModels(data.models.join(', ')));
  };
  useEffect(fetchModels, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const modelList = models.split(',').map((m) => m.trim()).filter(Boolean);
    fetch('/api/admin/models', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ models: modelList }),
    }).then(fetchModels);
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <form onSubmit={handleSubmit}>
        <label>Approved AI Models</label>
        <input
          type="text"
          value={models}
          onChange={(e) => setModels(e.target.value)}
          placeholder="gpt-4o, claude-3-opus"
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default AdminPanel;
