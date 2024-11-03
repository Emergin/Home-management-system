import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Calendar from './Calendar';
import ShoppingList from './ShoppingList';
import Tasks from './Tasks';
import Feedback from './Feedback';
import ExpenseTracker from './ExpenseTracker';

const Dashboard = () => {
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        console.log('Retrieved userId from localStorage:', storedUserId);
        
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            console.log('No userId found, redirecting to signin');
            navigate('/signin');
        }
    }, [navigate]);

    const dashboardStyle = {
        display: 'flex',
        height: '100vh',
    };

    const mainContentStyle = {
        flex: 1,
        padding: '20px',
        backgroundColor: '#f5f5f5',
        overflowY: 'auto',
    };

    if (!userId) {
        return <div>Loading...</div>;
    }

    return (
        <div style={dashboardStyle}>
            <Sidebar />
            <div style={mainContentStyle}>
                <Routes>
                    <Route path="/" element={<Calendar userId={userId} />} />
                    <Route 
                        path="/shopping-list" 
                        element={<ShoppingList userId={userId} />} 
                    />
                    <Route path="/tasks" element={<Tasks userId={userId} />} />
                    <Route path="/feedback" element={<Feedback userId={userId} />} />
                    <Route path="/ExpenseTracker" element={<ExpenseTracker userId={userId} />} />
                </Routes>
            </div>
        </div>
    );
};

export default Dashboard;