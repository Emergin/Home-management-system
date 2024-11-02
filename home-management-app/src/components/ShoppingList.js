import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ShoppingList = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({
        itemName: '',
        quantity: '',
        purchaseDate: '',
        expirationDate: '',
        reminderDays: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Get userId from localStorage where it was stored during login
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        // Check if user is logged in
        if (!userId) {
            navigate('/login'); // Redirect to login if no userId is found
            return;
        }
        fetchItems();
    }, [userId, navigate]);

    const fetchItems = async () => {
        if (!userId) return;
        
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/shopping-items/${userId}`);
            setItems(response.data);
        } catch (error) {
            setError('Failed to fetch items. Please try again later.');
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            setError('Please login to add items');
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const itemData = {
                ...newItem,
                userId: userId
            };
            
            await axios.post('http://localhost:5000/api/shopping-items', itemData);
            await fetchItems(); // Refresh the list after adding
            
            // Clear the form
            setNewItem({
                itemName: '',
                quantity: '',
                purchaseDate: '',
                expirationDate: '',
                reminderDays: ''
            });
        } catch (error) {
            setError('Failed to add item. Please try again.');
            console.error('Error adding item:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteItem = async (id) => {
        if (!userId) return;

        setLoading(true);
        try {
            await axios.delete(`http://localhost:5000/api/shopping-items/${id}`);
            await fetchItems(); // Refresh the list after deleting
        } catch (error) {
            setError('Failed to delete item. Please try again.');
            console.error('Error deleting item:', error);
        } finally {
            setLoading(false);
        }
    };

    // Rest of your existing render code remains the same
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', margin: '20px' }}>
            <h2 style={{ color: '#333' }}>Shopping List</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Item Name"
                    value={newItem.itemName}
                    onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                    required
                    style={inputStyle}
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    required
                    style={inputStyle}
                />
                <input
                    type="date"
                    placeholder="Purchase Date"
                    value={newItem.purchaseDate}
                    onChange={(e) => setNewItem({ ...newItem, purchaseDate: e.target.value })}
                    required
                    style={inputStyle}
                />
                <input
                    type="date"
                    placeholder="Expiration Date"
                    value={newItem.expirationDate}
                    onChange={(e) => setNewItem({ ...newItem, expirationDate: e.target.value })}
                    style={inputStyle}
                />
                <input
                    type="number"
                    placeholder="Reminder Days"
                    value={newItem.reminderDays}
                    onChange={(e) => setNewItem({ ...newItem, reminderDays: e.target.value })}
                    style={inputStyle}
                />
                <button type="submit" style={buttonStyle} disabled={loading}>
                    {loading ? 'Adding...' : 'Add Item'}
                </button>
            </form>

            <h3 style={{ color: '#333' }}>Shopping List Table</h3>
            {loading ? (
                <p>Loading items...</p>
            ) : (
                <table style={tableStyle}>
                    <thead>
                        <tr style={headerRowStyle}>
                            <th style={headerCellStyle}>Item Name</th>
                            <th style={headerCellStyle}>Quantity</th>
                            <th style={headerCellStyle}>Purchase Date</th>
                            <th style={headerCellStyle}>Expiration Date</th>
                            <th style={headerCellStyle}>Reminder Days</th>
                            <th style={headerCellStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id} style={tableRowStyle}>
                                <td style={tableCellStyle}>{item.item_name}</td>
                                <td style={tableCellStyle}>{item.quantity}</td>
                                <td style={tableCellStyle}>{new Date(item.purchase_date).toLocaleDateString()}</td>
                                <td style={tableCellStyle}>
                                    {item.expiration_date ? new Date(item.expiration_date).toLocaleDateString() : 'N/A'}
                                </td>
                                <td style={tableCellStyle}>{item.reminder_days || 'N/A'}</td>
                                <td style={tableCellStyle}>
                                    <button onClick={() => deleteItem(item.id)} style={deleteButtonStyle}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>    
                </table>
            )}
        </div>
    );
};

// [Your existing styles remain the same]
// Styles
const inputStyle = {
    margin: '5px',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc'
};

const buttonStyle = {
    margin: '5px',
    padding: '10px 15px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px'
};

const headerRowStyle = {
    backgroundColor: '#f4f4f4',
    borderBottom: '2px solid #ddd'
};

const headerCellStyle = {
    padding: '10px',
    textAlign: 'left',
    fontWeight: 'bold'
};

const tableRowStyle = {
    borderBottom: '1px solid #ddd'
};

const tableCellStyle = {
    padding: '10px'
};

const deleteButtonStyle = {
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
};

// Your existing styles remain the same

export default ShoppingList;