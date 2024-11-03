import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus, Save } from 'lucide-react';

const InventoryManager = () => {
  const [userId, setUserId] = useState(null);
  const [tools, setTools] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [newTool, setNewTool] = useState({
    name: '',
    category: '',
    quantity: '',
    location: '',
    condition: '',
    lastChecked: '',
    notes: ''
  });

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '20px auto',
      padding: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      paddingBottom: '10px',
      borderBottom: '2px solid #eef2f6',
    },
    title: {
      fontSize: '24px',
      color: '#2c3e50',
      fontWeight: 'bold',
    },
    addButton: {
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '6px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'background-color 0.3s',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px',
    },
    th: {
      backgroundColor: '#f8f9fa',
      padding: '12px',
      textAlign: 'left',
      fontSize: '14px',
      fontWeight: '600',
      color: '#2c3e50',
      borderBottom: '2px solid #eef2f6',
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #eef2f6',
      fontSize: '14px',
      color: '#34495e',
    },
    actionButton: {
      padding: '6px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginRight: '8px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    editButton: {
      backgroundColor: '#f39c12',
      color: 'white',
    },
    deleteButton: {
      backgroundColor: '#e74c3c',
      color: 'white',
    },
    form: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      marginBottom: '20px',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    input: {
      padding: '8px 12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
    },
    select: {
      padding: '8px 12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
    },
    saveButton: {
      backgroundColor: '#2ecc71',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '6px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    cancelButton: {
      backgroundColor: '#95a5a6',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '6px',
      cursor: 'pointer',
    },
    buttonGroup: {
      display: 'flex',
      gap: '10px',
      marginTop: '20px',
    },
    error: {
      padding: '12px',
      backgroundColor: '#ffebee',
      color: '#c62828',
      borderRadius: '4px',
      marginBottom: '20px',
    },
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      fetchTools(storedUserId);
    } else {
      setError('User ID not found. Please log in.');
    }
  }, []);

  const fetchTools = async (userId) => {
    try {
      if (!userId) throw new Error('User ID is missing');
      
      const response = await fetch(`http://localhost:5000/api/tools/${userId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch tools: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      setTools(data);
    } catch (err) {
      console.error('Error fetching tools:', err);
      setError('Failed to load tools inventory');
    }
  };
  

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingId(null);
  };

  const handleEdit = (tool) => {
    setEditingId(tool.id);
    setNewTool(tool);
    setIsAddingNew(false);
  };

  const handleSave = async () => {
    const userId = localStorage.getItem('userId'); // Retrieve user ID from local storage
    if (!userId) {
      setError('User ID not found. Please log in.');
      return;
    }
  
    try {
      let response;
  
      if (editingId) {
        // Update existing tool
        response = await fetch(`http://localhost:5000/api/tools/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newTool, userId }),
        });
      } else {
        // Add new tool
        response = await fetch(`http://localhost:5000/api/tools`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newTool, userId }),
        });
      }
  
      if (!response.ok) throw new Error(`Failed to ${editingId ? 'update' : 'add'} tool`);
  
      // Refresh tools list from backend after adding or updating
      fetchTools(userId);
      resetForm(); // Clear form fields and exit "Add New" or "Edit" mode
    } catch (err) {
      console.error('Error saving tool:', err);
      setError(err.message); // Display error if addition fails
    }
  };
  

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/tools/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete tool');
        fetchTools(userId);
      } catch (err) {
        setError('Failed to delete item');
      }
    }
  };

  const resetForm = () => {
    setNewTool({
      name: '',
      category: '',
      quantity: '',
      location: '',
      condition: '',
      lastChecked: '',
      notes: ''
    });
    setIsAddingNew(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTool(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Tools & Supplies Inventory</h1>
        <button style={styles.addButton} onClick={handleAddNew}>
          <Plus size={16} /> Add New Item
        </button>
      </div>

      {(isAddingNew || editingId) && (
        <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
          <div style={styles.formGroup}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={newTool.name}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label>Category</label>
            <select
              name="category"
              value={newTool.category}
              onChange={handleChange}
              style={styles.select}
              required
            >
              <option value="">Select Category</option>
              <option value="tools">Tools</option>
              <option value="office">Office Supplies</option>
              <option value="seasonal">Seasonal Items</option>
              <option value="batteries">Batteries</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={newTool.quantity}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={newTool.location}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label>Condition</label>
            <select
              name="condition"
              value={newTool.condition}
              onChange={handleChange}
              style={styles.select}
              required
            >
              <option value="">Select Condition</option>
              <option value="new">New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label>Last Checked</label>
            <input
              type="date"
              name="lastChecked"
              value={newTool.lastChecked}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label>Notes</label>
            <textarea
              name="notes"
              value={newTool.notes}
              onChange={handleChange}
              style={{...styles.input, minHeight: '100px'}}
            />
          </div>

          <div style={styles.buttonGroup}>
            <button style={styles.saveButton} onClick={handleSave}>
              <Save size={16} /> {editingId ? 'Update' : 'Save'}
            </button>
            <button style={styles.cancelButton} onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Category</th>
            <th style={styles.th}>Quantity</th>
            <th style={styles.th}>Location</th>
            <th style={styles.th}>Condition</th>
            <th style={styles.th}>Last Checked</th>
            <th style={styles.th}>Notes</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tools.map((tool) => (
            <tr key={tool.id}>
              <td style={styles.td}>{tool.name}</td>
              <td style={styles.td}>{tool.category}</td>
              <td style={styles.td}>{tool.quantity}</td>
              <td style={styles.td}>{tool.location}</td>
              <td style={styles.td}>{tool.condition}</td>
              <td style={styles.td}>{new Date(tool.lastChecked).toLocaleDateString()}</td>
              <td style={styles.td}>{tool.notes}</td>
              <td style={styles.td}>
                <button
                  onClick={() => handleEdit(tool)}
                  style={{...styles.actionButton, ...styles.editButton}}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(tool.id)}
                  style={{...styles.actionButton, ...styles.deleteButton}}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryManager;


