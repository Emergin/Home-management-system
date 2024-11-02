// Sidebar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();

    const sidebarStyle = {
        width: '250px',
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '20px',
    };

    const buttonStyle = {
        width: '100%',
        padding: '10px',
        margin: '5px 0',
        backgroundColor: '#34495e',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    };

    return (
        <div style={sidebarStyle}>
            <h2>Dashboard</h2>
            <Link to="/shopping-list">
                <button style={buttonStyle}>Shopping List</button>
            </Link>
            <Link to="/tasks">
                <button style={buttonStyle}>Tasks</button>
            </Link>
            <Link to="/feedback">
                <button style={buttonStyle}>Feedback</button>
            </Link>
        </div>
    );
};

export default Sidebar;